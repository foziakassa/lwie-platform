"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { processPayment } from "@/lib/actions";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface Plan {
  name: string;
  posts: number;
  price: number;
}

export default function CheckoutPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const planData = sessionStorage.getItem("selectedPlan");
    if (planData) {
      setPlan(JSON.parse(planData));
    } else {
      router.push("/");
    }
  }, [router]);

  const handlePayment = async () => {
    if (!plan) {
      toast.error("Plan information not found. Please select a plan again.");
      router.push("/");
      return;
    }

    setIsProcessing(true);

    // Retrieve and trim the customer email from cookies.
    const rawEmail = Cookies.get("customerEmail") || "";
    const customerEmail = rawEmail.trim() || "anonymous@example.com";
    console.log("Customer email from cookies:", customerEmail);

    try {
      // Save the customer transaction info in sessionStorage.
      sessionStorage.setItem(
        "customerInfo",
        JSON.stringify({
          plan: plan.name,
          price: plan.price,
          postsCount: plan.posts,
          date: new Date().toISOString(),
          transactionId: "pending",
        })
      );

      const result = await processPayment({
        amount: plan.price,
        planName: plan.name,
        currency: "ETB",
        customerName: "Anonymous", // Placeholder (update if you have customer name info)
        customerEmail: customerEmail, // Use trimmed email from cookies
        numberOfPosts: plan.posts,
      });

      if (result.success) {
        const updatedCustomerInfo = JSON.parse(
          sessionStorage.getItem("customerInfo") || "{}"
        );
        updatedCustomerInfo.transactionId = result.transactionId || "TX-" + Date.now();
        sessionStorage.setItem("customerInfo", JSON.stringify(updatedCustomerInfo));
        window.location.href = result.redirectUrl || "/payment/success";
      } else {
        toast.error(result.message || "There was an error processing your payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("There was an error processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-teal-500 hover:text-teal-600 hover:bg-teal-50 -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
            <CardDescription>Confirm and pay for the {plan.name} plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="pt-2">
                <div className="flex justify-between font-medium">
                  <span>Plan:</span>
                  <span>{plan.name}</span>
                </div>
                <div className="flex justify-between font-medium mt-1">
                  <span>Number of posts:</span>
                  <span>{plan.posts}</span>
                </div>
                <div className="flex justify-between font-bold text-teal-600 pt-2 border-t mt-2">
                  <span>Total:</span>
                  <span>{plan.price} ETB</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
