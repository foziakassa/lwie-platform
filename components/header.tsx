"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  Search,
  HelpCircle,
  ShoppingCart,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Package,
  RefreshCw,
  ChevronRight,
} from "lucide-react"
import { CategoryNav } from "./category-nav"
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

export function Header() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showCartPreview, setShowCartPreview] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const mockSearchResults = [
    { id: "1", title: "iPhone 13 Pro", image: "/placeholder.svg", price: "35,000 ETB" },
    { id: "2", title: "Modern Sofa", image: "/placeholder.svg", price: "12,500 ETB" },
    { id: "3", title: "Mountain Bike", image: "/placeholder.svg", price: "8,000 ETB" },
  ]

  // Mock cart items
  const cartItems = [
    { id: "1", title: "Vintage Camera", image: "/placeholder.svg", price: "1,500 ETB" },
    { id: "2", title: "Wireless Headphones", image: "/placeholder.svg", price: "2,200 ETB" },
  ]

  // Mock user data
  // const mockUserData = {
  //   name: "Alex Johnson",
  //   email: "alex@example.com",
  //   itemsCount: 12,
  //   swapsCount: 5,
  //   avatar: "/placeholder.svg",
  // }

  // Safely get and parse user info from cookies
  useEffect(() => {
    const tokenString = Cookies.get("authToken")

    if (tokenString) {
      try {
        const parsedToken = JSON.parse(tokenString)
        setIsLoggedIn(true)
        setUserInfo(parsedToken)
        setIsLoggedIn(true)
      } catch (error) {
        setUserInfo({ token: tokenString })
        setIsLoggedIn(true)
      }
    } else {
      setUserInfo(null)
      setIsLoggedIn(false)
    }
  }, [])

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
       if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCartPreview(false); // Close cart preview on outside click
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

  const navigateToPost = () => {
    if (isLoggedIn) {
      router.push("/post")
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
    <header className="bg-teal-700 dark:bg-teal-900 sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
           {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <Image src="/images/lwie.png" alt="LWIE Logo" width={68} height={10} className="object-contain" priority />
            </motion.div>
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
                  aria-label="Search items"
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
              aria-label="Help"
            >
              <HelpCircle className="h-6 w-6" />
            </motion.button>

            {/* Notifications - Now using separate component */}
            <NotificationDropdown isLoggedIn={isLoggedIn} userInfo={userInfo} />

            {/* Cart */}
            {isLoggedIn && (
              <div className="relative" ref={cartRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setShowCartPreview(true)}
                  onClick={() => router.push("/cart")}
                  className="text-white hover:bg-teal-600 p-2 rounded-full"
                  aria-label="Shopping Cart"
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
            )}

            {/* Login/Profile Button */}
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

            {/* Post Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateToPost}
              className="bg-teal-600 text-white px-4 py-1 rounded-md font-medium hover:bg-teal-500 transition-colors"
              aria-label="Post new item"
            >
              Post
            </motion.button>

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

            {/* Profile Avatar or User Icon */}
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
                      {/* User info section */}
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
                            <p className="font-bold text-white text-lg">{userInfo?.firstName  || "User"}</p>
                            <p className="text-teal-100 text-sm">{userInfo?.email || "user@example.com"}</p>
                          </div>
                        </div>

                        <div className="flex justify-between mt-4 text-white text-sm">
                          <div className="text-center">
                            <p className="font-bold text-lg">{userInfo?.itemsCount || 0}</p>
                            <p className="text-teal-100">Items</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-lg">{userInfo?.swapsCount || 0}</p>
                            <p className="text-teal-100">Swaps</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
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
                          href="/my-items"
                          className="flex items-center px-4 py-3 text-gray-800 dark:text-white hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <Package className="h-5 w-5 mr-3 text-teal-600 dark:text-teal-400" />
                          <span>My Items</span>
                          <div className="ml-auto bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300 text-xs font-medium px-2 py-0.5 rounded-full">
                            {userInfo?.itemsCount || 0}
                          </div>
                        </Link>

                        <Link
                          href="/swaps"
                          className="flex items-center px-4 py-3 text-gray-800 dark:text-white hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <RefreshCw className="h-5 w-5 mr-3 text-teal-600 dark:text-teal-400" />
                          <span>My Swaps</span>
                          <div className="ml-auto bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300 text-xs font-medium px-2 py-0.5 rounded-full">
                            {userInfo?.swapsCount || 0}
                          </div>
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

      {/* <CategoryNav /> */}
    </header>
  )
}
