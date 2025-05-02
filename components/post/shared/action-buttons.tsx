"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"

interface ActionButtonsProps {
  isSubmitting: boolean
  isLastStep: boolean
  onBack: () => void
  onSaveDraft: () => void
}

export function ActionButtons({ isSubmitting, isLastStep, onBack, onSaveDraft }: ActionButtonsProps) {
  return (
    <div className="flex justify-between pt-6 border-t mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="px-6 py-6 text-base flex items-center shadow-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <div className="space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          className="px-6 py-6 text-base flex items-center shadow-sm"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button
          type="submit"
          className="bg-[#00796B] hover:bg-[#00695C] px-8 py-6 text-base shadow-md flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
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
              Submitting...
            </>
          ) : (
            <>
              {isLastStep ? "Submit" : "Next"}
              {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
