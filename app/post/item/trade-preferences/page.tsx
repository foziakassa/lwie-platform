"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TradePreferencesForm } from "@/components/post/item/trade-preferences-form"
import { PostProgressIndicator } from "@/components/post/post-progress-indicator"
import { getDraftPost, saveDraftPost } from "@/lib/post-storage"
import { toast } from "@/components/ui/use-toast"

export default function ItemTradePreferencesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [draftData, setDraftData] = useState<any>(null)

  useEffect(() => {
    // Get the existing draft
    const draft = getDraftPost("item")
    if (!draft) {
      // Redirect to basic info if no draft exists
      router.push("/post/item/basic-info")
      return
    }
    setDraftData(draft)
  }, [router])

  const handleSaveDraft = (data: any) => {
    try {
      // Get the existing draft
      const draft = getDraftPost("item")
      if (!draft) {
        toast({
          title: "Error",
          description: "No draft found. Please start from the beginning.",
          variant: "destructive",
        })
        router.push("/post/item/basic-info")
        return
      }

      // Update with new data
      const updatedDraft = {
        ...draft,
        tradePreferences: data,
        updatedAt: new Date().toISOString(),
      }

      // Save the updated draft
      saveDraftPost(updatedDraft)

      toast({
        title: "Draft saved",
        description: "Your post has been saved as a draft",
      })

      // Navigate to home
      router.push("/")
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      })
    }
  }

  const handleContinue = async (formData: any) => {
    try {
      setIsLoading(true)
      if (draftData) {
        const updatedDraft = {
          ...draftData,
          tradePreferences: {
            ...draftData.tradePreferences,
            ...formData,
          },
          updatedAt: new Date().toISOString(),
        }
        saveDraftPost(updatedDraft)
        router.push("/post/item/location-description")
      }
    } catch (error) {
      console.error("Error saving form data:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <PostProgressIndicator
        steps={[
          { label: "Basic Info", completed: true },
          { label: "Specifications", completed: true },
          { label: "Trade Preferences", completed: false },
          { label: "Location", completed: false },
          { label: "Review & Submit", completed: false },
        ]}
        currentStep={2}
      />

      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Trade Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          {draftData && (
            <TradePreferencesForm
              initialData={draftData.tradePreferences}
              onSaveDraft={handleSaveDraft}
              onContinue={handleContinue}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
