"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Mail, Phone, Star, Clock, Sparkles, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AdvertisementBannerProps {
  companyName?: string
  email?: string
  contact?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  showBadge?: boolean
  badgeText?: string
  onClose?: () => void
  className?: string
}

export default function AdvertisementBanner({
  companyName = "Stellar Solutions",
  email = "contact@stellarsolutions.com",
  contact = "+1 (555) 123-4567",
  description = "Transform your business with our innovative solutions. Limited time offer: Get 20% off your first purchase!",
  ctaText = "Learn More",
  ctaLink = "#",
  showBadge = true,
  badgeText = "SPECIAL OFFER",
  onClose,
  className,
}: AdvertisementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const highlights = ["Premium Quality", "24/7 Support", "Best Value"]

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % highlights.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [highlights.length])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  return (
    <div
      className={cn("relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500", className)}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side with image and company info */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10 rounded-full" />
              <Image
                src="/placeholder.svg?height=80&width=80&text=Logo"
                alt="Company Logo"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">{companyName}</h3>
              <div className="flex items-center gap-1 text-white/80 text-xs md:text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                ))}
                <span className="ml-1">Trusted by 10,000+ customers</span>
              </div>
            </div>
          </div>

          {/* Middle section with description and highlights */}
          <div className="flex-grow text-center md:text-left">
            <p className="text-white text-sm md:text-base max-w-xl">{description}</p>

            <div className="mt-2 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-1 text-white/90 text-xs">
                <Mail className="h-3 w-3" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-1 text-white/90 text-xs">
                <Phone className="h-3 w-3" />
                <span>{contact}</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-white/90 text-xs">
                <Clock className="h-3 w-3" />
                <span>Limited Time Offer</span>
              </div>
            </div>

            {/* Animated highlights */}
            <div className="mt-2 h-6 overflow-hidden relative">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-1 text-white font-medium text-xs absolute transition-all duration-500 w-full",
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
          <div className="flex items-center gap-3">
            {showBadge && (
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 px-2 py-1 text-xs font-semibold animate-pulse">
                {badgeText}
              </Badge>
            )}
            <Link href={ctaLink}>
              <Button className="bg-white text-indigo-700 hover:bg-white/90 font-medium group">
                {ctaText}
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
        aria-label="Close advertisement"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}
