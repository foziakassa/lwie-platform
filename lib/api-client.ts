// API client for interacting with the backend

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API || "/api"

// Types
export interface Item {
  id: string
  title: string
  description?: string
  price: number
  condition: string
  location: string
  category: string
  subcategory?: string
  images: string[]
  status: string
  created_at: string
  user_id?: string
}

export interface Service {
  id: string
  title: string
  description?: string
  category: string
  subcategory?: string
  experience: string
  location: string
  images: string[]
  status: string
  created_at: string
  user_id?: string
}

// Function to upload item images
export async function uploadItemImages(images: File[]): Promise<string[]> {
  try {
    // For demo purposes, we'll simulate image uploads
    console.log("Uploading images:", images)

    // In a real app, you would upload to a server
    // const formData = new FormData();
    // images.forEach((image, index) => {
    //   formData.append(`image${index}`, image);
    // });
    // const response = await fetch(`${API_BASE_URL}/items/upload`, {
    //   method: "POST",
    //   body: formData,
    // });
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // const data = await response.json();
    // return data.urls;

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock image URLs or create object URLs for preview
    return images.map((image) => URL.createObjectURL(image))
  } catch (error) {
    console.error("Error uploading images:", error)
    throw new Error("Failed to upload images")
  }
}

// Function to upload service images
export async function uploadServiceImages(files: File[]): Promise<string[]> {
  try {
    // This is a mock implementation - in a real app, you would upload to your backend
    // For now, we'll simulate a successful upload with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create object URLs for the files (in a real app, these would be URLs from your server)
    const urls = files.map((file) => URL.createObjectURL(file))

    return urls
  } catch (error) {
    console.error("Error uploading service images:", error)
    throw new Error("Failed to upload service images")
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
                id: "electronics",
                name: "Electronics",
                subcategories: [
                  { id: "smartphones", name: "Smartphones" },
                  { id: "laptops", name: "Laptops" },
                  { id: "tablets", name: "Tablets" },
                  { id: "cameras", name: "Cameras" },
                  { id: "audio", name: "Audio Devices" },
                ],
              },
              {
                id: "home",
                name: "Home & Garden",
                subcategories: [
                  { id: "furniture", name: "Furniture" },
                  { id: "appliances", name: "Appliances" },
                  { id: "kitchen", name: "Kitchen" },
                  { id: "decor", name: "Decor" },
                  { id: "garden", name: "Garden" },
                ],
              },
              {
                id: "vehicles",
                name: "Vehicles",
                subcategories: [
                  { id: "cars", name: "Cars" },
                  { id: "motorcycles", name: "Motorcycles" },
                  { id: "bicycles", name: "Bicycles" },
                  { id: "parts", name: "Auto Parts" },
                ],
              },
              {
                id: "clothing",
                name: "Clothing",
                subcategories: [
                  { id: "men", name: "Men's Clothing" },
                  { id: "women", name: "Women's Clothing" },
                  { id: "children", name: "Children's Clothing" },
                  { id: "shoes", name: "Shoes" },
                  { id: "accessories", name: "Accessories" },
                ],
              },
            ]
          : [
              {
                id: "professional",
                name: "Professional",
                subcategories: [
                  { id: "accounting", name: "Accounting" },
                  { id: "legal", name: "Legal" },
                  { id: "consulting", name: "Consulting" },
                  { id: "business", name: "Business Services" },
                ],
              },
              {
                id: "repair",
                name: "Repair & Maintenance",
                subcategories: [
                  { id: "electronics", name: "Electronics Repair" },
                  { id: "appliances", name: "Appliance Repair" },
                  { id: "vehicles", name: "Vehicle Repair" },
                  { id: "home", name: "Home Repair" },
                ],
              },
              {
                id: "creative",
                name: "Creative & Design",
                subcategories: [
                  { id: "graphic", name: "Graphic Design" },
                  { id: "photography", name: "Photography" },
                  { id: "video", name: "Video Production" },
                  { id: "art", name: "Art & Crafts" },
                ],
              },
              {
                id: "tech",
                name: "Tech & IT",
                subcategories: [
                  { id: "web", name: "Web Development" },
                  { id: "app", name: "App Development" },
                  { id: "support", name: "IT Support" },
                  { id: "marketing", name: "Digital Marketing" },
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
    // In a real app, you would fetch from your API
    // const queryParams = new URLSearchParams();
    // if (filters.status) queryParams.append("status", filters.status);
    // if (filters.limit) queryParams.append("limit", filters.limit.toString());
    // if (filters.category) queryParams.append("category", filters.category);
    // if (filters.location) queryParams.append("location", filters.location);
    // const response = await fetch(`${API_BASE_URL}/items?${queryParams}`);
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // const data = await response.json();
    // return data;

    // For demo purposes, get items from localStorage
    const storedItems = localStorage.getItem("published_posts")
    let items = []

    if (storedItems) {
      const parsedItems = JSON.parse(storedItems)
      items = parsedItems.filter((item: any) => item.type === "item")

      // Apply filters if provided
      if (filters.category) {
        items = items.filter((item: any) => item.category === filters.category)
      }

      if (filters.location) {
        items = items.filter(
          (item: any) => item.city?.includes(filters.location) || item.subcity?.includes(filters.location),
        )
      }
    }

    // Add some mock items if there are none
    if (items.length === 0) {
      items = [
        {
          id: "item-1",
          type: "item",
          title: "Comfortable Leather Sofa",
          description: "Beautiful and comfortable leather sofa in excellent condition.",
          price: 20500,
          condition: "Used",
          city: "Addis Ababa",
          subcity: "Bole",
          location: "Addis Ababa, Bole",
          category: "home",
          subcategory: "furniture",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=LeatherSofa"],
        },
        {
          id: "item-2",
          type: "item",
          title: "V40 Toyota",
          description: "Well maintained Toyota V40 with low mileage. Perfect family car.",
          price: 2300000,
          condition: "Used",
          city: "Addis Ababa",
          subcity: "Kirkos",
          location: "Addis Ababa, Kirkos",
          category: "vehicles",
          subcategory: "cars",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=Toyota"],
        },
        {
          id: "item-3",
          type: "item",
          title: "iPhone 13 Pro",
          description: "iPhone 13 Pro in excellent condition. 256GB storage, battery health 95%.",
          price: 55000,
          condition: "Like New",
          city: "Dire Dawa",
          subcity: "Central",
          location: "Dire Dawa, Central",
          category: "electronics",
          subcategory: "smartphones",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=iPhone"],
        },
      ]
    }

    return { success: true, items }
  } catch (error) {
    console.error("Error fetching items:", error)
    return { success: false, error: "Failed to fetch items" }
  }
}

// Function to fetch services
export async function fetchServices(filters: any = {}) {
  try {
    // In a real app, you would fetch from your API
    // const queryParams = new URLSearchParams();
    // if (filters.status) queryParams.append("status", filters.status);
    // if (filters.limit) queryParams.append("limit", filters.limit.toString());
    // if (filters.category) queryParams.append("category", filters.category);
    // if (filters.location) queryParams.append("location", filters.location);
    // const response = await fetch(`${API_BASE_URL}/services?${queryParams}`);
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // const data = await response.json();
    // return data;

    // For demo purposes, get services from localStorage
    const storedServices = localStorage.getItem("published_posts")
    let services = []

    if (storedServices) {
      const parsedServices = JSON.parse(storedServices)
      services = parsedServices.filter((service: any) => service.type === "service")

      // Apply filters if provided
      if (filters.category) {
        services = services.filter((service: any) => service.category === filters.category)
      }

      if (filters.location) {
        services = services.filter(
          (service: any) => service.city?.includes(filters.location) || service.subcity?.includes(filters.location),
        )
      }
    }

    // Add some mock services if there are none
    if (services.length === 0) {
      services = [
        {
          id: "service-1",
          type: "service",
          title: "Professional Web Development",
          description: "Full-stack web development services with React, Node.js, and more.",
          experience: "Expert",
          city: "Addis Ababa",
          subcity: "Bole",
          location: "Addis Ababa, Bole",
          category: "tech",
          subcategory: "web",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=WebDev"],
        },
        {
          id: "service-2",
          type: "service",
          title: "Home Cleaning Service",
          description: "Professional home cleaning service for all types of residences.",
          experience: "Experienced",
          city: "Addis Ababa",
          subcity: "Kirkos",
          location: "Addis Ababa, Kirkos",
          category: "home",
          subcategory: "cleaning",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=Cleaning"],
        },
        {
          id: "service-3",
          type: "service",
          title: "Graphic Design",
          description: "Creative graphic design services for businesses and individuals.",
          experience: "Expert",
          city: "Dire Dawa",
          subcity: "Central",
          location: "Dire Dawa, Central",
          category: "creative",
          subcategory: "graphic",
          status: "published",
          created_at: new Date().toISOString(),
          images: ["/placeholder.svg?height=300&width=300&text=Design"],
        },
      ]
    }

    return { success: true, services }
  } catch (error) {
    console.error("Error fetching services:", error)
    return { success: false, error: "Failed to fetch services" }
  }
}

// Create item
export async function createItem(itemData: any) {
  try {
    // In a real app, you would post to your API
    // const response = await fetch(`${API_BASE_URL}/items`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(itemData),
    // });
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // const data = await response.json();
    // return data;

    // For demo purposes, save to localStorage
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
      type: "item",
      ...itemData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "published",
    }

    publishedPosts.push(newItem)

    // Save back to localStorage
    localStorage.setItem("published_posts", JSON.stringify(publishedPosts))

    // Set flag for new post submitted
    localStorage.setItem("newPostSubmitted", "true")

    return { success: true, item: newItem }
  } catch (error) {
    console.error("Error creating item:", error)
    return { success: false, error: "Failed to create item" }
  }
}

