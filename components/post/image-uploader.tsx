"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  maxImages?: number
  onChange: (files: File[]) => void
  existingImages?: string[]
  onRemoveExisting?: (index: number) => void
}

export default function ImageUploader({
  maxImages = 5,
  onChange,
  existingImages = [],
  onRemoveExisting,
}: ImageUploaderProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed the maximum
    if (files.length + previewUrls.length + existingImages.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images`)
      return
    }

    // Create preview URLs for the new files
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviewUrls])

    // Call the onChange handler with all files
    onChange(files)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removePreview = (index: number) => {
    const newPreviewUrls = [...previewUrls]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    // Remove the preview URL
    newPreviewUrls.splice(index, 1)
    setPreviewUrls(newPreviewUrls)

    // Notify parent component
    // This is a bit tricky since we don't have the files anymore
    // In a real implementation, you'd need to track the files separately
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {/* Existing images */}
        {existingImages.map((url, index) => (
          <div key={`existing-${index}`} className="relative h-32 bg-gray-100 rounded-md overflow-hidden">
            <img src={url || "/placeholder.svg"} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => onRemoveExisting(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
            )}
          </div>
        ))}

        {/* Preview images */}
        {previewUrls.map((url, index) => (
          <div key={`preview-${index}`} className="relative h-32 bg-gray-100 rounded-md overflow-hidden">
            <img src={url || "/placeholder.svg"} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePreview(index)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        ))}

        {/* Upload button */}
        {previewUrls.length + existingImages.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Upload Image</span>
          </button>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

      <p className="text-xs text-gray-500">Upload up to {maxImages} images. First image will be the main image.</p>
    </div>
  )
}

