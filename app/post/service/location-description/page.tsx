import type { Metadata } from "next"
import ServiceLocationDescriptionForm from "@/components/post/service/service-location-description-form"
import PostProgressIndicator from "@/components/post/post-progress-indicator"

export const metadata: Metadata = {
  title: "Location & Description - Offer a Service",
  description: "Add location details for your service",
}

export default function ServiceLocationDescriptionPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PostProgressIndicator
          currentStep={3}
          totalSteps={3}
          steps={[
            { number: 1, label: "Basic Info" },
            { number: 2, label: "Service Details" },
            { number: 3, label: "Location" },
          ]}
        />

        <div className="mt-8">
          <ServiceLocationDescriptionForm />
        </div>
      </div>
    </div>
  )
}
