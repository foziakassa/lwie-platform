import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ServiceFormData {
  duration: string
  detailedDescription: string
  pricingType: string
  hourlyRate: string
  timeEstimation: string
  timeUnit: string
  availableDays: string[]
  startTime: string
  endTime: string
  skills: string[]
  experienceLevel: string
  portfolioLink: string
}

interface PostServiceFormProps {
  data: ServiceFormData
  updateData: (data: Partial<ServiceFormData>) => void
  onNext: () => void
  onPrevious: () => void
  onSaveDraft: () => void
  currentStep: number
  onSubmit: () => void
}

export default function PostServiceForm({
  data,
  updateData,
  onNext,
  onPrevious,
  onSaveDraft,
}: PostServiceFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ServiceFormData>({
    duration: data.duration || "1 hour per session",
    detailedDescription: data.detailedDescription || "Learn guitar from scratch or improve your skills.",
    pricingType: data.pricingType || "hourly",
    hourlyRate: data.hourlyRate || "5000",
    timeEstimation: data.timeEstimation || "1",
    timeUnit: data.timeUnit || "hour",
    availableDays: data.availableDays || ["Monday", "Wednesday", "Friday"],
    startTime: data.startTime || "09:00",
    endTime: data.endTime || "17:00",
    skills: data.skills || ["Guitar", "Music Theory"],
    experienceLevel: data.experienceLevel || "Advanced",
    portfolioLink: data.portfolioLink || "",
  })
  const [newSkill, setNewSkill] = useState("")

  // Sync form data with parent
  useEffect(() => {
    updateData(formData)
  }, [formData, updateData])

  const handleChange = (field: keyof ServiceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }))
    setNewSkill("")
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const validateForm = (): boolean => {
    return (
      formData.duration.trim() !== "" &&
      formData.detailedDescription.trim() !== "" &&
      formData.pricingType !== "" &&
      (formData.pricingType !== "hourly" || formData.hourlyRate !== "0") &&
      formData.timeEstimation !== "" &&
      formData.timeUnit !== "" &&
      formData.availableDays.length > 0 &&
      formData.startTime !== "" &&
      formData.endTime !== "" &&
      formData.skills.length > 0 &&
      formData.experienceLevel !== ""
    )
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

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Service Details</h2>
        <p className="text-sm text-gray-500">Step 2 of 4: Details</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="duration" className="block text-sm font-medium">
            Duration per Session <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="duration"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="e.g., 1 hour per session"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="detailedDescription" className="block text-sm font-medium">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="detailedDescription"
            value={formData.detailedDescription}
            onChange={(e) => handleChange("detailedDescription", e.target.value)}
            placeholder="Provide more details about your service..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
            maxLength={2000}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Pricing Type <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="hourly"
                name="pricingType"
                value="hourly"
                checked={formData.pricingType === "hourly"}
                onChange={(e) => handleChange("pricingType", e.target.value)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <label htmlFor="hourly" className="ml-2 block text-sm text-gray-700">
                Hourly Rate
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="fixed"
                name="pricingType"
                value="fixed"
                checked={formData.pricingType === "fixed"}
                onChange={(e) => handleChange("pricingType", e.target.value)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <label htmlFor="fixed" className="ml-2 block text-sm text-gray-700">
                Fixed Price
              </label>
            </div>
          </div>
        </div>

        {formData.pricingType === "hourly" && (
          <div className="space-y-1">
            <label htmlFor="hourlyRate" className="block text-sm font-medium">
              Hourly Rate (ETB) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="hourlyRate"
              value={formData.hourlyRate}
              onChange={(e) => handleChange("hourlyRate", e.target.value)}
              placeholder="e.g., 5000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="timeEstimation" className="block text-sm font-medium">
            Estimated Time <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              id="timeEstimation"
              value={formData.timeEstimation}
              onChange={(e) => handleChange("timeEstimation", e.target.value)}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <div className="relative w-2/3">
              <select
                id="timeUnit"
                title="Time Unit"
                value={formData.timeUnit}
                onChange={(e) => handleChange("timeUnit", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select unit</option>
                <option value="hour">Hour(s)</option>
                <option value="day">Day(s)</option>
                <option value="week">Week(s)</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Available Days <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  formData.availableDays.includes(day)
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
              Start Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="time"
                id="startTime"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="endTime" className="block text-sm font-medium">
              End Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="time"
                id="endTime"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Skills <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-teal-600 hover:text-teal-800"
                >
                  ✕
                </button>
              </div>
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
              value={formData.experienceLevel}
              onChange={(e) => handleChange("experienceLevel", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
            >
              <option value="">Select experience level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="portfolioLink" className="block text-sm font-medium">
            Portfolio Link (Optional)
          </label>
          <input
            type="url"
            id="portfolioLink"
            value={formData.portfolioLink}
            onChange={(e) => handleChange("portfolioLink", e.target.value)}
            placeholder="e.g., https://yourportfolio.com"
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