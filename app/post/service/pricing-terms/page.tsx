import type { Metadata } from "next"
import ServicePricingTermsForm from "@/components/post/service/service-pricing-terms-form"
import PostProgressIndicator from "@/components/post/post-progress-indicator"

export const metadata: Metadata = {
  title: "Pricing & Terms - Offer a Service",
  description: "Set your pricing and terms for your service",
}

export default function ServicePricingTermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PostProgressIndicator
          currentStep={4}
          totalSteps={4}
          steps={[
            { number: 1, label: "Basic Info" },
            { number: 2, label: "Service Details" },
            { number: 3, label: "Location & Description" },
            { number: 4, label: "Pricing & Terms" },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-2">Pricing & Terms</h1>
          <p className="text-gray-600 mb-6">Set your pricing and terms for this service</p>

          <ServicePricingTermsForm />
        </div>
      </div>
    </div>
  )
}
