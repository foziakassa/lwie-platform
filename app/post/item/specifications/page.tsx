"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getDraft } from "@/lib/post-storage"
import { useEffect, useState } from "react"

export default function ItemSpecificationsPage() {
  const router = useRouter()
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    // Check if there's a draft
    const draft = getDraft("item")
    setHasDraft(!!draft)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/post/item/create")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Basic Info
      </Button>

      <h1 className="text-3xl font-bold text-center mb-8">Item Specifications</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Trade Preferences</CardTitle>
          <CardDescription>Specify how you'd like to trade or sell your item</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            This feature is coming soon. For now, you can continue with publishing your item.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/post/item/create")}>
            Continue to Publish
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {hasDraft && (
        <div className="text-center">
          <Button variant="outline" onClick={() => router.push("/post/item/create")}>
            Return to Basic Info
          </Button>
        </div>
      )}
    </div>
  )
}