// Create service
export async function createService(serviceData: any) {
  try {
    // In a real app, you would post to your API
    // const response = await fetch(`${API_BASE_URL}/services`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(serviceData),
    // });
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // const data = await response.json();
    // return data;

    // For demo purposes, save to localStorage
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
      type: "service",
      ...serviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "published",
    }

    publishedPosts.push(newService)

    // Save back to localStorage
    localStorage.setItem("published_posts", JSON.stringify(publishedPosts))

    // Set flag for new post submitted
    localStorage.setItem("newPostSubmitted", "true")

    return { success: true, service: newService }
  } catch (error) {
    console.error("Error creating service:", error)
    return { success: false, error: "Failed to create service" }
  }
}

// Get item by ID
export async function fetchItemById(id: string) {
  try {
    // In a real app, you would fetch from your API
    // const response = await fetch(`${API_BASE_URL}/items/${id}`);
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // const data = await response.json();
    // return data;

    // For demo purposes, get from localStorage
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
    // In a real app, you would fetch from your API
    // const response = await fetch(`${API_BASE_URL}/services/${id}`);
    // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    // const data = await response.json();
    // return data;

    // For demo purposes, get from localStorage
    const publishedPostsJson = localStorage.getItem("published_posts")
    if (publishedPostsJson) {
      try {
        const publishedPosts = JSON.parse(publishedPostsJson)
        const service = publishedPosts.find((post: any) => post.id === id && post.type === "service")
        if (service) {
          return { success: true, service }
        }
      } catch (error) {
        console.error("Error parsing published posts:", error)
      }
    }

    // If not found, return error
    return {
      success: false,
      error: "Service not found",
    }
  } catch (error) {
    console.error("Error fetching service:", error)
    return { success: false, error: "Failed to fetch service" }
  }
}
