"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Save, Clock } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  duration: z.string().optional(),
  availability: z.string().min(5, {
    message: "Please provide your availability details (at least 5 characters).",
  }),
  experience: z.string().optional(),
  qualifications: z.string().optional(),
})

interface ServiceDetailsFormProps {
  initialData: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function ServiceDetailsForm({ initialData, onSaveDraft, onContinue, isLoading }: ServiceDetailsFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: initialData?.duration || "",
      availability: initialData?.availability || "",
      experience: initialData?.experience || "",
      qualifications: initialData?.qualifications || "",
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
        <Clock className="h-6 w-6 text-teal-600 mr-2" />
        <h2 className="text-2xl font-bold text-[#00A693]">Service Details</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Service Duration (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base py-6 border-gray-300">
                      <SelectValue placeholder="Select typical service duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="less_than_1_hour">Less than 1 hour</SelectItem>
                    <SelectItem value="1_to_2_hours">1-2 hours</SelectItem>
                    <SelectItem value="2_to_4_hours">2-4 hours</SelectItem>
                    <SelectItem value="half_day">Half day</SelectItem>
                    <SelectItem value="full_day">Full day</SelectItem>
                    <SelectItem value="multiple_days">Multiple days</SelectItem>
                    <SelectItem value="varies">Varies by project</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How long does your service typically take to complete?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Availability <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="E.g., Weekdays 9am-5pm, Weekends by appointment only"
                    className="min-h-[100px] text-base border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormDescription>When are you available to provide this service?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Experience (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your experience in this field"
                    className="min-h-[100px] text-base border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Share your relevant experience to build trust with potential clients</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qualifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Qualifications (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any relevant qualifications, certifications, or credentials"
                    className="min-h-[100px] text-base border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include any certifications, degrees, or training that qualify you for this service
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/service/basic-info")}
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
