"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Phone,
  Mail,
  Heart,
  Share2,
  Flag,
  ChevronLeft,
  ChevronRight,
  Shield,
  MapPin,
  Calendar,
  Tag,
  Info,
  Clock4,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SwapRequestForm } from "@/components/swap-request-form"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

interface ServiceDetailProps {
  service: {
    id: string
    title: string
    description: string
    price: number
    images: string[]
    category: string
    city: string
    subcity?: string
    service_details?: {
      service_type?: string
      availability?: string[]
      duration?: string
      experience_level?: string
    }
    contact_info: {
      phone: string
      email: string
      preferred_contact_method: string
    }
    created_at: string
    user: {
      id: string
      name: string
      avatar?: string
      joined_date: string
      response_time?: string
    }
  }
  similarServices: Array<{
    id: string
    title: string
    price: number
    condition: string
    image: string
    city: string
  }>
}

export function ServiceDetail({ service, similarServices }: ServiceDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false)

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? service.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === service.images.length - 1 ? 0 : prev + 1))
  }

  const handleSendRequest = () => {
    setIsSwapDialogOpen(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.title,
        text: `Check out this ${service.title} on LWIE`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Service link copied to clipboard",
      })
    }
  }

  const handleFavorite = () => {
    toast({
      title: "Added to Favorites",
      description: "This service has been added to your favorites",
    })
  }

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. We'll review this listing.",
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Categories for the navigation bar
  // const categories = [
  //   "All",
  //   "Professional",
  //   "Creative",
  //   "Home",
  //   "Education",
  //   "Health",
  //   "Tech",
  //   "Events",
  //   "Beauty",
  //   "Automotive",
  // ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Navigation */}
      {/* <div className="bg-white shadow-sm overflow-x-auto">
        <div className="flex items-center space-x-6 px-4 py-2 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm whitespace-nowrap hover:text-teal-600 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-teal-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service Images */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative aspect-video">
                <Image
                  src={service.images[currentImageIndex] || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-contain"
                />

                {service.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {service.images.length > 1 && (
                <div className="flex space-x-2 p-4 bg-white">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 border-2 rounded overflow-hidden ${
                        index === currentImageIndex ? "border-teal-500" : "border-gray-200"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{service.city}</span>
                {service.subcity && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{service.subcity}</span>
                  </>
                )}
                <span className="mx-1">•</span>
                <Calendar className="h-4 w-4 mx-1" />
                <span>Posted {formatDate(service.created_at)}</span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-teal-700">{service.price.toLocaleString()} ETB</h2>
                <Badge variant="outline" className="text-gray-700 px-3 py-1 text-sm">
                  Available
                </Badge>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
              </div>

              <Separator className="my-6" />

              {/* Service Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.service_details?.service_type && (
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500 text-sm">Service Type</span>
                        <p className="font-medium">{service.service_details.service_type}</p>
                      </div>
                    </div>
                  )}
                  {service.service_details?.experience_level && (
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500 text-sm">Experience Level</span>
                        <p className="font-medium">{service.service_details.experience_level}</p>
                      </div>
                    </div>
                  )}
                  {service.service_details?.duration && (
                    <div className="flex items-start">
                      <Clock4 className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500 text-sm">Duration</span>
                        <p className="font-medium">{service.service_details.duration}</p>
                      </div>
                    </div>
                  )}
                  {service.service_details?.availability && service.service_details.availability.length > 0 && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500 text-sm">Availability</span>
                        <p className="font-medium">{service.service_details.availability.join(", ")}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-sm">Category</span>
                      <p className="font-medium">{service.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-sm">Location</span>
                      <p className="font-medium">
                        {service.city}
                        {service.subcity && `, ${service.subcity}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Service Provider</h3>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={service.user.avatar || "/placeholder.svg"} alt={service.user.name} />
                  <AvatarFallback>{service.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{service.user.name}</h4>
                  <p className="text-sm text-gray-500">Member since {formatDate(service.user.joined_date)}</p>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Clock className="h-4 w-4 mr-2" />
                <span>Usually responds within {service.user.response_time || "2 hours"}</span>
              </div>

              <div className="space-y-3">
                {showContactInfo ? (
                  <>
                    <div className="flex items-center text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{service.contact_info.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{service.contact_info.email}</span>
                    </div>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-teal-600 border-teal-600 hover:bg-teal-50"
                    onClick={() => setShowContactInfo(true)}
                  >
                    Show Contact Info
                  </Button>
                )}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-teal-600 mr-2" />
                <h3 className="text-lg font-semibold">Safety Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-teal-500">•</span>
                  <span>Verify the service provider's credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-500">•</span>
                  <span>Discuss all details and expectations before booking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-500">•</span>
                  <span>Pay only after the service is completed</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-500">•</span>
                  <span>Meet in public places when possible</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-500">•</span>
                  <span>Report suspicious behavior</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 py-6 text-lg" onClick={handleSendRequest}>
                Book Service
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 flex items-center justify-center" onClick={handleFavorite}>
                  <Heart className="h-4 w-4 mr-2" />
                  <span>Save</span>
                </Button>
                <Button variant="outline" className="flex-1 flex items-center justify-center" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Share</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center px-3"
                  onClick={handleReport}
                  aria-label="Report listing"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Verified Service Provider</p>
                  <p className="text-xs text-blue-600 mt-1">
                    This service provider has been verified by our team. Always exercise caution when booking services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Services */}
        {similarServices.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Similar Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarServices.map((item) => (
                <Link key={item.id} href={`/services/${item.id}`} className="block">
                  <div className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-square">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">{item.title}</h3>
                      <p className="text-teal-600 font-semibold">{item.price.toLocaleString()} ETB</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-xs">
                          {item.condition}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.city}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Dialog for Swap Request */}
        <Dialog open={isSwapDialogOpen} onOpenChange={setIsSwapDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book Service: {service.title}</DialogTitle>
            </DialogHeader>
            <SwapRequestForm
              itemId={service.id}
              itemTitle={service.title}
              onCancel={() => setIsSwapDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
