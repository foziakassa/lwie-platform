"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";

interface Notification {
  id: string; // Notification ID
  message: string;
  created_at: string;
  type: string;
  user: {
    name: string;
    image: string;
  };
  item: {
    title: string;
    image: string;
  };
  actionUrl: string;
  read: boolean;
  item_id: string; // The ID of the item associated with the notification
  offered_item_id: string; // The ID of the offered item
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchNotifications = async () => {
    const tokenString = Cookies.get("authToken");
    const userId = tokenString ? JSON.parse(tokenString).id : null;

    if (!userId) {
      setLoading(false);
      return; // User not authenticated
    }

    try {
      const response = await fetch(`https://liwedoc.vercel.app/api/notifications/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const fetchItemStatus = async (itemId: string) => {
    try {
      const response = await fetch(`https://liwedoc.vercel.app/api/items/${itemId}`);
      if (response.ok) {
        const data = await response.json();
        return data.item.status; // Get the item status from the response
      } else {
        console.error("Failed to fetch item status");
        return null;
      }
    } catch (error) {
      console.error("Error fetching item status:", error);
      return null;
    }
  };

  const handleAccept = async (notificationId: string) => {
    const notification = notifications.find((notif) => notif.id === notificationId);
    if (!notification) return;

    const itemStatus = await fetchItemStatus(notification.item_id); // Fetch item status
    if (itemStatus === "swapped") {
      setSuccessMessage("This item has already been swapped.");
      setTimeout(() => setSuccessMessage(null), 5000);
      return; // Do not proceed if the item is already swapped
    }

    try {
      const response = await fetch(`https://liwedoc.vercel.app/api/swap-requests/accept/${notificationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });

      if (response.ok) {
        markAsRead(notificationId);
        setSuccessMessage("Swap request accepted successfully!");
        await fetchNotifications(); // Refresh notifications to update status
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setSuccessMessage("Failed to accept swap request.");
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (error) {
      console.error("Error accepting notification:", error);
      setSuccessMessage("An error occurred while accepting the swap request.");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleReject = async (notificationId: string) => {
    try {
      const response = await fetch(`https://liwedoc.vercel.app/api/notifications/reject/${notificationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });

      if (response.ok) {
        deleteNotification(notificationId);
      } else {
        console.error("Failed to reject notification");
      }
    } catch (error) {
      console.error("Error rejecting notification:", error);
    }
  };

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
            {notifications.length === 0 ? (
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
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 ${
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
                        {notification.actionUrl ? (
                          <Link
                            href={notification.actionUrl}
                            className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline"
                            onClick={() => markAsRead(notification.id)}
                          >
                            View details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">No link available</span>
                        )}
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleAccept(notification.id)}
                            className="p-1.5 text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                            title="Accept"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(notification.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
  );
}