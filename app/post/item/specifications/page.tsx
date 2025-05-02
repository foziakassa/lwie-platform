import type { Metadata } from "next"
import SpecificationsForm from "@/components/post/item/specifications-form"
import PostProgressIndicator from "@/components/post/post-progress-indicator"

export const metadata: Metadata = {
  title: "Item Specifications - Post an Item",
  description: "Add detailed specifications about your item",
}

export default function SpecificationsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <PostProgressIndicator currentStep={2} totalSteps={4} />
        <SpecificationsForm />
      </div>
    </div>
  )
}
