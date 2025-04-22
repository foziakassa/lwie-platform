"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"
import { useRouter } from "next/navigation"


const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  productDescription: z
    .string()
    .min(20, { message: "Product description must be at least 20 characters." })
    .max(500, { message: "Product description cannot exceed 500 characters." }),
  productImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: "File size should be less than 5MB." })
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function AdvertisementForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      email: "",
      phoneNumber: "",
      productDescription: "",
    },
  })

  // Debug log when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      console.log("Selected file:", selectedFile.name, selectedFile.type, selectedFile.size)
    }
  }, [selectedFile])

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // Check if file is selected
      if (!selectedFile) {
        toast({
          title: "Image required",
          description: "Please upload a product image.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Form data before submission:", data)
      console.log("Selected file before submission:", selectedFile)

      // Create FormData for the file upload
      const formData = new FormData()
      formData.append("company_name", data.companyName)
      formData.append("email", data.email)
      formData.append("phone_number", data.phoneNumber)
      formData.append("product_description", data.productDescription)

      // Explicitly add the file with the correct field name
      formData.append("product_image", selectedFile)

      // Log all form data entries for debugging
      console.log("FormData contents:")
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${typeof pair[1] === "object" ? "File: " + (pair[1] as File).name : pair[1]}`)
      }

      // Use axios directly for better debugging
      const response = await axios.post("https://liwedoc.vercel.app/advertisements", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Submission successful:", response.data)

      toast({
        title: "Advertisement submitted",
        description: "We'll review your submission and get back to you soon.",
      })

      form.reset()
      setSelectedFileName("")
      setSelectedFile(null)
    } catch (error: any) {
      console.error("Submission error:", error)

      // Log detailed error information
      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        })
      }

      const errorMessage = error.response?.data?.error || "Your advertisement couldn't be submitted. Please try again."

      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      router.push("/")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    console.log("File input change event:", files)

    if (files && files.length > 0) {
      const file = files[0]
      console.log("File selected:", file.name, file.type, file.size)

      setSelectedFileName(file.name)
      setSelectedFile(file)
      form.setValue("productImage", file)
    } else {
      console.log("No file selected or file selection cleared")
      setSelectedFileName("")
      setSelectedFile(null)
      form.setValue("productImage", undefined)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle >Advertisement Submission</CardTitle>
        <CardDescription>Provide details about your company and product to create an advertisement</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@company.com" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product in detail..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productImage"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>
                    Product Image <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="productImage"
                          className="flex items-center gap-2 px-4 py-2 border border-teal-600 rounded-md cursor-pointer hover:bg-teal-600 hover:text-white"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Choose file</span>
                        </label>
                        {selectedFileName && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{selectedFileName}</span>
                            {selectedFile && (
                              <span className="text-xs text-muted-foreground">
                                ({Math.round(selectedFile.size / 1024)} KB)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <Input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        {...rest}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                  {selectedFile && (
                    <div className="mt-2">
                      <p className="text-xs text-green-600">File selected: {selectedFile.name}</p>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className={`px-8 ${isSubmitting ? "bg-gray-400 text-white" : "bg-teal-600 text-white hover:bg-teal-700"}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Advertisement"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">Our team will review your submission within 2-3 business days</p>
      </CardFooter>
    </Card>
  )
}
