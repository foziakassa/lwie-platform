"use client"

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
  pricing: z.string({
    required_error: "Please select a pricing type.",
  }),
  priceAmount: z.string().min(1, {
    message: "Please enter a price amount.",
  }),
  negotiable: z.boolean().default(true),
  termsAndConditions: z.string().optional(),
})

interface ServicePricingTermsFormProps {
  initialData: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function ServicePricingTermsForm({
  initialData,
  onSaveDraft,
  onContinue,
  isLoading,
}: ServicePricingTermsFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricing: initialData?.pricing || "fixed",
      priceAmount: initialData?.priceAmount?.toString() || "",
      negotiable: initialData?.negotiable !== undefined ? initialData.negotiable : true,
      termsAndConditions: initialData?.termsAndConditions || "",
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
      className="bg-white rounded-xl p-6"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="pricing"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Pricing Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base py-6">
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                    <SelectItem value="project">Project-Based</SelectItem>
                    <SelectItem value="daily">Daily Rate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Price (ETB) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`Enter ${
                      form.watch("pricing") === "hourly"
                        ? "hourly rate"
                        : form.watch("pricing") === "daily"
                          ? "daily rate"
                          : "price"
                    } in ETB`}
                    className="text-base py-6"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="negotiable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Price is negotiable</FormLabel>
                  <p className="text-sm text-gray-500">I'm open to discussing the price with potential clients</p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Terms & Conditions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any terms or conditions for your service..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-amber-800 mb-2">Service Provider Tips</h3>
                <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
                  <li>Be clear about what is included in your price</li>
                  <li>Consider market rates when setting your prices</li>
                  <li>Specify any additional costs that may apply</li>
                  <li>Include your payment terms and methods</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/service/details")}
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
