import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ItemFormData {
  material: string
  color: string
  dimensions: string
  seatingCapacity: string
  age: string
  reasonForSelling: string
}

interface PostItemFormProps {
  data: ItemFormData
  updateData: (data: Partial<ItemFormData>) => void
  onNext: () => void
  onPrevious: () => void
  onSaveDraft: () => void
  currentStep: number
  onSubmit: () => void
}

export default function PostItemForm({
  data,
  updateData,
  onNext,
  onPrevious,
  onSaveDraft,
}: PostItemFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ItemFormData>({
    material: data.material || "Genuine leather",
    color: data.color || "Brown",
    dimensions: data.dimensions || "200cm x 90cm x 85cm",
    seatingCapacity: data.seatingCapacity || "3 people",
    age: data.age || "2 years",
    reasonForSelling: data.reasonForSelling || "Moving abroad",
  })

  // Sync form data with parent
  useEffect(() => {
    updateData(formData)
  }, [formData, updateData])

  const handleChange = (field: keyof ItemFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const requiredFields: (keyof ItemFormData)[] = [
      "material",
      "color",
      "dimensions",
      "seatingCapacity",
      "age",
      "reasonForSelling",
    ]
    return requiredFields.every((field) => formData[field].trim() !== "")
  }

  const handleNextStep = () => {
    if (!validateForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Item Details</h2>
        <p className="text-sm text-gray-500">Step 2 of 4: Details</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="material" className="block text-sm font-medium">
            Material <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="material"
            value={formData.material}
            onChange={(e) => handleChange("material", e.target.value)}
            placeholder="e.g., Genuine leather"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="color" className="block text-sm font-medium">
            Color <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="color"
            value={formData.color}
            onChange={(e) => handleChange("color", e.target.value)}
            placeholder="e.g., Brown"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="dimensions" className="block text-sm font-medium">
            Dimensions <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => handleChange("dimensions", e.target.value)}
            placeholder="e.g., 200cm x 90cm x 85cm"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="seatingCapacity" className="block text-sm font-medium">
            Seating Capacity <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="seatingCapacity"
            value={formData.seatingCapacity}
            onChange={(e) => handleChange("seatingCapacity", e.target.value)}
            placeholder="e.g., 3 people"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="age" className="block text-sm font-medium">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="age"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="e.g., 2 years"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="reasonForSelling" className="block text-sm font-medium">
            Reason for Selling <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="reasonForSelling"
            value={formData.reasonForSelling}
            onChange={(e) => handleChange("reasonForSelling", e.target.value)}
            placeholder="e.g., Moving abroad"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
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
            onClick={handleNextStep}
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