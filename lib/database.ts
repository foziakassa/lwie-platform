export type Post = {
  id: string
  user_id: string
  type: "item" | "service"
  title: string
  description: string
  category: string
  subcategory?: string
  condition?: string
  price?: number
  brand?: string
  model?: string
  additional_details?: string
  city?: string
  subcity?: string
  location?: string
  images: string[]
  trade_preferences?: {
    trade_type?: string[]
    payment_methods?: string[]
  }
  service_details?: {
    service_type?: string
    availability?: string[]
    duration?: string
  }
  contact_info: {
    phone?: string
    email?: string
    preferred_contact_method?: string
  }
  status: "draft" | "published" | "archived"
  created_at: string
  updated_at: string
}

export type SwapRequest = {
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
}

export type Notification = {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  related_id?: string
  is_read: boolean
  created_at: string
}

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  created_at: string
}
