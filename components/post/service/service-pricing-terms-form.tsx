"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, ArrowLeft, DollarSign, Save, Tag } from 'lucide-react'
import { createBrowserClient } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  pricingType: z.string({
    required_error: "Please select a pricing type.",
  }),
  price: z.string().optional(),
  serviceDuration: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  openToSwapping: z.boolean(),
})

export default function ServicePricingTermsForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previousSteps, setPreviousSteps] = useState<{
    basicInfo: any
    serviceDetails: any
    locationDescription: any
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Load previous steps from local storage
    const savedBasicInfo = localStorage.getItem("serviceBasicInfo")
    const savedServiceDetails = localStorage.getItem("serviceDetails")
    const savedLocationDescription = localStorage.getItem("serviceLocationDescription")

    if (!savedBasicInfo || !savedServiceDetails || !savedLocationDescription) {
      // If any step is missing, redirect to the appropriate page
      if (!savedBasicInfo) {
        router.push("/post/service/basic-info")
      } else if (!savedServiceDetails) {
        router.push("/post/service/details")
      } else if (!savedLocationDescription) {
        router.push("/post/service/location-description")
      }
      return
    }

    setPreviousSteps({
      basicInfo: JSON.parse(savedBasicInfo),
      serviceDetails: JSON.parse(savedServiceDetails),
      locationDescription: JSON.parse(savedLocationDescription),
    })

    // Check for draft data
    const draftData = localStorage.getItem("servicePricingTermsDraft")
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData)
        setTimeout(() => {
          form.reset(parsedData)
        }, 100)
      } catch (error) {
        console.error("Error loading draft data:", error)
      }
    }

    setLoading(false)
  }, [router])

  const form = useForm<{
    pricingType: string
    price?: string
    serviceDuration?: string
    cancellationPolicy?: string
    openToSwapping: boolean
  }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricingType: "",
      price: "",
      serviceDuration: "",
      cancellationPolicy: "",
      openToSwapping: false,
    },
  })

  const pricingTypes = ["Hourly Rate", "Fixed Price", "Project-Based", "Free", "Negotiable"]
  const durations = ["30 minutes", "1 hour", "2 hours", "Half day", "Full day", "Multiple days", "Varies"]
  const cancellationPolicies = [
    "24 hours notice required",
    "48 hours notice required",
    "1 week notice required",
    "Flexible",
    "No cancellations",
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!previousSteps) return

    setIsSubmitting(true)

    try {
      // Combine all form data
      const postData = {
        ...previousSteps.basicInfo,
        ...previousSteps.serviceDetails,
        ...previousSteps.locationDescription,
        ...values,
        type: "service",
        created_at: new Date().toISOString(),
      }

      // Create a temporary user if not exists
      const supabase = createBrowserClient()

      // Generate a random email if user is not logged in
      const randomEmail = `user_${Math.random().toString(36).substring(2, 15)}@example.com`

      // Insert into users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .upsert([{ email: randomEmail }])
        .select()

      if (userError) {
        console.error("Error creating user:", userError)
        throw new Error("Failed to create user")
      }

      const userId = userData?.[0]?.id

      // Insert into posts table
      const { data: postResult, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            user_id: userId,
            type: "service",
            title: postData.title,
            category: postData.category,
            subcategory: postData.subcategory,
            description: postData.description,
            location: postData.location,
            hide_address: false,
          },
        ])
        .select()

      if (postError) {
        console.error("Error creating post:", postError)
        throw new Error("Failed to create post")
      }

      const postId = postResult?.[0]?.id

      // Insert service details
      if (postId) {
        await supabase.from("service_details").insert([
          {
            post_id: postId,
            years_experience: postData.yearsExperience,
            certifications: postData.certifications,
            skills: postData.skills,
            available_days: postData.availableDays,
            start_time: postData.startTime,
            end_time: postData.endTime,
            service_location_type: postData.serviceLocationType,
            pricing_type: postData.pricingType,
            price: postData.price,
            service_duration: postData.serviceDuration,
            cancellation_policy: postData.cancellationPolicy,
          },
        ])

        // Insert trade preferences
        await supabase.from("trade_preferences").insert([
          {
            post_id: postId,
            accept_fair_trades: postData.openToSwapping,
            accept_cash_offers: true,
          },
        ])

        // Insert images
        if (postData.images && postData.images.length > 0) {
          const imageInserts = postData.images.map((imageUrl: string, index: number) => ({
            post_id: postId,
            image_url: imageUrl,
            position: index,
          }))

          await supabase.from("post_images").insert(imageInserts)
        }
      }

      // Clear local storage
      localStorage.removeItem("serviceBasicInfo")
      localStorage.removeItem("serviceDetails")
      localStorage.removeItem("serviceLocationDescription")
      localStorage.removeItem("serviceBasicInfoDraft")
      localStorage.removeItem("serviceDetailsDraft")
      localStorage.removeItem("serviceLocationDescriptionDraft")
      localStorage.removeItem("servicePricingTermsDraft")

      // Show success toast
      toast({
        title: "Service posted successfully!",
        description: "Your service has been posted. Redirecting to success page...",
        duration: 3000,
      })

      // Redirect to success page
      router.push("/post/success")
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: "Error submitting post",
        description: "There was a problem submitting your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveDraft = () => {
    const values = form.getValues()
    localStorage.setItem("servicePricingTermsDraft", JSON.stringify(values))
    toast({
      title: "Draft saved",
      description: "Your pricing and terms draft has been saved. You can continue later.",
      duration: 3000,
    })
  }

  if (!mounted) return null

  if (loading || !previousSteps) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border p-8"
    >
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Tag className="h-6 w-6 mr-2 text-blue-600" />
          <h2 className="text-3xl font-bold">Pricing & Terms</h2>
        </div>
        <p className="text-gray-600">Set your pricing and terms for this service</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-semibold">Pricing Details</h3>
              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                How much you charge
              </Badge>
            </div>

            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Pricing Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pricingTypes.map((type) => (
                        <SelectItem key={type} value={type} className="py-2.5">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose how you want to charge for your service</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Price (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="e.g., 25.00"
                        type="number"
                        step="0.01"
                        min="0"
                        className="pl-10 text-base py-6"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Leave blank if negotiable or free</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="serviceDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Service Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base py-6">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durations.map((duration) => (
                          <SelectItem key={duration} value={duration} className="py-2.5">
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>How long your service typically takes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cancellationPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Cancellation Policy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base py-6">
                          <SelectValue placeholder="Select policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cancellationPolicies.map((policy) => (
                          <SelectItem key={policy} value={policy} className="py-2.5">
                            {policy}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Your policy for cancellations</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-semibold">Trade Options</h3>
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                Alternative payment
              </Badge>
            </div>

            <Card className={`border-2 transition-colors duration-300 ${form.watch("openToSwapping") ? "border-blue-500 bg-blue-50/30" : "border-gray-200"}`}>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="openToSwapping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={field.value ? "text-blue-600 border-blue-600" : ""}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base font-medium">I'm open to swapping my service for items or other services</FormLabel>
                        <FormDescription>
                          Check this if you're willing to consider trades or exchanges instead of monetary payment
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex">
                  <AlertTriangle className="text-amber-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 mb-2">Pricing Tips</h3>
                    <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
                      <li>Consider your experience level when setting prices</li>
                      <li>Research what competitors charge for similar services</li>
                      <li>Be clear about what's included in your price</li>
                      <li>Don't undervalue your time and expertise</li>
                      <li>Consider offering package deals for recurring clients</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-50 border-gray-200 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Review Your Post</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Title</h4>
                  <p className="font-medium">{previousSteps.basicInfo.title}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Category</h4>
                    <p>
                      {previousSteps.basicInfo.category}{" "}
                      {previousSteps.basicInfo.subcategory ? `/ ${previousSteps.basicInfo.subcategory}` : ""}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Experience</h4>
                    <p>{previousSteps.serviceDetails.yearsExperience}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Location</h4>
                  <p>{previousSteps.locationDescription.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Description</h4>
                  <p className="text-sm line-clamp-3">{previousSteps.locationDescription.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Pricing</h4>
                  <p>
                    {form.watch("pricingType")}
                    {form.watch("price") ? ` - $${form.watch("price")}` : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-8 border-t mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/service/location-description")}
              className="px-6 py-6 text-base flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Step
            </Button>
            <div className="space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                className="px-6 py-6 text-base flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-6 text-base shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>Submit Post</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}
