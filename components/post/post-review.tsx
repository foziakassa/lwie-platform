"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PostReviewProps {
  data: any
  updateData: (data: any) => void
  onSubmit: () => void
  onPrevious: () => void
  onSaveDraft: () => void
  postType: "item" | "service"
}

export default function PostReview({ data, updateData, onSubmit, onPrevious, onSaveDraft, postType }: PostReviewProps) {
  const [agreeToTerms, setAgreeToTerms] = useState(false)

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
        <div className="text-sm text-gray-500">Step 4 of 4: Review</div>
      </div>

      <h2 className="text-lg font-medium">Review Your {postType === "item" ? "Item" : "Service"}</h2>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 bg-gray-100 h-64 flex items-center justify-center">
              {data.images && data.images.length > 0 ? (
                <img
                  src={data.images[0] || "/placeholder.svg"}
                  alt={data.title}
                  className="object-cover h-full w-full"
                />
              ) : (
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
              )}
            </div>

            <div className="w-full md:w-2/3">
              <h3 className="text-xl font-medium">{data.title || "No title provided"}</h3>

              <div className="flex flex-wrap gap-2 mt-2">
                {data.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {data.category}
                  </span>
                )}
                {data.subcategory && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {data.subcategory}
                  </span>
                )}
                {data.condition && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {data.condition}
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Description:</h4>
                  <p className="text-sm text-gray-600 mt-1">{data.description || "No description provided"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Location:</h4>
                  <p className="text-sm text-gray-600 mt-1">{data.location || "No location provided"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Trade Preference:</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {data.tradeType
                      ? data.tradeType === "itemForItem"
                        ? "Item for Item"
                        : data.tradeType === "itemForService"
                          ? "Item for Service"
                          : data.tradeType === "serviceForItem"
                            ? "Service for Item"
                            : data.tradeType === "serviceForService"
                              ? "Service for Service"
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
          id="agreeToTerms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
        />
        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
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
            onClick={onSubmit}
            disabled={!agreeToTerms}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              agreeToTerms ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
          >
            Submit Post
          </button>
        </div>
      </div>
    </div>
  )
}

