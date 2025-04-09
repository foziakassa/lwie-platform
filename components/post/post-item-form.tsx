"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ChevronRight, MapPin, Tag } from "lucide-react"
import Link from "next/link"
import DynamicFields from "./dynamic-fields"
import ImageUploader from "./image-uploader"

// Add the import statements for the specification components
import VehicleSpecifications from "./vehicle-specifications"
import LaptopSpecifications from "./laptop-specifications"

interface PostItemFormProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onPrevious?: () => void
  onSaveDraft: () => void
  currentStep: number
}

export default function PostItemForm({
  data,
  updateData,
  onNext,
  onPrevious,
  onSaveDraft,
  currentStep,
}: PostItemFormProps) {
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

  // Define the dynamic fields for item details
  const itemFieldGroups = [
    {
      title: "Basic Information",
      fields: [
        {
          id: "brand",
          label: "Brand",
          type: "select" as const,
          required: true,
          options: [
            { value: "", label: "Select an option" },
            { value: "apple", label: "Apple" },
            { value: "samsung", label: "Samsung" },
            { value: "google", label: "Google" },
            { value: "xiaomi", label: "Xiaomi" },
            { value: "huawei", label: "Huawei" },
            { value: "oppo", label: "OPPO" },
            { value: "vivo", label: "Vivo" },
            { value: "nokia", label: "Nokia" },
            { value: "motorola", label: "Motorola" },
            { value: "lg", label: "LG" },
            { value: "sony", label: "Sony" },
            { value: "other", label: "Other" },
          ],
          helpText: "Select the brand of your mobile phone",
        },
        {
          id: "model",
          label: "Model",
          type: "select" as const,
          required: true,
          options: [
            { value: "", label: "Select an option" },
            // Apple models
            ...(data.brand === "apple"
              ? [
                  { value: "iphone_15_pro_max", label: "iPhone 15 Pro Max" },
                  { value: "iphone_15_pro", label: "iPhone 15 Pro" },
                  { value: "iphone_15_plus", label: "iPhone 15 Plus" },
                  { value: "iphone_15", label: "iPhone 15" },
                  { value: "iphone_14_pro_max", label: "iPhone 14 Pro Max" },
                  { value: "iphone_14_pro", label: "iPhone 14 Pro" },
                  { value: "iphone_14_plus", label: "iPhone 14 Plus" },
                  { value: "iphone_14", label: "iPhone 14" },
                  { value: "iphone_13_pro_max", label: "iPhone 13 Pro Max" },
                  { value: "iphone_13_pro", label: "iPhone 13 Pro" },
                  { value: "iphone_13", label: "iPhone 13" },
                  { value: "iphone_13_mini", label: "iPhone 13 Mini" },
                  { value: "iphone_12_pro_max", label: "iPhone 12 Pro Max" },
                  { value: "iphone_12_pro", label: "iPhone 12 Pro" },
                  { value: "iphone_12", label: "iPhone 12" },
                  { value: "iphone_12_mini", label: "iPhone 12 Mini" },
                  { value: "iphone_se_2022", label: "iPhone SE (2022)" },
                  { value: "iphone_11_pro_max", label: "iPhone 11 Pro Max" },
                  { value: "iphone_11_pro", label: "iPhone 11 Pro" },
                  { value: "iphone_11", label: "iPhone 11" },
                  { value: "iphone_other", label: "Other iPhone Model" },
                ]
              : []),
            // Samsung models
            ...(data.brand === "samsung"
              ? [
                  { value: "galaxy_s24_ultra", label: "Galaxy S24 Ultra" },
                  { value: "galaxy_s24_plus", label: "Galaxy S24+" },
                  { value: "galaxy_s24", label: "Galaxy S24" },
                  { value: "galaxy_s23_ultra", label: "Galaxy S23 Ultra" },
                  { value: "galaxy_s23_plus", label: "Galaxy S23+" },
                  { value: "galaxy_s23", label: "Galaxy S23" },
                  { value: "galaxy_s22_ultra", label: "Galaxy S22 Ultra" },
                  { value: "galaxy_s22_plus", label: "Galaxy S22+" },
                  { value: "galaxy_s22", label: "Galaxy S22" },
                  { value: "galaxy_s21_ultra", label: "Galaxy S21 Ultra" },
                  { value: "galaxy_s21_plus", label: "Galaxy S21+" },
                  { value: "galaxy_s21", label: "Galaxy S21" },
                  { value: "galaxy_s21_fe", label: "Galaxy S21 FE" },
                  { value: "galaxy_a54", label: "Galaxy A54" },
                  { value: "galaxy_a53", label: "Galaxy A53" },
                  { value: "galaxy_a34", label: "Galaxy A34" },
                  { value: "galaxy_a33", label: "Galaxy A33" },
                  { value: "galaxy_a23", label: "Galaxy A23" },
                  { value: "galaxy_a14", label: "Galaxy A14" },
                  { value: "galaxy_a13", label: "Galaxy A13" },
                  { value: "galaxy_other", label: "Other Galaxy Model" },
                ]
              : []),
            // Google models
            ...(data.brand === "google"
              ? [
                  { value: "pixel_8_pro", label: "Pixel 8 Pro" },
                  { value: "pixel_8", label: "Pixel 8" },
                  { value: "pixel_7_pro", label: "Pixel 7 Pro" },
                  { value: "pixel_7", label: "Pixel 7" },
                  { value: "pixel_7a", label: "Pixel 7a" },
                  { value: "pixel_6_pro", label: "Pixel 6 Pro" },
                  { value: "pixel_6", label: "Pixel 6" },
                  { value: "pixel_6a", label: "Pixel 6a" },
                  { value: "pixel_5", label: "Pixel 5" },
                  { value: "pixel_5a", label: "Pixel 5a" },
                  { value: "pixel_4a", label: "Pixel 4a" },
                  { value: "pixel_4", label: "Pixel 4" },
                  { value: "pixel_other", label: "Other Pixel Model" },
                ]
              : []),
            // Xiaomi models
            ...(data.brand === "xiaomi"
              ? [
                  { value: "xiaomi_13_pro", label: "Xiaomi 13 Pro" },
                  { value: "xiaomi_13", label: "Xiaomi 13" },
                  { value: "xiaomi_12_pro", label: "Xiaomi 12 Pro" },
                  { value: "xiaomi_12", label: "Xiaomi 12" },
                  { value: "xiaomi_12t_pro", label: "Xiaomi 12T Pro" },
                  { value: "xiaomi_12t", label: "Xiaomi 12T" },
                  { value: "redmi_note_12_pro_plus", label: "Redmi Note 12 Pro+" },
                  { value: "redmi_note_12_pro", label: "Redmi Note 12 Pro" },
                  { value: "redmi_note_12", label: "Redmi Note 12" },
                  { value: "poco_f5_pro", label: "POCO F5 Pro" },
                  { value: "poco_f5", label: "POCO F5" },
                  { value: "poco_x5_pro", label: "POCO X5 Pro" },
                  { value: "poco_x5", label: "POCO X5" },
                  { value: "xiaomi_other", label: "Other Xiaomi Model" },
                ]
              : []),
            // Default option for other brands or when no brand is selected
            ...(!data.brand || data.brand === "other" || !["apple", "samsung", "google", "xiaomi"].includes(data.brand)
              ? [{ value: "other_model", label: "Other Model" }]
              : []),
          ],
          helpText: "Select the model of your mobile phone",
        },
      ],
    },
    {
      title: "Specifications",
      fields: [
        {
          id: "storage",
          label: "Storage",
          type: "select" as const,
          required: true,
          options: [
            { value: "", label: "Select storage capacity" },
            { value: "16", label: "16GB" },
            { value: "32", label: "32GB" },
            { value: "64", label: "64GB" },
            { value: "128", label: "128GB" },
            { value: "256", label: "256GB" },
            { value: "512", label: "512GB" },
            { value: "1024", label: "1TB" },
            { value: "2048", label: "2TB" },
          ],
          helpText: "Select the storage capacity of your device",
        },
        {
          id: "ram",
          label: "RAM",
          type: "select" as const,
          options: [
            { value: "", label: "Select RAM capacity" },
            { value: "1", label: "1GB" },
            { value: "2", label: "2GB" },
            { value: "3", label: "3GB" },
            { value: "4", label: "4GB" },
            { value: "6", label: "6GB" },
            { value: "8", label: "8GB" },
            { value: "12", label: "12GB" },
            { value: "16", label: "16GB" },
          ],
        },
        {
          id: "processor",
          label: "Processor",
          type: "select" as const,
          options: [
            { value: "", label: "Select processor" },
            { value: "apple_a17", label: "Apple A17 Bionic" },
            { value: "apple_a16", label: "Apple A16 Bionic" },
            { value: "apple_a15", label: "Apple A15 Bionic" },
            { value: "apple_a14", label: "Apple A14 Bionic" },
            { value: "snapdragon_8_gen_3", label: "Snapdragon 8 Gen 3" },
            { value: "snapdragon_8_gen_2", label: "Snapdragon 8 Gen 2" },
            { value: "snapdragon_8_gen_1", label: "Snapdragon 8 Gen 1" },
            { value: "snapdragon_888", label: "Snapdragon 888" },
            { value: "exynos_2400", label: "Exynos 2400" },
            { value: "exynos_2200", label: "Exynos 2200" },
            { value: "dimensity_9300", label: "MediaTek Dimensity 9300" },
            { value: "dimensity_9200", label: "MediaTek Dimensity 9200" },
            { value: "other_processor", label: "Other" },
          ],
        },
        {
          id: "operatingSystem",
          label: "Operating System",
          type: "select" as const,
          options: [
            { value: "", label: "Select OS" },
            { value: "ios_17", label: "iOS 17" },
            { value: "ios_16", label: "iOS 16" },
            { value: "ios_15", label: "iOS 15" },
            { value: "ios_14", label: "iOS 14" },
            { value: "android_14", label: "Android 14" },
            { value: "android_13", label: "Android 13" },
            { value: "android_12", label: "Android 12" },
            { value: "android_11", label: "Android 11" },
            { value: "other_os", label: "Other" },
          ],
        },
        {
          id: "batteryCapacity",
          label: "Battery Capacity",
          type: "select" as const,
          options: [
            { value: "", label: "Select battery capacity" },
            { value: "less_than_3000", label: "Less than 3000 mAh" },
            { value: "3000_to_4000", label: "3000-4000 mAh" },
            { value: "4000_to_5000", label: "4000-5000 mAh" },
            { value: "more_than_5000", label: "More than 5000 mAh" },
            { value: "unknown", label: "Unknown" },
          ],
        },
      ],
    },
    {
      title: "Appearance",
      fields: [
        {
          id: "color",
          label: "Color",
          type: "select" as const,
          options: [
            { value: "", label: "Select color" },
            { value: "black", label: "Black" },
            { value: "white", label: "White" },
            { value: "silver", label: "Silver" },
            { value: "gray", label: "Gray" },
            { value: "gold", label: "Gold" },
            { value: "rose_gold", label: "Rose Gold" },
            { value: "blue", label: "Blue" },
            { value: "red", label: "Red" },
            { value: "green", label: "Green" },
            { value: "purple", label: "Purple" },
            { value: "yellow", label: "Yellow" },
            { value: "orange", label: "Orange" },
            { value: "other_color", label: "Other" },
          ],
        },
        {
          id: "screenSize",
          label: "Screen Size",
          type: "select" as const,
          options: [
            { value: "", label: "Select screen size" },
            { value: "less_than_5", label: "Less than 5 inches" },
            { value: "5_to_6", label: "5-6 inches" },
            { value: "6_to_6.5", label: "6-6.5 inches" },
            { value: "6.5_to_7", label: "6.5-7 inches" },
            { value: "more_than_7", label: "More than 7 inches" },
          ],
        },
        {
          id: "screenType",
          label: "Screen Type",
          type: "select" as const,
          options: [
            { value: "", label: "Select screen type" },
            { value: "lcd", label: "LCD" },
            { value: "oled", label: "OLED" },
            { value: "amoled", label: "AMOLED" },
            { value: "super_amoled", label: "Super AMOLED" },
            { value: "retina", label: "Retina" },
            { value: "super_retina", label: "Super Retina" },
            { value: "other_screen", label: "Other" },
          ],
        },
      ],
    },
    {
      title: "Condition",
      fields: [
        {
          id: "usageTime",
          label: "Usage Time",
          type: "select" as const,
          required: true,
          options: [
            { value: "", label: "Select usage time" },
            { value: "less_than_6_months", label: "Less than 6 months" },
            { value: "6_to_12_months", label: "6-12 months" },
            { value: "1_to_2_years", label: "1-2 years" },
            { value: "2_to_3_years", label: "2-3 years" },
            { value: "more_than_3_years", label: "More than 3 years" },
          ],
        },
        {
          id: "batteryHealth",
          label: "Battery Health",
          type: "select" as const,
          options: [
            { value: "", label: "Select battery health" },
            { value: "excellent", label: "Excellent (90-100%)" },
            { value: "good", label: "Good (80-89%)" },
            { value: "fair", label: "Fair (70-79%)" },
            { value: "poor", label: "Poor (below 70%)" },
            { value: "unknown", label: "Unknown" },
          ],
        },
        {
          id: "screenCondition",
          label: "Screen Condition",
          type: "select" as const,
          required: true,
          options: [
            { value: "", label: "Select screen condition" },
            { value: "perfect", label: "Perfect (No scratches)" },
            { value: "excellent", label: "Excellent (Minor scratches, not visible when screen is on)" },
            { value: "good", label: "Good (Some scratches, barely visible when screen is on)" },
            { value: "fair", label: "Fair (Noticeable scratches)" },
            { value: "poor", label: "Poor (Cracks or major scratches)" },
          ],
        },
        {
          id: "bodyCondition",
          label: "Body Condition",
          type: "select" as const,
          required: true,
          options: [
            { value: "", label: "Select body condition" },
            { value: "perfect", label: "Perfect (No scratches or dents)" },
            { value: "excellent", label: "Excellent (Minor scratches, barely visible)" },
            { value: "good", label: "Good (Some scratches, no dents)" },
            { value: "fair", label: "Fair (Noticeable scratches or minor dents)" },
            { value: "poor", label: "Poor (Major scratches or dents)" },
          ],
        },
        {
          id: "functionalIssues",
          label: "Functional Issues",
          type: "textarea" as const,
          placeholder: "Describe any functional issues (e.g., battery drains quickly, camera not working properly)",
        },
      ],
    },
    {
      title: "Accessories",
      fields: [
        {
          id: "includesCharger",
          label: "Includes Charger",
          type: "checkbox" as const,
        },
        {
          id: "includesBox",
          label: "Includes Original Box",
          type: "checkbox" as const,
        },
        {
          id: "includesHeadphones",
          label: "Includes Headphones",
          type: "checkbox" as const,
        },
        {
          id: "includesCase",
          label: "Includes Case",
          type: "checkbox" as const,
        },
        {
          id: "includesScreenProtector",
          label: "Includes Screen Protector",
          type: "checkbox" as const,
        },
        {
          id: "otherAccessories",
          label: "Other Accessories",
          type: "text" as const,
          placeholder: "List any other accessories included",
        },
      ],
    },
    {
      title: "Purchase History",
      fields: [
        {
          id: "purchaseDate",
          label: "Purchase Date",
          type: "select" as const,
          options: [
            { value: "", label: "Select purchase date" },
            { value: "less_than_6_months", label: "Less than 6 months ago" },
            { value: "6_to_12_months", label: "6-12 months ago" },
            { value: "1_to_2_years", label: "1-2 years ago" },
            { value: "2_to_3_years", label: "2-3 years ago" },
            { value: "more_than_3_years", label: "More than 3 years ago" },
          ],
        },
        {
          id: "warranty",
          label: "Warranty Status",
          type: "select" as const,
          options: [
            { value: "", label: "Select warranty status" },
            { value: "under_warranty", label: "Under Warranty" },
            { value: "expired", label: "Expired" },
            { value: "no_warranty", label: "No Warranty" },
            { value: "unknown", label: "Unknown" },
          ],
        },
        {
          id: "purchaseReceipt",
          label: "Purchase Receipt Available",
          type: "checkbox" as const,
        },
        {
          id: "originalOwner",
          label: "Original Owner",
          type: "checkbox" as const,
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

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Basic Information</h2>
        {!onPrevious && <p className="text-sm text-gray-500">Step 1 of 4: Basic Info</p>}
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="title" className="block text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-500">{titleCharCount}/100</span>
          </div>
          <input
            type="text"
            id="title"
            value={data.title || ""}
            onChange={handleTitleChange}
            placeholder="Enter a descriptive item title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            maxLength={100}
          />
          <p className="text-xs text-gray-500">Be specific and include important details</p>
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
                <option value="Electronics">Electronics</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Vehicles">Vehicles</option>
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
                onChange={(e) => handleFieldChange("subcategory", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select a subcategory</option>
                {data.category === "Electronics" && (
                  <>
                    <option value="Mobile Phones">Mobile Phones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="TVs">TVs</option>
                    <option value="Audio">Audio</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Computer Accessories">Computer Accessories</option>
                    <option value="Other Electronics">Other Electronics</option>
                  </>
                )}
                {data.category === "Home Appliances" && (
                  <>
                    <option value="Refrigerators">Refrigerators</option>
                    <option value="Washing Machines">Washing Machines</option>
                    <option value="Air Conditioners">Air Conditioners</option>
                    <option value="Kitchen Appliances">Kitchen Appliances</option>
                    <option value="Vacuum Cleaners">Vacuum Cleaners</option>
                    <option value="Other Appliances">Other Appliances</option>
                  </>
                )}
                {data.category === "Furniture" && (
                  <>
                    <option value="Sofas">Sofas</option>
                    <option value="Beds">Beds</option>
                    <option value="Tables">Tables</option>
                    <option value="Chairs">Chairs</option>
                    <option value="Wardrobes">Wardrobes</option>
                    <option value="Shelves">Shelves</option>
                    <option value="Other Furniture">Other Furniture</option>
                  </>
                )}
                {data.category === "Vehicles" && (
                  <>
                    <option value="Cars">Cars</option>
                    <option value="Motorcycles">Motorcycles</option>
                    <option value="Trucks">Trucks</option>
                    <option value="Buses">Buses</option>
                    <option value="Commercial Vehicles">Commercial Vehicles</option>
                    <option value="Vehicle Parts">Vehicle Parts</option>
                    <option value="Boats">Boats</option>
                    <option value="Other Vehicles">Other Vehicles</option>
                  </>
                )}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {data.category === "Electronics" && data.subcategory === "Mobile Phones" && (
          <div className="bg-teal-50 p-4 rounded-md border border-teal-200">
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-teal-600 mr-2" />
              <h3 className="text-sm font-medium text-teal-700">Mobile Phones Selected</h3>
            </div>
            <p className="text-xs text-teal-600 mt-1 ml-7">Continue to add specific details about your item</p>
            <div className="mt-3 ml-7">
              <button
                type="button"
                onClick={() => onNext()}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              >
                Continue to Specifications
                <ChevronRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="condition" className="block text-sm font-medium">
            Condition <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="condition"
              value={data.condition || ""}
              onChange={(e) => updateData({ condition: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 h-4 w-4 text-gray-500" />
          </div>
          <p className="text-xs text-gray-500">Be honest about the condition to build trust with potential swappers</p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="description" className="block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-500">{descriptionCharCount}/2000</span>
          </div>
          <textarea
            id="description"
            value={data.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Provide a detailed description of your item..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
            maxLength={2000}
          />
          <p className="text-xs text-gray-500">Include brand, model, dimensions, age, and any defects</p>
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hideExactAddress"
            checked={data.hideExactAddress || false}
            onChange={(e) => updateData({ hideExactAddress: e.target.checked })}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="hideExactAddress" className="ml-2 block text-sm text-gray-700">
            Hide exact address for privacy
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Images <span className="text-red-500">*</span>
          </label>
          <ImageUploader maxImages={5} onChange={handleImageChange} existingImages={data.images || []} />
        </div>

        {data.category === "Electronics" && data.subcategory === "Mobile Phones" && (
          <DynamicFields fieldGroups={itemFieldGroups} values={data} onChange={handleFieldChange} />
        )}

        {data.category === "Electronics" && data.subcategory === "Laptops" && (
          <LaptopSpecifications data={data} updateData={updateData} />
        )}

        {data.category === "Vehicles" && (data.subcategory === "Cars" || data.subcategory === "Motorcycles") && (
          <VehicleSpecifications data={data} updateData={updateData} vehicleType={data.subcategory} />
        )}
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

