"use client"

import { useState } from "react"
import Link from "next/link"
import { Package, Briefcase, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostTypeSelectionProps {
  defaultSelected?: "item" | "service"
}

export default function PostTypeSelection({ defaultSelected }: PostTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<"item" | "service" | null>(defaultSelected || null)

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Create a New Post</h1>
        <p className="text-gray-600">Choose what you'd like to post on the Lwie platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          className={`border rounded-lg p-6 h-full cursor-pointer transition-colors ${
            selectedType === "item" ? "border-teal-500" : "hover:border-teal-500"
          }`}
          onClick={() => setSelectedType("item")}
        >
          <div className="flex items-start space-x-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <Package className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Post an Item</h2>
              <p className="text-gray-600">
                List physical items you want to swap or trade with others. Add photos, specifications, and your
                preferred trade options.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`border rounded-lg p-6 h-full cursor-pointer transition-colors ${
            selectedType === "service" ? "border-teal-500" : "hover:border-teal-500"
          }`}
          onClick={() => setSelectedType("service")}
        >
          <div className="flex items-start space-x-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Offer a Service</h2>
              <p className="text-gray-600">
                Offer your skills, expertise, or services to others. Describe what you can do, your experience, and what
                you'd like in return.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {selectedType && (
          <Link href={selectedType === "item" ? "/post/item/basic-info" : "/post/service/basic-info"}>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md flex items-center">
              Continue to {selectedType === "item" ? "Item" : "Service"} Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
