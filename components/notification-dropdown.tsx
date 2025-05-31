"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"
import Cookies from "js-cookie"

interface Notification {
  id: string
  message: string
  created_at: string
}

interface NotificationDropdownProps {
  isLoggedIn: boolean
  userInfo: any
}

export function NotificationDropdown({ isLoggedIn, userInfo }: NotificationDropdownProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notificationRef = useRef<HTMLDivElement>(null)

  // Helper to get hidden notification IDs from cookie
  const getHiddenIds = () => {
    const hidden = Cookies.get("hiddennotif")
    return hidden ? (JSON.parse(hidden) as string[]) : []
  }

  // Helper to add a notification ID to hiddennotif cookie
  const addHiddenId = (id: string) => {
    const hiddenIds = getHiddenIds()
    if (!hiddenIds.includes(id)) {
      hiddenIds.push(id)
      Cookies.set("hiddennotif", JSON.stringify(hiddenIds), { expires: 30 })
    }
  }

  // Fetch notifications when logged in and filter hidden
  useEffect(() => {
    if (isLoggedIn && userInfo) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`https://liwedoc.vercel.app/api/notifications/${userInfo.id}`)
          if (response.ok) {
            const data = await response.json()
            const hiddenIds = getHiddenIds()
            const visibleNotifications = data.notifications.filter(
              (notif: Notification) => !hiddenIds.includes(notif.id)
            )
            setNotifications(visibleNotifications)
          } else {
            console.error("Failed to fetch notifications")
          }
        } catch (error) {
          console.error("Error fetching notifications", error)
        }
      }
      fetchNotifications()
    }
  }, [isLoggedIn, userInfo])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!isLoggedIn) {
    return null
  }

  // Reject notification handler
  const handleReject = (id: string) => {
    // Optionally call your API to reject notification here

    addHiddenId(id)
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  return (
    <div className="relative" ref={notificationRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="text-white hover:bg-teal-600 p-2 rounded-full relative"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-10"
          >
            <div className="flex justify-between items-center px-4 py-2 bg-teal-50 dark:bg-teal-900">
              <h3 className="font-medium text-teal-900 dark:text-white">Notifications</h3>
              <Link
                href="/notifications"
                className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                onClick={() => setShowNotifications(false)}
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex justify-between items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleReject(notification.id)}
                      className="ml-2 text-red-600 hover:text-red-800 dark:hover:text-red-400 text-sm font-semibold"
                      aria-label="Reject notification"
                      title="Ignore"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No notifications</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
