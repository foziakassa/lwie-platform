"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, MapPin, ArrowRight, Heart, Share2, Gift } from "lucide-react"

// Mock data for featured items
const featuredItems = [
  {
    id: 1,
    title: "Comfortable Leather Sofa",
    price: "20,500 ETB",
    location: "Addis Ababa",
    condition: "Used",
    image: "/sofa1.jpg",
    likes: 23,
  },
  {
    id: 2,
    title: "V40 Toyota",
    price: "2,300,000 ETB",
    location: "Addis Ababa",
    condition: "Used",
    image: "/v40 toyota.jpg",
    likes: 45,
  },
  {
    id: 3,
    title: "iPhone 13 Pro",
    price: "55,000 ETB",
    location: "Dire Dawa",
    condition: "Like New",
    image: "/iphone 13.jpg",
    likes: 18,
  },
  {
    id: 4,
    title: "Mountain Bike",
    price: "14,000 ETB",
    location: "Hawassa",
    condition: "Used",
    image: "/bike.jpg",
    likes: 12,
  },
]




// Mock data for latest posts
const latestPosts = [
  {
    id: 9,
    title: "MacBook Air M1",
    price: "75,000 ETB",
    location: "Addis Ababa",
    condition: "Like New",
    image: "/mac.jpg",
    postedTime: "5 minutes ago",
  },
  {
    id: 10,
    title: "Vintage Record Player",
    price: "7,800 ETB",
    location: "Mekelle",
    condition: "Good",
    image: "/vintage record player.jpg",
    postedTime: "2 hours ago",
  },
  {
    id: 11,
    title: "Fitness Equipment Set",
    price: "13,500 ETB",
    location: "Addis Ababa",
    condition: "Used",
    image: "/Ab Roller Wheel Set.jpg",
    postedTime: "4 hours ago",
  },
  {
    id: 12,
    title: "Coffee Table",
    price: "5,000 ETB",
    location: "Hawassa",
    condition: "Used",
    image: "/coffee table.jpg",
    postedTime: "6 hours ago",
  },
]

export default function Home() {
  const [visibleSection, setVisibleSection] = useState("featured")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedItems, setLikedItems] = useState<number[]>([])
  const router = useRouter()

  // Simulating data loading
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Load liked items from localStorage
    const savedLikedItems = localStorage.getItem("likedItems")
    if (savedLikedItems) {
      setLikedItems(JSON.parse(savedLikedItems))
    }

    return () => clearTimeout(timer)
  }, [])

  const toggleLike = (itemId: number) => {
    setLikedItems((prev) => {
      const newLikedItems = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]

      // Save to localStorage
      localStorage.setItem("likedItems", JSON.stringify(newLikedItems))
      return newLikedItems
    })
  }

  const navigateToItemDetail = (itemId: number) => {
    // Navigate to the product detail page for the leather sofa (id: 1)
    if (itemId === 1) {
      router.push(`/products/comfortable-leather-sofa`)
    } else {
      router.push(`/item/${itemId}`)
    }
  }

  const categories = ["All", "Electronics", "Furniture", "Vehicles", "Fashion", "Books", "Sports"]

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        {/* <section className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to LWIE</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join our community of swappers and trade items you no longer need for things you want. It's sustainable,
              economical, and fun!
            </p>
          </motion.div>
        </section> */}

        {/* Section Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {["featured", "latest"].map((section) => (
              <button
                key={section}
                onClick={() => setVisibleSection(section)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  visibleSection === section
                    ? "bg-teal-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Items */}
        <AnimatePresence mode="wait">
          {visibleSection === "featured" && (
            <motion.section
              key="featured"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Listings</h2>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {featuredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group cursor-pointer"
                      onClick={() => navigateToItemDetail(item.id)}
                    >
                      <div className="relative h-48">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLike(item.id)
                            }}
                            className={`p-2 rounded-full ${
                              likedItems.includes(item.id)
                                ? "bg-rose-500 text-white"
                                : "bg-white/80 text-gray-700 hover:bg-white"
                            }`}
                          >
                            <Heart className="h-4 w-4" fill={likedItems.includes(item.id) ? "currentColor" : "none"} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              // Share functionality would go here
                            }}
                            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white"
                          >
                            <Share2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-xl text-gray-900 dark:text-white">{item.price}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.title}</p>
                          </div>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {item.condition}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.location}</p>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                            View
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.section>
          )}

          
          {/* Latest Posts */}
          {visibleSection === "latest" && (
            <motion.section
              key="latest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Posts</h2>
                <Link href="/latest" className="text-teal-600 dark:text-teal-400 hover:underline flex items-center">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {latestPosts.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group cursor-pointer"
                      onClick={() => navigateToItemDetail(item.id)}
                    >
                      <div className="relative h-48">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <span className="text-xs text-white">{item.postedTime}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-xl text-gray-900 dark:text-white">{item.price}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.title}</p>
                          </div>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {item.condition}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.location}</p>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                            View
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

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
                onClick={() => router.push("/advertise")} // Change the route as needed
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

