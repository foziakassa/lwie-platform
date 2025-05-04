"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/post/image-uploader"
import {
  Check,
  Smartphone,
  Laptop,
  Tv,
  Camera,
  Headphones,
  Watch,
  Gift,
  ShoppingBag,
  Home,
  Car,
  Book,
} from "lucide-react"
import { saveDraft, submitPost } from "@/app/actions/post-actions"

export default function PostItemPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    subcategory: "",
    condition: "",
    brand: "",
    model: "",
    color: "",
    camera: "",
    battery: "",
    storage: "",
    ram: "",
    processor: "",
    screenSize: "",
    location: "",
    tradeFor: "",
    tradeValue: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (urls: string[]) => {
    setImages(urls)
  }

  const handleSaveDraft = async () => {
    try {
      await saveDraft({
        type: "item",
        ...formData,
        images,
      })
      router.push("/drafts")
    } catch (error) {
      console.error("Error saving draft:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitPost({
        type: "item",
        ...formData,
        images,
      })
      router.push("/post/success")
    } catch (error) {
      console.error("Error submitting post:", error)
      setIsSubmitting(false)
    }
  }

  const categories = [
    { id: "electronics", name: "Electronics", icon: <Smartphone className="h-5 w-5" /> },
    { id: "computers", name: "Computers", icon: <Laptop className="h-5 w-5" /> },
    { id: "tv-audio", name: "TV & Audio", icon: <Tv className="h-5 w-5" /> },
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
    "tv-audio": ["TVs", "Speakers", "Home Theater", "Audio Systems", "Accessories"],
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
    if (formData.category === "electronics" || formData.category === "computers") {
      return true
    }
    return false
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Post an Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="trade">Trade Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter item title"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price (ETB)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price in ETB"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          type="button"
                          variant={formData.category === category.id ? "default" : "outline"}
                          className={`flex items-center justify-start gap-2 h-auto py-3 px-4 ${
                            formData.category === category.id ? "bg-primary text-primary-foreground" : ""
                          }`}
                          onClick={() => handleSelectChange("category", category.id)}
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
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select
                        value={formData.subcategory}
                        onValueChange={(value) => handleSelectChange("subcategory", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories[formData.category]?.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleSelectChange("condition", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brand New">Brand New</SelectItem>
                        <SelectItem value="Refurbished">Refurbished</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Upload Images</Label>
                    <div className="mt-2">
                      <ImageUploader onImagesUploaded={handleImageUpload} />
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
                        className="mt-1"
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
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="e.g., Black, White, Gold"
                        className="mt-1"
                      />
                    </div>
                    {showSpecFields() && (
                      <div>
                        <Label htmlFor="camera">Camera</Label>
                        <Input
                          id="camera"
                          name="camera"
                          value={formData.camera}
                          onChange={handleInputChange}
                          placeholder="e.g., 50MP main, 12MP ultra-wide"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {showSpecFields() && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="battery">Battery</Label>
                          <Input
                            id="battery"
                            name="battery"
                            value={formData.battery}
                            onChange={handleInputChange}
                            placeholder="e.g., 5000mAh, 45W fast charging"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="storage">Storage</Label>
                          <Input
                            id="storage"
                            name="storage"
                            value={formData.storage}
                            onChange={handleInputChange}
                            placeholder="e.g., 128GB, 256GB"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ram">RAM</Label>
                          <Input
                            id="ram"
                            name="ram"
                            value={formData.ram}
                            onChange={handleInputChange}
                            placeholder="e.g., 8GB, 16GB"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="processor">Processor</Label>
                          <Input
                            id="processor"
                            name="processor"
                            value={formData.processor}
                            onChange={handleInputChange}
                            placeholder="e.g., Snapdragon 8 Gen 2"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="screenSize">Screen Size</Label>
                        <Input
                          id="screenSize"
                          name="screenSize"
                          value={formData.screenSize}
                          onChange={handleInputChange}
                          placeholder="e.g., 6.7 inches"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="trade" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Addis Ababa, Bole"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tradeFor">What would you trade for?</Label>
                    <Input
                      id="tradeFor"
                      name="tradeFor"
                      value={formData.tradeFor}
                      onChange={handleInputChange}
                      placeholder="e.g., Laptop, Camera, or cash"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tradeValue">Estimated trade value (ETB)</Label>
                    <Input
                      id="tradeValue"
                      name="tradeValue"
                      type="number"
                      value={formData.tradeValue}
                      onChange={handleInputChange}
                      placeholder="Enter estimated trade value"
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (activeTab === "basic") {
                    router.push("/post/selection")
                  } else if (activeTab === "specs") {
                    setActiveTab("basic")
                  } else {
                    setActiveTab("specs")
                  }
                }}
              >
                Back
              </Button>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>

                {activeTab === "trade" ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      if (activeTab === "basic") {
                        setActiveTab("specs")
                      } else if (activeTab === "specs") {
                        setActiveTab("trade")
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
