"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Mock cart items
const initialCartItems = [
  {
    id: "1",
    title: "Vintage Camera",
    description: "Classic film camera in excellent condition",
    image: "/placeholder.svg",
    price: 1500,
    quantity: 1,
  },
  {
    id: "2",
    title: "Wireless Headphones",
    description: "Noise-cancelling with 30-hour battery life",
    image: "/placeholder.svg",
    price: 2200,
    quantity: 1,
  },
  {
    id: "3",
    title: "Mechanical Keyboard",
    description: "RGB backlit with Cherry MX switches",
    image: "/placeholder.svg",
    price: 1800,
    quantity: 1,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState(false)

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
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#1f2937] py-8"> {/* Updated background colors */}
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-teal-700 dark:text-teal-500 hover:underline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">Your Cart</h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <motion.div key={item.id} variants={itemVariants} className="group">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <div className="h-24 w-24 relative flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                              <p className="font-medium text-teal-700 dark:text-teal-400">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                                >
                                  -
                                </button>
                                <span className="mx-3 w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {item !== cartItems[cartItems.length - 1] && <Separator className="my-6" />}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-24"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount (20%)</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-teal-700 dark:text-teal-400">{formatPrice(total)}</span>
                    </div>

                    <div className="pt-4">
                      <Label htmlFor="promo-code" className="text-sm font-medium">
                        Promo Code
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="promo-code"
                          type="text"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button onClick={applyPromoCode} variant="secondary" className="rounded-l-none">
                          Apply
                        </Button>
                      </div>
                      {promoApplied && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          Promo code applied successfully!
                        </p>
                      )}
                      {promoError && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">Invalid promo code. Try "SWAP20"</p>
                      )}
                    </div>

                    <Button className="w-full bg-teal-700 hover:bg-teal-600 text-white">Proceed to Checkout</Button>
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
            className="text-center py-16 px-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
              <ShoppingBag className="h-8 w-8 text-teal-700 dark:text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Explore our marketplace to find items to swap or
              buy.
            </p>
            <Button asChild className="bg-teal-700 hover:bg-teal-600">
              <Link href="/">Start Shopping</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}