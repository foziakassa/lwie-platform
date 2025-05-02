"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/post/image-uploader"
import { ArrowRight, Save, Briefcase } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  subcategory: z.string().optional(),
  price: z.string().min(1, {
    message: "Please enter a price.",
  }),
  images: z.array(z.string()).optional(),
})

// Service categories and subcategories
const serviceCategories = [
  {
    id: "education",
    name: "Education & Tutoring",
    subcategories: [
      { id: "primary", name: "Primary School" },
      { id: "secondary", name: "Secondary School" },
      { id: "university", name: "University & College" },
      { id: "language", name: "Language Learning" },
      { id: "test_prep", name: "Test Preparation" },
      { id: "professional", name: "Professional Certification" },
      { id: "music", name: "Music Lessons" },
      { id: "art", name: "Art & Craft Classes" },
      { id: "other_education", name: "Other Education Services" },
    ],
  },
  {
    id: "home_services",
    name: "Home Services",
    subcategories: [
      { id: "cleaning", name: "Cleaning Services" },
      { id: "plumbing", name: "Plumbing" },
      { id: "electrical", name: "Electrical Work" },
      { id: "carpentry", name: "Carpentry" },
      { id: "painting", name: "Painting" },
      { id: "gardening", name: "Gardening & Landscaping" },
      { id: "moving", name: "Moving & Packing" },
      { id: "appliance_repair", name: "Appliance Repair" },
      { id: "home_security", name: "Home Security" },
      { id: "other_home", name: "Other Home Services" },
    ],
  },
  {
    id: "tech_services",
    name: "Tech Services",
    subcategories: [
      { id: "web_development", name: "Web Development" },
      { id: "app_development", name: "App Development" },
      { id: "software_development", name: "Software Development" },
      { id: "it_support", name: "IT Support" },
      { id: "data_analysis", name: "Data Analysis" },
      { id: "digital_marketing", name: "Digital Marketing" },
      { id: "seo", name: "SEO Services" },
      { id: "computer_repair", name: "Computer Repair" },
      { id: "cybersecurity", name: "Cybersecurity" },
      { id: "other_tech", name: "Other Tech Services" },
    ],
  },
  {
    id: "creative_services",
    name: "Creative Services",
    subcategories: [
      { id: "graphic_design", name: "Graphic Design" },
      { id: "video_production", name: "Video Production" },
      { id: "photography", name: "Photography" },
      { id: "animation", name: "Animation" },
      { id: "illustration", name: "Illustration" },
      { id: "content_writing", name: "Content Writing" },
      { id: "translation", name: "Translation" },
      { id: "music_production", name: "Music Production" },
      { id: "voice_over", name: "Voice Over" },
      { id: "other_creative", name: "Other Creative Services" },
    ],
  },
  {
    id: "professional_services",
    name: "Professional Services",
    subcategories: [
      { id: "legal", name: "Legal Services" },
      { id: "accounting", name: "Accounting & Bookkeeping" },
      { id: "consulting", name: "Business Consulting" },
      { id: "hr_services", name: "HR Services" },
      { id: "financial_planning", name: "Financial Planning" },
      { id: "tax_preparation", name: "Tax Preparation" },
      { id: "notary", name: "Notary Services" },
      { id: "career_coaching", name: "Career Coaching" },
      { id: "other_professional", name: "Other Professional Services" },
    ],
  },
  {
    id: "health_wellness",
    name: "Health & Wellness",
    subcategories: [
      { id: "fitness", name: "Fitness Training" },
      { id: "yoga", name: "Yoga Instruction" },
      { id: "nutrition", name: "Nutrition Consulting" },
      { id: "massage", name: "Massage Therapy" },
      { id: "mental_health", name: "Mental Health Services" },
      { id: "physical_therapy", name: "Physical Therapy" },
      { id: "alternative_medicine", name: "Alternative Medicine" },
      { id: "other_health", name: "Other Health Services" },
    ],
  },
  {
    id: "events_entertainment",
    name: "Events & Entertainment",
    subcategories: [
      { id: "event_planning", name: "Event Planning" },
      { id: "dj_services", name: "DJ Services" },
      { id: "live_music", name: "Live Music" },
      { id: "catering", name: "Catering" },
      { id: "photography_events", name: "Event Photography" },
      { id: "videography", name: "Event Videography" },
      { id: "decoration", name: "Decoration Services" },
      { id: "mc_hosting", name: "MC & Hosting" },
      { id: "other_events", name: "Other Event Services" },
    ],
  },
  {
    id: "transportation",
    name: "Transportation",
    subcategories: [
      { id: "rideshare", name: "Rideshare Services" },
      { id: "delivery", name: "Delivery Services" },
      { id: "moving_services", name: "Moving Services" },
      { id: "airport_transfer", name: "Airport Transfers" },
      { id: "chauffeur", name: "Chauffeur Services" },
      { id: "other_transportation", name: "Other Transportation Services" },
    ],
  },
  {
    id: "beauty_personal",
    name: "Beauty & Personal Care",
    subcategories: [
      { id: "haircut_styling", name: "Haircut & Styling" },
      { id: "makeup", name: "Makeup Services" },
      { id: "nail_care", name: "Nail Care" },
      { id: "skincare", name: "Skincare Services" },
      { id: "spa_services", name: "Spa Services" },
      { id: "barber", name: "Barber Services" },
      { id: "other_beauty", name: "Other Beauty Services" },
    ],
  },
  {
    id: "childcare",
    name: "Childcare & Babysitting",
    subcategories: [
      { id: "babysitting", name: "Babysitting" },
      { id: "nanny", name: "Nanny Services" },
      { id: "daycare", name: "Daycare Services" },
      { id: "after_school", name: "After School Care" },
      { id: "other_childcare", name: "Other Childcare Services" },
    ],
  },
  {
    id: "pet_services",
    name: "Pet Services",
    subcategories: [
      { id: "pet_sitting", name: "Pet Sitting" },
      { id: "dog_walking", name: "Dog Walking" },
      { id: "pet_grooming", name: "Pet Grooming" },
      { id: "pet_training", name: "Pet Training" },
      { id: "veterinary", name: "Veterinary Services" },
      { id: "other_pet", name: "Other Pet Services" },
    ],
  },
  {
    id: "other_services",
    name: "Other Services",
    subcategories: [{ id: "general_services", name: "General Services" }],
  },
]

