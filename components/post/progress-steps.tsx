"use client"

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function ProgressSteps({ steps, currentStep, onStepClick }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={stepNumber} className="flex flex-1 items-center">
            <div
              className={`flex flex-col items-center ${onStepClick ? "cursor-pointer" : ""}`}
              onClick={() => onStepClick && isCompleted && onStepClick(stepNumber)}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : isCompleted
                      ? "bg-teal-100 text-teal-600"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNumber}
              </div>
              <div className="text-xs mt-1 text-center">{step}</div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={`h-1 ${isCompleted || (index === currentStep - 1) ? "bg-teal-600" : "bg-gray-200"}`}
                ></div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

