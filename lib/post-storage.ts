export function initializePost(type: "item" | "service") {
  return {
    type,
    title: "",
    category_id: null,
    description: "",
    condition: "",
    location: "",
    images: [],
    tradePreferences: {},
    specifications: {},
    serviceDetails: {},
    pricingTerms: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function saveDraftPost(draft: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`draft-${draft.type}`, JSON.stringify(draft))
  }
}

export function getDraftPost(type: "item" | "service") {
  if (typeof window !== "undefined") {
    const draft = localStorage.getItem(`draft-${type}`)
    return draft ? JSON.parse(draft) : null
  }
  return null
}

export function clearDraftPost(type: "item" | "service") {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`draft-${type}`)
  }
}