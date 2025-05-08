import type { User } from "./types"

// Mock user data for development
const MOCK_USER: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  avatar_url: "/placeholder.svg?height=200&width=200&text=John",
  bio: "Passionate about trading electronics and collectibles",
  location: "Addis Ababa",
  rating: 4.8,
  verified: true,
  created_at: new Date().toISOString(),
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  // In a real app, this would check authentication state
  // For now, we'll just return the mock user
  return MOCK_USER
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  // In a real app, this would check authentication state
  // For now, we'll just return true
  return true
}

// Get user ID
export function getUserId(): string {
  // In a real app, this would get the authenticated user's ID
  // For now, we'll just return the mock user ID
  return MOCK_USER.id
}
