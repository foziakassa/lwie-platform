"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchItemById } from "@/lib/api-client"
import { MapPin, Phone, Mail, Calendar, ArrowLeft, Share2, Heart, Flag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  // Extract the item ID from the slug
  const itemId = params.slug.toString().split("-").pop()

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true)
        const itemData = await fetchItemById(itemId)
        setItem(itemData)

        // Set the first image as selected
        if (itemData.images && itemData.images.length > 0) {
          const mainImage = itemData.images.find((img: any) => img.is_main)
          setSelectedImage(mainImage ? mainImage.url : itemData.images[0].url)
        }
      } catch (error) {
        console.error("Error fetching item details:", error)
        toast({
          title: "Error loading item",
          description: "There was a problem loading the item details. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (itemId) {
      fetchItemDetails()
    }
  }, [itemId])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Item removed from your favorites" : "Item added to your favorites",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this item: ${item.title}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Item link copied to clipboard",
      })
    }
  }

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for reporting this item. We will review it shortly.",
    })
  }

  const handleContact = () => {
    toast({
      title: "Contact initiated",
      description: "You can now contact the seller directly.",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
            <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/")} className="bg-teal-600 hover:bg-teal-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6 flex items-center text-gray-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="relative h-[400px]">
                <img
                  src={selectedImage || "/placeholder.svg?height=400&width=600"}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {item.images.map((image: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image.url)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        selectedImage === image.url ? "border-teal-500" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="trade">Trade Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Category</h3>
                    <Badge variant="outline" className="text-sm font-medium">
                      {item.category_name}
                    </Badge>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="space-y-4">
                  {item.specifications ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.specifications.brand && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">Brand</h4>
                          <p>{item.specifications.brand}</p>
                        </div>
                      )}
                      {item.specifications.model && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">Model</h4>
                          <p>{item.specifications.model}</p>
                        </div>
                      )}
                      {item.specifications.year && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">Year</h4>
                          <p>{item.specifications.year}</p>
                        </div>
                      )}
                      {item.specifications.storage && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">Storage</h4>
                          <p>{item.specifications.storage}</p>
                        </div>
                      )}
                      {item.specifications.ram && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">RAM</h4>
                          <p>{item.specifications.ram}</p>
                        </div>
                      )}
                      {item.specifications.camera && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">Camera</h4>
                          <p>{item.specifications.camera}</p>
                        </div>
                      )}
                      {item.specifications.battery && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">Battery</h4>
                          <p>{item.specifications.battery}</p>
                        </div>
                      )}
                      {item.specifications.additionalDetails && (
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-semibold text-gray-500">Additional Details</h4>
                          <p className="whitespace-pre-line">{item.specifications.additionalDetails}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No specifications available for this item.</p>
                  )}
                </TabsContent>

                <TabsContent value="trade" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Trade Options</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Badge
                          className={`mr-2 ${
                            item.trade_type === "itemForItem" || item.trade_type === "openToAll"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.trade_type === "itemForItem" || item.trade_type === "openToAll"
                            ? "Accepts Trades"
                            : "No Trades"}
                        </Badge>
                        <Badge
                          className={`${
                            item.accept_cash ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.accept_cash ? "Accepts Cash" : "No Cash"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {item.specifications && item.specifications.meetupPreference && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Meetup Preference</h3>
                      <p className="text-gray-700">{item.specifications.meetupPreference}</p>
                    </div>
                  )}

                  {item.specifications && item.specifications.paymentMethods && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.specifications.paymentMethods.map((method: string) => (
                          <Badge key={method} variant="outline" className="text-sm font-medium">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.specifications &&
                    item.specifications.preferredCategories &&
                    item.specifications.preferredCategories.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Preferred Categories for Trade</h3>
                        <div className="flex flex-wrap gap-2">
                          {item.specifications.preferredCategories.map((categoryId: string) => (
                            <Badge
                              key={categoryId}
                              className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                            >
                              {categoryId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {item.specifications && item.specifications.specificItems && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Specific Items Looking For</h3>
                      <p className="text-gray-700 whitespace-pre-line">{item.specifications.specificItems}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Price and Seller Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="mr-2 text-sm font-medium">
                      {item.condition}
                    </Badge>
                    <span className="text-gray-500 text-sm">
                      Posted {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-teal-700 mb-4">{item.price.toLocaleString()} ETB</div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={handleContact}>
                    Contact Seller
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 flex items-center justify-center"
                      onClick={toggleFavorite}
                    >
                      <Heart className={`mr-1 h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      {isFavorite ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center justify-center" onClick={handleShare}>
                      <Share2 className="mr-1 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl mr-3">
                      {item.user_name ? item.user_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.user_name || "Anonymous User"}</h3>
                      <p className="text-sm text-gray-500">Member since {item.user_joined || "January 2023"}</p>
                    </div>
                  </div>

                  {item.user_phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{item.user_phone}</span>
                    </div>
                  )}

                  {item.user_email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{item.user_email}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {item.created_at
                        ? `Posted on ${new Date(item.created_at).toLocaleDateString()}`
                        : "Recently posted"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Safety Tips</h2>
                <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                  <li>Meet in a public place</li>
                  <li>Check the item before paying</li>
                  <li>Pay only after inspecting the item</li>
                  <li>Don't send money in advance</li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center"
                  onClick={handleReport}
                >
                  <Flag className="mr-1 h-4 w-4" />
                  Report this item
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Items */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Placeholder for similar items */}
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
