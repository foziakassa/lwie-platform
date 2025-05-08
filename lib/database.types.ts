export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          user_id: string
          type: "item" | "service"
          title: string
          description: string | null
          category: string | null
          subcategory: string | null
          condition: string | null
          price: number | null
          brand: string | null
          model: string | null
          additional_details: string | null
          city: string | null
          subcity: string | null
          location: string | null
          images: string[] | null
          trade_preferences: Json | null
          service_details: Json | null
          contact_info: Json | null
          status: "draft" | "published" | "archived"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "item" | "service"
          title: string
          description?: string | null
          category?: string | null
          subcategory?: string | null
          condition?: string | null
          price?: number | null
          brand?: string | null
          model?: string | null
          additional_details?: string | null
          city?: string | null
          subcity?: string | null
          location?: string | null
          images?: string[] | null
          trade_preferences?: Json | null
          service_details?: Json | null
          contact_info?: Json | null
          status?: "draft" | "published" | "archived"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "item" | "service"
          title?: string
          description?: string | null
          category?: string | null
          subcategory?: string | null
          condition?: string | null
          price?: number | null
          brand?: string | null
          model?: string | null
          additional_details?: string | null
          city?: string | null
          subcity?: string | null
          location?: string | null
          images?: string[] | null
          trade_preferences?: Json | null
          service_details?: Json | null
          contact_info?: Json | null
          status?: "draft" | "published" | "archived"
          created_at?: string
          updated_at?: string
        }
      }
      swap_requests: {
        Row: {
          id: string
          post_id: string
          requester_id: string
          message: string | null
          contact_info: Json | null
          status: "pending" | "accepted" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          requester_id: string
          message?: string | null
          contact_info?: Json | null
          status?: "pending" | "accepted" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          requester_id?: string
          message?: string | null
          contact_info?: Json | null
          status?: "pending" | "accepted" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          related_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          related_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          related_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
