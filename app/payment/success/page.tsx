"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Cookies from "js-cookie"
import { verifyPayment } from "@/lib/api-service"

interface UserData {
  email: string
  firstName: string
  bio: string | null
  phone: string | null
  image: string | null
  activated: boolean
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Get customer info from session storage
        const customerInfoStr = sessionStorage.getItem("customerInfo")

        if (customerInfoStr) {
          const customerInfo = JSON.parse(customerInfoStr)

          // Get the transaction reference from URL if available
          const txRef = searchParams.get("tx_ref")
          if (txRef) {
            customerInfo.transactionId = txRef

            // Verify the payment with the API
            try {
              const verificationResult = await verifyPayment(txRef)

              if (verificationResult.success) {
                // Update customer info with verification data if available
                if (verificationResult.posts) {
                  customerInfo.postsCount = verificationResult.posts
                }

                // Update transaction status
                customerInfo.status = verificationResult.status || "completed"
              } else {
                console.warn("Payment verification returned unsuccessful:", verificationResult)
                // Still continue as the payment might be processing
              }
            } catch (verifyError) {
              console.error("Error verifying payment:", verifyError)
              // Continue anyway as we don't want to block the user
            }
          }

          // Try to get customer info from auth token if not already set
          if (!customerInfo.name || customerInfo.name === "Anonymous Customer") {
            const userCookie = Cookies.get("user")
            if (userCookie) {
              try {
                const userData = JSON.parse(userCookie) as UserData
                if (userData.firstName) {
                  customerInfo.name = userData.firstName
                  // Also store in a cookie for easier access
                  Cookies.set("customerName", userData.firstName, { expires: 365 })
                }
                if (userData.email && (!customerInfo.email || customerInfo.email === "anonymous@example.com")) {
                  customerInfo.email = userData.email
                  // Also store in a cookie for easier access
                  Cookies.set("customerEmail", userData.email, { expires: 365 })
                }
              } catch (err) {
                console.warn("Failed to parse user cookie:", err)
              }
            }
          }

          // Update from cookies as a fallback
          const cookieEmail = Cookies.get("customerEmail")
          const cookieName = Cookies.get("customerName")

          if (cookieEmail) {
            customerInfo.email = cookieEmail.trim()
          }

          if (cookieName) {
            customerInfo.name = cookieName.trim()
          }

          // Save updated customer info back to sessionStorage
          sessionStorage.setItem("customerInfo", JSON.stringify(customerInfo))

          // Short delay to ensure posts are added before redirecting
          setTimeout(() => {
            // Redirect to receipt page
            router.push("/payment/receipt")
          }, 1000)
        } else {
          // If no customer info, just show success message
          setIsProcessing(false)
        }
      } catch (error) {
        console.error("Error processing payment success:", error)
        setError("There was an error processing your payment information. Please contact support.")
        setIsProcessing(false)
      }
    }

    processPaymentSuccess()
  }, [searchParams, router])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-teal-100 mb-4">
            <CheckCircle className="h-10 w-10 text-teal-500 animate-pulse" />
          </div>
          <p className="text-xl font-medium">Payment successful!</p>
          <p className="text-gray-500 mt-2">Redirecting to your receipt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-teal-100 mb-4">
            <CheckCircle className="h-10 w-10 text-teal-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            {error ? error : "Thank you for your payment. Your posts have been added to your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            You can now start using all the features included in your plan. If you have any questions, please contact
            our support team.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/payment/receipt" passHref>
            <Button className="bg-teal-500 hover:bg-teal-600 mr-2">View Receipt</Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50">
              Go to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
