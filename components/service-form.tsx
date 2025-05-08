"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Textarea } from "components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { toast } from "components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import { serviceCategories, getSubcategories } from "lib/category-data"
import { saveDraft, getDraft } from "lib/post-storage"
import { createService } from "lib/api-client"

export function ServiceForm() {
  const router = useRouter()
  const [userId, setUserId] = useState<string>("") // TODO: Replace with actual user ID from auth context
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [price, setPrice] = useState("")
  const [city, setCity] = useState("")
  const [subcity, setSubcity] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [preferredContactMethod, setPreferredContactMethod] = useState("phone")
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load draft data if available
  useEffect(() => {
    const draftData = getDraft("service")
    if (draftData) {
      setTitle(draftData.title || "")
      setDescription(draftData.description || "")
      setCategory(draftData.category || "")
      setSubcategory(draftData.subcategory || "")
      setPrice(draftData.price ? String(draftData.price) : "")
      setCity(draftData.city || "")
      setSubcity(draftData.subcity || "")
      setPhone(draftData.contact_info?.phone || "")
      setEmail(draftData.contact_info?.email || "")
      setPreferredContactMethod(draftData.contact_info?.preferred_contact_method || "phone")

      // Load subcategories based on selected category
      if (draftData.category) {
        const subs = getSubcategories(draftData.category, "service")
        setSubcategories(subs)
      }
    }
  }, [])

  // Watch for category changes to update subcategories
  useEffect(() => {
    if (category) {
      const subs = getSubcategories(category, "service")
      setSubcategories(subs)
      setSubcategory("") // Reset subcategory when category changes
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!userId || !title || !description || !category || !price || !city || !phone || !email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare service data
      const serviceData = {
        user_id: userId,
        title,
        description,
        category,
        subcategory,
        price: Number(price),
        city,
        subcity,
        images: [],
        service_details: {
          service_type: subcategory,
        },
        contact_info: {
          phone,
          email,
          preferred_contact_method: preferredContactMethod,
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
        })
        // Navigate back to home page to refresh listings
        router.push("/")
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
    const draftData = {
      user_id: userId,
      title,
      description,
      category,
      subcategory,
      price: price ? Number(price) : undefined,
      city,
      subcity,
      images: [],
      service_details: {
        service_type: subcategory,
      },
      contact_info: {
        phone,
        email,
        preferred_contact_method: preferredContactMethod,
      },
    }

    saveDraft("service", draftData)
    toast({
      title: "Draft Saved",
      description: "Your service draft has been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/post"
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Post Selection
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-500">Service Information</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
      >
        {/* form fields here */}
        {/* ... */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Service"}
          </Button>
        </div>
      </form>
    </div>
  )
}
