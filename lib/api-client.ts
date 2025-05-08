import type { Post, Notification, SwapRequest, User } from "./types"

// Mock data for items
const mockItems: Post[] = [
  {
    id: "comfortable-leather-sofa",
    user_id: "user123",
    type: "item",
    title: "Comfortable Leather Sofa",
    description: "A beautiful and comfortable leather sofa in excellent condition. Perfect for any living room.",
    price: 20500,
    condition: "Used",
    category: "Furniture",
    city: "Addis Ababa",
    subcity: null,
    images: ["/brown-leather-sofa.png"],
    contact_info: {
      phone: "555-123-4567",
      email: "user@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: "Ashley",
    model: "Signature Design",
  },
  {
    id: "1",
    user_id: "user123",
    type: "item",
    title: "Comfortable Leather Sofa",
    description: "A beautiful and comfortable leather sofa in excellent condition. Perfect for any living room.",
    price: 20500,
    condition: "Used",
    category: "Furniture",
    city: "Addis Ababa",
    subcity: null,
    images: ["/brown-leather-sofa.png"],
    contact_info: {
      phone: "555-123-4567",
      email: "user@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: "Ashley",
    model: "Signature Design",
  },
  {
    id: "2",
    user_id: "user456",
    type: "item",
    title: "Toyota SUV",
    description: "2018 Toyota SUV in excellent condition with low mileage. Well maintained and serviced regularly.",
    price: 2300000,
    condition: "Used",
    category: "Vehicles",
    city: "Addis Ababa",
    subcity: null,
    images: ["/white-toyota-suv.png"],
    contact_info: {
      phone: "555-987-6543",
      email: "sarah@example.com",
      preferred_contact_method: "phone",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: "Toyota",
    model: "RAV4",
  },
  {
    id: "3",
    user_id: "user789",
    type: "item",
    title: "iPhone 13 Pro",
    description: "iPhone 13 Pro in like new condition. Comes with original box and accessories.",
    price: 55000,
    condition: "Like New",
    category: "Electronics",
    city: "Dire Dawa",
    subcity: null,
    images: ["/iphone-13-pro.png"],
    contact_info: {
      phone: "555-555-5555",
      email: "michael@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: "Apple",
    model: "iPhone 13 Pro",
  },
  {
    id: "4",
    user_id: "user101",
    type: "item",
    title: "Mountain Bike",
    description: "High-quality mountain bike in good condition. Perfect for off-road adventures.",
    price: 14000,
    condition: "Used",
    category: "Sports",
    city: "Hawassa",
    subcity: null,
    images: ["/mountain-bike-trail.png"],
    contact_info: {
      phone: "555-111-2222",
      email: "emily@example.com",
      preferred_contact_method: "phone",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: "Trek",
    model: "X-Caliber",
  },
  {
    id: "leather-armchair",
    user_id: "user123",
    type: "item",
    title: "Leather Armchair",
    description: "Comfortable leather armchair in excellent condition.",
    price: 4500,
    condition: "Used",
    category: "Furniture",
    city: "Addis Ababa",
    subcity: null,
    images: ["/placeholder.svg?height=200&width=200&text=Leather+Armchair"],
    contact_info: {
      phone: "555-123-4567",
      email: "user@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: "Ashley",
    model: "Signature Design",
  },
  {
    id: "coffee-table",
    user_id: "user123",
    type: "item",
    title: "Coffee Table",
    description: "Elegant coffee table for your living room.",
    price: 3200,
    condition: "Used",
    category: "Furniture",
    city: "Addis Ababa",
    subcity: null,
    images: ["/placeholder.svg?height=200&width=200&text=Coffee+Table"],
    contact_info: {
      phone: "555-123-4567",
      email: "user@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: "IKEA",
    model: "LACK",
  },
  {
    id: "floor-lamp",
    user_id: "user123",
    type: "item",
    title: "Floor Lamp",
    description: "Modern floor lamp with adjustable brightness.",
    price: 1800,
    condition: "New",
    category: "Furniture",
    city: "Addis Ababa",
    subcity: null,
    images: ["/placeholder.svg?height=200&width=200&text=Floor+Lamp"],
    contact_info: {
      phone: "555-123-4567",
      email: "user@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand: "Philips",
    model: "Hue",
  },
]

// Mock data for services
const mockServices: Post[] = [
  {
    id: "5",
    user_id: "user123",
    type: "service",
    title: "Professional Photography",
    description: "Professional photography services for events, portraits, and product photography.",
    price: 5000,
    condition: null,
    category: "Professional",
    subcategory: "Photography",
    city: "Addis Ababa",
    subcity: "Bole",
    images: ["/professional-camera.png"],
    service_details: {
      service_type: "Photography",
      availability: ["Weekends", "Evenings"],
      duration: "2-4 hours",
    },
    contact_info: {
      phone: "555-222-3333",
      email: "david@example.com",
      preferred_contact_method: "email",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    user_id: "user456",
    type: "service",
    title: "Home Cleaning Service",
    description: "Professional home cleaning service. We provide all cleaning supplies and equipment.",
    price: 1500,
    condition: null,
    category: "Home",
    subcategory: "Cleaning",
    city: "Addis Ababa",
    subcity: "Kirkos",
    images: ["/assorted-cleaning-supplies.png"],
    service_details: {
      service_type: "Cleaning",
      availability: ["Weekdays", "Weekends"],
      duration: "3-5 hours",
    },
    contact_info: {
      phone: "555-444-5555",
      email: "lisa@example.com",
      preferred_contact_method: "phone",
    },
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "user123",
    type: "swap_request",
    title: "New swap request",
    message: "John wants to swap his iPhone for your laptop",
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user123",
    type: "swap_accepted",
    title: "Swap accepted",
    message: "Sarah accepted your swap request for the mountain bike",
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    user_id: "user123",
    type: "new_message",
    title: "New message",
    message: "You have a new message from David about your camera",
    is_read: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

// Saved items
const savedItems = new Set<string>()

// Mock user data
const MOCK_USER: User = {
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  avatar_url: "",
  created_at: new Date().toISOString(),
}

// Helper function to simulate API delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get current user
export async function getCurrentUser(): Promise<User> {
  // Simulate API delay
  await sleep(500)
  return MOCK_USER
}

// Get current user ID
export function getCurrentUserId(): string {
  return MOCK_USER.id
}

// Fetch items with optional filtering
export async function fetchItems({
  query,
  category,
  city,
  limit,
}: {
  query?: string
  category?: string
  city?: string
  limit?: number
} = {}): Promise<Post[]> {
  // Simulate API delay
  await sleep(500)

  let filteredItems = [...mockItems]

  if (query) {
    const lowerQuery = query.toLowerCase()
    filteredItems = filteredItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery)),
    )
  }

  if (category && category !== "All") {
    filteredItems = filteredItems.filter((item) => item.category === category)
  }

  if (city) {
    filteredItems = filteredItems.filter((item) => item.city === city)
  }

  if (limit) {
    filteredItems = filteredItems.slice(0, limit)
  }

  return filteredItems
}

// Fetch services with optional filtering
export async function fetchServices({
  query,
  category,
  city,
}: {
  query?: string
  category?: string
  city?: string
} = {}): Promise<Post[]> {
  // Simulate API delay
  await sleep(500)

  let filteredServices = [...mockServices]

  if (query) {
    const lowerQuery = query.toLowerCase()
    filteredServices = filteredServices.filter(
      (service) =>
        service.title.toLowerCase().includes(lowerQuery) ||
        (service.description && service.description.toLowerCase().includes(lowerQuery)),
    )
  }

  if (category && category !== "All" && category !== "Services") {
    filteredServices = filteredServices.filter((service) => service.category === category)
  }

  if (city) {
    filteredServices = filteredServices.filter((service) => service.city === city)
  }

  return filteredServices
}

// Fetch a specific item by ID
export async function fetchItemById(id: string): Promise<Post> {
  // Simulate API delay
  await sleep(500)

  const item = mockItems.find((item) => item.id === id)

  if (!item) {
    throw new Error(`Item with ID ${id} not found`)
  }

  return item
}

// Fetch a specific service by ID
export async function fetchServiceById(id: string): Promise<Post> {
  // Simulate API delay
  await sleep(500)

  const service = mockServices.find((service) => service.id === id)

  if (!service) {
    throw new Error(`Service with ID ${id} not found`)
  }

  return service
}

// Check if an item is saved
export async function isPostSaved(id: string): Promise<boolean> {
  // Simulate API delay
  await sleep(200)

  return savedItems.has(id)
}

// Toggle save status for an item
export async function toggleSavePost(id: string): Promise<{ saved: boolean }> {
  // Simulate API delay
  await sleep(300)

  if (savedItems.has(id)) {
    savedItems.delete(id)
    return { saved: false }
  } else {
    savedItems.add(id)
    return { saved: true }
  }
}

// Get notifications
export async function getNotifications(): Promise<Notification[]> {
  // Simulate API delay
  await sleep(300)

  return mockNotifications
}

// Submit a swap request
export async function submitSwapRequest(data: {
  itemId: string
  swapType: "item" | "money"
  itemToSwap: string
  itemDescription: string
  itemValue: number
  message: string
  images?: string[]
  contact_info?: {
    phone?: string
    email?: string
  }
}): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would send the data to the server
    console.log("Swap request submitted:", data)

    // Create a notification for the item owner
    const targetItem = mockItems.find((item) => item.id === data.itemId)
    if (!targetItem) {
      return {
        success: false,
        message: "Item not found",
      }
    }

    // Add notification to the mock notifications
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      user_id: targetItem.user_id,
      type: "swap_request",
      title: "New swap request",
      message: `Someone wants to ${data.swapType === "item" ? "swap their " + data.itemToSwap : "offer ETB " + data.itemValue} for your ${targetItem.title}`,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    mockNotifications.unshift(newNotification)

    return {
      success: true,
      message: "Swap request submitted successfully",
    }
  } catch (error) {
    console.error("Error submitting swap request:", error)
    return {
      success: false,
      message: "An error occurred while submitting your request",
    }
  }
}

// Get user listings
export async function getUserListings(type: "item" | "service"): Promise<Post[]> {
  // Simulate API delay
  await sleep(500)

  if (type === "item") {
    return mockItems.filter((item) => item.user_id === MOCK_USER.id)
  } else {
    return mockServices.filter((service) => service.user_id === MOCK_USER.id)
  }
}

// Get received swap requests
export async function getReceivedSwapRequests(): Promise<SwapRequest[]> {
  // Simulate API delay
  await sleep(500)

  // Return mock swap requests
  return [
    {
      id: "1",
      post_id: "1",
      requester_id: "user456",
      message: "I'm interested in swapping my iPhone for your sofa.",
      contact_info: {
        phone: "123-456-7890",
        email: "user@example.com",
      },
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      post: mockItems[0],
      users: {
        id: "user456",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar_url: "",
        created_at: new Date().toISOString(),
      },
    },
  ]
}

  // Get user swap requests
  export async function getUserSwapRequests(): Promise<SwapRequest[]> {
    // Simulate API delay
    await sleep(500)

    // Return mock swap requests
    return [
      {
        id: "2",
        post_id: "3",
        requester_id: MOCK_USER.id,
        message: "I'd like to swap my laptop for your iPhone.",
        contact_info: {
          phone: "987-654-3210",
          email: "current@example.com",
        },
        status: "accepted",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }

// Update swap request status
export async function updateSwapRequestStatus(requestId: string, status: "accepted" | "rejected"): Promise<boolean> {
  // Simulate API delay
  await sleep(500)

  console.log(`Updating request ${requestId} to ${status}`)
  return true
}

// Upload item images
export async function uploadItemImages(files: File[]): Promise<string[]> {
  await sleep(500)
  return files.map((_, index) => `item-${index}`)
}

// Upload service images
export async function uploadServiceImages(files: File[]): Promise<string[]> {
  await sleep(500)
  return files.map((_, index) => `service-${index}`)
}

// Create a new item
export async function createItem(itemData: Partial<Post>): Promise<Post> {
  await sleep(500)

  const newItem: Post = {
    id: `item-${Date.now()}`,
    user_id: MOCK_USER.id,
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
  mockItems.unshift(newItem)
  return newItem
}

// Create a new service
export async function createService(serviceData: Partial<Post>): Promise<Post> {
  await sleep(500)

  const newService: Post = {
    id: `service-${Date.now()}`,
    user_id: MOCK_USER.id,
    type: "service",
    title: serviceData.title || "New Service",
    description: serviceData.description || "",
    category: serviceData.category || "",
    subcategory: serviceData.subcategory || "",
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
  mockServices.unshift(newService)
  return newService
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<{ success: boolean }> {
  // Simulate API delay
  await sleep(500)

  const notification = mockNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.is_read = true
    return { success: true }
  } else {
    return { success: false }
  }
}
