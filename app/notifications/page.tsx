"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, ChevronRight } from "lucide-react"
import Cookies from "js-cookie"

interface Notification {
  id: string // Notification ID
  message: string
  created_at: string
  type: string
  user: {
    name: string
    image: string
  }
  item: {
    title: string
    image: string
  }
  product_link: string
  read: boolean
  status: string
  requested_id: string
  item_id: string // The ID of the item associated with the notification
  offered_item_id: string // The ID of the offered item
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [itemid, setItemId] = useState("")
  const [userid, setUserId] = useState("")


  // Helper to get hidden notification IDs from cookie
  const getHiddenIds = () => {
    const hidden = Cookies.get("hiddennotif")
 
    return hidden ? (JSON.parse(hidden) as string[]) : []
  }

  // Helper to add a notification ID to the hidden list in cookie
  const addHiddenId = (id: string) => {
    const hiddenIds = getHiddenIds()
    if (!hiddenIds.includes(id)) {
      hiddenIds.push(id)
      Cookies.set("hiddennotif", JSON.stringify(hiddenIds), { expires: 30 }) // expires in 30 days
    }
  }

 const fetchNotifications = async () => {
  try {
    const authToken = Cookies.get("authToken"); // Retrieve the authToken from cookies

    if (!authToken) {
      console.log("Auth token not found in cookies");
      return;
    }

    // Parse the authToken to extract user information
    const userData = JSON.parse(authToken);
    const userId = userData.id; // Extract the user ID

    const response = await fetch(`https://liwedoc.vercel.app/api/notifications/${userId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Filter out hidden notifications
      const hiddenIds = getHiddenIds();
      const visibleNotifications = data.notifications.filter((notif: Notification) => !hiddenIds.includes(notif.id));
      const reqitemid = data.notifications.map((notif: Notification) => notif.requested_id);
      console.log("item id " + reqitemid);
      setItemId(reqitemid);
      setNotifications(visibleNotifications);
    } else {
      console.log("Failed to fetch notifications");
    }
  } catch (error) {
    console.log("Error fetching notifications:", error);
  }
  setLoading(false);
};
  useEffect(() => {
    fetchNotifications()
    // eslint-disable-next-line
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const fetchItemStatus = async (itemId: string, itemType: string) => {
    try {
      const endpoint = itemType === "item" ? "items" : "services"
      const response = await fetch(`https://liwedoc.vercel.app/api/${endpoint}/${itemId}`)
      if (response.ok) {
        const data = await response.json()
        return data.item?.status || data.service?.status // Get the item/service status from the response
      } else {
        console.log("Failed to fetch item status")
        return null
      }
    } catch (error) {
      console.log("Error fetching item status:", error)
      return null
    }
  }

  const handleAccept = async (notificationId: string) => {
    const notification = notifications.find((notif) => notif.id === notificationId)
    if (!notification) return

    try {
      // First, check if the items are already swapped
      const requestedItemStatus = await fetchItemStatus(notification.requested_id, "item") // Assuming it's an item, adjust as needed

      if (requestedItemStatus === "swapped") {
        setSuccessMessage("This item has already been swapped and is no longer available.")
        setTimeout(() => setSuccessMessage(null), 5000)
        return // Do not proceed if the item is already swapped
      }

      const response = await fetch(`https://liwedoc.vercel.app/api/swap-requests/accept/${notificationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        markAsRead(notificationId)
        setSuccessMessage(result.message || "Swap request accepted successfully!")

        // Remove the accepted notification from the list
        deleteNotification(notificationId)

        // Refresh notifications to get updated data
        await fetchNotifications()

        setTimeout(() => setSuccessMessage(null), 5000)
      } else {
        const errorData = await response.json()
        setSuccessMessage(errorData.message || "Failed to accept swap request.")
        setTimeout(() => setSuccessMessage(null), 5000)
      }
    } catch (error) {
      console.log("Error accepting notification:", error)
      setSuccessMessage("An error occurred while accepting the swap request.")
      setTimeout(() => setSuccessMessage(null), 5000)
    }
  }

  const handleReject = async (notificationId: string) => {
    try {
      const response = await fetch(`https://liwedoc.vercel.app/api/notifications/reject/${notificationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Store the rejected notification ID in cookie
        addHiddenId(notificationId)
        deleteNotification(notificationId)
      } else {
        console.log("Failed to reject notification")
      }
    } catch (error) {
      console.log("Error rejecting notification:", error)
    }
  }

  // Filter out hidden notifications before rendering (in case cookie changes)
  const hiddenIds = getHiddenIds()
  const visibleNotifications = notifications.filter((notif) => !hiddenIds.includes(notif.id))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h1>
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-300">
            {successMessage}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <AnimatePresence>
            {visibleNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center"
              >
                <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-gray-900 dark:text-white text-xl font-medium mb-2">No notifications</h3>
                <p className="text-gray-600 dark:text-gray-300">You don't have any notifications right now.</p>
              </motion.div>
            ) : (
              visibleNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-4 ${
                    !notification.read ? "border-l-4 border-teal-500" : ""
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex">
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                            {notification.message}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{notification.type}</span>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        {notification.product_link ? (
                          <Link
                            href={notification.product_link}
                            className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline flex items-center"
                            onClick={() => markAsRead(notification.id)}
                          >
                            View details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">No link available</span>
                        )}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAccept(notification.id)}
                            className="px-3 py-1.5 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
                            title="Accept"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(notification.id)}
                            className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
                            title="Ignore"
                          >
                            Ignore
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
