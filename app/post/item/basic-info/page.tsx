import type { Metadata } from "next"
import BasicInfoForm from "@/components/post/item/basic-info-form"
import PostProgressIndicator from "@/components/post/post-progress-indicator"

export const metadata: Metadata = {
  title: "Basic Information - Post an Item",
  description: "Add basic information about your item",
}

export default function BasicInfoPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <PostProgressIndicator currentStep={1} totalSteps={4} />
        <BasicInfoForm />
      </div>
    </div>
  )
}
