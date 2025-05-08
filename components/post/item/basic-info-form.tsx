"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SimplifiedImageUploader } from "../simplified-image-uploader"
import { saveDraft, getDraft } from "@/lib/post-storage"
import { ActionButtons } from "../shared/action-buttons"
import { uploadItemImages, createItem } from "@/lib/api-client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getCurrentUser } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import {
  itemCategories,
  getSubcategories,
  getSpecifications,
  type SubcategoryOption,
  getSpecificationOptions,
} from "@/lib/category-data"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().optional(), // Description is optional
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  subcategory: z.string().min(1, {
    message: "Please select a subcategory.",
  }),
  condition: z.string().min(1, {
    message: "Please select a condition.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a number.",
  }),
  city: z.string().min(1, {
    message: "Please enter your city.",
  }),
  subcity: z.string().optional(),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  preferredContactMethod: z.enum(["phone", "email"], {
    required_error: "Please select a preferred contact method.",
  }),
})

export function BasicInfoForm() {
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([])
  const [specifications, setSpecifications] = useState<string[]>([])
  const [userData, setUserData] = useState<{
    firstname?: string
    lastname?: string
    email?: string
    phone?: string
  } | null>(null)
  const [specificationValues, setSpecificationValues] = useState<Record<string, string>>({})
  const [specificationOptions, setSpecificationOptions] = useState<Record<string, string[]>>({})

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      condition: "",
      price: "",
      city: "",
      subcity: "",
      phone: "",
      email: "",
      preferredContactMethod: "phone",
    },
  })

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const user = await getCurrentUser()
      if (user) {
        setUserData({
          firstname: (user as any).firstname ?? "",
          lastname: (user as any).lastname ?? "",
          email: user.email,
          phone: user.phone,
        })

        // Pre-fill the form with user data
        form.setValue("email", user.email)
        if (user.phone) {
          form.setValue("phone", user.phone)
        }
      }
    }

    loadUserData()
  }, [form])

  // Load draft data if available
  useEffect(() => {
    const draftData = getDraft("item")
    if (draftData) {
      form.reset({
        title: draftData.title || "",
        description: draftData.description || "",
        category: draftData.category || "",
        subcategory: draftData.subcategory || "",
        condition: draftData.condition || "",
        price: draftData.price ? String(draftData.price) : "",
        city: draftData.city || "",
        subcity: draftData.subcity || "",
        phone: draftData.contact_info?.phone || "",
        email: draftData.contact_info?.email || "",
        preferredContactMethod: (draftData.contact_info?.preferred_contact_method as "phone" | "email") || "phone",
      })

      if (draftData.images && draftData.images.length > 0) {
        setUploadedImageUrls(draftData.images)
      }

      // Load subcategories based on selected category
      if (draftData.category) {
        const subs = getSubcategories(draftData.category, "item")
        setSubcategories(subs)

        // Load specifications based on selected subcategory
        if (draftData.subcategory) {
          const specs = getSpecifications(draftData.category, draftData.subcategory)
          setSpecifications(specs)

          // Load specification values if available
          if (draftData.additional_details) {
            try {
              const details = JSON.parse(draftData.additional_details)
              setSpecificationValues(details)

              // Update specification options based on loaded values
              updateSpecificationOptions(draftData.category, draftData.subcategory, details)
            } catch (e) {
              console.error("Error parsing additional details:", e)
            }
          }
        }
      }
    }
  }, [form])

  // Watch for category changes to update subcategories
  const watchCategory = form.watch("category")
  useEffect(() => {
    if (watchCategory) {
      const subs = getSubcategories(watchCategory, "item")
      setSubcategories(subs)
      form.setValue("subcategory", "") // Reset subcategory when category changes
      setSpecifications([]) // Reset specifications
      setSpecificationValues({}) // Reset specification values
      setSpecificationOptions({}) // Reset specification options
    }
  }, [watchCategory, form])

  // Watch for subcategory changes to update specifications
  const watchSubcategory = form.watch("subcategory")
  useEffect(() => {
    if (watchCategory && watchSubcategory) {
      const specs = getSpecifications(watchCategory, watchSubcategory)
      setSpecifications(specs)
      // Reset specification values when subcategory changes
      setSpecificationValues({})

      // Initialize specification options
      const options: Record<string, string[]> = {}
      specs.forEach((spec) => {
        options[spec] = getSpecificationOptions(watchCategory, watchSubcategory, spec)
      })
      setSpecificationOptions(options)
    }
  }, [watchCategory, watchSubcategory])

  // Update specification options when dependent values change
  const updateSpecificationOptions = (category: string, subcategory: string, values: Record<string, string>) => {
    const specs = getSpecifications(category, subcategory)
    const options: Record<string, string[]> = {}

    specs.forEach((spec) => {
      options[spec] = getSpecificationOptions(category, subcategory, spec, values)
    })

    setSpecificationOptions(options)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      // Validate images
      if (images.length === 0 && uploadedImageUrls.length === 0) {
        toast({
          title: "Images Required",
          description: "Please upload at least one image of your item.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Upload images if there are any new ones
      let imageUrls = [...uploadedImageUrls]
      if (images.length > 0) {
        const uploadedUrls = await uploadItemImages(images)
        imageUrls = [...imageUrls, ...uploadedUrls]
      }

      // Prepare additional details with specifications
      const additionalDetails = JSON.stringify(specificationValues)

      // Save as draft first
      const draftData = {
        title: values.title,
        description: values.description || "",
        category: values.category,
        subcategory: values.subcategory,
        condition: values.condition,
        price: Number(values.price),
        city: values.city,
        subcity: values.subcity || "",
        images: imageUrls,
        additional_details: additionalDetails,
        contact_info: {
          phone: values.phone,
          email: values.email,
          preferred_contact_method: values.preferredContactMethod,
        },
      }

      saveDraft("item", draftData)

      // If this is a final submission, create the item
      const item = await createItem({
        ...draftData,
        status: "published",
      })

      if (item) {
        // Clear the draft after successful submission
        localStorage.removeItem("item_draft")
        localStorage.setItem("post_submitted", "true")
        toast({
          title: "Success!",
          description: "Your item has been published successfully.",
          variant: "default",
        })
        router.push("/post/success")
      } else {
        throw new Error("Failed to create item")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was a problem publishing your item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    const draftData = {
      title: values.title,
      description: values.description || "",
      category: values.category,
      subcategory: values.subcategory,
      condition: values.condition,
      price: values.price ? Number(values.price) : undefined,
      city: values.city,
      subcity: values.subcity || "",
      images: uploadedImageUrls,
      additional_details: JSON.stringify(specificationValues),
      contact_info: {
        phone: values.phone,
        email: values.email,
        preferred_contact_method: values.preferredContactMethod,
      },
    }

    saveDraft("item", draftData)
    toast({
      title: "Draft Saved",
      description: "Your item draft has been saved successfully.",
    })
  }

  const handleImagesChange = (files: File[]) => {
    setImages(files)
  }

  const handleSpecificationChange = (spec: string, value: string) => {
    // Update the specification value
    const newValues = {
      ...specificationValues,
      [spec]: value,
    }
    setSpecificationValues(newValues)

    // If this is a Brand or Make specification, update dependent options
    if (spec === "Brand" || spec === "Make") {
      updateSpecificationOptions(watchCategory, watchSubcategory, newValues)
    }
  }

  const goBackToPostSelection = () => {
    router.push("/post")
  }

  // Simplified conditions as requested
  const conditions = ["Brand New", "Refurbished", "Used"]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button
        variant="ghost"
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        onClick={goBackToPostSelection}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Post Selection
      </Button>

      <h1 className="text-2xl font-bold mb-6 text-primary">Item Information</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SimplifiedImageUploader
            onChange={handleImagesChange}
            maxImages={5}
            existingImages={uploadedImageUrls}
            required={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your item" {...field} />
                  </FormControl>
                  <FormDescription>A clear title helps others find your item.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Price (ETB) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter price in ETB" {...field} />
                  </FormControl>
                  <FormDescription>Set a fair price for your item.</FormDescription>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your item in detail" className="min-h-32" {...field} />
                </FormControl>
                <FormDescription>Include features and why you're trading/selling it.</FormDescription>
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
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {itemCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose a category that best fits your item.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subcategory <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={subcategories.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={subcategories.length === 0 ? "Select a category first" : "Select a subcategory"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.value} value={subcategory.value}>
                          {subcategory.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select a specific subcategory for your item.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Condition <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the condition of your item.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic specifications based on subcategory */}
          {specifications.length > 0 && (
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec) => {
                  // Get options for this specification
                  const options = specificationOptions[spec] || []

                  return (
                    <div key={spec} className="space-y-2">
                      <label className="text-sm font-medium">{spec}</label>
                      {options.length > 0 ? (
                        <Select
                          value={specificationValues[spec] || ""}
                          onValueChange={(value) => handleSpecificationChange(spec, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${spec}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder={`Enter ${spec.toLowerCase()}`}
                          value={specificationValues[spec] || ""}
                          onChange={(e) => handleSpecificationChange(spec, e.target.value)}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} />
                  </FormControl>
                  <FormDescription>The city where the item is located.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your subcity" {...field} />
                  </FormControl>
                  <FormDescription>Specific subcity within the city.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormDescription>Your phone number for interested parties to contact you.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormDescription>Your email for interested parties to contact you.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferredContactMethod"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>
                    Preferred Contact Method <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred contact method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How would you prefer to be contacted?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ActionButtons
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
            submitLabel={
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Item"
              )
            }
          />
        </form>
      </Form>
    </div>
  )
}
