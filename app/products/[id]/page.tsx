"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Share2, Flag, MapPin, Clock, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { fetchItemById } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

// Define the Item interface to match the expected data structure
interface Item {
  id: number
  title: string
  price: string
  description: string
  condition: string
  location: string
  seller: {
    name: string
    memberSince: string
    responseTime: string
    phone: string
    email: string
  }
  details: string[] | { [key: string]: string }
  images: string[]
  similarItems?: {
    id: number
    title: string
    price: string
    condition: string
    location: string
    imageUrl: string
  }[]
}

interface ItemPageProps {
  params: {
    id: string
  }
}

// ImageGallery component for consistent image display
function ImageGallery({ images, currentIndex, onPrev, onNext, onSelect }: {
  images: string[]
  currentIndex: number
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
}) {
  return (
    <div className="relative">
      {/* Main image with navigation arrows */}
      <div className="relative h-64 md:h-96 mb-3">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Product image ${currentIndex + 1}`}
          fill
          className="object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail images */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 mb-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`relative h-12 w-12 rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? "border-teal-500 dark:border-teal-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductDetailPage({ params }: ItemPageProps) {
  const { id } = params
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true)
        const response = await fetchItemById(id)

        if (response.success && response.item) {
          setItem(response.item)
        } else {
          toast({
            title: "Error",
            description: "Failed to load product details",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading item:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadItem()
  }, [id])

  const handlePrevImage = () => {
    if (!item || item.images.length <= 1) return
    setCurrentImageIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!item || item.images.length <= 1) return
    setCurrentImageIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1))
  }

  const handleSelectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Item removed from your saved items" : "Item added to your saved items",
    })
  }

  const shareItem = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: `Check out this item: ${item?.title}`,
        url: window.location.href,
      }).catch((err) => {
        console.error("Error sharing:", err)
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Item link copied to clipboard",
      })
    }
  }

  const reportItem = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for your report. We will review this item.",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Product Not Found</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-teal-600 text-white p-3 flex items-center">
        <Link href="/" className="flex items-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" stroke.jsoup="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-bold text-xl">LWIE</span>
        </Link>
        
        <div className="relative flex-grow max-w-lg">
          <input
            type="text"
            placeholder="Search items to swap..."
            className="w-full bg-teal-700/30 text-white placeholder-teal-100/80 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center ml-auto space-x-4">
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <div className="relative">
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
          </div>
          
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          
          <button className="bg-white text-teal-600 px-4 py-1.5 rounded font-semibold hover:bg-teal-50">Post</button>
          
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          <div className="h-8 w-8 bg-white rounded-full"></div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white dark:bg-gray-900 shadow-sm overflow-x-auto">
        <div className="flex whitespace-nowrap px-4 py-2">
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">All</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Electronics</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Home Appliances</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Toys and Games</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Sport</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Health and Beauty Products</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Clothing</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Pet Supplies</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Medical Instrument</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Travel Gear</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Back to home */}
        <Link href="/" className="text-teal-600 hover:underline flex items-center mb-4 dark:text-teal-500">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>

        {/* Product Title */}
        <h1 className="text-2xl font-bold mb-1 dark:text-white">{item.title}</h1>
        <p className="flex items-center text-gray-600 mb-4 dark:text-gray-300">
          <MapPin className="h-4 w-4 mr-1" />
          {item.location}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Product Images and Details */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-800">
              <ImageGallery
                images={item.images}
                currentIndex={currentImageIndex}
                onPrev={handlePrevImage}
                onNext={handleNextImage}
                onSelect={handleSelectImage}
              />

              <div className="p-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-teal-700 dark:text-teal-500">{item.price}</h2>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{item.condition}</span>
                </div>

                <div className="flex gap-2 mb-4">
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 text-white transition-all">
                    Send Request
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className="transition-all hover:border-teal-700 hover:text-teal-700 dark:border-gray-700 dark:text-white dark:hover:border-teal-500 dark:hover:text-teal-500"
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareItem}
                    className="transition-all hover:border-teal-700 hover:text-teal-700 dark:border-gray-700 dark:text-white dark:hover:border-teal-500 dark:hover:text-teal-500"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={reportItem}
                    className="transition-all hover:border-teal-700 hover:text-teal-700 dark:border-gray-700 dark:text-white dark:hover:border-teal-500 dark:hover:text-teal-500"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="font-bold mb-2 dark:text-white">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>

                <h3 className="font-bold mb-2 dark:text-white">Details</h3>
                <ul className="space-y-2 mb-4">
                  {Array.isArray(item.details) ? (
                    item.details.map((detail, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        • {detail}
                      </li>
                    ))
                  ) : (
                    Object.entries(item.details).map(([key, value], index) => (
                      <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                        <span className="font-medium mr-2">• {key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                        <span>{value}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-lg mb-4 dark:text-white">Similar Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {item.similarItems?.map((similar) => (
                  <ProductCard
                    key={similar.id}
                    id={similar.id}
                    title={similar.title}
                    price={similar.price}
                    image={similar.imageUrl}
                    condition={similar.condition}
                    location={similar.location}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Poster Info & Safety Tips */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold mb-4 dark:text-white">Poster Information</h3>
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mr-3">
                  {item.seller?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-medium dark:text-white">{item.seller?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member since {item.seller?.memberSince || 'January 2023'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.seller?.responseTime || 'within a day'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.seller?.phone || '+251 91 234 5678'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.seller?.email || 'seller@example.com'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold mb-3 dark:text-white">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Meet poster in a safe public place</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Check the item before you swap</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pay or swap only after inspecting the item</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Never pay in advance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Report suspicious behavior</span>
                </li>
              </ul>
            </div>

            <Button className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 mb-2">
              Send Request
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center justify-center md:justify-start mb-6">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-teal-600 dark:text-teal-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 3h5m0 0v5m0-5l-6 6M3 8v13h18V8M3 8h18M3 8V3h5m0 0l6 6m0-6h5"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Safety Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>

        