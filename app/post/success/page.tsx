"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Plus } from "lucide-react"
import { motion } from "framer-motion"

export default function SuccessPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Successfully Posted!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Your post has been successfully published and is now visible to others.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button onClick={() => router.push("/")} className="w-full bg-[#00A693] hover:bg-[#008F7F]">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
            <Button variant="outline" onClick={() => router.push("/post/selection")} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Another Post
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
