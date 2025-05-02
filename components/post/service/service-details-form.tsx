"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Save, ClipboardList } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  experience: z.string({
    required_error: "Please select your experience level.",
  }),
})

export default function ServiceDetailsForm() {
  const router = useRouter()
  const [basicInfo, setBasicInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Load basic info from local storage
    const savedInfo = localStorage.getItem("serviceBasicInfo")
    if (savedInfo) {
      setBasicInfo(JSON.parse(savedInfo))
    } else {
      // If no basic info, redirect back to basic info page
      router.push("/post/service/basic-info")
      return
    }

    // Check for draft data
    const draftData = localStorage.getItem("serviceDetailsDraft")
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      experience: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Save to local storage for now
      localStorage.setItem("serviceDetails", JSON.stringify(values))

      // Clear draft
      localStorage.removeItem("serviceDetailsDraft")

      // Show success toast
      toast({
        title: "Service details saved",
        description: "Let's continue to the next step.",
        duration: 3000,
      })

      router.push("/post/service/location-description")
    } catch (error) {
      console.error("Error saving form data:", error)
      toast({
        title: "Error saving details",
        description: "There was a problem saving your details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveDraft = () => {
    const values = form.getValues()
    localStorage.setItem("serviceDetailsDraft", JSON.stringify(values))
    toast({
      title: "Draft saved",
      description: "Your details draft has been saved. You can continue later.",
      duration: 3000,
    })
  }

  const experienceLevels = [
    "Beginner (0-1 years)",
    "Intermediate (1-3 years)",
    "Experienced (3-5 years)",
    "Advanced (5-10 years)",
    "Expert (10+ years)",
  ]

  if (!mounted) return null

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00796B]"></div>
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
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <ClipboardList className="h-6 w-6 mr-2 text-[#00796B]" />
          <h2 className="text-3xl font-bold text-[#00796B]">Service Details</h2>
        </div>
        <p className="text-gray-600">Provide more information about your service</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="Describe your service in detail. Include what you offer, your approach, and why clients should choose you."
                    className="min-h-[150px] text-base"
                    {...field}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base py-6">
                      <SelectValue placeholder="Select your experience level" />
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

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/service/basic-info")}
              className="px-6 py-6 text-base flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
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
                className="bg-[#00796B] hover:bg-[#00695C] px-8 py-6 text-base shadow-md flex items-center"
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
                    Saving...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}
