export async function uploadItemImages(files: File[]): Promise<string[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append("images", file))

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/api/items/upload`, {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to upload images")
  }
  return data.urls
}

export async function uploadServiceImages(files: File[]): Promise<string[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append("images", file))

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/api/services/upload`, {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to upload images")
  }
  return data.urls
}

export async function createItem(postData: any): Promise<any> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to create item")
  }
  return data.item
}

export async function fetchItems(params: { status?: string; limit?: number } = {}): Promise<any> {
  const query = new URLSearchParams()
  if (params.status) query.set("status", params.status)
  if (params.limit) query.set("limit", params.limit.toString())

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/api/items?${query.toString()}`, {
    method: "GET",
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch items")
  }
  return data
}

export async function fetchServices(params: { status?: string; limit?: number } = {}): Promise<any> {
  const query = new URLSearchParams()
  if (params.status) query.set("status", params.status)
  if (params.limit) query.set("limit", params.limit.toString())

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/api/services?${query.toString()}`, {
    method: "GET",
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch services")
  }
  return data
}