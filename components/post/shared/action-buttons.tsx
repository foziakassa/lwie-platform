"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  onSaveDraft: () => void
  isSubmitting: boolean
  submitLabel: React.ReactNode
}

export function ActionButtons({ onSaveDraft, isSubmitting, submitLabel }: ActionButtonsProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button type="button" variant="outline" onClick={onSaveDraft} disabled={isSubmitting}>
        Save as Draft
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </div>
  )
}
