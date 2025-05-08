export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  bio?: string
  location?: string
  rating?: number
  verified?: boolean
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  type: "item" | "service"
  title: string
  description: string | null
  category: string | null
  subcategory?: string | null
  condition?: string | null
  price?: number | null
  brand?: string | null
  model?: string | null
  additional_details?: string | null
  city?: string | null
  subcity?: string | null
  location?: string | null
  images: string[] | null
  trade_preferences?: any | null
  service_details?: {
    service_type?: string
    availability?: string[]
    duration?: string
    experience_level?: string
  } | null
  contact_info?: {
    phone?: string
    email?: string
    preferred_contact_method?: string
  } | null
  status: "draft" | "published" | "archived"
  created_at: string
  updated_at: string
  user_name?: string | null
}

export interface SwapRequest {
  id: string
  post_id: string
  requester_id: string
  message: string
  contact_info?: {
    phone?: string
    email?: string
  }
  status: "pending" | "accepted" | "rejected"
  created_at: string
  updated_at: string
  post?: Post
  users?: User
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  related_id?: string | null
  is_read: boolean
  created_at: string
}
