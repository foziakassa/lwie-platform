"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpecificationsForm } from "@/components/post/item/specifications-form"
import { PostProgressIndicator } from "@/components/post/post-progress-indicator"
import { getDraftPost, saveDraftPost } from "@/lib/post-storage"
import { toast } from "@/components/ui/use-toast"

export default function ItemSpecificationsPage() {
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

  const handleSaveDraft = async (formData: any) => {
    try {
      setIsLoading(true)
      if (draftData) {
        const updatedDraft = {
          ...draftData,
          ...formData,
          updatedAt: new Date().toISOString(),
        }
        saveDraftPost(updatedDraft)
        toast({
          title: "Draft saved",
          description: "Your item draft has been saved successfully.",
        })
        router.push("/")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error saving draft",
        description: "There was a problem saving your draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = async (formData: any) => {
    try {
      setIsLoading(true)
      if (draftData) {
        const updatedDraft = {
          ...draftData,
          ...formData,
          updatedAt: new Date().toISOString(),
        }
        saveDraftPost(updatedDraft)
        router.push("/post/item/trade-preferences")
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
          { label: "Specifications", completed: false },
          { label: "Trade Preferences", completed: false },
          { label: "Location", completed: false },
          { label: "Review & Submit", completed: false },
        ]}
        currentStep={1}
      />

      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Item Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          {draftData && (
            <SpecificationsForm
              initialData={draftData}
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
