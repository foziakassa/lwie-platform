"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Filter, MapPin, Heart, Share2, Search, Loader2, Gift } from "lucide-react";
import ApprovedAdvertisement from "./ad/page";
import ThreeDAdvertisement from "../components/3d-advertisement-carousel";
import { toast } from "components/ui/use-toast";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Badge } from "components/ui/badge";

// API call to fetch items
const fetchItems = async (params: Record<string, string>) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`https://liwedoc.vercel.app/items?${queryString}`);

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  return await response.json();
};

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("items");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
  ];
  const router = useRouter();

  useEffect(() => {
    loadListings();
  }, [activeTab, selectedCity, searchQuery]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (selectedCity && selectedCity !== "All Cities") params.city = selectedCity;
      if (searchQuery) params.query = searchQuery;

      const data = await fetchItems(params);
      setListings(data.items || []);
    } catch (error) {
      console.error("Error loading listings:", error);
      toast({
        title: "Error",
        description: "Failed to load listings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadListings(); // Trigger search
  };

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/products/${id}`;
    if (navigator.share) {
      navigator.share({ title: "Check out this item", url });
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: "Link Copied", description: "Link copied to clipboard" });
    }
  };

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({ title: "Added to Favorites", description: "Item added to your favorites" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* <div className="border-4 border-red-500" style={{ minHeight: '150px' }}> */}
          <ThreeDAdvertisement />
        {/* </div> */}
        {/* <ApprovedAdvertisement /> */}

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 my-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
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
              <Button variant="outline" onClick={() => setActiveTab("items")}>
                Items
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("services")}>
                Services
              </Button>
            </form>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold">Listings</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin h-12 w-12 text-teal-500" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium">No listings found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
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