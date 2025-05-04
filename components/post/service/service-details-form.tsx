"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Save } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  experience: z.string({
    required_error: "Please select your experience level.",
  }),
  availability: z.string().optional(),
  duration: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  hasLicense: z.boolean().optional(),
  hasCertification: z.boolean().optional(),
  additionalDetails: z.string().optional(),
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
      experience: initialData?.experience || "",
      availability: initialData?.availability || "",
      duration: initialData?.duration || "",
      qualifications: initialData?.qualifications || [],
      hasLicense: initialData?.hasLicense || false,
      hasCertification: initialData?.hasCertification || false,
      additionalDetails: initialData?.additionalDetails || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    onSaveDraft(values)
  }

  const qualifications = [
    { id: "degree", label: "Degree" },
    { id: "certificate", label: "Certificate" },
    { id: "license", label: "Professional License" },
    { id: "training", label: "Specialized Training" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Experience Level <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base py-6">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="Intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="Experienced">Experienced (3-5 years)</SelectItem>
                    <SelectItem value="Expert">Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Availability</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Weekdays">Weekdays</SelectItem>
                      <SelectItem value="Weekends">Weekends</SelectItem>
                      <SelectItem value="Evenings">Evenings</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Service Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Select service duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Less than 1 hour">Less than 1 hour</SelectItem>
                      <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                      <SelectItem value="Half day">Half day</SelectItem>
                      <SelectItem value="Full day">Full day</SelectItem>
                      <SelectItem value="Multiple days">Multiple days</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Varies">Varies by project</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <FormLabel className="text-base">Qualifications (Optional)</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {qualifications.map((qualification) => (
                <FormField
                  key={qualification.id}
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={qualification.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(qualification.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || []
                              if (checked) {
                                field.onChange([...currentValues, qualification.id])
                              } else {
                                field.onChange(currentValues.filter((value) => value !== qualification.id))
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{qualification.label}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="hasLicense"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Has Professional License</FormLabel>
                    <p className="text-sm text-gray-500">I have a professional license for this service</p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasCertification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Has Certification</FormLabel>
                    <p className="text-sm text-gray-500">I have certification for this service</p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Additional Details (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any other details about your service qualifications..."
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
              onClick={() => router.push("/post/service/basic-info")}
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
