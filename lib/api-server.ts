const API_URL = process.env.API_URL || "http://localhost:5000"

// Get all plans
export async function getPlans() {
  try {
    const response = await fetch(`${API_URL}/api/plans`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch plans")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching plans:", error)
    throw error
  }
}

// Get user's posts status
export async function getPostsStatus(email: string) {
  try {
    const response = await fetch(`${API_URL}/api/user/posts-status`, {
      headers: {
        "X-User-Email": email,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch posts status")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching posts status:", error)
    throw error
  }
}

// Add purchased posts
export async function addPurchasedPosts(email: string, numberOfPosts: number) {
  try {
    const response = await fetch(`${API_URL}/api/user/add-posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Email": email,
      },
      body: JSON.stringify({ numberOfPosts }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to add posts")
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding posts:", error)
    throw error
  }
}

// Get payment receipt
export async function getPaymentReceipt(email: string, txRef: string) {
  try {
    const response = await fetch(`${API_URL}/api/payment/receipt/${txRef}`, {
      headers: {
        "X-User-Email": email,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch receipt")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching receipt:", error)
    throw error
  }
}

// Verify payment
export async function verifyPayment(txRef: string) {
  try {
    const response = await fetch(`${API_URL}/api/payment/verify/${txRef}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to verify payment")
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying payment:", error)
    throw error
  }
}
