import { fetchItemById } from "../../../lib/api-client"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Heart, Share2, Flag, MapPin, Calendar, User, Shield } from "lucide-react"

interface Item {
  id: string
  title: string
  description: string
  images: string[]
  location?: string
  postedDate?: string
  categories?: string[]
  condition?: string
  specifications?: { name: string; value: string }[]
  tradePreferences?: {
    lookingFor?: string
    tradeValue?: string
    openToOffers?: boolean
  }
  postedBy?: {
    name?: string
    memberSince?: string
    responseRate?: string
    responseTime?: string
  }
}

interface FetchItemResponseSuccess {
  success: true
  item: Item
}

interface FetchItemResponseError {
  success: false
  error: string
}

type FetchItemResponse = FetchItemResponseSuccess | FetchItemResponseError

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const response = (await fetchItemById(params.slug)) as FetchItemResponse

  return {
    title: response.success ? response.item.title : "Item Details",
    description: response.success ? response.item.description : "View item details",
  }
}

export default async function ItemDetailPage({ params }: { params: { slug: string } }) {
  const response = (await fetchItemById(params.slug)) as FetchItemResponse

  if (!response.success) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <p>The item you are looking for does not exist or has been removed.</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to home
        </Link>
      </div>
    )
  }

  const item = response.item

  const similarItems = [
    {
      id: "1",
      title: "Vintage Camera",
      image: "/placeholder.svg?height=200&width=300",
      location: "New York",
      postedDate: "2 days ago",
    },
    {
      id: "2",
      title: "Professional Tripod",
      image: "/placeholder.svg?height=200&width=300",
      location: "Los Angeles",
      postedDate: "1 week ago",
    },
    {
      id: "3",
      title: "Camera Lens Kit",
      image: "/placeholder.svg?height=200&width=300",
      location: "Chicago",
      postedDate: "3 days ago",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Item Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={item.images?.[0] || "/placeholder.svg?height=400&width=600"}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {(item.images || []).slice(1).map((image: string, index: number) => (
              <div key={index} className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={image || "/placeholder.svg?height=100&width=100"}
                  alt={`${item.title} - image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Heart size={16} />
                <span>Save</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 size={16} />
                <span>Share</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Flag size={16} />
                <span>Report</span>
              </Button>
            </div>
            <div className="text-sm text-gray-500">ID: {item.id}</div>
          </div>

          {/* Item Info */}
          <div>
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin size={16} />
                <span>{item.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar size={16} />
                <span>{item.postedDate || "Recently posted"}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.categories?.map((category: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
              {item.condition && (
                <Badge variant="outline" className="bg-green-50">
                  {item.condition}
                </Badge>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="trade">Trade Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Item Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {item.specifications?.map((spec: { name: string; value: string }, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium">{spec.name}:</span>
                      <span className="text-gray-700">{spec.value}</span>
                    </div>
                  )) || <p className="text-gray-500 col-span-2">No specifications provided</p>}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="trade" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Trade Preferences</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Looking for:</strong> {item.tradePreferences?.lookingFor || "Not specified"}
                  </p>
                  <p>
                    <strong>Trade Value:</strong> {item.tradePreferences?.tradeValue || "Not specified"}
                  </p>
                  <p>
                    <strong>Open to Offers:</strong> {item.tradePreferences?.openToOffers ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Similar Items */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Similar Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {similarItems.map((similarItem) => (
                <Link href={`/items/${similarItem.id}`} key={similarItem.id}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                      <Image
                        src={similarItem.image || "/placeholder.svg"}
                        alt={similarItem.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{similarItem.title}</h3>
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{similarItem.location}</span>
                        <span>{similarItem.postedDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Poster Info & Actions */}
        <div className="space-y-6">
          {/* Poster Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <User className="absolute inset-0 m-auto text-gray-400" size={24} />
                </div>
                <div>
                  <h3 className="font-medium">{item.postedBy?.name || "Anonymous User"}</h3>
                  <p className="text-sm text-gray-500">Member since {item.postedBy?.memberSince || "recently"}</p>
                </div>
              </div>

              <Button className="w-full mb-4">Send Request</Button>

              <div className="text-sm text-gray-500">
                <p>Response rate: {item.postedBy?.responseRate || "Unknown"}</p>
                <p>Average response time: {item.postedBy?.responseTime || "Unknown"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-green-600" />
                <h3 className="font-medium">Safety Tips</h3>
              </div>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Meet in a public place</li>
                <li>• Don't pay in advance</li>
                <li>• Inspect the item before trading</li>
                <li>• Verify the item's condition and authenticity</li>
              </ul>
              <Link href="/safety" className="text-sm text-blue-600 hover:underline block mt-4">
                Learn more about safe trading
              </Link>
            </CardContent>
          </Card>

          {/* Item Location */}
          {item.location && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-blue-600" />
                  <h3 className="font-medium">Item Location</h3>
                </div>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <Image
                    src="/placeholder.svg?height=200&width=300&text=Map"
                    alt="Location map"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-gray-700">{item.location}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
