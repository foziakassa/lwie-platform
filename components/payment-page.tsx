
"use client"

import { useState, useEffect } from "react"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { processPayment, checkUserFreeStatus } from "@/lib/actions"
import { toast } from "sonner"

type PlanType = "free" | "standard" | "premium"

interface Plan {
  id: PlanType
  name: string
  price: number
  description: string
  features: string[]
  posts: string
  isPopular?: boolean
}

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [hasUsedFreeTier, setHasUsedFreeTier] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  // All available plans
  const allPlans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Basic plan for occasional users",
      features: ["3 posts", "Basic support", "Community access"],
      posts: "3 posts",
    },
    {
      id: "standard",
      name: "Standard",
      price: 499,
      description: "Perfect for regular users",
      features: ["15 posts", "Priority support", "Community access", "Featured listings"],
      posts: "15 posts",
      isPopular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: 999,
      description: "For power users and businesses",
      features: ["Unlimited posts", "24/7 support", "Community access", "Featured listings", "Analytics dashboard"],
      posts: "Unlimited",
    },
  ]

  // Check if user has already used free tier
  useEffect(() => {
    const checkFreeStatus = async () => {
      try {
        const status = await checkUserFreeStatus()
        setHasUsedFreeTier(status.hasUsedFreeTier)
      } catch (error) {
        console.error("Error checking free tier status:", error)
        // Default to not showing free tier if there's an error
        setHasUsedFreeTier(false)
      }
    }

    checkFreeStatus()
  }, [])

  // Filter plans based on whether user has used free tier
  const availablePlans = hasUsedFreeTier ? allPlans.filter((plan) => plan.id !== "free") : allPlans

  const handleSelectPlan = (planId: PlanType) => {
    setSelectedPlan(planId)

    if (planId === "free") {
      // For free plan, no need to show payment form
      setShowPaymentForm(false)
    } else {
      // For paid plans, show payment form
      setShowPaymentForm(true)
    }
  }

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue.")
      return
    }

    if (selectedPlan === "free") {
      toast.success("You've been successfully registered for the free plan with 3 posts.")
      // Here you would typically update the user's status in your database
      setHasUsedFreeTier(true)
      setSelectedPlan(null)
      return
    }


// Validate form for paid plans
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide your name and email to continue.")
      return
    }

    setIsProcessing(true)
    try {
      const selectedPlanData = allPlans.find((plan) => plan.id === selectedPlan)
      if (!selectedPlanData) {
        throw new Error("Plan not found")
      }

      const result = await processPayment({
        amount: selectedPlanData.price,
        planName: selectedPlanData.name,
        currency: "ETB",
        customerName: name,
        customerEmail: email,
      })

      if (result.success) {
        window.location.href = result.redirectUrl || "/payment/success"
      } else {
        toast.error(result.message || "There was an error processing your payment. Please try again.")
      }
    } catch (error) {
      toast.error("There was an error processing your payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {hasUsedFreeTier
              ? "Upgrade your plan to post more items and access premium features."
              : "Select the plan that best fits your needs. Start with our free tier or upgrade for more features."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {availablePlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all ${
                selectedPlan === plan.id
                  ? "border-teal-500 border-2 shadow-lg"
                  : "border-gray-200 hover:border-teal-300"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-teal-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                  Popular
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price === 0 ? "Free" : `${plan.price} ETB`}
                  </span>
                  {plan.price > 0 && <span className="text-gray-500 ml-1">/month</span>}
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                  className={`w-full ${selectedPlan === plan.id ? "bg-teal-500 hover:bg-teal-600" : "text-teal-500 border-teal-500 hover:bg-teal-50"}`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>


{showPaymentForm && selectedPlan && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
                <CardDescription>
                  Enter your details to continue with {allPlans.find((p) => p.id === selectedPlan)?.name} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Plan:</span>
                      <span>{allPlans.find((p) => p.id === selectedPlan)?.name}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-1">
                      <span>Price:</span>
                      <span className="font-semibold text-teal-600">
                        {allPlans.find((p) => p.id === selectedPlan)?.price} ETB
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {selectedPlan === "free" && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Confirm Free Plan</CardTitle>
                <CardDescription>You've selected the Free plan with 3 posts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The Free plan gives you access to post up to 3 items. You can upgrade to a paid plan anytime to post
                  more items.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-teal-500 hover:bg-teal-600"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  Activate Free Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}