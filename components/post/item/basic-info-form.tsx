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
import { Package, ArrowRight, Save, Smartphone, Car, Armchair, Shirt, Refrigerator } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
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
  images: z.array(z.string()).optional(),
})

// Explicitly define form values type
type FormValues = z.infer<typeof formSchema>

export default function BasicInfoForm() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load draft data
    const draftData = localStorage.getItem("itemBasicInfoDraft")
    const draftImages = localStorage.getItem("itemImagesDraft")
    if (draftData) {
      try {
        const parsedData: FormValues = JSON.parse(draftData)
        form.reset(parsedData)
        if (draftImages) {
          const parsedImages = JSON.parse(draftImages) as string[]
          setImages(parsedImages)
        }
      } catch (error) {
        console.error("Error loading draft data:", error)
      }
    }
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      condition: "",
      price: "",
      images: [],
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
  }, [form.watch("category")])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    // Prepare data without images to avoid quota issues
    const { images: _, ...dataToSave } = values
    // dataToSave.images = [] // Ensure schema compatibility

    try {
      // Save form data (without images) to localStorage
      localStorage.setItem("itemBasicInfo", JSON.stringify(dataToSave))

      // Save images separately
      localStorage.setItem("itemImages", JSON.stringify(images.slice(0, 5)))

      // Clear draft data
      localStorage.removeItem("itemBasicInfoDraft")
      localStorage.removeItem("itemImagesDraft")

      // Show success toast
      toast({
        title: "Basic information saved",
        description: "Let's continue to the next step.",
        duration: 3000,
      })

      router.push("/post/item/specifications")
    } catch (error: any) {
      console.error("Error saving form data:", error)
      toast({
        title: "Error saving information",
        description:
          error.name === "QuotaExceededError"
            ? "Storage limit exceeded. Try uploading fewer or smaller images."
            : "There was a problem saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveDraft = () => {
    const values = form.getValues();
    try {
      // Prepare draft data without images to avoid serialization issues
      const { images: _, ...dataToSave } = values;
      localStorage.setItem("itemBasicInfoDraft", JSON.stringify(dataToSave));
      localStorage.setItem("itemImagesDraft", JSON.stringify(images.slice(0, 5)));
      toast({
        title: "Draft saved",
        description: "Your draft has been saved. You can continue later.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error saving draft",
        description:
          error.name === "QuotaExceededError"
            ? "Storage limit exceeded. Try using fewer or smaller images."
            : "There was a problem saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      className="bg-white rounded-xl shadow-lg border p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#00796B]">Basic Information</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Samsung Galaxy S21 Ultra 5G, 128GB, Black"
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
                  <FormLabel className="text-base">
                    Condition <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
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
                className="bg-[#00796B] hover:bg-[#00695C] px-8 py-6 text-base shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
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
                      />
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