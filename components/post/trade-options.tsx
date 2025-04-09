"use client"

import { ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface TradeOptionsProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  onSaveDraft: () => void
  postType: "item" | "service"
}

export default function TradeOptions({
  data,
  updateData,
  onNext,
  onPrevious,
  onSaveDraft,
  postType,
}: TradeOptionsProps) {
  const handleTradeTypeChange = (type: string) => {
    updateData({ tradeType: type })
  }

  const handleCategoryToggle = (category: string) => {
    const currentCategories = data.preferredCategories || []
    if (currentCategories.includes(category)) {
      updateData({
        preferredCategories: currentCategories.filter((c: string) => c !== category),
      })
    } else {
      updateData({
        preferredCategories: [...currentCategories, category],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="#"
          className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600"
          onClick={onPrevious}
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
            {postType === "item" ? (
              <>
                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                  <input
                    type="radio"
                    name="tradeType"
                    value="itemForItem"
                    checked={data.tradeType === "itemForItem"}
                    onChange={() => handleTradeTypeChange("itemForItem")}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Item for Item</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                  <input
                    type="radio"
                    name="tradeType"
                    value="itemForService"
                    checked={data.tradeType === "itemForService"}
                    onChange={() => handleTradeTypeChange("itemForService")}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Item for Service</span>
                </label>
              </>
            ) : (
              <>
                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                  <input
                    type="radio"
                    name="tradeType"
                    value="serviceForItem"
                    checked={data.tradeType === "serviceForItem"}
                    onChange={() => handleTradeTypeChange("serviceForItem")}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Service for Item</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
                  <input
                    type="radio"
                    name="tradeType"
                    value="serviceForService"
                    checked={data.tradeType === "serviceForService"}
                    onChange={() => handleTradeTypeChange("serviceForService")}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Service for Service</span>
                </label>
              </>
            )}

            <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-teal-500">
              <input
                type="radio"
                name="tradeType"
                value="openToAll"
                checked={data.tradeType === "openToAll"}
                onChange={() => handleTradeTypeChange("openToAll")}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">Open to All Options</span>
            </label>
          </div>
        </div>

        {postType === "service" && (
          <div className="space-y-4">
            <h3 className="text-base font-medium">Value Matching</h3>
            <p className="text-sm text-gray-600">
              Based on your hourly rate of {data.hourlyRate || 0} ETB, your service is worth approximately:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-1">For 1 hour of service:</p>
                <p className="text-lg font-medium text-teal-600">{data.hourlyRate || 0} ETB</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-1">
                  For {data.timeEstimation || 1} {data.timeUnit || "hours"} of service:
                </p>
                <p className="text-lg font-medium text-teal-600">
                  {(Number(data.hourlyRate) || 0) * (Number(data.timeEstimation) || 1)} ETB
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label htmlFor="interestedItems" className="block text-sm font-medium">
            What {postType === "item" ? "items or services" : "items"} would you like to receive in exchange?
          </label>
          <textarea
            id="interestedItems"
            value={data.interestedItems || ""}
            onChange={(e) => updateData({ interestedItems: e.target.value })}
            placeholder={`Describe what you're interested in receiving in exchange for your ${postType}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium">Preferred Item Categories</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={(data.preferredCategories || []).includes("Electronics")}
                onChange={() => handleCategoryToggle("Electronics")}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Electronics</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={(data.preferredCategories || []).includes("Home & Garden")}
                onChange={() => handleCategoryToggle("Home & Garden")}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Home & Garden</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={(data.preferredCategories || []).includes("Fashion & Beauty")}
                onChange={() => handleCategoryToggle("Fashion & Beauty")}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Fashion & Beauty</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={(data.preferredCategories || []).includes("Vehicles & Parts")}
                onChange={() => handleCategoryToggle("Vehicles & Parts")}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Vehicles & Parts</span>
            </label>
          </div>
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="acceptCash"
            checked={data.acceptCash || false}
            onChange={(e) => updateData({ acceptCash: e.target.checked })}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="acceptCash" className="ml-2 block text-sm text-gray-700">
            Willing to accept cash payments
          </label>
        </div>

        {postType === "service" && (
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
                  checked={data.cancellationPolicy === "flexible"}
                  onChange={() => updateData({ cancellationPolicy: "flexible" })}
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
                  checked={data.cancellationPolicy === "moderate"}
                  onChange={() => updateData({ cancellationPolicy: "moderate" })}
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
                  checked={data.cancellationPolicy === "strict"}
                  onChange={() => updateData({ cancellationPolicy: "strict" })}
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
                  checked={data.cancellationPolicy === "nonRefundable"}
                  onChange={() => updateData({ cancellationPolicy: "nonRefundable" })}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Non-refundable</span>
                  <p className="text-xs text-gray-500">No refunds once booked</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevious}
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

