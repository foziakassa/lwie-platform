"use client"
import PlanSelectionPage from "@/components/plan-selection-page"
import { useRouter } from "next/navigation"

export default function PlansPage() {
  const router = useRouter()

  const handleUpgradeClick = () => {
    // This function is passed to the PlanSelectionPage component
    // It's called when the user clicks the upgrade button in the PostCounter
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlanSelectionPage onUpgradeClick={handleUpgradeClick} />
    </div>
  )
}
