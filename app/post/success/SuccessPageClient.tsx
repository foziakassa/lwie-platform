"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ChevronLeft } from "lucide-react"

export default function SuccessPageClient() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-teal-600 text-white p-4">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center">
            <ChevronLeft className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold">LWIE</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md max-w-md mx-auto overflow-hidden">
          <div className="bg-teal-600 p-8 text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Post Submitted Successfully!</h1>
            <p className="text-white/90 text-lg max-w">
              Let me create the components for the home page listings and product detail page:
            </p>

\
