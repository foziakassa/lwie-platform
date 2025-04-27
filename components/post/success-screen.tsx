"use client"

import { useEffect } from "react"
import { CheckCircle } from "lucide-react"

interface SuccessScreenProps {
  postType: "item" | "service"
  onDone: () => void
}

export default function SuccessScreen({ postType, onDone }: SuccessScreenProps) {
  // Force a refresh of the post counter when the success screen is shown
  useEffect(() => {
    // This will trigger a re-render of all client components, including the PostCounter
    window.location.hash = Date.now().toString()
  }, [])

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">Post Submitted Successfully!</h2>
      <p className="mt-2 text-gray-600">
        Your {postType} has been successfully posted and is now visible to other users.
      </p>
      <div className="mt-6">
        <button
          onClick={onDone}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Done
        </button>
      </div>
    </div>
  )
}
