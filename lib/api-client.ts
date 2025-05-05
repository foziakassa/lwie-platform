// API client for interacting with the backend

import { getPublishedPosts } from "./post-storage"

// Base URL for API requests
const API_BASE_URL = "/api"

// Function to upload item images
export async function uploadItemImages(images: File[]): Promise<string[]> {
  try {
    // For demo purposes, we'll simulate image uploads
    console.log("Uploading images:", images)

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock image URLs
    return images.map((_, index) => `/placeholder.svg?height=400&width=600&text=Image${index + 1}`)
  } catch (error) {
    console.error("Error uploading images:", error)
    throw new Error("Failed to upload images")
  }
}

// Function to upload service images
export async function uploadServiceImages(files: File[]): Promise<{ success: boolean; urls: string[] }> {
  try {
    // Create FormData to send files
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`images`, file)
    })

    // Send request to API
    const response = await fetch("/api/services/upload-images", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload images")
    }

    const data = await response.json()
    return {
      success: true,
      urls: data.urls,
    }
  } catch (error) {
    console.error("Error uploading service images:", error)
    return {
      success: false,
      urls: [],
    }
  }
}

// Fetch categories
export async function fetchCategories(type: "item" | "service") {
  try {
    // For demo purposes, return mock data
    return {
      success: true,
      categories:
        type === "item"
          ? [
              {
                id: "1",
                name: "Electronics",
                subcategories: [
                  { id: "101", name: "Smartphones" },
                  { id: "102", name: "Laptops" },
                  { id: "103", name: "Tablets" },
                  { id: "104", name: "Cameras" },
                  { id: "105", name: "Audio Devices" },
                ],
              },
              {
                id: "2",
                name: "Home & Garden",
                subcategories: [
                  { id: "201", name: "Furniture" },
                  { id: "202", name: "Appliances" },
                  { id: "203", name: "Kitchen" },
                  { id: "204", name: "Decor" },
                  { id: "205", name: "Garden" },
                ],
              },
              {
                id: "3",
                name: "Vehicles",
                subcategories: [
                  { id: "301", name: "Cars" },
                  { id: "302", name: "Motorcycles" },
                  { id: "303", name: "Bicycles" },
                  { id: "304", name: "Auto Parts" },
                ],
              },
              {
                id: "4",
                name: "Clothing",
                subcategories: [
                  { id: "401", name: "Men's Clothing" },
                  { id: "402", name: "Women's Clothing" },
                  { id: "403", name: "Children's Clothing" },
                  { id: "404", name: "Shoes" },
                  { id: "405", name: "Accessories" },
                ],
              },
            ]
          : [
              {
                id: "1",
                name: "Professional",
                subcategories: [
                  { id: "101", name: "Accounting" },
                  { id: "102", name: "Legal" },
                  { id: "103", name: "Consulting" },
                  { id: "104", name: "Business Services" },
                ],
              },
              {
                id: "2",
                name: "Repair & Maintenance",
                subcategories: [
                  { id: "201", name: "Electronics Repair" },
                  { id: "202", name: "Appliance Repair" },
                  { id: "203", name: "Vehicle Repair" },
                  { id: "204", name: "Home Repair" },
                ],
              },
              {
                id: "3",
                name: "Creative & Design",
                subcategories: [
                  { id: "301", name: "Graphic Design" },
                  { id: "302", name: "Photography" },
                  { id: "303", name: "Video Production" },
                  { id: "304", name: "Art & Crafts" },
                ],
              },
              {
                id: "4",
                name: "Tech & IT",
                subcategories: [
                  { id: "401", name: "Web Development" },
                  { id: "402", name: "App Development" },
                  { id: "403", name: "IT Support" },
                  { id: "404", name: "Digital Marketing" },
                ],
              },
            ],
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}

// Function to fetch items
export async function fetchItems(filters: any = {}) {
  try {
    // For demo mock data that matches the screenshot
    return {
      success: true,
      items: [
        {
          id: "item-1",
          title: "Comfortable Leather Sofa",
          description:
            "Beautiful and comfortable leather sofa in excellent condition. Perfect for your living room or office reception area.",
          price: 20500,
          condition: "Used",
          location: "Addis Ababa",
          category: "Home & Garden",
          subcategory: "Furniture",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=LeatherSofa"],
        },
        {
          id: "item-2",
          title: "V40 Toyota",
          description: "Well maintained Toyota V40 with low mileage. Perfect family car.",
          price: 2300000,
          condition: "Used",
          location: "Addis Ababa",
          category: "Vehicles",
          subcategory: "Cars",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=Toyota"],
        },
        {
          id: "item-3",
          title: "iPhone 13 Pro",
          description: "iPhone 13 Pro in excellent condition. 256GB storage, battery health 95%.",
          price: 55000,
          condition: "Like New",
          location: "Dire Dawa",
          category: "Electronics",
          subcategory: "Smartphones",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=iPhone"],
        },
        {
          id: "item-4",
          title: "Mountain Bike",
          description: "High-quality mountain bike, barely used.",
          price: 14000,
          condition: "Used",
          location: "Hawassa",
          category: "Vehicles",
          subcategory: "Bicycles",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=Bike"],
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching items:", error)
    return { items: [], success: false, error: "Failed to fetch items" }
  }
}

// Function to fetch services
export async function fetchServices(filters: any = {}) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get published posts
    const publishedPosts = getPublishedPosts()

    // Filter for services
    let services = publishedPosts.filter((post: any) => post.type === "service")

    // Apply additional filters if provided
    if (filters.status) {
      services = services.filter((service: any) => service.status === filters.status)
    }

    return { services, success: true }
  } catch (error) {
    console.error("Error fetching services:", error)
    return { services: [], success: false, error: "Failed to fetch services" }
  }
}

// Create item
export async function createItem(itemData: any) {
  try {
    // For demo purposes, simulate API call
    console.log("Creating item:", itemData)

    // Get published posts from local storage
    const publishedPostsJson = localStorage.getItem("published_posts")
    let publishedPosts = []

    if (publishedPostsJson) {
      try {
        publishedPosts = JSON.parse(publishedPostsJson)
      } catch (error) {
        console.error("Error parsing published posts:", error)
      }
    }

    // Add the new item to published posts
    const newItem = {
      id: `item-${Date.now()}`,
      ...itemData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    publishedPosts.push(newItem)

    // Save back to local storage
    localStorage.setItem("published_posts", JSON.stringify(publishedPosts))

    return { success: true, item: newItem }
  } catch (error) {
    console.error("Error creating item:", error)
    return { success: false, error: "Failed to create item" }
  }
}

// Create service
export async function createService(serviceData: any) {
  try {
    // For demo purposes, simulate API call
    console.log("Creating service:", serviceData)

    // Get published posts from local storage
    const publishedPostsJson = localStorage.getItem("published_posts")
    let publishedPosts = []

    if (publishedPostsJson) {
      try {
        publishedPosts = JSON.parse(publishedPostsJson)
      } catch (error) {
        console.error("Error parsing published posts:", error)
      }
    }

    // Add the new service to published posts
    const newService = {
      id: `service-${Date.now()}`,
      ...serviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    publishedPosts.push(newService)

    // Save back to local storage
    localStorage.setItem("published_posts", JSON.stringify(publishedPosts))

    return { success: true, service: newService }
  } catch (error) {
    console.error("Error creating service:", error)
    return { success: false, error: "Failed to create service" }
  }
}

// Get item by ID
export async function fetchItemById(id: string) {
  try {
    // For demo purposes, return specific mock data for the sofa
    if (id === "comfortable-leather-sofa") {
      return {
        success: true,
        item: {
          id: "comfortable-leather-sofa",
          title: "Comfortable Leather Sofa",
          description:
            "Beautiful and comfortable leather sofa in excellent condition. Perfect for your living room or office reception area.",
          price: 10500,
          condition: "Used",
          location: "Addis Ababa",
          category: "Home & Garden",
          subcategory: "Furniture",
          status: "published",
          created_at: "2023-01-15T08:30:00Z",
          details: {
            material: "Genuine leather",
            color: "Brown",
            dimensions: "200cm x 90cm x 85cm",
            seatingCapacity: "3 people",
            age: "2 years",
            reasonForSelling: "Moving abroad",
          },
          images: [
            "/placeholder.svg?height=400&width=600&text=LeatherSofa1",
            "/placeholder.svg?height=400&width=600&text=LeatherSofa2",
            "/placeholder.svg?height=400&width=600&text=LeatherSofa3",
            "/placeholder.svg?height=400&width=600&text=LeatherSofa4",
          ],
          seller: {
            name: "Abebe Kebede",
            memberSince: "January 2022",
            responseTime: "within 2 hours",
            phone: "+251 91 234 5678",
            email: "abebe@example.com",
          },
          similarItems: [
            {
              id: "leather-armchair",
              title: "Leather Armchair",
              price: 4500,
              location: "Addis Ababa",
              condition: "Used",
              imageUrl: "/placeholder.svg?height=150&width=200&text=Armchair",
            },
            {
              id: "coffee-table",
              title: "Coffee Table",
              price: 3200,
              location: "Addis Ababa",
              condition: "Used",
              imageUrl: "/placeholder.svg?height=150&width=200&text=CoffeeTable",
            },
            {
              id: "floor-lamp",
              title: "Floor Lamp",
              price: 1800,
              location: "Addis Ababa",
              condition: "New",
              imageUrl: "/placeholder.svg?height=150&width=200&text=FloorLamp",
            },
          ],
        },
      }
    }

    // For other IDs, check local storage
    const publishedPostsJson = localStorage.getItem("published_posts")
    if (publishedPostsJson) {
      try {
        const publishedPosts = JSON.parse(publishedPostsJson)
        const item = publishedPosts.find((post: any) => post.id === id && post.type === "item")
        if (item) {
          return { success: true, item }
        }
      } catch (error) {
        console.error("Error parsing published posts:", error)
      }
    }

    // If not found, return a default mock item
    return {
      success: false,
      error: "Item not found",
    }
  } catch (error) {
    console.error("Error fetching item:", error)
    return { success: false, error: "Failed to fetch item" }
  }
}

// Get service by ID
export async function fetchServiceById(id: string) {
  try {
    // For demo purposes, return mock data or from local storage
    const publishedPostsJson = localStorage.getItem("published_posts")
    let publishedPosts = []

    if (publishedPostsJson) {
      try {
        publishedPosts = JSON.parse(publishedPostsJson)
        const service = publishedPosts.find((post: any) => post.id === id && post.type === "service")
        if (service) {
          return { success: true, service }
        }
      } catch (error) {
        console.error("Error parsing published posts:", error)
      }
    }

    // If not found in local storage, return mock data
    return {
      success: true,
      service: {
        id,
        title: "Professional Web Development",
        description: "Full-stack web development services",
        hourly_rate: 500,
        location: "Addis Ababa, Bole",
        category_name: "Tech & IT",
        status: "published",
        created_at: new Date().toISOString(),
        images: [{ url: "/placeholder.svg?height=300&width=300&text=WebDev", is_main: true }],
      },
    }
  } catch (error) {
    console.error("Error fetching service:", error)
    return { success: false, error: "Failed to fetch service" }
  }
}
