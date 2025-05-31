"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "components/ui/button"
import { Badge } from "components/ui/badge"
import { X, Mail, Phone, Star, Clock, Sparkles, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "lib/utils"
import styles from "./3d-advertisement-carousel.module.css"
import axiosInstance from "@/shared/axiosinstance"

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

interface AdvertisementBannerProps {
  className?: string
}

export default function AdvertisementBannerWithAPI({ className }: AdvertisementBannerProps) {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isVisible, setIsVisible] = useState(true)
  const [hiddenAdIds, setHiddenAdIds] = useState<string[]>([])
  const [refreshKey, setRefreshKey] = useState(0) // Key to force re-render
  const [highlightIndex, setHighlightIndex] = useState(0)
  const highlights = ["Premium Quality", "24/7 Support", "Best Value"]

  // Generate random styles for background pattern circles
  const [circleStyles, setCircleStyles] = useState<React.CSSProperties[]>([])

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
        const response = await axiosInstance.get<Advertisement[]>("/advertisements")

        if (response.data && response.data.length > 0) {
          // Filter out hidden ads and non-approved ads
          const visibleAds = response.data.filter((ad) => !hiddenAdIds.includes(ad.id) && ad.approved === true)

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

  // Set up the interval to change the ad
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshKey((prevKey) => prevKey + 1) // Update state to trigger re-fetch
    }, 180000) // 3 minutes

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % highlights.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [highlights.length])

  useEffect(() => {
    const stylesArray: React.CSSProperties[] = []
    for (let i = 0; i < 20; i++) {
      stylesArray.push({
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.3,
        position: "absolute",
        borderRadius: "50%",
        backgroundColor: "white",
      })
    }
    setCircleStyles(stylesArray)
  }, [])

  const handleClose = () => {
    if (!advertisement) return

    const updatedHiddenAdIds = [...hiddenAdIds, advertisement.id]
    setHiddenAdIds(updatedHiddenAdIds)
    localStorage.setItem("hiddenAdIds", JSON.stringify(updatedHiddenAdIds))
    setIsVisible(false)
  }

  if (loading) {
    return (
      <div
        className={cn(
          styles.carouselContainer,
          "relative overflow-hidden bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600",
          className,
        )}
      >
        <div className="container mx-auto px-6 py-4 sm:py-6 relative z-10">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-white/20 rounded-full"></div>
                <div>
                  <div className="h-6 bg-white/20 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-24"></div>
                </div>
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="h-4 bg-white/20 rounded mb-2 max-w-xl"></div>
                <div className="h-4 bg-white/20 rounded mb-2 max-w-md"></div>
                <div className="h-3 bg-white/20 rounded w-48"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 bg-white/20 rounded w-20"></div>
                <div className="h-10 bg-white/20 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!advertisement || !isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        styles.carouselContainer,
        "relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500",
        className,
      )}
    >
      {/* Background pattern */}
      <div className={styles.backgroundPattern}>
        <div className="absolute top-0 left-0 w-full h-full">
          {circleStyles.map((style, i) => (
            <div key={i} style={style} />
          ))}
        </div>
      </div>

      <div className={`container mx-auto px-7 py-5 sm:py-6 relative z-10 max-w-7xl ${styles.carouselContent}`}>
        <div className="flex flex-col md:flex-row items-center justify-start md:gap-14 lg:gap-18">
          {/* Left side with image and company info */}
          <div className={`flex items-center gap-7 flex-shrink-0 min-w-0 ${styles.carouselLeft}`}>
            <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10 rounded-full" />
              <Image
                src={advertisement.product_image || "/placeholder.svg?height=80&width=80&text=Logo"}
                alt="Company Logo"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">{advertisement.company_name}</h3>
              <div className="flex items-center gap-1 text-white/80 text-xs md:text-sm mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                ))}
                <span className="ml-1">Trusted by 10,000+ customers</span>
              </div>
            </div>
          </div>

          {/* Middle section with description and highlights */}
          <div className={`flex-grow text-center md:text-left md:mx-7 lg:mx-12 min-w-0 ${styles.carouselMiddle}`}>
            <p className="text-white text-sm md:text-base max-w-xl mb-4">{advertisement.product_description}</p>

            <div className="flex flex-wrap items-center gap-7 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <Mail className="h-3 w-3" />
                <span>{advertisement.email}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <Phone className="h-3 w-3" />
                <span>{advertisement.phone_number}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white/90 text-xs">
                <Clock className="h-3 w-3" />
                <span>Limited Time Offer</span>
              </div>
            </div>

            {/* Animated highlights */}
            <div className="mt-4 h-6 overflow-hidden relative">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 text-white font-medium text-xs absolute transition-all duration-500 w-full",
                    index === highlightIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                  )}
                >
                  <Sparkles className="h-3 w-3 text-yellow-300" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side with CTA */}
          <div className={`flex items-center gap-7 flex-shrink-0 min-w-0 justify-start ${styles.carouselRight}`}>
            <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 px-3 py-1 text-xs font-semibold animate-pulse">
              SPECIAL OFFER
            </Badge>
            <Link href={advertisement.website_url || "#"}>
              <Button className="bg-white text-indigo-700 hover:bg-white/90 font-medium group px-5">
                Learn More
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button onClick={handleClose} className={styles.closeButton} aria-label="Close advertisement">
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}
