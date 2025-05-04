"use server"

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

// This function checks how many posts the user has remaining (both free and paid)
export async function checkPostsStatus(): Promise<PostsStatusResult> {
  const cookieStore = await cookies()

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

export async function createPost(data: {
  category: string
  subcategory: string
  title: string
  description: string
  condition: "new" | "like-new" | "good" | "fair" | "poor"
  location: string
  images: string[]
  preferredSwaps?: string | undefined
}): Promise<PostsStatusResult> {
  const cookieStore = await cookies()
  const status = await checkPostsStatus()

  if (status.remainingPaidPosts > 0) {
    const newUsedPaidPosts = status.usedPaidPosts + 1
    cookieStore.set("used_paid_posts", newUsedPaidPosts.toString(), {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    })
    return {
      ...status,
      remainingPaidPosts: status.remainingPaidPosts - 1,
      usedPaidPosts: newUsedPaidPosts,
    }
  } else if (status.remainingFreePosts > 0) {
    const usedFreePostsStr = cookieStore.get("used_free_posts")?.value || "0"
    const usedFreePosts = Number.parseInt(usedFreePostsStr, 10)
    const newUsedFreePosts = usedFreePosts + 1

    cookieStore.set("used_free_posts", newUsedFreePosts.toString(), {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    })

    return {
      ...status,
      remainingFreePosts: status.remainingFreePosts - 1,
    }
  }
  return status
}

export async function addPurchasedPosts(numberOfPosts: number): Promise<PostsStatusResult> {
  const cookieStore = await cookies()
  const totalPaidPostsStr = cookieStore.get("total_paid_posts")?.value || "0"
  const totalPaidPosts = Number.parseInt(totalPaidPostsStr, 10)
  const newTotalPaidPosts = totalPaidPosts + numberOfPosts

  cookieStore.set("total_paid_posts", newTotalPaidPosts.toString(), {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  })

  const status = await checkPostsStatus()
  return status
}

// Payment processing function
export async function processPayment(params: PaymentParams): Promise<PaymentResult> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")?.value
    let customerName = params.customerName
    let customerEmail = params.customerEmail
    let phone = "0900000000"

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie)
        if (!customerName && userData.firstName) {
          customerName = userData.firstName

          // Store the firstName from auth token in customerName cookie
          cookieStore.set("customerName", userData.firstName, {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
          })
        }
        if (!customerEmail && userData.email) {
          customerEmail = userData.email

          // Store the email from auth token in customerEmail cookie
          cookieStore.set("customerEmail", userData.email, {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
          })
        }
        if (userData.phone) {
          phone = userData.phone
        }
      } catch (err) {
        console.warn("Failed to parse user cookie:", err)
      }
    }

    // Validate the email format before proceeding
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(customerEmail || "")) {
      throw new Error("Invalid email format")
    }

    const totalAmount = params.amount
    const chapaSecretKey = "CHASECK_TEST-VZgrmu0vKJKLqdlI1o98q4RFoR4a4mCr"

    if (!chapaSecretKey) {
      throw new Error("Chapa API key not configured")
    }

    const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random() * 1000000)}`

    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chapaSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalAmount.toString(),
        currency: params.currency,
        tx_ref: tx_ref,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payment/callback`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
        first_name: customerName?.split(" ")[0] || "Customer",
        last_name: customerName?.split(" ").slice(1).join(" ") || "",
        email: customerEmail || "customer@example.com",
        title: `Payment for ${params.planName} Plan (${params.numberOfPosts} Posts)`,
        description: `Purchase of ${params.planName} Plan with ${params.numberOfPosts} posts for ${totalAmount} ETB`,
        phone_number: phone,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Chapa API error:", errorData)

      if (errorData?.message?.email) {
        throw new Error(`Email validation failed: ${errorData.message.email.join(", ")}`)
      }

      const errorMessage = errorData?.message || "Failed to initialize payment"
      throw new Error(errorMessage)
    }

    const data = await response.json()

    return {
      success: true,
      redirectUrl: data.data.checkout_url,
      transactionId: tx_ref,
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
