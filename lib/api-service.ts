// API service to handle all API calls
const API_BASE_URL = "https://liwedoc.vercel.app/api"

export interface Plan {
  id: number
  name: string
  price: string
  posts_count: number
  description: string
  is_popular: boolean
  created_at: string
}

export interface PostsStatus {
  remainingFreePosts: number
  remainingPaidPosts: number
  totalPaidPosts: number
  usedPaidPosts: number
  totalFreePosts: number
}

export interface PaymentInitResult {
  success: boolean
  redirectUrl: string
  transactionId: string
}

export interface Receipt {
  transactionId: string
  date: string
  customerName: string
  customerEmail: string
  plan: string
  postsCount: number
  price: string
  currency: string
  status: string
}

// Get all available plans
export async function getPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/plans`)
    if (!response.ok) {
      throw new Error("Failed to fetch plans")
    }
    const data = await response.json()
    return data.success ? data.plans : []
  } catch (error) {
    console.error("Error fetching plans:", error)
    return []
  }
}

// Initialize payment
export async function initializePayment(params: {
  customerEmail: string
  customerName: string
  planId: number
  currency: string
}): Promise<PaymentInitResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error("Failed to initialize payment")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error initializing payment:", error)
    throw error
  }
}

// Verify payment
export async function verifyPayment(txRef: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify/${txRef}`)
    if (!response.ok) {
      throw new Error("Failed to verify payment")
    }
    return await response.json()
  } catch (error) {
    console.error("Error verifying payment:", error)
    throw error
  }
}

// Get user's posts status
export async function getUserPostsStatus(userEmail?: string): Promise<PostsStatus> {
  try {
    const headers: HeadersInit = {}
    if (userEmail) {
      headers["x-user-email"] = userEmail
    }

    const response = await fetch(`${API_BASE_URL}/user/posts-status`, {
      headers,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch posts status")
    }

    const data = await response.json()
    return data.success
      ? data
      : {
          remainingFreePosts: 0,
          remainingPaidPosts: 0,
          totalPaidPosts: 0,
          usedPaidPosts: 0,
          totalFreePosts: 3,
        }
  } catch (error) {
    console.error("Error fetching posts status:", error)
    return {
      remainingFreePosts: 0,
      remainingPaidPosts: 0,
      totalPaidPosts: 0,
      usedPaidPosts: 0,
      totalFreePosts: 3,
    }
  }
}

// Create a post
export async function createPost(userEmail: string, postData: { title: string; content: string }): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/create-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-email": userEmail,
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      throw new Error("Failed to create post")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

// Get payment receipt
export async function getPaymentReceipt(txRef: string, userEmail?: string): Promise<Receipt | null> {
  try {
    const headers: HeadersInit = {}
    if (userEmail) {
      headers["x-user-email"] = userEmail
    }

    const response = await fetch(`${API_BASE_URL}/payment/receipt/${txRef}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch receipt")
    }

    const data = await response.json()
    return data.success ? data.receipt : null
  } catch (error) {
    console.error("Error fetching receipt:", error)
    return null
  }
}
