"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Check, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface Step {
  number?: number
  label: string
  completed?: boolean
}

interface PostProgressIndicatorProps {
  currentStep: number
  totalSteps?: number
  steps?: Step[]
}

export function PostProgressIndicator({
  currentStep,
  totalSteps,
  steps = [
    { label: "Basic Info", completed: false },
    { label: "Specifications", completed: false },
    { label: "Location", completed: false },
  ],
}: PostProgressIndicatorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate total steps if not provided
  const calculatedTotalSteps = totalSteps || steps.length

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/post/selection"
          className="flex items-center text-[#00796B] hover:text-[#00695C] transition-colors"
        >
          <div className="bg-[#E0F2F1] rounded-full p-1.5 mr-2 transition-all duration-300 hover:bg-[#B2DFDB]">
            <ArrowLeft className="h-4 w-4 text-[#00796B]" />
          </div>
          <span className="font-medium">Back to Post Types</span>
        </Link>
        <div className="text-sm bg-[#E0F2F1] text-[#00796B] font-medium px-3 py-1 rounded-full">
          Step {currentStep + 1} of {calculatedTotalSteps}
        </div>
      </div>

      <div className="hidden md:block relative mb-8">
        {/* Progress line */}
        <div className="absolute top-[22px] left-0 right-0 h-1 bg-gray-200 rounded-full -z-10"></div>
        <motion.div
          className="absolute top-[22px] left-0 h-1 bg-[#00796B] rounded-full -z-10"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (calculatedTotalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        ></motion.div>

        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index === currentStep
                  ? "text-[#00796B]"
                  : index < currentStep || step.completed
                    ? "text-[#00796B]"
                    : "text-gray-400"
              }`}
            >
              <motion.div
                className={`flex items-center justify-center w-11 h-11 rounded-full mb-3 ${
                  index === currentStep
                    ? "bg-[#00796B] text-white shadow-md"
                    : index < currentStep || step.completed
                      ? "bg-[#B2DFDB] text-[#00796B]"
                      : "bg-white border border-gray-200 text-gray-400"
                }`}
                initial={{ scale: 1 }}
                animate={{
                  scale: index === currentStep ? [1, 1.05, 1] : 1,
                  y: index === currentStep ? [0, -3, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {index < currentStep || step.completed ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.number || index + 1}</span>
                )}
              </motion.div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  index === currentStep
                    ? "text-[#00796B]"
                    : index < currentStep || step.completed
                      ? "text-[#00796B]"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile progress indicator */}
      <div className="md:hidden mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-base font-medium text-[#00796B]">{steps[currentStep].label}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {currentStep + 1}/{calculatedTotalSteps}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#00796B] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / calculatedTotalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>
    </div>
  )
}
