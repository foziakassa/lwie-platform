"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Your other imports and mock data...

export default function Active() {
  const searchParams = useSearchParams(); // Get the search params
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(true);

  // Retrieve and activate token from the query
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      activateAccount(tokenFromUrl);
    } else {
      setIsActivating(false); // No token found
    }
  }, [searchParams]);

  const activateAccount = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:3000/activate/${token}`);
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Activation successful
      } else {
        setMessage(data.error); // Error message
      }
    } catch (error) {
      console.error("Error activating account:", error);
      setMessage("Error activating account. Please try again later.");
    } finally {
      setIsActivating(false); // Stop activation loading state
      setIsLoading(false); // Stop main loading state
    }
  };

  // Your component rendering logic...
  
  if (isActivating) {
    return <div>Activating account...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {message && <div className="alert">{message}</div>}
        {/* The rest of your component */}
        vgbhjnikhksxdcfgvbhnjhgfzazsxdcfvghnjmktyfredwsqaasxdcfgh
      </main>
    </div>
  );
}