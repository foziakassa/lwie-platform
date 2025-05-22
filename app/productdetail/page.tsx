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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SwapRequestForm } from "@/components/swap-request-form"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

interface ProductDetailProps {
  product: {
    id: string
    title: string
    description: string
    price: number
    condition: string
    images: string[]
    category: string
    subcategory: string
    city: string
    subcity?: string
    additional_details?: string
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
  similarProducts: Array<{
    id: string
    title: string
    price: number
    condition: string
    image: string
    city: string
  }>
}

export default function ProductDetail({ product, similarProducts }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false)

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const handleSendRequest = () => {
    setIsSwapDialogOpen(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this ${product.title} on LWIE`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  const handleFavorite = () => {
    toast({
      title: "Added to Favorites",
      description: "This item has been added to your favorites",
    })
  }

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. We'll review this listing.",
    })
  }

  // Parse additional details if available
  let additionalDetails = {}
  if (product.additional_details) {
    try {
      additionalDetails = JSON.parse(product.additional_details)
    } catch (e) {
      console.error("Error parsing additional details:", e)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Categories for the navigation bar
  const categories = [
    "All",
    "Electronics",
    "Home Appliances",
    "Toys and Games",
    "Sport",
    "Health and Beauty",
    "Clothing",
    "Pet Supplies",
    "Medical Instrument",
    "Travel Gear",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Navigation */}
      <div className="bg-white shadow-sm overflow-x-auto">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/" className="flex items-center text-gray-600 hover:text-teal-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative aspect-video">
                <Image
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-contain"
                />

                {product.images.length > 1 && (
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
              {product.images.length > 1 && (
                <div className="flex space-x-2 p-4 bg-white">
                  {product.images.map((image, index) => (
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
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{product.city}</span>
                {product.subcity && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{product.subcity}</span>
                  </>
                )}
                <span className="mx-1">•</span>
                <Calendar className="h-4 w-4 mx-1" />
                <span>Posted {formatDate(product.created_at)}</span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-teal-700">{product.price.toLocaleString()} ETB</h2>
                <Badge variant="outline" className="text-gray-700 px-3 py-1 text-sm">
                  {product.condition}
                </Badge>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>

              <Separator className="my-6" />

              {/* Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(additionalDetails).map(([key, value]) => (
                    <div key={key} className="flex items-start">
                      <Tag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500 text-sm">{key}</span>
                        <p className="font-medium">{String(value)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-sm">Category</span>
                      <p className="font-medium">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-sm">Subcategory</span>
                      <p className="font-medium">{product.subcategory}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-sm">Condition</span>
                      <p className="font-medium">{product.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500 text-sm">Location</span>
                      <p className="font-medium">
                        {product.city}
                        {product.subcity && `, ${product.subcity}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Poster Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Poster Information</h3>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={product.user.avatar || "/placeholder.svg"} alt={product.user.name} />
                  <AvatarFallback>{product.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{product.user.name}</h4>
                  <p className="text-sm text-gray-500">Member since {formatDate(product.user.joined_date)}</p>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Clock className="h-4 w-4 mr-2" />
                <span>Usually responds within {product.user.response_time || "2 hours"}</span>
              </div>

              <div className="space-y-3">
                {showContactInfo ? (
                  <>
                    <div className="flex items-center text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{product.contact_info.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{product.contact_info.email}</span>
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
                  <span>Meet poster in a safe public place</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-500">•</span>
                  <span>Check the item before you swap</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-500">•</span>
                  <span>Pay or swap only after inspecting the item</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-500">•</span>
                  <span>Never pay in advance</span>
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
                Send Request
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
                  <p className="text-sm font-medium text-blue-700">Verified Listing</p>
                  <p className="text-xs text-blue-600 mt-1">
                    This listing has been verified by our team. Always exercise caution when making transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="block">
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
              <DialogTitle>Swap Request for {product.title}</DialogTitle>
            </DialogHeader>
            <SwapRequestForm
              itemId={product.id}
              itemTitle={product.title}
              onCancel={() => setIsSwapDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
