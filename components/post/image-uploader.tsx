"use client"
import { useState, useCallback, useEffect } from "react"
import type React from "react"

import { Plus, Camera, Trash2 } from "lucide-react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  images: string[]
  setImages: (images: string[]) => void
  maxImages: number
  onChange?: (images: string[]) => void
}

export function ImageUploader({ images, setImages, maxImages, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [activeImage, setActiveImage] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length >= maxImages) {
        alert(`You can only upload up to ${maxImages} images.`)
        return
      }

      const newFiles = acceptedFiles.slice(0, maxImages - images.length)
      const newImages = [...images]

      newFiles.forEach((file) => {
        if (!file.type.startsWith("image/")) {
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result.toString())
            setImages(newImages)
            if (onChange) {
              onChange(newImages)
            }
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [images, maxImages, onChange, setImages],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: maxImages - images.length,
  })

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    if (onChange) {
      onChange(newImages)
    }
    setActiveImage(null)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return

    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)

    setImages(newImages)
    if (onChange) {
      onChange(newImages)
    }
    setActiveImage(toIndex)
  }

  if (!mounted) return null

  return (
    <div className="space-y-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragActive
            ? "border-teal-500 bg-teal-50/80 shadow-md"
            : "border-gray-300 hover:border-teal-400 hover:bg-teal-50/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-teal-400 to-teal-600 p-5 rounded-full mb-5 shadow-md"
          >
            <Camera className="h-10 w-10 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">Drag & drop your images here</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Add up to {maxImages} high-quality images to showcase your item from different angles
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-md transition-all duration-300"
          >
            Browse Files
          </motion.button>
        </div>
      </div>

      {images.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <h4 className="font-semibold text-lg flex items-center">
              <Camera className="h-5 w-5 mr-2 text-teal-600" />
              Uploaded Images
              <span className="ml-2 bg-teal-100 text-teal-700 text-sm px-2 py-0.5 rounded-full">
                {images.length}/{maxImages}
              </span>
            </h4>
            {images.length < maxImages && (
              <Button
                variant="outline"
                size="sm"
                className="text-teal-600 border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add More
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: activeImage === index ? -10 : 0,
                    boxShadow: activeImage === index ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className={`relative group rounded-xl overflow-hidden border ${
                    activeImage === index
                      ? "border-teal-500 ring-2 ring-teal-500 ring-opacity-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  onClick={() => setActiveImage(activeImage === index ? null : index)}
                >
                  <div className="aspect-square bg-gray-50">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Uploaded image ${index + 1}`}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Image controls */}
                  <div
                    className={`absolute inset-0 bg-black/60 flex flex-col justify-between p-3 transition-opacity duration-200 ${
                      activeImage === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                        Image {index + 1}
                      </span>
                      <div className="flex gap-1">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveImage(index, index - 1)
                            }}
                            className="bg-white/20 backdrop-blur-sm text-white rounded-full p-1 hover:bg-white/40 transition-colors"
                            aria-label="Move left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </button>
                        )}
                        {index < images.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              moveImage(index, index + 1)
                            }}
                            className="bg-white/20 backdrop-blur-sm text-white rounded-full p-1 hover:bg-white/40 transition-colors"
                            aria-label="Move right"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      className="bg-red-500 text-white w-full py-1.5 rounded-md flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Remove
                    </button>
                  </div>

                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-md">
                      Cover
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty slots */}
            {images.length < maxImages &&
              Array.from({ length: maxImages - images.length }).map((_, index) => (
                <motion.div
                  key={`empty-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 * index }}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-colors"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <div className="flex flex-col items-center text-gray-400">
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="text-xs">Add Image</span>
                  </div>
                </motion.div>
              ))}
          </div>

          {images.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="flex items-center">
                <InfoIcon className="h-4 w-4 mr-2 text-teal-600" />
                <span>Click on an image to select it. You can rearrange images by using the arrows.</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// InfoIcon component
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
