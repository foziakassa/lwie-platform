"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import { motion } from "framer-motion"
import { MapPin, Heart, Share2, Search, Loader2, Gift } from "lucide-react"
import ThreeDAdvertisement from "../components/3d-advertisement-carousel"
import { toast } from "components/ui/use-toast"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"

// Define types for our items and services
interface Item {
  id: string
  title?: string
  price?: number
  city?: string
  subcity?: string
  category?: string
  subcategory?: string
  image_urls?: string[]
}

interface Service {
  id: string
  title?: string
  price?: number
  city?: string
  subcity?: string
  category?: string
  subcategory?: string
  image_urls?: string[]
}

interface ItemsResponse {
  items: Item[]
}

interface ServicesResponse {
  service: Service[]
}

// API calls to fetch items and services
const fetchItems = async (params: Record<string, string>): Promise<ItemsResponse> => {
  try {
    const queryString = new URLSearchParams(params).toString()
    console.log("Fetching items with params:", params)
    const response = await fetch(`https://liwedoc.vercel.app/items?${queryString}`)

    if (!response.ok) {
      throw new Error("Failed to fetch items")
    }

    const data = await response.json()
    console.log("Items data received:", data)
    return data
  } catch (error) {
    console.error("Error in fetchItems:", error)
    throw error
  }
}

const fetchServices = async (params: Record<string, string>): Promise<ServicesResponse> => {
  try {
    const queryString = new URLSearchParams(params).toString()
    console.log("Fetching services with params:", params)
    const response = await fetch(`https://liwedoc.vercel.app/services?${queryString}`)

    if (!response.ok) {
      throw new Error("Failed to fetch services")
    }

    const data = await response.json()
    console.log("Services data received:", data)
    return data
  } catch (error) {
    console.error("Error in fetchServices:", error)
    throw error
  }
}

