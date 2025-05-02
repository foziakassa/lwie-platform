"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageUploader } from "@/components/post/image-uploader"
import { LocationFormFields } from "@/components/post/shared/location-form"
import { ActionButtons } from "@/components/post/shared/action-buttons"
import { toast } from "@/components/ui/use-toast"
import { savePost, saveDraft, getDraft, clearDraft } from "@/lib/post-storage"
import {
  Briefcase,
  Wrench,
  Scissors,
  Utensils,
  Truck,
  Paintbrush,
  Laptop,
  Stethoscope,
  GraduationCap,
  Home,
  Check,
} from "lucide-react"

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  experience: z.string().min(1, "Experience level is required"),
  city: z.string().min(1, "City is required"),
  subcity: z.string().min(1, "Subcity is required"),
  serviceLocationType: z.string().default("flexible"),
  pricing: z.string().min(1, "Pricing is required"),
  pricingType: z.string().default("fixed"),
  terms: z.string().optional(),
})

export default function PostServicePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize form with zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      description: "",
      experience: "",
      city: "",
      subcity: "",
      serviceLocationType: "flexible",
      pricing: "",
      pricingType: "fixed",
      terms: "",
    },
  })

  useEffect(() => {
    setMounted(true)

    // Load draft data if available
    const draftData = getDraft("service")
    if (draftData) {
      form.reset(draftData)
      if (draftData.images && draftData.images.length > 0) {
        setImages(draftData.images)
      }
    }
  }, [form])

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    saveDraft("service", { ...values, images })
    toast({
      title: "Draft saved",
      description: "Your service draft has been saved. You can continue later.",
      duration: 3000,
    })
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Create post object
      const post = {
        id: `SERVICE-${Date.now()}`,
        type: "service" as const,
        data: {
          ...values,
          images,
        },
        createdAt: new Date().toISOString(),
      }

      // Save post to storage
      savePost(post)

      // Clear draft
      clearDraft("service")

      // Show success toast
      toast({
        title: "Success!",
        description: "Your service has been posted successfully.",
        duration: 3000,
      })

      // Redirect to success page
      router.push("/post/success")
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your post. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const categories = [
    { id: "professional", name: "Professional", icon: <Briefcase className="h-5 w-5" /> },
    { id: "repair", name: "Repair & Maintenance", icon: <Wrench className="h-5 w-5" /> },
    { id: "beauty", name: "Beauty & Wellness", icon: <Scissors className="h-5 w-5" /> },
    { id: "food", name: "Food & Catering", icon: <Utensils className="h-5 w-5" /> },
    { id: "transport", name: "Transport & Delivery", icon: <Truck className="h-5 w-5" /> },
    { id: "creative", name: "Creative & Design", icon: <Paintbrush className="h-5 w-5" /> },
    { id: "tech", name: "Tech & IT", icon: <Laptop className="h-5 w-5" /> },
    { id: "health", name: "Health & Medical", icon: <Stethoscope className="h-5 w-5" /> },
    { id: "education", name: "Education & Training", icon: <GraduationCap className="h-5 w-5" /> },
    { id: "home", name: "Home Services", icon: <Home className="h-5 w-5" /> },
  ]

  const subcategories: Record<string, string[]> = {
    professional: ["Accounting", "Legal", "Consulting", "Business Services", "Other Professional"],
    repair: ["Electronics Repair", "Appliance Repair", "Vehicle Repair", "Home Repair", "Other Repair"],
    beauty: ["Hair Styling", "Makeup", "Nail Care", "Spa Services", "Other Beauty"],
    food: ["Catering", "Personal Chef", "Baking", "Food Delivery", "Other Food"],
    transport: ["Ride Service", "Delivery", "Moving", "Courier", "Other Transport"],
    creative: ["Graphic Design", "Photography", "Video Production", "Art & Crafts", "Other Creative"],
    tech: ["Web Development", "App Development", "IT Support", "Digital Marketing", "Other Tech"],
    health: ["Medical Consultation", "Therapy", "Fitness Training", "Nutrition", "Other Health"],
    education: ["Tutoring", "Language Learning", "Skills Training", "Coaching", "Other Education"],
    home: ["Cleaning", "Gardening", "Interior Design", "Security", "Other Home"],
  }

  const experienceLevels = [
    "Beginner (0-1 years)",
    "Intermediate (1-3 years)",
    "Experienced (3-5 years)",
    "Advanced (5-10 years)",
    "Expert (10+ years)",
  ]

  if (!mounted) return null

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#00796B]">Post a Service</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Service Details</TabsTrigger>
                  <TabsTrigger value="location">Location & Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Service Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter service title" className="text-base py-6" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Category <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {categories.map((category) => (
                              <Button
                                key={category.id}
                                type="button"
                                variant={field.value === category.id ? "default" : "outline"}
                                className={`flex items-center justify-start gap-2 h-auto py-3 px-4 ${
                                  field.value === category.id ? "bg-[#00796B] text-white" : ""
                                }`}
                                onClick={() => {
                                  field.onChange(category.id)
                                  form.setValue("subcategory", "")
                                }}
                              >
                                {category.icon}
                                <span>{category.name}</span>
                                {field.value === category.id && <Check className="h-4 w-4 ml-auto" />}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("category") && (
                      <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Subcategory <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-base py-6">
                                  <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subcategories[form.watch("category")]?.map((sub) => (
                                  <SelectItem key={sub} value={sub} className="py-3">
                                    {sub}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div>
                      <FormLabel className="text-base">Upload Images (Optional)</FormLabel>
                      <div className="mt-2">
                        <ImageUploader images={images} setImages={handleImagesChange} maxImages={5} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Service Description <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your service in detail"
                              className="min-h-[150px] text-base"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Experience Level <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-base py-6">
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level} value={level} className="py-3">
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                  <LocationFormFields form={form} type="service" />

                  <FormField
                    control={form.control}
                    name="serviceLocationType"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel className="text-base">
                          Service Location Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                          >
                            <div
                              className={`flex items-center space-x-2 rounded-md border p-3 ${field.value === "at_my_location" ? "border-[#00796B] bg-[#E0F2F1]/30" : ""}`}
                            >
                              <RadioGroupItem value="at_my_location" id="at_my_location" />
                              <FormLabel htmlFor="at_my_location" className="flex-1 cursor-pointer">
                                At my location
                              </FormLabel>
                            </div>
                            <div
                              className={`flex items-center space-x-2 rounded-md border p-3 ${field.value === "at_clients_location" ? "border-[#00796B] bg-[#E0F2F1]/30" : ""}`}
                            >
                              <RadioGroupItem value="at_clients_location" id="at_clients_location" />
                              <FormLabel htmlFor="at_clients_location" className="flex-1 cursor-pointer">
                                At client's location
                              </FormLabel>
                            </div>
                            <div
                              className={`flex items-center space-x-2 rounded-md border p-3 ${field.value === "remote" ? "border-[#00796B] bg-[#E0F2F1]/30" : ""}`}
                            >
                              <RadioGroupItem value="remote" id="remote" />
                              <FormLabel htmlFor="remote" className="flex-1 cursor-pointer">
                                Remote (online)
                              </FormLabel>
                            </div>
                            <div
                              className={`flex items-center space-x-2 rounded-md border p-3 ${field.value === "flexible" ? "border-[#00796B] bg-[#E0F2F1]/30" : ""}`}
                            >
                              <RadioGroupItem value="flexible" id="flexible" />
                              <FormLabel htmlFor="flexible" className="flex-1 cursor-pointer">
                                Flexible (can be discussed)
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pricingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Pricing Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-base py-6">
                                <SelectValue placeholder="Select pricing type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fixed" className="py-3">
                                Fixed Price
                              </SelectItem>
                              <SelectItem value="hourly" className="py-3">
                                Hourly Rate
                              </SelectItem>
                              <SelectItem value="project" className="py-3">
                                Project-Based
                              </SelectItem>
                              <SelectItem value="negotiable" className="py-3">
                                Negotiable
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Pricing (ETB) <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`Enter ${form.watch("pricingType") === "hourly" ? "hourly rate" : "price"} in ETB`}
                              className="text-base py-6"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Terms & Conditions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter any terms or conditions for your service"
                            className="min-h-[100px] text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <ActionButtons
                isSubmitting={isSubmitting}
                isLastStep={activeTab === "location"}
                onBack={() => {
                  if (activeTab === "basic") {
                    router.push("/post/selection")
                  } else if (activeTab === "details") {
                    setActiveTab("basic")
                  } else {
                    setActiveTab("details")
                  }
                }}
                onSaveDraft={handleSaveDraft}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