export default function ServiceBasicInfoForm() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [subcategories, setSubcategories] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)

    // Check for draft data
    const draftData = localStorage.getItem("serviceBasicInfoDraft")
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData)
        form.reset(parsedData)
        if (parsedData.images && parsedData.images.length > 0) {
          setImages(parsedData.images)
        }
        if (parsedData.category) {
          setSelectedCategory(parsedData.category)
          const category = serviceCategories.find((c) => c.id === parsedData.category)
          if (category) {
            setSubcategories(category.subcategories)
          }
        }
      } catch (error) {
        console.error("Error loading draft data:", error)
      }
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      price: "",
      images: [],
    },
  })

  // Update subcategories when category changes
  useEffect(() => {
    const category = form.watch("category")
    if (category) {
      setSelectedCategory(category)
      const foundCategory = serviceCategories.find((c) => c.id === category)
      if (foundCategory) {
        setSubcategories(foundCategory.subcategories)
      } else {
        setSubcategories([])
      }
      form.setValue("subcategory", "")
    }
  }, [form.watch("category")])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Include images in the form data
    values.images = images

    try {
      // Save to local storage for now
      localStorage.setItem("serviceBasicInfo", JSON.stringify(values))

      // Clear draft
      localStorage.removeItem("serviceBasicInfoDraft")

      // Show success toast
      toast({
        title: "Basic information saved",
        description: "Let's continue to the next step.",
        duration: 3000,
      })

      router.push("/post/service/details")
    } catch (error) {
      console.error("Error saving form data:", error)
      toast({
        title: "Error saving information",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveDraft = () => {
    const values = form.getValues()
    values.images = images
    localStorage.setItem("serviceBasicInfoDraft", JSON.stringify(values))
    toast({
      title: "Draft saved",
      description: "Your draft has been saved. You can continue later.",
      duration: 3000,
    })
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border p-8"
    >
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Briefcase className="h-6 w-6 mr-2 text-[#00796B]" />
          <h2 className="text-2xl font-bold text-[#00796B]">Service Information</h2>
        </div>
        <p className="text-gray-600">Tell us about the service you're offering</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Service Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Professional Web Development Services, Math Tutoring"
                    {...field}
                    className="text-base py-6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="py-2.5">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Subcategory <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCategory}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue
                          placeholder={selectedCategory ? "Select a subcategory" : "Select a category first"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id} className="py-2.5">
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Price (ETB) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter price in ETB" className="text-base py-6" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel className="text-base">Portfolio Images (Optional)</FormLabel>
                <FormControl>
                  <ImageUploader
                    images={images}
                    setImages={(newImages) => {
                      setImages(newImages)
                      field.onChange(newImages)
                    }}
                    maxImages={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post")}
              className="px-6 py-6 text-base"
            >
              Cancel
            </Button>
            <div className="space-x-3">
              <Button type="button" variant="outline" onClick={saveDraft} className="px-6 py-6 text-base">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-[#00796B] hover:bg-[#00695C] px-8 py-6 text-base shadow-md"
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
