// API base URL - adjust this to your API server address
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API 

/**
 * Uploads a single image to the API server
 * @param file The file to upload
 * @returns The response with the image URL
 */
export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch(`https://liwedoc.vercel.app/api/items`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload image")
  }

  return await response.json()
}

/**
 * Uploads multiple images to the API server
 * @param files Array of files to upload
 * @returns The response with image URLs
 */
export async function uploadMultipleImages(files: File[]) {
  const formData = new FormData()

  // Append each file with the same field name
  files.forEach((file) => {
    formData.append("images", file)
  })

  const response = await fetch(`https://liwedoc.vercel.app/api/upload-multiple`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload images")
  }

  return await response.json()
}

/**
 * Creates a new item with the provided data
 * @param itemData The item data to create
 * @returns The response with the created item ID
 */
export async function createItem(itemData: any) {
  const response = await fetch(`https://liwedoc.vercel.app/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  })

  if (!response.ok) {
    // throw new Error("Failed to create item")
    console.log('kkk')
  }

  return await response.json()
}
