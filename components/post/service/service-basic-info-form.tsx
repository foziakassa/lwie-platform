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
import { Briefcase, ArrowRight, Save } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { fetchCategories } from "@/lib/api-client"

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
  images: z.array(z.string()).min(1, {
    message: "Please upload at least one image.",
  }),
})

interface ServiceBasicInfoFormProps {
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
  initialData?: any
}

export function ServiceBasicInfoForm({ onSaveDraft, onContinue, isLoading, initialData }: ServiceBasicInfoFormProps) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      images: initialData?.images?.map((img: any) => img.url) || [],
    },
  })

  useEffect(() => {
    // Load categories from API
    const loadCategories = async () => {
      try {
        const data = await fetchCategories("service")
        setCategories(data.categories || [])
      } catch (error) {
        console.error("Error loading categories:", error)
        toast({
          title: "Error loading categories",
          description: "There was a problem loading categories. Please try again.",
          variant: "destructive",
        })
      }
    }

    // Load initial images if available
    if (initialData?.images && initialData.images.length > 0) {
      setImages(initialData.images.map((img: any) => img.url))
    }

    loadCategories()
  }, [initialData])

  // Update subcategories when category changes
  useEffect(() => {
    const category = form.watch("category")
    if (category) {
      const selectedCategory = categories.find((c) => c.id.toString() === category)
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories)
      } else {
        setSubcategories([])
      }
      form.setValue("subcategory", "")
    }
  }, [form.watch("category"), categories, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Include images in the form data
    values.images = images

    // Call the onContinue callback with the form data
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    values.images = images
    onSaveDraft(values)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6"
    >
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
                    placeholder="e.g., Professional Web Development Services"
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
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()} className="py-3">
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
                  <FormLabel className="text-base">Subcategory</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={subcategories.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue
                          placeholder={subcategories.length > 0 ? "Select a subcategory" : "Select a category first"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id.toString()} className="py-3">
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
            name="images"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel className="text-base">
                  Images <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <ImageUploader
                    entityType="service"
                    initialImages={images}
                    onImagesUploaded={(newImages) => {
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
              <Button type="button" variant="outline" onClick={handleSaveDraft} className="px-6 py-6 text-base">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-base shadow-md"
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

export default ServiceBasicInfoForm
