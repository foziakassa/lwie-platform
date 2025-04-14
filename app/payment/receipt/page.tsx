"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Download, Printer, Home, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface CustomerInfo {
  name: string;
  email: string;
  plan: string;
  price: number;
  postsCount: number;
  date: string;
  transactionId: string;
}

export default function ReceiptPage() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let info: CustomerInfo | null = null;
    // First, try to retrieve receipt info from sessionStorage.
    try {
      const storedInfo = sessionStorage.getItem("customerInfo");
      if (storedInfo) {
        info = JSON.parse(storedInfo);
      }
    } catch (err) {
      console.error("Error retrieving customer info from sessionStorage:", err);
    }

    // Now, explicitly override or set the email using the cookie.
    const cookieEmail = Cookies.get("customerEmail");

    if (cookieEmail) {
      if (info) {
        // Override the email from sessionStorage with the cookie value.
        info.email = cookieEmail.trim();
      } else {
        // If no info was found in sessionStorage, create a minimal info object.
        info = {
          name: "", // You can update this if you have a default name.
          email: cookieEmail.trim(),
          plan: "N/A",
          price: 0,
          postsCount: 0,
          date: new Date().toISOString(),
          transactionId: "N/A",
        };
      }
    }

    if (info) {
      setCustomerInfo(info);
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!receiptRef.current) return;

    try {
      const receiptContent = receiptRef.current.outerHTML;
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
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("There was an error downloading your receipt. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading receipt information...</p>
      </div>
    );
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
            <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => router.push("/")}>
              Return to Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
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
                    <p className="font-medium">
                      {new Date(customerInfo.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-b py-4 my-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{customerInfo.name}</p>
                    <p className="text-gray-600">{customerInfo.email}</p>
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
                  <div className="flex justify-between font-bold text-teal-600 pt-2 border-t mt-2">
                    <span>Total Paid:</span>
                    <span>{customerInfo.price} ETB</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-center text-center text-sm text-gray-500 border-t pt-6">
              <p>Thank you for your payment!</p>
              <p className="mt-1">
                If you have any questions, please contact our support team.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
