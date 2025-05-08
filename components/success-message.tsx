import Link from "next/link"
import { CheckCircle } from "lucide-react"

export function SuccessMessage() {
  return (
    <div className="container max-w-md mx-auto py-16 px-4 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Successfully Published!</h1>

      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Your listing has been published successfully and is now visible to others.
      </p>

      <div className="space-y-4">
        <Link
          href="/"
          className="block w-full bg-teal-600 dark:bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 dark:hover:bg-teal-600"
        >
          Go to Home
        </Link>

        <Link
          href="/post"
          className="block w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Create Another Listing
        </Link>
      </div>
    </div>
  )
}
