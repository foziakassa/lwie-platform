"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Save, MapPin } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  subcity: z.string().min(2, {
    message: "Subcity/Area must be at least 2 characters.",
  }),
  specificLocation: z.string().optional(),
  meetupNotes: z.string().optional(),
})

interface ServiceLocationDescriptionFormProps {
  initialData: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function ServiceLocationDescriptionForm({
  initialData,
  onSaveDraft,
  onContinue,
  isLoading,
}: ServiceLocationDescriptionFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: initialData?.city || "",
      subcity: initialData?.subcity || "",
      specificLocation: initialData?.specificLocation || "",
      meetupNotes: initialData?.meetupNotes || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    onSaveDraft(values)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-teal-600 mr-2" />
        <h2 className="text-2xl font-bold text-[#00A693]">Service Location</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    City <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city name" {...field} className="text-base py-6 border-gray-300" />
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
                  <FormLabel className="text-base font-medium">
                    Subcity/Area <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subcity or area name"
                      {...field}
                      className="text-base py-6 border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specificLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Specific Location (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Near Bole Medhanialem Church"
                    {...field}
                    className="text-base py-6 border-gray-300"
                  />
                </FormControl>
                <FormDescription>Provide a landmark or specific location to help clients find you</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meetupNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information about your service location..."
                    className="min-h-[100px] text-base border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Include any special instructions or details about your service area</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/service/pricing-terms")}
              className="px-6 py-6 text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="px-6 py-6 text-base border-[#00A693] text-[#00A693] hover:bg-[#00A693]/10"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-[#00A693] hover:bg-[#008F7F] px-8 py-6 text-base shadow-md"
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
