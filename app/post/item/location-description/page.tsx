import type { Metadata } from "next"
import LocationDescriptionForm from "@/components/post/item/location-description-form"
import PostProgressIndicator from "@/components/post/post-progress-indicator"

export const metadata: Metadata = {
  title: "Location & Description - Post an Item",
  description: "Add location and description details for your item",
}

export default function LocationDescriptionPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <PostProgressIndicator currentStep={3} totalSteps={3} />
        <LocationDescriptionForm />
      </div>
    </div>
  )
}
