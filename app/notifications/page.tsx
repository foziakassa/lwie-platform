"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Repeat, Heart, Gift, Settings, Check, Trash2, ChevronRight } from "lucide-react"

// Mock notifications data
const allNotifications = [
  {
    id: 1,
    type: "swap_request",
    read: false,
    title: "New swap request",
    message: "John wants to swap his iPhone 12 for your MacBook Pro",
    time: "5 minutes ago",
    actionUrl: "/swaps/123",
    user: {
      name: "John Doe",
      image: "/placeholder.svg?height=200&width=200",
    },
    item: {
      title: "iPhone 12",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: 3,
    type: "swap_accepted",
    read: true,
    title: "Swap accepted",
    message: "Michael accepted your swap request for the Mountain Bike",
    time: "2 hours ago",
    actionUrl: "/swaps/789",
    user: {
      name: "Michael Brown",
      image: "/placeholder.svg?height=200&width=200",
    },
    item: {
      title: "Mountain Bike",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: 4,
    type: "swap_rejected",
    read: true,
    title: "Swap declined",
    message: "Emma declined your swap request for the Designer Sofa",
    time: "5 hours ago",
    actionUrl: "/swaps/101",
    user: {
      name: "Emma Wilson",
      image: "/placeholder.svg?height=200&width=200",
    },
    item: {
      title: "Designer Sofa",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: 5,
    type: "like",
    read: true,
    title: "Someone liked your item",
    message: "David liked your Vintage Camera listing",
    time: "1 day ago",
    actionUrl: "/items/112",
    user: {
      name: "David Clark",
      image: "/placeholder.svg?height=200&width=200",
    },
    item: {
      title: "Vintage Camera",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: 6,
    type: "donation",
    read: true,
    title: "Donation received",
    message: "Ethiopian Red Cross Society received your donation of Winter Clothes",
    time: "2 days ago",
    actionUrl: "/donations/133",
    charity: {
      name: "Ethiopian Red Cross Society",
      image: "/placeholder.svg?height=200&width=200",
    },
    item: {
      title: "Winter Clothes",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
]

// Define notification filter types
const notificationTypes = [
  { id: "all", label: "All", icon: Bell },
  { id: "swap_request", label: "Swap Requests", icon: Repeat },
  { id: "like", label: "Likes", icon: Heart },
  { id: "donation", label: "Donations", icon: Gift },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState(allNotifications)

  // Filter notifications by type
  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter(
          (notif) => notif.type === activeTab || (activeTab === "swap_request" && notif.type.includes("swap")),
        )

  // Icon mapping for notification types
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "swap_request":
      case "swap_accepted":
      case "swap_rejected":
        return <Repeat className="h-5 w-5" />
      case "like":
        return <Heart className="h-5 w-5" />
      case "donation":
        return <Gift className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  // Get background color for notification icon
  const getIconBackground = (type: string, read: boolean) => {
    if (!read) return "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400"

    switch (type) {
      case "swap_request":
      case "swap_accepted":
      case "swap_rejected":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      case "like":
        return "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
      case "donation":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  // Count unread notifications
  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                  You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={markAllAsRead}
                className="flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <Check className="h-4 w-4 mr-2 text-teal-600" />
                <span className="text-sm font-medium">Mark all read</span>
              </button>
              <button className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </motion.div>

          {/* Notification Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            {notificationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`flex items-center px-5 py-4 text-sm whitespace-nowrap transition-colors ${
                  activeTab === type.id
                    ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <type.icon className="h-4 w-4 mr-2" />
                {type.label}
                {type.id === "all" && unreadCount > 0 && (
                  <span className="ml-2 bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-xl font-medium mb-2">No notifications</h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    You don't have any {activeTab !== "all" ? activeTab.replace("_", " ") : ""} notifications right now.
                  </p>
                </motion.div>
              ) : (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    layout
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 ${
                      !notification.read ? "border-l-4 border-teal-500" : ""
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="flex">
                      <div className={`p-3 rounded-full ${getIconBackground(notification.type, notification.read)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{notification.message}</p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {notification.time}
                          </span>
                        </div>

                        {/* Swap, Like or Donation Details */}
                        {(notification.type.includes("swap") ||
                          notification.type === "like" ||
                          notification.type === "donation") &&
                          notification.item && (
                            <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                              <div className="flex items-center">
                                {notification.user && (
                                  <div className="flex items-center mr-4">
                                    <div className="h-10 w-10 relative rounded-full overflow-hidden mr-2 border-2 border-white dark:border-gray-600 shadow-sm">
                                      <Image
                                        src={notification.user.image || "/placeholder.svg"}
                                        alt={notification.user.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {notification.user.name}
                                    </span>
                                  </div>
                                )}

                                {notification.charity && (
                                  <div className="flex items-center mr-4">
                                    <div className="h-10 w-10 relative rounded-full overflow-hidden mr-2 border-2 border-white dark:border-gray-600 shadow-sm">
                                      <Image
                                        src={notification.charity.image || "/placeholder.svg"}
                                        alt={notification.charity.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {notification.charity.name}
                                    </span>
                                  </div>
                                )}

                                <div className="h-14 w-14 relative rounded-lg overflow-hidden ml-auto border-2 border-white dark:border-gray-600 shadow-sm">
                                  <Image
                                    src={notification.item.image || "/placeholder.svg"}
                                    alt={notification.item.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                        <div className="mt-4 flex justify-between items-center">
                          <Link
                            href={notification.actionUrl}
                            className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline flex items-center group"
                            onClick={() => markAsRead(notification.id)}
                          >
                            View details
                            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </Link>
                          <div className="flex space-x-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
