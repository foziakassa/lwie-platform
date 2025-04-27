"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Info, Check, MapPin, ChevronDown, ChevronRight, Clock, HelpCircle, Tag } from "lucide-react"
import { useDraftSave } from "@/hooks/use-draft-save"
import ProgressSteps from "@/components/post/progress-steps"
import PostItemForm from "@/components/post/post-item-form"
import PostServiceForm from "@/components/post/post-service-form"
import TradeOptions from "@/components/post/trade-options"
import PostReview from "@/components/post/post-review"
import { PostCounter } from "@/components/post-counter"
import { useToast } from "@/hooks/use-toast"

// Define types for form data and post structure
interface ItemFormData {
  title: string
  category: string
  subcategory: string
  condition: string
  description: string
  location: string
  hideExactAddress: boolean
  tradeType: string
  considerCashPayments: boolean
  agreeToTerms: boolean
  material?: string
  color?: string
  dimensions?: string
  seatingCapacity?: string
  age?: string
  reasonForSelling?: string
  price?: number
}

interface ServiceFormData {
  title: string
  category: string
  subcategory: string
  description: string
  location: string
  locationType: string
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
  tradeType: string
  interestedItems: string
  preferredCategories: string[]
  acceptCash: boolean
  cancellationPolicy: string
  agreeToTerms: boolean
}

