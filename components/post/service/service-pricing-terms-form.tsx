"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Save, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  pricing: z.enum(["fixed", "hourly", "daily", "project"]),
  priceAmount: z.coerce
    .number()
    .min(1, { message: "Price must be greater than 0" })
    .max(1000000, { message: "Price must be less than 1,000,000" }),
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
      pricing: initialData?.pricing || "hourly",
      priceAmount: initialData?.priceAmount || 0,
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

  const pricingType = form.watch("pricing")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex items-center mb-6">
        <DollarSign className="h-6 w-6 text-teal-600 mr-2" />
        <h2 className="text-2xl font-bold text-[#00A693]">Pricing & Terms</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="pricing"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  Pricing Type <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fixed" />
                      </FormControl>
                      <FormLabel className="font-normal">Fixed Price</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="hourly" />
                      </FormControl>
                      <FormLabel className="font-normal">Hourly Rate</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="daily" />
                      </FormControl>
                      <FormLabel className="font-normal">Daily Rate</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="project" />
                      </FormControl>
                      <FormLabel className="font-normal">Project-Based</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {pricingType === "fixed"
                    ? "Fixed Price"
                    : pricingType === "hourly"
                      ? "Hourly Rate"
                      : pricingType === "daily"
                        ? "Daily Rate"
                        : "Project Price"}{" "}
                  (ETB) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">ETB</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="text-base py-6 pl-12 border-gray-300"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter your {pricingType === "fixed" ? "fixed price" : `${pricingType} rate`} in Ethiopian Birr
                </FormDescription>
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
                  <FormLabel className="text-base font-medium">Price is negotiable</FormLabel>
                  <FormDescription>
                    Check this if you're open to negotiating the price with potential clients
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Terms and Conditions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any specific terms, conditions, or policies for your service..."
                    className="min-h-[150px] text-base border-gray-300"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include payment terms, cancellation policy, or any other important information clients should know
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
