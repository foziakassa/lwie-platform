"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Webcam from "react-webcam"

interface BiometricVerificationProps {
  onComplete: (imageData: string) => Promise<void>
  onCancel: () => void
}

// Use a more flexible type for the onComplete prop
export default function BiometricVerification({
  onComplete,
  onCancel,
}: {
  onComplete: (imageData: string) => Promise<void> | void
  onCancel: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [blinkDetected, setBlinkDetected] = useState(false)
  const [movementDetected, setMovementDetected] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Click 'Start Face Scan' to begin")
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const webcamRef = useRef<Webcam>(null)
  const router = useRouter()

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setStatusMessage("Starting camera...")
      setError("")

      // Set camera as active - the useEffect will handle the actual camera initialization
      setIsCameraActive(true)
    } catch (err) {
      console.error("Error in startCamera:", err)
      setError("Failed to start camera. Please ensure camera permissions are granted.")
      setIsCameraActive(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setCapturedImage(imageSrc)
        return imageSrc
      }
    }
    return null
  }, [webcamRef])

  // Simulate face detection process
  const startFaceDetection = useCallback(() => {
    if (!isCameraActive) return

    setStatusMessage("Looking for your face...")

    // Simulate face detection (step 1)
    setTimeout(() => {
      setFaceDetected(true)
      setStatusMessage("Face detected! Please blink your eyes")

      // Simulate blink detection (step 2)
      setTimeout(() => {
        setBlinkDetected(true)
        setStatusMessage("Blink detected! Please turn your head slightly to the right and back")

        // Simulate movement detection (step 3)
        setTimeout(() => {
          setMovementDetected(true)
          setStatusMessage("Verification complete! You can now complete your registration")
          setVerificationComplete(true)

          // Capture the image
          captureImage()
        }, 2000)
      }, 2000)
    }, 2000)
  }, [isCameraActive, captureImage])

  // Start face detection when camera becomes active
  useEffect(() => {
    if (isCameraActive && !faceDetected) {
      const timer = setTimeout(() => {
        startFaceDetection()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isCameraActive, faceDetected, startFaceDetection])

  const handleBiometricRegistration = async () => {
    try {
      setIsLoading(true)
      setError("")

      if (!verificationComplete) {
        throw new Error("Face verification incomplete. Please complete all verification steps.")
      }

      if (!capturedImage) {
        throw new Error("No face image captured. Please try again.")
      }

      // Call the onComplete callback with the captured image
      await onComplete(capturedImage)

      setRegistrationComplete(true)
    } catch (err: any) {
      setError(err.message || "Biometric registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const resetBiometricScan = () => {
    setIsCameraActive(false)
    setFaceDetected(false)
    setBlinkDetected(false)
    setMovementDetected(false)
    setVerificationComplete(false)
    setCapturedImage(null)
    setStatusMessage("Click 'Start Face Scan' to begin")
    setError("")
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        {registrationComplete ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">Biometric Registration Successful!</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your face has been registered successfully.</p>
          </div>
        ) : (
          <>
            {/* Camera/Face Container */}
            <div
              className="relative w-48 h-48 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-800 overflow-hidden"
            >
              {capturedImage ? (
                // Show captured image if available
                <Image
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured face"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <>
                  {!isCameraActive ? (
                    // Show camera icon when camera is not active
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Camera className="w-16 h-16 text-gray-400" />
                    </div>
                  ) : (
                    // Show webcam when camera is active
                    <div className="absolute inset-0 w-full h-full">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                          width: 300,
                          height: 300,
                          facingMode: "user",
                        }}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          transform: "scaleX(-1)", // Mirror the video
                          borderRadius: "50%", // Ensure it's circular
                        }}
                        onUserMediaError={(err) => {
                          console.error("Webcam error:", err)
                          setError("Could not access camera. Please ensure camera permissions are granted.")
                          setIsCameraActive(false)
                        }}
                      />

                      {/* Face detection overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div
                          className={`w-36 h-36 border-2 rounded-full ${
                            verificationComplete
                              ? "border-green-500 border-solid"
                              : faceDetected
                                ? "border-yellow-500 border-solid"
                                : "border-gray-400 border-dashed"
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">{statusMessage}</p>

            {/* Verification status indicators */}
            <div className="flex justify-center space-x-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${faceDetected ? "bg-green-500" : "bg-gray-300"}`}></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Face</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${blinkDetected ? "bg-green-500" : "bg-gray-300"}`}></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Blink</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${movementDetected ? "bg-green-500" : "bg-gray-300"}`}></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Movement</span>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4 w-full">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {!isCameraActive ? (
              // Start camera button
              <button
                onClick={startCamera}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full 
                shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Face Scan"}
              </button>
            ) : (
              // Complete registration button
              <button
                onClick={handleBiometricRegistration}
                disabled={isLoading || !verificationComplete}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full 
                shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
              </button>
            )}

            <div className="flex space-x-4 w-full">
              {isCameraActive && !isLoading && (
                <button onClick={resetBiometricScan} className="text-sm text-teal-600 hover:text-teal-500">
                  Reset Scan
                </button>
              )}
              <button onClick={onCancel} className="text-sm text-gray-600 hover:text-gray-500 ml-auto">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
