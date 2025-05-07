"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadItemImages, uploadServiceImages } from "@/lib/api-client"

interface ImageUploaderProps {
  entityType: "item" | "service"
  initialImages?: string[]
  onImagesUploaded: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ entityType, initialImages = [], onImagesUploaded, maxImages = 5 }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (images.length + files.length > maxImages) {
        setError(`You can only upload a maximum of ${maxImages} images.`)
        return
      }

      setUploading(true)
      setError(null)

      try {
        let uploadedUrls: string[] = []

        if (entityType === "item") {
          uploadedUrls = await uploadItemImages(files)
        } else if (entityType === "service") {
          uploadedUrls = await uploadServiceImages(files)
        }

        if (uploadedUrls.length > 0) {
          const newImages = [...images, ...uploadedUrls]
          setImages(newImages)
          onImagesUploaded(newImages)
        }
      } catch (err) {
        console.error("Error uploading images:", err)
        setError("Failed to upload images. Please try again.")
      } finally {
        setUploading(false)
      }
    },
    [images, maxImages, entityType, onImagesUploaded],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"))
      if (validFiles.length > 0) {
        handleUpload(validFiles)
      } else {
        setError("Please upload valid image files (JPEG, PNG, etc.)")
      }
    },
    [handleUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: uploading || images.length >= maxImages,
  })

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onImagesUploaded(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-[#00A693] bg-[#00A693]/10" : "border-gray-300 hover:border-[#00A693] hover:bg-gray-50"
        } ${uploading || images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00A693]"></div>
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <p>
                {entityType === "service" ? "Optional: " : ""}Drag & drop images here, or{" "}
                <span className="text-[#00A693] font-medium">browse</span>
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {images.length} of {maxImages} images uploaded
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-square w-full relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Uploaded image ${index + 1}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, maxImages - images.length) }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="aspect-square rounded-lg border border-dashed border-gray-200 flex items-center justify-center"
            >
              <ImageIcon className="h-6 w-6 text-gray-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
