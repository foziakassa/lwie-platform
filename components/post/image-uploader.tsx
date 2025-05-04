"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import { uploadItemImages, uploadServiceImages } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

interface ImageUploaderProps {
  entityType: "item" | "service"
  initialImages?: string[]
  onImagesUploaded: (imageUrls: string[]) => void
  maxImages?: number
}

export function ImageUploader({ entityType, initialImages = [], onImagesUploaded, maxImages = 5 }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      toast({
        title: `Maximum ${maxImages} images allowed`,
        description: `Please select fewer images. You can upload ${maxImages - images.length} more.`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Upload the images to the server
      const response = entityType === "item" ? await uploadItemImages(files) : await uploadServiceImages(files)

      if (response.success && response.urls) {
        const newImages = [...images, ...response.urls]
        setImages(newImages)
        onImagesUploaded(newImages)

        toast({
          title: "Images uploaded successfully",
          description: `${files.length} image${files.length > 1 ? "s" : ""} uploaded.`,
        })
      } else {
        throw new Error("Failed to upload images")
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Error uploading images",
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

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onImagesUploaded(newImages)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

    if (files.length === 0) {
      toast({
        title: "No valid images",
        description: "Please drop image files only.",
        variant: "destructive",
      })
      return
    }

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      toast({
        title: `Maximum ${maxImages} images allowed`,
        description: `Please select fewer images. You can upload ${maxImages - images.length} more.`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Upload the images to the server
      const response = entityType === "item" ? await uploadItemImages(files) : await uploadServiceImages(files)

      if (response.success && response.urls) {
        const newImages = [...images, ...response.urls]
        setImages(newImages)
        onImagesUploaded(newImages)

        toast({
          title: "Images uploaded successfully",
          description: `${files.length} image${files.length > 1 ? "s" : ""} uploaded.`,
        })
      } else {
        throw new Error("Failed to upload images")
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Error uploading images",
        description: "There was a problem uploading your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isUploading ? "bg-gray-50 border-gray-300" : "border-gray-300 hover:border-teal-500 hover:bg-teal-50/30"
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isUploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
              <p className="text-gray-500">Uploading images...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400" />
              <div>
                <p className="text-base font-medium">
                  {images.length === 0
                    ? "Drag and drop your images here"
                    : `${images.length} of ${maxImages} images uploaded`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {images.length >= maxImages ? "Maximum number of images reached" : "PNG, JPG or JPEG (max. 5MB each)"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxImages}
                className="mt-2"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Select Images
              </Button>
            </>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-teal-500 text-white text-xs px-2 py-0.5 rounded">Main</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
