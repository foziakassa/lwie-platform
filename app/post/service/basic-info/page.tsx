"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceBasicInfoForm } from "@/components/post/service/service-basic-info-form"
import { PostProgressIndicator } from "@/components/post/post-progress-indicator"
import { getDraftPost, saveDraftPost, initializePost } from "@/lib/post-storage"
import { toast } from "@/components/ui/use-toast"

export default function ServiceBasicInfoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize a new draft if one doesn't exist
    const draft = getDraftPost("service")
    if (!draft) {
      const newDraft = initializePost("service")
      saveDraftPost(newDraft)
    }
  }, [])

  const handleSaveDraft = async (formData: any) => {
    try {
      setIsLoading(true)
      const draft = getDraftPost("service")
      if (draft) {
        const updatedDraft = {
          ...draft,
          ...formData,
          updatedAt: new Date().toISOString(),
        }
        saveDraftPost(updatedDraft)
        toast({
          title: "Draft saved",
          description: "Your service draft has been saved successfully.",
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
      const draft = getDraftPost("service")
      if (draft) {
        const updatedDraft = {
          ...draft,
          ...formData,
          updatedAt: new Date().toISOString(),
        }
        saveDraftPost(updatedDraft)
        router.push("/post/service/details")
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
          { label: "Details", completed: false },
          { label: "Pricing & Terms", completed: false },
          { label: "Location", completed: false },
          { label: "Review & Submit", completed: false },
        ]}
        currentStep={0}
      />

      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Service Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceBasicInfoForm onSaveDraft={handleSaveDraft} onContinue={handleContinue} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
