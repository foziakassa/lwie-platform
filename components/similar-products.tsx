"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { fetchItems } from "lib/api-client"
import type { Post } from "lib/types"

export function SimilarProducts({ currentId }: { currentId: string }) {
  const [products, setProducts] = useState<Post[]>([])

  useEffect(() => {
    const loadSimilarProducts = async () => {
      try {
        const items = await fetchItems({})
        // Filter out the current product and limit to 4
        const filteredItems = items.results.filter((item: Post) => item.id !== currentId).slice(0, 4)
        setProducts(filteredItems)
      } catch (error) {
        console.error("Error loading similar products:", error)
      }
    }

    loadSimilarProducts()
  }, [currentId])

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">Similar Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <Link href={`/products/${item.id}`} key={item.id} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 h-full hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                  {item.title.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{item.category}</p>
                <p className="font-medium mt-1">ETB {item.price?.toLocaleString() || "Price not specified"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
