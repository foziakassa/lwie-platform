"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Wrench, DollarSign, ArrowRight } from "lucide-react"

// Define interfaces for items and services
interface UserItem {
  id: string
  title: string
}

interface UserService {
  id: string
  title: string
}

export interface SwapRequestFormProps {
  itemId: string
  itemTitle: string
  onCancel: () => void
}

export const SwapRequestForm: React.FC<SwapRequestFormProps> = ({ itemId, itemTitle, onCancel }) => {
  const [offeredId, setOfferedId] = useState("")
  const [userItems, setUserItems] = useState<UserItem[]>([])
  const [userServices, setUserServices] = useState<UserService[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isOfferingItem, setIsOfferingItem] = useState(true)
  const [isMoneyOffer, setIsMoneyOffer] = useState(false)
  const [moneyAmount, setMoneyAmount] = useState("")

  useEffect(() => {
    const fetchUserItemsAndServices = async () => {
      const authToken = Cookies.get("authToken")

      if (!authToken) {
        alert("User not logged in.")
        setLoading(false)
        return
      }

      const { id: userId } = JSON.parse(authToken)

      try {
        // Fetch user's items
        const itemsResponse = await fetch(`https://liwedoc.vercel.app/postitem/${userId}`)
        const itemsData = await itemsResponse.json()

        if (itemsData.success) {
          setUserItems(itemsData.items.map((item: any) => ({
            id: String(item.id),
            title: item.title,
          })))
        } else {
          alert("Failed to load your items.")
        }

        // Fetch user's services
        const servicesResponse = await fetch(`https://liwedoc.vercel.app/postservice/${userId}`)
        const servicesData = await servicesResponse.json()

        if (servicesData.success) {
          setUserServices(servicesData.services.map((service: any) => ({
            id: String(service.id),
            title: service.title,
          })))
        } else {
          alert("Failed to load your services.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        alert("Failed to load your items and services.")
      }

      setLoading(false)
    }

    fetchUserItemsAndServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const authToken = Cookies.get("authToken")
    if (!authToken) {
      alert("User not logged in.")
      setSubmitting(false)
      return
    }

    const { id: userId } = JSON.parse(authToken)

    // Validation
    if (isMoneyOffer) {
      if (!moneyAmount || isNaN(Number(moneyAmount)) || Number(moneyAmount) <= 0) {
        alert("Please enter a valid money amount.")
        setSubmitting(false)
        return
      }
    } else {
      if (!offeredId) {
        alert("Please select an item or service to offer.")
        setSubmitting(false)
        return
      }
    }

    // Prepare request body
    const body = {
      userId,
      requestedId: itemId,
      requestedType: "item",
      isMoneyOffer,
      moneyAmount: isMoneyOffer ? Number(moneyAmount) : null,
      offeredId: isMoneyOffer ? null : offeredId,
      offeredType: isMoneyOffer ? null : isOfferingItem ? "item" : "service",
    }

    try {
      const response = await fetch("https://liwedoc.vercel.app/api/swap-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        alert("Swap request sent successfully!")
        onCancel()
      } else {
        alert("Failed to send swap request: " + data.message)
      }
    } catch (error) {
      alert("Error sending swap request.")
      console.error(error)
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading your items and services...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Helper to get the selected item's/service's title
  const selectedTitle = !isMoneyOffer && offeredId
    ? (isOfferingItem
        ? userItems.find((i) => i.id === offeredId)?.title
        : userServices.find((s) => s.id === offeredId)?.title)
    : undefined

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Create Swap Request</CardTitle>
        </div>
        <CardDescription className="text-base">
          You're requesting to swap for:{" "}
          <Badge variant="secondary" className="ml-1 text-sm font-medium">
            {itemTitle}
          </Badge>
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Offer Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">What would you like to offer?</Label>
            <RadioGroup
              value={isMoneyOffer ? "money" : "item-service"}
              onValueChange={(value) => setIsMoneyOffer(value === "money")}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="item-service" id="item-service" />
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="item-service" className="font-medium cursor-pointer">
                    Offer an Item or Service
                  </Label>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="money" id="money" />
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="money" className="font-medium cursor-pointer">
                    Offer Money
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {!isMoneyOffer ? (
            <div className="space-y-4">
              {/* Item vs Service Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Choose what to offer:</Label>
                <RadioGroup
                  value={isOfferingItem ? "item" : "service"}
                  onValueChange={(value) => {
                    setIsOfferingItem(value === "item")
                    setOfferedId("") // Reset selection when switching
                  }}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="item" id="offer-item" />
                    <Label htmlFor="offer-item" className="cursor-pointer flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>Item</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="service" id="offer-service" />
                    <Label htmlFor="offer-service" className="cursor-pointer flex items-center space-x-1">
                      <Wrench className="h-4 w-4" />
                      <span>Service</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {/* Selection Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select {isOfferingItem ? "Item" : "Service"} to Offer:</Label>
                <Select value={offeredId} onValueChange={setOfferedId}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={`Choose a ${isOfferingItem ? "item" : "service"} from your collection`}
                    >
                      {selectedTitle}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(isOfferingItem ? userItems : userServices).length === 0 ? (
                      <SelectItem value="none" disabled>
                        No {isOfferingItem ? "items" : "services"} available
                      </SelectItem>
                    ) : (
                      (isOfferingItem ? userItems : userServices).map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {/* Show selected below for clarity */}
                {offeredId && selectedTitle && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected: <span className="font-semibold">{selectedTitle}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="money-amount" className="text-sm font-medium">
                Enter Offer Amount ($):
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="money-amount"
                  type="number"
                  value={moneyAmount}
                  onChange={(e) => setMoneyAmount(e.target.value)}
                  className="pl-10"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required={isMoneyOffer}
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || (!isMoneyOffer && !offeredId) || (isMoneyOffer && !moneyAmount)}
              className="min-w-[140px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
