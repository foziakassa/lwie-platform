import axios, { AxiosError } from "axios"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include user email in headers
apiClient.interceptors.request.use((config) => {
  const userEmail = localStorage.getItem("userEmail") || Cookies.get("customerEmail")
  if (userEmail) {
    config.headers["X-User-Email"] = userEmail
  }
  return config
})

// Get all plans
export const getPlans = async () => {
  try {
    const response = await apiClient.get("/api/plans")
    return response.data
  } catch (error) {
    console.error("Error fetching plans:", error)
    if (error instanceof AxiosError) {
      throw error.response?.data || error
    }
    throw error
  }
}

// Initialize payment
export const initializePayment = async (paymentData: any) => {
  try {
    const response = await apiClient.post("/api/payment/initialize", paymentData)
    return response.data
  } catch (error) {
    console.error("Payment initialization error:", error)
    if (error instanceof AxiosError) {
      throw error.response?.data || error
    }
    throw error
  }
}

// Verify payment
export const verifyPayment = async (txRef: string) => {
  try {
    const response = await apiClient.get(`/api/payment/verify/${txRef}`)
    return response.data
  } catch (error) {
    console.error("Payment verification error:", error)
    if (error instanceof AxiosError) {
      throw error.response?.data || error
    }
    throw error
  }
}

// Get payment receipt
export const getPaymentReceipt = async (txRef: string) => {
  try {
    const response = await apiClient.get(`/api/payment/receipt/${txRef}`)
    return response.data
  } catch (error) {
    console.error("Get receipt error:", error)
    if (error instanceof AxiosError) {
      throw error.response?.data || error
    }
    throw error
  }
}

// Get user's posts status
export const getPostsStatus = async () => {
  try {
    const response = await apiClient.get("/api/user/posts-status")
    return response.data
  } catch (error) {
    console.error("Get posts status error:", error)
    if (error instanceof AxiosError) {
      throw error.response?.data || error
    }
    throw error
  }
}

// Add purchased posts
export const addPurchasedPosts = async (numberOfPosts: number) => {
  try {
    const response = await apiClient.post("/api/user/add-posts", { numberOfPosts })
    return response.data
  } catch (error) {
    console.error("Add posts error:", error)
    if (error instanceof AxiosError) {
      throw error.response?.data || error
    }
    throw error
  }
}

// Create a post
export const createPost = async (postData: any) => {
  try {
    const response = await apiClient.post("/api/user/create-post", postData)
    return response.data
  } catch (error) {
    console.error("Create post error:", error)
    if (error instanceof AxiosError) {
      throw error.response?.data || error
    }
    throw error
  }
}
