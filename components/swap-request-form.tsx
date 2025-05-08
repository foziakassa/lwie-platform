import React from "react"

export interface SwapRequestFormProps {
  itemId: string
  itemTitle: string
  onCancel: () => void
}

export const SwapRequestForm: React.FC<SwapRequestFormProps> = ({ itemId, itemTitle, onCancel }) => {
  // Basic form UI placeholder
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Swap Request for: {itemTitle}</h2>
      <form>
        {/* Form fields for swap request would go here */}
        <p>Item ID: {itemId}</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  )
}
