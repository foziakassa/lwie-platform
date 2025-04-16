"use client"

import { useState } from "react"
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react"
import Link from "next/link"
import DynamicServiceFields from "./dynamic-service-fields"
import ImageUploader from "./image-uploader"
import { useToast } from "../../hooks/use-toast"
import api from "../../lib/axios"

interface PostServiceFormProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onPrevious?: () => void
  onSaveDraft: () => void
  currentStep: number
}

export default function PostServiceForm({
  data,
  updateData,
  onNext,
  onPrevious,
  onSaveDraft,
  currentStep,
}: PostServiceFormProps) {
  const [titleCharCount, setTitleCharCount] = useState(data.title?.length || 0)
  const [descriptionCharCount, setDescriptionCharCount] = useState(data.description?.length || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateData({ title: value })
    setTitleCharCount(value.length)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    updateData({ description: value })
    setDescriptionCharCount(value.length)
  }

  const handleImageChange = async (files: File[]) => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('images', file))
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      updateData({ 
        images: response.data.urls.map((url: string) => ({ url })),
        hasImages: true 
      })
      
      toast({
        title: "Images uploaded",
        description: "Your images have been successfully uploaded.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images.",
        variant: "destructive",
      })
    }
  }

  const handleFieldChange = (id: string, value: any) => {
    updateData({ [id]: value })

    if (id === "category" || id === "subcategory") {
      if (data.category && data.subcategory && currentStep === 1) {
        onNext()
      }
    }
  }

  const handleSubmit = async () => {
    if (!data.title || !data.category_id || !data.location) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const serviceData = {
        user_id: data.user_id || 1, // Default to 1 if not provided
        title: data.title,
        category_id: data.category_id,
        description: data.description,
        hourly_rate: data.hourly_rate,
        location: data.location,
        trade_type: data.trade_type || 'serviceForService',
        time_estimation: data.time_estimation,
        time_unit: data.time_unit || 'hours',
        cancellation_policy: data.cancellation_policy || 'flexible',
        images: data.images || []
      }

      const response = await api.post('/api/services', serviceData)
      
      toast({
        title: "Service created",
        description: "Your service has been successfully posted.",
        variant: "default",
      })

      onNext()
    } catch (error) {
      console.error('Error creating service:', error)
      toast({
        title: "Error",
        description: "There was an error creating your service.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  interface Field {
    id: string
    label: string
    type: "select" | "textarea" | "text" | "tags" | "days" | "time"
    required?: boolean
    options?: { value: string; label: string }[]
    placeholder?: string
    helpText?: string
  }

  interface FieldGroup {
    title: string
    fields: Field[]
  }

  const serviceFieldGroups: FieldGroup[] = [
    {
      title: "Basic Information",
      fields: [
        {
          id: "serviceDuration",
          label: "Service Duration",
          type: "select",
          required: true,
          options: [
            { value: "", label: "Select an option" },
            { value: "one-time", label: "One-time" },
            { value: "hourly", label: "Hourly" },
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
            { value: "custom", label: "Custom" },
          ],
          helpText: "Select how your service is provided",
        },
        {
          id: "detailedDescription",
          label: "Detailed Service Description",
          type: "textarea",
          required: true,
          placeholder: "Provide a detailed description of the service you offer...",
          helpText: "Include what clients can expect, your process, and any special features of your service",
        },
      ],
    },
    {
      title: "Qualifications",
      fields: [
        {
          id: "experience",
          label: "Years of Experience",
          type: "select",
          required: true,
          options: [
            { value: "", label: "Select experience" },
            { value: "less-than-1", label: "Less than 1 year" },
            { value: "1-3", label: "1-3 years" },
            { value: "3-5", label: "3-5 years" },
            { value: "5-10", label: "5-10 years" },
            { value: "more-than-10", label: "More than 10 years" },
          ],
          helpText: "How long have you been providing this service?",
        },
        {
          id: "certifications",
          label: "Certifications",
          type: "text",
          placeholder: "List any relevant certifications",
          helpText: "Include professional certifications, degrees, or training",
        },
        {
          id: "skills",
          label: "Skills",
          type: "tags",
          required: true,
          placeholder: "Add relevant skills",
          helpText: "Add skills that are relevant to your service",
        },
        {
          id: "experienceLevel",
          label: "Experience Level",
          type: "select",
          required: true,
          options: [
            { value: "", label: "Select level" },
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
            { value: "expert", label: "Expert" },
          ],
          helpText: "Your overall expertise level in this service",
        },
        {
          id: "portfolioLink",
          label: "Portfolio Link",
          type: "text",
          placeholder: "https://your-portfolio-website.com",
          helpText: "Share a link to your portfolio, website, or social media showcasing your work",
        },
      ],
    },
    {
      title: "Service Area",
      fields: [
        {
          id: "serviceRadius",
          label: "Service Radius",
          type: "select",
          options: [
            { value: "", label: "Select radius" },
            { value: "5", label: "Within 5 km" },
            { value: "10", label: "Within 10 km" },
            { value: "25", label: "Within 25 km" },
            { value: "50", label: "Within 50 km" },
            { value: "any", label: "Any distance" },
          ],
          helpText: "How far are you willing to travel to provide your service?",
        },
        {
          id: "transportationMethod",
          label: "Transportation Method",
          type: "select",
          options: [
            { value: "", label: "Select method" },
            { value: "own_vehicle", label: "Own Vehicle" },
            { value: "public_transport", label: "Public Transport" },
            { value: "walking", label: "Walking" },
            { value: "client_pickup", label: "Client Pickup" },
            { value: "not_applicable", label: "Not Applicable" },
          ],
          helpText: "How do you travel to provide your service?",
        },
        {
          id: "serviceLocations",
          label: "Service Locations",
          type: "select",
          options: [
            { value: "", label: "Select locations" },
            { value: "addis_ababa_only", label: "Addis Ababa Only" },
            { value: "specific_neighborhoods", label: "Specific Neighborhoods" },
            { value: "nationwide", label: "Nationwide" },
            { value: "remote_only", label: "Remote Only" },
          ],
          helpText: "Specific areas where you provide your service",
        },
      ],
    },
    {
      title: "Requirements",
      fields: [
        {
          id: "clientRequirements",
          label: "Client Requirements",
          type: "textarea",
          placeholder: "List any requirements clients need to meet",
          helpText: "What do clients need to have or do for your service?",
        },
        {
          id: "equipmentProvided",
          label: "Equipment Provided",
          type: "textarea",
          placeholder: "List equipment or materials you provide",
          helpText: "What equipment or materials do you provide as part of your service?",
        },
        {
          id: "clientEquipment",
          label: "Client Equipment",
          type: "textarea",
          placeholder: "List equipment or materials clients need to provide",
          helpText: "What equipment or materials should clients provide?",
        },
        {
          id: "ageRestrictions",
          label: "Age Restrictions",
          type: "select",
          options: [
            { value: "", label: "Select age restrictions" },
            { value: "all_ages", label: "All Ages" },
            { value: "adults_only", label: "Adults Only (18+)" },
            { value: "children_only", label: "Children Only" },
            { value: "teenagers", label: "Teenagers" },
            { value: "seniors", label: "Seniors" },
            { value: "custom", label: "Custom" },
          ],
          helpText: "Any age restrictions for your service?",
        },
      ],
    },
    {
      title: "Schedule",
      fields: [
        {
          id: "availableDays",
          label: "Availability",
          type: "days",
          required: true,
          helpText: "Which days are you available to provide your service?",
        },
        {
          id: "startTime",
          label: "Start Time",
          type: "time",
          required: true,
          helpText: "What time do you start providing your service?",
        },
        {
          id: "endTime",
          label: "End Time",
          type: "time",
          required: true,
          helpText: "What time do you stop providing your service?",
        },
        {
          id: "advanceBooking",
          label: "Advance Booking Required",
          type: "select",
          options: [
            { value: "", label: "Select advance booking" },
            { value: "same_day", label: "Same Day" },
            { value: "1_day", label: "1 Day" },
            { value: "2_3_days", label: "2-3 Days" },
            { value: "1_week", label: "1 Week" },
            { value: "2_weeks", label: "2 Weeks" },
            { value: "1_month", label: "1 Month" },
          ],
          helpText: "How far in advance should clients book your service?",
        },
        {
          id: "sessionDuration",
          label: "Session Duration",
          type: "select",
          options: [
            { value: "", label: "Select session duration" },
            { value: "30_min", label: "30 Minutes" },
            { value: "1_hour", label: "1 Hour" },
            { value: "2_hours", label: "2 Hours" },
            { value: "half_day", label: "Half Day" },
            { value: "full_day", label: "Full Day" },
            { value: "custom", label: "Custom" },
          ],
          helpText: "How long is a typical service session?",
        },
      ],
    },
    {
      title: "Pricing",
      fields: [
        {
          id: "pricingType",
          label: "Pricing Type",
          type: "select",
          required: true,
          options: [
            { value: "", label: "Select pricing type" },
            { value: "hourly", label: "Hourly Rate" },
            { value: "fixed", label: "Fixed Price" },
            { value: "per_session", label: "Per Session" },
            { value: "per_project", label: "Per Project" },
            { value: "negotiable", label: "Negotiable" },
          ],
          helpText: "How do you charge for your service?",
        },
        {
          id: "hourlyRate",
          label: "Hourly Rate (ETB)",
          type: "text",
          placeholder: "e.g., 500",
          helpText: "Your hourly rate in Ethiopian Birr",
        },
        {
          id: "fixedPrice",
          label: "Fixed Price (ETB)",
          type: "text",
          placeholder: "e.g., 2500",
          helpText: "Your fixed price in Ethiopian Birr",
        },
        {
          id: "priceRange",
          label: "Price Range",
          type: "select",
          options: [
            { value: "", label: "Select price range" },
            { value: "budget", label: "Budget (Under 500 ETB)" },
            { value: "standard", label: "Standard (500-2000 ETB)" },
            { value: "premium", label: "Premium (2000-5000 ETB)" },
            { value: "luxury", label: "Luxury (Over 5000 ETB)" },
          ],
          helpText: "The general price range of your service",
        },
        {
          id: "discounts",
          label: "Discounts Available",
          type: "textarea",
          placeholder: "Describe any available discounts",
          helpText: "Any discounts for multiple sessions, referrals, etc.",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {onPrevious && (
        <div className="flex items-center justify-between">
          <Link
            href="#"
            className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600"
            onClick={onPrevious}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="text-sm text-gray-500">Step 1 of 4: Basic Info</div>
        </div>
      )}

      <h2 className="text-lg font-medium">Basic Information</h2>

      <div className="space-y-4">
        {/* Title Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="title" className="block text-sm font-medium">
              Service Title <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-500">{titleCharCount}/100</span>
          </div>
          <input
            type="text"
            id="title"
            value={data.title || ""}
            onChange={handleTitleChange}
            placeholder="Enter a descriptive service title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            maxLength={100}
          />
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="category" className="block text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={data.category || ""}
                onChange={(e) => {
                  updateData({ 
                    category: e.target.value,
                    category_id: e.target.selectedOptions[0].dataset.id 
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select a category</option>
                <option value="Tutoring" data-id="5">Tutoring</option>
                <option value="Home Services" data-id="4">Home Services</option>
                <option value="Professional Services" data-id="6">Professional Services</option>
                {/* Add other categories with their IDs */}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="subcategory" className="block text-sm font-medium">
              Subcategory
            </label>
            <div className="relative">
              <select
                id="subcategory"
                value={data.subcategory || ""}
                onChange={(e) => updateData({ subcategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select a subcategory</option>
                {data.category === "Tutoring" && (
                  <>
                    <option value="Music">Music</option>
                    <option value="Math">Math</option>
                    {/* Other tutoring subcategories */}
                  </>
                )}
                {/* Other category subcategories */}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="description" className="block text-sm font-medium">
              Service Description
            </label>
            <span className="text-xs text-gray-500">{descriptionCharCount}/2000</span>
          </div>
          <textarea
            id="description"
            value={data.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Describe your service..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
            maxLength={2000}
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label htmlFor="location" className="block text-sm font-medium">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              id="location"
              value={data.location || ""}
              onChange={(e) => updateData({ location: e.target.value })}
              placeholder="Where is your service located?"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Hourly Rate */}
        <div className="space-y-1">
          <label htmlFor="hourly_rate" className="block text-sm font-medium">
            Hourly Rate (ETB)
          </label>
          <input
            type="number"
            id="hourly_rate"
            value={data.hourly_rate || ""}
            onChange={(e) => updateData({ hourly_rate: e.target.value })}
            placeholder="Enter your hourly rate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Images */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Service Images</label>
          <ImageUploader 
            maxImages={5} 
            onChange={handleImageChange} 
            existingImages={data.images?.map((img: any) => img.url) || []} 
          />
        </div>

        {/* Dynamic Fields */}
        <DynamicServiceFields 
          fieldGroups={serviceFieldGroups} 
          values={data} 
          onChange={handleFieldChange} 
        />
      </div>

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => {}} 
          className="text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSubmitting ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {isSubmitting ? 'Posting...' : 'Post Service'}
            {!isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
