import type { Metadata } from "next"
import ServiceBasicInfoForm from "@/components/post/service/service-basic-info-form"
import PostProgressIndicator from "@/components/post/post-progress-indicator"

export const metadata: Metadata = {
  title: "Basic Information - Offer a Service",
  description: "Add basic information about your service",
}

export default function ServiceBasicInfoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PostProgressIndicator
          currentStep={1}
          totalSteps={4}
          steps={[
            { number: 1, label: "Basic Info" },
            { number: 2, label: "Service Details" },
            { number: 3, label: "Location & Description" },
            { number: 4, label: "Pricing & Terms" },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-2">Basic Information</h1>
          <p className="text-gray-600 mb-6">Categorize your service and add photos</p>

          <ServiceBasicInfoForm />
        </div>
      </div>
    </div>
  )
}
