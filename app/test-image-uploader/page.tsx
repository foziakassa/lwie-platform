"use client"

import type React from "react"

import { useState } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { Button } from "@/components/ui/button"

export default function TestImageUploader() {
  const [files, setFiles] = useState<File[]>([])

  const handleImagesChange = (newFiles: File[]) => {
    setFiles(newFiles)
    console.log("Files updated:", newFiles)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Files to submit:", files)
    alert(`${files.length} images would be uploaded. Check console for details.`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-teal-600">Image Uploader Test</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border p-4 rounded-md">
          <ImageUploader onChange={handleImagesChange} maxImages={5} required={true} />
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Selected Files ({files.length}):</h2>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-700">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
          Test Submit
        </Button>
      </form>
    </div>
  )
}
