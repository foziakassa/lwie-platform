"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Gift, ArrowRight, Search, Check } from "lucide-react"
import poster from "@/shared/post"
import fetch from "@/shared/fetch"

// Mock data for charities
const charities = [
  {
    id: 1,
    name: "Ethiopian Red Cross Society",
    description: "Supporting communities in need through healthcare and disaster relief.",
    image: "/red cross.jpg",
    progress: 75,
    goal: 150,
    needed: ["Clothing", "Medical Supplies", "Food"],
    location: "Addis Ababa",
  },
  {
    id: 2,
    name: "Mekedonia Humanitarian Association",
    description: "Care for the elderly and mentally disabled people in Ethiopia.",
    image: "/mekedonya.jpg",
    progress: 60,
    goal: 200,
    needed: ["Food", "Clothing", "Hygiene Products", "Bedding"],
    location: "Addis Ababa",
  },
  {
    id: 3,
    name: "SOS Children's Villages Ethiopia",
    description: "Supporting orphaned and abandoned children across Ethiopia.",
    image: "/sos.png",
    progress: 85,
    goal: 300,
    needed: ["Books", "Toys", "School Supplies", "Clothing"],
    location: "Multiple Locations",
  },
  {
    id: 4,
    name: "Ethiopian Wildlife Conservation Authority",
    description: "Protecting Ethiopia's unique wildlife and natural habitats.",
    image: "/wild life.jpg",
    progress: 40,
    goal: 100,
    needed: ["Equipment", "Office Supplies", "Educational Materials"],
    location: "Addis Ababa",
  },
  {
    id: 5,
    name: "Hope for Children Organization",
    description: "Providing education and support for vulnerable children.",
    image: "/hope.jpg",
    progress: 55,
    goal: 250,
    needed: ["School Supplies", "Books", "Clothing", "Computers"],
    location: "Hawassa",
  },
  {
    id: 6,
    name: "Ethiopian Food Bank",
    description: "Fighting hunger by collecting and distributing food to those in need.",
    image: "/food bank.jpg",
    progress: 30,
    goal: 500,
    needed: ["Food", "Storage Containers", "Transportation Equipment"],
    location: "Addis Ababa",
  },
]

// Categories for filtering
const categories = ["All", "Children", "Healthcare", "Education", "Food", "Wildlife", "Elderly"]

// Donation types
const donationTypes = [
  {
    id: "items",
    title: "Donate Items",
    description: "Donate unused items directly to charities in need",
    icon: Gift,
  },
  {
    id: "money",
    title: "Monetary Donation",
    description: "Make a financial contribution to support charitable work",
    icon: Heart,
  },
]


export default  function CharityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDonationType, setSelectedDonationType] = useState("items")

  const [charitydata, setCharityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getCharities = async () => {
      try {
        const data = await fetch('/charities'); // Fetch data from the API
        setCharityData(data);
        
      } catch (err) {
        setError("Failed to fetch charities.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCharities();
  }, []);

  // useEffect(() => {
  //   const getCharities = async () => {
  //     try {
  //       const response = await fetch('/charities'); // Fetch data from the API
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json(); // Parse the JSON response
  //       setCharityData(data);
  //     } catch (err) {
  //       setError("Failed to fetch charities.");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getCharities();
  // }, []);
  




  // Filter charities based on search and category
  const filteredCharities = charities.filter((charity) => {
    const matchesSearch =
      charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Children" && charity.name.includes("Children")) ||
      (selectedCategory === "Healthcare" && charity.name.includes("Red Cross")) ||
      (selectedCategory === "Elderly" && charity.name.includes("Mekedonia")) ||
      (selectedCategory === "Wildlife" && charity.name.includes("Wildlife")) ||
      (selectedCategory === "Education" && charity.needed.includes("School Supplies")) ||
      (selectedCategory === "Food" && charity.name.includes("Food"))

    return matchesSearch && matchesCategory
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Make a Difference Today</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your donations can change lives. Choose from our verified charity partners and help those in need through
            item donations or financial contributions.
          </p>
        </motion.div>

        {/* Donation Type Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donationTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer border-2 ${
                  selectedDonationType === type.id ? "border-teal-500" : "border-transparent"
                }`}
                onClick={() => setSelectedDonationType(type.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-full ${
                      selectedDonationType === type.id
                        ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <type.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{type.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{type.description}</p>
                  </div>
                  {selectedDonationType === type.id && (
                    <div className="ml-auto">
                      <div className="bg-teal-500 text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:w-96">
              <input
                type="search"
                placeholder="Search for charities..."
                className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto py-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

       
        {/* Charities List which are connected to the */}

        <motion.div
      className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {charitydata.map((charity:{id:number | string ; name:string ;image : any ; description:string; location:string; needed:string[]; progress:number; goal:number ;}) => (
        <motion.div
          key={charity.id}
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative h-48">
            <Image 
              src={charity.image || "/placeholder.svg"} 
              alt={charity.name} 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-white text-sm flex items-center">
                <Gift className="h-4 w-4 mr-1" />
                {charity.progress} / {charity.goal} items donated
              </p>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{charity.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{charity.description}</p>

            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location: {charity.location}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {charity.needed.map((item:any  , index :number) => (
                  <span
                    key={index}
                    className="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 px-2 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${(charity.progress / charity.goal) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                {Math.round((charity.progress / charity.goal) * 100)}% of goal reached
              </p>
            </div>

            <button
              className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center"
              onClick={() => router.push(`/charity/${charity.id}`)}
            >
              Donate Now <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>

        

        {filteredCharities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No charities found matching your criteria.</p>
            <button
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Impact Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-6xl mx-auto mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Impact Stories</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 md:mr-8">
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image src="/happy.jpg" alt="Impact Story" fill className="object-cover" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  How Your Donations Changed Lives in Hawassa
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Thanks to the generous donations through LWIE, 200 children in our community now have access to
                  school supplies and educational materials. This has significantly improved their learning experience
                  and academic performance."
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  - Ayana Tadesse, Director at Hope for Children Organization
                </p>
                <button className="mt-4 text-teal-600 dark:text-teal-400 font-medium flex items-center hover:underline">
                  Read full story <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

