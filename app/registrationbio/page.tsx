"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { Camera, Loader2, CheckCircle2, Eye, MoveHorizontal, AlertCircle, Database } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Webcam from "react-webcam"
import * as faceapi from "face-api.js"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const [showBiometric, setShowBiometric] = useState(true)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [blinkDetected, setBlinkDetected] = useState(false)
  const [movementDetected, setMovementDetected] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Click 'Start Face Scan' to begin")
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [lastFacePosition, setLastFacePosition] = useState<{ x: number; y: number } | null>(null)
  const [faceDetectionInterval, setFaceDetectionInterval] = useState<NodeJS.Timeout | null>(null)
  const [currentStep, setCurrentStep] = useState<"idle" | "face" | "blink" | "move" | "complete" | "capture">("idle")
  const [countdown, setCountdown] = useState<number | null>(null)
  const [instructionText, setInstructionText] = useState("")
  const [isSavingToDatabase, setIsSavingToDatabase] = useState(false)
  const [faceBox, setFaceBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  // For blink detection
  const eyeOpenessHistory = useRef<number[]>([])
  const MAX_HISTORY = 10
  const blinkCountRef = useRef(0)
  const lastBlinkTime = useRef(0)

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load face-api models - using only the essential models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatusMessage("Loading face detection models...")

        // Specify the path to the models
        const MODEL_URL = "/models"

        // Load only the essential models
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)

        setModelsLoaded(true)
        setStatusMessage("Models loaded. Click 'Start Face Scan' to begin")
      } catch (error) {
        console.error("Error loading models:", error)
        setError("Failed to load face detection models. Please refresh and try again.")
      }
    }

    loadModels()

    // Cleanup function
    return () => {
      if (faceDetectionInterval) {
        clearInterval(faceDetectionInterval)
      }
    }
  }, [])

  // Update instruction text based on current step
  useEffect(() => {
    switch (currentStep) {
      case "idle":
        setInstructionText("Click 'Start Face Scan' to begin")
        break
      case "face":
        setInstructionText("Position your face in the center of the circle")
        break
      case "blink":
        setInstructionText("Please blink your eyes slowly and clearly")
        break
      case "move":
        setInstructionText("Turn your head slightly to the right and then back to center")
        break
      case "complete":
        setInstructionText("Verification complete! Ready to capture your photo")
        break
      case "capture":
        setInstructionText("Look at the camera with a neutral expression")
        break
    }
  }, [currentStep])

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // When countdown reaches zero
      if (currentStep === "blink" && !blinkDetected) {
        // If blink wasn't detected during countdown, prompt manual confirmation
        setStatusMessage("Did you blink? If yes, click 'Confirm Blink'")
      } else if (currentStep === "move" && !movementDetected) {
        setStatusMessage("Did you move your head? If yes, click 'Confirm Movement'")
      } else if (currentStep === "capture") {
        // Auto-capture after countdown
        captureHighQualityImage()
      }
    }
  }, [countdown, currentStep, blinkDetected, movementDetected])

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setStatusMessage("Starting camera...")
      setError("")

      if (!modelsLoaded) {
        throw new Error("Face detection models are not loaded yet. Please wait.")
      }

      // Set camera as active
      setIsCameraActive(true)
      setCurrentStep("face")
      setStatusMessage("Camera started. Looking for your face...")
    } catch (err) {
      console.error("Error in startCamera:", err)
      setError("Failed to start camera. Please ensure camera permissions are granted.")
      setIsCameraActive(false)
    } finally {
      setIsLoading(false)
    }
  }, [modelsLoaded])

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

  // High quality image capture for database storage
  const captureHighQualityImage = useCallback(() => {
    if (webcamRef.current) {
      // Take a high-quality screenshot
      const imageSrc = webcamRef.current.getScreenshot({
        width: 640,
        height: 480,
      })

      if (imageSrc) {
        // If we have a face box, we can crop the image to just the face
        if (faceBox && canvasRef.current) {
          const canvas = document.createElement("canvas")
          const img = new Image()

          img.onload = () => {
            // Add some padding around the face
            const padding = 50
            const x = Math.max(0, faceBox.x - padding)
            const y = Math.max(0, faceBox.y - padding)
            const width = Math.min(img.width - x, faceBox.width + padding * 2)
            const height = Math.min(img.height - y, faceBox.height + padding * 2)

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext("2d")

            if (ctx) {
              // Draw the cropped face
              ctx.drawImage(img, x, y, width, height, 0, 0, width, height)

              // Get the cropped image
              const croppedImage = canvas.toDataURL("image/jpeg", 0.9)
              setCapturedImage(croppedImage)

              // Now we can save this to the database
              saveImageToDatabase(croppedImage)
            }
          }

          img.src = imageSrc
        } else {
          // If no face box, use the full image
          setCapturedImage(imageSrc)
          saveImageToDatabase(imageSrc)
        }

        return imageSrc
      }
    }
    return null
  }, [webcamRef, faceBox])

  // Function to save image to database
  const saveImageToDatabase = async (imageData: string) => {
    try {
      setIsSavingToDatabase(true)
      setStatusMessage("Saving your biometric data...")

      // Here you would send the image to your backend API
      // Example:
      /*
      const response = await fetch('/api/biometric-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          userId: 'user-id-here', // You would get this from your auth system
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save biometric data');
      }
      */

      // For demo purposes, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setRegistrationComplete(true)
      setStatusMessage("Biometric data saved successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/") // Navigate to home after successful registration
      }, 2000)
    } catch (err: any) {
      console.error("Error saving to database:", err)
      setError(err.message || "Failed to save biometric data")
    } finally {
      setIsSavingToDatabase(false)
    }
  }

  // Simplified blink detection based on pixel intensity changes
  const detectBlink = useCallback((video: HTMLVideoElement) => {
    if (!canvasRef.current) return false

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return false

    // Draw the video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get the image data from the eye region (approximate)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 3
    const eyeRegionWidth = canvas.width / 3
    const eyeRegionHeight = canvas.height / 6

    try {
      const imageData = ctx.getImageData(
        centerX - eyeRegionWidth / 2,
        centerY - eyeRegionHeight / 2,
        eyeRegionWidth,
        eyeRegionHeight,
      )

      // Calculate average brightness of the eye region
      let totalBrightness = 0
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i]
        const g = imageData.data[i + 1]
        const b = imageData.data[i + 2]
        // Calculate perceived brightness
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
        totalBrightness += brightness
      }

      const avgBrightness = totalBrightness / (imageData.data.length / 4)

      // Add to history
      eyeOpenessHistory.current.push(avgBrightness)
      if (eyeOpenessHistory.current.length > MAX_HISTORY) {
        eyeOpenessHistory.current.shift()
      }

      // Need enough history to detect blinks
      if (eyeOpenessHistory.current.length < 5) return false

      // Calculate variance in brightness over recent frames
      const avg = eyeOpenessHistory.current.reduce((sum, val) => sum + val, 0) / eyeOpenessHistory.current.length
      const variance =
        eyeOpenessHistory.current.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
        eyeOpenessHistory.current.length

      // Significant variance indicates a blink
      const VARIANCE_THRESHOLD = 0.0015 // Adjust this value if needed

      // Only detect a new blink if it's been at least 1 second since the last one
      const now = Date.now()
      if (variance > VARIANCE_THRESHOLD && now - lastBlinkTime.current > 1000) {
        blinkCountRef.current++
        lastBlinkTime.current = now
        return true
      }

      return false
    } catch (err) {
      console.error("Error in blink detection:", err)
      return false
    }
  }, [])

  // Manual blink confirmation
  const confirmBlink = () => {
    setBlinkDetected(true)
    setCurrentStep("move")
    setStatusMessage("Blink confirmed! Now please turn your head slightly to the right and back")
    setCountdown(5) // Start countdown for movement
  }

  // Manual movement confirmation
  const confirmMovement = () => {
    setMovementDetected(true)
    setVerificationComplete(true)
    setCurrentStep("complete")
    setStatusMessage("Movement confirmed! Verification complete")
    // Don't capture image yet, wait for explicit capture step
  }

  // Prepare for photo capture
  const prepareForCapture = () => {
    setCurrentStep("capture")
    setStatusMessage("Please look at the camera with a neutral expression")
    setCountdown(3) // 3 second countdown before taking the photo
  }

  // Start face detection when camera becomes active
  useEffect(() => {
    if (isCameraActive && modelsLoaded && !faceDetectionInterval) {
      const interval = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.video && canvasRef.current) {
          const video = webcamRef.current.video

          // Only process if video is playing
          if (video.readyState === 4) {
            // Get video dimensions
            const videoWidth = video.videoWidth
            const videoHeight = video.videoHeight

            // Set canvas dimensions to match video but at lower resolution for performance
            const scaleFactor = 0.5 // Reduce resolution for better performance
            canvasRef.current.width = videoWidth * scaleFactor
            canvasRef.current.height = videoHeight * scaleFactor

            try {
              // Use a smaller size input for faster detection
              const options = new faceapi.TinyFaceDetectorOptions({
                inputSize: 224, // Smaller input size (160, 224, or 320)
                scoreThreshold: 0.5,
              })

              // Only detect faces, skip landmarks for performance
              const detections = await faceapi.detectAllFaces(video, options)

              if (detections.length > 0) {
                // Face is detected
                if (!faceDetected) {
                  setFaceDetected(true)
                  setCurrentStep("blink")
                  setStatusMessage("Face detected! Please blink your eyes slowly")
                  setCountdown(5) // Start a 5-second countdown for blinking
                }

                const detection = detections[0]

                // Store the face box for later use in image cropping
                setFaceBox({
                  x: detection.box.x,
                  y: detection.box.y,
                  width: detection.box.width,
                  height: detection.box.height,
                })

                // Get face position for movement detection
                const currentPosition = {
                  x: detection.box.x,
                  y: detection.box.y,
                }

                // Check for blink using the simplified method
                if (faceDetected && !blinkDetected && currentStep === "blink") {
                  const hasBlinkOccurred = detectBlink(video)
                  if (hasBlinkOccurred) {
                    setBlinkDetected(true)
                    setCurrentStep("move")
                    setStatusMessage("Blink detected! Please turn your head slightly to the right and back")
                    setCountdown(5) // Start a 5-second countdown for movement
                  }
                }

                // Detect head movement
                if (lastFacePosition && blinkDetected && !movementDetected && currentStep === "move") {
                  const xMovement = Math.abs(currentPosition.x - lastFacePosition.x)
                  const yMovement = Math.abs(currentPosition.y - lastFacePosition.y)

                  // If significant movement detected
                  if (xMovement > 30 || yMovement > 30) {
                    setMovementDetected(true)
                    setVerificationComplete(true)
                    setCurrentStep("complete")
                    setStatusMessage("Movement detected! Verification complete. Ready to capture your photo.")
                    setCountdown(null)
                  }
                }

                // Update last positions
                setLastFacePosition(currentPosition)

                // Draw detections on canvas for visualization
                const canvas = canvasRef.current
                const ctx = canvas.getContext("2d")
                if (ctx) {
                  // Clear canvas
                  ctx.clearRect(0, 0, canvas.width, canvas.height)

                  // Draw face detection box
                  ctx.strokeStyle = faceDetected
                    ? blinkDetected
                      ? movementDetected
                        ? "green"
                        : "yellow"
                      : "blue"
                    : "red"
                  ctx.lineWidth = 3
                  ctx.strokeRect(
                    detection.box.x * scaleFactor,
                    detection.box.y * scaleFactor,
                    detection.box.width * scaleFactor,
                    detection.box.height * scaleFactor,
                  )

                  // Draw eye region for debugging
                  if (faceDetected) {
                    const eyeY = detection.box.y + detection.box.height * 0.3
                    const eyeHeight = detection.box.height * 0.15
                    const leftEyeX = detection.box.x + detection.box.width * 0.25
                    const rightEyeX = detection.box.x + detection.box.width * 0.75
                    const eyeWidth = detection.box.width * 0.2

                    ctx.strokeStyle = blinkDetected ? "lime" : "yellow"

                    // Left eye region
                    ctx.strokeRect(
                      leftEyeX * scaleFactor,
                      eyeY * scaleFactor,
                      eyeWidth * scaleFactor,
                      eyeHeight * scaleFactor,
                    )

                    // Right eye region
                    ctx.strokeRect(
                      rightEyeX * scaleFactor,
                      eyeY * scaleFactor,
                      eyeWidth * scaleFactor,
                      eyeHeight * scaleFactor,
                    )
                  }

                  // Display blink count
                  ctx.font = "12px Arial"
                  ctx.fillStyle = "yellow"
                  ctx.fillText(`Blinks: ${blinkCountRef.current}`, 10, 20)
                }
              } else if (faceDetected) {
                // Face was detected but now lost
                setStatusMessage("Face lost. Please center your face in the frame")
              }
            } catch (err) {
              console.error("Error in face detection:", err)
            }
          }
        }
      }, 100) // Check every 100ms

      setFaceDetectionInterval(interval)

      return () => {
        clearInterval(interval)
        setFaceDetectionInterval(null)
      }
    }
  }, [
    isCameraActive,
    modelsLoaded,
    faceDetected,
    blinkDetected,
    movementDetected,
    lastFacePosition,
    detectBlink,
    currentStep,
  ])

  const handleBiometricRegistration = async () => {
    try {
      setIsLoading(true)
      setError("")

      if (!verificationComplete) {
        throw new Error("Face verification incomplete. Please complete all verification steps.")
      }

      // Start the photo capture process
      prepareForCapture()
    } catch (err: any) {
      setError(err.message || "Biometric registration failed")
      setIsLoading(false)
    }
  }

  const resetBiometricScan = () => {
    if (faceDetectionInterval) {
      clearInterval(faceDetectionInterval)
      setFaceDetectionInterval(null)
    }

    setIsCameraActive(false)
    setFaceDetected(false)
    setBlinkDetected(false)
    setMovementDetected(false)
    setVerificationComplete(false)
    setCapturedImage(null)
    setStatusMessage("Click 'Start Face Scan' to begin")
    setError("")
    setLastFacePosition(null)
    eyeOpenessHistory.current = []
    blinkCountRef.current = 0
    setCurrentStep("idle")
    setCountdown(null)
    setFaceBox(null)
  }

  const cancelBiometric = () => {
    setShowBiometric(false)
    resetBiometricScan()
  }

  return (
    <div className="">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Content Box */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Logo and Title */}
            <div className="mt-8 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                {registrationComplete ? (
                  <div className="text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Registration Successful!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your biometric data has been saved.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Redirecting you to the homepage...</p>
                  </div>
                ) : (
                  <>
                    {/* Step Indicator */}
                    <div className="w-full mb-4">
                      <div className="flex justify-between">
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                              currentStep !== "idle" ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            1
                          </div>
                          <p className="text-xs mt-1">Face</p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                              currentStep === "blink" ||
                              currentStep === "move" ||
                              currentStep === "complete" ||
                              currentStep === "capture"
                                ? "bg-teal-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            2
                          </div>
                          <p className="text-xs mt-1">Blink</p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                              currentStep === "move" || currentStep === "complete" || currentStep === "capture"
                                ? "bg-teal-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            3
                          </div>
                          <p className="text-xs mt-1">Move</p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                              currentStep === "complete" || currentStep === "capture"
                                ? "bg-teal-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            4
                          </div>
                          <p className="text-xs mt-1">Photo</p>
                        </div>
                      </div>
                      <div className="relative mt-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-between">
                          <div
                            className={`w-2 h-2 rounded-full ${currentStep !== "idle" ? "bg-teal-500" : "bg-gray-300"}`}
                          ></div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              currentStep === "blink" ||
                              currentStep === "move" ||
                              currentStep === "complete" ||
                              currentStep === "capture"
                                ? "bg-teal-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              currentStep === "move" || currentStep === "complete" || currentStep === "capture"
                                ? "bg-teal-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              currentStep === "complete" || currentStep === "capture" ? "bg-teal-500" : "bg-gray-300"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Current Step Instruction */}
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg w-full text-center mb-2">
                      <div className="flex items-center justify-center mb-2">
                        {currentStep === "face" && <Camera className="w-5 h-5 text-teal-500 mr-2" />}
                        {currentStep === "blink" && <Eye className="w-5 h-5 text-teal-500 mr-2" />}
                        {currentStep === "move" && <MoveHorizontal className="w-5 h-5 text-teal-500 mr-2" />}
                        {currentStep === "complete" && <CheckCircle2 className="w-5 h-5 text-teal-500 mr-2" />}
                        {currentStep === "capture" && <Camera className="w-5 h-5 text-teal-500 mr-2" />}
                        {currentStep === "idle" && <AlertCircle className="w-5 h-5 text-teal-500 mr-2" />}
                        <span className="font-medium text-teal-700 dark:text-teal-300">{instructionText}</span>
                      </div>
                      {countdown !== null && (
                        <div className="text-sm text-teal-600 dark:text-teal-400">
                          {currentStep === "capture"
                            ? `Taking photo in: ${countdown} seconds`
                            : `Time remaining: ${countdown} seconds`}
                        </div>
                      )}
                    </div>

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

                              {/* Canvas for face detection visualization */}
                              <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                                style={{
                                  transform: "scaleX(-1)", // Mirror the canvas to match webcam
                                  borderRadius: "50%", // Ensure it's circular
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
                        <div
                          className={`w-3 h-3 rounded-full mr-1 ${faceDetected ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Face</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-1 ${blinkDetected ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Blink</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-1 ${movementDetected ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Movement</span>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4 w-full">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}

                    {/* Manual confirmation buttons */}
                    {currentStep === "blink" && countdown === 0 && !blinkDetected && (
                      <button
                        onClick={confirmBlink}
                        className="w-full flex justify-center py-2 px-4 border border-teal-300 rounded-md
                        shadow-sm text-sm font-medium text-teal-700 bg-white hover:bg-teal-50 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        Confirm Blink
                      </button>
                    )}

                    {currentStep === "move" && countdown === 0 && !movementDetected && (
                      <button
                        onClick={confirmMovement}
                        className="w-full flex justify-center py-2 px-4 border border-teal-300 rounded-md
                        shadow-sm text-sm font-medium text-teal-700 bg-white hover:bg-teal-50 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        Confirm Movement
                      </button>
                    )}

                    {!isCameraActive ? (
                      // Start camera button
                      <button
                        onClick={startCamera}
                        disabled={isLoading || !modelsLoaded}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full 
                        shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Face Scan"}
                      </button>
                    ) : currentStep === "complete" ? (
                      // Take photo button
                      <button
                        onClick={handleBiometricRegistration}
                        disabled={isLoading || !verificationComplete}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full 
                        shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Take Photo & Complete Registration"
                        )}
                      </button>
                    ) : currentStep === "capture" ? (
                      // Saving to database button
                      <button
                        disabled={true}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full 
                        shadow-sm text-sm font-medium text-white bg-teal-600 opacity-70 cursor-not-allowed"
                      >
                        {isSavingToDatabase ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving to Database...
                          </>
                        ) : (
                          <>
                            <Database className="w-5 h-5 mr-2" /> Taking Photo...
                          </>
                        )}
                      </button>
                    ) : (
                      // Complete verification button (disabled until verification is complete)
                      <button
                        disabled={true}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full 
                        shadow-sm text-sm font-medium text-white bg-teal-600 opacity-50 cursor-not-allowed"
                      >
                        Complete Verification Steps
                      </button>
                    )}

                    <div className="flex space-x-4 w-full">
                      {isCameraActive && !isLoading && !isSavingToDatabase && (
                        <button onClick={resetBiometricScan} className="text-sm text-teal-600 hover:text-teal-500">
                          Reset Scan
                        </button>
                      )}
                      <button
                        onClick={cancelBiometric}
                        className="text-sm text-gray-600 hover:text-gray-500 ml-auto"
                        disabled={isSavingToDatabase}
                      >
                        Back to Form
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
