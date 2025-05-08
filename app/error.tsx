"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We apologize for the inconvenience. Please try again or return to the home page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={reset} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
          Try again
        </button>
        <Link href="/" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
