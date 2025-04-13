"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Search, HelpCircle, Bell, ShoppingCart, Sun, Moon } from "lucide-react"
import { CategoryNav } from "./category-nav"
import Cookies from 'js-cookie';


interface SearchResult {
  id: string
  title: string
  image: string
  price: string
}

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCartPreview, setShowCartPreview] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Mock search results
  const mockSearchResults = [
    { id: "1", title: "iPhone 13 Pro", image: "/placeholder.svg", price: "35,000 ETB" },
    { id: "2", title: "Modern Sofa", image: "/placeholder.svg", price: "12,500 ETB" },
    { id: "3", title: "Mountain Bike", image: "/placeholder.svg", price: "8,000 ETB" },
  ]

  // Mock notifications
  const notifications = [
    { id: "1", title: "New swap request", message: "John wants to swap with you", time: "5 min ago" },
    { id: "2", title: "Message received", message: "New message from Sarah", time: "1 hour ago" },
    { id: "3", title: "Swap accepted", message: "Your swap request was accepted", time: "2 hours ago" },
  ]

  // Mock cart items
  const cartItems = [
    { id: "1", title: "Vintage Camera", image: "/placeholder.svg", price: "1,500 ETB" },
    { id: "2", title: "Wireless Headphones", image: "/placeholder.svg", price: "2,200 ETB" },
  ]


  const userInfoStr = Cookies.get('authToken');
  
      let userInfo = null;
  
      if (userInfoStr) {
          try {
              userInfo = JSON.parse(userInfoStr); // Parse the string back to an object
          } catch (error) {
              console.error("Failed to parse user info:", error);
          }
      }

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCartPreview(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
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
      // In a real app, you would fetch from an API
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

    // Check if user is logged in (from localStorage in this example)
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(userLoggedIn)
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
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    setShowProfileDropdown(false)
    router.push("/")
  }

  const navigateToHelp = () => {
    router.push("/help")
  }

  const navigateToPost = () => {
    router.push("/post")
  }

  return (
    <header className="bg-teal-700 dark:bg-teal-900 sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div whileHover={{ rotate: -10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-white">
                <path d="M20 12H4m0 0l6-6m-6 6l6 6" />
              </svg>
            </motion.div>
            <span className="text-white text-xl font-bold ml-2">LWIE</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search items to swap..."
                  className="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
              </div>
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden"
                >
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <Link
                        href={`/item/${result.id}`}
                        key={result.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <div className="h-10 w-10 relative mr-3 flex-shrink-0">
                          <Image
                            src={result.image || "/placeholder.svg"}
                            alt={result.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white">{result.title}</p>
                          <p className="text-teal-600 dark:text-teal-400 text-sm">{result.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateToHelp}
              className="text-white hover:bg-teal-600 p-2 rounded-full"
            >
              <HelpCircle className="h-6 w-6" />
            </motion.button>

            {/* Notifications */}
            {userInfo? (
              <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white hover:bg-teal-600 p-2 rounded-full relative"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-10"
                  >
                    <div className="flex justify-between items-center px-4 py-2 bg-teal-50 dark:bg-teal-900">
                      <h3 className="font-medium text-teal-900 dark:text-white">Notifications</h3>
                      <Link
                        href="/notifications"
                        className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                        onClick={() => setShowNotifications(false)}
                      >
                        View All
                      </Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-900 dark:text-white">{notification.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            ):(
              <div className=""></div>
            )}
            

            {/* Cart */}
            {userInfo ?(
              <div className="relative" ref={cartRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setShowCartPreview(true)}
                onClick={() => router.push("/cart")}
                className="text-white hover:bg-teal-600 p-2 rounded-full"
              >
                <ShoppingCart className="h-6 w-6" />
              </motion.button>
              
                <AnimatePresence>
                {showCartPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden"
                  >
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Your Cart</h3>
                      {cartItems.length > 0 ? (
                        <>
                          <div className="space-y-3 mb-4">
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex items-center">
                                <div className="h-12 w-12 relative mr-3 flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white">{item.title}</p>
                                  <p className="text-sm text-teal-600 dark:text-teal-400">{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Link
                            href="/cart"
                            className="block w-full py-2 text-center bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                            onClick={() => setShowCartPreview(false)}
                          >
                            View Cart
                          </Link>
                        </>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Your cart is empty</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
                
              
              
            </div>
            ):(
              <div className=""></div>
            )}

            {/* Login/Profile Button */}
            {userInfo ?(
              <div className=''></div>
            )
            :(
              <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                className="bg-white text-teal-700 px-4 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                {isLoggedIn ? "Profile" : "Login"}
              </motion.button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden"
                  >
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/my-items"
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        My Items
                      </Link>
                      <Link
                        href="/swaps"
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        My Swaps
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            )}
            
            {/* Post Button */}
           {userInfo? (
             <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={navigateToPost}
             className="bg-teal-600 text-white px-4 py-1 rounded-md font-medium hover:bg-teal-500 transition-colors"
           >
             Post
           </motion.button>

           ):(
            <div className=""></div>
           )}
            {/* Dark Mode Toggle */}
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

            {/* Profile Avatar  */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/profile")}
              className="text-white hover:bg-teal-600 p-1 rounded-full overflow-hidden"
              aria-label="Go to Profile"
            >
              <div className="h-8 w-8 relative">
                <Image src="/placeholder.svg" alt="Profile" fill className="object-cover rounded-full" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      <CategoryNav />
    </header>
  )
}

