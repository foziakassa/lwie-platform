"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Eye } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  const postId = searchParams.get("id")
  const postType = searchParams.get("type") || "item"
  const postTitle = searchParams.get("title") || "Your item"

  useEffect(() => {
    if (!postId) {
      router.push("/")
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [postId, router])

  const viewPostUrl = postType === "item" ? `/products/${postId}` : `/services/${postId}`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-teal-100 rounded-full p-3">
            <CheckCircle className="h-12 w-12 text-teal-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Successfully Posted!</h1>
        <p className="text-gray-600 mb-6">
          Your {postType} "{postTitle}" has been successfully posted and is now visible to others.
        </p>

        <div className="relative h-48 rounded-lg overflow-hidden mb-6">
          <Image
            src="/placeholder.svg?height=300&width=500&text=Post+Success"
            alt="Post success"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-3">
          <Link href={viewPostUrl}>
            <Button className="w-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              View Your Post
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">You will be redirected to the home page in {countdown} seconds...</p>
      </div>
    </div>
  )
}