export default function Home() {
  const [listings, setListings] = useState<Item[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState<string>("all") // Changed default to "all"

  const [selectedCity, setSelectedCity] = useState<string>("All Cities")
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")

  const [allListings, setAllListings] = useState<Item[]>([])
  const [allServices, setAllServices] = useState<Service[]>([])

  const cities = [
    "All Cities",
    "Addis Ababa",
    "Dire Dawa",
    "Hawassa",
    "Bahir Dar",
    "Mekelle",
    "Adama",
    "Gondar",
    "Jimma",
  ]

  const subcities: Record<string, string[]> = {
    "Addis Ababa": ["Bole", "Kirkos", "Arada", "Yeka", "Lideta", "Kolfe", "Nifas Silk", "Akaki"],
    "Dire Dawa": ["Kezira", "Addis Ketema", "Gendekore", "Legehare"],
    Hawassa: ["Tabor", "Menaharia", "Piazza", "Tula"],
    "Bahir Dar": ["Belay Zeleke", "Sefene Selam", "Hidar 11", "Gish Abay"],
    Mekelle: ["Ayder", "Hadnet", "Semien", "Hawelti"],
    Adama: ["Dabe", "Boku", "Lugo", "Migra"],
    Gondar: ["Azezo", "Arada", "Maraki", "Kebele 18"],
    Jimma: ["Jiren", "Ginjo", "Mentina", "Hermata"],
  }

  const categories = [
    "All Categories",
    "Electronics",
    "Vehicles",
    "Clothing",
    "Furniture",
    "Sports & Outdoors",
    "Toys & Games",
    "Home-Appliances",
  ]

  const subcategories: Record<string, string[]> = {
    Electronics: ["Mobile Phones", "Laptops & Computers", "TVs & Monitors", "Tablets" , "Smartphones"],
    Vehicles: ["Cars", "Motorcycles", "Bicycles", "Vehicle Parts"],
    Property: ["Apartments", "Houses", "Land", "Commercial"],
    Furniture: ["Sofas & Couches", "Tables", "Chairs", "Beds & Mattresses" , "Storage & Organization"],
    Sport_and_Outdoors : ["Clothing", "Shoes", "Accessories", "Jewelry"],
    Toys_and_Games: ["Cleaning", "Repair", "Education", "Health"],
    Clothing: ["Full-time", "Part-time", "Freelance", "Internship"],
  }

  const router = useRouter()

  // Fetch all items and services on initial load
  useEffect(() => {
    setLoading(true)

    // Fetch all items
    fetchItems({})
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setAllListings(data.items)
          setListings(data.items)
        } else if (data && Array.isArray(data)) {
          setAllListings(data)
          setListings(data)
        } else {
          setAllListings([])
          setListings([])
        }
      })
      .catch((error) => {
        console.error("Error fetching all items:", error)
        toast({
          title: "Error",
          description: "Failed to load items. Please try again.",
          variant: "destructive",
        })
      })

    // Fetch all services
    fetchServices({})
      .then((data) => {
        if (data && Array.isArray(data.service)) {
          setAllServices(data.service)
          setServices(data.service)
        } else if (data && Array.isArray(data)) {
          setAllServices(data)
          setServices(data)
        } else {
          setAllServices([])
          setServices([])
        }
      })
      .catch((error) => {
        console.error("Error fetching all services:", error)
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Function to check if a string contains the search query (case insensitive)
  const matchesSearch = (field: string | undefined, query: string): boolean => {
    if (!field || !query) return false

    // Convert both to lowercase for case-insensitive comparison
    const fieldLower = field.toLowerCase().trim()
    const queryLower = query.toLowerCase().trim()

    return fieldLower.includes(queryLower)
  }

  // Enhanced filter function for listings that searches across multiple fields
  const filterListings = () => {
    setLoading(true)

    try {
      let filtered = [...allListings]

      // Apply dropdown filters first (case insensitive)
      if (selectedCity && selectedCity !== "All Cities") {
        filtered = filtered.filter((item) => item.city?.toLowerCase() === selectedCity.toLowerCase())
      }

      if (selectedCategory && selectedCategory !== "All Categories") {
        filtered = filtered.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase())
      }

      if (selectedSubcategory && selectedSubcategory !== "all") {
        filtered = filtered.filter((item) => item.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase())
      }

      // Then apply search query across multiple fields (case insensitive)
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.trim()
        console.log("Searching for:", query) // Debug log

        filtered = filtered.filter((item) => {
          const matches =
            matchesSearch(item.title, query) ||
            matchesSearch(item.city, query) ||
            matchesSearch(item.subcity, query) ||
            matchesSearch(item.category, query) ||
            matchesSearch(item.subcategory, query)

          return matches
        })
      }

      console.log("Filtered listings:", filtered.length) // Debug log
      setListings(filtered)
    } catch (error) {
      console.error("Error filtering listings:", error)
      toast({
        title: "Error",
        description: "Failed to filter listings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Enhanced filter function for services that searches across multiple fields
  const filterServices = () => {
    setLoading(true)

    try {
      let filtered = [...allServices]

      // Apply dropdown filters first (case insensitive)
      if (selectedCity && selectedCity !== "All Cities") {
        filtered = filtered.filter((service) => service.city?.toLowerCase() === selectedCity.toLowerCase())
      }

      if (selectedCategory && selectedCategory !== "All Categories") {
        filtered = filtered.filter((service) => service.category?.toLowerCase() === selectedCategory.toLowerCase())
      }

      if (selectedSubcategory && selectedSubcategory !== "all") {
        filtered = filtered.filter(
          (service) => service.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase(),
        )
      }

      // Then apply search query across multiple fields (case insensitive)
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.trim()
        console.log("Searching services for:", query) // Debug log

        filtered = filtered.filter((service) => {
          const matches =
            matchesSearch(service.title, query) ||
            matchesSearch(service.city, query) ||
            matchesSearch(service.subcity, query) ||
            matchesSearch(service.category, query) ||
            matchesSearch(service.subcategory, query)

          return matches
        })
      }

      console.log("Filtered services:", filtered.length) // Debug log
      setServices(filtered)
    } catch (error) {
      console.error("Error filtering services:", error)
      toast({
        title: "Error",
        description: "Failed to filter services. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search submitted with:", {
      query: searchQuery,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      city: selectedCity,
      activeTab: activeTab,
    })

    // Filter based on active tab
    if (activeTab === "all") {
      filterListings()
      filterServices()
    } else if (activeTab === "items") {
      filterListings()
    } else if (activeTab === "services") {
      filterServices()
    }
  }

  // Apply filters when dropdown selections change or tab changes
  useEffect(() => {
    if (allListings.length > 0 || allServices.length > 0) {
      if (activeTab === "all") {
        filterListings()
        filterServices()
      } else if (activeTab === "items") {
        filterListings()
      } else if (activeTab === "services") {
        filterServices()
      }
    }
  }, [selectedCity, selectedCategory, selectedSubcategory, activeTab])

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/products/${id}`
    if (navigator.share) {
      navigator.share({ title: "Check out this item", url })
    } else {
      navigator.clipboard.writeText(url)
      toast({ title: "Link Copied", description: "Link copied to clipboard" })
    }
  }

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    toast({ title: "Added to Favorites", description: "Item added to your favorites" })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setSelectedSubcategory("") // Reset subcategory when category changes
  }

  // Get placeholder text based on active tab
  const getPlaceholderText = () => {
    switch (activeTab) {
      case "items":
        return "Search items by title, city, subcity, category, or subcategory..."
      case "services":
        return "Search services by title, city, subcity, category, or subcategory..."
      case "all":
      default:
        return "Search items and services by title, city, subcity, category, or subcategory..."
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <ThreeDAdvertisement />
        {/* <div className="bg-white rounded-lg shadow-sm p-4 my-6"></div> */}
        <div className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={getPlaceholderText()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategory && selectedCategory !== "All Categories" && subcategories[selectedCategory] && (
              <Select
                value={selectedSubcategory || "all"}
                onValueChange={(value) => setSelectedSubcategory(value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {subcategories[selectedCategory].map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <Button type="submit" variant="default">
              Search
            </Button> */}

            <div className="flex gap-2">
              <Button
                type="button"
                variant={activeTab === "all" ? "default" : "outline"}
                onClick={() => setActiveTab("all")}
              >
                All
              </Button>
              <Button
                type="button"
                variant={activeTab === "items" ? "default" : "outline"}
                onClick={() => setActiveTab("items")}
              >
                Items
              </Button>
              <Button
                type="button"
                variant={activeTab === "services" ? "default" : "outline"}
                onClick={() => setActiveTab("services")}
              >
                Services
              </Button>
            </div>
          </form>
        </div>

        {/* Items Listing - Show when activeTab is "all" or "items" */}
        {(activeTab === "all" || activeTab === "items") && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Items Listings</h2>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-12 w-12 text-teal-500" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium">No items found</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map((item) => (
                  <Link href={`/products/${item.id}`} key={item.id} className="block">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm border h-full hover:shadow-md transition-shadow">
                      <div className="relative h-56">
                        <Image
                          src={item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : "/placeholder.svg"}
                          alt={item.title || "Product"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50"
                            onClick={(e) => handleFavorite(e, item.id)}
                            aria-label="Add to favorites"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                          <button
                            className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50"
                            onClick={(e) => handleShare(e, item.id)}
                            aria-label="Share listing"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{item.price?.toLocaleString()} ETB</h3>
                        <p className="text-gray-600">{item.title}</p>
                        <div className="flex items-center text-gray-500 text-sm mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <p>
                            {item.city || "Addis Ababa"}
                            {item.subcity ? `, ${item.subcity}` : ""}
                          </p>
                        </div>
                        {(item.category || item.subcategory) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.category && (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {item.category}
                              </span>
                            )}
                            {item.subcategory && (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {item.subcategory}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Listing - Show when activeTab is "all" or "services" */}
        {(activeTab === "all" || activeTab === "services") && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Services Listings</h2>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-12 w-12 text-teal-500" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium">No services found</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {services.map((service) => (
                  <Link href={`/services/${service.id}`} key={service.id} className="block">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm border h-full hover:shadow-md transition-shadow">
                      <div className="relative h-56">
                        <Image
                          src={
                            service.image_urls && service.image_urls.length > 0
                              ? service.image_urls[0]
                              : "/placeholder.svg"
                          }
                          alt={service.title || "Service"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50"
                            onClick={(e) => handleFavorite(e, service.id)}
                            aria-label="Add to favorites"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                          <button
                            className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50"
                            onClick={(e) => handleShare(e, service.id)}
                            aria-label="Share listing"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{service.title}</h3>
                        <p className="text-gray-600">{service.price?.toLocaleString()} ETB</p>
                        <div className="flex items-center text-gray-500 text-sm mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <p>
                            {service.city || "Addis Ababa"}
                            {service.subcity ? `, ${service.subcity}` : ""}
                          </p>
                        </div>
                        {(service.category || service.subcategory) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {service.category && (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {service.category}
                              </span>
                            )}
                            {service.subcategory && (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {service.subcategory}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

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
