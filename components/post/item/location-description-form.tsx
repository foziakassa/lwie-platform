"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MapPin, ArrowLeft, ArrowRight, Save } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  city: z.string().min(1, {
    message: "Please enter a city.",
  }),
  subcity: z.string().min(1, {
    message: "Please enter a subcity or area.",
  }),
})

interface LocationDescriptionFormProps {
  initialData?: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function LocationDescriptionForm({
  initialData,
  onSaveDraft,
  onContinue,
  isLoading,
}: LocationDescriptionFormProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: initialData?.city || "",
      subcity: initialData?.subcity || "",
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [initialData])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    onSaveDraft(values)
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border p-8"
    >
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <MapPin className="h-6 w-6 mr-2 text-teal-600" />
          <h2 className="text-3xl font-bold">Location</h2>
        </div>
        <p className="text-gray-600">Add your location to help nearby swappers find your item</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    City <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} className="text-base py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Subcity/Area <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your subcity or area" {...field} className="text-base py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between pt-8 border-t mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/item/trade-preferences")}
              className="px-6 py-6 text-base flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Step
            </Button>
            <div className="space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="px-6 py-6 text-base flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 px-8 py-6 text-base shadow-md flex items-center"
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
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
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

export default LocationDescriptionForm
