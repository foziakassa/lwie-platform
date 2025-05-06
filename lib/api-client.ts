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

export async function fetchPosts(): Promise<{ items: any[]; services: any[] }> {
  const [itemsResponse, servicesResponse] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_APP_API}/api/items?status=published&limit=50`),
    fetch(`${process.env.NEXT_PUBLIC_APP_API}/api/services?status=published&limit=50`),
  ])

  const itemsData = await itemsResponse.json()
  const servicesData = await servicesResponse.json()

  if (!itemsResponse.ok || !itemsData.success) {
    throw new Error(itemsData.message || "Failed to fetch items")
  }
  if (!servicesResponse.ok || !servicesData.success) {
    throw new Error(servicesData.message || "Failed to fetch services")
  }

  return {
    items: itemsData.items,
    services: servicesData.services,
  }
}