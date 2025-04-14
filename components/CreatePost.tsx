"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Info, Check, MapPin, ChevronDown, ChevronRight, Clock, HelpCircle, Tag } from "lucide-react"
import { useDraftSave } from "@/hooks/use-draft-save"
import ProgressSteps from "@/components/post/progress-steps"
import PostItemForm from "@/components/post/post-item-form"
import PostServiceForm from "@/components/post/post-service-form"
import TradeOptions from "@/components/post/trade-options"
import PostReview from "@/components/post/post-review"
import SuccessScreen from "@/components/post/success-screen"
import { PostCounter } from "@/components/post-counter"
import { checkPostsStatus, createPost } from "@/lib/actions"

export default function CreatePostDemo({ onUpgradeClick }: { onUpgradeClick: () => void }) {

  const router = useRouter()
  const [postType, setPostType] = useState<"item" | "service">("item")
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Use separate draft saves for item and service
  const {
    data: itemData,
    updateData: updateItemData,
    saveDraft: saveItemDraft,
    lastSaved: itemLastSaved,
  } = useDraftSave("post_item", {})

  const {
    data: serviceData,
    updateData: updateServiceData,
    saveDraft: saveServiceDraft,
    lastSaved: serviceLastSaved,
  } = useDraftSave("post_service", {})

  // Get the current data and functions based on post type
  const currentData = postType === "item" ? itemData : serviceData
  const updateCurrentData = postType === "item" ? updateItemData : updateServiceData
  const saveCurrentDraft = postType === "item" ? saveItemDraft : saveServiceDraft
  const currentLastSaved = postType === "item" ? itemLastSaved : serviceLastSaved

  const [lastSaved, setLastSaved] = useState("8:38:05 AM")

  // Item posting state
  const [itemTitle, setItemTitle] = useState("hfklaf")
  const [itemCategory, setItemCategory] = useState("Electronics")
  const [itemSubcategory, setItemSubcategory] = useState("Mobile Phones")
  const [itemCondition, setItemCondition] = useState("Good")
  const [itemDescription, setItemDescription] = useState("1234567890jklhjgfdsdftyuiop;,mnbvxdtyui")
  const [itemLocation, setItemLocation] = useState("Addis Ababa")
  const [hideExactAddress, setHideExactAddress] = useState(false)
  const [itemTradeType, setItemTradeType] = useState("")
  const [considerCashPayments, setConsiderCashPayments] = useState(false)
  const [agreeToItemTerms, setAgreeToItemTerms] = useState(false)

  // Service posting state
  const [serviceTitle, setServiceTitle] = useState("qwert")
  const [serviceCategory, setServiceCategory] = useState("Tutoring")
  const [serviceSubcategory, setServiceSubcategory] = useState("Music")
  const [serviceDescription, setServiceDescription] = useState("")
  const [serviceLocation, setServiceLocation] = useState("")
  const [serviceLocationType, setServiceLocationType] = useState("")

  // Service details state
  const [serviceDuration, setServiceDuration] = useState("")
  const [detailedDescription, setDetailedDescription] = useState("")
  const [pricingType, setPricingType] = useState("hourly")
  const [hourlyRate, setHourlyRate] = useState("0")
  const [timeEstimation, setTimeEstimation] = useState("1")
  const [timeUnit, setTimeUnit] = useState("")
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState("")
  const [portfolioLink, setPortfolioLink] = useState("")

  // Service trade options state
  const [serviceTradeType, setServiceTradeType] = useState("")
  const [interestedItems, setInterestedItems] = useState("")
  const [preferredCategories, setPreferredCategories] = useState<string[]>([])
  const [acceptCash, setAcceptCash] = useState(false)
  const [cancellationPolicy, setCancellationPolicy] = useState("")
  const [agreeToServiceTerms, setAgreeToServiceTerms] = useState(false)

  // Collapsible sections state for service details
  const [basicInfoOpen, setBasicInfoOpen] = useState(true)
  const [qualificationsOpen, setQualificationsOpen] = useState(false)
  const [serviceAreaOpen, setServiceAreaOpen] = useState(false)
  const [requirementsOpen, setRequirementsOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)

  // Collapsible sections state for item details
  const [specificationsOpen, setSpecificationsOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [conditionOpen, setConditionOpen] = useState(false)
  const [accessoriesOpen, setAccessoriesOpen] = useState(false)
  const [purchaseHistoryOpen, setPurchaseHistoryOpen] = useState(false)

  // Character count state
  const [itemTitleCharCount, setItemTitleCharCount] = useState(6)
  const [itemDescriptionCharCount, setItemDescriptionCharCount] = useState(40)
  const [serviceTitleCharCount, setServiceTitleCharCount] = useState(5)
  const [serviceDescriptionCharCount, setServiceDescriptionCharCount] = useState(0)

  const handleItemTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setItemTitle(value)
    setItemTitleCharCount(value.length)
  }

  const handleItemDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setItemDescription(value)
    setItemDescriptionCharCount(value.length)
  }

  const handleServiceTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setServiceTitle(value)
    setServiceTitleCharCount(value.length)
  }

  const handleServiceDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setServiceDescription(value)
    setServiceDescriptionCharCount(value.length)
  }

  const handleDayToggle = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day))
    } else {
      setAvailableDays([...availableDays, day])
    }
  }

  const handleCategoryToggle = (category: string) => {
    if (preferredCategories.includes(category)) {
      setPreferredCategories(preferredCategories.filter((c) => c !== category))
    } else {
      setPreferredCategories([...preferredCategories, category])
    }
  }

  const handleAddSkill = () => {
    // In a real implementation, this would add the skill from an input field
    setSkills([...skills, "New Skill"])
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
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

  const handleSaveDraft = () => {
    const timeString = saveCurrentDraft()
    alert(`Draft saved successfully at ${timeString}!`)
  }

  const handleSubmit = async () => {
    try {
      // Check if user has posts available
      const currentStatus = await checkPostsStatus()
      const totalRemaining = currentStatus.remainingFreePosts + currentStatus.remainingPaidPosts

      if (totalRemaining <= 0) {
        alert("You don't have any posts remaining. Please purchase a plan to continue posting.")
        return
      }

      // Here you would typically submit the form to the server
      // Create a post data object based on the form data
      const postData = {
        category: postType === "item" ? itemCategory : serviceCategory,
        subcategory: postType === "item" ? itemSubcategory : serviceSubcategory,
        title: postType === "item" ? itemTitle : serviceTitle,
        description: postType === "item" ? itemDescription : serviceDescription,
        condition: itemCondition as "new" | "like-new" | "good" | "fair" | "poor",
        location: postType === "item" ? itemLocation : serviceLocation,
        images: [], // Add image handling if needed
        preferredSwaps: postType === "item" ? itemTradeType : serviceTradeType,
      }

      // Call the createPost function to create the post and update the post count
      await createPost(postData)

      setIsSubmitted(true)
      // In a real implementation, you would send the data to your API
      console.log(`${postType === "item" ? "Item" : "Service"} data:`, currentData)
    } catch (error) {
      console.error("Error creating post:", error)
      alert("There was an error creating your post. Please try again.")
    }
  }

  const handleDone = () => {
    router.push("/")
  }

  const handleTabChange = (type: "item" | "service") => {
    setPostType(type)
    setCurrentStep(1) // Reset to step 1 when changing tabs
  }

  const getStepName = (step: number) => {
    switch (step) {
      case 1:
        return "Basic Info"
      case 2:
        return "Details"
      case 3:
        return "Trade Options"
      case 4:
        return "Review"
      default:
        return ""
    }
  }

  // Item posting steps
  const renderItemBasicInfoStep = () => {
    return (
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
              value={itemTitle}
              onChange={handleItemTitleChange}
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
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home Appliances">Home Appliances</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Vehicles">Vehicles</option>
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
                  value={itemSubcategory}
                  onChange={(e) => setItemSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select a subcategory</option>
                  {itemCategory === "Electronics" && (
                    <>
                      <option value="Mobile Phones">Mobile Phones</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Tablets">Tablets</option>
                      <option value="TVs">TVs</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {itemCategory === "Electronics" && itemSubcategory === "Mobile Phones" && (
            <div className="bg-teal-50 p-4 rounded-md border border-teal-200">
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-teal-600 mr-2" />
                <h3 className="text-sm font-medium text-teal-700">Mobile Phones Selected</h3>
              </div>
              <p className="text-xs text-teal-600 mt-1 ml-7">Continue to add specific details about your item</p>
              <div className="mt-3 ml-7">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                >
                  Continue to Specifications
                  <ChevronRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="itemCondition" className="block text-sm font-medium">
              Condition <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="itemCondition"
                value={itemCondition}
                onChange={(e) => setItemCondition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            <p className="text-xs text-gray-500">
              Be honest about the condition to build trust with potential swappers
            </p>
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
              value={itemDescription}
              onChange={handleItemDescriptionChange}
              placeholder="Provide a detailed description of your item..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
              maxLength={2000}
            />
            <p className="text-xs text-gray-500">Include brand, model, dimensions, age, and any defects</p>
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
                value={itemLocation}
                onChange={(e) => setItemLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hideExactAddress"
              checked={hideExactAddress}
              onChange={(e) => setHideExactAddress(e.target.checked)}
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
              onClick={handleSaveDraft}
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

  const renderItemDetailsStep = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="#"
            className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600"
            onClick={handlePreviousStep}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="text-sm text-gray-500">Step 2 of 4: Specifications</div>
        </div>

        <div>
          <h2 className="text-lg font-medium">Add Details About Your Mobile Phones</h2>
          <p className="text-sm text-gray-500">These details help potential swappers understand your item better</p>
        </div>

        <div className="flex justify-end">
          <div className="text-sm text-gray-500">0 of 4 required fields completed</div>
        </div>

        {/* Basic Information Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setBasicInfoOpen(!basicInfoOpen)}
          >
            <h3 className="text-base font-medium">Basic Information</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${basicInfoOpen ? "rotate-180" : ""}`} />
          </div>

          {basicInfoOpen && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="brand" className="block text-sm font-medium flex items-center">
                    Brand <span className="text-red-500">*</span>
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </label>
                  <div className="relative">
                    <select
                      id="brand"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                    >
                      <option value="">Select an option</option>
                      <option value="apple">Apple</option>
                      <option value="samsung">Samsung</option>
                      <option value="google">Google</option>
                      <option value="xiaomi">Xiaomi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="model" className="block text-sm font-medium flex items-center">
                    Model <span className="text-red-500">*</span>
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </label>
                  <input
                    type="text"
                    id="model"
                    placeholder="e.g., iPhone 13, Galaxy S21"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Specifications Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setSpecificationsOpen(!specificationsOpen)}
          >
            <h3 className="text-base font-medium">Specifications</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${specificationsOpen ? "rotate-180" : ""}`} />
          </div>

          {specificationsOpen && <div className="mt-4 space-y-4">{/* Specifications content would go here */}</div>}
        </div>

        {/* Appearance Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setAppearanceOpen(!appearanceOpen)}
          >
            <h3 className="text-base font-medium">Appearance</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${appearanceOpen ? "rotate-180" : ""}`} />
          </div>

          {appearanceOpen && <div className="mt-4 space-y-4">{/* Appearance content would go here */}</div>}
        </div>

        {/* Condition Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setConditionOpen(!conditionOpen)}
          >
            <h3 className="text-base font-medium">Condition</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${conditionOpen ? "rotate-180" : ""}`} />
          </div>

          {conditionOpen && <div className="mt-4 space-y-4">{/* Condition content would go here */}</div>}
        </div>

        {/* Accessories Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setAccessoriesOpen(!accessoriesOpen)}
          >
            <h3 className="text-base font-medium">Accessories</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${accessoriesOpen ? "rotate-180" : ""}`} />
          </div>

          {accessoriesOpen && <div className="mt-4 space-y-4">{/* Accessories content would go here */}</div>}
        </div>

        {/* Purchase History Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setPurchaseHistoryOpen(!purchaseHistoryOpen)}
          >
            <h3 className="text-base font-medium">Purchase History</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${purchaseHistoryOpen ? "rotate-180" : ""}`} />
          </div>

          {purchaseHistoryOpen && <div className="mt-4 space-y-4">{/* Purchase History content would go here */}</div>}
        </div>

        <div className="pt-6 flex justify-between">
          <Link
            href="#"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            onClick={handlePreviousStep}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </Link>

          <div className="flex space-x-4">
            <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
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

        <div className="pt-4 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={handleNextStep}
          >
            Continue to Trade Options
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  const renderItemTradeOptionsStep = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="#"
            className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600"
            onClick={handlePreviousStep}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="text-sm text-gray-500">Step 3 of 4: Trade Options</div>
        </div>

        <h2 className="text-lg font-medium">Trade Options</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Trade Type <span className="text-red-500">*</span>
            </label>

            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="itemTradeType"
                  value="itemForItem"
                  checked={itemTradeType === "itemForItem"}
                  onChange={() => setItemTradeType("itemForItem")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Item for Item</span>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="itemTradeType"
                  value="itemForService"
                  checked={itemTradeType === "itemForService"}
                  onChange={() => setItemTradeType("itemForService")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Item for Service</span>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="itemTradeType"
                  value="openToAll"
                  checked={itemTradeType === "openToAll"}
                  onChange={() => setItemTradeType("openToAll")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Open to All Options</span>
              </label>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="considerCashPayments"
              checked={considerCashPayments}
              onChange={(e) => setConsiderCashPayments(e.target.checked)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="considerCashPayments" className="ml-2 block text-sm text-gray-700">
              Willing to consider partial cash payments
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </button>

          <div className="flex space-x-4">
            <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
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

        <div className="pt-4 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            onClick={handleNextStep}
          >
            Continue to Review
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  const renderItemReviewStep = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="#"
            className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600"
            onClick={handlePreviousStep}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="text-sm text-gray-500">Step 4 of 4: Review</div>
        </div>

        <h2 className="text-lg font-medium">Review Your Item</h2>

        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 bg-gray-100 h-64 flex items-center justify-center">
                <div className="text-gray-400">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-center">No images uploaded</p>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-medium">iPhone</h3>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    electronics
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    mobile-phones
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Like New
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Description:</h4>
                    <p className="text-sm text-gray-600 mt-1">{itemDescription || "fgdgasdfghjklasdfghjkl"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Location:</h4>
                    <p className="text-sm text-gray-600 mt-1">{itemLocation || "sfafa"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Trade Preference:</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {itemTradeType
                        ? itemTradeType === "itemForItem"
                          ? "Item for Item"
                          : itemTradeType === "itemForService"
                            ? "Item for Service"
                            : "Open to All Options"
                        : "No preference specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToItemTerms"
            checked={agreeToItemTerms}
            onChange={(e) => setAgreeToItemTerms(e.target.checked)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="agreeToItemTerms" className="ml-2 block text-sm text-gray-700">
            I agree to the{" "}
            <Link href="/terms" className="text-teal-600 hover:text-teal-500">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-teal-600 hover:text-teal-500">
              Privacy Policy
            </Link>
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </button>

          <div className="flex space-x-4">
            <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
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
              onClick={handleSubmit}
              disabled={!agreeToItemTerms}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                agreeToItemTerms ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
            >
              Submit Post
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Service posting steps
  const renderServiceBasicInfoStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Basic Information</h2>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="serviceTitle" className="block text-sm font-medium">
                Service Title <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">{serviceTitleCharCount}/100</span>
            </div>
            <input
              type="text"
              id="serviceTitle"
              value={serviceTitle}
              onChange={handleServiceTitleChange}
              placeholder="Enter a descriptive service title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              maxLength={100}
            />
            <p className="text-xs text-gray-500">Be specific about the service you're offering</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="serviceCategory" className="block text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="serviceCategory"
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select a category</option>
                  <option value="Tutoring">Tutoring</option>
                  <option value="Home Services">Home Services</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Creative Services">Creative Services</option>
                  <option value="Tech Services">Tech Services</option>
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
                  value={serviceSubcategory}
                  onChange={(e) => setServiceSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select a subcategory</option>
                  {serviceCategory === "Tutoring" && (
                    <>
                      <option value="Music">Music</option>
                      <option value="Math">Math</option>
                      <option value="Science">Science</option>
                      <option value="Languages">Languages</option>
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
                Service Description <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">{serviceDescriptionCharCount}/2000</span>
            </div>
            <textarea
              id="serviceDescription"
              value={serviceDescription}
              onChange={handleServiceDescriptionChange}
              placeholder="Provide a detailed description of your service..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
              maxLength={2000}
            />
            <p className="text-xs text-gray-500">
              Include your experience, qualifications, and what makes your service unique
            </p>
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
                value={serviceLocation}
                onChange={(e) => setServiceLocation(e.target.value)}
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
                  checked={serviceLocationType === "atMyLocation"}
                  onChange={() => setServiceLocationType("atMyLocation")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">At my location</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="serviceLocationType"
                  value="atClientLocation"
                  checked={serviceLocationType === "atClientLocation"}
                  onChange={() => setServiceLocationType("atClientLocation")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">At client's location</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="serviceLocationType"
                  value="remote"
                  checked={serviceLocationType === "remote"}
                  onChange={() => setServiceLocationType("remote")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Remote (online)</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="serviceLocationType"
                  value="flexible"
                  checked={serviceLocationType === "flexible"}
                  onChange={() => setServiceLocationType("flexible")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Flexible (can be discussed)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
            Cancel
          </button>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSaveDraft}
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

  const renderServiceDetailsStep = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="#"
            className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600"
            onClick={handlePreviousStep}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="text-sm text-gray-500">Step 2 of 4: Specifications</div>
        </div>

        <div>
          <h2 className="text-lg font-medium">Add Details About Your Cleaning</h2>
          <p className="text-sm text-gray-500">These details help potential swappers understand your item better</p>
        </div>

        <div className="flex justify-end">
          <div className="text-sm text-gray-500">0 of 3 required fields completed</div>
        </div>

        {/* Basic Information Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setBasicInfoOpen(!basicInfoOpen)}
          >
            <h3 className="text-base font-medium">Basic Information</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${basicInfoOpen ? "rotate-180" : ""}`} />
          </div>

          {basicInfoOpen && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="serviceDuration" className="block text-sm font-medium flex items-center">
                    Service Duration <span className="text-red-500">*</span>
                    <button className="ml-1 text-gray-400 hover:text-gray-500">
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </label>
                  <div className="relative">
                    <select
                      id="serviceDuration"
                      value={serviceDuration}
                      onChange={(e) => setServiceDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                    >
                      <option value="">Select an option</option>
                      <option value="one-time">One-time</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="detailedDescription" className="block text-sm font-medium flex items-center">
                  Detailed Service Description <span className="text-red-500">*</span>
                  <button className="ml-1 text-gray-400 hover:text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </label>
                <textarea
                  id="detailedDescription"
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  placeholder="Provide a detailed description of the service you offer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Qualifications Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setQualificationsOpen(!qualificationsOpen)}
          >
            <h3 className="text-base font-medium">Qualifications</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${qualificationsOpen ? "rotate-180" : ""}`} />
          </div>

          {qualificationsOpen && <div className="mt-4 space-y-4">{/* Qualifications content would go here */}</div>}
        </div>

        {/* Service Area Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setServiceAreaOpen(!serviceAreaOpen)}
          >
            <h3 className="text-base font-medium">Service Area</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${serviceAreaOpen ? "rotate-180" : ""}`} />
          </div>

          {serviceAreaOpen && <div className="mt-4 space-y-4">{/* Service Area content would go here */}</div>}
        </div>

        {/* Requirements Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setRequirementsOpen(!requirementsOpen)}
          >
            <h3 className="text-base font-medium">Requirements</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${requirementsOpen ? "rotate-180" : ""}`} />
          </div>

          {requirementsOpen && <div className="mt-4 space-y-4">{/* Requirements content would go here */}</div>}
        </div>

        {/* Schedule Section */}
        <div className="border-t border-gray-200 pt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setScheduleOpen(!scheduleOpen)}
          >
            <h3 className="text-base font-medium">Schedule</h3>
            <ChevronDown className={`h-5 w-5 text-gray-500 transform ${scheduleOpen ? "rotate-180" : ""}`} />
          </div>

          {scheduleOpen && <div className="mt-4 space-y-4">{/* Schedule content would go here */}</div>}
        </div>

        <div className="pt-6 flex justify-between">
          <Link
            href="#"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            onClick={handlePreviousStep}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </Link>

          <div className="flex space-x-4">
            <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
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

        <div className="pt-4 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={handleNextStep}
          >
            Continue to Trade Options
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  const renderServiceDetailsStepAlternative = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Service Details</h2>

        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="pricingType" className="block text-sm font-medium">
              Pricing Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricingType"
                  value="hourly"
                  checked={pricingType === "hourly"}
                  onChange={(e) => setPricingType("hourly")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Hourly Rate</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricingType"
                  value="fixed"
                  checked={pricingType === "fixed"}
                  onChange={(e) => setPricingType("fixed")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Fixed Price</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricingType"
                  value="negotiable"
                  checked={pricingType === "negotiable"}
                  onChange={(e) => setPricingType("negotiable")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Negotiable</span>
              </label>
            </div>
          </div>

          {pricingType === "hourly" && (
            <div className="space-y-1">
              <label htmlFor="hourlyRate" className="block text-sm font-medium">
                Hourly Rate (ETB) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">ETB</span>
                <input
                  type="text"
                  id="hourlyRate"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="timeEstimation" className="block text-sm font-medium">
                Time Estimation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="timeEstimation"
                value={timeEstimation}
                onChange={(e) => setTimeEstimation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="timeUnit" className="block text-sm font-medium">
                &nbsp;
              </label>
              <div className="relative">
                <select
                  id="timeUnit"
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                >
                  <option value="">Select unit</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

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
                    availableDays.includes(day)
                      ? "bg-teal-100 text-teal-800 border border-teal-300"
                      : "bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
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
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
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
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium flex items-center">
              Skills <span className="text-red-500">*</span>
              <button className="ml-2 text-gray-400 hover:text-gray-500">
                <HelpCircle className="h-4 w-4" />
              </button>
            </h3>

            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Add skills (press Enter after each)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                >
                  {skill}
                  <button
                    type="button"
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

          <div className="space-y-4">
            <h3 className="text-base font-medium">
              Experience Level <span className="text-red-500">*</span>
            </h3>

            <div className="relative">
              <select
                id="experienceLevel"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium">Portfolio Link (Optional)</h3>

            <input
              type="url"
              id="portfolioLink"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://your-portfolio-website.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <p className="text-xs text-gray-500">
              Share a link to your portfolio, website, or social media showcasing your work
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </button>

          <div className="flex space-x-4">
            <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
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

  const renderServiceTradeOptionsStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Trade Options</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Trade Type <span className="text-red-500">*</span>
            </label>

            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="serviceTradeType"
                  value="serviceForItem"
                  checked={serviceTradeType === "serviceForItem"}
                  onChange={() => setServiceTradeType("serviceForItem")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Service for Item</span>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="serviceTradeType"
                  value="serviceForService"
                  checked={serviceTradeType === "serviceForService"}
                  onChange={() => setServiceTradeType("serviceForService")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Service for Service</span>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="serviceTradeType"
                  value="openToAll"
                  checked={serviceTradeType === "openToAll"}
                  onChange={() => setServiceTradeType("openToAll")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Open to All Options</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium">Value Matching</h3>
            <p className="text-sm text-gray-600">
              Based on your hourly rate of {hourlyRate} ETB, your service is worth approximately:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-1">For 1 hour of service:</p>
                <p className="text-lg font-medium text-teal-600">{hourlyRate} ETB</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-1">
                  For {timeEstimation} {timeUnit || "hours"} of service:
                </p>
                <p className="text-lg font-medium text-teal-600">{Number(hourlyRate) * Number(timeEstimation)} ETB</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="interestedItems" className="block text-sm font-medium">
              What items would you like to receive in exchange?
            </label>
            <textarea
              id="interestedItems"
              value={interestedItems}
              onChange={(e) => setInterestedItems(e.target.value)}
              placeholder="Describe items you're interested in receiving in exchange for your service..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium">Preferred Item Categories</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes("Electronics")}
                  onChange={() => handleCategoryToggle("Electronics")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Electronics</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes("Home & Garden")}
                  onChange={() => handleCategoryToggle("Home & Garden")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Home & Garden</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes("Fashion & Beauty")}
                  onChange={() => handleCategoryToggle("Fashion & Beauty")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Fashion & Beauty</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes("Vehicles & Parts")}
                  onChange={() => handleCategoryToggle("Vehicles & Parts")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Vehicles & Parts</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes("Sports & Fitness")}
                  onChange={() => handleCategoryToggle("Sports & Fitness")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Sports & Fitness</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes("Books & Education")}
                  onChange={() => handleCategoryToggle("Books & Education")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Books & Education</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes("Baby & Kids")}
                  onChange={() => handleCategoryToggle("Baby & Kids")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Baby & Kids</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferredCategories.includes("Art & Collectibles")}
                  onChange={() => handleCategoryToggle("Art & Collectibles")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Art & Collectibles</span>
              </label>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="acceptCash"
              checked={acceptCash}
              onChange={(e) => setAcceptCash(e.target.checked)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptCash" className="ml-2 block text-sm text-gray-700">
              Willing to accept cash payments
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium">
              Cancellation Policy <span className="text-red-500">*</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="cancellationPolicy"
                  value="flexible"
                  checked={cancellationPolicy === "flexible"}
                  onChange={() => setCancellationPolicy("flexible")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Flexible</span>
                  <p className="text-xs text-gray-500">Full refund if canceled 24 hours before the service</p>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="cancellationPolicy"
                  value="moderate"
                  checked={cancellationPolicy === "moderate"}
                  onChange={() => setCancellationPolicy("moderate")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Moderate</span>
                  <p className="text-xs text-gray-500">Full refund if canceled 3 days before the service</p>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="cancellationPolicy"
                  value="strict"
                  checked={cancellationPolicy === "strict"}
                  onChange={() => setCancellationPolicy("strict")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Strict</span>
                  <p className="text-xs text-gray-500">50% refund if canceled 7 days before the service</p>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                <input
                  type="radio"
                  name="cancellationPolicy"
                  value="nonRefundable"
                  checked={cancellationPolicy === "nonRefundable"}
                  onChange={() => setCancellationPolicy("nonRefundable")}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Non-refundable</span>
                  <p className="text-xs text-gray-500">No refunds once booked</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </button>

          <div className="flex space-x-4">
            <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
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

  const renderServiceReviewStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Review Your Service Post</h2>

        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-medium">{serviceTitle || "qwert"}</h3>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                {serviceCategory || "Tutoring"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {serviceSubcategory || "Music"}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <span className="text-gray-600">{serviceLocation ? serviceLocation : "No location provided"}</span>
              </div>

              <div>
                <h4 className="text-sm font-medium">Description:</h4>
                <p className="text-sm text-gray-600 mt-1">{serviceDescription || "No description provided."}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Pricing:</h4>
                  <p className="text-lg font-medium text-teal-600 mt-1">{hourlyRate} ETB/hour</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Time Estimation:</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {timeEstimation && timeUnit ? `${timeEstimation} ${timeUnit}` : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-6">
            <h4 className="text-base font-medium mb-4">Trade Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium">Looking For:</h5>
                <p className="text-sm text-gray-600 mt-1">{interestedItems || "No specific preferences provided."}</p>
              </div>

              <div>
                <h5 className="text-sm font-medium">Trade Type:</h5>
                <p className="text-sm text-gray-600 mt-1">
                  {serviceTradeType === "serviceForItem"
                    ? "Service for Item"
                    : serviceTradeType === "serviceForService"
                      ? "Service for Service"
                      : serviceTradeType === "openToAll"
                        ? "Open to All Options"
                        : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToServiceTerms"
            checked={agreeToServiceTerms}
            onChange={(e) => setAgreeToServiceTerms(e.target.checked)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="agreeToServiceTerms" className="ml-2 block text-sm text-gray-700">
            I agree to the{" "}
            <Link href="/terms" className="text-teal-600 hover:text-teal-500">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-teal-600 hover:text-teal-500">
              Privacy Policy
            </Link>
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Step
          </button>

          <div className="flex space-x-4">
            <button type="button" onClick={() => {}} className="text-gray-600 hover:text-gray-900">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
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
              onClick={handleSubmit}
              disabled={!agreeToServiceTerms}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                agreeToServiceTerms ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
            >
              Submit Post
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render the appropriate step content based on post type and current step
  const renderStepContent = () => {
    if (isSubmitted) {
      return <SuccessScreen postType={postType} onDone={handleDone} />
    }

    if (postType === "item") {
      switch (currentStep) {
        case 1:
          return (
            <PostItemForm
              data={itemData}
              updateData={updateItemData}
              onNext={handleNextStep}
              onSaveDraft={handleSaveDraft}
              currentStep={0}
            />
          )
        case 2:
          return (
            <PostItemForm
              data={itemData}
              updateData={updateItemData}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onSaveDraft={handleSaveDraft}
              currentStep={0}
            />
          )
        case 3:
          return (
            <TradeOptions
              data={itemData}
              updateData={updateItemData}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onSaveDraft={handleSaveDraft}
              postType="item"
            />
          )
        case 4:
          return (
            <PostReview
              data={itemData}
              updateData={updateItemData}
              onSubmit={handleSubmit}
              onPrevious={handlePreviousStep}
              onSaveDraft={handleSaveDraft}
              postType="item"
            />
          )
        default:
          return null
      }
    } else {
      switch (currentStep) {
        case 1:
          return (
            <PostServiceForm
              data={serviceData}
              updateData={updateServiceData}
              onNext={handleNextStep}
              onSaveDraft={handleSaveDraft}
              currentStep={0}
            />
          )
        case 2:
          return (
            <PostServiceForm
              data={serviceData}
              updateData={updateServiceData}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onSaveDraft={handleSaveDraft}
              currentStep={0}
            />
          )
        case 3:
          return (
            <TradeOptions
              data={serviceData}
              updateData={updateServiceData}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onSaveDraft={handleSaveDraft}
              postType="service"
            />
          )
        case 4:
          return (
            <PostReview
              data={serviceData}
              updateData={updateServiceData}
              onSubmit={handleSubmit}
              onPrevious={handlePreviousStep}
              onSaveDraft={handleSaveDraft}
              postType="service"
            />
          )
        default:
          return null
      }
    }
  }

  // Define the steps for the progress indicator
  const steps = ["Basic Info", "Details", "Trade Options", "Review"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <div className="bg-teal-600 text-white p-6 rounded-t-md">
            <div className="flex items-start">
              <div className="bg-white h-10 w-10 rounded-md mr-4"></div>
              <div>
                <h1 className="text-xl font-bold">Post Your {postType === "item" ? "Item" : "Service"} for Swap</h1>
                <p className="text-teal-100 mt-1">Fill in the details to create your swap listing</p>
                <div className="text-teal-100 text-sm mt-2">Last saved: {currentLastSaved || "Not saved yet"}</div>
              </div>
            </div>
          </div>

          {/* Post Type Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  postType === "item" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("item")}
              >
                Post Item
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  postType === "service"
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("service")}
              >
                Post Service
              </button>
            </div>
          </div>

          {/* Post Counter */}
          <div className="bg-white px-6 pt-4">
            {/* Post Counter */}
<div className="bg-white px-6 pt-4">
  <PostCounter onUpgradeClick={onUpgradeClick} />
</div>

          </div>

          {/* Progress Steps */}
          <div className="bg-white p-6">
            {!isSubmitted && (
              <ProgressSteps
                steps={steps}
                currentStep={currentStep}
                onStepClick={(step) => {
                  // Only allow going back to previous steps
                  if (step < currentStep) {
                    setCurrentStep(step)
                  }
                }}
              />
            )}

            {/* Step Content */}
            {renderStepContent()}
          </div>

          {/* Posting Tips */}
          {!isSubmitted && (
            <div className="bg-white p-6 mt-6 rounded-md border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-teal-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">Posting Tips</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Use clear, descriptive titles that include key details like brand and model</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Add high-quality photos from multiple angles in good lighting</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Be honest about the condition and mention any defects or issues</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Include measurements, specifications, and age of the item when relevant</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Respond promptly to inquiries to increase your chances of a successful swap</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
