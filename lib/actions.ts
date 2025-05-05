"use server"
import { getUserPostsStatus, createPost as apiCreatePost } from "./api-service"
import { cookies } from "next/headers"

interface PaymentParams {
  amount: number
  planName: string
  currency: string
  customerName?: string
  customerEmail?: string
  numberOfPosts?: number
}

interface PaymentResult {
  success: boolean
  redirectUrl?: string
  message?: string
  transactionId?: string
}

interface PostsStatusResult {
  remainingFreePosts: number
  remainingPaidPosts: number
  totalPaidPosts: number
  usedPaidPosts: number
  totalFreePosts: number
}

// This function is a wrapper around the API service to check posts status
export async function checkPostsStatus() {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get("customerEmail")?.value

  try {
    return await getUserPostsStatus(userEmail)
  } catch (error) {
    console.error("Error checking posts status:", error)

    // Fallback to cookie-based implementation if API fails
    const usedFreePostsStr = cookieStore.get("used_free_posts")?.value || "0"
    const usedFreePosts = Number.parseInt(usedFreePostsStr, 10)
    const totalFreePosts = 3
    const remainingFreePosts = Math.max(0, totalFreePosts - usedFreePosts)

    const totalPaidPostsStr = cookieStore.get("total_paid_posts")?.value || "0"
    const usedPaidPostsStr = cookieStore.get("used_paid_posts")?.value || "0"

    const totalPaidPosts = Number.parseInt(totalPaidPostsStr, 10)
    const usedPaidPosts = Number.parseInt(usedPaidPostsStr, 10)
    const remainingPaidPosts = Math.max(0, totalPaidPosts - usedPaidPosts)

    return {
      remainingFreePosts,
      remainingPaidPosts,
      totalPaidPosts,
      usedPaidPosts,
      totalFreePosts,
    }
  }
}

// This function is a wrapper around the API service to create a post
export async function createPost(data: {
  title: string
  content: string
}) {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get("customerEmail")?.value

  if (!userEmail) {
    throw new Error("User email not found. Please log in.")
  }

  try {
    return await apiCreatePost(userEmail, data)
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

// This function is a wrapper around the API service to add purchased posts
export async function addPurchasedPosts(numberOfPosts: number) {
  // This is now handled by the API when verifying payment
  // This function remains for backward compatibility
  return await checkPostsStatus()
}

// This function is a wrapper around the API service to process payment
export async function processPayment(params: {
  amount: number
  planName: string
  currency: string
  customerName?: string
  customerEmail?: string
  numberOfPosts?: number
}) {
  const cookieStore = await cookies()

  // Store customer info in cookies for easier access later
  if (params.customerName) {
    cookieStore.set("customerName", params.customerName, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
  }

  if (params.customerEmail) {
    cookieStore.set("customerEmail", params.customerEmail, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
  }

  // The actual payment processing is now handled by the API service
  // This function now just forwards to the API service
  try {
    const response = await fetch("https://liwedoc.vercel.app/api/payment/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail: params.customerEmail,
        customerName: params.customerName,
        planId: params.planName === "Basic" ? 1 : params.planName === "Standard" ? 2 : 3,
        currency: params.currency,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to initialize payment")
    }

    const data = await response.json()
    return {
      success: data.success,
      redirectUrl: data.redirectUrl,
      transactionId: data.transactionId,
      message: data.message,
    }
  } catch (error) {
    console.error("Payment processing error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function checkRemainingPosts(): Promise<{ remainingPosts: number; totalUsed: number }> {
  const status = await checkPostsStatus()
  return {
    remainingPosts: status.remainingFreePosts,
    totalUsed: status.totalFreePosts - status.remainingFreePosts,
  }
}

export async function checkUserFreeStatus(): Promise<{ hasUsedFreeTier: boolean }> {
  const status = await checkPostsStatus()
  return { hasUsedFreeTier: status.remainingFreePosts < status.totalFreePosts }
}
