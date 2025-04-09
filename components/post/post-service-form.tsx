"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react"
import Link from "next/link"
import DynamicServiceFields from "./dynamic-service-fields"
import ImageUploader from "./image-uploader"

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

  const handleImageChange = (files: File[]) => {
    // In a real implementation, you would handle file uploads here
    console.log("Image files:", files)
    updateData({ hasImages: true })
  }

  // Update the handleFieldChange function to automatically show specifications when a category and subcategory are selected
  const handleFieldChange = (id: string, value: any) => {
    updateData({ [id]: value })

    // Automatically show specifications when category and subcategory are selected
    if (id === "category" || id === "subcategory") {
      if (data.category && data.subcategory) {
        // Set currentStep to 2 to show specifications automatically
        if (currentStep === 1) {
          onNext()
        }
      }
    }
  }

  // Define the dynamic fields for service details
  const serviceFieldGroups = [
    {
      title: "Basic Information",
      fields: [
        {
          id: "serviceDuration",
          label: "Service Duration",
          type: "select" as const,
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
          type: "textarea" as const,
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
          type: "select" as const,
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
          type: "text" as const,
          placeholder: "List any relevant certifications",
          helpText: "Include professional certifications, degrees, or training",
        },
        {
          id: "skills",
          label: "Skills",
          type: "tags" as const,
          required: true,
          placeholder: "Add relevant skills",
          helpText: "Add skills that are relevant to your service",
        },
        {
          id: "experienceLevel",
          label: "Experience Level",
          type: "select" as const,
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
          type: "text" as const,
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
          type: "select" as const,
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
          type: "select" as const,
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
          type: "select" as const,
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
          type: "textarea" as const,
          placeholder: "List any requirements clients need to meet",
          helpText: "What do clients need to have or do for your service?",
        },
        {
          id: "equipmentProvided",
          label: "Equipment Provided",
          type: "textarea" as const,
          placeholder: "List equipment or materials you provide",
          helpText: "What equipment or materials do you provide as part of your service?",
        },
        {
          id: "clientEquipment",
          label: "Client Equipment",
          type: "textarea" as const,
          placeholder: "List equipment or materials clients need to provide",
          helpText: "What equipment or materials should clients provide?",
        },
        {
          id: "ageRestrictions",
          label: "Age Restrictions",
          type: "select" as const,
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
          type: "days" as const,
          required: true,
          helpText: "Which days are you available to provide your service?",
        },
        {
          id: "startTime",
          label: "Start Time",
          type: "time" as const,
          required: true,
          helpText: "What time do you start providing your service?",
        },
        {
          id: "endTime",
          label: "End Time",
          type: "time" as const,
          required: true,
          helpText: "What time do you stop providing your service?",
        },
        {
          id: "advanceBooking",
          label: "Advance Booking Required",
          type: "select" as const,
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
          type: "select" as const,
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
          type: "select" as const,
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
          type: "text" as const,
          placeholder: "e.g., 500",
          helpText: "Your hourly rate in Ethiopian Birr",
        },
        {
          id: "fixedPrice",
          label: "Fixed Price (ETB)",
          type: "text" as const,
          placeholder: "e.g., 2500",
          helpText: "Your fixed price in Ethiopian Birr",
        },
        {
          id: "priceRange",
          label: "Price Range",
          type: "select" as const,
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
          type: "textarea" as const,
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
          <p className="text-xs text-gray-500">Be specific about the service you're offering</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="category" className="block text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={data.category || ""}
                onChange={(e) => updateData({ category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select a category</option>
                <option value="Tutoring">Tutoring</option>
                <option value="Home Services">Home Services</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Creative Services">Creative Services</option>
                <option value="Tech Services">Tech Services</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Events & Entertainment">Events & Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other Services">Other Services</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="subcategory" className="block text-sm font-medium">
              Subcategory <span className="text-red-500">*</span>
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
                    <option value="Science">Science</option>
                    <option value="Languages">Languages</option>
                    <option value="Computer Skills">Computer Skills</option>
                    <option value="Art & Craft">Art & Craft</option>
                    <option value="Test Preparation">Test Preparation</option>
                    <option value="Other Tutoring">Other Tutoring</option>
                  </>
                )}
                {data.category === "Home Services" && (
                  <>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Painting">Painting</option>
                    <option value="Moving">Moving</option>
                    <option value="Other Home Services">Other Home Services</option>
                  </>
                )}
                {data.category === "Professional Services" && (
                  <>
                    <option value="Accounting">Accounting</option>
                    <option value="Legal">Legal</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Translation">Translation</option>
                    <option value="Writing">Writing</option>
                    <option value="Editing">Editing</option>
                    <option value="Other Professional Services">Other Professional Services</option>
                  </>
                )}
                {data.category === "Creative Services" && (
                  <>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Animation">Animation</option>
                    <option value="Music Production">Music Production</option>
                    <option value="Other Creative Services">Other Creative Services</option>
                  </>
                )}
                {data.category === "Tech Services" && (
                  <>
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Other Tech Services">Other Tech Services</option>
                  </>
                )}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="description" className="block text-sm font-medium">
              Service Description <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-500">{descriptionCharCount}/2000</span>
          </div>
          <textarea
            id="description"
            value={data.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Provide a detailed description of your service..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
            maxLength={2000}
          />
          <p className="text-xs text-gray-500">
            Include your experience, qualifications, and what makes your service unique
          </p>
        </div>

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
              placeholder="Enter your location"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Service Location Type <span className="text-red-500">*</span>
          </label>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="serviceLocationType"
                value="atMyLocation"
                checked={data.serviceLocationType === "atMyLocation"}
                onChange={() => updateData({ serviceLocationType: "atMyLocation" })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">At my location</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="serviceLocationType"
                value="atClientLocation"
                checked={data.serviceLocationType === "atClientLocation"}
                onChange={() => updateData({ serviceLocationType: "atClientLocation" })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">At client's location</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="serviceLocationType"
                value="remote"
                checked={data.serviceLocationType === "remote"}
                onChange={() => updateData({ serviceLocationType: "remote" })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Remote (online)</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="serviceLocationType"
                value="flexible"
                checked={data.serviceLocationType === "flexible"}
                onChange={() => updateData({ serviceLocationType: "flexible" })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Flexible (can be discussed)</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Service Images (Optional)</label>
          <ImageUploader maxImages={5} onChange={handleImageChange} existingImages={data.images || []} />
        </div>

        <DynamicServiceFields fieldGroups={serviceFieldGroups} values={data} onChange={handleFieldChange} />
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
          Cancel
        </button>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Draft
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Next Step
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

