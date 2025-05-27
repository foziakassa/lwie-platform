"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock, User, Package } from "lucide-react"

interface Notification {
  id: number
  user_id: number
  message: string
  created_at: string
  item_id: number
  offered_item_id: number
}

interface SwapRequest {
  id: number
  user_id: number
  item_id: number
  offered_item_id: number
  status: string
  created_at: string
}

type NotificationsPanelProps = {}

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export default function NotificationsPanel({}: NotificationsPanelProps) {
  const [userId, setUserId] = useState<number | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    // Get userId from cookie
    const userIdFromCookie = getCookie("userId")
    if (userIdFromCookie) {
      const parsedUserId = Number.parseInt(userIdFromCookie, 10)
      setUserId(parsedUserId)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchNotifications()
      fetchSwapRequests()
    }
  }, [userId])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`https://liwedoc.vercel.app/api/notifications/${userId}`)
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSwapRequests = async () => {
    try {
      const response = await fetch("https://liwedoc.vercel.app/api/swap-requests")
      const data = await response.json()
      if (data.success) {
        setSwapRequests(data.requests)
      }
    } catch (error) {
      console.error("Error fetching swap requests:", error)
    }
  }

  const findSwapRequestId = (notification: Notification) => {
    // Find the corresponding swap request based on item IDs
    const swapRequest = swapRequests.find(
      (request) =>
        request.item_id === notification.item_id &&
        request.offered_item_id === notification.offered_item_id &&
        request.status === "pending",
    )
    return swapRequest?.id
  }

  const handleAccept = async (notification: Notification) => {
    const swapRequestId = findSwapRequestId(notification)
    if (!swapRequestId) {
      alert("Swap request not found")
      return
    }

    setActionLoading(notification.id)
    try {
      const response = await fetch(`https://liwedoc.vercel.app/api/swap-requests/accept/${swapRequestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      if (data.success) {
        // Remove the notification from the list
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
        // Update swap requests
        fetchSwapRequests()
        alert("Swap request accepted successfully!")
      } else {
        alert("Failed to accept swap request")
      }
    } catch (error) {
      console.error("Error accepting swap request:", error)
      alert("Error accepting swap request")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (notification: Notification) => {
    const swapRequestId = findSwapRequestId(notification)
    if (!swapRequestId) {
      alert("Swap request not found")
      return
    }

    setActionLoading(notification.id)
    try {
      const response = await fetch(`https://liwedoc.vercel.app/api/swap-requests/reject/${swapRequestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      if (data.success) {
        // Remove the notification from the list
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
        // Update swap requests
        fetchSwapRequests()
        alert("Swap request rejected successfully!")
      } else {
        alert("Failed to reject swap request")
      }
    } catch (error) {
      console.error("Error rejecting swap request:", error)
      alert("Error rejecting swap request")
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading || userId === null) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Swap Notifications
          </CardTitle>
          <CardDescription>
            {userId === null ? "Please log in to view notifications" : "Loading your swap requests..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userId === null ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>You need to be logged in to view swap notifications</p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Swap Notifications
        </CardTitle>
        <CardDescription>
          {notifications.length > 0
            ? `You have ${notifications.length} pending swap request${notifications.length > 1 ? "s" : ""}`
            : "No pending swap requests"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No swap notifications at the moment</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const swapRequestId = findSwapRequestId(notification)
            const isActionDisabled = !swapRequestId || actionLoading === notification.id

            return (
              <div key={notification.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{formatDate(notification.created_at)}</p>
                      <Badge variant="secondary" className="text-xs">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(notification)}
                    disabled={isActionDisabled}
                    className="flex items-center gap-1"
                  >
                    {actionLoading === notification.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(notification)}
                    disabled={isActionDisabled}
                    className="flex items-center gap-1"
                  >
                    {actionLoading === notification.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    Reject
                  </Button>
                </div>

                {!swapRequestId && (
                  <p className="text-xs text-red-500">Warning: Corresponding swap request not found</p>
                )}
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
