"use client"
import CreatePostDemo  from "@/components/CreatePost"
import PlanSelectionPage from "@/components/plan-selection-page"

export default function PostItemPage() {

  return (
      <div className="container mx-auto bg-[#f9fafb] dark:bg-[#1f2937] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <CreatePostDemo />
        <PlanSelectionPage />
      </div>
    </div>
  )
}