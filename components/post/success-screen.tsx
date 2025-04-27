"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface SuccessScreenProps {
  postType: "item" | "service"
  onDone: () => void
  countdown: number | null
}

export default function SuccessScreen({ postType, onDone, countdown }: SuccessScreenProps) {
  const router = useRouter()

  useEffect(() => {
    if (countdown === null) return

    if (countdown <= 0) {
      router.push('/')
      return
    }

    const timer = setInterval(() => {
      // Countdown is managed by the parent component
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, router])

  return (
    <div className="text-center p-8">
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {postType === "item" ? "Item" : "Service"} Posted Successfully!
      </h2>
      {countdown !== null && (
        <p className="text-gray-600">
          Redirecting to home page in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
      )}
      <div className="mt-6 space-x-4">
        <button
          onClick={onDone}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Done
        </button>
        <Link href="/" className="text-teal-600 hover:text-teal-700">
          Go Home Now
        </Link>
      </div>
    </div>
  )
}