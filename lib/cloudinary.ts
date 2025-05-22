/**
 * Uploads an image to Cloudinary using the signed upload approach
 * @param file The file to upload
 * @returns The Cloudinary response with secure_url and other metadata
 */
export async function uploadToCloudinary(file: File) {
  try {
    // First, get a signature from our backend
    const signatureResponse = await fetch("/api/cloudinary/signature", {
      method: "POST",
    })

    if (!signatureResponse.ok) {
      throw new Error("Failed to get upload signature")
    }

    const { signature, timestamp, cloudName, apiKey } = await signatureResponse.json()

    // Create a FormData object to send the file to Cloudinary
    const formData = new FormData()
    formData.append("file", file)
    formData.append("signature", signature)
    formData.append("timestamp", timestamp)
    formData.append("api_key", apiKey)
    formData.append("folder", "item-images")

    // Upload to Cloudinary
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    })

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image to Cloudinary")
    }

    return await uploadResponse.json()
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw error
  }
}
