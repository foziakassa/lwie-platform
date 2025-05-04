"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/post/image-uploader"
import {
  Check,
  Briefcase,
  Wrench,
  Scissors,
  Utensils,
  Truck,
  Paintbrush,
  Laptop,
  Stethoscope,
  GraduationCap,
  Home,
} from "lucide-react"
import { saveDraft, submitPost } from "@/app/actions/post-actions"

export default function PostServicePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    location: "",
    pricing: "",
    pricingType: "fixed",
    experience: "",
    terms: "",
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
        type: "service",
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
        type: "service",
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
    { id: "professional", name: "Professional", icon: <Briefcase className="h-5 w-5" /> },
    { id: "repair", name: "Repair & Maintenance", icon: <Wrench className="h-5 w-5" /> },
    { id: "beauty", name: "Beauty & Wellness", icon: <Scissors className="h-5 w-5" /> },
    { id: "food", name: "Food & Catering", icon: <Utensils className="h-5 w-5" /> },
    { id: "transport", name: "Transport & Delivery", icon: <Truck className="h-5 w-5" /> },
    { id: "creative", name: "Creative & Design", icon: <Paintbrush className="h-5 w-5" /> },
    { id: "tech", name: "Tech & IT", icon: <Laptop className="h-5 w-5" /> },
    { id: "health", name: "Health & Medical", icon: <Stethoscope className="h-5 w-5" /> },
    { id: "education", name: "Education & Training", icon: <GraduationCap className="h-5 w-5" /> },
    { id: "home", name: "Home Services", icon: <Home className="h-5 w-5" /> },
  ]

  const subcategories: Record<string, string[]> = {
    professional: ["Accounting", "Legal", "Consulting", "Business Services", "Other Professional"],
    repair: ["Electronics Repair", "Appliance Repair", "Vehicle Repair", "Home Repair", "Other Repair"],
    beauty: ["Hair Styling", "Makeup", "Nail Care", "Spa Services", "Other Beauty"],
    food: ["Catering", "Personal Chef", "Baking", "Food Delivery", "Other Food"],
    transport: ["Ride Service", "Delivery", "Moving", "Courier", "Other Transport"],
    creative: ["Graphic Design", "Photography", "Video Production", "Art & Crafts", "Other Creative"],
    tech: ["Web Development", "App Development", "IT Support", "Digital Marketing", "Other Tech"],
    health: ["Medical Consultation", "Therapy", "Fitness Training", "Nutrition", "Other Health"],
    education: ["Tutoring", "Language Learning", "Skills Training", "Coaching", "Other Education"],
    home: ["Cleaning", "Gardening", "Interior Design", "Security", "Other Home"],
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Post a Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Service Details</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Terms</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Service Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter service title"
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
                    <Label>Upload Images</Label>
                    <div className="mt-2">
                      <ImageUploader onImagesUploaded={handleImageUpload} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Service Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your service in detail"
                      className="mt-1 min-h-[150px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleSelectChange("experience", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="Intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="Experienced">Experienced (3-5 years)</SelectItem>
                        <SelectItem value="Expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Service Location</Label>
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
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pricingType">Pricing Type</Label>
                    <Select
                      value={formData.pricingType}
                      onValueChange={(value) => handleSelectChange("pricingType", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="project">Project-Based</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pricing">Pricing (ETB)</Label>
                    <Input
                      id="pricing"
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleInputChange}
                      placeholder={`Enter ${formData.pricingType === "hourly" ? "hourly rate" : "price"} in ETB`}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="terms">Terms & Conditions</Label>
                    <Textarea
                      id="terms"
                      name="terms"
                      value={formData.terms}
                      onChange={handleInputChange}
                      placeholder="Enter any terms or conditions for your service"
                      className="mt-1 min-h-[100px]"
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
                  } else if (activeTab === "details") {
                    setActiveTab("basic")
                  } else {
                    setActiveTab("details")
                  }
                }}
              >
                Back
              </Button>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>

                {activeTab === "pricing" ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      if (activeTab === "basic") {
                        setActiveTab("details")
                      } else if (activeTab === "details") {
                        setActiveTab("pricing")
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
