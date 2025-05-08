import type { Post } from "./types"

// Save draft to localStorage
export function saveDraft(type: "item" | "service", data: Partial<Post>): void {
  try {
    localStorage.setItem(`${type}_draft`, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving draft:", error)
  }
}

// Get draft from localStorage
export function getDraft(type: "item" | "service"): Partial<Post> | null {
  try {
    const draft = localStorage.getItem(`${type}_draft`)
    return draft ? JSON.parse(draft) : null
  } catch (error) {
    console.error("Error getting draft:", error)
    return null
  }
}

// Clear draft from localStorage
export function clearDraft(type: "item" | "service"): void {
  try {
    localStorage.removeItem(`${type}_draft`)
  } catch (error) {
    console.error("Error clearing draft:", error)
  }
}
