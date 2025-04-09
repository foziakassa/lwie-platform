"use client"

import { useState } from "react"
import { ChevronDown, Clock, HelpCircle } from "lucide-react"

interface ServiceField {
  id: string
  label: string
  type: "text" | "select" | "textarea" | "checkbox" | "radio" | "number" | "time" | "tags" | "days"
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  helpText?: string
}

interface ServiceFieldGroup {
  title: string
  fields: ServiceField[]
}

interface DynamicServiceFieldsProps {
  fieldGroups: ServiceFieldGroup[]
  values: Record<string, any>
  onChange: (id: string, value: any) => void
}

export default function DynamicServiceFields({ fieldGroups, values, onChange }: DynamicServiceFieldsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Initialize with first section open, others closed
    const initial: Record<string, boolean> = {}
    fieldGroups.forEach((group, index) => {
      initial[group.title] = index === 0
    })
    return initial
  })

  const [tagInput, setTagInput] = useState("")

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleAddTag = (fieldId: string) => {
    if (!tagInput.trim()) return

    const currentTags = values[fieldId] || []
    if (!currentTags.includes(tagInput.trim())) {
      onChange(fieldId, [...currentTags, tagInput.trim()])
    }
    setTagInput("")
  }

  const handleRemoveTag = (fieldId: string, tag: string) => {
    const currentTags = values[fieldId] || []
    onChange(
      fieldId,
      currentTags.filter((t: string) => t !== tag),
    )
  }

  const handleDayToggle = (fieldId: string, day: string) => {
    const currentDays = values[fieldId] || []
    if (currentDays.includes(day)) {
      onChange(
        fieldId,
        currentDays.filter((d: string) => d !== day),
      )
    } else {
      onChange(fieldId, [...currentDays, day])
    }
  }

  const renderField = (field: ServiceField) => {
    const { id, label, type, required, options, placeholder, helpText } = field
    const value = values[id] || (type === "tags" || type === "days" ? [] : "")

    switch (type) {
      case "text":
      case "number":
        return (
          <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium flex items-center">
              {label} {required && <span className="text-red-500">*</span>}
              {helpText && (
                <button className="ml-1 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              )}
            </label>
            <input
              type={type}
              id={id}
              value={value}
              onChange={(e) => onChange(id, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium flex items-center">
              {label} {required && <span className="text-red-500">*</span>}
              {helpText && (
                <button className="ml-1 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              )}
            </label>
            <textarea
              id={id}
              value={value}
              onChange={(e) => onChange(id, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[120px]"
            />
            {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
          </div>
        )

      case "select":
        return (
          <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium flex items-center">
              {label} {required && <span className="text-red-500">*</span>}
              {helpText && (
                <button className="ml-1 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              )}
            </label>
            <div className="relative">
              <select
                id={id}
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
              >
                <option value="">{placeholder || "Select an option"}</option>
                {options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={id}
              checked={!!value}
              onChange={(e) => onChange(id, e.target.checked)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            {helpText && <p className="text-xs text-gray-500 ml-6">{helpText}</p>}
          </div>
        )

      case "radio":
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center">
              {label} {required && <span className="text-red-500">*</span>}
              {helpText && (
                <button className="ml-1 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {options?.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name={id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange(id, option.value)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
          </div>
        )

      case "time":
        return (
          <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="time"
                id={id}
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
          </div>
        )

      case "tags":
        return (
          <div className="space-y-4">
            <h3 className="text-base font-medium flex items-center">
              {label} {required && <span className="text-red-500">*</span>}
              {helpText && (
                <button className="ml-2 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              )}
            </h3>

            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder={placeholder || "Add tags (press Enter after each)"}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag(id)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddTag(id)}
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {value.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(id, tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-teal-400 hover:text-teal-500 focus:outline-none focus:text-teal-500"
                  >
                    <span className="sr-only">Remove</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8l4-4m0 0L4 4m4 0v8" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>

            {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
          </div>
        )

      case "days":
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return (
          <div className="space-y-4">
            <h3 className="text-base font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </h3>
            <p className="text-sm text-gray-500">Available Days</p>

            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(id, day)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    value.includes(day)
                      ? "bg-teal-100 text-teal-800 border border-teal-300"
                      : "bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {fieldGroups.map((group) => (
        <div key={group.title} className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection(group.title)}>
            <h3 className="text-base font-medium">{group.title}</h3>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transform transition-transform ${
                openSections[group.title] ? "rotate-180" : ""
              }`}
            />
          </div>

          {openSections[group.title] && (
            <div className="mt-4 space-y-4">
              {group.fields.map((field) => (
                <div key={field.id}>{renderField(field)}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

