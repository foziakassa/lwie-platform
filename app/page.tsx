"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, MapPin, Heart, Share2, Gift } from "lucide-react";
import ApprovedAdvertisement from "./ad/page";
import ThreeDAdvertisement from '../components/3d-advertisement-carousel';
import { fetchItems, fetchServices } from "@/lib/api-client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
};



export default function Home() {
  const [visibleSection, setVisibleSection] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [posts, setPosts] = useState<any[]>([]); // Combined items and services
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    searchTerm: "",
  })
  const router = useRouter()

  useEffect(() => {
    // Check if there's a new post flag in localStorage
    const newPostSubmitted = localStorage.getItem("newPostSubmitted")

    if (newPostSubmitted) {
      // Clear the flag
      localStorage.removeItem("newPostSubmitted")
      // Show success toast
      toast({
        title: "Post published successfully",
        description: "Your post is now visible in the listings",
      })
    }

    loadListings()
  }, [])

 
  const loadListings = async () => {
    setIsLoading(true)
    try {
      // Load items
      const itemsResponse = await fetchItems()
      if (itemsResponse.success) {
        setItems(itemsResponse.items)
      } else {
        toast({
          title: "Error",
          description: "Failed to load item listings",
          variant: "destructive",
        })
      }

      // Load services
      const servicesResponse = await fetchServices()
      if (servicesResponse.success) {
        setServices(servicesResponse.services)
      } else {
        toast({
          title: "Error",
          description: "Failed to load service listings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading listings:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = async () => {
    setIsLoading(true)
    try {
      // Apply filters to items
      const itemsResponse = await fetchItems(filters)
      if (itemsResponse.success) {
        setItems(itemsResponse.items)
      }

      // Apply filters to services
      const servicesResponse = await fetchServices(filters)
      if (servicesResponse.success) {
        setServices(servicesResponse.services)
      }
    } catch (error) {
      console.error("Error applying filters:", error)
      toast({
        title: "Error",
        description: "Failed to apply filters",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      location: "",
      searchTerm: "",
    })
    loadListings()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  }

  const filteredItems = items.filter((item) => {
    if (activeTab === "services") return false
    if (filters.searchTerm && !item.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
    return true
  })

  const filteredServices = services.filter((service) => {
    if (activeTab === "items") return false
    if (filters.searchTerm && !service.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
    return true
  })

  const navigateToDetail = (post: any) => {
    const slug = generateSlug(post.title);
    router.push(`/${post.type === 'item' ? 'products' : 'services'}/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <ThreeDAdvertisement />
        <ApprovedAdvertisement />

         {/* Filter Section */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="professional">Professional Services</SelectItem>
                  <SelectItem value="repair">Repair & Maintenance</SelectItem>
                  <SelectItem value="creative">Creative & Design</SelectItem>
                  <SelectItem value="tech">Tech & IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                  <SelectItem value="Dire Dawa">Dire Dawa</SelectItem>
                  <SelectItem value="Hawassa">Hawassa</SelectItem>
                  <SelectItem value="Bahir Dar">Bahir Dar</SelectItem>
                  <SelectItem value="Mekelle">Mekelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={applyFilters} className="bg-teal-600 hover:bg-teal-700">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Listings</h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>
            </Tabs>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Items */}
              {filteredItems.length > 0 &&
                filteredItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={item.images[0] || "/placeholder.svg?height=300&width=300"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <Share2 className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-white text-xs px-2 py-0.5 rounded font-medium text-gray-700">
                          {item.condition}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between">
                        <p className="font-bold text-lg">{item.price?.toLocaleString()} ETB</p>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">Item</span>
                      </div>
                      <h3 className="text-sm mt-1">{item.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{item.location || `${item.city}, ${item.subcity}`}</span>
                      </div>
                    </div>
                  </Link>
                ))}

              {/* Services */}
              {filteredServices.length > 0 &&
                filteredServices.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={service.images[0] || "/placeholder.svg?height=300&width=300"}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <Share2 className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-white text-xs px-2 py-0.5 rounded font-medium text-gray-700">
                          {service.experience}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between">
                        <p className="font-bold text-lg">Service</p>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">Service</span>
                      </div>
                      <h3 className="text-sm mt-1">{service.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{service.location || `${service.city}, ${service.subcity}`}</span>
                      </div>
                    </div>
                  </Link>
                ))}

              {filteredItems.length === 0 && filteredServices.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No listings found. Try adjusting your filters.</p>
                  <Button onClick={resetFilters} variant="outline" className="mt-4">
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
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
  );
}