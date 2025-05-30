"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Briefcase, CheckCircle2 } from "lucide-react"

import { PostCounter } from "@/components/post-counter"
import { checkPostsStatus } from "@/lib/actions"
import { toast } from "sonner"

export default function PostSelectionPage() {
  const [selectedType, setSelectedType] = useState<"item" | "service" | null>(null)
  const [postsStatus, setPostsStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchPostsStatus() {
      try {
        const status = await checkPostsStatus()
        setPostsStatus(status)

        // If user has no posts remaining, redirect to plans page
        if (status.remainingFreePosts + status.remainingPaidPosts === 0) {
          toast.error("You have no posts remaining. Please upgrade your plan.")
          router.push("/plans")
        }
      } catch (error) {
        console.error("Error fetching posts status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPostsStatus()
  }, [router])

  const handleUpgradeClick = () => {
    router.push("/plans")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <div className="animate-pulse bg-gray-200 h-10 w-64 rounded-full"></div>
      </div>
    )
  }

  const totalRemaining = postsStatus ? postsStatus.remainingFreePosts + postsStatus.remainingPaidPosts : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 dark:text-white">What would you like to post?</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the type of listing you want to create. You can post items you want to swap or services you can
              offer to others.
            </p>
          </div>

          <PostCounter onUpgradeClick={handleUpgradeClick} />

          {totalRemaining > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 mt-8">
                {/* Item Card */}
                <div
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                    selectedType === "item"
                      ? "border-teal-500 ring-2 ring-teal-200"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  onClick={() => setSelectedType("item")}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-teal-50 p-3 rounded-full">
                        <Package className="h-6 w-6 text-teal-600" />
                      </div>
                      {selectedType === "item" && <CheckCircle2 className="h-6 w-6 text-teal-500" />}
                    </div>
                    <h2 className="text-xl font-bold mb-2 dark:text-white">Post an Item</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      List physical items you own and want to swap with others. Perfect for electronics, clothing,
                      furniture, and more.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-teal-100 rounded-full p-1 mr-2">
                          <CheckCircle2 className="h-3 w-3 text-teal-600" />
                        </span>
                        Upload multiple photos
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-teal-100 rounded-full p-1 mr-2">
                          <CheckCircle2 className="h-3 w-3 text-teal-600" />
                        </span>
                        Specify condition and details
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-teal-100 rounded-full p-1 mr-2">
                          <CheckCircle2 className="h-3 w-3 text-teal-600" />
                        </span>
                        Set trade preferences
                      </li>
                    </ul>
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=500&text=Items+for+swap"
                        alt="Items for swap"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Card */}
                <div
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                    selectedType === "service"
                      ? "border-teal-500 ring-2 ring-teal-200"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  onClick={() => setSelectedType("service")}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-teal-50 p-3 rounded-full">
                        <Briefcase className="h-6 w-6 text-teal-600" />
                      </div>
                      {selectedType === "service" && <CheckCircle2 className="h-6 w-6 text-teal-500" />}
                    </div>
                    <h2 className="text-xl font-bold mb-2 dark:text-white">Post a Service</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Offer your skills and services to others. Great for professional services, creative work,
                      tutoring, and more.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-teal-100 rounded-full p-1 mr-2">
                          <CheckCircle2 className="h-3 w-3 text-teal-600" />
                        </span>
                        Describe your expertise
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-teal-100 rounded-full p-1 mr-2">
                          <CheckCircle2 className="h-3 w-3 text-teal-600" />
                        </span>
                        Set availability and duration
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-teal-100 rounded-full p-1 mr-2">
                          <CheckCircle2 className="h-3 w-3 text-teal-600" />
                        </span>
                        Showcase previous work
                      </li>
                    </ul>
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=500&text=Services+to+offer"
                        alt="Services to offer"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                {selectedType === "item" ? (
                  <Link href="/post/item/create">
                    <Button className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-lg flex items-center gap-2">
                      Continue to Item Form
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                ) : selectedType === "service" ? (
                  <Link href="/post/service/create">
                    <Button className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-lg flex items-center gap-2">
                      Continue to Service Form
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="bg-gray-300 text-gray-600 px-8 py-6 text-lg cursor-not-allowed">
                    Select a post type to continue
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">You have no posts remaining.</p>
              <Button onClick={handleUpgradeClick} className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
                Upgrade Your Plan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
