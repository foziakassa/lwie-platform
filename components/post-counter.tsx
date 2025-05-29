"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { checkPostsStatus } from "@/lib/actions"

interface PostsStatus {
  remainingFreePosts: number
  remainingPaidPosts: number
  totalPaidPosts: number
  usedPaidPosts: number
  totalFreePosts: number
}

export function PostCounter({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  const [postsStatus, setPostsStatus] = useState<PostsStatus>({
    remainingFreePosts: 3,
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
        // Keep default values for new users
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
  const hasFreePosts = postsStatus.remainingFreePosts > 0
  const hasPaidPosts = postsStatus.remainingPaidPosts > 0

  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full ${
          totalRemaining > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {totalRemaining > 0 ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>
              You have {totalRemaining} post{totalRemaining !== 1 ? "s" : ""} remaining
              {hasFreePosts &&
                hasPaidPosts &&
                ` (${postsStatus.remainingFreePosts} free, ${postsStatus.remainingPaidPosts} paid)`}
              {hasFreePosts && !hasPaidPosts && ` (${postsStatus.remainingFreePosts} free)`}
              {!hasFreePosts && hasPaidPosts && ` (${postsStatus.remainingPaidPosts} paid)`}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>You've used all your posts - Upgrade to continue posting</span>
          </>
        )}
      </div>

      {totalRemaining === 0 && (
        <button
          className="mt-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition-colors"
          onClick={onUpgradeClick}
        >
          Upgrade Plan
        </button>
      )}
    </div>
  )
}
