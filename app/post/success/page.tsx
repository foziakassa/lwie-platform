"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle, ArrowRight, Home, Eye } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [postType, setPostType] = useState<"item" | "service" | null>(null)
  const [postId, setPostId] = useState<string | null>(null)

  useEffect(() => {
    // Check if there's a post ID in local storage or URL params
    const searchParams = new URLSearchParams(window.location.search)
    const typeParam = searchParams.get("type") as "item" | "service" | null
    const idParam = searchParams.get("id")

    if (typeParam && idParam) {
      setPostType(typeParam)
      setPostId(idParam)
    } else {
      // Default to item if not specified
      setPostType("item")
      // Generate a random ID for demo purposes
      setPostId(Math.random().toString(36).substring(2, 15))
    }

    // Start countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Post Submitted Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Your {postType} has been posted and is now visible to everyone. Thank you for using our platform!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link href="/">
                <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  Go to Home
                </Button>
              </Link>

              <Link href={`/${postType}s/${postId}`}>
                <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Your Post
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-500">
              Redirecting to home page in {countdown} seconds...
              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-1000"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Wait for Responses</h3>
                  <p className="text-gray-600">
                    Interested users will contact you about your {postType}. You'll receive notifications when someone
                    messages you.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Negotiate and Agree</h3>
                  <p className="text-gray-600">
                    Discuss details with interested parties and agree on terms for the exchange or service.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Complete the Transaction</h3>
                  <p className="text-gray-600">
                    Meet in a safe location to complete the exchange or provide the service as agreed.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-teal-100 text-teal-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                  4
                </div>
                <div>
                  <h3 className="font-medium">Mark as Completed</h3>
                  <p className="text-gray-600">
                    Once the transaction is complete, mark your post as completed in your dashboard.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-6 text-center">
              <Link href="/post/selection">
                <Button variant="outline" className="flex items-center gap-2">
                  Post Another {postType === "item" ? "Item" : "Service"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
