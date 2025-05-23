"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import { motion } from "framer-motion"
import { MapPin, Heart, Share2, Search, Loader2, Gift } from "lucide-react"
import ThreeDAdvertisement from "../components/3d-advertisement-carousel"
// import { Loader2, MapPin, Heart, Share2, Search } from 'lucide-react';
import { toast } from "components/ui/use-toast"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"

// Update the fetchItems function to properly handle all search parameters
const fetchItems = async (params: Record<string, string>) => {
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

// Update the fetchServices function to properly handle all search parameters
const fetchServices = async (params: Record<string, string>) => {
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

// Replace the loadListings function with this improved version
const loadListings = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setListings: React.Dispatch<React.SetStateAction<any[]>>,
  searchQuery: string,
  selectedCity: string,
  selectedCategory: string,
  selectedSubcategory: string,
) => {
  try {
    setLoading(true)
    const params: Record<string, string> = {}

    // Add search parameters
    if (searchQuery) {
      params.title = searchQuery // Search by title
      params.query = searchQuery // Keep the original query parameter too
    }

    // Add location filter
    if (selectedCity && selectedCity !== "All Cities") {
      params.city = selectedCity
    }

    // Add category filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.category = selectedCategory
    }

    // Add subcategory filter
    if (selectedSubcategory && selectedSubcategory !== "all") {
      params.subcategory = selectedSubcategory
    }

    console.log("Loading listings with params:", params)
    const data = await fetchItems(params)

    // Make sure we're handling the response structure correctly
    if (data && Array.isArray(data.items)) {
      setListings(data.items)
    } else if (data && Array.isArray(data)) {
      setListings(data)
    } else {
      setListings([])
      console.warn("Unexpected data structure for items:", data)
    }
  } catch (error) {
    console.error("Error loading listings:", error)
    toast({
      title: "Error",
      description: "Failed to load listings. Please try again.",
      variant: "destructive",
    })
    setListings([])
  } finally {
    setLoading(false)
  }
}

// Replace the loadServices function with this improved version
const loadServices = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setServices: React.Dispatch<React.SetStateAction<any[]>>,
  searchQuery: string,
  selectedCity: string,
  selectedCategory: string,
  selectedSubcategory: string,
) => {
  try {
    setLoading(true)
    const params: Record<string, string> = {}

    // Add search parameters
    if (searchQuery) {
      params.title = searchQuery // Search by title
      params.city = searchQuery // Keep the original query parameter too
    }

    // Add location filter
    if (selectedCity && selectedCity !== "All Cities") {
      params.city = selectedCity
    }

    // Add category filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.category = selectedCategory
    }

    // Add subcategory filter
    if (selectedSubcategory && selectedSubcategory !== "all") {
      params.subcategory = selectedSubcategory
    }

    console.log("Loading services with params:", params)
    const data = await fetchServices(params)

    // Make sure we're handling the response structure correctly
    if (data && Array.isArray(data.service)) {
      setServices(data.service)
    } else if (data && Array.isArray(data)) {
      setServices(data)
    } else {
      setServices([])
      console.warn("Unexpected data structure for services:", data)
    }
  } catch (error) {
    console.error("Error loading services:", error)
    toast({
      title: "Error",
      description: "Failed to load services. Please try again.",
      variant: "destructive",
    })
    setServices([])
  } finally {
    setLoading(false)
  }
}

// Update the handleSearch function to be more robust
const handleSearch = (
  e: React.FormEvent,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setListings: React.Dispatch<React.SetStateAction<any[]>>,
  setServices: React.Dispatch<React.SetStateAction<any[]>>,
  searchQuery: string,
  selectedCategory: string,
  selectedSubcategory: string,
  selectedCity: string,
  activeTab: string,
) => {
  e.preventDefault()
  console.log("Search submitted with:", {
    query: searchQuery,
    category: selectedCategory,
    subcategory: selectedSubcategory,
    city: selectedCity,
  })

  if (activeTab === "items" || activeTab === "both") {
    loadListings(setLoading, setListings, searchQuery, selectedCity, selectedCategory, selectedSubcategory)
  }

  if (activeTab === "services" || activeTab === "both") {
    loadServices(setLoading, setServices, searchQuery, selectedCity, selectedCategory, selectedSubcategory)
  }
}

