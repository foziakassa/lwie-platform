"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { serviceCategories, getSubcategories } from "@/lib/category-data"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Cookies from "js-cookie"

// API call to create a service
const createService = async (serviceData: {
  price: number
  user_id: any
  contact_info: { phone: string; email: string; preferred_contact_method: "phone" | "email" }
  image_urls: any
  title: string
  category: string
  subcategory: string
  city: string
  phone: string
  email: string
  preferredContactMethod: "phone" | "email"
  description?: string | undefined
  subcity?: string | undefined
}) => {
  const response = await fetch("https://liwedoc.vercel.app/api/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  })

  if (!response.ok) {
    console.log("Error creating service")
  }

  return await response.json()
}

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category."),
  subcategory: z.string().min(1, "Please select a subcategory."),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a number.",
  }),
  city: z.string().min(1, "Please enter your city."),
  subcity: z.string().optional(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  preferredContactMethod: z.enum(["phone", "email"], {
    required_error: "Please select a preferred contact method.",
  }),
})

export function ServicePostForm() {
  const router = useRouter()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdServiceId, setCreatedServiceId] = useState<string | null>(null)
  const [subcategories, setSubcategories] = useState<{ value: string; label: string }[]>([])

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

  // Watch for category changes to update subcategories
  const watchCategory = form.watch("category")
  useEffect(() => {
    if (watchCategory) {
      const subs = getSubcategories(watchCategory, "service")
      setSubcategories(subs)
      form.setValue("subcategory", "") // Reset subcategory when category changes
    }
  }, [watchCategory, form])

  const tokenString = Cookies.get("authToken")
  let userId = null
  if (tokenString) {
    try {
      const parsedToken = JSON.parse(tokenString)
      userId = parsedToken.id
    } catch (error) {
      console.error("Failed to parse authToken cookie:", error)
    }
  }
  type FormData = z.infer<typeof formSchema>

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      selectedImages.forEach((image) => {
        formData.append("image_urls", image)
      })

      const response = await fetch("https://liwedoc.vercel.app/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload images")
      const result = await response.json()

      const serviceData = {
        ...data,
        price: Number(data.price),
        user_id: userId,
        contact_info: {
          phone: data.phone,
          email: data.email,
          preferred_contact_method: data.preferredContactMethod,
        },
        image_urls: result.urls || [],
      }

      const newService = await createService(serviceData)
      setCreatedServiceId(newService.serviceId)
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    router.push("/post")
  }

  const viewService = () => {
    if (createdServiceId) {
      router.push(`/`)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-8 my-8">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Service Posted Successfully!</h1>
            <p className="text-gray-600 mb-8">Your service has been published and is now visible to other users.</p>
            <Button onClick={viewService} className="bg-teal-600 hover:bg-teal-700">
              View Your Service
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button variant="ghost" className="mb-6 flex items-center text-gray-600 hover:text-gray-900" onClick={goBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Post Selection
      </Button>

      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-teal-600">Post a Service</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="border p-4 rounded-md">
                <ImageUploader onChange={setSelectedImages} maxImages={5} required={true} />
                <p className="text-sm text-gray-500 mt-2">Upload images showcasing your service (optional).</p>
              </div>

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
                        <Input placeholder="e.g., Professional Web Development" {...field} />
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
                        <Input type="number" placeholder="e.g., 5000" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your service in detail." className="min-h-32" {...field} />
                    </FormControl>
                    <FormDescription>A detailed description increases your chances of finding clients.</FormDescription>
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
                              placeholder={
                                subcategories.length === 0 ? "Select a category first" : "Select a subcategory"
                              }
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
                        <Input placeholder="e.g., Addis Ababa" {...field} />
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
                        <Input placeholder="e.g., Bole" {...field} />
                      </FormControl>
                      <FormDescription>Specific subcity within the city.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4 text-teal-600">Contact Information</h2>

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
                          <Input placeholder="e.g., +251 91 234 5678" {...field} />
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
                          <Input placeholder="e.g., your.email@example.com" {...field} />
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

              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">Before you publish</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Make sure all information is accurate. Once published, your service will be visible to all users of
                  the platform.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-3 pt-6">
                <Button type="button" variant="outline" onClick={goBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Service"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
