"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, MapPin, Heart, Share2, Gift, Globe, Search, Loader2 } from "lucide-react";
import ApprovedAdvertisement from "./ad/page";
import ThreeDAdvertisement from '../components/3d-advertisement-carousel';
import { fetchItems, fetchServices } from "lib/api-client";
import { toast } from "components/ui/use-toast";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import type { Post } from "lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { CategoryNav } from "components/category-nav";


// Animation variants

export default function Home() {
  const [listings, setListings] = useState<Post[]>([])
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [visibleSection, setVisibleSection] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [posts, setPosts] = useState<any[]>([]); // Combined items and services
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("items")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewPostBanner, setShowNewPostBanner] = useState(false)
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false)

  const itemCategories = ["all", "Electronics", "Clothing", "Furniture", "Books", "Sports", "Other"]
  const serviceCategories = ["all", "Education", "Home Services", "Professional", "Health", "Tech", "Other"]

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
  const router = useRouter()

  useEffect(() => {
    loadListings()
  }, [activeTab, selectedCategory, selectedCity, searchQuery])

  const loadListings = async () => {
    try {
      setLoading(true)

      // PaginationParams type does not include category, city, query, so we need to remove them or cast to any
      const params: any = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedCity !== "All Cities" && selectedCity !== "") params.city = selectedCity;
      if (searchQuery !== "") params.query = searchQuery;

      let data: any

      if (activeTab === "items") {
        data = await fetchItems(params)
      } else {
        data = await fetchServices(params)
      }

      setListings(data.results || [])
    } catch (error) {
      console.error("Error loading listings:", error)
      toast({
        title: "Error",
        description: "Failed to load listings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already triggered by the useEffect
  }

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      navigator.share({
        title: "Check out this item on LWIE",
        url: `${window.location.origin}/products/${id}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/products/${id}`)
      toast({
        title: "Link Copied",
        description: "Link copied to clipboard",
      })
    }
  }

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    toast({
      title: "Added to Favorites",
      description: "Item added to your favorites",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <ThreeDAdvertisement />
        <ApprovedAdvertisement />

        <div className="container mx-auto px-4 py-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 my-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={`Search ${activeTab === "items" ? "items" : "services"}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>
            </div>

            <div className="flex gap-2">
              <div className="w-40">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
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
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={activeTab === "items" ? "bg-teal-50 text-teal-600 border-teal-200" : ""}
                  onClick={() => setActiveTab("items")}
                >
                  Items
                </Button>
                <Button
                  variant="outline"
                  className={activeTab === "services" ? "bg-teal-50 text-teal-600 border-teal-200" : ""}
                  onClick={() => setActiveTab("services")}
                >
                  Services
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Listings</h2>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium">No listings found</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Try adjusting your filters or search query, or check back later for new listings
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((item) => (
                <Link
                  href={activeTab === "items" ? `/products/${item.id}` : `/services/${item.id}`}
                  key={item.id}
                  className="block"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border h-full hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={item.images && item.images.length > 0 ? item.images[0] : "/placeholder.svg"}
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
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{item.price?.toLocaleString()} ETB</h3>
                          <p className="text-gray-600">{item.title}</p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                          {item.condition || (activeTab === "services" ? "Available" : "Used")}
                        </Badge>
                      </div>
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
