"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowRight,
  ArrowLeft,
  Save,
  Package,
  Cpu,
  MemoryStickIcon as Memory,
  HardDrive,
  Camera,
  Battery,
} from "lucide-react"
import { motion } from "framer-motion"

// Define subcategory keys
type Subcategory =
  | "Smartphones"
  | "Laptops"
  | "Tablets"
  | "Cars"
  | "Motorcycles"
  | "Sofas"
  | "Tables"
  | "Shirts"
  | "Pants"
  | "Refrigerators"
  | "WashingMachines"
  | "Default"

// Function to map subcategory IDs from itemBasicInfo to Subcategory type
const mapSubcategoryToType = (subcategoryId: string): Subcategory => {
  const subcategoryMap: { [key: string]: Subcategory } = {
    smartphones: "Smartphones",
    laptops: "Laptops",
    tablets: "Tablets",
    cars: "Cars",
    motorcycles: "Motorcycles",
    sofas: "Sofas",
    tables: "Tables",
    shirts: "Shirts",
    pants: "Pants",
    refrigerators: "Refrigerators",
    washing_machines: "WashingMachines",
  }
  return subcategoryMap[subcategoryId.toLowerCase()] || "Default"
}

// Define schemas for different subcategories
const subcategorySchemas: Record<Subcategory, z.ZodObject<any>> = {
  Smartphones: z.object({
    brand: z.string().min(1, { message: "Brand is required" }),
    model: z.string().min(1, { message: "Model is required" }),
    storage: z.string().optional(),
    ram: z.string().optional(),
    camera: z.string().optional(),
    battery: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Laptops: z.object({
    brand: z.string().min(1, { message: "Brand is required" }),
    model: z.string().min(1, { message: "Model is required" }),
    processor: z.string().optional(),
    ram: z.string().optional(),
    storage: z.string().optional(),
    screenSize: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Tablets: z.object({
    brand: z.string().min(1, { message: "Brand is required" }),
    model: z.string().min(1, { message: "Model is required" }),
    storage: z.string().optional(),
    ram: z.string().optional(),
    screenSize: z.string().optional(),
    battery: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Cars: z.object({
    brand: z.string().min(1, { message: "Brand is required" }),
    model: z.string().min(1, { message: "Model is required" }),
    year: z.string().optional(),
    mileage: z.string().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Motorcycles: z.object({
    brand: z.string().min(1, { message: "Brand is required" }),
    model: z.string().min(1, { message: "Model is required" }),
    year: z.string().optional(),
    mileage: z.string().optional(),
    engineSize: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Sofas: z.object({
    type: z.string().min(1, { message: "Type is required" }),
    material: z.string().min(1, { message: "Material is required" }),
    dimensions: z.string().optional(),
    color: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Tables: z.object({
    type: z.string().min(1, { message: "Type is required" }),
    material: z.string().min(1, { message: "Material is required" }),
    dimensions: z.string().optional(),
    color: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Shirts: z.object({
    type: z.string().min(1, { message: "Type is required" }),
    size: z.string().min(1, { message: "Size is required" }),
    material: z.string().optional(),
    color: z.string().optional(),
    brand: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Pants: z.object({
    type: z.string().min(1, { message: "Type is required" }),
    size: z.string().min(1, { message: "Size is required" }),
    material: z.string().optional(),
    color: z.string().optional(),
    brand: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Refrigerators: z.object({
    brand: z.string().min(1, { message: "Brand is required" }),
    model: z.string().min(1, { message: "Model is required" }),
    capacity: z.string().optional(),
    energyRating: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  WashingMachines: z.object({
    brand: z.string().min(1, { message: "Brand is required" }),
    model: z.string().min(1, { message: "Model is required" }),
    capacity: z.string().optional(),
    type: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
  Default: z.object({
    type: z.string().min(1, { message: "Type is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    additionalDetails: z.string().optional(),
  }),
}

// Define interface for field configurations
interface FieldConfig {
  name: string
  label: string
  type: "text" | "select" | "textarea"
  required?: boolean
  options?: string[]
  placeholder?: string
  icon?: React.ReactNode
}

// Define field configurations for each subcategory
const subcategoryFields: Record<Subcategory, FieldConfig[]> = {
  Smartphones: [
    {
      name: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: [
        "Apple",
        "Samsung",
        "Google",
        "Xiaomi",
        "Huawei",
        "OnePlus",
        "Oppo",
        "Tecno",
        "Infinix",
        "Itel",
        "Other",
      ],
    },
    { name: "model", label: "Model", type: "select", required: true, options: [] },
    {
      name: "storage",
      label: "Storage",
      type: "select",
      options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB", "Other"],
      icon: <HardDrive className="h-4 w-4 text-[#00A693]" />,
    },
    {
      name: "ram",
      label: "RAM",
      type: "select",
      options: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB", "Other"],
      icon: <Memory className="h-4 w-4 text-[#00A693]" />,
    },
    {
      name: "camera",
      label: "Camera",
      type: "text",
      placeholder: "e.g., 50MP main, 12MP ultra-wide, 10MP telephoto",
      icon: <Camera className="h-4 w-4 text-[#00A693]" />,
    },
    {
      name: "battery",
      label: "Battery",
      type: "text",
      placeholder: "e.g., 5000mAh, 45W fast charging",
      icon: <Battery className="h-4 w-4 text-[#00A693]" />,
    },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Laptops: [
    {
      name: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "MSI", "Other"],
    },
    { name: "model", label: "Model", type: "select", required: true, options: [] },
    {
      name: "processor",
      label: "Processor",
      type: "text",
      placeholder: "e.g., Intel Core i7-12700H, Apple M2",
      icon: <Cpu className="h-4 w-4 text-[#00A693]" />,
    },
    {
      name: "ram",
      label: "RAM",
      type: "select",
      options: ["4GB", "8GB", "16GB", "32GB", "64GB", "Other"],
      icon: <Memory className="h-4 w-4 text-[#00A693]" />,
    },
    {
      name: "storage",
      label: "Storage",
      type: "select",
      options: ["128GB", "256GB", "512GB", "1TB", "2TB", "Other"],
      icon: <HardDrive className="h-4 w-4 text-[#00A693]" />,
    },
    { name: "screenSize", label: "Screen Size", type: "text", placeholder: "e.g., 15.6 inches" },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Tablets: [
    {
      name: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["Apple", "Samsung", "Lenovo", "Huawei", "Microsoft", "Other"],
    },
    { name: "model", label: "Model", type: "select", required: true, options: [] },
    {
      name: "storage",
      label: "Storage",
      type: "select",
      options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "Other"],
      icon: <HardDrive className="h-4 w-4 text-[#00A693]" />,
    },
    {
      name: "ram",
      label: "RAM",
      type: "select",
      options: ["2GB", "4GB", "6GB", "8GB", "16GB", "Other"],
      icon: <Memory className="h-4 w-4 text-[#00A693]" />,
    },
    { name: "screenSize", label: "Screen Size", type: "text", placeholder: "e.g., 10.9 inches" },
    {
      name: "battery",
      label: "Battery",
      type: "text",
      placeholder: "e.g., 7600mAh",
      icon: <Battery className="h-4 w-4 text-[#00A693]" />,
    },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Cars: [
    {
      name: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Hyundai", "Other"],
    },
    { name: "model", label: "Model", type: "select", required: true, options: [] },
    { name: "year", label: "Year", type: "text", placeholder: "e.g., 2020" },
    { name: "mileage", label: "Mileage", type: "text", placeholder: "e.g., 50000 km" },
    {
      name: "fuelType",
      label: "Fuel Type",
      type: "select",
      options: ["Petrol", "Diesel", "Electric", "Hybrid", "Other"],
    },
    { name: "transmission", label: "Transmission", type: "select", options: ["Automatic", "Manual", "Other"] },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Motorcycles: [
    {
      name: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["Honda", "Yamaha", "Kawasaki", "Harley-Davidson", "BMW", "Other"],
    },
    { name: "model", label: "Model", type: "select", required: true, options: [] },
    { name: "year", label: "Year", type: "text", placeholder: "e.g., 2021" },
    { name: "mileage", label: "Mileage", type: "text", placeholder: "e.g., 10000 km" },
    { name: "engineSize", label: "Engine Size", type: "text", placeholder: "e.g., 600cc" },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Sofas: [
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: ["Sectional", "Loveseat", "Sleeper", "Recliner", "Other"],
    },
    {
      name: "material",
      label: "Material",
      type: "select",
      required: true,
      options: ["Fabric", "Leather", "Microfiber", "Velvet", "Other"],
    },
    { name: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g., 200x80x90 cm" },
    { name: "color", label: "Color", type: "text", placeholder: "e.g., Grey, Brown" },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Tables: [
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: ["Dining", "Coffee", "Side", "Console", "Other"],
    },
    {
      name: "material",
      label: "Material",
      type: "select",
      required: true,
      options: ["Wood", "Glass", "Metal", "Marble", "Other"],
    },
    { name: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g., 120x60x75 cm" },
    { name: "color", label: "Color", type: "text", placeholder: "e.g., Oak, Black" },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Shirts: [
    { name: "type", label: "Type", type: "select", required: true, options: ["T-Shirt", "Button-Up", "Polo", "Other"] },
    {
      name: "size",
      label: "Size",
      type: "select",
      required: true,
      options: ["XS", "S", "M", "L", "XL", "XXL", "Other"],
    },
    { name: "material", label: "Material", type: "text", placeholder: "e.g., Cotton, Polyester" },
    { name: "color", label: "Color", type: "text", placeholder: "e.g., Blue, White" },
    { name: "brand", label: "Brand", type: "text", placeholder: "e.g., Nike, Zara" },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Pants: [
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: ["Jeans", "Chinos", "Sweatpants", "Other"],
    },
    {
      name: "size",
      label: "Size",
      type: "select",
      required: true,
      options: ["XS", "S", "M", "L", "XL", "XXL", "Other"],
    },
    { name: "material", label: "Material", type: "text", placeholder: "e.g., Denim, Cotton" },
    { name: "color", label: "Color", type: "text", placeholder: "e.g., Black, Navy" },
    { name: "brand", label: "Brand", type: "text", placeholder: "e.g., Levi's, Uniqlo" },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Refrigerators: [
    {
      name: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["LG", "Samsung", "Whirlpool", "Bosch", "Other"],
    },
    { name: "model", label: "Model", type: "text", required: true, placeholder: "e.g., RF28R7351SG" },
    { name: "capacity", label: "Capacity", type: "text", placeholder: "e.g., 500L" },
    { name: "energyRating", label: "Energy Rating", type: "text", placeholder: "e.g., A++" },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  WashingMachines: [
    {
      name: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["LG", "Samsung", "Bosch", "Miele", "Other"],
    },
    { name: "model", label: "Model", type: "text", required: true, placeholder: "e.g., WM4000HBA" },
    { name: "capacity", label: "Capacity", type: "text", placeholder: "e.g., 7kg" },
    { name: "type", label: "Type", type: "select", options: ["Front Load", "Top Load", "Other"] },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
  Default: [
    { name: "type", label: "Type", type: "text", required: true, placeholder: "e.g., Tool, Book" },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
      placeholder: "e.g., Cordless drill, 300-page novel",
    },
    {
      name: "additionalDetails",
      label: "Additional Details (Optional)",
      type: "textarea",
      placeholder: "Add any other specifications or details...",
    },
  ],
}

// Subcategories with brand-model relationships
const brandModelSubcategories: Subcategory[] = ["Smartphones", "Laptops", "Tablets", "Cars", "Motorcycles"]

// Define a generic form values type to avoid union type issues
type FormValues = {
  [key: string]: string | undefined
}

interface SpecificationsFormProps {
  initialData?: any
  onSaveDraft: (data: any) => void
  onContinue: (data: any) => void
  isLoading: boolean
}

export function SpecificationsForm({ initialData, onSaveDraft, onContinue, isLoading }: SpecificationsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [subcategory, setSubcategory] = useState<Subcategory>("Default")
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [models, setModels] = useState<string[]>([])

  // Select schema and fields based on subcategory
  const currentSchema = subcategorySchemas[subcategory] || subcategorySchemas.Default
  const currentFields = subcategoryFields[subcategory] || subcategoryFields.Default

  // Initialize form with dynamic schema
  const form = useForm<FormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues:
      initialData ||
      Object.fromEntries(
        currentFields.map((field) => [field.name, field.type === "textarea" ? "" : field.required ? "" : undefined]),
      ),
  })

  useEffect(() => {
    setMounted(true)

    if (initialData) {
      // If initialData is provided, set subcategory based on it
      if (initialData.subcategory) {
        const newSubcategory = mapSubcategoryToType(initialData.subcategory || "")
        setSubcategory(newSubcategory)
      }

      // If brand is provided and it's a brand-model subcategory, set models
      if (initialData.brand && brandModelSubcategories.includes(subcategory)) {
        setSelectedBrand(initialData.brand)
        setModels(getModelsByBrand(initialData.brand, subcategory))
      }

      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [initialData, subcategory])

  // Update models when brand changes for relevant subcategories
  useEffect(() => {
    if (brandModelSubcategories.includes(subcategory)) {
      const subscription = form.watch((value, { name }) => {
        if (name === "brand" && value.brand && value.brand !== selectedBrand) {
          setSelectedBrand(value.brand)
          setModels(getModelsByBrand(value.brand, subcategory))
          form.setValue("model", "")
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [form, selectedBrand, subcategory])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    onContinue(values)
  }

  const handleSaveDraft = () => {
    const values = form.getValues()
    onSaveDraft(values)
  }

  // Brand and model data for subcategories with brand-model relationships
  const getModelsByBrand = (brand: string, subcategory: Subcategory): string[] => {
    switch (subcategory) {
      case "Smartphones":
        switch (brand) {
          case "Apple":
            return [
              "iPhone 15 Pro Max",
              "iPhone 15 Pro",
              "iPhone 15 Plus",
              "iPhone 15",
              "iPhone 14 Pro Max",
              "iPhone 14 Pro",
              "iPhone 14 Plus",
              "iPhone 14",
              "iPhone 13 Pro Max",
              "iPhone 13 Pro",
              "iPhone 13",
              "iPhone 13 Mini",
              "iPhone 12 Pro Max",
              "iPhone 12 Pro",
              "iPhone 12",
              "iPhone 12 Mini",
              "Other",
            ]
          case "Samsung":
            return [
              "Galaxy S23 Ultra",
              "Galaxy S23+",
              "Galaxy S23",
              "Galaxy S22 Ultra",
              "Galaxy S22+",
              "Galaxy S22",
              "Galaxy Z Fold5",
              "Galaxy Z Flip5",
              "Galaxy A54",
              "Galaxy A34",
              "Galaxy A14",
              "Other",
            ]
          case "Google":
            return [
              "Pixel 8 Pro",
              "Pixel 8",
              "Pixel 7 Pro",
              "Pixel 7",
              "Pixel 7a",
              "Pixel 6 Pro",
              "Pixel 6",
              "Pixel 6a",
              "Other",
            ]
          case "Xiaomi":
            return [
              "Xiaomi 13 Ultra",
              "Xiaomi 13 Pro",
              "Xiaomi 13",
              "Redmi Note 12 Pro+",
              "Redmi Note 12 Pro",
              "Redmi Note 12",
              "Other",
            ]
          default:
            return ["Please specify in additional details"]
        }
      case "Laptops":
        switch (brand) {
          case "Apple":
            return ["MacBook Air M2", "MacBook Pro M2", "MacBook Air M1", "MacBook Pro 16-inch", "Other"]
          case "Dell":
            return ["XPS 13", "XPS 15", "Inspiron 14", "Latitude 7430", "Other"]
          case "HP":
            return ["Spectre x360", "Envy 14", "Pavilion 15", "EliteBook 840", "Other"]
          case "Lenovo":
            return ["ThinkPad X1 Carbon", "Yoga 9i", "IdeaPad Slim 5", "Legion 5", "Other"]
          default:
            return ["Please specify in additional details"]
        }
      case "Tablets":
        switch (brand) {
          case "Apple":
            return ["iPad Pro 12.9", "iPad Pro 11", "iPad Air", "iPad Mini", "Other"]
          case "Samsung":
            return ["Galaxy Tab S9", "Galaxy Tab S8", "Galaxy Tab A8", "Other"]
          case "Lenovo":
            return ["Tab P12 Pro", "Tab M10", "Yoga Tab 11", "Other"]
          default:
            return ["Please specify in additional details"]
        }
      case "Cars":
        switch (brand) {
          case "Toyota":
            return ["Corolla", "Camry", "RAV4", "Highlander", "Other"]
          case "Honda":
            return ["Civic", "Accord", "CR-V", "Pilot", "Other"]
          case "Ford":
            return ["F-150", "Mustang", "Explorer", "Escape", "Other"]
          default:
            return ["Please specify in additional details"]
        }
      case "Motorcycles":
        switch (brand) {
          case "Honda":
            return ["CBR600RR", "Gold Wing", "Rebel 500", "Other"]
          case "Yamaha":
            return ["YZF-R1", "MT-07", "V Star 1100", "Other"]
          case "Harley-Davidson":
            return ["Street Glide", "Softail Slim", "Iron 883", "Other"]
          default:
            return ["Please specify in additional details"]
        }
      case "Refrigerators":
      case "WashingMachines":
        return ["Please specify in additional details"]
      default:
        return []
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A693]"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Package className="h-6 w-6 mr-2 text-[#00A693]" />
          <h2 className="text-2xl font-bold text-[#00A693]">
            {subcategory.replace(/([A-Z])/g, " $1").trim()} Specifications
          </h2>
        </div>
        <p className="text-gray-500">Provide detailed specifications to help buyers understand your item better</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentFields.slice(0, Math.min(2, currentFields.length)).map((fieldConfig) => (
              <FormField
                key={fieldConfig.name}
                control={form.control}
                name={fieldConfig.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center">
                      {fieldConfig.icon && <span className="mr-2">{fieldConfig.icon}</span>}
                      {fieldConfig.label} {fieldConfig.required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    {fieldConfig.type === "select" ? (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]">
                            <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(fieldConfig.name === "model" && brandModelSubcategories.includes(subcategory)
                            ? models
                            : fieldConfig.options || []
                          ).map((option) => (
                            <SelectItem key={option} value={option} className="py-3">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input
                          placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label.toLowerCase()}`}
                          className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {currentFields.length > 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFields.slice(2, Math.min(4, currentFields.length)).map((fieldConfig) => (
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center">
                        {fieldConfig.icon && <span className="mr-2">{fieldConfig.icon}</span>}
                        {fieldConfig.label} {fieldConfig.required && <span className="text-red-500">*</span>}
                      </FormLabel>
                      {fieldConfig.type === "select" ? (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]">
                              <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(fieldConfig.options || []).map((option) => (
                              <SelectItem key={option} value={option} className="py-3">
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input
                            placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label.toLowerCase()}`}
                            className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          {currentFields.length > 4 &&
            currentFields.slice(4).map((fieldConfig) => (
              <FormField
                key={fieldConfig.name}
                control={form.control}
                name={fieldConfig.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center">
                      {fieldConfig.icon && <span className="mr-2">{fieldConfig.icon}</span>}
                      {fieldConfig.label} {fieldConfig.required && <span className="text-red-500">*</span>}
                    </FormLabel>
                    {fieldConfig.type === "textarea" ? (
                      <FormControl>
                        <Textarea
                          placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label.toLowerCase()}`}
                          className="min-h-[100px] text-base border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    ) : fieldConfig.type === "select" ? (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]">
                            <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(fieldConfig.options || []).map((option) => (
                            <SelectItem key={option} value={option} className="py-3">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input
                          placeholder={fieldConfig.placeholder || `Enter ${fieldConfig.label.toLowerCase()}`}
                          className="text-base py-6 border-gray-300 focus:border-[#00A693] focus:ring-[#00A693]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    )}
                    {fieldConfig.type === "textarea" && (
                      <FormDescription>
                        Include any other relevant details that might help potential buyers.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/item/basic-info")}
              className="px-6 py-6 text-base border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="px-6 py-6 text-base border-[#00A693] text-[#00A693] hover:bg-[#00A693]/10"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="submit"
                className="bg-[#00A693] hover:bg-[#008F7F] px-8 py-6 text-base shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}

export default SpecificationsForm
