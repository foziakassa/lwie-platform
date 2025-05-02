import type { Metadata } from "next"
import TradePreferencesForm from "@/components/post/item/trade-preferences-form"
import PostProgressIndicator from "@/components/post/post-progress-indicator"

export const metadata: Metadata = {
  title: "Trade Preferences - Post an Item",
  description: "Set your preferences for trading or selling",
}

export default function TradePreferencesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <PostProgressIndicator currentStep={4} totalSteps={4} />
        <TradePreferencesForm />
      </div>
    </div>
  )
}
