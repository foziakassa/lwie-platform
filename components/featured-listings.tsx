"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { fetchItems, fetchServices } from "@/lib/api-client"
import type { Post } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Heart, Share2 } from "lucide-react"

export function FeaturedListings() {
  const [items, setItems] = useState<Post[]>([])
  const [services, setServices] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [itemsData, servicesData] = await Promise.all([fetchItems({}), fetchServices({})])
        setItems(itemsData)
        setServices(servicesData)
      } catch (error) {
        console.error("Error loading listings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Listings</h2>
        <Link
          href="/categories"
          className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Browse Categories
        </Link>
      </div>

      <Tabs defaultValue="items" className="mb-8">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {items.map((item) => (
              <Link href={`/products/${item.id}`} key={item.id} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 h-full hover:shadow-md transition-shadow">
                  <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                          {item.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button className="bg-white p-2 rounded-full shadow-sm" onClick={(e) => e.preventDefault()}>
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-sm" onClick={(e) => e.preventDefault()}>
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.price?.toLocaleString()} ETB</h3>
                        <p className="text-gray-600">{item.title}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">{item.condition || "Used"}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{item.city || "Addis Ababa"}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {services.map((service) => (
              <Link href={`/services/${service.id}`} key={service.id} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 h-full hover:shadow-md transition-shadow">
                  <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
                    {service.images && service.images.length > 0 ? (
                      <Image
                        src={service.images[0] || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                          {service.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button className="bg-white p-2 rounded-full shadow-sm" onClick={(e) => e.preventDefault()}>
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-sm" onClick={(e) => e.preventDefault()}>
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{service.price?.toLocaleString()} ETB</h3>
                        <p className="text-gray-600">{service.title}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                        {service.condition || "Available"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{service.city || "Addis Ababa"}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
