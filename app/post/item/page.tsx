"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageUploader } from "@/components/post/image-uploader"
import { LocationForm } from "@/components/post/shared/location-form"
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

export default function PostItemPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
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
  })

  useEffect(() => {
    setMounted(true)

    // Load draft data if available
    const draftData = getDraft("item")
    if (draftData) {
      setFormData(draftData)
      if (draftData.images && draftData.images.length > 0) {
        setImages(draftData.images)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tradePreference: value }))
  }

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleSaveDraft = () => {
    saveDraft("item", { ...formData, images })
    toast({
      title: "Draft saved",
      description: "Your item draft has been saved. You can continue later.",
      duration: 3000,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !formData.category || !formData.condition || !formData.price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields in the Basic Info section",
        variant: "destructive",
      })
      setActiveTab("basic")
      setIsSubmitting(false)
      return
    }

    if (!formData.city || !formData.subcity) {
      toast({
        title: "Missing location",
        description: "Please select both city and subcity",
        variant: "destructive",
      })
      setActiveTab("location")
      setIsSubmitting(false)
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image",
        variant: "destructive",
      })
      setActiveTab("basic")
      setIsSubmitting(false)
      return
    }

    try {
      // Create post object
      const post = {
        id: `ITEM-${Date.now()}`,
        type: "item" as const,
        data: {
          ...formData,
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
      formData.category === "electronics" ||
      formData.category === "computers" ||
      formData.category === "wearables" ||
      formData.category === "tv_audio"
    )
  }

  const handleNextTab = () => {
    if (activeTab === "basic") {
      // Validate basic info before proceeding
      if (!formData.title || !formData.category || !formData.condition || !formData.price) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
      if (images.length === 0) {
        toast({
          title: "Images required",
          description: "Please upload at least one image",
          variant: "destructive",
        })
        return
      }
      setActiveTab("specs")
    } else if (activeTab === "specs") {
      setActiveTab("location")
    }
  }

  if (!mounted) return null

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#00796B]">Post an Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="location">Location & Trade</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter item title"
                      className="mt-1 text-base py-6"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">
                      Price (ETB) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price in ETB"
                      className="mt-1 text-base py-6"
                      required
                    />
                  </div>

                  <div>
                    <Label>
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          type="button"
                          variant={formData.category === category.id ? "default" : "outline"}
                          className={`flex items-center justify-start gap-2 h-auto py-3 px-4 ${
                            formData.category === category.id ? "bg-[#00796B] text-white" : ""
                          }`}
                          onClick={() => {
                            handleSelectChange("category", category.id)
                            handleSelectChange("subcategory", "")
                          }}
                        >
                          {category.icon}
                          <span>{category.name}</span>
                          {formData.category === category.id && <Check className="h-4 w-4 ml-auto" />}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {formData.category && (
                    <div>
                      <Label htmlFor="subcategory">
                        Subcategory <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.subcategory}
                        onValueChange={(value) => handleSelectChange("subcategory", value)}
                      >
                        <SelectTrigger className="mt-1 text-base py-6">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories[formData.category]?.map((sub) => (
                            <SelectItem key={sub} value={sub} className="py-3">
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="condition">
                      Condition <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleSelectChange("condition", value)}
                    >
                      <SelectTrigger className="mt-1 text-base py-6">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
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
                  </div>

                  <div>
                    <Label>
                      Upload Images <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <ImageUploader images={images} setImages={handleImagesChange} maxImages={5} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="e.g., Samsung, Apple"
                        className="mt-1 text-base py-6"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="e.g., Galaxy S23, iPhone 14"
                        className="mt-1 text-base py-6"
                      />
                    </div>
                  </div>

                  {showSpecFields() && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="storage">Storage</Label>
                          <Input
                            id="storage"
                            name="storage"
                            value={formData.storage}
                            onChange={handleInputChange}
                            placeholder="e.g., 128GB, 256GB"
                            className="mt-1 text-base py-6"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ram">RAM</Label>
                          <Input
                            id="ram"
                            name="ram"
                            value={formData.ram}
                            onChange={handleInputChange}
                            placeholder="e.g., 8GB, 16GB"
                            className="mt-1 text-base py-6"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="camera">Camera</Label>
                          <Input
                            id="camera"
                            name="camera"
                            value={formData.camera}
                            onChange={handleInputChange}
                            placeholder="e.g., 50MP main, 12MP ultra-wide"
                            className="mt-1 text-base py-6"
                          />
                        </div>
                        <div>
                          <Label htmlFor="battery">Battery</Label>
                          <Input
                            id="battery"
                            name="battery"
                            value={formData.battery}
                            onChange={handleInputChange}
                            placeholder="e.g., 5000mAh, 45W fast charging"
                            className="mt-1 text-base py-6"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="e.g., Black, White, Gold"
                      className="mt-1 text-base py-6"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <LocationForm formData={formData} onChange={handleSelectChange} type="item" />

                <div className="mt-6">
                  <Label>Trade Preference</Label>
                  <RadioGroup value={formData.tradePreference} onValueChange={handleRadioChange} className="mt-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any" className="flex-1 cursor-pointer">
                        Open to anything
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="sell" id="sell" />
                      <Label htmlFor="sell" className="flex-1 cursor-pointer">
                        Sell only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="trade" id="trade" />
                      <Label htmlFor="trade" className="flex-1 cursor-pointer">
                        Trade only
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
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
        </CardContent>
      </Card>
    </div>
  )
}
