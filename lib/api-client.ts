// API client for interacting with the backend

// Base URL for API requests
const API_BASE_URL = "/api"

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
                name: "Computers",
                subcategories: [
                  { id: "201", name: "Laptops" },
                  { id: "202", name: "Desktops" },
                  { id: "203", name: "Monitors" },
                  { id: "204", name: "Computer Parts" },
                  { id: "205", name: "Peripherals" },
                ],
              },
              {
                id: "3",
                name: "Home & Garden",
                subcategories: [
                  { id: "301", name: "Furniture" },
                  { id: "302", name: "Appliances" },
                  { id: "303", name: "Kitchen" },
                  { id: "304", name: "Decor" },
                  { id: "305", name: "Garden" },
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

// Fetch items
export async function fetchItems(filters = {}) {
  try {
    // For demo purposes, return mock data
    return {
      success: true,
      items: [
        {
          id: "item-1",
          title: "iPhone 13 Pro Max",
          description: "Excellent condition, barely used",
          price: 45000,
          condition: "Like New",
          location: "Addis Ababa, Bole",
          category_name: "Electronics",
          status: "published",
          created_at: new Date().toISOString(),
          images: [{ url: "/placeholder.svg?height=300&width=300&text=iPhone", is_main: true }],
        },
        {
          id: "item-2",
          title: "Samsung Galaxy S21 Ultra",
          description: "Good condition, minor scratches",
          price: 35000,
          condition: "Good",
          location: "Addis Ababa, Kirkos",
          category_name: "Electronics",
          status: "published",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          images: [{ url: "/placeholder.svg?height=300&width=300&text=Samsung", is_main: true }],
        },
        {
          id: "item-3",
          title: "MacBook Pro 16-inch 2021",
          description: "Brand new, unopened",
          price: 120000,
          condition: "Brand New",
          location: "Addis Ababa, Yeka",
          category_name: "Computers",
          status: "published",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          images: [{ url: "/placeholder.svg?height=300&width=300&text=MacBook", is_main: true }],
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching items:", error)
    return { success: false, error: "Failed to fetch items" }
  }
}

// Fetch services
export async function fetchServices(filters = {}) {
  try {
    // For demo purposes, return mock data
    return {
      success: true,
      services: [
        {
          id: "service-1",
          title: "Professional Web Development",
          description: "Full-stack web development services",
          hourly_rate: 500,
          location: "Addis Ababa, Bole",
          category_name: "Tech & IT",
          status: "published",
          created_at: new Date().toISOString(),
          images: [{ url: "/placeholder.svg?height=300&width=300&text=WebDev", is_main: true }],
        },
        {
          id: "service-2",
          title: "Graphic Design Services",
          description: "Logo design, branding, and marketing materials",
          hourly_rate: 400,
          location: "Addis Ababa, Kirkos",
          category_name: "Creative & Design",
          status: "published",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          images: [{ url: "/placeholder.svg?height=300&width=300&text=Design", is_main: true }],
        },
        {
          id: "service-3",
          title: "Home Cleaning Service",
          description: "Professional home cleaning services",
          hourly_rate: 200,
          location: "Addis Ababa, Yeka",
          category_name: "Home Services",
          status: "published",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          images: [{ url: "/placeholder.svg?height=300&width=300&text=Cleaning", is_main: true }],
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching services:", error)
    return { success: false, error: "Failed to fetch services" }
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
export async function getItemById(id: string) {
  try {
    // For demo purposes, return mock data or from local storage
    const publishedPostsJson = localStorage.getItem("published_posts")
    let publishedPosts = []

    if (publishedPostsJson) {
      try {
        publishedPosts = JSON.parse(publishedPostsJson)
        const item = publishedPosts.find((post: any) => post.id === id && post.type === "item")
        if (item) {
          return { success: true, item }
        }
      } catch (error) {
        console.error("Error parsing published posts:", error)
      }
    }

    // If not found in local storage, return mock data
    return {
      success: true,
      item: {
        id,
        title: "iPhone 13 Pro Max",
        description: "Excellent condition, barely used",
        price: 45000,
        condition: "Like New",
        location: "Addis Ababa, Bole",
        category_name: "Electronics",
        status: "published",
        created_at: new Date().toISOString(),
        images: [{ url: "/placeholder.svg?height=300&width=300&text=iPhone", is_main: true }],
      },
    }
  } catch (error) {
    console.error("Error fetching item:", error)
    return { success: false, error: "Failed to fetch item" }
  }
}

// Get service by ID
export async function getServiceById(id: string) {
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
