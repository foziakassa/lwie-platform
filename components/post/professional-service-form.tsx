"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, MapPin, Clock, ChevronDown } from "lucide-react"
import Link from "next/link"
import ImageUploader from "./image-uploader"

interface ProfessionalServiceFormProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onPrevious?: () => void
  onSaveDraft: () => void
  currentStep: number
}

export default function ProfessionalServiceForm({
  data,
  updateData,
  onNext,
  onPrevious,
  onSaveDraft,
  currentStep,
}: ProfessionalServiceFormProps) {
  const [titleCharCount, setTitleCharCount] = useState(data.title?.length || 0)
  const [descriptionCharCount, setDescriptionCharCount] = useState(data.description?.length || 0)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Basic Information": true,
    Qualifications: false,
    "Service Area": false,
    Requirements: false,
    Schedule: false,
    Pricing: false,
  })
  const [tagInput, setTagInput] = useState("")

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

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

  const handleAddTag = (fieldId: string) => {
    if (!tagInput.trim()) return

    const currentTags = data[fieldId] || []
    if (!currentTags.includes(tagInput.trim())) {
      updateData({ [fieldId]: [...currentTags, tagInput.trim()] })
    }
    setTagInput("")
  }

  const handleRemoveTag = (fieldId: string, tag: string) => {
    const currentTags = data[fieldId] || []
    updateData({
      [fieldId]: currentTags.filter((t: string) => t !== tag),
    })
  }

  const handleDayToggle = (day: string) => {
    const currentDays = data.availableDays || []
    if (currentDays.includes(day)) {
      updateData({
        availableDays: currentDays.filter((d: string) => d !== day),
      })
    } else {
      updateData({ availableDays: [...currentDays, day] })
    }
  }

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
          <div className="text-sm text-gray-500">
            Step {currentStep} of 4:{" "}
            {currentStep === 1
              ? "Basic Info"
              : currentStep === 2
                ? "Details"
                : currentStep === 3
                  ? "Trade Options"
                  : "Review"}
          </div>
        </div>
      )}

      <h2 className="text-lg font-medium">Service Information</h2>

      {/* Basic Information Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Basic Information")}
        >
          <h3 className="text-base font-medium">Basic Information</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Basic Information"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Basic Information"] && (
          <div className="mt-4 space-y-4">
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
                    onChange={(e) => handleFieldChange("category", e.target.value)}
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
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
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
                    onChange={(e) => handleFieldChange("subcategory", e.target.value)}
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
                    {data.category === "Health & Wellness" && (
                      <>
                        <option value="Fitness Training">Fitness Training</option>
                        <option value="Yoga Instruction">Yoga Instruction</option>
                        <option value="Nutrition Counseling">Nutrition Counseling</option>
                        <option value="Massage Therapy">Massage Therapy</option>
                        <option value="Mental Health">Mental Health</option>
                        <option value="Other Health Services">Other Health Services</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
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
                  onChange={(e) => handleFieldChange("location", e.target.value)}
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
                    onChange={() => handleFieldChange("serviceLocationType", "atMyLocation")}
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
                    onChange={() => handleFieldChange("serviceLocationType", "atClientLocation")}
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
                    onChange={() => handleFieldChange("serviceLocationType", "remote")}
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
                    onChange={() => handleFieldChange("serviceLocationType", "flexible")}
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
          </div>
        )}
      </div>

      {/* Qualifications Section */}
      <div className="border-t border-gray-200 pt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("Qualifications")}
        >
          <h3 className="text-base font-medium">Qualifications</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Qualifications"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Qualifications"] && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="experience" className="block text-sm font-medium">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="experience"
                    value={data.experience || ""}
                    onChange={(e) => handleFieldChange("experience", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Select experience</option>
                    <option value="less-than-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="more-than-10">More than 10 years</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="certifications" className="block text-sm font-medium">
                  Certifications
                </label>
                <input
                  type="text"
                  id="certifications"
                  value={data.certifications || ""}
                  onChange={(e) => handleFieldChange("certifications", e.target.value)}
                  placeholder="List any relevant certifications"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">
                Skills <span className="text-red-500">*</span>
              </h3>

              <div className="flex items-center">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Add skills (press Enter after each)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag("skills")
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTag("skills")}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(data.skills || []).map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag("skills", skill)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-teal-400 hover:text-teal-500 focus:outline-none focus:text-teal-500"
                    >
                      <span className="sr-only">Remove</span>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8l4-4m0 0L4 4m4 0v8" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="experienceLevel" className="block text-sm font-medium">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="experienceLevel"
                  value={data.experienceLevel || ""}
                  onChange={(e) => handleFieldChange("experienceLevel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="portfolioLink" className="block text-sm font-medium">
                Portfolio Link
              </label>
              <input
                type="url"
                id="portfolioLink"
                value={data.portfolioLink || ""}
                onChange={(e) => handleFieldChange("portfolioLink", e.target.value)}
                placeholder="https://your-portfolio-website.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-500">
                Share a link to your portfolio, website, or social media showcasing your work
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Service Area Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("Service Area")}>
          <h3 className="text-base font-medium">Service Area</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Service Area"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Service Area"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="serviceRadius" className="block text-sm font-medium">
                Service Radius
              </label>
              <div className="relative">
                <select
                  id="serviceRadius"
                  value={data.serviceRadius || ""}
                  onChange={(e) => handleFieldChange("serviceRadius", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select radius</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                  <option value="any">Any distance</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="transportationMethod" className="block text-sm font-medium">
                Transportation Method
              </label>
              <div className="relative">
                <select
                  id="transportationMethod"
                  value={data.transportationMethod || ""}
                  onChange={(e) => handleFieldChange("transportationMethod", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select method</option>
                  <option value="own_vehicle">Own Vehicle</option>
                  <option value="public_transport">Public Transport</option>
                  <option value="walking">Walking</option>
                  <option value="client_pickup">Client Pickup</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="serviceLocations" className="block text-sm font-medium">
                Service Locations
              </label>
              <div className="relative">
                <select
                  id="serviceLocations"
                  value={data.serviceLocations || ""}
                  onChange={(e) => handleFieldChange("serviceLocations", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select locations</option>
                  <option value="addis_ababa_only">Addis Ababa Only</option>
                  <option value="specific_neighborhoods">Specific Neighborhoods</option>
                  <option value="nationwide">Nationwide</option>
                  <option value="remote_only">Remote Only</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Requirements Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("Requirements")}>
          <h3 className="text-base font-medium">Requirements</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Requirements"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Requirements"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="clientRequirements" className="block text-sm font-medium">
                Client Requirements
              </label>
              <textarea
                id="clientRequirements"
                value={data.clientRequirements || ""}
                onChange={(e) => handleFieldChange("clientRequirements", e.target.value)}
                placeholder="List any requirements clients need to meet"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[80px]"
              />
              <p className="text-xs text-gray-500">What do clients need to have or do for your service?</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="equipmentProvided" className="block text-sm font-medium">
                Equipment Provided
              </label>
              <textarea
                id="equipmentProvided"
                value={data.equipmentProvided || ""}
                onChange={(e) => handleFieldChange("equipmentProvided", e.target.value)}
                placeholder="List equipment or materials you provide"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[80px]"
              />
              <p className="text-xs text-gray-500">
                What equipment or materials do you provide as part of your service?
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="clientEquipment" className="block text-sm font-medium">
                Client Equipment
              </label>
              <textarea
                id="clientEquipment"
                value={data.clientEquipment || ""}
                onChange={(e) => handleFieldChange("clientEquipment", e.target.value)}
                placeholder="List equipment or materials clients need to provide"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[80px]"
              />
              <p className="text-xs text-gray-500">What equipment or materials should clients provide?</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="ageRestrictions" className="block text-sm font-medium">
                Age Restrictions
              </label>
              <div className="relative">
                <select
                  id="ageRestrictions"
                  value={data.ageRestrictions || ""}
                  onChange={(e) => handleFieldChange("ageRestrictions", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select age restrictions</option>
                  <option value="all_ages">All Ages</option>
                  <option value="adults_only">Adults Only (18+)</option>
                  <option value="children_only">Children Only</option>
                  <option value="teenagers">Teenagers</option>
                  <option value="seniors">Seniors</option>
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("Schedule")}>
          <h3 className="text-base font-medium">Schedule</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Schedule"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Schedule"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-4">
              <h3 className="text-base font-medium">
                Availability <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-500">Available Days</p>

              <div className="flex flex-wrap gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      (data.availableDays || []).includes(day)
                        ? "bg-teal-100 text-teal-800 border border-teal-300"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="startTime" className="block text-sm font-medium">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="time"
                    id="startTime"
                    value={data.startTime || ""}
                    onChange={(e) => handleFieldChange("startTime", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="endTime" className="block text-sm font-medium">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="time"
                    id="endTime"
                    value={data.endTime || ""}
                    onChange={(e) => handleFieldChange("endTime", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="advanceBooking" className="block text-sm font-medium">
                Advance Booking Required
              </label>
              <div className="relative">
                <select
                  id="advanceBooking"
                  value={data.advanceBooking || ""}
                  onChange={(e) => handleFieldChange("advanceBooking", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select advance booking</option>
                  <option value="same_day">Same Day</option>
                  <option value="1_day">1 Day</option>
                  <option value="2_3_days">2-3 Days</option>
                  <option value="1_week">1 Week</option>
                  <option value="2_weeks">2 Weeks</option>
                  <option value="1_month">1 Month</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="sessionDuration" className="block text-sm font-medium">
                Session Duration
              </label>
              <div className="relative">
                <select
                  id="sessionDuration"
                  value={data.sessionDuration || ""}
                  onChange={(e) => handleFieldChange("sessionDuration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select session duration</option>
                  <option value="30_min">30 Minutes</option>
                  <option value="1_hour">1 Hour</option>
                  <option value="2_hours">2 Hours</option>
                  <option value="half_day">Half Day</option>
                  <option value="full_day">Full Day</option>
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("Pricing")}>
          <h3 className="text-base font-medium">Pricing</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transform transition-transform ${
              openSections["Pricing"] ? "rotate-180" : ""
            }`}
          />
        </div>

        {openSections["Pricing"] && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label htmlFor="pricingType" className="block text-sm font-medium">
                Pricing Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="pricingType"
                  value={data.pricingType || ""}
                  onChange={(e) => handleFieldChange("pricingType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select pricing type</option>
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed</option>
                  <option value="negotiable">Negotiable</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            {data.pricingType === "hourly" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="hourlyRate" className="block text-sm font-medium">
                    Hourly Rate
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">ETB</span>
                    </div>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={data.hourlyRate || ""}
                      onChange={(e) => handleFieldChange("hourlyRate", e.target.value)}
                      placeholder="Enter hourly rate"
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="timeEstimation" className="block text-sm font-medium">
                    Time Estimation
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="timeEstimation"
                      value={data.timeEstimation || ""}
                      onChange={(e) => handleFieldChange("timeEstimation", e.target.value)}
                      placeholder="Enter time estimation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <select
                      id="timeUnit"
                      value={data.timeUnit || ""}
                      onChange={(e) => handleFieldChange("timeUnit", e.target.value)}
                      className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                    >
                      <option value="">Select unit</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {data.pricingType === "fixed" && (
              <div className="space-y-1">
                <label htmlFor="fixedPrice" className="block text-sm font-medium">
                  Fixed Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">ETB</span>
                  </div>
                  <input
                    type="number"
                    id="fixedPrice"
                    value={data.fixedPrice || ""}
                    onChange={(e) => handleFieldChange("fixedPrice", e.target.value)}
                    placeholder="Enter fixed price"
                    className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="cancellationPolicy" className="block text-sm font-medium">
                Cancellation Policy <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="cancellationPolicy"
                  value={data.cancellationPolicy || ""}
                  onChange={(e) => handleFieldChange("cancellationPolicy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select policy</option>
                  <option value="flexible">Flexible (Full refund if canceled 24 hours before)</option>
                  <option value="moderate">Moderate (Full refund if canceled 3 days before)</option>
                  <option value="strict">Strict (50% refund if canceled 7 days before)</option>
                  <option value="nonRefundable">Non-refundable</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptCash"
                checked={data.acceptCash || false}
                onChange={(e) => handleFieldChange("acceptCash", e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptCash" className="ml-2 block text-sm text-gray-700">
                Willing to accept cash payments
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </button>
        )}

        <div className="flex space-x-4">
          <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
            Cancel
          </button>

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
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
