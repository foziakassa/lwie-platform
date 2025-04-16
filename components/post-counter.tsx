// components/PostCounter.tsx
"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { checkPostsStatus } from "@/lib/actions"

export function PostCounter({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  const [postsStatus, setPostsStatus] = useState({
    remainingFreePosts: 0,
    remainingPaidPosts: 0,
    totalPaidPosts: 0,
    usedPaidPosts: 0,
    totalFreePosts: 3,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPostsStatus = async () => {
      try {
        const status = await checkPostsStatus()
        setPostsStatus(status)
      } catch (error) {
        console.error("Error fetching posts status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPostsStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <div className="animate-pulse bg-gray-200 h-10 w-64 rounded-full"></div>
      </div>
    )
  }

  const totalRemaining = postsStatus.remainingFreePosts + postsStatus.remainingPaidPosts

  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full ${
          totalRemaining > 0 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
        }`}
      >
        {totalRemaining > 0 ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>You have {totalRemaining} post{totalRemaining !== 1 ? "s" : ""} remaining</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>You’ve used all your free posts</span>
          </>
        )}
      </div>

      {postsStatus.remainingFreePosts === 0 && (
        <button
          className="mt-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full"
          onClick={onUpgradeClick}
        >
          Upgrade Plan
        </button>
      )}
    </div>
  )
}