export default function CreatePostDemo({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const [postType, setPostType] = useState<"item" | "service">("item")
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Use draft saves for item and service
  const {
    data: itemData,
    updateData: updateItemData,
    saveDraft: saveItemDraft,
    lastSaved: itemLastSaved,
  } = useDraftSave("post_item", {
    title: "",
    category: "",
    subcategory: "",
    condition: "",
    description: "",
    location: "",
    hideExactAddress: false,
    tradeType: "",
    considerCashPayments: false,
    agreeToTerms: false,
    material: "",
    color: "",
    dimensions: "",
    seatingCapacity: "",
    age: "",
    reasonForSelling: "",
    price: 0,
  })

  const {
    data: serviceData,
    updateData: updateServiceData,
    saveDraft: saveServiceDraft,
    lastSaved: serviceLastSaved,
  } = useDraftSave("post_service", {
    title: "",
    category: "",
    subcategory: "",
    description: "",
    location: "",
    locationType: "",
    duration: "",
    detailedDescription: "",
    pricingType: "hourly",
    hourlyRate: "0",
    timeEstimation: "1",
    timeUnit: "",
    availableDays: [],
    startTime: "",
    endTime: "",
    skills: [],
    experienceLevel: "",
    portfolioLink: "",
    tradeType: "",
    interestedItems: "",
    preferredCategories: [],
    acceptCash: false,
    cancellationPolicy: "",
    agreeToTerms: false,
  })

  // Form state management
  const [itemForm, setItemForm] = useState<ItemFormData>({
    title: itemData.title || "Comfortable Leather Sofa",
    category: itemData.category || "Furniture",
    subcategory: itemData.subcategory || "Sofas",
    condition: itemData.condition || "Used",
    description: itemData.description || "Beautiful and comfortable leather sofa in excellent condition. Perfect for your living room or office reception area.",
    location: itemData.location || "Addis Ababa",
    hideExactAddress: itemData.hideExactAddress || false,
    tradeType: itemData.tradeType || "Swap",
    considerCashPayments: itemData.considerCashPayments || false,
    agreeToTerms: itemData.agreeToTerms || false,
    material: itemData.material || "Genuine leather",
    color: itemData.color || "Brown",
    dimensions: itemData.dimensions || "200cm x 90cm x 85cm",
    seatingCapacity: itemData.seatingCapacity || "3 people",
    age: itemData.age || "2 years",
    reasonForSelling: itemData.reasonForSelling || "Moving abroad",
    price: itemData.price || 10500,
  })

  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    title: serviceData.title || "Guitar Lessons",
    category: serviceData.category || "Tutoring",
    subcategory: serviceData.subcategory || "Music",
    description: serviceData.description || "Beginner to advanced guitar lessons by an experienced tutor.",
    location: serviceData.location || "Addis Ababa",
    locationType: serviceData.locationType || "atMyLocation",
    duration: serviceData.duration || "1 hour per session",
    detailedDescription: serviceData.detailedDescription || "Learn guitar from scratch or improve your skills.",
    pricingType: serviceData.pricingType || "hourly",
    hourlyRate: serviceData.hourlyRate || "5000",
    timeEstimation: serviceData.timeEstimation || "1",
    timeUnit: serviceData.timeUnit || "hour",
    availableDays: serviceData.availableDays || ["Monday", "Wednesday", "Friday"],
    startTime: serviceData.startTime || "09:00",
    endTime: serviceData.endTime || "17:00",
    skills: serviceData.skills || ["Guitar", "Music Theory"],
    experienceLevel: serviceData.experienceLevel || "Advanced",
    portfolioLink: serviceData.portfolioLink || "",
    tradeType: serviceData.tradeType || "Swap",
    interestedItems: serviceData.interestedItems || "",
    preferredCategories: serviceData.preferredCategories || [],
    acceptCash: serviceData.acceptCash || false,
    cancellationPolicy: serviceData.cancellationPolicy || "24-hour notice required",
    agreeToTerms: serviceData.agreeToTerms || false,
  })

  // Character counts
  const [itemTitleCharCount, setItemTitleCharCount] = useState(itemForm.title.length)
  const [itemDescriptionCharCount, setItemDescriptionCharCount] = useState(itemForm.description.length)
  const [serviceTitleCharCount, setServiceTitleCharCount] = useState(serviceForm.title.length)
  const [serviceDescriptionCharCount, setServiceDescriptionCharCount] = useState(serviceForm.description.length)

  // Sync form data with draft
  useEffect(() => {
    if (postType === "item") {
      updateItemData(itemForm)
    } else {
      updateServiceData(serviceForm)
    }
  }, [itemForm, serviceForm, postType, updateItemData, updateServiceData])

  const currentLastSaved = postType === "item" ? itemLastSaved : serviceLastSaved

  // Countdown effect
  useEffect(() => {
    if (isSubmitted && countdown !== null) {
      if (countdown <= 0) {
        router.push("/")
        return
      }
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitted, countdown, router])

  // Validation for required fields
  const validateStep = (step: number): boolean => {
    if (postType === "item") {
      if (step === 1) {
        return (
          itemForm.title.trim() !== "" &&
          itemForm.category !== "" &&
          itemForm.subcategory !== "" &&
          itemForm.condition !== "" &&
          itemForm.description.trim() !== "" &&
          itemForm.location.trim() !== "" &&
          itemForm.material?.trim() !== "" &&
          itemForm.color?.trim() !== "" &&
          itemForm.dimensions?.trim() !== "" &&
          itemForm.seatingCapacity?.trim() !== "" &&
          itemForm.age?.trim() !== "" &&
          itemForm.reasonForSelling?.trim() !== "" &&
          itemForm.price !== undefined && itemForm.price > 0
        )
      } else if (step === 3) {
        return itemForm.tradeType !== ""
      } else if (step === 4) {
        return itemForm.agreeToTerms
      }
    } else {
      if (step === 1) {
        return (
          serviceForm.title.trim() !== "" &&
          serviceForm.category !== "" &&
          serviceForm.subcategory !== "" &&
          serviceForm.description.trim() !== "" &&
          serviceForm.location.trim() !== "" &&
          serviceForm.locationType !== ""
        )
      } else if (step === 2) {
        return (
          serviceForm.duration !== "" &&
          serviceForm.detailedDescription.trim() !== "" &&
          serviceForm.pricingType !== "" &&
          (serviceForm.pricingType !== "hourly" || serviceForm.hourlyRate !== "0") &&
          serviceForm.timeEstimation !== "" &&
          serviceForm.timeUnit !== "" &&
          serviceForm.availableDays.length > 0 &&
          serviceForm.skills.length > 0 &&
          serviceForm.experienceLevel !== ""
        )
      } else if (step === 3) {
        return serviceForm.tradeType !== "" && serviceForm.cancellationPolicy !== ""
      } else if (step === 4) {
        return serviceForm.agreeToTerms
      }
    }
    return true
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      if (!validateStep(currentStep)) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        })
        return
      }
      saveCurrentDraft()
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const saveCurrentDraft = () => {
    const saveDraft = postType === "item" ? saveItemDraft : saveServiceDraft
    const timeString = saveDraft()
    toast({
      title: "Draft Saved",
      description: `Your draft was saved successfully at ${timeString}.`,
    })
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Incomplete Form",
        description: "Please agree to the terms and conditions to submit.",
        variant: "destructive",
      })
      return
    }

    try {
      // Hardcoded user_id (assuming user is logged in as Abebe Kebede)
      const user_id = 1;
      let postData: any;
      let endpoint: string;

      if (postType === "item") {
        postData = {
          user_id,
          title: itemForm.title,
          category_id: itemForm.category === "Furniture" ? "1" : itemForm.category === "Electronics" ? "2" : itemForm.category === "Sport" ? "3" : itemForm.category === "Vehicles" ? "4" : "1", // Map category to ID
          description: itemForm.description,
          condition: itemForm.condition as "New" | "Like New" | "Used",
          location: itemForm.location,
          trade_type: itemForm.tradeType,
          accept_cash: itemForm.considerCashPayments,
          price: itemForm.price,
          specifications: {
            material: itemForm.material,
            color: itemForm.color,
            dimensions: itemForm.dimensions,
            seatingCapacity: itemForm.seatingCapacity,
            age: itemForm.age,
            reasonForSelling: itemForm.reasonForSelling,
          },
          images: [], // No image upload in this demo
          status: "published",
        };
        endpoint = "/api/items";
      } else {
        postData = {
          user_id,
          title: serviceForm.title,
          category_id: serviceForm.category === "Tutoring" ? "5" : "5", // Map category to ID
          description: serviceForm.description,
          hourly_rate: parseFloat(serviceForm.hourlyRate),
          location: serviceForm.location,
          trade_type: serviceForm.tradeType,
          time_estimation: parseInt(serviceForm.timeEstimation),
          time_unit: serviceForm.timeUnit,
          cancellation_policy: serviceForm.cancellationPolicy,
          images: [],
          status: "published",
        };
        endpoint = "/api/services";
      }

      // Submit to API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create post");
      }

      setIsSubmitted(true);
      setCountdown(5); // Start 5-second countdown
      toast({
        title: "Success",
        description: `Your ${postType} post has been submitted successfully! Redirecting in 5 seconds...`,
      });

      // Update URL hash to trigger homepage revalidation
      window.location.hash = `newPost=${Date.now()}`;
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting the post");
      console.error("Submission error:", err);
      toast({
        title: "Error",
        description: err.message || "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleTabChange = (type: "item" | "service") => {
    setPostType(type)
    setCurrentStep(1)
  }

  const handleDone = () => {
    setIsSubmitted(false);
    setPostType("item");
    setCurrentStep(1);
    setCountdown(null);
    setError(null);
  }

  const steps = ["Basic Info", "Details", "Trade Options", "Review"]

  // Form handlers
  const handleItemFormChange = (field: keyof ItemFormData, value: any) => {
    setItemForm((prev) => ({ ...prev, [field]: value }))
    if (field === "title") setItemTitleCharCount(value.length)
    if (field === "description") setItemDescriptionCharCount(value.length)
  }

  const handleServiceFormChange = (field: keyof ServiceFormData, value: any) => {
    setServiceForm((prev) => ({ ...prev, [field]: value }))
    if (field === "title") setServiceTitleCharCount(value.length)
    if (field === "description") setServiceDescriptionCharCount(value.length)
  }

  const handleDayToggle = (day: string) => {
    setServiceForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const handleCategoryToggle = (category: string) => {
    setServiceForm((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter((c) => c !== category)
        : [...prev.preferredCategories, category],
    }))
  }

  const handleAddSkill = (skill: string) => {
    if (skill.trim() !== "") {
      setServiceForm((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
  }

  // Render step content
  const renderStepContent = () => {
    if (isSubmitted) {
      return (
        <div className="text-center py-10">
          {error ? (
            <>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-lg text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleDone}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-teal-600 mb-4">Post Submitted Successfully!</h2>
              <p className="text-lg text-gray-600 mb-4">
                Your {postType} post has been created. Redirecting to homepage in {countdown} seconds...
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Go to Homepage Now
              </button>
            </>
          )}
        </div>
      )
    }

    if (postType === "item") {
      return (
        <>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium">Basic Information</h2>
                <p className="text-sm text-gray-500">Step 1 of 4: Basic Info</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="itemTitle" className="block text-sm font-medium">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">{itemTitleCharCount}/100</span>
                  </div>
                  <input
                    type="text"
                    id="itemTitle"
                    value={itemForm.title}
                    onChange={(e) => handleItemFormChange("title", e.target.value)}
                    placeholder="Enter a descriptive item title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500">Be specific and include important details</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="itemCategory" className="block text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="itemCategory"
                        value={itemForm.category}
                        onChange={(e) => handleItemFormChange("category", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                      >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Home Appliances">Home Appliances</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Sport">Sport</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="itemSubcategory" className="block text-sm font-medium">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="itemSubcategory"
                        value={itemForm.subcategory}
                        onChange={(e) => handleItemFormChange("subcategory", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                      >
                        <option value="">Select a subcategory</option>
                        {itemForm.category === "Electronics" && (
                          <>
                            <option value="Mobile Phones">Mobile Phones</option>
                            <option value="Laptops">Laptops</option>
                            <option value="Tablets">Tablets</option>
                            <option value="TVs">TVs</option>
                          </>
                        )}
                        {itemForm.category === "Furniture" && (
                          <>
                            <option value="Sofas">Sofas</option>
                            <option value="Tables">Tables</option>
                            <option value="Chairs">Chairs</option>
                          </>
                        )}
                        {itemForm.category === "Sport" && (
                          <>
                            <option value="Bicycles">Bicycles</option>
                          </>
                        )}
                        {itemForm.category === "Vehicles" && (
                          <>
                            <option value="Cars">Cars</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemCondition" className="block text-sm font-medium">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="itemCondition"
                      value={itemForm.condition}
                      onChange={(e) => handleItemFormChange("condition", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                    >
                      <option value="">Select condition</option>
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Used">Used</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="itemDescription" className="block text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">{itemDescriptionCharCount}/2000</span>
                  </div>
                  <textarea
                    id="itemDescription"
                    value={itemForm.description}
                    onChange={(e) => handleItemFormChange("description", e.target.value)}
                    placeholder="Provide a detailed description of your item..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
                    maxLength={2000}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemLocation" className="block text-sm font-medium">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      id="itemLocation"
                      value={itemForm.location}
                      onChange={(e) => handleItemFormChange("location", e.target.value)}
                      placeholder="Enter your location"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemPrice" className="block text-sm font-medium">
                    Price (ETB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="itemPrice"
                    value={itemForm.price || ""}
                    onChange={(e) => handleItemFormChange("price", parseFloat(e.target.value))}
                    placeholder="e.g., 10500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemMaterial" className="block text-sm font-medium">
                    Material <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemMaterial"
                    value={itemForm.material || ""}
                    onChange={(e) => handleItemFormChange("material", e.target.value)}
                    placeholder="e.g., Genuine leather"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemColor" className="block text-sm font-medium">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemColor"
                    value={itemForm.color || ""}
                    onChange={(e) => handleItemFormChange("color", e.target.value)}
                    placeholder="e.g., Brown"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemDimensions" className="block text-sm font-medium">
                    Dimensions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemDimensions"
                    value={itemForm.dimensions || ""}
                    onChange={(e) => handleItemFormChange("dimensions", e.target.value)}
                    placeholder="e.g., 200cm x 90cm x 85cm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemSeatingCapacity" className="block text-sm font-medium">
                    Seating Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemSeatingCapacity"
                    value={itemForm.seatingCapacity || ""}
                    onChange={(e) => handleItemFormChange("seatingCapacity", e.target.value)}
                    placeholder="e.g., 3 people"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemAge" className="block text-sm font-medium">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemAge"
                    value={itemForm.age || ""}
                    onChange={(e) => handleItemFormChange("age", e.target.value)}
                    placeholder="e.g., 2 years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="itemReasonForSelling" className="block text-sm font-medium">
                    Reason for Selling <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemReasonForSelling"
                    value={itemForm.reasonForSelling || ""}
                    onChange={(e) => handleItemFormChange("reasonForSelling", e.target.value)}
                    placeholder="e.g., Moving abroad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hideExactAddress"
                    checked={itemForm.hideExactAddress}
                    onChange={(e) => handleItemFormChange("hideExactAddress", e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hideExactAddress" className="ml-2 block text-sm text-gray-700">
                    Hide exact address for privacy
                  </label>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900">
                  Cancel
                </button>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={saveCurrentDraft}
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
          )}
          {currentStep === 2 && (
            <PostItemForm
              data={itemData}
              updateData={updateItemData}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onSaveDraft={saveCurrentDraft}
              currentStep={currentStep}
              onSubmit={handleSubmit}
            />
          )}
          {currentStep === 3 && (
            <TradeOptions
              postType="item"
              data={itemData}
              updateData={updateItemData}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onSaveDraft={saveCurrentDraft}
            />
          )}
          {currentStep === 4 && (
            <PostReview
              postType="item"
              data={itemData}
              updateData={updateItemData}
              onPrevious={handlePreviousStep}
              onSubmit={handleSubmit}
              onSaveDraft={saveCurrentDraft}
            />
          )}
        </>
      )
    } else {
      return (
        <>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium">Basic Information</h2>
                <p className="text-sm text-gray-500">Step 1 of 4: Basic Info</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="serviceTitle" className="block text-sm font-medium">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">{serviceTitleCharCount}/100</span>
                  </div>
                  <input
                    type="text"
                    id="serviceTitle"
                    value={serviceForm.title}
                    onChange={(e) => handleServiceFormChange("title", e.target.value)}
                    placeholder="Enter a descriptive service title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500">Be specific and include important details</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="serviceCategory" className="block text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="serviceCategory"
                        value={serviceForm.category}
                        onChange={(e) => handleServiceFormChange("category", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                      >
                        <option value="">Select a category</option>
                        <option value="Tutoring">Tutoring</option>
                        <option value="Home Services">Home Services</option>
                        <option value="Professional Services">Professional Services</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="serviceSubcategory" className="block text-sm font-medium">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="serviceSubcategory"
                        value={serviceForm.subcategory}
                        onChange={(e) => handleServiceFormChange("subcategory", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                      >
                        <option value="">Select a subcategory</option>
                        {serviceForm.category === "Tutoring" && (
                          <>
                            <option value="Music">Music</option>
                            <option value="Math">Math</option>
                            <option value="Languages">Languages</option>
                          </>
                        )}
                        {serviceForm.category === "Home Services" && (
                          <>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Cleaning">Cleaning</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="serviceDescription" className="block text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500">{serviceDescriptionCharCount}/2000</span>
                  </div>
                  <textarea
                    id="serviceDescription"
                    value={serviceForm.description}
                    onChange={(e) => handleServiceFormChange("description", e.target.value)}
                    placeholder="Provide a detailed description of your service..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
                    maxLength={2000}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="serviceLocation" className="block text-sm font-medium">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      id="serviceLocation"
                      value={serviceForm.location}
                      onChange={(e) => handleServiceFormChange("location", e.target.value)}
                      placeholder="Enter your location"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Where will you provide this service? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="atMyLocation"
                        name="locationType"
                        value="atMyLocation"
                        checked={serviceForm.locationType === "atMyLocation"}
                        onChange={(e) => handleServiceFormChange("locationType", e.target.value)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="atMyLocation" className="ml-2 block text-sm text-gray-700">
                        At my location
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="atClientsLocation"
                        name="locationType"
                        value="atClientsLocation"
                        checked={serviceForm.locationType === "atClientsLocation"}
                        onChange={(e) => handleServiceFormChange("locationType", e.target.value)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="atClientsLocation" className="ml-2 block text-sm text-gray-700">
                        At client’s location
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="remotely"
                        name="locationType"
                        value="remotely"
                        checked={serviceForm.locationType === "remotely"}
                        onChange={(e) => handleServiceFormChange("locationType", e.target.value)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="remotely" className="ml-2 block text-sm text-gray-700">
                        Remotely
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-900">
                  Cancel
                </button>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={saveCurrentDraft}
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
          )}
          {currentStep === 2 && (
            <PostServiceForm
              data={serviceData}
              updateData={updateServiceData}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onSaveDraft={saveCurrentDraft}
              currentStep={currentStep}
              onSubmit={handleSubmit}
            />
          )}
          {currentStep === 3 && (
            <TradeOptions
              postType="service"
              data={serviceData}
              updateData={updateServiceData}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onSaveDraft={saveCurrentDraft}
            />
          )}
          {currentStep === 4 && (
            <PostReview
              postType="service"
              data={serviceData}
              updateData={updateServiceData}
              onPrevious={handlePreviousStep}
              onSubmit={handleSubmit}
              onSaveDraft={saveCurrentDraft}
            />
          )}
        </>
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <PostCounter onUpgradeClick={onUpgradeClick} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => handleTabChange("item")}
                className={`px-4 py-2 text-sm font-medium border rounded-l-md focus:z-10 focus:ring-2 focus:ring-teal-500 ${
                  postType === "item"
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Item
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("service")}
                className={`px-4 py-2 text-sm font-medium border rounded-r-md focus:z-10 focus:ring-2 focus:ring-teal-500 ${
                  postType === "service"
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Service
              </button>
            </div>
          </div>

          <ProgressSteps currentStep={currentStep} steps={steps} />

          {currentLastSaved && (
            <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
              <Check className="h-4 w-4 mr-1 text-teal-600" />
              Last saved at {currentLastSaved}
            </div>
          )}

          {renderStepContent()}
        </div>
      </div>
    </div>
  )
}