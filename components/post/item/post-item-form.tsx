"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImageUploader } from "@/components/post/image-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { savePost } from "@/lib/posts-storage"
import { itemCategories } from "@/lib/categories"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Check,
  Smartphone,
  Laptop,
  Camera,
  Tv,
  Headphones,
  Watch,
  Shirt,
  Sofa,
  Utensils,
  Dumbbell,
  Car,
  BikeIcon as Bicycle,
  Book,
  Gift,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

import { useEffect, useState } from "react"

export function PostItemForm() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-info")
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    condition: "",
    price: "",
    description: "",
    location: "",
    tradePreference: "any",
    specifications: {
      // Electronics
      brand: "",
      model: "",
      camera: "",
      battery: "",
      storage: "",
      ram: "",
      processor: "",
      screenSize: "",
      // Clothing
      size: "",
      material: "",
      color: "",
      // Furniture
      dimensions: "",
      weight: "",
      // Other categories can be added as needed
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSpecChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
    }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tradePreference: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      subcategory: "", // Reset subcategory when category changes
    }))
  }

  const handleSubcategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subcategory: value }))
  }

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const getSubcategories = () => {
    const category = itemCategories.find((cat) => cat.name === formData.category)
    return category?.subcategories || []
  }

  const getSpecFields = () => {
    if (formData.category === "Electronics") {
      if (formData.subcategory === "Smartphones") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.specifications.brand}
                onChange={(e) => handleSpecChange("brand", e.target.value)}
                placeholder="e.g., Samsung, Apple"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.specifications.model}
                onChange={(e) => handleSpecChange("model", e.target.value)}
                placeholder="e.g., Galaxy S23, iPhone 14"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage">Storage</Label>
              <Input
                id="storage"
                value={formData.specifications.storage}
                onChange={(e) => handleSpecChange("storage", e.target.value)}
                placeholder="e.g., 128GB, 256GB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ram">RAM</Label>
              <Input
                id="ram"
                value={formData.specifications.ram}
                onChange={(e) => handleSpecChange("ram", e.target.value)}
                placeholder="e.g., 8GB, 12GB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camera">Camera</Label>
              <Input
                id="camera"
                value={formData.specifications.camera}
                onChange={(e) => handleSpecChange("camera", e.target.value)}
                placeholder="e.g., 50MP main, 12MP ultra-wide, 10MP telephoto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="battery">Battery</Label>
              <Input
                id="battery"
                value={formData.specifications.battery}
                onChange={(e) => handleSpecChange("battery", e.target.value)}
                placeholder="e.g., 5000mAh, 45W fast charging"
              />
            </div>
          </>
        )
      } else if (formData.subcategory === "Laptops") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.specifications.brand}
                onChange={(e) => handleSpecChange("brand", e.target.value)}
                placeholder="e.g., Dell, HP, Lenovo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.specifications.model}
                onChange={(e) => handleSpecChange("model", e.target.value)}
                placeholder="e.g., XPS 15, ThinkPad X1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processor">Processor</Label>
              <Input
                id="processor"
                value={formData.specifications.processor}
                onChange={(e) => handleSpecChange("processor", e.target.value)}
                placeholder="e.g., Intel i7, AMD Ryzen 7"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ram">RAM</Label>
              <Input
                id="ram"
                value={formData.specifications.ram}
                onChange={(e) => handleSpecChange("ram", e.target.value)}
                placeholder="e.g., 16GB, 32GB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage">Storage</Label>
              <Input
                id="storage"
                value={formData.specifications.storage}
                onChange={(e) => handleSpecChange("storage", e.target.value)}
                placeholder="e.g., 512GB SSD, 1TB SSD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenSize">Screen Size</Label>
              <Input
                id="screenSize"
                value={formData.specifications.screenSize}
                onChange={(e) => handleSpecChange("screenSize", e.target.value)}
                placeholder="e.g., 15.6 inch, 13.3 inch"
              />
            </div>
          </>
        )
      } else if (formData.subcategory === "TVs") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.specifications.brand}
                onChange={(e) => handleSpecChange("brand", e.target.value)}
                placeholder="e.g., Samsung, LG, Sony"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.specifications.model}
                onChange={(e) => handleSpecChange("model", e.target.value)}
                placeholder="e.g., QLED Q80, OLED C2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenSize">Screen Size</Label>
              <Input
                id="screenSize"
                value={formData.specifications.screenSize}
                onChange={(e) => handleSpecChange("screenSize", e.target.value)}
                placeholder="e.g., 55 inch, 65 inch"
              />
            </div>
          </>
        )
      }
    } else if (formData.category === "Clothing") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              value={formData.specifications.size}
              onChange={(e) => handleSpecChange("size", e.target.value)}
              placeholder="e.g., S, M, L, XL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              value={formData.specifications.material}
              onChange={(e) => handleSpecChange("material", e.target.value)}
              placeholder="e.g., Cotton, Polyester, Wool"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={formData.specifications.color}
              onChange={(e) => handleSpecChange("color", e.target.value)}
              placeholder="e.g., Blue, Red, Black"
            />
          </div>
        </>
      )
    } else if (formData.category === "Furniture") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              value={formData.specifications.material}
              onChange={(e) => handleSpecChange("material", e.target.value)}
              placeholder="e.g., Wood, Metal, Glass"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              value={formData.specifications.dimensions}
              onChange={(e) => handleSpecChange("dimensions", e.target.value)}
              placeholder="e.g., 80cm x 120cm x 75cm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={formData.specifications.color}
              onChange={(e) => handleSpecChange("color", e.target.value)}
              placeholder="e.g., Brown, Black, White"
            />
          </div>
        </>
      )
    }

    // Default fields for other categories
    return (
      <div className="space-y-2">
        <Label htmlFor="brand">Brand/Make</Label>
        <Input
          id="brand"
          value={formData.specifications.brand}
          onChange={(e) => handleSpecChange("brand", e.target.value)}
          placeholder="Brand or make of the item"
        />
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Electronics":
        return <Smartphone className="h-5 w-5 mr-2" />
      case "Clothing":
        return <Shirt className="h-5 w-5 mr-2" />
      case "Furniture":
        return <Sofa className="h-5 w-5 mr-2" />
      case "Kitchen":
        return <Utensils className="h-5 w-5 mr-2" />
      case "Sports":
        return <Dumbbell className="h-5 w-5 mr-2" />
      case "Vehicles":
        return <Car className="h-5 w-5 mr-2" />
      case "Books":
        return <Book className="h-5 w-5 mr-2" />
      default:
        return <Gift className="h-5 w-5 mr-2" />
    }
  }

  const getSubcategoryIcon = (subcategory: string) => {
    switch (subcategory) {
      case "Smartphones":
        return <Smartphone className="h-5 w-5 mr-2" />
      case "Laptops":
        return <Laptop className="h-5 w-5 mr-2" />
      case "Cameras":
        return <Camera className="h-5 w-5 mr-2" />
      case "TVs":
        return <Tv className="h-5 w-5 mr-2" />
      case "Headphones":
        return <Headphones className="h-5 w-5 mr-2" />
      case "Smartwatches":
        return <Watch className="h-5 w-5 mr-2" />
      case "Bicycles":
        return <Bicycle className="h-5 w-5 mr-2" />
      default:
        return null
    }
  }

  const handleSaveDraft = () => {
    try {
      const post = {
        id: Date.now().toString(),
        type: "item" as const,
        data: {
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          condition: formData.condition,
          price: formData.price,
          description: formData.description,
          location: formData.location,
          tradePreference: formData.tradePreference,
          specifications: formData.specifications,
          images: [], // Exclude images to avoid quota issues
        },
        createdAt: new Date().toISOString(),
        status: "draft",
      }

      savePost(post)
      toast({
        title: "Draft saved successfully!",
        description: "Your draft has been saved. You can continue later.",
        duration: 3000,
      })
    } catch (error: any) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error saving draft",
        description: "There was a problem saving your draft. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.category || !formData.condition || !formData.price || !formData.location) {
      alert("Please fill in all required fields")
      return
    }

    if (images.length === 0) {
      alert("Please upload at least one image")
      return
    }

    const post = {
      id: Date.now().toString(),
      type: "item" as const,
      data: {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        condition: formData.condition,
        price: formData.price,
        description: formData.description,
        location: formData.location,
        tradePreference: formData.tradePreference,
        specifications: formData.specifications,
        images: images,
      },
      createdAt: new Date().toISOString(),
      status: "published",
    }

    await savePost(post)
    router.push("/post/success")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 shadow-md rounded-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="trade-preferences">Trade & Location</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="What are you selling?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <div className="grid grid-cols-2 gap-3">
                  {itemCategories.map((category) => (
                    <Button
                      key={category.name}
                      type="button"
                      variant={formData.category === category.name ? "default" : "outline"}
                      className="justify-start h-auto py-3"
                      onClick={() => handleCategoryChange(category.name)}
                    >
                      <div className="flex items-center">
                        {getCategoryIcon(category.name)}
                        {category.name}
                      </div>
                      {formData.category === category.name && <Check className="h-4 w-4 ml-auto" />}
                    </Button>
                  ))}
                </div>
              </div>

              {formData.category && (
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {getSubcategories().map((subcategory) => (
                      <Button
                        key={String(subcategory)}
                        type="button"
                        variant={formData.subcategory === String(subcategory) ? "default" : "outline"}
                        className="justify-start h-auto py-3"
                        onClick={() => handleSubcategoryChange(String(subcategory))}
                      >
                        <div className="flex items-center">
                          {getSubcategoryIcon(String(subcategory))}
                          {String(subcategory)}
                        </div>
                        {formData.subcategory === String(subcategory) && <Check className="h-4 w-4 ml-auto" />}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brand New">Brand New</SelectItem>
                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (ETB)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price in ETB"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <ImageUploader images={images} onChange={handleImagesChange} maxImages={5} setImages={setImages} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your item"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveTab("specifications")}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-6">
            <div className="space-y-4">{getSpecFields()}</div>

            <div className="flex justify-between space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveTab("basic-info")}>
                Previous
              </Button>
              <Button type="button" variant="outline" onClick={() => setActiveTab("trade-preferences")}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="trade-preferences" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Your general location (e.g., Bole, Addis Ababa)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Trade Preference</Label>
                <RadioGroup value={formData.tradePreference} onValueChange={handleRadioChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Open to anything</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell">Sell only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trade" id="trade" />
                    <Label htmlFor="trade">Trade only</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-between space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveTab("specifications")}>
                Previous
              </Button>
              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </form>
  )
}
