"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, Briefcase, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PostPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"item" | "service" | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContinue = () => {
    if (selectedType === "item") {
      router.push("/post/item/basic-info")
    } else if (selectedType === "service") {
      router.push("/post/service/basic-info")
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#00796B]">Create a New Post</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose what you'd like to post on the LWIE platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
              selectedType === "item"
                ? "ring-2 ring-[#00796B] shadow-lg"
                : "border border-gray-200 shadow-sm hover:shadow-md hover:border-[#B2DFDB]"
            }`}
            onClick={() => setSelectedType("item")}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${selectedType === "item" ? "bg-[#E0F2F1]" : "bg-gray-100"}`}>
                  <Package className={`h-6 w-6 ${selectedType === "item" ? "text-[#00796B]" : "text-gray-600"}`} />
                </div>
                <div className="flex-1">
                  <h2
                    className={`text-xl font-semibold mb-2 ${selectedType === "item" ? "text-[#00796B]" : "text-gray-800"}`}
                  >
                    Post an Item
                  </h2>
                  <p className="text-gray-600 mb-4">List physical items you want to swap or trade with others.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
              selectedType === "service"
                ? "ring-2 ring-[#00796B] shadow-lg"
                : "border border-gray-200 shadow-sm hover:shadow-md hover:border-[#B2DFDB]"
            }`}
            onClick={() => setSelectedType("service")}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${selectedType === "service" ? "bg-[#E0F2F1]" : "bg-gray-100"}`}>
                  <Briefcase className={`h-6 w-6 ${selectedType === "service" ? "text-[#00796B]" : "text-gray-600"}`} />
                </div>
                <div className="flex-1">
                  <h2
                    className={`text-xl font-semibold mb-2 ${selectedType === "service" ? "text-[#00796B]" : "text-gray-800"}`}
                  >
                    Offer a Service
                  </h2>
                  <p className="text-gray-600 mb-4">Share your skills and expertise with others.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mb-12"
          >
            <Button
              onClick={handleContinue}
              className="bg-[#00796B] hover:bg-[#00695C] text-white px-6 py-2 rounded-md flex items-center shadow-sm"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            By posting on LWIE, you agree to our{" "}
            <Link href="/terms" className="text-[#00796B] hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
