"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BasicInfoForm } from "@/components/post/item/basic-info-form"
import { PostProgressIndicator } from "@/components/post/post-progress-indicator"
import { getDraftPost, saveDraftPost, initializePost } from "@/lib/post-storage"
import { toast } from "@/components/ui/use-toast"

export default function ItemBasicInfoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize a new draft if one doesn't exist
    const draft = getDraftPost("item")
    if (!draft) {
      const newDraft = initializePost("item")
      saveDraftPost(newDraft)
    }
  }, [])

  const handleSaveDraft = (data: any) => {
    try {
      // Initialize a new post if there isn't one already
      let draft = getDraftPost("item") || initializePost("item")

      // Update with new data
      draft = {
        ...draft,
        ...data,
        updatedAt: new Date().toISOString(),
      }

      // Save the draft
      saveDraftPost(draft)

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
      const draft = getDraftPost("item")
      if (draft) {
        const updatedDraft = {
          ...draft,
          ...formData,
          updatedAt: new Date().toISOString(),
        }
        saveDraftPost(updatedDraft)
        router.push("/post/item/specifications")
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
          { label: "Basic Info", completed: false },
          { label: "Specifications", completed: false },
          { label: "Trade Preferences", completed: false },
          { label: "Location", completed: false },
          { label: "Review & Submit", completed: false },
        ]}
        currentStep={0}
      />

      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Item Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <BasicInfoForm onSaveDraft={handleSaveDraft} onContinue={handleContinue} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
