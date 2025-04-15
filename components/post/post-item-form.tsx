"use client"

import { useState } from "react"
import { ArrowLeft, ChevronRight, MapPin, Tag } from "lucide-react"
import Link from "next/link"
import DynamicFields from "./dynamic-fields"
import ImageUploader from "./image-uploader"
import VehicleSpecifications from "./vehicle-specifications"
import LaptopSpecifications from "./laptop-specifications"
import api from "../../lib/axios"
import { useToast } from "../../hooks/use-toast"

interface PostItemFormProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onPrevious?: () => void
  onSaveDraft: () => void
  currentStep: number
  onSubmit?: () => void
}

export default function PostItemForm({
  data,
  updateData,
  onNext,
  onPrevious,
  onSaveDraft,
  currentStep,
  onSubmit,
}: PostItemFormProps) {
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
    const update: any = { [id]: value }
    
    if (id === "brand" || id === "model" || id === "year") {
      update.specifications = {
        ...data.specifications,
        [id]: value
      }
    }

    updateData(update)

    if ((id === "category" || id === "subcategory") && data.category && data.subcategory && currentStep === 1) {
      onNext()
    }
  }

  const handleSubmit = async () => {
    if (!data.title || !data.category || !data.condition || !data.location) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Map category name to category_id
      const categoryMap: Record<string, number> = {
        "Electronics": 1,
        "Furniture": 2,
        "Vehicles": 3,
        "Clothing": 4,
        "Home Appliances": 5
      }

      const itemData = {
        user_id: data.user_id || 1, // Default to 1 if not provided
        title: data.title,
        category_id: categoryMap[data.category] || 1,
        description: data.description,
        condition: data.condition,
        location: data.location,
        trade_type: data.trade_type || 'itemForItem',
        accept_cash: data.accept_cash || false,
        brand: data.specifications?.brand,
        model: data.specifications?.model,
        year: data.specifications?.year,
        specifications: data.specifications,
        images: data.images || []
      }

      const response = await api.post('/api/items', itemData)
      
      toast({
        title: "Item created",
        description: "Your item has been successfully posted.",
        variant: "default",
      })

      if (onSubmit) {
        onSubmit()
      } else {
        onNext()
      }
    } catch (error: any) {
      console.error('Error creating item:', error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "There was an error creating your item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Define the dynamic fields for item details
  const itemFieldGroups: Array<any> = [
    // Placeholder for existing field groups, to be filled as per original code or requirements
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
          <div className="text-sm text-gray-500">Step {currentStep} of 4: Basic Info</div>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Basic Information</h2>
        {!onPrevious && <p className="text-sm text-gray-500">Step {currentStep} of 4: Basic Info</p>}
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
          <ImageUploader 
            maxImages={5} 
            onChange={handleImageChange} 
            existingImages={data.images?.map((img: any) => img.url) || []} 
          />
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
            onClick={onSubmit ? handleSubmit : onNext}
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSubmitting ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {isSubmitting ? 'Posting...' : (onSubmit ? 'Post Item' : 'Next Step')}
            {!isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
