"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Save, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  city: z.string({
    required_error: "Please select a city.",
  }),
  subcity: z.string({
    required_error: "Please select a subcity.",
  }),
})

export default function LocationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [subcities, setSubcities] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check if specifications exist
    const savedSpecs = localStorage.getItem("itemSpecifications")
    if (!savedSpecs) {
      router.push("/post/item/specifications")
      return
    }

    // Check for draft data
    const draftData = localStorage.getItem("itemLocationDraft")
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData)
        setTimeout(() => {
          form.reset(parsedData)
          if (parsedData.city) {
            setSelectedCity(parsedData.city)
            setSubcities(getSubcitiesByCity(parsedData.city))
          }
        }, 100)
      } catch (error) {
        console.error("Error loading draft data:", error)
      }
    }

    setLoading(false)
  }, [router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      subcity: "",
    },
  })

  // Update subcities when city changes
  useEffect(() => {
    const city = form.watch("city")
    if (city && city !== selectedCity) {
      setSelectedCity(city)
      setSubcities(getSubcitiesByCity(city))
      form.setValue("subcity", "")
    }
  }, [form.watch("city"), selectedCity])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Save to local storage for now
      localStorage.setItem("itemLocation", JSON.stringify(values))

      // Clear draft
      localStorage.removeItem("itemLocationDraft")

      // Show success toast
      toast({
        title: "Location saved",
        description: "Your post has been created successfully!",
        duration: 3000,
      })

      router.push("/post/success")
    } catch (error) {
      console.error("Error saving form data:", error)
      toast({
        title: "Error saving location",
        description: "There was a problem saving your location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveDraft = () => {
    const values = form.getValues();
    try {
      localStorage.setItem("itemLocationDraft", JSON.stringify(values));
      toast({
        title: "Draft saved",
        description: "Your location draft has been saved. You can continue later.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error saving draft",
        description: "There was a problem saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cities = [
    "Addis Ababa",
    "Dire Dawa",
    "Bahir Dar",
    "Hawassa",
    "Mekelle",
    "Adama",
    "Gondar",
    "Jimma",
    "Dessie",
    "Bishoftu",
    "Sodo",
    "Jijiga",
    "Shashemene",
    "Arba Minch",
    "Hosaena",
    "Harar",
    "Dilla",
    "Nekemte",
    "Debre Birhan",
    "Asella",
  ]

  const getSubcitiesByCity = (city: string): string[] => {
    switch (city) {
      case "Addis Ababa":
        return [
          "Addis Ketema",
          "Akaky Kaliti",
          "Arada",
          "Bole",
          "Gullele",
          "Kirkos",
          "Kolfe Keranio",
          "Lideta",
          "Nifas Silk-Lafto",
          "Yeka",
        ]
      case "Dire Dawa":
        return ["Dire Dawa City", "Melka Jebdu", "Gendekore", "Legehare"]
      case "Bahir Dar":
        return ["Bahir Dar City", "Shimbit", "Belay Zeleke", "Sefene Selam"]
      case "Hawassa":
        return ["Hawassa City", "Tabor", "Menaharia", "Misrak"]
      case "Mekelle":
        return ["Ayder", "Hadnet", "Hawelti", "Kedamay Weyane", "Quiha"]
      default:
        return ["Central", "North", "South", "East", "West"]
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00796B]"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border p-8"
    >
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <MapPin className="h-6 w-6 mr-2 text-[#00796B]" />
          <h2 className="text-2xl font-bold text-[#00796B]">Location</h2>
        </div>
        <p className="text-gray-600">Where is your item located?</p>
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
                        <SelectItem key={city} value={city} className="py-3">
                          {city}
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
                    Subcity <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCity}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder={selectedCity ? "Select subcity" : "Select city first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcities.map((subcity) => (
                        <SelectItem key={subcity} value={subcity} className="py-3">
                          {subcity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
              Previous
            </Button>
            <div className="space-x-3">
            <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                className="px-6 py-6 text-base flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-[#00796B] hover:bg-[#00695C] px-8 py-6 text-base shadow-md flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
                    Submit
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
