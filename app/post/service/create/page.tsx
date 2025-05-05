"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PostProgressIndicator } from "@/components/post/post-progress-indicator"
import { ActionButtons } from "@/components/post/shared/action-buttons"
import { getDraftPost, publishPost } from "@/lib/post-storage"
import { createService } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

export default function ServiceCreatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [draftData, setDraftData] = useState<any>(null)

  useEffect(() => {
    const draft = getDraftPost("service")
    if (!draft) {
      router.push("/post/service/basic-info")
      return
    }

    setDraftData(draft)

    // Validate the draft has all required fields
    const isComplete = Boolean(
      draft.title &&
        draft.category &&
        draft.subcategory &&
        draft.city &&
        draft.subcity &&
        draft.images &&
        draft.images.length > 0 &&
        draft.pricingTerms &&
        draft.pricingTerms.pricing,
    )

    setIsValid(isComplete)
  }, [router])

  const handleSubmit = async () => {
    if (!draftData || !isValid) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Format the data for the API
      const serviceData = {
        title: draftData.title,
        description: draftData.description || "",
        category_id: draftData.category,
        subcategory: draftData.subcategory,
        location: `${draftData.city}, ${draftData.subcity}`,
        city: draftData.city,
        subcity: draftData.subcity,
        service_details: {
          duration: draftData.serviceDetails?.duration || "",
          availability: draftData.serviceDetails?.availability || "",
        },
        pricing_terms: {
          pricing_type: draftData.pricingTerms?.pricing || "fixed",
          hourly_rate: Number.parseFloat(draftData.pricingTerms?.priceAmount) || 0,
          negotiable: draftData.pricingTerms?.negotiable || true,
          terms_conditions: draftData.pricingTerms?.termsAndConditions || "",
        },
        images: draftData.images.map((img: any) => ({
          url: img.url,
          is_main: img.main,
        })),
        status: "published",
      }

      // Submit to the API
      const response = await createService(serviceData)

      if (response.success) {
        // Publish the post locally
        publishPost(draftData)

        toast({
          title: "Service posted successfully",
          description: "Your service has been published and is now visible to others.",
        })

        router.push("/post/success")
      } else {
        throw new Error("Failed to create service")
      }
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: "Error submitting post",
        description: "There was a problem submitting your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <PostProgressIndicator
        steps={[
          { label: "Basic Info", completed: true },
          { label: "Details", completed: true },
          { label: "Pricing & Terms", completed: true },
          { label: "Location", completed: true },
          { label: "Review & Submit", completed: false },
        ]}
        currentStep={4}
      />

      <Card className="w-full max-w-md mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Review & Submit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Your service post is ready to be published. Click the button below to submit your post.
          </p>

          {!isValid && (
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <p className="text-yellow-700 text-sm">
                Some required information is missing. Please go back and complete all required fields.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <ActionButtons
            onBack={() => router.push("/post/service/location-description")}
            onSaveDraft={() => router.push("/")}
            onContinue={handleSubmit}
            continueText={isSubmitting ? "Submitting..." : "Submit Post"}
            saveDraftText="Save & Exit"
            isLoading={isSubmitting}
            continueDisabled={!isValid || isSubmitting}
          />
        </CardFooter>
      </Card>
    </div>
  )
}
