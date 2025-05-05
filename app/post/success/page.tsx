"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Home, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPublishedPosts } from "@/lib/post-storage"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's a postId in the URL
    const postId = searchParams.get("postId")

    if (postId) {
      // Get the post from localStorage
      const posts = getPublishedPosts()
      const foundPost = posts.find((p: any) => p.id === postId)

      if (foundPost) {
        setPost(foundPost)
      }
    }

    setLoading(false)
  }, [searchParams])

  // Generate a slug from the title
  const generateSlug = (title: string, id: string) => {
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg border p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 bg-green-100 rounded-full p-3 w-20 h-20 flex items-center justify-center"
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-2">Post Submitted Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Your {post?.type || "post"} has been published and is now visible to everyone.
        </p>

        <div className="space-y-4">
          {post && (
            <Link href={`/${post.type}s/${generateSlug(post.title, post.id)}`} className="block w-full">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Eye className="mr-2 h-4 w-4" />
                View Your Post
              </Button>
            </Link>
          )}

          <Link href="/" className="block w-full">
            <Button className="w-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </Link>

          <Link href="/post/selection" className="block w-full">
            <Button variant="ghost" className="w-full flex items-center justify-center">
              Create Another Post
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
