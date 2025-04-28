"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface SuccessScreenProps {
  postType: "item" | "service"
  newPost?: any // Flexible type to match suggested implementation
}

export default function SuccessScreen({ postType, newPost }: SuccessScreenProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  // Handle countdown timer and localStorage
  useEffect(() => {
    // Store newPost in localStorage if provided
    if (newPost) {
      try {
        const pendingPosts = JSON.parse(localStorage.getItem("pendingPosts") || "[]")
        pendingPosts.push(newPost)
        localStorage.setItem("pendingPosts", JSON.stringify(pendingPosts))
      } catch (error) {
        console.error("Failed to store pending post in localStorage:", error)
      }
    }

    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    // Cleanup timer on unmount
    return () => clearInterval(timer)
  }, [newPost])

  // Handle navigation when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      router.push("/")
    }
  }, [countdown, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Post Submitted Successfully!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Your {postType} has been successfully posted and is now visible to other users.
        </p>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Redirecting to home in <span className="font-medium">{countdown}</span> second{countdown !== 1 ? "s" : ""}...
        </p>
      </div>
    </div>
  )
}