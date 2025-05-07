import { CheckCircle } from "lucide-react"

interface Step {
  label: string
  completed: boolean
}

interface PostProgressIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function PostProgressIndicator({ steps, currentStep }: PostProgressIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${index === steps.length - 1 ? "flex-1" : "flex-1 relative"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.completed
                  ? "bg-[#00A693] text-white"
                  : index === currentStep
                    ? "bg-[#00A693] text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.completed ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                step.completed || index === currentStep ? "text-[#00A693]" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>

            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 ${step.completed ? "bg-[#00A693]" : "bg-gray-200"}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