export default function Home() {
  const [listings, setListings] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("items")

  const [selectedCity, setSelectedCity] = useState<string>("All Cities")
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")

  const [allListings, setAllListings] = useState<any[]>([]);
const [allServices, setAllServices] = useState<any[]>([]);

useEffect(() => {
  fetchItems({}) // fetch all items, no filters
    .then(data => {
      if (data && Array.isArray(data.items)) {
        setAllListings(data.items);
      } else if (data && Array.isArray(data)) {
        setAllListings(data);
      } else {
        setAllListings([]);
      }
    });
  fetchServices({}) // fetch all services, no filters
    .then(data => {
      if (data && Array.isArray(data.service)) {
        setAllServices(data.service);
      } else if (data && Array.isArray(data)) {
        setAllServices(data);
      } else {
        setAllServices([]);
      }
    });
}, []);
const filterListings = () => {
  let filtered = allListings;
  if (searchQuery) {
    filtered = filtered.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (selectedCity && selectedCity !== "All Cities") {
    filtered = filtered.filter(item => item.city === selectedCity);
  }
  if (selectedCategory && selectedCategory !== "All Categories") {
    filtered = filtered.filter(item => item.category === selectedCategory);
  }
  if (selectedSubcategory && selectedSubcategory !== "") {
    filtered = filtered.filter(item => item.subcategory === selectedSubcategory);
  }
  setListings(filtered);
};

const filterServices = () => {
  let filtered = allServices;
  if (searchQuery) {
    filtered = filtered.filter(service =>
      service.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (selectedCity && selectedCity !== "All Cities") {
    filtered = filtered.filter(service => service.city === selectedCity);
  }
  if (selectedCategory && selectedCategory !== "All Categories") {
    filtered = filtered.filter(service => service.category === selectedCategory);
  }
  if (selectedSubcategory && selectedSubcategory !== "") {
    filtered = filtered.filter(service => service.subcategory === selectedSubcategory);
  }
  setServices(filtered);
};
const handleSearch = (e: React.FormEvent<HTMLFormElement>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setListings: React.Dispatch<React.SetStateAction<any[]>>, setServices: React.Dispatch<React.SetStateAction<any[]>>, searchQuery: string, selectedCategory: string, selectedSubcategory: string, selectedCity: string, activeTab: string) => {
  e.preventDefault();
  if (activeTab === "items" || activeTab === "both") {
    filterListings();
  }
  if (activeTab === "services" || activeTab === "both") {
    filterServices();
  }
};


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

  const categories = [
    "All Categories",
    "Electronics",
    "Vehicles",
    "Property",
    "Furniture",
    "Fashion",
    "Services",
    "Jobs",
  ]

  const subcategories: Record<string, string[]> = {
    Electronics: ["Phones", "Computers", "TVs", "Accessories"],
    Vehicles: ["Cars", "Motorcycles", "Bicycles", "Spare Parts"],
    Property: ["Apartments", "Houses", "Land", "Commercial"],
    Furniture: ["Living Room", "Bedroom", "Kitchen", "Office"],
    Fashion: ["Clothing", "Shoes", "Accessories", "Jewelry"],
    Services: ["Cleaning", "Repair", "Education", "Health"],
    Jobs: ["Full-time", "Part-time", "Freelance", "Internship"],
  }
  const router = useRouter()

  // Update the useEffect to only trigger when the search button is clicked
  // Remove this useEffect:
  // useEffect(() => {
  //   loadListings();
  //   loadServices();
  // }, [activeTab, selectedCity, searchQuery, selectedCategory, selectedSubcategory]);

  // Add this useEffect instead:
  useEffect(() => {
    // Initial load of data
    loadListings(setLoading, setListings, searchQuery, selectedCity, selectedCategory, selectedSubcategory)
    loadServices(setLoading, setServices, searchQuery, selectedCity, selectedCategory, selectedSubcategory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleCategoryChange = (
    value: string,
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>,
    setSelectedSubcategory: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setSelectedCategory(value)
    setSelectedSubcategory("") // Reset subcategory when category changes
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* <div className="border-4 border-red-500" style={{ minHeight: '150px' }}> */}
        <ThreeDAdvertisement />
        {/* </div> */}
        {/* <ApprovedAdvertisement /> */}
        {/* <div className="container mx-auto px-4 py-6" > */}
        <div className="bg-white rounded-lg shadow-sm p-4 my-6"></div>
        <div className="container mx-auto px-4 py-6">
          {/* Update the form submission to properly handle the search */}
          {/* Replace the form element with this: */}
          <form
            onSubmit={(e) =>
              handleSearch(
                e,
                setLoading,
                setListings,
                setServices,
                searchQuery,
                selectedCategory,
                selectedSubcategory,
                selectedCity,
                activeTab,
              )
            }
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={`Search ${activeTab === "items" ? "items" : "services"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(value) => handleCategoryChange(value, setSelectedCategory, setSelectedSubcategory)}
            >
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

            <Button type="submit" variant="default">
              Search
            </Button>

            <div className="flex gap-2">
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

        {/* Items Listing */}
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
                        alt={item.title}
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
                        <p>{item.city || "Addis Ababa"}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Services Listing */}
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
                        src={service.image_urls?.[0] || "/placeholder.svg"}
                        alt={service.title}
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
                        <p>{service.city || "Addis Ababa"}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
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
