"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Save, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const formSchema = z.object({
  city: z.string().min(1, { message: "City is required" }),
  subcity: z.string().min(1, { message: "Sub-city/Area is required" }),
  description: z.string().optional(),
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
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [subcities, setSubcities] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: initialData?.city || "",
      subcity: initialData?.subcity || "",
      description: initialData?.description || "",
    },
  })

  useEffect(() => {
    setMounted(true)

    if (initialData?.city) {
      setSelectedCity(initialData.city)
      setSubcities(getSubcitiesByCity(initialData.city))
    }
  }, [initialData])

  // Update subcities when city changes
  useEffect(() => {
    const city = form.watch("city")
    if (city && city !== selectedCity) {
      setSelectedCity(city)
      setSubcities(getSubcitiesByCity(city))
      form.setValue("subcity", "")
    }
  }, [form.watch("city"), selectedCity, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    onSaveDraft(values)
  }

  const cities = [
    { id: "addis_ababa", name: "Addis Ababa" },
    { id: "dire_dawa", name: "Dire Dawa" },
    { id: "bahir_dar", name: "Bahir Dar" },
    { id: "hawassa", name: "Hawassa" },
    { id: "mekelle", name: "Mekelle" },
    { id: "adama", name: "Adama" },
    { id: "gondar", name: "Gondar" },
    { id: "jimma", name: "Jimma" },
    { id: "dessie", name: "Dessie" },
    { id: "bishoftu", name: "Bishoftu" },
  ]

  const getSubcitiesByCity = (city: string): { id: string; name: string }[] => {
    switch (city) {
      case "addis_ababa":
        return [
          { id: "addis_ketema", name: "Addis Ketema" },
          { id: "akaky_kaliti", name: "Akaky Kaliti" },
          { id: "arada", name: "Arada" },
          { id: "bole", name: "Bole" },
          { id: "gullele", name: "Gullele" },
          { id: "kirkos", name: "Kirkos" },
          { id: "kolfe_keranio", name: "Kolfe Keranio" },
          { id: "lideta", name: "Lideta" },
          { id: "nifas_silk_lafto", name: "Nifas Silk-Lafto" },
          { id: "yeka", name: "Yeka" },
        ]
      case "dire_dawa":
        return [
          { id: "sabian", name: "Sabian" },
          { id: "kezira", name: "Kezira" },
          { id: "addis_ketema", name: "Addis Ketema" },
          { id: "gendekore", name: "Gendekore" },
        ]
      case "bahir_dar":
        return [
          { id: "belay_zeleke", name: "Belay Zeleke" },
          { id: "fasilo", name: "Fasilo" },
          { id: "shum_abo", name: "Shum Abo" },
          { id: "tana", name: "Tana" },
        ]
      default:
        return [
          { id: "central", name: "Central" },
          { id: "north", name: "North" },
          { id: "south", name: "South" },
          { id: "east", name: "East" },
          { id: "west", name: "West" },
        ]
    }
  }

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6"
    >
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-teal-600 mr-2" />
        <h2 className="text-xl font-bold">Service Location & Description</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    City <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id} className="py-3">
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    Sub-city/Area <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch("city")}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder={form.watch("city") ? "Select sub-city/area" : "Select city first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {form.watch("city") &&
                        subcities.map((subcity) => (
                          <SelectItem key={subcity.id} value={subcity.id} className="py-3">
                            {subcity.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a detailed description of your service..."
                    className="min-h-[150px]"
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
              onClick={() => router.push("/post/service/pricing-terms")}
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

export default ServiceLocationDescriptionForm
