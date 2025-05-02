"use client"

import { useState, useEffect } from "react"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"

interface LocationFormProps {
  form: any
  type: "item" | "service"
}

export function LocationFormFields({ form, type }: LocationFormProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [subcities, setSubcities] = useState<string[]>([])

  // Update subcities when city changes
  useEffect(() => {
    const city = form.watch("city")
    if (city && city !== selectedCity) {
      setSelectedCity(city)
      setSubcities(getSubcitiesByCity(city))
      form.setValue("subcity", "")
    }
  }, [form.watch("city"), selectedCity, form])

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

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <MapPin className="h-6 w-6 mr-2 text-[#00796B]" />
          <h2 className="text-2xl font-bold text-[#00796B]">Location</h2>
        </div>
        <p className="text-gray-600">Where is your {type === "item" ? "item" : "service"} located?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                City <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="text-base py-6">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
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
              <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCity}>
                <SelectTrigger className="text-base py-6">
                  <SelectValue placeholder={selectedCity ? "Select subcity" : "Select city first"} />
                </SelectTrigger>
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
    </div>
  )
}
