import { NextResponse } from "next/server"
import { getPlans } from "@/lib/api-service"

export async function GET() {
  try {
    const plans = await getPlans()
    return NextResponse.json({ success: true, plans })
  } catch (error) {
    console.error("Error fetching plans:", error)

    // Return fallback plans if API fails
    const fallbackPlans = [
      {
        id: 1,
        name: "Basic",
        price: "15.00",
        posts_count: 5,
        description: "Perfect for occasional users",
        is_popular: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Standard",
        price: "20.00",
        posts_count: 7,
        description: "Great for regular users",
        is_popular: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Premium",
        price: "30.00",
        posts_count: 15,
        description: "For power users and businesses",
        is_popular: false,
        created_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ success: true, plans: fallbackPlans })
  }
}
