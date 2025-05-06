"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchPosts } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

export default function Home() {
  const [posts, setPosts] = useState<{ items: any[]; services: any[] }>({ items: [], services: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true)
        const data = await fetchPosts()
        setPosts(data)
      } catch (error: any) {
        console.error("Error fetching posts:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to load posts. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Items</h2>
            {posts.items.length === 0 ? (
              <p>No items available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={item.images?.find((img: any) => img.is_main)?.url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover mb-4 rounded-md"
                      />
                      <p><strong>Category:</strong> {item.category_name || "N/A"}</p>
                      <p><strong>Condition:</strong> {item.condition || "N/A"}</p>
                      <p><strong>Location:</strong> {item.location || "N/A"}</p>
                      <p><strong>Price:</strong> {item.price ? `$${item.price}` : "N/A"}</p>
                      <p><strong>Description:</strong> {item.description || "No description"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            {posts.services.length === 0 ? (
              <p>No services available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={service.images?.find((img: any) => img.is_main)?.url || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-48 object-cover mb-4 rounded-md"
                      />
                      <p><strong>Category:</strong> {service.category_name || "N/A"}</p>
                      <p><strong>Location:</strong> {service.location || "N/A"}</p>
                      <p><strong>Hourly Rate:</strong> {service.hourly_rate ? `$${service.hourly_rate}` : "N/A"}</p>
                      <p><strong>Description:</strong> {service.description || "No description"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}