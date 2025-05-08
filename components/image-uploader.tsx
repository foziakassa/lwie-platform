"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  maxImages?: number
  onChange: (files: File[]) => void
  initialImages?: string[]
  required?: boolean
}

export function ImageUploader({ maxImages = 5, onChange, initialImages = [], required = false }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>(initialImages)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Limit the number of images
      const totalFiles = files.length + acceptedFiles.length
      const newFiles =
        totalFiles > maxImages ? [...files, ...acceptedFiles].slice(0, maxImages) : [...files, ...acceptedFiles]

      setFiles(newFiles)
      onChange(newFiles)

      // Create previews for new files
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))
      setPreviews((prev) => {
        // Make sure we don't exceed maxImages
        return [...prev, ...newPreviews].slice(0, maxImages)
      })
    },
    [files, maxImages, onChange],
  )

  const removeFile = (index: number) => {
    // Create a new array without the file at the specified index
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    onChange(newFiles)

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previews[index])

    // Remove the preview
    const newPreviews = [...previews]
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: maxImages - files.length,
    disabled: files.length + initialImages.length >= maxImages,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Images {required && <span className="text-red-500">*</span>}</h3>
          <p className="text-sm text-gray-500">Upload up to {maxImages} images</p>
        </div>
        <div className="text-sm text-gray-500">
          {files.length + initialImages.length} / {maxImages}
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-500"
        } ${files.length + initialImages.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag & drop images here, or click to select files</p>
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          disabled={files.length + initialImages.length >= maxImages}
        >
          Select Images
        </Button>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
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

export default ImageUploader
