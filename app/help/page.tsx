"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ChevronDown,
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  X,
  ExternalLink,
  Instagram,
  Send,
  MessageSquare,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// FAQ sections
const faqCategories = [
  {
    title: "Getting Started",
    icon: <HelpCircle className="h-5 w-5 text-teal-600" />,
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "To create an account, click on the 'Login' button in the top navigation bar and then select 'Sign Up'. Fill in your details, and you're good to go!",
      },
      {
        question: "Is LWIE free to use?",
        answer:
          "Yes, LWIE is completely free for basic listings. We do offer premium listing options for a small fee, which gives your items more visibility.",
      },
      {
        question: "How do I post an item?",
        answer:
          "After logging in, click the 'Post' button in the navigation bar. Fill in your item details, upload photos, and submit!",
      },
    ],
  },
  {
    title: "Swapping & Transactions",
    icon: <MessageCircle className="h-5 w-5 text-teal-600" />,
    faqs: [
      {
        question: "How does swapping work?",
        answer:
          "When you find an item you're interested in, click 'Swap Now' on the item page. You can then select items from your listings to offer in exchange, or propose a cash offer if the seller accepts cash.",
      },
      {
        question: "Is LWIE responsible for shipping?",
        answer:
          "No, LWIE facilitates connections between swappers, but shipping arrangements and costs are the responsibility of the users involved in the swap.",
      },
      {
        question: "What if I receive an item not as described?",
        answer:
          "We recommend thoroughly checking items upon receipt. If there's an issue, you can report it through our Resolution Center within 48 hours.",
      },
    ],
  },
  {
    title: "Account & Security",
    icon: <Mail className="h-5 w-5 text-teal-600" />,
    faqs: [
      {
        question: "How secure is my personal information?",
        answer:
          "We take security seriously. Your personal information is encrypted and we never share your details with third parties without your consent.",
      },
      {
        question: "Can I change my username or email?",
        answer:
          "Yes, you can update your profile information including username and email from your account settings page.",
      },
      {
        question: "What happens if I forget my password?",
        answer:
          "On the login page, click 'Forgot Password' and follow the instructions sent to your email to reset your password.",
      },
    ],
  },
  {
    title: "Donations & Charity",
    icon: <Phone className="h-5 w-5 text-teal-600" />,
    faqs: [
      {
        question: "How can I donate items to charity?",
        answer:
          "Navigate to the Charity section on our homepage or click 'Donate' in your item posting flow. You can select verified charities to donate your items to.",
      },
      {
        question: "Are charity donations tax-deductible?",
        answer:
          "Yes, donations to registered charities through LWIE are tax-deductible. You'll receive a donation receipt for your records.",
      },
      {
        question: "How do I know my donations reach the intended recipients?",
        answer:
          "We only partner with verified charitable organizations. Each charity reports back with impact stories and updates on how donations are being used.",
      },
    ],
  },
]

// Contact methods
const contactMethods = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "bg-green-500",
    link: "https://wa.me/1234567890", // Replace with your WhatsApp number
    description: "Chat with us on WhatsApp for quick responses",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: <Send className="h-5 w-5" />,
    color: "bg-blue-500",
    link: "https://t.me/yourusername", // Replace with your Telegram username
    description: "Message us on Telegram for instant support",
  },
  {
    id: "email",
    name: "Email",
    icon: <Mail className="h-5 w-5" />,
    color: "bg-red-500",
    link: "mailto:support@lwie.com?subject=Support%20Request&body=Hello%20LWIE%20Support%20Team%2C%0A%0AI%20need%20help%20with%3A%0A%0A", // Pre-filled email
    description: "Send us an email and we'll respond within 24 hours",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    color: "bg-purple-500",
    link: "https://instagram.com/lwie", // Replace with your Instagram handle
    description: "Follow us and send a DM on Instagram",
  },
]

export default function HelpPage() {
  const [openCategory, setOpenCategory] = useState<string | null>("Getting Started")
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [contactOpen, setContactOpen] = useState(false)

  const toggleCategory = (title: string) => {
    setOpenCategory(openCategory === title ? null : title)
  }

  const toggleFaq = (question: string) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [question]: !prev[question],
    }))
  }

  // Filter FAQs based on search query
  const filteredCategories = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          faqs: category.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((category) => category.faqs.length > 0)
    : faqCategories

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/50 mb-4">
              <HelpCircle className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">How can we help?</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about using LWIE or contact our support team for personalized assistance.
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-10">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base rounded-xl border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500 shadow-sm w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Popular topics */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Popular Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {faqCategories.map((category) => (
                <button
                  key={category.title}
                  onClick={() => toggleCategory(category.title)}
                  className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-3 rounded-full bg-teal-50 dark:bg-teal-900/30 mb-3">{category.icon}</div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    {category.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ sections */}
          <div className="space-y-5">
            {filteredCategories.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We couldn't find any FAQs matching "{searchQuery}". Try a different search term or contact support.
                </p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="mr-3">{category.icon}</div>
                      <span className="text-lg">{category.title}</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                        openCategory === category.title ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openCategory === category.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 border-t border-gray-100 dark:border-gray-700">
                          <div className="space-y-4">
                            {category.faqs.map((faq) => (
                              <div
                                key={faq.question}
                                className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden"
                              >
                                <button
                                  onClick={() => toggleFaq(faq.question)}
                                  className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                >
                                  <span>{faq.question}</span>
                                  <ChevronDown
                                    className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                                      openFaqs[faq.question] ? "transform rotate-180" : ""
                                    }`}
                                  />
                                </button>

                                <AnimatePresence>
                                  {openFaqs[faq.question] && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>

          {/* Contact support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-xl shadow-md p-8 text-center text-white"
          >
            <div className="max-w-lg mx-auto">
              <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
              <p className="mb-6 opacity-90">
                Our support team is ready to assist you with any questions or issues you may have.
              </p>
              <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white text-teal-600 hover:bg-gray-100 hover:text-teal-700 font-medium px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Contact Support
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center mb-1">Get in touch</DialogTitle>
                    <p className="text-center text-gray-500 dark:text-gray-400">Choose your preferred contact method</p>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {contactMethods.map((method) => (
                      <a
                        key={method.id}
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
                      >
                        <div className={`p-3 rounded-full ${method.color} text-white mb-3`}>{method.icon}</div>
                        <span className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {method.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          {method.description}
                        </span>
                        <div className="mt-2 text-xs flex items-center text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Open</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Operating hours</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Our support team is available Monday to Friday, 9:00 AM to 6:00 PM (GMT+3).
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Additional resources */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 inline-block mb-3">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Community Forum</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Connect with other users to share tips and get advice.
              </p>
              <Link
                href="/community"
                className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline inline-flex items-center"
              >
                Visit Forum
                <ChevronDown className="h-4 w-4 ml-1 transform -rotate-90" />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 inline-block mb-3">
                <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Video Tutorials</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Watch step-by-step guides on how to use LWIE features.
              </p>
              <Link
                href="/tutorials"
                className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline inline-flex items-center"
              >
                Watch Videos
                <ChevronDown className="h-4 w-4 ml-1 transform -rotate-90" />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 inline-block mb-3">
                <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Newsletter</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Subscribe to get updates, tips, and special offers.
              </p>
              <Link
                href="/newsletter"
                className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline inline-flex items-center"
              >
                Subscribe
                <ChevronDown className="h-4 w-4 ml-1 transform -rotate-90" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
