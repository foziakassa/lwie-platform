"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostProgressIndicator } from "@/components/post/post-progress-indicator"
import { getDraftPost, saveDraftPost, clearDraftPost } from "@/lib/post-storage"
import { createItem } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

export default function ItemCreatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [draftData, setDraftData] = useState<any>(null)

  useEffect(() => {
    const draft = getDraftPost("item")
    if (!draft) {
      router.push("/post/item/basic-info")
      return
    }
    setDraftData(draft)
  }, [router])

  const handleSubmit = async () => {
    if (!draftData) return

    try {
      setIsLoading(true)
      const userId = 1 // TODO: Replace with actual user ID from auth context
      const postData = {
        user_id: userId,
        title: draftData.title,
        category_id: draftData.category_id,
        description: draftData.description || null,
        condition: draftData.condition,
        location: draftData.location,
        trade_type: draftData.tradePreferences?.trade_type || "openToAll",
        accept_cash: draftData.tradePreferences?.accept_cash || false,
        price: draftData.tradePreferences?.price ? parseFloat(draftData.tradePreferences.price) : null,
        brand: draftData.specifications?.brand || null,
        model: draftData.specifications?.model || null,
        year: draftData.specifications?.year || null,
        specifications: draftData.specifications?.additionalSpecs || null,
        images: draftData.images ? draftData.images.map((url: string) => ({ url })) : [],
        status: "published",
      }

      await createItem(postData)
      clearDraftPost("item")
      toast({
        title: "Item posted",
        description: "Your item has been successfully posted.",
      })
      router.push("/")
    } catch (error: any) {
      console.error("Error creating item:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to post item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      setIsLoading(true)
      if (draftData) {
        const updatedDraft = {
          ...draftData,
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

      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Review & Submit Item</CardTitle>
        </CardHeader>
        <CardContent>
          {draftData ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <p><strong>Title:</strong> {draftData.title || "N/A"}</p>
                <p><strong>Category ID:</strong> {draftData.category_id || "N/A"}</p>
                <p><strong>Description:</strong> {draftData.description || "No description"}</p>
                <p><strong>Condition:</strong> {draftData.condition || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Specifications</h3>
                <p><strong>Brand:</strong> {draftData.specifications?.brand || "N/A"}</p>
                <p><strong>Model:</strong> {draftData.specifications?.model || "N/A"}</p>
                <p><strong>Year:</strong> {draftData.specifications?.year || "N/A"}</p>
                <p><strong>Additional Specs:</strong> {draftData.specifications?.additionalSpecs ? JSON.stringify(draftData.specifications.additionalSpecs) : "N/A"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Trade Preferences</h3>
                <p><strong>Trade Type:</strong> {draftData.tradePreferences?.trade_type || "N/A"}</p>
                <p><strong>Accept Cash:</strong> {draftData.tradePreferences?.accept_cash ? "Yes" : "No"}</p>
                <p><strong>Price:</strong> {draftData.tradePreferences?.price ? `$${draftData.tradePreferences.price}` : "N/A"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Location</h3>
                <p><strong>Location:</strong> {draftData.location || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Images</h3>
                {draftData.images?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {draftData.images.map((url: string, index: number) => (
                      <img key={index} src={url} alt={`Item image ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                    ))}
                  </div>
                ) : (
                  <p>No images uploaded</p>
                )}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
                  Save Draft
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Post"}
                </Button>
              </div>
            </div>
          ) : (
            <p>Loading draft...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}