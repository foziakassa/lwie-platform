"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Cookies from "js-cookie"
import { initializePayment } from "@/lib/api-service"

interface Plan {
  id: number
  name: string
  posts_count: number
  price: string
  description: string
}

interface UserData {
  email: string
  firstName: string
  bio: string | null
  phone: string | null
  image: string | null
  activated: boolean
}

export default function CheckoutPage() {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const planData = sessionStorage.getItem("selectedPlan")
    if (planData) {
      setPlan(JSON.parse(planData))
    } else {
      // Try to get plan ID from URL
      const planId = searchParams.get("plan")
      if (planId) {
        // Redirect to plan selection with the ID
        router.push(`/plan-selection?preselect=${planId}`)
      } else {
        router.push("/plan-selection")
      }
    }
  }, [router, searchParams])

  const handlePayment = async () => {
    if (!plan) {
      toast.error("Plan information not found. Please select a plan again.")
      router.push("/plan-selection")
      return
    }

    setIsProcessing(true)

    // Get customer info from auth token if available
    let customerName = ""
    let customerEmail = ""

    const userCookie = Cookies.get("user")
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie) as UserData
        if (userData.firstName) {
          customerName = userData.firstName
          // Store in a separate cookie for easier access
          Cookies.set("customerName", userData.firstName, { expires: 365 })
        }
        if (userData.email) {
          customerEmail = userData.email
          // Store in a separate cookie for easier access
          Cookies.set("customerEmail", userData.email, { expires: 365 })
        }
      } catch (err) {
        console.warn("Failed to parse user cookie:", err)
      }
    }

    // Fallback to existing cookies if auth token parsing failed
    if (!customerName) {
      customerName = Cookies.get("customerName") || "Anonymous Customer"
    }
    if (!customerEmail) {
      customerEmail = Cookies.get("customerEmail") || "anonymous@example.com"
    }

    try {
      // Save the customer transaction info in sessionStorage with both name and email
      sessionStorage.setItem(
        "customerInfo",
        JSON.stringify({
          name: customerName,
          email: customerEmail,
          plan: plan.name,
          price: Number.parseFloat(plan.price),
          postsCount: plan.posts_count,
          date: new Date().toISOString(),
          transactionId: "pending",
        }),
      )

      // Call the API to initialize payment
      const result = await initializePayment({
        customerEmail: customerEmail,
        customerName: customerName,
        planId: plan.id,
        currency: "ETB",
      })

      if (result.success) {
        const updatedCustomerInfo = JSON.parse(sessionStorage.getItem("customerInfo") || "{}")
        updatedCustomerInfo.transactionId = result.transactionId || "TX-" + Date.now()
        sessionStorage.setItem("customerInfo", JSON.stringify(updatedCustomerInfo))

        // Redirect to the payment URL
        window.location.href = result.redirectUrl
      } else {
        toast.error("There was an error processing your payment. Please try again.")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("There was an error processing your payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-teal-500 hover:text-teal-600 hover:bg-teal-50 -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
            <CardDescription>Confirm and pay for the {plan.name} plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="pt-2">
                <div className="flex justify-between font-medium">
                  <span>Plan:</span>
                  <span>{plan.name}</span>
                </div>
                <div className="flex justify-between font-medium mt-1">
                  <span>Number of posts:</span>
                  <span>{plan.posts_count}</span>
                </div>
                <div className="flex justify-between font-bold text-teal-600 pt-2 border-t mt-2">
                  <span>Total:</span>
                  <span>{plan.price} ETB</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-teal-500 hover:bg-teal-600" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
