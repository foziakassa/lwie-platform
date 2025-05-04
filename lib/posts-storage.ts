// Simple utility for storing and retrieving posts from localStorage

export interface PostData {
  id: string
  type: "item" | "service"
  data: any
  createdAt: string
}

// Save post to localStorage
export function savePost(post: PostData): void {
  try {
    localStorage.setItem("latestPost", JSON.stringify(post))
  } catch (error) {
    console.error("Error saving post to localStorage:", error)
  }
}

// Get latest post from localStorage
export function getLatestPost(): PostData | null {
  try {
    const savedPost = localStorage.getItem("latestPost")
    if (!savedPost) return null

    const parsedPost = JSON.parse(savedPost)
    // Validate post is recent (within the last 5 minutes)
    const postTime = new Date(parsedPost.createdAt).getTime()
    const currentTime = new Date().getTime()
    const timeDiff = currentTime - postTime

    if (timeDiff > 300000) {
      // 5 minutes
      // Post is too old, remove it
      localStorage.removeItem("latestPost")
      return null
    }

    return parsedPost as PostData
  } catch (error) {
    console.error("Error retrieving post from localStorage:", error)
    return null
  }
}

// Clear latest post from localStorage
export function clearLatestPost(): void {
  localStorage.removeItem("latestPost")
}
