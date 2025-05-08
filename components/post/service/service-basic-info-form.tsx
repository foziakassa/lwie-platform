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
import { uploadServiceImages, createService } from "@/lib/api-client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getCurrentUser } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { serviceCategories, getSubcategories, type SubcategoryOption } from "@/lib/category-data"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  subcategory: z.string().min(1, {
    message: "Please select a subcategory.",
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

export function ServiceBasicInfoForm() {
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([])
  const [userData, setUserData] = useState<{
    firstname?: string
    lastname?: string
    email?: string
    phone?: string
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
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
    const draftData = getDraft("service")
    if (draftData) {
      form.reset({
        title: draftData.title || "",
        description: draftData.description || "",
        category: draftData.category || "",
        subcategory: draftData.subcategory || "",
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
        const subs = getSubcategories(draftData.category, "service")
        setSubcategories(subs)
      }
    }
  }, [form])

  // Watch for category changes to update subcategories
  const watchCategory = form.watch("category")
  useEffect(() => {
    if (watchCategory) {
      const subs = getSubcategories(watchCategory, "service")
      setSubcategories(subs)
      form.setValue("subcategory", "") // Reset subcategory when category changes
    }
  }, [watchCategory, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      // Upload images if there are any new ones (optional for services)
      let imageUrls = [...uploadedImageUrls]
      if (images.length > 0) {
        const uploadedUrls = await uploadServiceImages(images)
        imageUrls = [...imageUrls, ...uploadedUrls]
      }

      // Prepare service data
      const serviceData = {
        title: values.title,
        description: values.description,
        category: values.category,
        subcategory: values.subcategory,
        price: Number.parseFloat(values.price),
        city: values.city,
        subcity: values.subcity || "",
        images: imageUrls,
        service_details: {
          service_type: values.subcategory,
        },
        contact_info: {
          phone: values.phone,
          email: values.email,
          preferred_contact_method: values.preferredContactMethod,
        },
      }

      // Save as draft first
      saveDraft("service", serviceData)

      // Create the service
      const service = await createService({
        ...serviceData,
        status: "published",
      })

      if (service) {
        // Clear the draft after successful submission
        localStorage.removeItem("service_draft")
        localStorage.setItem("post_submitted", "true")
        toast({
          title: "Success!",
          description: "Your service has been published successfully.",
          variant: "default",
        })
        router.push("/post/success")
      } else {
        throw new Error("Failed to create service")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was a problem publishing your service. Please try again.",
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
      description: values.description,
      category: values.category,
      subcategory: values.subcategory,
      price: Number.parseFloat(values.price || "0"),
      city: values.city,
      subcity: values.subcity || "",
      images: uploadedImageUrls,
      service_details: {
        service_type: values.subcategory,
      },
      contact_info: {
        phone: values.phone,
        email: values.email,
        preferred_contact_method: values.preferredContactMethod,
      },
    }

    saveDraft("service", draftData)
    toast({
      title: "Draft Saved",
      description: "Your service draft has been saved successfully.",
    })
  }

  const handleImagesChange = (files: File[]) => {
    setImages(files)
  }

  const goBackToPostSelection = () => {
    router.push("/post")
  }

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

      <h1 className="text-2xl font-bold mb-6 text-primary">Service Information</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SimplifiedImageUploader
            onChange={handleImagesChange}
            maxImages={5}
            existingImages={uploadedImageUrls}
            required={false} // Images are optional for services
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Service Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your service" {...field} />
                  </FormControl>
                  <FormDescription>A clear title helps others find your service.</FormDescription>
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
                  <FormDescription>Set a fair price for your service.</FormDescription>
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
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your service in detail" className="min-h-32" {...field} />
                </FormControl>
                <FormDescription>
                  Include what you offer, your experience, and what makes your service unique.
                </FormDescription>
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
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose a category that best fits your service.</FormDescription>
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
                  <FormDescription>Select a specific subcategory for your service.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                  <FormDescription>The city where you offer your service.</FormDescription>
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
                "Publish Service"
              )
            }
          />
        </form>
      </Form>
    </div>
  )
}
