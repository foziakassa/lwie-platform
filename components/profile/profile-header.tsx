"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/api-client"
import type { User } from "@/lib/types"

export function ProfileHeader() {
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        const user = await getCurrentUser()
        setUserData(user)
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-teal-600 dark:bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
          {userData?.name?.charAt(0) || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{userData?.name || "User"}</h1>
          <p className="text-gray-500 dark:text-gray-400">{userData?.email || "user@example.com"}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href="/profile/settings"
          className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Settings
        </Link>
        <Link
          href="/post"
          className="bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 dark:hover:bg-teal-600"
        >
          New Post
        </Link>
      </div>
    </div>
  )
}
