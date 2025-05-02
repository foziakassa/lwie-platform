"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, useTexture, Environment, Float, PresentationControls } from "@react-three/drei"
import { easing } from "maath"
import type * as THREE from "three"
import axiosInstance from "@/shared/axiosinstance"
import { X, ArrowRight, Phone, Mail, Loader2 } from "lucide-react"

interface Advertisement {
  id: string
  company_name: string
  email: string
  phone_number: string
  product_description: string
  product_image: string
  created_at?: string
  approved?: boolean
  website_url?: string
}

// Card component that displays in 3D space
function AdCard({
  ad,
  index,
  active,
  total,
  onClick,
}: {
  ad: Advertisement
  index: number
  active: number
  total: number
  onClick: () => void
}) {
  const texture = useTexture(ad.product_image || "/placeholder.svg?height=400&width=600")
  const ref = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  // Calculate position based on index and active card
  const theta = (index - active) * ((2 * Math.PI) / total)
  const radius = 4
  const targetX = Math.sin(theta) * radius
  const targetZ = Math.cos(theta) * radius - radius

  // Animate the card to its position
  useFrame((state, delta) => {
    if (!ref.current) return

    // Smooth position transition
    easing.damp3(ref.current.position, [targetX, 0, targetZ], 0.25, delta)

    // Rotate to face the camera
    const targetRotationY = Math.atan2(targetX, targetZ)
    easing.dampE(ref.current.rotation, [0, targetRotationY, 0], 0.25, delta)

    // Scale based on whether it's the active card
    const targetScale = index === active ? 1.2 : 1
    easing.damp3(ref.current.scale, [targetScale, targetScale, targetScale], 0.25, delta)
  })

  return (
    <mesh
      ref={ref}
      position={[Math.sin(theta) * radius, 0, Math.cos(theta) * radius - radius]}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2, 1.5, 0.1]} />
      <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.5} />

      {/* Front face with image */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[1.8, 0.9]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Company name */}
      <Text position={[0, -0.6, 0.06]} fontSize={0.12} color="#000000" anchorX="center" anchorY="middle" maxWidth={1.7}>
        {ad.company_name}
      </Text>
    </mesh>
  )
}

// 3D scene component
function AdCarousel({
  ads,
  activeIndex,
  setActiveIndex,
  handleViewDetails,
}: {
  ads: Advertisement[]
  activeIndex: number
  setActiveIndex: (index: number) => void
  handleViewDetails: (ad: Advertisement) => void
}) {
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-rotate the carousel
  useEffect(() => {
    autoRotateRef.current = setInterval(() => {
      setActiveIndex((activeIndex + 1) % ads.length)
    }, 5000)

    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current)
    }
  }, [activeIndex, ads.length, setActiveIndex])

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
      <color attach="background" args={["#f8f8f8"]} />
      <fog attach="fog" args={["#f8f8f8", 8, 15]} />

      <PresentationControls
        global
        zoom={0.8}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Float rotationIntensity={0.2} floatIntensity={0.5}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={2048} />

          {ads.map((ad, index) => (
            <AdCard
              key={ad.id}
              ad={ad}
              index={index}
              active={activeIndex}
              total={ads.length}
              onClick={() => {
                setActiveIndex(index)
                if (autoRotateRef.current) clearInterval(autoRotateRef.current)
              }}
            />
          ))}

          {/* Ground plane with shadow */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <shadowMaterial transparent opacity={0.2} />
          </mesh>
        </Float>
      </PresentationControls>

      <Environment preset="city" />
    </Canvas>
  )
}

export default function ThreeDAdvertisement() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [hiddenAdIds, setHiddenAdIds] = useState<string[]>([])

  // Load hidden ad IDs from local storage on component mount
  useEffect(() => {
    const storedHiddenAdIds = localStorage.getItem("hiddenAdIds")
    if (storedHiddenAdIds) {
      setHiddenAdIds(JSON.parse(storedHiddenAdIds))
    }
  }, [])

  // Fetch advertisement data from API
  useEffect(() => {
    const fetchApprovedAdvertisements = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get<Advertisement[]>("/advertisements")

        if (response.data && response.data.length > 0) {
          // Filter out hidden ads
          const visibleAds = response.data.filter((ad) => !hiddenAdIds.includes(ad.id))

          if (visibleAds.length > 0) {
            setAdvertisements(visibleAds)
            setError(null)
          } else {
            setAdvertisements([])
            setError("No approved advertisements found.")
          }
        } else {
          setAdvertisements([])
          setError("No approved advertisements found.")
        }
      } catch (err: any) {
        console.error("Failed to fetch approved advertisements:", err)
        setError("Failed to load advertisements.")
      } finally {
        setLoading(false)
      }
    }

    fetchApprovedAdvertisements()
  }, [hiddenAdIds])

  const handleRemoveAd = (adId: string) => {
    // Add the ad ID to the hiddenAdIds state
    const updatedHiddenAdIds = [...hiddenAdIds, adId]
    setHiddenAdIds(updatedHiddenAdIds)

    // Store the updated hidden ad IDs in local storage
    localStorage.setItem("hiddenAdIds", JSON.stringify(updatedHiddenAdIds))

    // Remove the ad from the current list
    setAdvertisements((prev) => prev.filter((ad) => ad.id !== adId))
  }

  const handleViewDetails = (ad: Advertisement) => {
    // Use a placeholder URL if website_url is not provided
    const websiteUrl = ad?.website_url || "https://example.com"
    window.open(websiteUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-[500px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-teal-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading advertisements...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center w-full max-w-2xl">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (advertisements.length === 0) {
    return null
  }

  const activeAd = advertisements[activeIndex]

  return (
    <div className="container mx-auto py-8">
      <div className="relative bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl overflow-hidden">
        {/* 3D Advertisement Carousel */}
        <div className="h-[500px] w-full">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
              </div>
            }
          >
            <AdCarousel
              ads={advertisements}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              handleViewDetails={() => handleViewDetails(activeAd)}
            />
          </Suspense>
        </div>

        {/* Active Advertisement Details */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{activeAd.company_name}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mt-1 max-w-2xl">
                {activeAd.product_description}
              </p>

              <div className="flex mt-2 space-x-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Mail className="h-4 w-4 mr-1" />
                  <a href={`mailto:${activeAd.email}`} className="hover:underline">
                    {activeAd.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Phone className="h-4 w-4 mr-1" />
                  {activeAd.phone_number}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewDetails(activeAd)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
              >
                Visit Website <ArrowRight className="ml-1 h-4 w-4" />
              </button>
              <button
                onClick={() => handleRemoveAd(activeAd.id)}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close advertisement"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-3 space-x-1">
            {advertisements.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex
                    ? "bg-teal-600"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View advertisement ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
