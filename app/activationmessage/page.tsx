"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Mail, CheckCircle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  Email: string
  activated: boolean
}

export default function ActivationCheck() {
  const [loading, setLoading] = useState(true)
  const [activated, setActivated] = useState(false)
  // const [userEmail, setUserEmail] = useState("")
  const [checking, setChecking] = useState(false)
  const router = useRouter()

  // Get user ID from cookie
  const userId = Cookies.get("userId")
  const userEmail = Cookies.get("userEmail")


  const checkActivation = async () => {
    if (checking) return
    setChecking(true)

    try {
      const res = await fetch(`https://liwedoc.vercel.app/users/${userId}`)
      const user: User = await res.json()

      if (user) {
        // setUserEmail(user.Email)
        if (user.activated) {
          // Save activated status in cookie
          Cookies.set("activated", "true", { expires: 7 })
          setActivated(true)
          // Redirect to home page
          router.push("/")
        } else {
          setActivated(false)
          setLoading(false)
        }
      } else {
        setLoading(false)
        router.push("/") // Redirect if user is not found
      }
    } catch (error) {
      console.error("Activation check failed:", error)
      setLoading(false)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkActivation()

    // Optional: poll every 30 seconds to update activation status
    const interval = setInterval(checkActivation, 30000)
    return () => clearInterval(interval)
  }, [userId, router])

  const handleCheckEmail = () => {
    // Try to open the default email client
    window.location.href = "mailto:"
  }

  const handleRefresh = () => {
    checkActivation()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium text-gray-700">Checking activation status...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!activated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg mx-4 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
              <Mail className="h-8 w-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Activate Your Account</CardTitle>
            <CardDescription className="text-base text-gray-600">
              We've sent an activation link to your email address
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-gray-700">
                Please check your inbox and click the activation link to complete your registration.
              </p>
              {userEmail && (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Email sent to: <span className="font-medium text-gray-700">{userEmail}</span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              {/* <Button onClick={handleCheckEmail} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                <Mail className="h-4 w-4 mr-2" />
                Check Email Inbox
              </Button> */}

              {/* <Button onClick={handleRefresh} variant="outline" className="w-full" size="lg" disabled={checking}>
                {checking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                {checking ? "Checking..." : "Refresh Status"}
              </Button> */}
            </div>

            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>Didn't receive the email?</p>
              <ul className="space-y-1">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes and try refreshing</li>
              </ul>
            </div>

            <div className="flex items-center justify-center text-xs text-gray-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              Status automatically updates every 30 seconds
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If activated, user is redirected, so this won't render
  return null
}
