"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Download, Printer, Home, AlertCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Cookies from "js-cookie"
import { getPaymentReceipt, type Receipt } from "@/lib/api-service"

interface CustomerInfo {
  name: string
  email: string
  plan: string
  price: number
  postsCount: number
  date: string
  transactionId: string
  status?: string
}

interface UserData {
  email: string
  firstName: string
  bio: string | null
  phone: string | null
  image: string | null
  activated: boolean
}

export default function ReceiptPage() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // First, try to retrieve receipt info from sessionStorage
        const storedInfo = sessionStorage.getItem("customerInfo")
        let info: CustomerInfo | null = null
        let receiptFromApi: Receipt | null = null

        // Try to get transaction reference from URL or session storage
        const txRef = searchParams.get("tx_ref")
        const storedTxRef = storedInfo ? JSON.parse(storedInfo).transactionId : null
        const transactionId = txRef || storedTxRef

        // If we have a transaction ID, try to fetch the receipt from the API
        if (transactionId) {
          try {
            const userEmail = Cookies.get("customerEmail")
            receiptFromApi = await getPaymentReceipt(transactionId, userEmail)

            if (receiptFromApi) {
              // Convert API receipt to our format
              info = {
                name: receiptFromApi.customerName,
                email: receiptFromApi.customerEmail,
                plan: receiptFromApi.plan,
                price: Number.parseFloat(receiptFromApi.price),
                postsCount: receiptFromApi.postsCount,
                date: receiptFromApi.date,
                transactionId: receiptFromApi.transactionId,
                status: receiptFromApi.status,
              }
            }
          } catch (err) {
            console.warn("Failed to fetch receipt from API:", err)
            // Continue with local data if API fails
          }
        }

        // If API fetch failed or wasn't attempted, use session storage data
        if (!info && storedInfo) {
          info = JSON.parse(storedInfo)
        }

        // If we still don't have info, create a minimal object
        if (!info) {
          info = {
            name: "",
            email: "",
            plan: "N/A",
            price: 0,
            postsCount: 0,
            date: new Date().toISOString(),
            transactionId: "N/A",
          }
        }

        // Try to get name and email from cookies if missing
        const cookieEmail = Cookies.get("customerEmail")
        const cookieName = Cookies.get("customerName")

        // If we don't have a name cookie, try to get it from the auth token
        if (!info.name && !cookieName) {
          const userCookie = Cookies.get("user")
          if (userCookie) {
            try {
              const userData = JSON.parse(userCookie) as UserData
              if (userData.firstName) {
                // Set the name from the auth token
                info.name = userData.firstName
                // Also store it in a cookie for future use
                Cookies.set("customerName", userData.firstName, { expires: 365 })
              }
              if (userData.email && !cookieEmail && !info.email) {
                // Set the email from the auth token if we don't have it in cookies
                info.email = userData.email
                // Also store it in a cookie for future use
                Cookies.set("customerEmail", userData.email, { expires: 365 })
              }
            } catch (err) {
              console.warn("Failed to parse user cookie:", err)
            }
          }
        } else if (cookieName && !info.name) {
          // If we have a name cookie, use it
          info.name = cookieName.trim()
        }

        // If we have an email cookie and no email in info, use it
        if (cookieEmail && !info.email) {
          info.email = cookieEmail.trim()
        }

        // If we have at least some basic info, show the receipt
        if (info && (info.email || info.name)) {
          setCustomerInfo(info)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error("Error retrieving customer info:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchReceipt()
  }, [searchParams])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!receiptRef.current) return

    try {
      const receiptContent = receiptRef.current.outerHTML
      const blob = new Blob(
        [
          `
          <html>
            <head>
              <title>Payment Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { border: 1px solid #ddd; padding: 20px; max-width: 500px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .footer { margin-top: 30px; text-align: center; font-size: 14px; color: #666; }
              </style>
            </head>
            <body>
              ${receiptContent}
            </body>
          </html>
          `,
        ],
        { type: "text/html" },
      )

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `receipt-${customerInfo?.transactionId || Date.now()}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error("There was an error downloading your receipt. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading receipt information...</p>
      </div>
    )
  }

  if (error || !customerInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 mb-4">
              <AlertCircle className="h-10 w-10 text-amber-500" />
            </div>
            <CardTitle className="text-2xl">Receipt Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              We couldn't find your receipt information. This might happen if you accessed this page directly or if your
              session has expired.
            </p>
            <p className="text-gray-600">
              Please complete a payment to generate a receipt, or contact support if you believe this is an error.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => router.push("/plan-selection")}>
              Return to Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-between">
          <Button
            variant="outline"
            className="text-teal-500 border-teal-500 hover:bg-teal-50"
            onClick={() => router.push("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <div className="space-x-2 print:hidden">
            <Button variant="outline" className="text-teal-500 border-teal-500 hover:bg-teal-50" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              className="text-teal-500 border-teal-500 hover:bg-teal-50"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div ref={receiptRef}>
          <Card className="border-2">
            <CardHeader className="text-center border-b pb-6">
              <CardTitle className="text-2xl text-teal-600">Payment Receipt</CardTitle>
              <div className="text-sm text-gray-500 mt-1">Official Payment Confirmation</div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Receipt Number</p>
                    <p className="font-medium">{customerInfo.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(customerInfo.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-b py-4 my-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{customerInfo.name || "N/A"}</p>
                    <p className="text-gray-600">{customerInfo.email || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment For</p>
                    <p className="font-medium">
                      {customerInfo.plan} Plan ({customerInfo.postsCount} Posts)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan Type:</span>
                    <span>{customerInfo.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Posts:</span>
                    <span>{customerInfo.postsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>Chapa Payment</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={customerInfo.status === "pending" ? "text-amber-500" : "text-green-500"}>
                      {customerInfo.status
                        ? customerInfo.status.charAt(0).toUpperCase() + customerInfo.status.slice(1)
                        : "Completed"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-teal-600 pt-2 border-t mt-2">
                    <span>Total Paid:</span>
                    <span>{customerInfo.price} ETB</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-center text-center text-sm text-gray-500 border-t pt-6">
              <p>Thank you for your payment!</p>
              <p className="mt-1">If you have any questions, please contact our support team.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
