"use client"

import { useState, useCallback } from "react"

type SavedDraft = {
  timestamp: string
  data: any
}

export function useDraftSave(key: string, initialData: any = {}) {
  // Initialize state from localStorage if available
  const [data, setData] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem(`draft_${key}`)
      if (savedDraft) {
        try {
          return JSON.parse(savedDraft).data
        } catch (e) {
          console.error("Error parsing saved draft:", e)
        }
      }
    }
    return initialData
  })

  const [lastSaved, setLastSaved] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem(`draft_${key}`)
      if (savedDraft) {
        try {
          return JSON.parse(savedDraft).timestamp
        } catch (e) {
          console.error("Error parsing saved draft timestamp:", e)
        }
      }
    }
    return ""
  })

  // Update data
  const updateData = useCallback((newData: any) => {
    setData((prevData: any) => ({
      ...prevData,
      ...newData,
    }))
  }, [])

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const seconds = now.getSeconds().toString().padStart(2, "0")
    const period = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12

    const timeString = `${formattedHours}:${minutes}:${seconds} ${period}`

    const draftData: SavedDraft = {
      timestamp: timeString,
      data,
    }

    localStorage.setItem(`draft_${key}`, JSON.stringify(draftData))
    setLastSaved(timeString)

    return timeString
  }, [key, data])

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    localStorage.removeItem(`draft_${key}`)
    setData(initialData)
    setLastSaved("")
  }, [key, initialData])

  return {
    data,
    updateData,
    saveDraft,
    clearDraft,
    lastSaved,
  }
}

