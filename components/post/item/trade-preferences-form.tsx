"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  acceptTrades: z.boolean().default(true),
  acceptCash: z.boolean().default(true),
})

interface TradePreferencesFormProps {
  initialData?: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function TradePreferencesForm({ initialData, onSaveDraft, onContinue, isLoading }: TradePreferencesFormProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptTrades: initialData?.acceptTrades !== undefined ? initialData.acceptTrades : true,
      acceptCash: initialData?.acceptCash !== undefined ? initialData.acceptCash : true,
    },
  })

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
        <h2 className="text-3xl font-bold text-teal-600">Trade Preferences</h2>
        <p className="text-gray-600">Set your preferences for trading or selling your-with item</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="acceptTrades"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accept trades</FormLabel>
                    <p className="text-sm text-gray-500">I'm open to swapping my item for other items</p>
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

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/item/specifications")}
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
                className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-base shadow-md flex items-center"
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

export default TradePreferencesForm