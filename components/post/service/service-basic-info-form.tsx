"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SimplifiedImageUploader } from "@/components/post/simplified-image-uploader"
import { Briefcase, ArrowRight, Save } from "lucide-react"
import { motion } from "framer-motion"

// Define service categories with their subcategories
const serviceCategories = [
  { id: "business", name: "Business" },
  { id: "technology", name: "Technology" },
  { id: "creative", name: "Creative" },
  { id: "education", name: "Education" },
  { id: "health", name: "Health" },
  { id: "home", name: "Home" },
  { id: "events", name: "Events" },
  { id: "automotive", name: "Automotive" },
  { id: "legal", name: "Legal" },
  { id: "financial", name: "Financial" },
]

const subcategories = {
  business: ["Consulting", "Marketing", "Administrative", "Accounting", "HR Services"],
  technology: ["Web Development", "App Development", "IT Support", "Data Analysis", "Cloud Services"],
  creative: ["Graphic Design", "Photography", "Video Production", "Writing", "Music"],
  education: ["Tutoring", "Language Learning", "Test Preparation", "Skills Training", "Coaching"],
  health: ["Fitness Training", "Nutrition", "Therapy", "Wellness", "Medical Services"],
  home: ["Cleaning", "Repairs", "Gardening", "Interior Design", "Security"],
  events: ["Planning", "Catering", "Entertainment", "Photography", "Venue Services"],
  automotive: ["Repairs", "Detailing", "Towing", "Driving Lessons", "Rental"],
  legal: ["Consultation", "Document Preparation", "Representation", "Mediation", "Notary"],
  financial: ["Accounting", "Tax Preparation", "Financial Planning", "Bookkeeping", "Investment Advice"],
}

// Experience levels relevant to Ethiopia
const experienceLevels = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "experienced", label: "Experienced (3-5 years)" },
  { value: "expert", label: "Expert (5+ years)" },
  { value: "certified", label: "Certified Professional" },
  { value: "traditional", label: "Traditional Craftsperson" },
  { value: "self_taught", label: "Self-taught" },
]

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
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters.",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters.",
    }),
  experience: z.string({
    required_error: "Please select your experience level.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  subcity: z.string().min(2, {
    message: "Subcity/Area is required.",
  }),
  images: z.array(z.string()).optional().default([]),
})

interface ServiceBasicInfoFormProps {
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
  initialData?: any
}

export function ServiceBasicInfoForm({ onSaveDraft, onContinue, isLoading, initialData }: ServiceBasicInfoFormProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categorySubcategories, setCategorySubcategories] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      description: initialData?.description || "",
      experience: initialData?.experience || "",
      city: initialData?.city || "",
      subcity: initialData?.subcity || "",
      images: initialData?.images || [],
    },
  })

  useEffect(() => {
    // Set initial category and subcategories if available
    if (initialData?.category) {
      setSelectedCategory(initialData.category)
      setCategorySubcategories(subcategories[initialData.category as keyof typeof subcategories] || [])
    }
  }, [initialData])

  // Update subcategories when category changes
  useEffect(() => {
    const category = form.watch("category")
    if (category) {
      setSelectedCategory(category)
      setCategorySubcategories(subcategories[category as keyof typeof subcategories] || [])
      form.setValue("subcategory", "")
    }
  }, [form.watch("category"), form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Call the onContinue callback with the form data
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    onSaveDraft(values)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#00A693]">Service Information</h2>
        <p className="text-gray-500 mt-2">Provide details about the service you're offering</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Service Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Professional Web Development Services"
                    {...field}
                    className="text-base py-6 border-gray-300"
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
                  <FormLabel className="text-base font-medium">
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6 border-gray-300">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="py-3">
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 mr-2" />
                            <span>{category.name}</span>
                          </div>
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
                  <FormLabel className="text-base font-medium">Subcategory</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedCategory || categorySubcategories.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="text-base py-6 border-gray-300">
                        <SelectValue
                          placeholder={
                            !selectedCategory
                              ? "Select a category first"
                              : categorySubcategories.length === 0
                                ? "No subcategories available"
                                : "Select a subcategory"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorySubcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory} className="py-3">
                          {subcategory}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your service in detail..."
                    className="min-h-[150px] text-base border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include what you offer, your experience, and why clients should choose your service.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Experience Level <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base py-6 border-gray-300">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    City <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Addis Ababa" {...field} className="text-base py-6 border-gray-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Subcity/Area <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Bole, Kirkos, etc."
                      {...field}
                      className="text-base py-6 border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel className="text-base font-medium">Images</FormLabel>
                <FormControl>
                  <SimplifiedImageUploader value={field.value} onChange={field.onChange} maxImages={5} />
                </FormControl>
                <FormDescription>
                  Upload images that showcase your service. This helps potential clients understand what you offer.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/selection")}
              className="px-6 py-6 text-base border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <div className="space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="px-6 py-6 text-base border-[#00A693] text-[#00A693] hover:bg-[#00A693]/10"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-[#00A693] hover:bg-[#008F7F] px-8 py-6 text-base shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
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
                    Submit
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
