// Post storage utility for managing posts in localStorage

export interface PostData {
  id: string
  type: "item" | "service"
  data: any
  createdAt: string
}

// Save post to localStorage
export function savePost(post: PostData): void {
  try {
    // Save as latest post
    localStorage.setItem("latestPost", JSON.stringify(post))

    // Also save to posts collection
    const existingPostsJson = localStorage.getItem("posts")
    let existingPosts: PostData[] = []

    if (existingPostsJson) {
      existingPosts = JSON.parse(existingPostsJson)
    }

    // Check if post already exists
    const existingIndex = existingPosts.findIndex((p) => p.id === post.id)
    if (existingIndex >= 0) {
      // Update existing post
      existingPosts[existingIndex] = post
    } else {
      // Add new post
      existingPosts.unshift(post) // Add to beginning of array
    }

    // Save updated posts
    localStorage.setItem("posts", JSON.stringify(existingPosts))
  } catch (error) {
    console.error("Error saving post to localStorage:", error)
  }
}

// Get all posts from localStorage
export function getAllPosts(): PostData[] {
  try {
    const postsJson = localStorage.getItem("posts")
    if (!postsJson) return []
    return JSON.parse(postsJson)
  } catch (error) {
    console.error("Error retrieving posts from localStorage:", error)
    return []
  }
}

// Get latest post from localStorage
export function getLatestPost(): PostData | null {
  try {
    const savedPost = localStorage.getItem("latestPost")
    if (!savedPost) return null
    return JSON.parse(savedPost) as PostData
  } catch (error) {
    console.error("Error retrieving latest post from localStorage:", error)
    return null
  }
}

// Save draft post
export function saveDraft(type: "item" | "service", data: any): void {
  try {
    localStorage.setItem(`${type}Draft`, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${type} draft:`, error)
  }
}

// Get draft post
export function getDraft(type: "item" | "service"): any {
  try {
    const draft = localStorage.getItem(`${type}Draft`)
    if (!draft) return null
    return JSON.parse(draft)
  } catch (error) {
    console.error(`Error retrieving ${type} draft:`, error)
    return null
  }
}

// Clear draft post
export function clearDraft(type: "item" | "service"): void {
  localStorage.removeItem(`${type}Draft`)
}
