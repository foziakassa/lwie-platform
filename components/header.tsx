"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { HelpCircle, Sun, Moon, User, LogOut, Settings, ChevronRight, Play, X, Film } from "lucide-react"
import { NotificationDropdown } from "./notification-dropdown"
import Cookies from "js-cookie"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface SearchResult {
  id: string
  title: string
  image: string
  price: string
}

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  src: string
  duration: string
}

export function Header() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showVideoDropdown, setShowVideoDropdown] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [postCount, setPostCount] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [videoSrc, setVideoSrc] = useState<string>("/placeholder-video.mp4") // Default video source
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>("")
  const searchRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Mock video list
  const videoList: VideoItem[] = [
    {
      id: "1",
      title: "How to Post",
      thumbnail: "/placeholder.svg?height=120&width=200",
      src: "/Video/post.mp4",
      duration: "2:15",
    },
    {
      id: "2",
      title: "How to send swap request",
      thumbnail: "/placeholder.svg?height=120&width=200",
      src: "/Video/swap.mp4",
      duration: "3:42",
    },
    
   
  ]

  const mockSearchResults = [
    { id: "1", title: "iPhone 13 Pro", image: "/placeholder.svg", price: "35,000 ETB" },
    { id: "2", title: "Modern Sofa", image: "/placeholder.svg", price: "12,500 ETB" },
    { id: "3", title: "Mountain Bike", image: "/placeholder.svg", price: "8,000 ETB" },
  ]

  // Function to open video modal with specific video
  const openModal = (video: VideoItem) => {
    setVideoSrc(video.src)
    setSelectedVideoTitle(video.title)
    setShowModal(true)
    setShowVideoDropdown(false)
  }

  // Function to close video modal
  const closeModal = () => {
    setShowModal(false)
  }

  // Function to refresh post count - can be called from other components
  const refreshPostCount = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch("/api/user/posts-status", {
          headers: {
            "x-user-email": Cookies.get("customerEmail") || "",
          },
        })

        if (response.ok) {
          const postsStatus = await response.json()
          const totalRemaining = (postsStatus.remainingFreePosts || 0) + (postsStatus.remainingPaidPosts || 0)
          setPostCount(totalRemaining)
        } else {
          // Fallback to cookie-based calculation
          const usedFreePostsStr = Cookies.get("used_free_posts") || "0"
          const usedFreePosts = Number.parseInt(usedFreePostsStr, 10)
          const totalFreePosts = 3
          const remainingFreePosts = Math.max(0, totalFreePosts - usedFreePosts)

          const totalPaidPostsStr = Cookies.get("total_paid_posts") || "0"
          const usedPaidPostsStr = Cookies.get("used_paid_posts") || "0"
          const totalPaidPosts = Number.parseInt(totalPaidPostsStr, 10)
          const usedPaidPosts = Number.parseInt(usedPaidPostsStr, 10)
          const remainingPaidPosts = Math.max(0, totalPaidPosts - usedPaidPosts)

          const totalRemaining = remainingFreePosts + remainingPaidPosts
          setPostCount(totalRemaining)
        }
      } catch (error) {
        console.error("Error fetching post count:", error)
        setPostCount(3)
      }
    } else {
      setPostCount(null)
    }
  }

  // Safely get and parse user info from cookies
  useEffect(() => {
    const tokenString = Cookies.get("authToken")

    if (tokenString) {
      try {
        const parsedToken = JSON.parse(tokenString)
        setIsLoggedIn(true)
        setUserInfo(parsedToken)
      } catch (error) {
        setUserInfo({ token: tokenString })
        setIsLoggedIn(true)
      }
    } else {
      setUserInfo(null)
      setIsLoggedIn(false)
    }
  }, [])

  // Fetch post count when component mounts or user logs in
  useEffect(() => {
    refreshPostCount()
  }, [isLoggedIn])

  // Listen for post submission events to update count
  useEffect(() => {
    const handlePostSubmitted = () => {
      // Refresh the post count when a post is successfully submitted
      refreshPostCount()
    }

    // Listen for custom event from post submission
    window.addEventListener("postSubmitted", handlePostSubmitted)

    return () => {
      window.removeEventListener("postSubmitted", handlePostSubmitted)
    }
  }, [isLoggedIn])

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
      if (videoRef.current && !videoRef.current.contains(event.target as Node)) {
        setShowVideoDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Live search implementation
  useEffect(() => {
    if (searchQuery.length > 2) {
      const filteredResults = mockSearchResults.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filteredResults)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }, [searchQuery])

  // Theme effect
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

  const handleLogin = () => {
    if (isLoggedIn) {
      setShowProfileDropdown(!showProfileDropdown)
    } else {
      router.push("/login")
    }
  }

  const handleLogout = () => {
    Cookies.remove("authToken")
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    setUserInfo(null)
    setShowProfileDropdown(false)
    setPostCount(null)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      duration: 3000,
    })
    router.push("/")
  }

  const navigateToHelp = () => {
    router.push("/help")
  }

  const navigateToPost = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch("/api/user/posts-status", {
          headers: {
            "x-user-email": Cookies.get("customerEmail") || "",
          },
        })

        if (response.ok) {
          const postsStatus = await response.json()
          const totalRemaining = (postsStatus.remainingFreePosts || 0) + (postsStatus.remainingPaidPosts || 0)

          setPostCount(totalRemaining)

          if (totalRemaining > 0) {
            router.push("/post")
          } else {
            toast({
              title: "No posts remaining",
              description: "Please upgrade your plan to create more posts",
              variant: "destructive",
            })
            router.push("/plans")
          }
        } else {
          const usedFreePostsStr = Cookies.get("used_free_posts") || "0"
          const usedFreePosts = Number.parseInt(usedFreePostsStr, 10)
          const totalFreePosts = 3
          const remainingFreePosts = Math.max(0, totalFreePosts - usedFreePosts)

          const totalPaidPostsStr = Cookies.get("total_paid_posts") || "0"
          const usedPaidPostsStr = Cookies.get("used_paid_posts") || "0"
          const totalPaidPosts = Number.parseInt(totalPaidPostsStr, 10)
          const usedPaidPosts = Number.parseInt(usedPaidPostsStr, 10)
          const remainingPaidPosts = Math.max(0, totalPaidPosts - usedPaidPosts)

          const totalRemaining = remainingFreePosts + remainingPaidPosts

          setPostCount(totalRemaining)

          if (totalRemaining > 0) {
            router.push("/post")
          } else {
            toast({
              title: "No posts remaining",
              description: "Please upgrade your plan to create more posts",
              variant: "destructive",
            })
            router.push("/plans")
          }
        }
      } catch (error) {
        console.error("Error checking posts status:", error)
        router.push("/post")
      }
    } else {
      toast({
        title: "Login required",
        description: "Please log in to post an item",
        variant: "destructive",
      })
      router.push("/login")
    }
  }

  return (
    <>
      <header className="bg-teal-700 dark:bg-teal-900 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18">
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <Image
                  src="/images/loogo.png"
                  alt="LWIE Logo"
                  width={68}
                  height={10}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={navigateToHelp}
                className="text-white hover:bg-teal-600 p-2 rounded-full"
                aria-label="Help"
              >
                <HelpCircle className="h-6 w-6" />
              </motion.button>

              <NotificationDropdown isLoggedIn={isLoggedIn} userInfo={userInfo} />

              {/* Video Icon Button with Dropdown */}
              <div className="relative" ref={videoRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setShowVideoDropdown(true)}
                  onClick={() => setShowVideoDropdown(!showVideoDropdown)}
                  className="text-white hover:bg-teal-600 p-2 rounded-full"
                  aria-label="Watch Videos"
                >
                  <Film className="h-6 w-6" />
                </motion.button>

                <AnimatePresence>
                  {showVideoDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden"
                    >
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                          <Film className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                          Available Tutirial Videos
                        </h3>
                        <div className="space-y-3">
                          {videoList.map((video) => (
                            <div
                              key={video.id}
                              className="flex flex-col hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-md p-2 cursor-pointer transition-colors"
                              onClick={() => openModal(video)}
                            >
                              <div className="relative h-24 w-full mb-2 rounded-md overflow-hidden">
                                <Image
                                  src={video.thumbnail || "/placeholder.svg"}
                                  alt={video.title}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                                  <Play className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                  {video.duration}
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{video.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isLoggedIn && (
                <div className="relative" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogin}
                    className="bg-white text-teal-700 px-4 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors"
                  >
                    Login
                  </motion.button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={navigateToPost}
                className="bg-teal-600 text-white px-4 py-1 rounded-md font-medium hover:bg-teal-500 transition-colors flex items-center gap-2"
                aria-label="Post new item"
              >
                <span>Post</span>
                {isLoggedIn && postCount !== null && (
                  <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {postCount}
                  </span>
                )}
              </motion.button>

              {mounted && (
                <motion.button
                  whileHover={{ rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-white hover:bg-teal-600 p-2 rounded-full"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </motion.button>
              )}

              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="text-white hover:bg-teal-600 p-1 rounded-full overflow-hidden"
                    aria-label="Profile menu"
                  >
                    <div className="h-8 w-8 relative">
                      <Image
                        src={userInfo?.avatar || "/placeholder.svg"}
                        alt="Profile"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 overflow-hidden"
                      >
                        <div className="p-4 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-700 dark:to-teal-800">
                          <div className="flex items-center">
                            <div className="h-16 w-16 relative mr-3 flex-shrink-0 border-2 border-white rounded-full overflow-hidden shadow-md">
                              <Image
                                src={userInfo?.avatar || "/placeholder.svg"}
                                alt="Profile"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-white text-lg">{userInfo?.firstName || "User"}</p>
                              <p className="text-teal-100 text-sm">{userInfo?.email || "user@example.com"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-3 text-gray-800 dark:text-white hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <User className="h-5 w-5 mr-3 text-teal-600 dark:text-teal-400" />
                            <span>My Profile</span>
                            <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-3 text-gray-800 dark:text-white hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <Settings className="h-5 w-5 mr-3 text-teal-600 dark:text-teal-400" />
                            <span>Settings</span>
                            <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                          </Link>

                          <Separator className="my-1" />

                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-gray-800 dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="h-5 w-5 mr-3 text-red-500 dark:text-red-400" />
                            <span className="text-red-600 dark:text-red-400 font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/login")}
                  className="text-white hover:bg-teal-600 p-2 rounded-full"
                  aria-label="Login"
                >
                  <User className="h-6 w-6" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl w-full mx-4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 z-10 hover:bg-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="bg-gray-900 py-2 px-4">
              <h3 className="text-white font-medium">{selectedVideoTitle}</h3>
            </div>
            <video className="w-full h-full" controls autoPlay>
              <source src={videoSrc || ""} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  )
}
