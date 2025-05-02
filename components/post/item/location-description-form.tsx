"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, ArrowLeft, ArrowRight, Save } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  city: z.string().min(1, {
    message: "Please select a city.",
  }),
  subcity: z.string().optional(),
})

export default function LocationDescriptionForm() {
  const router = useRouter()
  const [basicInfo, setBasicInfo] = useState<any>(null)
  const [specifications, setSpecifications] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [subcities, setSubcities] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Load previous steps from local storage
    const savedBasicInfo = localStorage.getItem("itemBasicInfo")
    const savedSpecifications = localStorage.getItem("itemSpecifications")

    if (savedBasicInfo) {
      setBasicInfo(JSON.parse(savedBasicInfo))
    } else {
      router.push("/post/item/basic-info")
      return
    }

    if (savedSpecifications) {
      setSpecifications(JSON.parse(savedSpecifications))
    } else {
      router.push("/post/item/specifications")
      return
    }

    // Check for draft data
    const draftData = localStorage.getItem("itemLocationDescriptionDraft")
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
      localStorage.setItem("itemLocationDescription", JSON.stringify(values))

      // Clear draft
      localStorage.removeItem("itemLocationDescriptionDraft")

      // Show success toast
      toast({
        title: "Location saved",
        description: "Your location has been saved. Let's continue to the next step.",
        duration: 3000,
      })

      router.push("/post/item/trade-preferences")
    } catch (error) {
      console.error("Error saving form data:", error)
      toast({
        title: "Error saving information",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveDraft = () => {
    const values = form.getValues();
    try {
      localStorage.setItem("itemLocationDescriptionDraft", JSON.stringify(values));
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city} className="py-2.5">
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
                  <FormLabel className="text-base">Subcity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("city") || !subcities.length}
                  >
                    <FormControl>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Select your subcity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcities.map((subcity) => (
                        <SelectItem key={subcity} value={subcity} className="py-2.5">
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

          <div className="flex justify-between pt-8 border-t mt-10">
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
                onClick={saveDraft}
                className="px-6 py-6 text-base flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 px-8 py-6 text-base shadow-md flex items-center"
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
