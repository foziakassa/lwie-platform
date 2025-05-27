"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, ArrowLeft, ShoppingBag, CheckCircle, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Mock cart items
const initialCartItems = [
  {
    id: "1",
    title: "Vintage Camera",
    description: "Classic film camera in excellent condition",
    image: "/placeholder.svg?height=400&width=400",
    price: 1500,
    quantity: 1,
  },
  {
    id: "2",
    title: "Wireless Headphones",
    description: "Noise-cancelling with 30-hour battery life",
    image: "/placeholder.svg?height=400&width=400",
    price: 2200,
    quantity: 1,
  },
  {
    id: "3",
    title: "Mechanical Keyboard",
    description: "RGB backlit with Cherry MX switches",
    image: "/placeholder.svg?height=400&width=400",
    price: 1800,
    quantity: 1,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState(false)
  const [showPromoSuccess, setShowPromoSuccess] = useState(false)

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate discount (20% if promo applied)
  const discount = promoApplied ? subtotal * 0.2 : 0

  // Calculate total
  const total = subtotal - discount

  // Format price in ETB
  const formatPrice = (price: number) => {
    return (
      new Intl.NumberFormat("en-ET", {
        style: "decimal",
        maximumFractionDigits: 0,
      }).format(price) + " ETB"
    )
  }

  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SWAP20") {
      setPromoApplied(true)
      setPromoError(false)
      setShowPromoSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowPromoSuccess(false)
      }, 3000)
    } else {
      setPromoError(true)
      setPromoApplied(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#1f2937] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <h1 className="text-4xl font-bold text-center mb-2 text-teal-700 dark:text-teal-400">Your Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
            Review your items and proceed to checkout when you're ready
          </p>
        </motion.div>

        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center text-teal-700 dark:text-teal-500 hover:text-teal-800 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </Badge>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-teal-700 dark:text-teal-400" />
                    Your Items
                  </h2>
                  <div className="space-y-6">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          className="group"
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          layout
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-6 p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <div className="h-28 w-28 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <h3 className="font-medium text-gray-900 dark:text-white text-lg">{item.title}</h3>
                                <p className="font-medium text-teal-700 dark:text-teal-400 mt-1 sm:mt-0">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    -
                                  </button>
                                  <span className="mx-3 w-8 text-center font-medium">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                          {item !== cartItems[cartItems.length - 1] && <Separator className="my-4 opacity-50" />}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 sticky top-24"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-teal-700 dark:text-teal-400" />
                    Order Summary
                  </h2>

                  <Card className="bg-gray-50 dark:bg-gray-750 border-0 mb-6">
                    <CardContent className="p-4  dark:bg-gray-800 ">
                      <div className="space-y-3  dark:bg-gray-800">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                          <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>

                        <AnimatePresence>
                          {promoApplied && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex justify-between text-sm text-green-600 dark:text-green-400"
                            >
                              <span className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Discount (20%)
                              </span>
                              <span>-{formatPrice(discount)}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Separator className="opacity-30" />

                        <div className="flex justify-between pt-1">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold text-xl text-teal-700 dark:text-teal-400">
                            {formatPrice(total)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="promo-code" className="text-sm font-medium mb-2 block">
                        Promo Code
                      </Label>
                      <div className="relative">
                        <Input
                          id="promo-code"
                          type="text"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="pr-24 border-gray-200 dark:border-gray-600 focus:border-teal-300 dark:focus:border-teal-500"
                        />
                        <Button
                          onClick={applyPromoCode}
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-4 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                        >
                          Apply
                        </Button>
                      </div>
                      <AnimatePresence>
                        {showPromoSuccess && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Promo code applied successfully!
                          </motion.p>
                        )}
                        {promoError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-red-600 dark:text-red-400 mt-2"
                          >
                            Invalid promo code. Try "SWAP20"
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button className="w-full bg-teal-700 hover:bg-teal-600 text-white font-medium py-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                      Proceed to Checkout
                    </Button>

                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                      Secure checkout powered by Stripe
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900 mb-6">
              <ShoppingBag className="h-10 w-10 text-teal-700 dark:text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-teal-700 dark:text-teal-400">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Explore our marketplace to find items to swap or
              buy.
            </p>
            <Button
              asChild
              className="bg-teal-700 hover:bg-teal-600 text-white font-medium px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/">Start Shopping</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
