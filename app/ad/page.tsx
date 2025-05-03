"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/shared/axiosinstance"
import { X, ArrowRight, Phone, Mail } from "lucide-react"

interface Advertisement {
  id: string
  company_name: string
  email: string
  phone_number: string
  product_description: string
  product_image: string
  created_at?: string
  approved?: boolean
  website_url?: string
}

export default function ApprovedAdvertisement() {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isVisible, setIsVisible] = useState(true)
  const [hiddenAdIds, setHiddenAdIds] = useState<string[]>([])
  const [refreshKey, setRefreshKey] = useState(0) // Key to force re-render

  // Load hidden ad IDs from local storage on component mount
  useEffect(() => {
    const storedHiddenAdIds = localStorage.getItem("hiddenAdIds")
    if (storedHiddenAdIds) {
      setHiddenAdIds(JSON.parse(storedHiddenAdIds))
    }
  }, [])

  // Fetch advertisement data from API
  useEffect(() => {
    const fetchApprovedAdvertisement = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get<Advertisement[]>("/advertisements/approved")

        if (response.data && response.data.length > 0) {
          // Filter out hidden ads
          const visibleAds = response.data.filter((ad) => !hiddenAdIds.includes(ad.id))

          if (visibleAds.length > 0) {
            // Get a random ad from the list
            const randomIndex = Math.floor(Math.random() * visibleAds.length)
            setAdvertisement(visibleAds[randomIndex])
            setError(null)
          } else {
            setAdvertisement(null)
            setError("No approved advertisements found.")
          }
        } else {
          setAdvertisement(null)
          setError("No approved advertisements found.")
        }
      } catch (err: any) {
        console.error("Failed to fetch approved advertisement:", err)
        setError("Failed to load advertisement.")
      } finally {
        setLoading(false)
      }
    }

    fetchApprovedAdvertisement()
  }, [hiddenAdIds, refreshKey]) // Depend on hiddenAdIds and refreshKey

  // Check if current ad should be visible
  useEffect(() => {
    if (advertisement && hiddenAdIds.includes(advertisement.id)) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }, [hiddenAdIds, advertisement])

  const handleRemoveAd = () => {
    if (!advertisement) return

    const updatedHiddenAdIds = [...hiddenAdIds, advertisement.id]
    setHiddenAdIds(updatedHiddenAdIds)
    localStorage.setItem("hiddenAdIds", JSON.stringify(updatedHiddenAdIds))
    setIsVisible(false)
  }

  const handleViewDetails = () => {
    const websiteUrl = advertisement?.website_url || "https://example.com"
    window.open(websiteUrl, "_blank")
  }

  // Set up the interval to change the ad
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshKey((prevKey) => prevKey + 1) // Update state to trigger re-fetch
    }, 180000) // 3 minutes

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative w-full max-w-2xl p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-md"></div>
              <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-8 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div className="container mx-auto py-8 flex justify-center">
  //       <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center w-full max-w-2xl">
  //         <p className="text-red-600 dark:text-red-400">{error}</p>
  //       </div>
  //     </div>
  //   )
  // }

  if (!advertisement || !isVisible) {
    return null
  }

  return (
    <div className="container mx-auto py-1 flex justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative w-full max-w-2xl">
        {/* Image and Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {/* Image Section */}
          <div className="relative">
            {advertisement.product_image ? (
              <img
                src={advertisement.product_image || "/placeholder.svg"}
                alt={advertisement.company_name}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-md">
                <span className="text-sm text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {advertisement.company_name}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {advertisement.product_description}
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2">Contact</h4>
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                <Mail className="h-4 w-4 mr-2" />
                <a href={`mailto:${advertisement.email}`} className="hover:underline">
                  {advertisement.email}
                </a>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                {advertisement.phone_number}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py- flex justify-end">
          <button
            onClick={handleViewDetails}
            className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 mr-4"
          >
            Visit Website <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>

        {/* Close Button - Absolute positioned */}
        <button
          onClick={handleRemoveAd}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          aria-label="Close advertisement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}