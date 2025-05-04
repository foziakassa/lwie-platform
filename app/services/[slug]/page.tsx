"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchServiceById } from "@/lib/api-client"
import { MapPin, Phone, Mail, Calendar, ArrowLeft, Share2, Heart, Flag, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  // Extract the service ID from the slug
  const serviceId = params.slug.toString().split("-").pop()

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true)
        const serviceData = await fetchServiceById(serviceId)
        setService(serviceData)

        // Set the first image as selected
        if (serviceData.images && serviceData.images.length > 0) {
          const mainImage = serviceData.images.find((img: any) => img.is_main)
          setSelectedImage(mainImage ? mainImage.url : serviceData.images[0].url)
        }
      } catch (error) {
        console.error("Error fetching service details:", error)
        toast({
          title: "Error loading service",
          description: "There was a problem loading the service details. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (serviceId) {
      fetchServiceDetails()
    }
  }, [serviceId])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Service removed from your favorites" : "Service added to your favorites",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.title,
        text: `Check out this service: ${service.title}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Service link copied to clipboard",
      })
    }
  }

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for reporting this service. We will review it shortly.",
    })
  }

  const handleContact = () => {
    toast({
      title: "Contact initiated",
      description: "You can now contact the service provider directly.",
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
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
                  alt={service.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail Gallery */}
              {service.images && service.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {service.images.map((image: any, index: number) => (
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

            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{service.location}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Category</h3>
                    <Badge variant="outline" className="text-sm font-medium">
                      {service.category_name}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Time Estimation</h3>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-2 text-gray-500" />
                      <span>
                        {service.time_estimation} {service.time_unit}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="terms" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cancellation Policy</h3>
                    <Badge
                      className={`${
                        service.cancellation_policy === "flexible"
                          ? "bg-green-100 text-green-800"
                          : service.cancellation_policy === "moderate"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.cancellation_policy.charAt(0).toUpperCase() + service.cancellation_policy.slice(1)}
                    </Badge>
                    <p className="mt-2 text-gray-700">
                      {service.cancellation_policy === "flexible"
                        ? "Full refund if cancelled at least 24 hours before the scheduled service."
                        : service.cancellation_policy === "moderate"
                          ? "50% refund if cancelled at least 48 hours before the scheduled service."
                          : "No refunds for cancellations."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Trade Options</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Badge
                          className={`mr-2 ${
                            service.trade_type === "serviceForItem" || service.trade_type === "openToAll"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.trade_type === "serviceForItem" || service.trade_type === "openToAll"
                            ? "Accepts Item Trades"
                            : "No Item Trades"}
                        </Badge>
                        <Badge
                          className={`${
                            service.trade_type === "serviceForService" || service.trade_type === "openToAll"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.trade_type === "serviceForService" || service.trade_type === "openToAll"
                            ? "Accepts Service Trades"
                            : "No Service Trades"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Price and Provider Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="mr-2 text-sm font-medium">
                      Service
                    </Badge>
                    <span className="text-gray-500 text-sm">
                      Posted {new Date(service.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-teal-700 mb-4">
                    {service.hourly_rate.toLocaleString()} ETB
                    <span className="text-base font-normal text-gray-500">/hr</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={handleContact}>
                    Contact Provider
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
                <h2 className="text-lg font-semibold mb-4">Provider Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl mr-3">
                      {service.user_name ? service.user_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h3 className="font-medium">{service.user_name || "Anonymous Provider"}</h3>
                      <p className="text-sm text-gray-500">Member since {service.user_joined || "January 2023"}</p>
                    </div>
                  </div>

                  {service.user_phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{service.user_phone}</span>
                    </div>
                  )}

                  {service.user_email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{service.user_email}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {service.created_at
                        ? `Posted on ${new Date(service.created_at).toLocaleDateString()}`
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
                  <li>Verify provider credentials before hiring</li>
                  <li>Discuss all details and expectations upfront</li>
                  <li>Get a written agreement when possible</li>
                  <li>Pay only after the service is completed satisfactorily</li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center"
                  onClick={handleReport}
                >
                  <Flag className="mr-1 h-4 w-4" />
                  Report this service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Services */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Similar Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Placeholder for similar services */}
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
