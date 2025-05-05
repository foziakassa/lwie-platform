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
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageUploader } from "@/components/post/image-uploader"
import { LocationForm } from "@/components/post/shared/location-form"
import { ActionButtons } from "@/components/post/shared/action-buttons"
import { toast } from "@/components/ui/use-toast"
import { savePost, saveDraft, getDraft, clearDraft } from "@/lib/post-storage"
import {
  Briefcase,
  Code,
  Wrench,
  Paintbrush,
  GraduationCap,
  Heart,
  Car,
  Home,
  Utensils,
  Music,
  Check,
} from "lucide-react"

export default function PostServicePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    experience: "",
    pricing: "",
    pricingType: "fixed",
    availability: "",
    city: "",
    subcity: "",
    remote: false,
  })

  useEffect(() => {
    setMounted(true)

    // Load draft data if available
    const draftData = getDraft("service")
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
    setFormData((prev) => ({ ...prev, pricingType: value }))
  }

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleSaveDraft = () => {
    saveDraft("service", { ...formData, images })
    toast({
      title: "Draft saved",
      description: "Your service draft has been saved. You can continue later.",
      duration: 3000,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields in the Basic Info section",
        variant: "destructive",
      })
      setActiveTab("basic")
      setIsSubmitting(false)
      return
    }

    if (!formData.experience || !formData.pricing || !formData.pricingType) {
      toast({
        title: "Missing details",
        description: "Please fill in all required fields in the Details section",
        variant: "destructive",
      })
      setActiveTab("details")
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
        id: `SERVICE-${Date.now()}`,
        type: "service" as const,
        data: {
          ...formData,
          images,
        },
        createdAt: new Date().toISOString(),
      }

      // Save post to storage
      savePost(post)

      // Clear draft
      clearDraft("service")

      // Show success toast
      toast({
        title: "Success!",
        description: "Your service has been posted successfully.",
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
    { id: "business", name: "Business", icon: <Briefcase className="h-5 w-5" /> },
    { id: "tech", name: "Technology", icon: <Code className="h-5 w-5" /> },
    { id: "repair", name: "Repair", icon: <Wrench className="h-5 w-5" /> },
    { id: "creative", name: "Creative", icon: <Paintbrush className="h-5 w-5" /> },
    { id: "education", name: "Education", icon: <GraduationCap className="h-5 w-5" /> },
    { id: "health", name: "Health", icon: <Heart className="h-5 w-5" /> },
    { id: "transport", name: "Transport", icon: <Car className="h-5 w-5" /> },
    { id: "home", name: "Home", icon: <Home className="h-5 w-5" /> },
    { id: "food", name: "Food", icon: <Utensils className="h-5 w-5" /> },
    { id: "events", name: "Events", icon: <Music className="h-5 w-5" /> },
  ]

  const subcategories: Record<string, string[]> = {
    business: ["Consulting", "Accounting", "Legal", "Marketing", "Administrative"],
    tech: ["Web Development", "App Development", "IT Support", "Graphic Design", "Digital Marketing"],
    repair: ["Electronics", "Appliances", "Vehicles", "Computers", "Home Repairs"],
    creative: ["Photography", "Videography", "Design", "Writing", "Music"],
    education: ["Tutoring", "Language", "Skills", "Test Prep", "Coaching"],
    health: ["Fitness", "Nutrition", "Therapy", "Wellness", "Medical"],
    transport: ["Delivery", "Rideshare", "Moving", "Courier", "Rental"],
    home: ["Cleaning", "Gardening", "Interior Design", "Security", "Maintenance"],
    food: ["Catering", "Personal Chef", "Baking", "Meal Prep", "Cooking Classes"],
    events: ["Planning", "Entertainment", "Decoration", "Photography", "Hosting"],
  }

  const handleNextTab = () => {
    if (activeTab === "basic") {
      // Validate basic info before proceeding
      if (!formData.title || !formData.category || !formData.description) {
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
      setActiveTab("details")
    } else if (activeTab === "details") {
      setActiveTab("location")
    }
  }

  if (!mounted) return null

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#00796B]">Post a Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      Service Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter service title"
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
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your service in detail"
                      className="mt-1 min-h-[150px] text-base"
                      required
                    />
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

              <TabsContent value="details" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="experience">
                      Experience Level <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleSelectChange("experience", value)}
                    >
                      <SelectTrigger className="mt-1 text-base py-6">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner" className="py-3">
                          Beginner (0-1 years)
                        </SelectItem>
                        <SelectItem value="Intermediate" className="py-3">
                          Intermediate (1-3 years)
                        </SelectItem>
                        <SelectItem value="Advanced" className="py-3">
                          Advanced (3-5 years)
                        </SelectItem>
                        <SelectItem value="Expert" className="py-3">
                          Expert (5+ years)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pricing">
                      Pricing (ETB) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pricing"
                      name="pricing"
                      type="number"
                      value={formData.pricing}
                      onChange={handleInputChange}
                      placeholder="Enter price in ETB"
                      className="mt-1 text-base py-6"
                      required
                    />
                  </div>

                  <div>
                    <Label>Pricing Type</Label>
                    <RadioGroup value={formData.pricingType} onValueChange={handleRadioChange} className="mt-2">
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed" className="flex-1 cursor-pointer">
                          Fixed Price
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="hourly" id="hourly" />
                        <Label htmlFor="hourly" className="flex-1 cursor-pointer">
                          Hourly Rate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="negotiable" id="negotiable" />
                        <Label htmlFor="negotiable" className="flex-1 cursor-pointer">
                          Negotiable
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => handleSelectChange("availability", value)}
                    >
                      <SelectTrigger className="mt-1 text-base py-6">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekdays" className="py-3">
                          Weekdays
                        </SelectItem>
                        <SelectItem value="Weekends" className="py-3">
                          Weekends
                        </SelectItem>
                        <SelectItem value="Evenings" className="py-3">
                          Evenings
                        </SelectItem>
                        <SelectItem value="Anytime" className="py-3">
                          Anytime
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <LocationForm formData={formData} onChange={handleSelectChange} type="service" />
              </TabsContent>
            </Tabs>

            <ActionButtons
              isSubmitting={isSubmitting}
              isLastStep={activeTab === "location"}
              onBack={() => {
                if (activeTab === "basic") {
                  router.push("/post/selection")
                } else if (activeTab === "details") {
                  setActiveTab("basic")
                } else {
                  setActiveTab("details")
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
