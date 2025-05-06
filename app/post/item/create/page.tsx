"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PostProgressIndicator } from "@/components/post/post-progress-indicator"
import { ActionButtons } from "@/components/post/shared/action-buttons"
import { getDraftPost, clearDraftPost } from "@/lib/post-storage"
import { createItem } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

export default function ItemCreatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [draftData, setDraftData] = useState<any>(null)

  useEffect(() => {
    const draft = getDraftPost("item")
    if (!draft) {
      router.push("/post/item/basic-info")
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
        draft.images.length > 0,
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
      const itemData = {
        title: draftData.title,
        description: draftData.description || "",
        category: draftData.category,
        subcategory: draftData.subcategory,
        condition: draftData.condition || "Used",
        price: Number.parseFloat(draftData.price) || 0,
        location: `${draftData.city}, ${draftData.subcity}`,
        city: draftData.city,
        subcity: draftData.subcity,
        specifications: {
          brand: draftData.brand || "",
          model: draftData.model || "",
        },
        tradePreferences: draftData.tradePreferences || {
          openToOffers: true,
          acceptCash: true,
        },
        images: draftData.images,
        status: "published",
      }

      // Submit to the API
      const response = await createItem(itemData)

      if (response.success) {
        // Clear the draft
        clearDraftPost("item")

        // Set flag for new post submitted
        localStorage.setItem("newPostSubmitted", "true")

        toast({
          title: "Item posted successfully",
          description: "Your item has been published and is now visible to others.",
        })

        router.push("/post/success")
      } else {
        throw new Error("Failed to create item")
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
          { label: "Specifications", completed: true },
          { label: "Trade Preferences", completed: true },
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
            Your item post is ready to be published. Click the button below to submit your post.
          </p>

          {!isValid && (
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <p className="text-yellow-700 text-sm">
                Some required information is missing. Please go back and complete all required fields.
              </p>
            </div>
          )}

          {draftData && (
            <div className="space-y-4 mt-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Basic Information</h3>
                <p>
                  <span className="font-medium">Title:</span> {draftData.title}
                </p>
                <p>
                  <span className="font-medium">Category:</span> {draftData.category}
                </p>
                <p>
                  <span className="font-medium">Subcategory:</span> {draftData.subcategory}
                </p>
                <p>
                  <span className="font-medium">Condition:</span> {draftData.condition}
                </p>
                <p>
                  <span className="font-medium">Price:</span> {draftData.price} ETB
                </p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Location</h3>
                <p>
                  <span className="font-medium">City:</span> {draftData.city}
                </p>
                <p>
                  <span className="font-medium">Subcity:</span> {draftData.subcity}
                </p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {draftData.images &&
                    draftData.images.map((image: string, index: number) => (
                      <div key={index} className="relative h-20 rounded overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Item image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <ActionButtons
            onBack={() => router.push("/post/item/location-description")}
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
