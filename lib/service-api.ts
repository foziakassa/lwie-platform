// Simplified API client for services
import { toast } from "@/components/ui/use-toast"

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API || "https://liwedoc.vercel.app"

// Function to upload service images
export async function uploadServiceImages(files: File[]): Promise<string[]> {
  try {
    if (!files || files.length === 0) return []

    // Create FormData object
    const formData = new FormData()

    // Append each file to the FormData
    Array.from(files).forEach((file) => {
      formData.append("images", file)
    })

    const response = await fetch(`${API_BASE_URL}/api/services/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload images: HTTP ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to upload images")
    }

    return data.urls || []
  } catch (error) {
    console.error("Error uploading service images:", error)
    toast({
      title: "Error uploading images",
      description: "Failed to upload images. Please try again.",
      variant: "destructive",
    })

    // For demo purposes, return mock URLs if the API fails
    return Array.from(files).map((file, index) => URL.createObjectURL(file))
  }
}

// Create service
export async function createService(serviceData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      throw new Error(`Failed to create service: HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating service:", error)
    toast({
      title: "Error creating service",
      description: "Failed to create service. Please try again.",
      variant: "destructive",
    })

    // For demo purposes, return a mock success response
    return {
      success: true,
      service: {
        id: `service-${Date.now()}`,
        ...serviceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
  }
}
