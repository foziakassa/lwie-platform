"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Users, Target, MapPin, Calendar, Phone, Mail, Globe } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  donationType: string
  amount: string
}

// Static charity data for better UI demonstration
const staticCharityData = {
  1: {
    id: 1,
    name: "Ethiopian Red Cross Society",
    description: "Supporting communities in need through healthcare and disaster relief across Ethiopia.",
    image: "/red cross.jpg",
    progress: 75,
    goal: 150,
    needed: ["Clothing", "Medical Supplies", "Food", "Blankets"],
    location: "Addis Ababa",
    established: "1935",
    beneficiaries: "2.5M+",
    projects: 45,
    contact: {
      phone: "+251-11-551-8888",
      email: "info@redcross.org.et",
      website: "www.redcross.org.et",
    },
    impact: {
      peopleHelped: "2,500,000",
      projectsCompleted: "1,200",
      volunteersActive: "15,000",
    },
  },
  2: {
    id: 2,
    name: "Mekedonia Humanitarian Association",
    description:
      "Dedicated to caring for the elderly and mentally disabled people in Ethiopia with compassion and dignity.",
    image: "/mekedonya.jpg",
    progress: 60,
    goal: 200,
    needed: ["Food", "Clothing", "Hygiene Products", "Bedding", "Medical Equipment"],
    location: "Addis Ababa",
    established: "1995",
    beneficiaries: "5,000+",
    projects: 12,
    contact: {
      phone: "+251-11-662-3456",
      email: "info@mekedonia.org",
      website: "www.mekedonia.org",
    },
    impact: {
      peopleHelped: "5,000",
      projectsCompleted: "85",
      volunteersActive: "500",
    },
  },
}

const donationAmounts = [
  { value: "50", label: "50 ETB" },
  { value: "100", label: "100 ETB" },
  { value: "250", label: "250 ETB" },
  { value: "500", label: "500 ETB" },
  { value: "1000", label: "1000 ETB" },
  { value: "custom", label: "Custom Amount" },
]

const DonatePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    donationType: "items",
    amount: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charity, setCharity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedAmount, setSelectedAmount] = useState("")

  const router = useRouter()
  const params = useParams()
  const charityId = params.id as string

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        // Use static data for better UI demonstration
        const staticCharity = staticCharityData[charityId as unknown as keyof typeof staticCharityData]
        if (staticCharity) {
          setCharity(staticCharity)
        } else {
          // Fallback to API call
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
          const response = await fetch(`https://liwedoc.vercel.app/charities/${charityId}`)

          if (!response.ok) {
            throw new Error("Failed to fetch charity")
          }

          const data = await response.json()
          setCharity(data)
        }
      } catch (err) {
        setError("Failed to fetch charity.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (charityId) {
      fetchCharity()
    }
  }, [charityId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount)
    setFormData((prev) => ({ ...prev, amount: amount === "custom" ? "" : amount }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    if (formData.donationType === "money" && !formData.amount.trim()) {
      newErrors.amount = "Amount is required for monetary donations"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Donation request sent!",
        description: "Thank you for your generosity. We'll contact you soon with next steps.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        donationType: "items",
        amount: "",
      })
      setSelectedAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send donation request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading charity details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/charity")} className="bg-teal-600 hover:bg-teal-700">
            Back to Charities
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/charity"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-teal-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Charities
          </Link>
        </div>
      </div>

      {charity && (
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8"
          >
            <Card className="overflow-hidden">
              <div className="relative h-80 w-full">
                <Image src={charity.image || "/placeholder.svg"} alt={charity.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="text-4xl font-bold mb-2">{charity.name}</h1>
                  <p className="text-xl opacity-90 mb-4">{charity.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {charity.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Est. {charity.established}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {charity.beneficiaries} beneficiaries
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charity Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-teal-600" />
                      Donation Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Items Collected</span>
                        <span className="text-sm text-gray-500">
                          {charity.progress} / {charity.goal}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(charity.progress / charity.goal) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {Math.round((charity.progress / charity.goal) * 100)}% of goal reached
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Needed Items */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Items Needed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {charity.needed?.map((item: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Impact Statistics */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Our Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-teal-600">{charity.impact?.peopleHelped}</div>
                        <div className="text-sm text-gray-600">People Helped</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{charity.impact?.projectsCompleted}</div>
                        <div className="text-sm text-gray-600">Projects Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{charity.impact?.volunteersActive}</div>
                        <div className="text-sm text-gray-600">Active Volunteers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-3 text-gray-500" />
                        <span>{charity.contact?.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-gray-500" />
                        <span>{charity.contact?.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-3 text-gray-500" />
                        <span>{charity.contact?.website}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Donation Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Make a Donation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Donation Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
                      <select
                        name="donationType"
                        value={formData.donationType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="items">Donate Items</option>
                        <option value="money">Monetary Donation</option>
                      </select>
                    </div>

                    {/* Amount Selection for Monetary Donations */}
                    {formData.donationType === "money" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {donationAmounts.map((amount) => (
                            <button
                              key={amount.value}
                              type="button"
                              onClick={() => handleAmountSelect(amount.value)}
                              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                selectedAmount === amount.value
                                  ? "bg-teal-600 text-white border-teal-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {amount.label}
                            </button>
                          ))}
                        </div>
                        {selectedAmount === "custom" && (
                          <Input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Enter custom amount"
                            className={errors.amount ? "border-red-500" : ""}
                          />
                        )}
                        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
                      </div>
                    )}

                    {/* Personal Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your donation or any special instructions..."
                        rows={4}
                        className={errors.message ? "border-red-500" : ""}
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          Send Donation Request
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonatePage
