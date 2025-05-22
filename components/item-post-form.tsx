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
import { ImageUploader } from "@/components/image-uploader"
import { itemCategories, getSubcategories, getSpecifications, getSpecificationOptions } from "@/lib/category-data"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Cookies from "js-cookie"


// API call to create an item
const createItem = async (itemData: { price: number; user_id: string; status: string; contact_info: { phone: string; email: string; preferred_contact_method: "phone" | "email" }; title: string; category: string; subcategory: string; condition: string; city: string; phone: string; email: string; preferredContactMethod: "phone" | "email"; description?: string | undefined; subcity?: string | undefined }) => {
  const response = await fetch("https://liwedoc.vercel.app/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    // throw new Error("Failed to create item");
    console.log('ggg')
  }

  return await response.json();
};

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category."),
  subcategory: z.string().min(1, "Please select a subcategory."),
  condition: z.string().min(1, "Please select a condition."),
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

export function ItemPostForm() {
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdItemId, setCreatedItemId] = useState<string | null>(null)
  const [subcategories, setSubcategories] = useState<{ value: string; label: string }[]>([])
  const [specifications, setSpecifications] = useState<string[]>([])
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

      // Get options for each specification
      const options: Record<string, string[]> = {}
      specs.forEach((spec) => {
        options[spec] = getSpecificationOptions(watchCategory, watchSubcategory, spec)
      })
      setSpecificationOptions(options)

      // Reset specification values when subcategory changes
      setSpecificationValues({})
    }
  }, [watchCategory, watchSubcategory])

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files)
  }

  const handleSpecificationChange = (spec: string, value: string) => {
    setSpecificationValues((prev) => ({
      ...prev,
      [spec]: value,
    }))
  }

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
      // const tokenString = Cookies.get("authToken")
  

  // const userId = "replace-with-actual-user-id" // Replace with actual user ID logic
type FormData = z.infer<typeof formSchema>;

const tokenString = Cookies.get("authToken");

let userId = null;
if (tokenString) {
  try {
    const parsedToken = JSON.parse(tokenString);
    userId = parsedToken.id;
  } catch (error) {
    console.error("Failed to parse authToken cookie:", error);
  }
}

const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);
  setError(null);

  try {
    let imageUrl = null;
    if (selectedImages.length > 0) {
      const formData = new FormData();
      formData.append('image_urls', selectedImages[0]);
      const response = await fetch('https://liwedoc.vercel.app/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload image');
      const result = await response.json();
      imageUrl = result.url;
    }

    const itemData = {
      ...data,
      price: Number(data.price),
      user_id: userId, // <-- Here!
      status: "published",
      contact_info: {
        phone: data.phone,
        email: data.email,
        preferred_contact_method: data.preferredContactMethod,
      },
      image_urls: imageUrl ? [imageUrl] : [],
    };

    const newItem = await createItem(itemData);
    setIsSuccess(true);
    setCreatedItemId(newItem.itemId);

  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to create item. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};



  const goBack = () => {
    router.push("/post")
  }

  const viewItem = () => {
    if (createdItemId) {
      // router.push(`/products/${createdItemId}`)
      router.push(`/`)

    }
  }

  // Updated conditions as specified
  const conditions = ["Brand New", "Refurbished", "Used"]

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8 my-8">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Item Posted Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Your item has been published and is now visible to other users. You will be redirected to view your item.
          </p>
          <Button onClick={viewItem} className="bg-teal-600 hover:bg-teal-700">
            View Your Item
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button variant="ghost" className="mb-6 flex items-center text-gray-600 hover:text-gray-900" onClick={goBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Post Selection
      </Button>

      <h1 className="text-2xl font-bold mb-6 text-teal-600">Post an Item</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="border p-4 rounded-md">
            <ImageUploader onChange={handleImagesChange} maxImages={5} required={true} />
          </div>

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
                    <Input placeholder="e.g., iPhone 13 Pro Max 256GB" {...field} />
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
                    <Input type="number" placeholder="e.g., 25000" {...field} />
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
                  <Textarea
                    placeholder="Describe your item in detail. Include features, condition details, and why you're trading/selling it."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>A detailed description increases your chances of finding a match.</FormDescription>
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

          {/* Dynamic specifications based on subcategory - now with dropdowns */}
          {specifications.length > 0 && (
            <div className="border p-4 rounded-md">
              <h2 className="text-lg font-medium mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec) => (
                  <div key={spec} className="space-y-2">
                    <label className="text-sm font-medium">{spec}</label>
                    {specificationOptions[spec] && specificationOptions[spec].length > 0 ? (
                      <Select
                        value={specificationValues[spec] || ""}
                        onValueChange={(value) => handleSpecificationChange(spec, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${spec.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {specificationOptions[spec].map((option) => (
                            <SelectItem key={`${spec}-${option}`} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
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
                ))}
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
                    <Input placeholder="e.g., Addis Ababa" {...field} />
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
                    <Input placeholder="e.g., Bole, Kirkos, etc." {...field} />
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
              Make sure all information is accurate. Once published, your item will be visible to all users of the platform.
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
                "Publish Item"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}