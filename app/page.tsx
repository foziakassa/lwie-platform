"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, MapPin, Heart, Share2, Gift } from "lucide-react"
import ApprovedAdvertisement from "./ad/page"
import ThreeDAdvertisement from '../components/3d-advertisement-carousel'
import { fetchItems, fetchServices } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

interface Item {
  id: number
  title: string
  created_at: string
  images?: { url: string; is_main: boolean }[]
  location?: string
  price?: number
  condition?: string
  category_name?: string
}

interface Service {
  id: number
  title: string
  created_at: string
  images?: { url: string; is_main: boolean }[]
  location?: string
  hourly_rate?: number
  category_name?: string
}

export default function Home() {
  const [visibleSection, setVisibleSection] = useState("featured")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true)
        const [itemsResponse, servicesResponse] = await Promise.all([
          fetchItems({ status: "published", limit: 50 }),
          fetchServices({ status: "published", limit: 50 }),
        ])

        const combinedPosts = [
          ...(itemsResponse.success ? itemsResponse.items : []).map((item: Item) => ({
            ...item,
            type: 'item',
          })),
          ...(servicesResponse.success ? servicesResponse.services : []).map((service: Service) => ({
            ...service,
            type: 'service',
          })),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setPosts(combinedPosts)

        const savedLikedItems = localStorage.getItem("likedItems")
        if (savedLikedItems) {
          setLikedItems(JSON.parse(savedLikedItems))
        }
      } catch (error: any) {
        console.error("Error loading posts:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to load listings",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const generateSlug = (title: string, id: string) => {
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`
  }

  const toggleLike = (itemId: number) => {
    setLikedItems((prev) => {
      const newLikedItems = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      localStorage.setItem("likedItems", JSON.stringify(newLikedItems))
      return newLikedItems
    })
  }

  const navigateToDetail = (post: any) => {
    const slug = generateSlug(post.title, post.id)
    router.push(`/${post.type === 'item' ? 'products' : 'services'}/${slug}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <ThreeDAdvertisement />
        <ApprovedAdvertisement />

        {/* Listings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Listings</h2>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.length === 0 ? (
                <p className="text-gray-500 text-center col-span-full">No listings available.</p>
              ) : (
                posts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    onClick={() => navigateToDetail(post)}
                  >
                    <div className="relative h-48">
                      <img
                        src={post.images?.find((img: any) => img.is_main)?.url || post.images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          title="Like"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleLike(post.id)
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${likedItems.includes(post.id) ? "fill-rose-500 text-rose-500" : "text-gray-600"}`}
                          />
                        </button>
                        <button
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          title="Share"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // Share functionality would go here
                          }}
                        >
                          <Share2 className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-white text-xs px-2 py-0.5 rounded font-medium text-gray-700">
                          {post.type === 'item' ? post.condition : post.category_name || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between">
                        <p className="font-bold text-lg">
                          {post.type === 'item' ? `${post.price?.toLocaleString() || 'Negotiable'} ETB` : `${post.hourly_rate?.toLocaleString() || 'Negotiable'} ETB/hr`}
                        </p>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                          {post.type === 'item' ? post.condition : post.category_name || "N/A"}
                        </span>
                      </div>
                      <h3 className="text-sm mt-1">{post.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{post.location || "N/A"}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>

        {/* Charity Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-900 rounded-2xl overflow-hidden"
          >
            <div className="p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h2 className="text-3xl font-bold mb-4">Donate for a Cause</h2>
                  <p className="text-teal-100 mb-6 max-w-xl">
                    Your unused items can make a big difference. Donate to verified charities and help those in need.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/charity")}
                    className="bg-white text-teal-700 px-6 py-3 rounded-full font-medium hover:bg-teal-50 transition-colors flex items-center"
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    Donate Now
                  </motion.button>
                </div>
                <div className="relative w-full md:w-1/3 h-64 rounded-lg overflow-hidden">
                  <Image src="/charety.jpg" alt="Charity" fill className="object-cover" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Promote Your Items or Seek Aid</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              To promote your items or if you need assistance, feel free to reach out to us!
            </p>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/advertise")}
                className="px-6 py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-colors"
              >
                Click Here
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}