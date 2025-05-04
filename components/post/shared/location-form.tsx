"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getDraftPost, saveDraftPost } from "@/lib/post-storage"
import { ActionButtons } from "./action-buttons"

interface LocationFormProps {
  type: "item" | "service"
  nextStep: string
  previousStep: string
}

export function LocationForm({ type, nextStep, previousStep }: LocationFormProps) {
  const router = useRouter()
  const [city, setCity] = useState("")
  const [subcity, setSubcity] = useState("")
  const [errors, setErrors] = useState({ city: "", subcity: "" })

  useEffect(() => {
    // Load draft data
    const draft = getDraftPost(type)
    if (draft) {
      setCity(draft.city || "")
      setSubcity(draft.subcity || "")
    }
  }, [type])

  const validateForm = () => {
    const newErrors = { city: "", subcity: "" }
    let isValid = true

    if (!city.trim()) {
      newErrors.city = "City is required"
      isValid = false
    }

    if (!subcity.trim()) {
      newErrors.subcity = "Sub-city/Area is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSaveDraft = () => {
    const draft = getDraftPost(type)
    if (draft) {
      saveDraftPost({
        ...draft,
        city,
        subcity,
      })
    }
    router.push("/")
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const draft = getDraftPost(type)
    if (draft) {
      saveDraftPost({
        ...draft,
        city,
        subcity,
      })
    }
    router.push(nextStep)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Location Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subcity">Sub-city/Area</Label>
          <Input
            id="subcity"
            placeholder="Enter sub-city or area"
            value={subcity}
            onChange={(e) => setSubcity(e.target.value)}
          />
          {errors.subcity && <p className="text-sm text-red-500">{errors.subcity}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <ActionButtons
          onBack={() => router.push(previousStep)}
          onSaveDraft={handleSaveDraft}
          onContinue={handleSubmit}
        />
      </CardFooter>
    </Card>
  )
}
