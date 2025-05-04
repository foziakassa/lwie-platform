"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageUploader } from "@/components/post/image-uploader"
import { LocationFormFields } from "@/components/post/shared/location-form"
import { ActionButtons } from "@/components/post/shared/action-buttons"
import { toast } from "@/components/ui/use-toast"
import { savePost, saveDraft, getDraft, clearDraft } from "@/lib/post-storage"
import {
  Smartphone,
  Laptop,
  Tv,
  Camera,
  Headphones,
  Watch,
  ShoppingBag,
  Home,
  Car,
  Book,
  Gift,
  Check,
} from "lucide-react"

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  condition: z.string().min(1, "Condition is required"),
  brand: z.string().optional(),
  model: z.string().optional(),
  storage: z.string().optional(),
  ram: z.string().optional(),
  camera: z.string().optional(),
  battery: z.string().optional(),
  color: z.string().optional(),
  city: z.string().min(1, "City is required"),
  subcity: z.string().min(1, "Subcity is required"),
  tradePreference: z.string().default("any"),
})

export default function PostItemPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize form with zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: "",
      category: "",
      subcategory: "",
      condition: "",
      brand: "",
      model: "",
      storage: "",
      ram: "",
      camera: "",
      battery: "",
      color: "",
      city: "",
      subcity: "",
      tradePreference: "any",
    },
  })

  useEffect(() => {
    setMounted(true)

    // Load draft data if available
    const draftData = getDraft("item")
    if (draftData) {
      form.reset(draftData)
      if (draftData.images && draftData.images.length > 0) {
        setImages(draftData.images)
      }
    }
  }, [form])

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    saveDraft("item", { ...values, images })
    toast({
      title: "Draft saved",
      description: "Your item draft has been saved. You can continue later.",
      duration: 3000,
    })
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Validate images
      if (images.length === 0) {
        toast({
          title: "Images required",
          description: "Please upload at least one image",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Create post object
      const post = {
        id: `ITEM-${Date.now()}`,
        type: "item" as const,
        data: {
          ...values,
          images,
        },
        createdAt: new Date().toISOString(),
      }

      // Save post to storage
      savePost(post)

      // Clear draft
      clearDraft("item")

      // Show success toast
      toast({
        title: "Success!",
        description: "Your item has been posted successfully.",
        duration: 3000,
      })

      // Redirect to success page
      router.push("/post/success")
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your post. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const categories = [
    { id: "electronics", name: "Electronics", icon: <Smartphone className="h-5 w-5" /> },
    { id: "computers", name: "Computers", icon: <Laptop className="h-5 w-5" /> },
    { id: "tv_audio", name: "TV & Audio", icon: <Tv className="h-5 w-5" /> },
    { id: "cameras", name: "Cameras", icon: <Camera className="h-5 w-5" /> },
    { id: "accessories", name: "Accessories", icon: <Headphones className="h-5 w-5" /> },
    { id: "wearables", name: "Wearables", icon: <Watch className="h-5 w-5" /> },
    { id: "clothing", name: "Clothing", icon: <ShoppingBag className="h-5 w-5" /> },
    { id: "home", name: "Home & Garden", icon: <Home className="h-5 w-5" /> },
    { id: "vehicles", name: "Vehicles", icon: <Car className="h-5 w-5" /> },
    { id: "books", name: "Books & Media", icon: <Book className="h-5 w-5" /> },
    { id: "other", name: "Other", icon: <Gift className="h-5 w-5" /> },
  ]

  const subcategories: Record<string, string[]> = {
    electronics: ["Smartphones", "Tablets", "Audio Devices", "Wearables", "Other Electronics"],
    computers: ["Laptops", "Desktops", "Monitors", "Computer Parts", "Peripherals"],
    tv_audio: ["TVs", "Speakers", "Home Theater", "Audio Systems", "Accessories"],
    cameras: ["DSLR", "Mirrorless", "Point & Shoot", "Action Cameras", "Lenses"],
    accessories: ["Phone Cases", "Chargers", "Cables", "Screen Protectors", "Other"],
    wearables: ["Smartwatches", "Fitness Trackers", "Smart Glasses", "Other Wearables"],
    clothing: ["Men's Clothing", "Women's Clothing", "Children's Clothing", "Shoes", "Accessories"],
    home: ["Furniture", "Appliances", "Kitchen", "Decor", "Garden"],
    vehicles: ["Cars", "Motorcycles", "Bicycles", "Parts & Accessories", "Other Vehicles"],
    books: ["Books", "Magazines", "Comics", "Textbooks", "Other Media"],
    other: ["Miscellaneous", "Collectibles", "Art", "Handmade", "Other Items"],
  }

  const showSpecFields = () => {
    return (
      form.watch("category") === "electronics" ||
      form.watch("category") === "computers" ||
      form.watch("category") === "wearables" ||
      form.watch("category") === "tv_audio"
    )
  }

  if (!mounted) return null

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#00796B]">Post an Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="location">Location & Trade</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter item title" className="text-base py-6" />
                          </FormControl>
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
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter price in ETB"
                              className="text-base py-6"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Category <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {categories.map((category) => (
                              <Button
                                key={category.id}
                                type="button"
                                variant={field.value === category.id ? "default" : "outline"}
                                className={`flex items-center justify-start gap-2 h-auto py-3 px-4 ${
                                  field.value === category.id ? "bg-[#00796B] text-white" : ""
                                }`}
                                onClick={() => {
                                  field.onChange(category.id)
                                  form.setValue("subcategory", "")
                                }}
                              >
                                {category.icon}
                                <span>{category.name}</span>
                                {field.value === category.id && <Check className="h-4 w-4 ml-auto" />}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("category") && (
                      <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Subcategory <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-base py-6">
                                  <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subcategories[form.watch("category")]?.map((sub) => (
                                  <SelectItem key={sub} value={sub} className="py-3">
                                    {sub}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Condition <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-base py-6">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Brand New" className="py-3">
                                Brand New
                              </SelectItem>
                              <SelectItem value="Refurbished" className="py-3">
                                Refurbished
                              </SelectItem>
                              <SelectItem value="Used" className="py-3">
                                Used
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="text-base">
                        Upload Images <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="mt-2">
                        <ImageUploader images={images} setImages={handleImagesChange} maxImages={5} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specs" className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Brand</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Samsung, Apple" className="text-base py-6" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Model</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Galaxy S23, iPhone 14" className="text-base py-6" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {showSpecFields() && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="storage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Storage</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., 128GB, 256GB" className="text-base py-6" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">RAM</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., 8GB, 16GB" className="text-base py-6" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="camera"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Camera</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g., 50MP main, 12MP ultra-wide"
                                    className="text-base py-6"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="battery"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Battery</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g., 5000mAh, 45W fast charging"
                                    className="text-base py-6"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Color</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Black, White, Gold" className="text-base py-6" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                  <LocationFormFields form={form} type="item" />

                  <FormField
                    control={form.control}
                    name="tradePreference"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel className="text-base">Trade Preference</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2">
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                              <RadioGroupItem value="any" id="any" />
                              <FormLabel htmlFor="any" className="flex-1 cursor-pointer">
                                Open to anything
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                              <RadioGroupItem value="sell" id="sell" />
                              <FormLabel htmlFor="sell" className="flex-1 cursor-pointer">
                                Sell only
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                              <RadioGroupItem value="trade" id="trade" />
                              <FormLabel htmlFor="trade" className="flex-1 cursor-pointer">
                                Trade only
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <ActionButtons
                isSubmitting={isSubmitting}
                isLastStep={activeTab === "location"}
                onBack={() => {
                  if (activeTab === "basic") {
                    router.push("/post/selection")
                  } else if (activeTab === "specs") {
                    setActiveTab("basic")
                  } else {
                    setActiveTab("specs")
                  }
                }}
                onSaveDraft={handleSaveDraft}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
