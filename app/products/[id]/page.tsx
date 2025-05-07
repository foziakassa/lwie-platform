"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchItemById } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

interface ItemPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ItemPageProps) {
  const { id } = params;
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true)
        // Use the actual ID from params
        const response = await fetchItemById(id);
        
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
        title: item.title,
        text: `Check out this item: ${item.title}`,
        url: window.location.href,
      }).catch((err) => {
        console.error("Error sharing:", err)
      })
    } else {
      // Fallback for browsers that don't support Web Share API
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-teal-600 text-white p-3 flex items-center">
        <Link href="/" className="flex items-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
      <div className="bg-white shadow-sm overflow-x-auto">
        <div className="flex whitespace-nowrap px-4 py-2">
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">All</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Electronics</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Home Appliances</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Toys and Games</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Sport</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Health and Beauty Products</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Clothing</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Pet Supplies</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Medical Instrument</button>
          <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Travel Gear</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Back to home */}
        <Link href="/" className="text-teal-600 hover:underline flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>

        {/* Product Title */}
        <h1 className="text-2xl font-bold mb-1">{item.title}</h1>
        <p className="flex items-center text-gray-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {item.location}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Product Images */}
          <div className="md:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="relative h-96 mb-4 bg-gray-50 rounded-md overflow-hidden">
                <img
                  src={item.images[currentImageIndex] || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    onClick={toggleFavorite}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button 
                    onClick={shareItem}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={reportItem}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                  >
                    <Flag className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {item.images.length > 1 && (
                <div className="flex overflow-x-auto space-x-2 pb-2">
                  {item.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 bg-gray-50 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index ? "border-teal-500" : "border-gray-200"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt={`${item.title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">10,500 ETB</h2>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.condition}</span>
              </div>

              <h3 className="font-bold mb-2">Description</h3>
              <p className="text-gray-700 mb-4">{item.description}</p>

              <h3 className="font-bold mb-2">Details</h3>
              <ul className="space-y-2">
                {item.details && Object.entries(item.details).map(([key, value]: [string, any], index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="font-medium mr-2">• {key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="font-bold text-lg mb-4">Similar Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {item.similarItems && item.similarItems.map((similar: any) => (
                  <div key={similar.id} className="border rounded-md overflow-hidden">
                    <img
                      src={similar.imageUrl || "/placeholder.svg"}
                      alt={similar.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p className="font-bold text-teal-700">{similar.price} ETB</p>
                      <p className="text-sm">{similar.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{similar.location}</span>
                        <span className="text-xs text-gray-500">{similar.condition}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Poster Info & Safety Tips */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="font-bold mb-4">Poster Information</h3>
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mr-3">
                  {item.seller?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-medium">{item.seller?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-600">Member since {item.seller?.memberSince || 'January 2023'}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <span className="inline-block mr-2">🕒</span>
                  <span>Usually responds {item.seller?.responseTime || 'within a day'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="inline-block mr-2">📞</span>
                  <span>{item.seller?.phone || '+251 91 234 5678'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="inline-block mr-2">📧</span>
                  <span>{item.seller?.email || 'seller@example.com'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="font-bold mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm">
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

            <Button className="w-full bg-teal-600 hover:bg-teal-700 mb-2">Send Request</Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12">
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
                  className="text-teal-600"
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
              <h3 className="font-semibold text-lg mb-2">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Safety Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-2">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>{" "}
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>{" "}
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
