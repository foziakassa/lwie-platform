"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import { uploadItemImages, uploadServiceImages } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

interface ImageUploaderProps {
  entityType: "item" | "service"
  initialImages?: string[]
  onImagesUploaded: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ entityType, initialImages = [], onImagesUploaded, maxImages = 5 }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages)
    }
  }, [initialImages])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      toast({
        title: `Maximum ${maxImages} images allowed`,
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Convert FileList to array
      const fileArray = Array.from(files)

      // Validate file types
      const validFiles = fileArray.filter((file) => file.type.startsWith("image/"))
      if (validFiles.length !== fileArray.length) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed.",
          variant: "destructive",
        })
      }

      // Upload images based on entity type
      const uploadFunction = entityType === "item" ? uploadItemImages : uploadServiceImages
      const response = await uploadFunction(validFiles)
      let uploadedUrls: string[] = []

      if (Array.isArray(response)) {
        uploadedUrls = response
      } else if (response && typeof response === "object" && "success" in response && "urls" in response) {
        uploadedUrls = response.urls
      }

      // Update state with new images
      const newImages = [...images, ...uploadedUrls]
      setImages(newImages)
      onImagesUploaded(newImages)

      toast({
        title: "Images uploaded successfully",
        description: `${uploadedUrls.length} image(s) have been uploaded.`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onImagesUploaded(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative h-32 bg-gray-100 rounded-md overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              title="Remove image"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                <span className="mt-2 text-sm text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload Image</span>
              </>
            )}
          </button>
        )}
      </div>

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {entityType === "service" ? "No images uploaded yet (optional)" : "No images uploaded yet"}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mx-auto"
          >
            {isUploading ? "Uploading..." : "Upload Images"}
          </Button>
        </div>
      )}

      <input
        type="file"
        aria-label="Upload images"
        title="Upload images"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
        disabled={isUploading || images.length >= maxImages}
      />

      <p className="text-sm text-gray-500">
        {images.length} of {maxImages} images uploaded. {maxImages - images.length} remaining.
        {entityType === "service" && " (Images are optional for services)"}
      </p>
    </div>
  )
}

export default ImageUploader