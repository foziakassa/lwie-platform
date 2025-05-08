"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import { itemCategories, getSubcategories, getSpecifications } from "@/lib/category-data"
import { saveDraft, getDraft } from "@/lib/post-storage"
import { createItem } from "@/lib/api-client"

export function ItemForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [condition, setCondition] = useState("")
  const [price, setPrice] = useState("")
  const [city, setCity] = useState("")
  const [subcity, setSubcity] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [preferredContactMethod, setPreferredContactMethod] = useState("phone")
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [specifications, setSpecifications] = useState<string[]>([])
  const [specificationValues, setSpecificationValues] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load draft data if available
  useEffect(() => {
    const draftData = getDraft("item")
    if (draftData) {
      setTitle(draftData.title || "")
      setDescription(draftData.description || "")
      setCategory(draftData.category || "")
      setSubcategory(draftData.subcategory || "")
      setCondition(draftData.condition || "")
      setPrice(draftData.price ? String(draftData.price) : "")
      setCity(draftData.city || "")
      setSubcity(draftData.subcity || "")
      setPhone(draftData.contact_info?.phone || "")
      setEmail(draftData.contact_info?.email || "")
      setPreferredContactMethod(draftData.contact_info?.preferred_contact_method || "phone")

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
            } catch (e) {
              console.error("Error parsing additional details:", e)
            }
          }
        }
      }
    }
  }, [])

  // Watch for category changes to update subcategories
  useEffect(() => {
    if (category) {
      const subs = getSubcategories(category, "item")
      setSubcategories(subs)
      setSubcategory("") // Reset subcategory when category changes
      setSpecifications([]) // Reset specifications
    }
  }, [category])

  // Watch for subcategory changes to update specifications
  useEffect(() => {
    if (category && subcategory) {
      const specs = getSpecifications(category, subcategory)
      setSpecifications(specs)
      // Reset specification values when subcategory changes
      setSpecificationValues({})
    }
  }, [category, subcategory])

  const handleSpecificationChange = (spec: string, value: string) => {
    setSpecificationValues((prev) => ({
      ...prev,
      [spec]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!title || !category || !condition || !price || !city || !phone || !email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare additional details with specifications
      const additionalDetails = JSON.stringify(specificationValues)

      // Save as draft first
      const draftData = {
        title,
        description,
        category,
        subcategory,
        condition,
        price: Number(price),
        city,
        subcity,
        images: [],
        additional_details: additionalDetails,
        contact_info: {
          phone,
          email,
          preferred_contact_method: preferredContactMethod,
        },
      }

      saveDraft("item", draftData)

      // Create the item
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
    const draftData = {
      title,
      description,
      category,
      subcategory,
      condition,
      price: price ? Number(price) : undefined,
      city,
      subcity,
      images: [],
      additional_details: JSON.stringify(specificationValues),
      contact_info: {
        phone,
        email,
        preferred_contact_method: preferredContactMethod,
      },
    }

    saveDraft("item", draftData)
    toast({
      title: "Draft Saved",
      description: "Your item draft has been saved successfully.",
    })
  }

  // Simplified conditions
  const conditions = ["Brand New", "Refurbished", "Used"]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/post"
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Post Selection
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-500">Item Information</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your item"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">A clear title helps others find your item.</p>
          </div>

          <div>
            <Label htmlFor="price">
              Price (ETB) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price in ETB"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set a fair price for your item.</p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item in detail"
              className="min-h-32"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Include features and why you're trading/selling it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {itemCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose a category that best fits your item.
              </p>
            </div>

            <div>
              <Label htmlFor="subcategory">Subcategory {category && <span className="text-red-500">*</span>}</Label>
              <Select
                value={subcategory}
                onValueChange={setSubcategory}
                disabled={subcategories.length === 0}
                required={category !== ""}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={subcategories.length === 0 ? "Select a category first" : "Select a subcategory"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcat) => (
                    <SelectItem key={subcat.value} value={subcat.value}>
                      {subcat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Select a specific subcategory for your item.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="condition">
              Condition <span className="text-red-500">*</span>
            </Label>
            <Select value={condition} onValueChange={setCondition} required>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((cond) => (
                  <SelectItem key={cond} value={cond}>
                    {cond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select the condition of your item.</p>
          </div>

          {/* Dynamic specifications based on subcategory */}
          {specifications.length > 0 && (
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec) => (
                  <div key={spec} className="space-y-2">
                    <Label>{spec}</Label>
                    <Input
                      placeholder={`Enter ${spec.toLowerCase()}`}
                      value={specificationValues[spec] || ""}
                      onChange={(e) => handleSpecificationChange(spec, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">The city where the item is located.</p>
            </div>

            <div>
              <Label htmlFor="subcity">Subcity</Label>
              <Input
                id="subcity"
                value={subcity}
                onChange={(e) => setSubcity(e.target.value)}
                placeholder="Enter your subcity"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Specific subcity within the city.</p>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-teal-600 dark:text-teal-500">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your phone number for interested parties to contact you.
                </p>
              </div>

              <div>
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your email for interested parties to contact you.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Label>
                Preferred Contact Method <span className="text-red-500">*</span>
              </Label>
              <Select value={preferredContactMethod} onValueChange={setPreferredContactMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">How would you prefer to be contacted?</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Item"}
          </Button>
        </div>
      </form>
    </div>
  )
}
