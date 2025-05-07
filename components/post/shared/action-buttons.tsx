"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"

interface ActionButtonsProps {
  onBack: () => void
  onSaveDraft: () => void
  onContinue: () => void
  continueText?: string
  saveDraftText?: string
  isLoading?: boolean
  continueDisabled?: boolean
}

export function ActionButtons({
  onBack,
  onSaveDraft,
  onContinue,
  continueText = "Continue",
  saveDraftText = "Save Draft",
  isLoading = false,
  continueDisabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex justify-between w-full">
      <Button type="button" variant="outline" onClick={onBack} className="px-4 py-2" disabled={isLoading}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <div className="space-x-2">
        <Button type="button" variant="outline" onClick={onSaveDraft} className="px-4 py-2" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {saveDraftText}
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="px-4 py-2 bg-[#00A693] hover:bg-[#008F7F] text-white"
          disabled={isLoading || continueDisabled}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            continueText
          )}
        </Button>
      </div>
    </div>
  )
}
