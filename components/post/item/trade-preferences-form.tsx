"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, ArrowLeft, Save } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  openToOffers: z.boolean().default(true),
  acceptCash: z.boolean().default(false),
  preferredTradeType: z.enum(["any", "specific"]).default("any"),
  specificItems: z.string().optional(),
  preferredCategories: z.array(z.string()).optional(),
  cashValue: z.string().optional(),
})

interface TradePreferencesFormProps {
  initialData: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function TradePreferencesForm({ initialData, onSaveDraft, onContinue, isLoading }: TradePreferencesFormProps) {
  const router = useRouter()
  const [showCashValue, setShowCashValue] = useState(initialData?.acceptCash || false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      openToOffers: initialData?.openToOffers !== undefined ? initialData.openToOffers : true,
      acceptCash: initialData?.acceptCash || false,
      preferredTradeType: initialData?.preferredTradeType || "any",
      specificItems: initialData?.specificItems || "",
      preferredCategories: initialData?.preferredCategories || [],
      cashValue: initialData?.cashValue?.toString() || "",
    },
  })

  // Watch for changes to acceptCash
  const acceptCash = form.watch("acceptCash")
  if (acceptCash !== showCashValue) {
    setShowCashValue(acceptCash)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    onSaveDraft(values)
  }

  const categories = [
    { id: "electronics", label: "Electronics" },
    { id: "clothing", label: "Clothing" },
    { id: "home", label: "Home & Garden" },
    { id: "sports", label: "Sports & Outdoors" },
    { id: "toys", label: "Toys & Games" },
    { id: "books", label: "Books & Media" },
    { id: "beauty", label: "Beauty & Health" },
    { id: "automotive", label: "Automotive" },
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Trade Options</h3>
            <p className="text-sm text-gray-500">How would you like to exchange your item?</p>

            <FormField
              control={form.control}
              name="openToOffers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accept fair trades</FormLabel>
                    <p className="text-sm text-gray-500">
                      I'm open to swapping my item for other items of similar value
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptCash"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accept cash offers</FormLabel>
                    <p className="text-sm text-gray-500">I'm willing to sell my item for money</p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {form.watch("openToOffers") && (
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="text-lg font-medium">Trade Preferences</h3>
              <p className="text-sm text-gray-500">What would you like to receive in exchange?</p>

              <FormField
                control={form.control}
                name="preferredTradeType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="any" />
                          </FormControl>
                          <FormLabel className="font-normal">I'm open to any fair offers (recommended)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="specific" />
                          </FormControl>
                          <FormLabel className="font-normal">I'm looking for specific items</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("preferredTradeType") === "specific" && (
                <FormField
                  control={form.control}
                  name="specificItems"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What specific items are you looking for?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., iPhone 13, PlayStation 5, etc."
                          className="text-base py-6"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="space-y-2">
                <FormLabel>Preferred Categories (Optional)</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <FormField
                      key={category.id}
                      control={form.control}
                      name="preferredCategories"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={category.id}
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || []
                                  if (checked) {
                                    field.onChange([...currentValues, category.id])
                                  } else {
                                    field.onChange(currentValues.filter((value) => value !== category.id))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{category.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {showCashValue && (
            <FormField
              control={form.control}
              name="cashValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cash Value (ETB) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your asking price in ETB"
                      className="text-base py-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                <h3 className="text-sm font-medium text-amber-800 mb-2">Trading Safety Tips</h3>
                <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
                  <li>Meet in public places for exchanges</li>
                  <li>Verify the condition of items before trading</li>
                  <li>Be clear about your expectations</li>
                  <li>Trust your instincts - if something feels off, don't proceed</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/item/specifications")}
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
