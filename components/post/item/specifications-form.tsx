"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Save } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  processor: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  screenSize: z.string().optional(),
  hasCamera: z.boolean().optional(),
  hasBattery: z.boolean().optional(),
  additionalDetails: z.string().optional(),
})

interface SpecificationsFormProps {
  initialData: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function SpecificationsForm({ initialData, onSaveDraft, onContinue, isLoading }: SpecificationsFormProps) {
  const router = useRouter()
  const [category, setCategory] = useState(initialData?.category || "")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: initialData?.brand || "",
      model: initialData?.model || "",
      processor: initialData?.processor || "",
      ram: initialData?.ram || "",
      storage: initialData?.storage || "",
      screenSize: initialData?.screenSize || "",
      hasCamera: initialData?.hasCamera || false,
      hasBattery: initialData?.hasBattery || false,
      additionalDetails: initialData?.additionalDetails || "",
    },
  })

  useEffect(() => {
    if (initialData?.category) {
      setCategory(initialData.category)
    }
  }, [initialData])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    onSaveDraft(values)
  }

  const isElectronics = category === "electronics" || category === "computers" || category === "1" || category === "2"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Brand <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Samsung, Apple, Sony" className="text-base py-6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Model <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., iPhone 13 Pro, Galaxy S21" className="text-base py-6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isElectronics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="processor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Processor</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Intel Core i7, Apple M1" className="text-base py-6" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="screenSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Screen Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 6.1 inches, 15.6 inches" className="text-base py-6" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">RAM</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base py-6">
                            <SelectValue placeholder="Select RAM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2GB">2GB</SelectItem>
                          <SelectItem value="4GB">4GB</SelectItem>
                          <SelectItem value="6GB">6GB</SelectItem>
                          <SelectItem value="8GB">8GB</SelectItem>
                          <SelectItem value="12GB">12GB</SelectItem>
                          <SelectItem value="16GB">16GB</SelectItem>
                          <SelectItem value="32GB">32GB</SelectItem>
                          <SelectItem value="64GB">64GB</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Storage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base py-6">
                            <SelectValue placeholder="Select storage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="16GB">16GB</SelectItem>
                          <SelectItem value="32GB">32GB</SelectItem>
                          <SelectItem value="64GB">64GB</SelectItem>
                          <SelectItem value="128GB">128GB</SelectItem>
                          <SelectItem value="256GB">256GB</SelectItem>
                          <SelectItem value="512GB">512GB</SelectItem>
                          <SelectItem value="1TB">1TB</SelectItem>
                          <SelectItem value="2TB">2TB</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hasCamera"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Has Camera</FormLabel>
                        <p className="text-sm text-gray-500">Device includes a camera</p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasBattery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Has Battery</FormLabel>
                        <p className="text-sm text-gray-500">Device includes a battery</p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Additional Details (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any other specifications or details about your item..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/item/basic-info")}
              className="px-6 py-6 text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="space-x-3">
              <Button type="button" variant="outline" onClick={handleSaveDraft} className="px-6 py-6 text-base">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-base shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}
