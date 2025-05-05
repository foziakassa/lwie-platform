"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, Flag } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { getPublishedPosts } from "../../../lib/post-storage"

interface ServicePageProps {
  params: {
    slug: string
  }
}

interface Service {
  id: string
  title: string
  price: number
  location: string
  description: string
  experience: string
  serviceArea: string
  details: string[]
  images: string[]
  provider: {
    name: string
    memberSince: string
    responseTime: string
    phone: string
    email: string
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  const { slug } = params
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [similarServices, setSimilarServices] = useState<Service[]>([])

  useEffect(() => {
    // Extract ID from slug
    const id = slug.split("-").pop()

    // Get stored posts from local storage
    const storedPosts = getPublishedPosts()

    // Find the post with the matching ID
    const post = storedPosts.find((p: any) => p.id === id && p.type === "service") as any

    if (post) {
      const price: number = post.price ?? 0
      const location: string = post.location ?? "Unknown location"
      const experience: string = post.experience ?? "Not specified"
      const serviceArea: string = post.serviceArea ?? "Not specified"

      // Format the post data for display
      setService({
        id: post.id,
        title: post.title,
        price: price,
        location: location,
        description: post.description || "No description provided",
        experience: experience,
        serviceArea: serviceArea,
        details: [
          `Category: ${post.category || "Not specified"}`,
          `Subcategory: ${post.subcategory || "Not specified"}`,
          `Experience: ${experience}`,
          `Service Area: ${serviceArea}`,
        ],
        images: Array.isArray(post.images)
          ? typeof post.images[0] === "string"
            ? post.images
            : post.images.map((img: any) => img.url)
          : ["/placeholder.svg?height=400&width=600"],
        provider: {
          name: "Service Provider",
          memberSince: "January 2023",
          responseTime: "within 2 hours",
          phone: "+251 91 234 5678",
          email: "provider@example.com",
        },
      })

      // Find similar services (same category)
      const similar = storedPosts
        .filter((p: any) => p.id !== id && p.type === "service" && p.category === post.category)
        .slice(0, 3)
        .map((p: any) => {
          const postAny = p as any
          const price: number = postAny.price ?? 0
          const location: string = postAny.location ?? "Unknown location"
          const experience: string = postAny.experience ?? "Not specified"
          const serviceArea: string = postAny.serviceArea ?? "Not specified"

          return {
            id: postAny.id,
            title: postAny.title,
            price: price,
            location: location,
            description: postAny.description || "No description provided",
            experience: experience,
            serviceArea: serviceArea,
            details: [
              `Category: ${postAny.category || "Not specified"}`,
              `Subcategory: ${postAny.subcategory || "Not specified"}`,
              `Experience: ${experience}`,
              `Service Area: ${serviceArea}`,
            ],
            images: Array.isArray(postAny.images)
              ? typeof postAny.images[0] === "string"
                ? postAny.images
                : postAny.images.map((img: any) => img.url)
              : ["/placeholder.svg?height=150&width=200"],
            provider: {
              name: "Service Provider",
              memberSince: "January 2023",
              responseTime: "within 2 hours",
              phone: "+251 91 234 5678",
              email: "provider@example.com",
            },
          }
        })

      setSimilarServices(similar)
      setLoading(false)
    } else {
      // If post not found, redirect to home
      window.location.href = "/"
    }
  }, [slug])

  const goToNextImage = () => {
    if (!service) return
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % service.images.length)
  }

  const goToPrevImage = () => {
    if (!service) return
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + service.images.length) % service.images.length)
  }

  if (loading || !service) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center text-teal-600 mb-4 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <h1 className="text-2xl font-bold mb-1">{service.title}</h1>
        <p className="flex items-center text-gray-600 mb-4">
          <span className="inline-block mr-1">📍</span> {service.location}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Service Images */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div className="relative">
                <img
                  src={service.images[currentImageIndex] || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="bg-white rounded-full p-2 shadow-md" title="Add to favorites" type="button" aria-label="Add to favorites">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="bg-white rounded-full p-2 shadow-md" title="Share service" type="button" aria-label="Share service">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="bg-white rounded-full p-2 shadow-md" title="Report service" type="button" aria-label="Report service">
                    <Flag className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex gap-2 overflow-x-auto">
                {service.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`min-w-[80px] h-[80px] border-2 rounded-md overflow-hidden cursor-pointer ${
                      index === currentImageIndex ? "border-teal-500" : "border-gray-200"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${service.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{service.price} ETB</h2>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{service.experience}</span>
              </div>

              <h3 className="font-bold mb-2">Description</h3>
              <p className="text-gray-700 mb-4">{service.description}</p>

              <h3 className="font-bold mb-2">Service Details</h3>
              <ul className="space-y-2">
                {service.details.map((detail: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="font-medium mr-2">• {detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-bold text-lg mb-4">Similar Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarServices.map((service) => (
                  <div key={service.id} className="border rounded-md overflow-hidden">
                    <img
                      src={service.images[0] || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p className="font-bold text-teal-700">{service.price} ETB</p>
                      <p className="text-sm">{service.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{service.location}</span>
                        <span className="text-xs text-gray-500">Service</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Provider Info & Safety Tips */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-bold mb-4">Service Provider</h3>
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mr-3">
                  {service.provider.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{service.provider.name}</p>
                  <p className="text-sm text-gray-600">Member since {service.provider.memberSince}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <span className="inline-block mr-2">🕒</span>
                  <span>Usually responds {service.provider.responseTime}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="inline-block mr-2">📞</span>
                  <span>{service.provider.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="inline-block mr-2">📧</span>
                  <span>{service.provider.email}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-bold mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Verify provider credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Discuss service details clearly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pay only after service completion</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Never pay full amount in advance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Report suspicious behavior</span>
                </li>
              </ul>
            </div>

            <Button className="w-full bg-teal-600 hover:bg-teal-700 mb-2">Contact Provider</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
