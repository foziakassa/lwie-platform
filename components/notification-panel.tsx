"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  is_read: boolean
  type: "swap_request" | "system" | "message"
}

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
   
    {
      id: "2",
      title: "Request Accepted nnnn",
      message: "Sarah accepted your swap request for the mountain bike",
      timestamp: "1 day ago",
      is_read: true,
      type: "swap_request",
    },
    {
      id: "3",
      title: "New Message",
      message: "You have a new message from Alex about your listing",
      timestamp: "3 days ago",
      is_read: true,
      type: "message",
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, is_read: true })))
  }

  return (
    <Card className="w-[350px] max-h-[450px] overflow-auto shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              <span className="text-xs">Mark all read</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No notifications</p>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div key={notification.id}>
                <div
                  className={`p-3 rounded-md hover:bg-muted cursor-pointer ${!notification.is_read ? "bg-muted/50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-medium ${!notification.is_read ? "font-semibold" : ""}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
