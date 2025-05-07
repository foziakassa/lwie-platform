"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { uploadServiceImages } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

interface SimplifiedImageUploaderProps {
  value: string[]
  onChange: (value: string[]) => void
  maxImages?: number
}

export function SimplifiedImageUploader({ value = [], onChange, maxImages = 5 }: SimplifiedImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the maximum
    if (value.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${maxImages} images.`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // Convert FileList to array
      const fileArray = Array.from(files)

      // Upload the files
      const uploadedUrls = await uploadServiceImages(fileArray)

      // Update the value with the new URLs
      onChange([...value, ...uploadedUrls])

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${fileArray.length} image(s).`,
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
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...value]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
            <Image
              src={url || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <svg
                  className="animate-spin h-8 w-8 text-gray-500 mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm">Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
        disabled={isUploading || value.length >= maxImages}
      />

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <ImageIcon className="h-4 w-4 mr-1" />
          <span>
            {value.length} of {maxImages} images
          </span>
        </div>
        <span>JPG, PNG, GIF (max 5MB each)</span>
      </div>
    </div>
  )
}
