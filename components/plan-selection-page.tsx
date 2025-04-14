"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { PostCounter } from "@/components/post-counter"

type PlanType = "basic" | "standard" | "premium"

interface Plan {
  id: PlanType
  name: string
  price: number
  description: string
  features: string[]
  posts: number
  isPopular?: boolean
}

export default function PlanSelectionPage({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  // All available plans - fixed packages
  const allPlans: Plan[] = [
    {
      id: "basic",
      name: "Basic",
      price: 15,
      description: "Perfect for occasional users",
      features: ["5 posts", "Basic support", "Community access"],
      posts: 5,
    },
    {
      id: "standard",
      name: "Standard",
      price: 20,
      description: "Great for regular users",
      features: ["7 posts", "Priority support", "Community access", "Featured listings"],
      posts: 7,
      isPopular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: 30,
      description: "For power users and businesses",
      features: ["15 posts", "Priority support", "Community access", "Featured listings", "Analytics dashboard"],
      posts: 15,
    },
  ]

  const handleContinue = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue.")
      return
    }

    // For paid plans, redirect to payment page with plan info
    const selectedPlanData = allPlans.find((plan) => plan.id === selectedPlan)
    if (selectedPlanData) {
      // Store plan data in session storage
      sessionStorage.setItem("selectedPlan", JSON.stringify(selectedPlanData))
      router.push(`/payment/checkout?plan=${selectedPlan}`)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a plan to post more items and access premium features.
          </p>

          {/* Post counter component */}
          <div className="bg-white px-6 pt-4">
  <PostCounter onUpgradeClick={onUpgradeClick} />
</div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {allPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all ${
                selectedPlan === plan.id
                  ? "border-teal-500 border-2 shadow-lg"
                  : "border-gray-200 hover:border-teal-300 "
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
                  <span className="text-3xl font-bold text-gray-900">{plan.price} ETB</span>
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
                  className={`w-full ${
                    selectedPlan === plan.id
                      ? "bg-teal-700 hover:bg-teal-600 text-white"
                      : "text-teal-500 border-teal-500 hover:bg-teal-50"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-lg text-white"
            onClick={handleContinue}
            disabled={!selectedPlan || isProcessing}
          >
            {isProcessing ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}