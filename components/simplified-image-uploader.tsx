"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SimplifiedImageUploaderProps {
  onChange: (files: File[]) => void
  maxImages?: number
  existingImages?: string[]
  required?: boolean
}

export function SimplifiedImageUploader({
  onChange,
  maxImages = 5,
  existingImages = [],
  required = false,
}: SimplifiedImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Check if adding these files would exceed the maximum
    if (files.length + selectedFiles.length + existingImages.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`)
      return
    }

    // Check file types
    const invalidFiles = files.filter((file) => !file.type.startsWith("image/"))
    if (invalidFiles.length > 0) {
      setError("Only image files are allowed")
      return
    }

    // Check file sizes (max 5MB per file)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError("Files must be less than 5MB")
      return
    }

    setError(null)

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file))

    // Update state
    setSelectedFiles((prev) => [...prev, ...files])
    setPreviews((prev) => [...prev, ...newPreviews])

    // Call onChange with all files
    onChange([...selectedFiles, ...files])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index])

    // Remove file and preview
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)

    const newPreviews = [...previews]
    newPreviews.splice(index, 1)

    // Update state
    setSelectedFiles(newFiles)
    setPreviews(newPreviews)

    // Call onChange with updated files
    onChange(newFiles)
  }

  const removeExistingImage = (index: number) => {
    // Create a new array without the removed image
    const newExistingImages = [...existingImages]
    newExistingImages.splice(index, 1)

    // We don't need to call onChange here as the parent component
    // already has access to existingImages
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)

      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      handleFileChange(syntheticEvent)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Images {required && <span className="text-red-500">*</span>}</h3>
          <p className="text-sm text-gray-500">Upload up to {maxImages} images of your item</p>
        </div>
        <div className="text-sm text-gray-500">
          {selectedFiles.length + existingImages.length} / {maxImages}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label htmlFor="imageUpload" className="sr-only">Upload Image</label>
        <input
          type="file"
          id="imageUpload"
          className="your-input-classes"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-gray-600">Drag and drop images here, or click to browse</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={selectedFiles.length + existingImages.length >= maxImages}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Select Images
          </Button>
        </div>
      </div>

      {(previews.length > 0 || existingImages.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {/* Existing images */}
          {existingImages.map((src, index) => (
            <div key={`existing-${index}`} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Existing image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* New images with previews */}
          {previews.map((src, index) => (
            <div key={`preview-${index}`} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
