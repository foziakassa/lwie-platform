"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getUserListings,
  getReceivedSwapRequests,
  getUserSwapRequests,
  updateSwapRequestStatus,
} from "@/lib/api-client"
import type { Post, SwapRequest } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { Loader2, MessageSquare, Check, X } from "lucide-react"

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("items")
  const [items, setItems] = useState<Post[]>([])
  const [services, setServices] = useState<Post[]>([])
  const [receivedRequests, setReceivedRequests] = useState<SwapRequest[]>([])
  const [sentRequests, setSentRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        if (activeTab === "items") {
          const itemsData = await getUserListings("item")
          setItems(itemsData)
        } else if (activeTab === "services") {
          const servicesData = await getUserListings("service")
          setServices(servicesData)
        } else if (activeTab === "received") {
          const receivedData = await getReceivedSwapRequests()
          setReceivedRequests(receivedData)
        } else if (activeTab === "sent") {
          const sentData = await getUserSwapRequests()
          setSentRequests(sentData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [activeTab])

  const handleRequestAction = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      const result = await updateSwapRequestStatus(requestId, status)

      if (result) {
        // Update the local state
        setReceivedRequests(receivedRequests.map((req) => (req.id === requestId ? { ...req, status } : req)))

        toast({
          title: `Request ${status === "accepted" ? "Accepted" : "Rejected"}`,
          description: `You have ${status === "accepted" ? "accepted" : "rejected"} this swap request.`,
          variant: status === "accepted" ? "default" : "destructive",
        })
      }
    } catch (error) {
      console.error("Error handling request action:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the request status.",
        variant: "destructive",
      })
    }
  }

  const renderItemsGrid = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You haven't posted any items yet</p>
          <Button className="mt-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600" asChild>
            <Link href="/post/item/create">Create a New Item</Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link href={`/products/${item.id}`} key={item.id} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 h-full hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                  {item.title.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium truncate">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{item.category}</p>
                <p className="font-medium mt-1">ETB {item.price?.toLocaleString() || "Price not specified"}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.city}</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  >
                    {item.status || "published"}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  const renderServicesGrid = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (services.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium">No services found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You haven't posted any services yet</p>
          <Button className="mt-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600" asChild>
            <Link href="/post/service/create">Create a New Service</Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <Link href={`/services/${service.id}`} key={service.id} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 h-full hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                  {service.title.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium truncate">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{service.category}</p>
                <p className="font-medium mt-1">ETB {service.price?.toLocaleString() || "Price not specified"}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{service.city}</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  >
                    {service.status || "published"}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  const renderReceivedRequests = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (receivedRequests.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No swap requests</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You haven't received any swap requests yet</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {receivedRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Request for {request.post?.title || `Post #${request.post_id}`}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From: {request.users?.name || "Anonymous User"} •{" "}
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    request.status === "pending"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                      : request.status === "accepted"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>

              <div className="mb-4">
                <h4 className="font-medium">Message:</h4>
                <p className="mt-1 whitespace-pre-line">{request.message}</p>
              </div>

              {request.contact_info && (
                <div className="mb-4">
                  <h4 className="font-medium">Contact Information:</h4>
                  <div className="mt-1 text-sm">
                    {request.contact_info.phone && <p>Phone: {request.contact_info.phone}</p>}
                    {request.contact_info.email && <p>Email: {request.contact_info.email}</p>}
                  </div>
                </div>
              )}

              {request.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRequestAction(request.id, "accepted")}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRequestAction(request.id, "rejected")}
                    className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderSentRequests = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (sentRequests.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No sent requests</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You haven't sent any swap requests yet</p>
          <Button className="mt-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600" asChild>
            <Link href="/">Browse Listings</Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {sentRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Request for {request.post?.title || `Post #${request.post_id}`}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sent on: {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    request.status === "pending"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                      : request.status === "accepted"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>

              <div className="mb-4">
                <h4 className="font-medium">Your Message:</h4>
                <p className="mt-1 whitespace-pre-line">{request.message}</p>
              </div>

              <Button variant="outline" asChild>
                <Link href={`/products/${request.post_id}`}>View Item</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="items">My Items</TabsTrigger>
        <TabsTrigger value="services">My Services</TabsTrigger>
        <TabsTrigger value="received">Received Requests</TabsTrigger>
        <TabsTrigger value="sent">Sent Requests</TabsTrigger>
      </TabsList>

      <TabsContent value="items">{renderItemsGrid()}</TabsContent>

      <TabsContent value="services">{renderServicesGrid()}</TabsContent>

      <TabsContent value="received">{renderReceivedRequests()}</TabsContent>

      <TabsContent value="sent">{renderSentRequests()}</TabsContent>
    </Tabs>
  )
}
