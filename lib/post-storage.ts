// lib/post-storage.ts
// This utility handles all post storage operations

// Types
export interface PostImage {
  id: string
  url: string
  main: boolean
}

export interface TradePreferences {
  openToOffers: boolean
  acceptCash: boolean
  preferredTradeType?: "any" | "specific"
  specificItems?: string
  preferredCategories?: string[]
  cashValue?: number
}

export interface ServiceDetails {
  duration?: string
  availability?: string
  experience?: string
  qualifications?: string[]
}

export interface PricingTerms {
  pricing: string
  priceAmount: number
  negotiable: boolean
  termsAndConditions?: string
}

export interface Post {
  id: string
  type: "item" | "service"
  userId: string
  title: string
  description?: string
  category?: string
  subcategory?: string
  condition?: string
  price?: number
  brand?: string
  model?: string
  processor?: string
  ram?: string
  storage?: string
  screenSize?: string
  hasCamera?: boolean
  hasBattery?: boolean
  additionalDetails?: string
  city?: string
  subcity?: string
  location?: string
  images: PostImage[]
  tradePreferences?: TradePreferences
  serviceDetails?: ServiceDetails
  pricingTerms?: PricingTerms
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
}

// Storage keys
const ITEM_DRAFT_KEY = "item_draft"
const SERVICE_DRAFT_KEY = "service_draft"
const PUBLISHED_POSTS_KEY = "published_posts"
const POSTS_KEY = "posts" // Define POSTS_KEY

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15)
const getCurrentTimestamp = () => new Date().toISOString()

// Initialize a new post
export function initializePost(type: "item" | "service"): Post {
  return {
    id: `${type}-${Date.now()}`,
    type,
    userId: "user-1", // This would be the actual user ID in a real app
    title: "",
    images: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Get draft post
export function getDraftPost(type: "item" | "service"): Post | null {
  if (typeof window === "undefined") return null

  const key = type === "item" ? ITEM_DRAFT_KEY : SERVICE_DRAFT_KEY
  const draftJson = localStorage.getItem(key)

  if (!draftJson) return null

  try {
    return JSON.parse(draftJson) as Post
  } catch (error) {
    console.error("Error parsing draft post:", error)
    return null
  }
}

// Save draft post
export function saveDraftPost(post: Post): void {
  if (typeof window === "undefined") return

  const key = post.type === "item" ? ITEM_DRAFT_KEY : SERVICE_DRAFT_KEY
  localStorage.setItem(key, JSON.stringify(post))
}

// Delete draft post
export function deleteDraftPost(type: "item" | "service"): void {
  if (typeof window === "undefined") return

  const key = type === "item" ? ITEM_DRAFT_KEY : SERVICE_DRAFT_KEY
  localStorage.removeItem(key)
}

// Publish post
export function publishPost(post: Post): Post {
  if (typeof window === "undefined") return post

  // Update post status and timestamps
  const publishedPost: Post = {
    ...post,
    status: "published",
    updatedAt: new Date().toISOString(),
  }

  // Get existing published posts
  const publishedPostsJson = localStorage.getItem(PUBLISHED_POSTS_KEY)
  let publishedPosts: Post[] = []

  if (publishedPostsJson) {
    try {
      publishedPosts = JSON.parse(publishedPostsJson) as Post[]
    } catch (error) {
      console.error("Error parsing published posts:", error)
    }
  }

  // Add the new post to the published posts
  publishedPosts.push(publishedPost)

  // Save the updated published posts
  localStorage.setItem(PUBLISHED_POSTS_KEY, JSON.stringify(publishedPosts))

  // Delete the draft
  deleteDraftPost(post.type)

  return publishedPost
}

// Function to save a post (item or service) to localStorage
export function savePost(post: any) {
  try {
    // Get existing posts
    const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]")

    // Add the new post
    existingPosts.push(post)

    // Save back to localStorage
    localStorage.setItem("posts", JSON.stringify(existingPosts))

    // If the post is published, also add to published_posts
    if (post.status === "published") {
      const publishedPosts = JSON.parse(localStorage.getItem("published_posts") || "[]")
      publishedPosts.push(post)
      localStorage.setItem("published_posts", JSON.stringify(publishedPosts))
    }

    return true
  } catch (error) {
    console.error("Error saving post:", error)
    return false
  }
}

// Function to get stored posts
export function getStoredPosts() {
  try {
    return JSON.parse(localStorage.getItem("posts") || "[]")
  } catch (error) {
    console.error("Error getting posts:", error)
    return []
  }
}

// Get published posts
export function getPublishedPosts(): Post[] {
  try {
    return JSON.parse(localStorage.getItem("published_posts") || "[]")
  } catch (error) {
    console.error("Error getting published posts:", error)
    return []
  }
}

// Get a specific post by ID
export function getPostById(id: string) {
  try {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]")
    return posts.find((post: any) => post.id === id) || null
  } catch (error) {
    console.error("Error getting post by ID:", error)
    return null
  }
}

// Delete a post
export function deletePost(id: string) {
  try {
    let posts = JSON.parse(localStorage.getItem("posts") || "[]")
    posts = posts.filter((post: any) => post.id !== id)
    localStorage.setItem("posts", JSON.stringify(posts))

    let publishedPosts = JSON.parse(localStorage.getItem("published_posts") || "[]")
    publishedPosts = publishedPosts.filter((post: any) => post.id !== id)
    localStorage.setItem("published_posts", JSON.stringify(publishedPosts))

    return true
  } catch (error) {
    console.error("Error deleting post:", error)
    return false
  }
}

// Update a post
export function updatePost(updatedPost: Post): Post {
  const posts = getPublishedPosts()
  const updatedPosts = posts.map((post) =>
    post.id === updatedPost.id ? { ...updatedPost, updatedAt: getCurrentTimestamp() } : post,
  )
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts))
  return { ...updatedPost, updatedAt: getCurrentTimestamp() }
}
