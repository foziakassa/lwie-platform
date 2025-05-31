"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, CheckCircle, Clock, RefreshCw, ArrowRight } from "lucide-react"

interface User {
  id: number
  Firstname: string
  Lastname: string
  Email: string
  activated: boolean
  Createdat: string
}

export default function ActivationMessage() {
  const [user, setUser] = useState<User | null>(null)
  const [isactive , setIsActive] =useState(false)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchUserData = async () => {
    // if (showCheckingState) setChecking(true)

    try {
      

    //   const { id: userId } = JSON.parse(authToken)

      const response = await fetch("https://liwedoc.vercel.app/users")
      const users = await response.json()
     const  userdata =users.data
    
        const active = userdata.activated
        if(active){
            setIsActive(true)
        }
    

      

      
    } catch (err) {
      setError("Failed to check activation status")
      console.log("Error fetching user data:", err)
    } finally {
      setLoading(false)
    //   if (showCheckingState) setChecking(false)
    }
  }

  useEffect(() => {
    fetchUserData()

    // Poll every 30 seconds to check activation status
    const interval = setInterval(() => {
      if (!checking) {
        fetchUserData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [checking])

  const handleCheckNow = () => {
    fetchUserData()
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="text-lg">Checking activation status...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-base">
            We've sent an activation link to your email address. Please check your inbox and click the link to activate
            your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {user && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Account Details</span>
                  <Badge variant={user.activated ? "default" : "secondary"}>
                    {user.activated ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Activated
                      </>
                    ) : (
                      <>
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </>
                    )}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {user.Firstname} {user.Lastname}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user.Email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registered:</span>
                    {/* <span className="font-medium">{formatDate(user.Createdat)}</span> */}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">What's next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">1.</span>
                    <span>Check your email inbox for the activation message</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">2.</span>
                    <span>Click the activation link in the email</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">3.</span>
                    <span>You'll be automatically redirected once activated</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Didn't receive the email?</p>
                    <p className="text-blue-700 mt-1">
                      Check your spam folder or click the button below to refresh your activation status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCheckNow} disabled={checking} variant="outline" className="flex-1">
                  {checking ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check Status
                    </>
                  )}
                </Button>

                {/* <Button onClick={() => router.push("/")} variant="default" className="flex-1">
                  Go to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button> */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
