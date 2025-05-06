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
import { ImageUploader } from "@/components/post/image-uploader"
import { Package, ArrowRight, Save, Smartphone, Car, Armchair, Shirt, Refrigerator } from "lucide-react"
import { motion } from "framer-motion"
import { itemCategories } from "@/lib/categories"

// Define form schema
const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  subcategory: z.string({ required_error: "Please select a subcategory." }),
  condition: z.string({ required_error: "Please select a condition." }),
  price: z.string().min(1, { message: "Please enter a price." }),
  images: z.array(z.string()).min(1, { message: "Please upload at least one image." }),
})

// Explicitly define form values type
type FormValues = z.infer<typeof formSchema>

interface BasicInfoFormProps {
  initialData?: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function BasicInfoForm({ initialData, onSaveDraft, onContinue, isLoading }: BasicInfoFormProps) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Initialize with initial data if provided
    if (initialData) {
      if (initialData.images) {
        setImages(initialData.images)
      }

      if (initialData.category) {
        setSelectedCategory(initialData.category)
        const foundCategory = itemCategories.find((c) => c.id === initialData.category)
        if (foundCategory) {
          setSubcategories(foundCategory.subcategories)
        }
      }
    }
  }, [initialData])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      condition: initialData?.condition || "",
      price: initialData?.price?.toString() || "",
      images: initialData?.images || [],
    },
  })

  // Update subcategories when category changes
  useEffect(() => {
    const category = form.watch("category")
    if (category) {
      setSelectedCategory(category)
      const foundCategory = itemCategories.find((c) => c.id === category)
      if (foundCategory) {
        setSubcategories(foundCategory.subcategories)
      } else {
        setSubcategories([])
      }
      form.setValue("subcategory", "")
    }
  }, [form.watch("category"), form])

  async function onSubmit(values: FormValues) {
    // Prepare data with images
    const dataToSave = {
      ...values,
      images: images.slice(0, 5),
    }

    onContinue(dataToSave)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    // Prepare draft data with images
    const dataToSave = {
      ...values,
      images: images.slice(0, 5),
    }

    onSaveDraft(dataToSave)
  }

  const conditions = ["Brand New", "Refurbished", "Used"]

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "electronics":
        return <Smartphone className="h-5 w-5" />
      case "vehicles":
        return <Car className="h-5 w-5" />
      case "furniture":
        return <Armchair className="h-5 w-5" />
      case "clothing":
        return <Shirt className="h-5 w-5" />
      case "home_appliances":
        return <Refrigerator className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#00A693]">Item Information</h2>
        <p className="text-gray-500 mt-2">Provide basic details about the item you're posting</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Samsung Galaxy S21 Ultra 5G, 128GB, Black"
                    {...field}
                    className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]"
                  />
                </FormControl>
                <FormDescription>Be specific with your title to help others find your item.</FormDescription>
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
                      <SelectTrigger className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {itemCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="py-3">
                          <div className="flex items-center">
                            {getCategoryIcon(category.id)}
                            <span className="ml-2">{category.name}</span>
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
                  <FormLabel className="text-base font-medium">
                    Subcategory <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCategory}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]">
                        <SelectValue
                          placeholder={selectedCategory ? "Select a subcategory" : "Select a category first"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id} className="py-3">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Condition <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition} className="py-3">
                          {condition}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Price (ETB) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price in ETB"
                      className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Set a fair price for your item. You can negotiate later.</FormDescription>
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
                <FormLabel className="text-base font-medium">
                  Images <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <ImageUploader
                    entityType="item"
                    initialImages={images}
                    onImagesUploaded={(newImages) => {
                      setImages(newImages)
                      field.onChange(newImages)
                    }}
                    maxImages={5}
                  />
                </FormControl>
                <FormDescription>
                  Upload clear images of your item from different angles. Maximum 5 images.
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
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}

export default BasicInfoForm
