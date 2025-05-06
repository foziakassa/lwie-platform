"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceBasicInfoForm } from "@/components/post/service/service-basic-info-form"
import { PostProgressIndicator } from "@/components/post/post-progress-indicator"
import { getDraftPost, saveDraftPost, initializePost, publishPost } from "@/lib/post-storage"
import { createService } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

export default function ServiceBasicInfoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [initialData, setInitialData] = useState<any>(null)

  useEffect(() => {
    // Initialize a new draft if one doesn't exist
    const draft = getDraftPost("service")
    if (!draft) {
      const newDraft = initializePost("service")
      saveDraftPost(newDraft)
      setInitialData(newDraft)
    } else {
      setInitialData(draft)
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

        // Since we've simplified to a single page, we'll submit directly
        const serviceData = {
          user_id: 1, // This would be the actual user ID in a real app
          title: formData.title,
          description: formData.description || "",
          category_id: formData.category,
          subcategory: formData.subcategory,
          location: `${formData.city}, ${formData.subcity}`,
          city: formData.city,
          subcity: formData.subcity,
          experience_years: formData.experience,
          images: formData.images.map((img: string) => ({
            url: img,
            is_main: false,
          })),
          status: "published",
        }

        // Submit to the API
        const response = await createService(serviceData)

        if (response.success) {
          // Publish the post locally
          publishPost(updatedDraft)

          toast({
            title: "Service posted successfully",
            description: "Your service has been published and is now visible to others.",
          })

          router.push("/post/success")
        } else {
          throw new Error("Failed to create service")
        }
      }
    } catch (error) {
      console.error("Error submitting service:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <PostProgressIndicator steps={[{ label: "Service Information", completed: false }]} currentStep={0} />

      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Post a Service</CardTitle>
        </CardHeader>
        <CardContent>
          {initialData && (
            <ServiceBasicInfoForm
              onSaveDraft={handleSaveDraft}
              onContinue={handleContinue}
              isLoading={isLoading}
              initialData={initialData}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
