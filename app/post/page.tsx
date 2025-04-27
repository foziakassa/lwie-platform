"use client"

import { useState } from "react"
import CreatePostDemo from "@/components/CreatePost"
import PlanSelectionPage from "@/components/plan-selection-page"

export default function PostItemPage() {
  const [showPlanSelection, setShowPlanSelection] = useState(false)

  return (
    <div className="container mx-auto bg-[#f9fafb] dark:bg-[#1f2937] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {!showPlanSelection ? (
          <CreatePostDemo onUpgradeClick={() => setShowPlanSelection(true)} />
        ) : (
          <PlanSelectionPage onUpgradeClick={function (): void {
              throw new Error("Function not implemented.")
            } } />
        )}
      </div>
    </div>
  )
}
