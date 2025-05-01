"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { Camera, Loader2, CheckCircle2, Eye, MoveHorizontal, AlertCircle, Database } from "lucide-react"
import { useRouter } from "next/navigation"
import NextImage from "next/image" // Renamed to avoid conflict with browser's Image
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
  const [isActive, setIsActive] = useState(false)

  // For blink detection - enhanced
  const eyeOpenessHistory = useRef<number[]>([])
  const eyeBrightnessHistory = useRef<number[]>([])
  const eyeEdgeDensityHistory = useRef<number[]>([])
  const MAX_HISTORY = 15 // Increased history for better pattern detection
  const blinkCountRef = useRef(0)
  const lastBlinkTime = useRef(0)

  // For movement detection - enhanced
  const facePositionHistory = useRef<Array<{ x: number; y: number }>>([])
  const MAX_POSITION_HISTORY = 10
  const movementScoreRef = useRef(0)

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const debugCanvasRef = useRef<HTMLCanvasElement>(null)

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

      // Reset detection histories
      eyeOpenessHistory.current = []
      eyeBrightnessHistory.current = []
      eyeEdgeDensityHistory.current = []
      facePositionHistory.current = []
      blinkCountRef.current = 0
      movementScoreRef.current = 0

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
          img.crossOrigin = "anonymous" // Add this to avoid CORS issues

          img.onload = () => {
            // Add some padding around the face
            const padding = 50
            const x = Math.max(0, faceBox.x - padding)
            const y = Math.max(0, faceBox.y - padding)
            const width = Math.min(img.width - x, faceBox.width + padding * 2)
            const height = Math.min(img.height - y, faceBox.height + padding * 2)

            // Set canvas size to match the cropped area
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
        if (isActive) {
          router.push("/")
        }
      }, 2000)
    } catch (err: any) {
      console.error("Error saving to database:", err)
      setError(err.message || "Failed to save biometric data")
    } finally {
      setIsSavingToDatabase(false)
    }
  }

  // Enhanced blink detection with multiple detection methods
  const detectBlink = useCallback(
    (video: HTMLVideoElement) => {
      if (!canvasRef.current) return false

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return false

      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get the image data from the eye region (approximate)
      // Use face box to better locate the eyes if available
      let leftEyeRegion = { x: 0, y: 0, width: 0, height: 0 }
      let rightEyeRegion = { x: 0, y: 0, width: 0, height: 0 }

      if (faceBox) {
        // If we have face detection data, use it to locate eyes more precisely
        // Eyes are typically in the upper third of the face
        const eyeY = faceBox.y + faceBox.height * 0.25
        const eyeHeight = faceBox.height * 0.2

        // Left eye region
        leftEyeRegion = {
          x: faceBox.x + faceBox.width * 0.15,
          y: eyeY,
          width: faceBox.width * 0.3,
          height: eyeHeight,
        }

        // Right eye region
        rightEyeRegion = {
          x: faceBox.x + faceBox.width * 0.55,
          y: eyeY,
          width: faceBox.width * 0.3,
          height: eyeHeight,
        }
      } else {
        // Fallback to approximate location
        const centerX = canvas.width / 2
        const centerY = canvas.height / 3
        const eyeWidth = canvas.width / 6
        const eyeHeight = canvas.height / 8

        leftEyeRegion = {
          x: centerX - eyeWidth - eyeWidth / 2,
          y: centerY - eyeHeight / 2,
          width: eyeWidth,
          height: eyeHeight,
        }

        rightEyeRegion = {
          x: centerX + eyeWidth / 2,
          y: centerY - eyeHeight / 2,
          width: eyeWidth,
          height: eyeHeight,
        }
      }

      try {
        // Scale coordinates for the canvas resolution
        const scaleFactor = canvas.width / video.videoWidth

        const leftScaledX = leftEyeRegion.x * scaleFactor
        const leftScaledY = leftEyeRegion.y * scaleFactor
        const leftScaledWidth = leftEyeRegion.width * scaleFactor
        const leftScaledHeight = leftEyeRegion.height * scaleFactor

        const rightScaledX = rightEyeRegion.x * scaleFactor
        const rightScaledY = rightEyeRegion.y * scaleFactor
        const rightScaledWidth = rightEyeRegion.width * scaleFactor
        const rightScaledHeight = rightEyeRegion.height * scaleFactor

        // Get image data for both eyes
        const leftEyeData = ctx.getImageData(leftScaledX, leftScaledY, leftScaledWidth, leftScaledHeight)

        const rightEyeData = ctx.getImageData(rightScaledX, rightScaledY, rightScaledWidth, rightScaledHeight)

        // Process both eyes
        const leftEyeMetrics = processEyeRegion(leftEyeData)
        const rightEyeMetrics = processEyeRegion(rightEyeData)

        // Average the metrics from both eyes
        const avgBrightness = (leftEyeMetrics.brightness + rightEyeMetrics.brightness) / 2
        const avgEdgeDensity = (leftEyeMetrics.edgeDensity + rightEyeMetrics.edgeDensity) / 2
        const avgContrast = (leftEyeMetrics.contrast + rightEyeMetrics.contrast) / 2

        // Add to history
        eyeBrightnessHistory.current.push(avgBrightness)
        eyeEdgeDensityHistory.current.push(avgEdgeDensity)
        eyeOpenessHistory.current.push(avgContrast)

        if (eyeBrightnessHistory.current.length > MAX_HISTORY) {
          eyeBrightnessHistory.current.shift()
          eyeEdgeDensityHistory.current.shift()
          eyeOpenessHistory.current.shift()
        }

        // Need enough history to detect blinks
        if (eyeBrightnessHistory.current.length < 5) return false

        // Calculate variance and rate of change in metrics
        const brightnessVariance = calculateVariance(eyeBrightnessHistory.current)
        const edgeDensityVariance = calculateVariance(eyeEdgeDensityHistory.current)
        const contrastVariance = calculateVariance(eyeOpenessHistory.current)

        // Calculate rate of change (derivative)
        const brightnessDerivative = calculateDerivative(eyeBrightnessHistory.current)
        const edgeDensityDerivative = calculateDerivative(eyeEdgeDensityHistory.current)

        // Draw eye regions for debugging
        ctx.strokeStyle = "yellow"
        ctx.lineWidth = 1
        ctx.strokeRect(leftScaledX, leftScaledY, leftScaledWidth, leftScaledHeight)
        ctx.strokeRect(rightScaledX, rightScaledY, rightScaledWidth, rightScaledHeight)

        // Display metrics for debugging
        ctx.font = "10px Arial"
        ctx.fillStyle = "yellow"
        ctx.fillText(`Bri: ${avgBrightness.toFixed(3)}`, 10, 40)
        ctx.fillText(`Edge: ${avgEdgeDensity.toFixed(3)}`, 10, 55)
        ctx.fillText(`Var: ${brightnessVariance.toFixed(3)}`, 10, 70)

        // Multiple blink detection methods for higher sensitivity
        const now = Date.now()

        // Method 1: Brightness variance threshold
        const BRIGHTNESS_VARIANCE_THRESHOLD = 0.0008 // More sensitive
        const brightnessBlinkDetected = brightnessVariance > BRIGHTNESS_VARIANCE_THRESHOLD

        // Method 2: Edge density drop
        const EDGE_DENSITY_THRESHOLD = 0.01
        const edgeBlinkDetected = edgeDensityVariance > EDGE_DENSITY_THRESHOLD

        // Method 3: Rapid brightness change (derivative)
        const DERIVATIVE_THRESHOLD = 0.02
        const derivativeBlinkDetected = Math.abs(brightnessDerivative) > DERIVATIVE_THRESHOLD

        // Method 4: Pattern recognition - look for characteristic blink pattern
        // (brightness drops then rises, edge density drops then rises)
        const patternBlinkDetected = detectBlinkPattern(eyeBrightnessHistory.current, eyeEdgeDensityHistory.current)

        // Combine methods - if ANY method detects a blink, count it as a blink
        // But only count it once per second to avoid multiple detections of the same blink
        if (
          (brightnessBlinkDetected || edgeBlinkDetected || derivativeBlinkDetected || patternBlinkDetected) &&
          now - lastBlinkTime.current > 1000
        ) {
          blinkCountRef.current++
          lastBlinkTime.current = now

          // Draw eye regions in green to indicate blink detected
          ctx.strokeStyle = "lime"
          ctx.lineWidth = 2
          ctx.strokeRect(leftScaledX, leftScaledY, leftScaledWidth, leftScaledHeight)
          ctx.strokeRect(rightScaledX, rightScaledY, rightScaledWidth, rightScaledHeight)

          // Display which method detected the blink
          ctx.fillStyle = "lime"
          ctx.fillText("BLINK DETECTED!", 10, 85)

          return true
        }

        return false
      } catch (err) {
        console.error("Error in blink detection:", err)
        return false
      }
    },
    [faceBox],
  )

  // Helper function to process eye region and extract metrics
  const processEyeRegion = (imageData: ImageData) => {
    let totalBrightness = 0
    let edgeCount = 0
    const pixelValues = []

    // Process pixels to detect both brightness changes and edges
    for (let y = 1; y < imageData.height - 1; y++) {
      for (let x = 1; x < imageData.width - 1; x++) {
        const idx = (y * imageData.width + x) * 4

        // Calculate brightness
        const r = imageData.data[idx]
        const g = imageData.data[idx + 1]
        const b = imageData.data[idx + 2]
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
        totalBrightness += brightness
        pixelValues.push(brightness)

        // Simple edge detection - compare with neighboring pixels
        const idxLeft = (y * imageData.width + (x - 1)) * 4
        const idxRight = (y * imageData.width + (x + 1)) * 4
        const idxUp = ((y - 1) * imageData.width + x) * 4
        const idxDown = ((y + 1) * imageData.width + x) * 4

        const brightLeft = (imageData.data[idxLeft] + imageData.data[idxLeft + 1] + imageData.data[idxLeft + 2]) / 3
        const brightRight = (imageData.data[idxRight] + imageData.data[idxRight + 1] + imageData.data[idxRight + 2]) / 3
        const brightUp = (imageData.data[idxUp] + imageData.data[idxUp + 1] + imageData.data[idxUp + 2]) / 3
        const brightDown = (imageData.data[idxDown] + imageData.data[idxDown + 1] + imageData.data[idxDown + 2]) / 3

        const horizontalDiff = Math.abs(brightLeft - brightRight)
        const verticalDiff = Math.abs(brightUp - brightDown)

        if (horizontalDiff > 20 || verticalDiff > 20) {
          // More sensitive threshold
          edgeCount++
        }
      }
    }

    const avgBrightness = totalBrightness / (imageData.width * imageData.height)
    const edgeDensity = edgeCount / (imageData.width * imageData.height)

    // Calculate contrast (standard deviation of pixel values)
    const avgPixelValue = pixelValues.reduce((sum, val) => sum + val, 0) / pixelValues.length
    const contrast = Math.sqrt(
      pixelValues.reduce((sum, val) => sum + Math.pow(val - avgPixelValue, 2), 0) / pixelValues.length,
    )

    return {
      brightness: avgBrightness,
      edgeDensity: edgeDensity,
      contrast: contrast,
    }
  }

  // Helper function to calculate variance of an array
  const calculateVariance = (array: number[]) => {
    const avg = array.reduce((sum, val) => sum + val, 0) / array.length
    return array.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / array.length
  }

  // Helper function to calculate derivative (rate of change)
  const calculateDerivative = (array: number[]) => {
    if (array.length < 2) return 0
    return array[array.length - 1] - array[array.length - 2]
  }

  // Helper function to detect characteristic blink pattern
  const detectBlinkPattern = (brightnessHistory: number[], edgeDensityHistory: number[]) => {
    if (brightnessHistory.length < 5 || edgeDensityHistory.length < 5) return false

    // Look for a pattern where brightness drops then rises
    const b1 = brightnessHistory[brightnessHistory.length - 5]
    const b2 = brightnessHistory[brightnessHistory.length - 3]
    const b3 = brightnessHistory[brightnessHistory.length - 1]

    // Look for a pattern where edge density drops then rises
    const e1 = edgeDensityHistory[edgeDensityHistory.length - 5]
    const e2 = edgeDensityHistory[edgeDensityHistory.length - 3]
    const e3 = edgeDensityHistory[edgeDensityHistory.length - 1]

    // Check if brightness dropped then rose
    const brightnessPattern = b2 < b1 * 0.9 && b3 > b2 * 1.05

    // Check if edge density dropped then rose
    const edgePattern = e2 < e1 * 0.9 && e3 > e2 * 1.05

    return brightnessPattern || edgePattern
  }

  // Enhanced movement detection with higher sensitivity
  const detectMovement = useCallback((currentPosition: { x: number; y: number }) => {
    // Add current position to history
    facePositionHistory.current.push(currentPosition)

    // Keep history at maximum length
    if (facePositionHistory.current.length > MAX_POSITION_HISTORY) {
      facePositionHistory.current.shift()
    }

    // Need enough history to detect movement
    if (facePositionHistory.current.length < 3) return false

    // Calculate movement metrics
    const totalMovement = calculateTotalMovement(facePositionHistory.current)
    const maxDisplacement = calculateMaxDisplacement(facePositionHistory.current)
    const directionChanges = calculateDirectionChanges(facePositionHistory.current)

    // Multiple movement detection methods for higher sensitivity

    // Method 1: Total movement exceeds threshold
    const TOTAL_MOVEMENT_THRESHOLD = 15 // More sensitive
    const totalMovementDetected = totalMovement > TOTAL_MOVEMENT_THRESHOLD

    // Method 2: Maximum displacement exceeds threshold
    const MAX_DISPLACEMENT_THRESHOLD = 10 // More sensitive
    const maxDisplacementDetected = maxDisplacement > MAX_DISPLACEMENT_THRESHOLD

    // Method 3: Direction changes (indicates deliberate movement)
    const DIRECTION_CHANGES_THRESHOLD = 1
    const directionChangeDetected = directionChanges >= DIRECTION_CHANGES_THRESHOLD

    // Combine methods - if ANY method detects movement, count it
    if (totalMovementDetected || maxDisplacementDetected || directionChangeDetected) {
      // Increment movement score
      movementScoreRef.current += 1

      // If accumulated enough movement score, consider movement detected
      if (movementScoreRef.current >= 3) {
        return true
      }
    }

    return false
  }, [])

  // Helper function to calculate total movement across history
  const calculateTotalMovement = (positions: Array<{ x: number; y: number }>) => {
    let totalMovement = 0

    for (let i = 1; i < positions.length; i++) {
      const xDiff = positions[i].x - positions[i - 1].x
      const yDiff = positions[i].y - positions[i - 1].y
      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
      totalMovement += distance
    }

    return totalMovement
  }

  // Helper function to calculate maximum displacement from starting position
  const calculateMaxDisplacement = (positions: Array<{ x: number; y: number }>) => {
    if (positions.length < 2) return 0

    const startPos = positions[0]
    let maxDisplacement = 0

    for (let i = 1; i < positions.length; i++) {
      const xDiff = positions[i].x - startPos.x
      const yDiff = positions[i].y - startPos.y
      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)

      if (distance > maxDisplacement) {
        maxDisplacement = distance
      }
    }

    return maxDisplacement
  }

  // Helper function to count direction changes (indicates deliberate movement)
  const calculateDirectionChanges = (positions: Array<{ x: number; y: number }>) => {
    if (positions.length < 3) return 0

    let directionChanges = 0
    let lastXDirection = Math.sign(positions[1].x - positions[0].x)
    let lastYDirection = Math.sign(positions[1].y - positions[0].y)

    for (let i = 2; i < positions.length; i++) {
      const xDirection = Math.sign(positions[i].x - positions[i - 1].x)
      const yDirection = Math.sign(positions[i].y - positions[i - 1].y)

      if (xDirection !== 0 && xDirection !== lastXDirection) {
        directionChanges++
        lastXDirection = xDirection
      }

      if (yDirection !== 0 && yDirection !== lastYDirection) {
        directionChanges++
        lastYDirection = yDirection
      }
    }

    return directionChanges
  }

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

                // Check for blink using the enhanced method
                if (faceDetected && !blinkDetected && currentStep === "blink") {
                  const hasBlinkOccurred = detectBlink(video)
                  if (hasBlinkOccurred) {
                    setBlinkDetected(true)
                    setCurrentStep("move")
                    setStatusMessage("Blink detected! Please turn your head slightly to the right and back")
                    setCountdown(5) // Start a 5-second countdown for movement
                  }
                }

                // Detect head movement with enhanced sensitivity
                if (lastFacePosition && blinkDetected && !movementDetected && currentStep === "move") {
                  const hasMovementOccurred = detectMovement(currentPosition)

                  if (hasMovementOccurred) {
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

                  // Display blink count and movement score
                  ctx.font = "12px Arial"
                  ctx.fillStyle = "yellow"
                  ctx.fillText(`Blinks: ${blinkCountRef.current}`, 10, 20)
                  ctx.fillText(`Movement: ${movementScoreRef.current}`, 10, 35)
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
    detectMovement,
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
    eyeBrightnessHistory.current = []
    eyeEdgeDensityHistory.current = []
    facePositionHistory.current = []
    blinkCountRef.current = 0
    movementScoreRef.current = 0
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
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Registration Successful! <span className="text-teal-600">check your email!</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your biometric data has been saved.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please check your email for account activation
                    </p>
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
                        <NextImage
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
                                  width: 640,
                                  height: 480,
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
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
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