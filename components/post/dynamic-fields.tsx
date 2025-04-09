"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface Field {
  id: string
  label: string
  type: "text" | "select" | "textarea" | "checkbox" | "radio" | "number"
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  helpText?: string
}

interface FieldGroup {
  title: string
  fields: Field[]
}

interface DynamicFieldsProps {
  fieldGroups: FieldGroup[]
  values: Record<string, any>
  onChange: (id: string, value: any) => void
}

export default function DynamicFields({ fieldGroups, values, onChange }: DynamicFieldsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Initialize with first section open, others closed
    const initial: Record<string, boolean> = {}
    fieldGroups.forEach((group, index) => {
      initial[group.title] = index === 0
    })
    return initial
  })

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const renderField = (field: Field) => {
    const { id, label, type, required, options, placeholder, helpText } = field
    const value = values[id] || ""

    switch (type) {
      case "text":
      case "number":
        return (
          <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
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
            <label htmlFor={id} className="block text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
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
            <label htmlFor={id} className="block text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
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
            <div className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
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

