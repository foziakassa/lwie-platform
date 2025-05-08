import type { Post, User } from "./types"

// Base URL for API calls - replace with your actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Mock user ID for development
const MOCK_USER_ID = "123e4567-e89b-12d3-a456-426614174000"

// Fallback data for when fetch fails
const FALLBACK_ITEMS: Post[] = [
  {
    id: "1",
    user_id: MOCK_USER_ID,
    type: "item",
    title: "iPhone 13 Pro",
    description: "Excellent condition, barely used iPhone 13 Pro with 256GB storage.",
    category: "Electronics",
    subcategory: "Smartphones",
    condition: "Like New",
    price: 699,
    brand: "Apple",
    model: "iPhone 13 Pro",
    city: "Addis Ababa",
    subcity: "Bole",
    images: ["/placeholder.svg?height=400&width=400&text=iPhone"],
    contact_info: {
      phone: "555-123-4567",
      email: "user@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: MOCK_USER_ID,
    type: "item",
    title: "Sony PlayStation 5",
    description: "Brand new PS5 console with extra controller.",
    category: "Electronics",
    subcategory: "Gaming",
    condition: "New",
    price: 499,
    brand: "Sony",
    model: "PlayStation 5",
    city: "Addis Ababa",
    subcity: "Kirkos",
    images: ["/placeholder.svg?height=400&width=400&text=PlayStation"],
    contact_info: {
      phone: "555-987-6543",
      email: "gamer@example.com",
      preferred_contact_method: "phone",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const FALLBACK_SERVICES: Post[] = [
  {
    id: "3",
    user_id: MOCK_USER_ID,
    type: "service",
    title: "Professional Photography",
    description: "Professional photography services for events, portraits, and more.",
    category: "Professional",
    service_details: {
      service_type: "Photography",
      availability: ["Weekends", "Evenings"],
    },
    price: 150,
    city: "Addis Ababa",
    subcity: "Bole",
    images: ["/placeholder.svg?height=400&width=400&text=Photography"],
    contact_info: {
      phone: "555-222-3333",
      email: "photo@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Helper function to determine if we're in preview mode
const isPreviewMode = () => {
  // Check for preview environment
  if (typeof window !== "undefined") {
    // Client-side check
    return process.env.NODE_ENV === "development" || window.location.hostname === "localhost"
  }
  return process.env.NODE_ENV === "development" // Server-side check
}

// Get current user ID (in a real app, this would come from authentication)
export const getCurrentUserId = () => {
  return MOCK_USER_ID
}

// Get current user profile
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (isPreviewMode()) {
      return {
        id: MOCK_USER_ID,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        avatar_url: "/placeholder.svg?height=200&width=200&text=John",
        created_at: new Date().toISOString(),
      }
    }

    const response = await fetch(`${API_BASE_URL}/users/current`)
    if (!response.ok) {
      throw new Error("Failed to fetch current user")
    }
    return await response.json()
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    return null
  }
}

// Fetch all published items
export const fetchItems = async (filters?: { category?: string; query?: string; city?: string }) => {
  try {
    // Always use fallback data in preview mode
    if (isPreviewMode()) {
      let filteredItems = [...FALLBACK_ITEMS]

      if (filters?.category && filters.category !== "all") {
        filteredItems = filteredItems.filter((item) => item.category === filters.category)
      }

      if (filters?.city) {
        filteredItems = filteredItems.filter((item) => item.city === filters.city)
      }

      if (filters?.query) {
        const query = filters.query.toLowerCase()
        filteredItems = filteredItems.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query)),
        )
      }

      return filteredItems
    }

    // Build query string
    const queryParams = new URLSearchParams()
    if (filters?.category && filters.category !== "all") {
      queryParams.append("category", filters.category)
    }
    if (filters?.city) {
      queryParams.append("city", filters.city)
    }
    if (filters?.query) {
      queryParams.append("query", filters.query)
    }

    const response = await fetch(`${API_BASE_URL}/items?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error("Failed to fetch items")
    }
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Error fetching items:", error)
    return FALLBACK_ITEMS
  }
}

// Fetch all published services
export const fetchServices = async (filters?: { category?: string; query?: string; city?: string }) => {
  try {
    // Always use fallback data in preview mode
    if (isPreviewMode()) {
      let filteredServices = [...FALLBACK_SERVICES]

      if (filters?.category && filters.category !== "all") {
        filteredServices = filteredServices.filter((service) => service.category === filters.category)
      }

      if (filters?.city) {
        filteredServices = filteredServices.filter((service) => service.city === filters.city)
      }

      if (filters?.query) {
        const query = filters.query.toLowerCase()
        filteredServices = filteredServices.filter(
          (service) =>
            service.title.toLowerCase().includes(query) ||
            (service.description && service.description.toLowerCase().includes(query)),
        )
      }

      return filteredServices
    }

    // Build query string
    const queryParams = new URLSearchParams()
    if (filters?.category && filters.category !== "all") {
      queryParams.append("category", filters.category)
    }
    if (filters?.city) {
      queryParams.append("city", filters.city)
    }
    if (filters?.query) {
      queryParams.append("query", filters.query)
    }

    const response = await fetch(`${API_BASE_URL}/services?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error("Failed to fetch services")
    }
    const data = await response.json()
    return data.services || []
  } catch (error) {
    console.error("Error fetching services:", error)
    return FALLBACK_SERVICES
  }
}

// Fetch a specific item by ID
export const fetchItemById = async (id: string) => {
  try {
    // For preview environment, return a mock item if the ID matches
    if (isPreviewMode()) {
      const mockItem = FALLBACK_ITEMS.find((item) => item.id === id)
      if (mockItem) return mockItem
      return FALLBACK_ITEMS[0]
    }

    const response = await fetch(`${API_BASE_URL}/items/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch item")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching item:", error)
    return FALLBACK_ITEMS[0]
  }
}

// Fetch a specific service by ID
export const fetchServiceById = async (id: string) => {
  try {
    // For preview environment, return a mock service if the ID matches
    if (isPreviewMode()) {
      const mockService = FALLBACK_SERVICES.find((service) => service.id === id)
      if (mockService) return mockService
      return FALLBACK_SERVICES[0]
    }

    const response = await fetch(`${API_BASE_URL}/services/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch service")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching service:", error)
    return FALLBACK_SERVICES[0]
  }
}

// Upload item images
export const uploadItemImages = async (files: File[]) => {
  try {
    // For preview environment, return mock image URLs
    if (isPreviewMode()) {
      return files.map((_, index) => `/placeholder.svg?height=400&width=400&text=Image${index + 1}`)
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append("images", file)
    })

    const response = await fetch(`${API_BASE_URL}/items/upload-images`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload images")
    }

    const data = await response.json()
    return data.imageUrls
  } catch (error) {
    console.error("Error uploading images:", error)
    return files.map((_, index) => `/placeholder.svg?height=400&width=400&text=Image${index + 1}`)
  }
}

// Upload service images
export const uploadServiceImages = async (files: File[]) => {
  try {
    // For preview environment, return mock image URLs
    if (isPreviewMode()) {
      return files.map((_, index) => `/placeholder.svg?height=400&width=400&text=ServiceImage${index + 1}`)
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append("images", file)
    })

    const response = await fetch(`${API_BASE_URL}/services/upload-images`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload images")
    }

    const data = await response.json()
    return data.imageUrls
  } catch (error) {
    console.error("Error uploading images:", error)
    return files.map((_, index) => `/placeholder.svg?height=400&width=400&text=ServiceImage${index + 1}`)
  }
}

