"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Building,
  Package,
  AlertCircle,
  Navigation,
  Search,
  ZoomIn,
  ZoomOut,
  Check,
  Loader2,
  Share2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export default function CharityContact() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [formData, setFormData] = useState({
    name: "jhon",
    email: "@jhone",
    message: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showDirectionsDialog, setShowDirectionsDialog] = useState(false)
  const [showSavedDialog, setShowSavedDialog] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [selectedTravelMode, setSelectedTravelMode] = useState("driving")
  const [directionsResult, setDirectionsResult] = useState("")
  const [startLocation, setStartLocation] = useState("")
  const totalSlides = 4

  // Images for the carousel
  const images = ["/donation-clothes.jpg", "/donation-food.jpg", "/donation-books.jpg", "/donation-toys.jpg"]

  // Auto-advance carousel
  useEffect(() => {
    if (!formSubmitted) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [formSubmitted, totalSlides])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { name: "", email: "", message: "" }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
      valid = false
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false)
        setFormSubmitted(true)
        toast({
          title: "Donation request sent!",
          description: "Thank you for your generosity. We'll contact you soon.",
          variant: "default",
        })
      }, 1500)
    }
  }

  const zoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 0.2, 2))
  }

  const zoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 0.2, 0.6))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      // Simulate search
      setTimeout(() => {
        setIsSearching(false)
        toast({
          title: "Location found",
          description: `Found results for "${searchQuery}"`,
          variant: "default",
        })
      }, 1000)
    }
  }

  const handleMyLocation = () => {
    toast({
      title: "Using your location",
      description: "Getting directions from your current location",
      variant: "default",
    })
  }

  const handleShareLocation = () => {
    console.log("Share button clicked")
    setShowShareDialog(true)
  }

  const handleSaveLocation = () => {
    console.log("Save button clicked")
    setShowSavedDialog(true)
    setTimeout(() => setShowSavedDialog(false), 2000)
  }

  const handleGetDirections = () => {
    console.log("Directions button clicked")
    setShowDirectionsDialog(true)
  }

  const handleTravelModeChange = (mode: string) => {
    setSelectedTravelMode(mode)
    // Simulate calculating new directions based on mode
    const estimatedTime = mode === "driving" ? "15 min" : mode === "walking" ? "45 min" : "30 min"
    setDirectionsResult(`Estimated travel time via ${mode}: ${estimatedTime}`)
  }

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent("Check out this location")
    const body = encodeURIComponent(
      "Here's the location I wanted to share with you: AA, kotebe\nhttps://maps.example.com/location?q=AA,kotebe",
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
    toast({
      title: "Email client opened",
      description: "Share this location via email",
      variant: "default",
    })
  }

  const handleShareViaWhatsApp = () => {
    const text = encodeURIComponent(
      "Check out this location: AA, kotebe\nhttps://maps.example.com/location?q=AA,kotebe",
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
    toast({
      title: "Opening WhatsApp",
      description: "Share this location via WhatsApp",
      variant: "default",
    })
  }

  const handleShareViaTelegram = () => {
    const text = encodeURIComponent(
      "Check out this location: AA, kotebe\nhttps://maps.example.com/location?q=AA,kotebe",
    )
    window.open(`https://t.me/share/url?url=https://maps.example.com/location?q=AA,kotebe&text=${text}`, "_blank")
    toast({
      title: "Opening Telegram",
      description: "Share this location via Telegram",
      variant: "default",
    })
  }

  const handleShareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://maps.example.com/location?q=AA,kotebe")}`,
      "_blank",
    )
    toast({
      title: "Opening Facebook",
      description: "Share this location via Facebook",
      variant: "default",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/charity"
            className="text-sm text-gray-600 hover:text-teal-500 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Charity
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left side - Image carousel and contact form */}
            <div className="p-6 md:p-8">
              {/* Image carousel */}
              <div className="relative mb-8 rounded-lg overflow-hidden border border-gray-200">
                <div className="relative h-[250px] w-full bg-gray-100">
                  {images.map((src, index) => (
                    <div
                      key={index}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        activeSlide === index ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {index === 0 && (
                        <Image
                          src="/placeholder.svg?height=250&width=400&text=Clothing+Donations"
                          alt="Clothing donations"
                          fill
                          className="object-cover"
                        />
                      )}
                      {index === 1 && (
                        <Image
                          src="/placeholder.svg?height=250&width=400&text=Food+Donations"
                          alt="Food donations"
                          fill
                          className="object-cover"
                        />
                      )}
                      {index === 2 && (
                        <Image
                          src="/placeholder.svg?height=250&width=400&text=Book+Donations"
                          alt="Book donations"
                          fill
                          className="object-cover"
                        />
                      )}
                      {index === 3 && (
                        <Image
                          src="/placeholder.svg?height=250&width=400&text=Toy+Donations"
                          alt="Toy donations"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-md transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-md transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activeSlide === index ? "bg-teal-500 scale-110" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Contatct as if you have something to donate</h2>
                <p className="text-gray-600">
                  Your donations make a real difference. Fill out the form below and we'll get back to you about your
                  donation.
                </p>
              </div>

              {/* Contact form */}
              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-4">
                    Your donation request has been received. We'll contact you soon at {formData.email}.
                  </p>
                  <Button
                    onClick={() => {
                      setFormSubmitted(false)
                      setFormData((prev) => ({ ...prev, message: "" }))
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    Submit Another Donation
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? "border-red-300" : ""}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-300" : ""}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about what you'd like to donate..."
                      rows={4}
                      className={errors.message ? "border-red-300" : ""}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md transition-all w-24"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Right side - Contact information and map */}
            <div className="bg-gray-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-200">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Phone</p>
                      <p className="text-gray-600">2519654332</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">email</p>
                      <p className="text-gray-600">chdecb@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">location</p>
                      <p className="text-gray-600">AA, kotebe</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Need</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">Cloths</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-teal-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Company Info</p>
                      <p className="text-gray-600 text-sm">fghjjhbrf hebfef ehrfbufb rhebfufhbffbrufb3ier</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Map Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Location</h3>
                <Card className="overflow-hidden">
                  <CardContent className="p-0 relative">
                    <div
                      className="relative overflow-hidden transition-all duration-300"
                      style={{ transform: `scale(${mapZoom})`, transformOrigin: "center" }}
                    >
                      <Image
                        src="/placeholder.svg?height=285&width=412&text=Map+of+Addis+Ababa"
                        alt="Map of Addis Ababa"
                        width={412}
                        height={285}
                        className="w-full"
                      />
                    </div>

                    {/* Map Controls */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white shadow-md hover:bg-gray-100"
                        onClick={zoomIn}
                      >
                        <ZoomIn className="h-4 w-4" />
                        <span className="sr-only">Zoom in</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white shadow-md hover:bg-gray-100"
                        onClick={zoomOut}
                      >
                        <ZoomOut className="h-4 w-4" />
                        <span className="sr-only">Zoom out</span>
                      </Button>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="absolute bottom-3 left-3 right-12 flex items-center">
                      <div className="relative w-full">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search location..."
                          className="pl-8 pr-8 py-1 h-8 bg-white/90 backdrop-blur-sm border-gray-200"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500"
                          onClick={handleMyLocation}
                        >
                          <Navigation className="h-3 w-3" />
                          <span className="sr-only">My location</span>
                        </Button>
                      </div>
                    </form>

                    {/* Map Dimensions */}
                    <div className="absolute bottom-3 right-3 bg-white text-gray-700 px-2 py-1 text-xs rounded shadow-sm">
                      412 × 285
                    </div>

                    {/* Location Marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-500">
                      <div className="relative">
                        <MapPin className="h-8 w-8" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded shadow-md whitespace-nowrap">
                          <span className="text-xs font-medium">AA, kotebe</span>
                        </div>
                      </div>
                    </div>

                    {/* Loading overlay for search */}
                    {isSearching && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white p-3 rounded-full">
                          <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Map Features - FIXED BUTTONS */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {/* Directions Button - Fixed */}
                  <div
                    className="cursor-pointer w-full h-8 bg-white hover:bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-xs font-medium text-gray-700 transition-colors"
                    onClick={handleGetDirections}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    <span>Directions</span>
                  </div>

                  {/* Save Button - Fixed */}
                  <div
                    className="cursor-pointer w-full h-8 bg-white hover:bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-xs font-medium text-gray-700 transition-colors"
                    onClick={handleSaveLocation}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Save</span>
                  </div>

                  {/* Share Button - Fixed */}
                  <div
                    className="cursor-pointer w-full h-8 bg-white hover:bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-xs font-medium text-gray-700 transition-colors"
                    onClick={handleShareLocation}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    <span>Share</span>
                  </div>
                </div>

                {/* Nearby Places */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Nearby Places</h4>
                  <div className="space-y-2">
                    {["Hospital", "School", "Market"].map((place, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                        <span>{place}</span>
                        <span className="text-xs text-gray-500">{(index + 1) * 0.3} km</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="text-gray-900">
            <DialogTitle className="text-xl font-bold text-gray-900">Share Location</DialogTitle>
            <DialogDescription className="text-gray-700">Share this location with others</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                value="https://maps.example.com/location?q=AA,kotebe"
                readOnly
                className="bg-white text-gray-900 border-gray-300"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText("https://maps.example.com/location?q=AA,kotebe")
                  toast({
                    title: "Copied to clipboard",
                    description: "Link has been copied to clipboard",
                    variant: "default",
                  })
                }}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Copy
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                onClick={handleShareViaEmail}
              >
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                onClick={handleShareViaWhatsApp}
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                onClick={handleShareViaTelegram}
              >
                Telegram
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                onClick={handleShareViaFacebook}
              >
                Facebook
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Directions Dialog */}
      <Dialog open={showDirectionsDialog} onOpenChange={setShowDirectionsDialog}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg">
          <DialogHeader className="text-gray-900">
            <DialogTitle className="text-xl font-bold text-gray-900">Get Directions</DialogTitle>
            <DialogDescription className="text-gray-700">Find your way to our location</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="start" className="text-sm font-medium text-gray-800">
                Starting Point
              </label>
              <Input
                id="start"
                placeholder="Enter your starting location"
                className="bg-white text-gray-900 border-gray-300"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end" className="text-sm font-medium text-gray-800">
                Destination
              </label>
              <Input id="end" value="AA, kotebe" readOnly className="bg-white text-gray-900 border-gray-300" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Travel Mode</label>
              <div className="flex gap-2">
                <Button
                  variant={selectedTravelMode === "driving" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${selectedTravelMode === "driving" ? "bg-teal-500 text-white" : "bg-white text-gray-800 border-gray-300"}`}
                  onClick={() => handleTravelModeChange("driving")}
                >
                  Driving
                </Button>
                <Button
                  variant={selectedTravelMode === "walking" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${selectedTravelMode === "walking" ? "bg-teal-500 text-white" : "bg-white text-gray-800 border-gray-300"}`}
                  onClick={() => handleTravelModeChange("walking")}
                >
                  Walking
                </Button>
                <Button
                  variant={selectedTravelMode === "transit" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${selectedTravelMode === "transit" ? "bg-teal-500 text-white" : "bg-white text-gray-800 border-gray-300"}`}
                  onClick={() => handleTravelModeChange("transit")}
                >
                  Transit
                </Button>
              </div>
            </div>

            {directionsResult && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700">{directionsResult}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!startLocation.trim()) {
                  toast({
                    title: "Starting point required",
                    description: "Please enter a starting location",
                    variant: "destructive",
                  })
                  return
                }

                // Simulate calculating directions
                const estimatedTime =
                  selectedTravelMode === "driving" ? "15 min" : selectedTravelMode === "walking" ? "45 min" : "30 min"
                setDirectionsResult(
                  `Route from ${startLocation} to AA, kotebe\nEstimated travel time via ${selectedTravelMode}: ${estimatedTime}`,
                )

                toast({
                  title: "Directions ready",
                  description: `Directions to AA, kotebe via ${selectedTravelMode} have been calculated`,
                  variant: "default",
                })
              }}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              Get Directions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Location Success */}
      {showSavedDialog && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="bg-green-100 rounded-full p-1">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Location Saved</p>
            <p className="text-sm text-gray-500">AA, kotebe has been saved to your places</p>
          </div>
        </div>
      )}
    </div>
  )
}
