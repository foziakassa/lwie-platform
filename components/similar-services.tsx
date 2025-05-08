"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { fetchServices } from "lib/api-client"
import type { Post } from "lib/types"

export function SimilarServices({ currentId }: { currentId: string }) {
  const [services, setServices] = useState<Post[]>([])

  useEffect(() => {
    const loadSimilarServices = async () => {
      try {
        const items = await fetchServices({})
        // Filter out the current service and limit to 4
        const filteredItems = items.results.filter((item: Post) => item.id !== currentId).slice(0, 4)
        setServices(filteredItems)
      } catch (error) {
        console.error("Error loading similar services:", error)
      }
    }

    loadSimilarServices()
  }, [currentId])

  if (services.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">Similar Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <Link href={`/services/${service.id}`} key={service.id} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 h-full hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                  {service.title.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{service.category}</p>
                <p className="font-medium mt-1">ETB {service.price?.toLocaleString() || "Price not specified"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