// Create a new item post
export const createItem = async (itemData: Partial<Post>) => {
  try {
    // For preview environment, return a mock item
    if (isPreviewMode()) {
      const newItem: Post = {
        id: `item-${Date.now()}`,
        user_id: getCurrentUserId(),
        type: "item",
        title: itemData.title || "New Item",
        description: itemData.description || "",
        category: itemData.category || "",
        subcategory: itemData.subcategory || "",
        condition: itemData.condition || "",
        price: itemData.price || null,
        brand: itemData.brand || "",
        model: itemData.model || "",
        additional_details: itemData.additional_details || "",
        city: itemData.city || "",
        subcity: itemData.subcity || "",
        location: itemData.location || "",
        images: itemData.images || [],
        trade_preferences: itemData.trade_preferences || {},
        contact_info: itemData.contact_info || {},
        status: "published",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Add to mock items
      FALLBACK_ITEMS.unshift(newItem)
      return newItem
    }

    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    })

    if (!response.ok) {
      throw new Error("Failed to create item")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating item:", error)
    return null
  }
}

// Create a new service post
export const createService = async (serviceData: Partial<Post>) => {
  try {
    // For preview environment, return a mock service
    if (isPreviewMode()) {
      const newService: Post = {
        id: `service-${Date.now()}`,
        user_id: getCurrentUserId(),
        type: "service",
        title: serviceData.title || "New Service",
        description: serviceData.description || "",
        category: serviceData.category || "",
        price: serviceData.price || null,
        city: serviceData.city || "",
        subcity: serviceData.subcity || "",
        location: serviceData.location || "",
        images: serviceData.images || [],
        service_details: serviceData.service_details || {},
        contact_info: serviceData.contact_info || {},
        status: "published",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Add to mock services
      FALLBACK_SERVICES.unshift(newService)
      return newService
    }

    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      throw new Error("Failed to create service")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating service:", error)
    return null
  }
}

// Create a swap request
export const createSwapRequest = async (
  postId: string,
  message: string,
  contactInfo: { phone?: string; email?: string },
) => {
  try {
    // For preview environment, return a mock swap request
    if (isPreviewMode()) {
      return {
        id: `request-${Date.now()}`,
        post_id: postId,
        requester_id: getCurrentUserId(),
        message,
        contact_info: contactInfo,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    const response = await fetch(`${API_BASE_URL}/swap-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: postId,
        message,
        contact_info: contactInfo,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create swap request")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating swap request:", error)
    return null
  }
}

// Get notifications for current user
export const getNotifications = async () => {
  try {
    // For preview environment, return mock notifications
    if (isPreviewMode()) {
      return [
        {
          id: "1",
          user_id: getCurrentUserId(),
          type: "swap_request",
          title: "New Swap Request",
          message: "You have a new swap request for your iPhone 13 Pro",
          related_id: "1",
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          user_id: getCurrentUserId(),
          type: "swap_request_update",
          title: "Swap Request Accepted",
          message: "Your swap request for PlayStation 5 has been accepted",
          related_id: "2",
          is_read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ]
    }

    const response = await fetch(`${API_BASE_URL}/notifications`)
    if (!response.ok) {
      throw new Error("Failed to fetch notifications")
    }
    const data = await response.json()
    return data.notifications || []
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    // For preview environment, just return success
    if (isPreviewMode()) {
      return { success: true }
    }

    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: "PUT",
    })

    if (!response.ok) {
      throw new Error("Failed to mark notification as read")
    }

    return await response.json()
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false }
  }
}

// Toggle like/save a post
export const toggleSavePost = async (postId: string) => {
  try {
    // For preview environment, just return success
    if (isPreviewMode()) {
      return { success: true, saved: true }
    }

    const response = await fetch(`${API_BASE_URL}/saved-posts/${postId}/toggle`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to toggle save post")
    }

    return await response.json()
  } catch (error) {
    console.error("Error toggling save post:", error)
    return { success: false }
  }
}

// Check if a post is saved by the current user
export const isPostSaved = async (postId: string) => {
  try {
    // For preview environment, return false
    if (isPreviewMode()) {
      return false
    }

    const response = await fetch(`${API_BASE_URL}/saved-posts/${postId}/check`)
    if (!response.ok) {
      throw new Error("Failed to check if post is saved")
    }
    const data = await response.json()
    return data.isSaved || false
  } catch (error) {
    console.error("Error checking if post is saved:", error)
    return false
  }
}
