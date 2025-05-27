"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Heart, ChevronRight, Mail, MapPin, Phone } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Footer() {
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [cookieOpen, setCookieOpen] = useState(false)
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)

  // Social media URLs - replace these with your actual LWIE social media accounts
  const socialLinks = {
    facebook: "https://www.facebook.com/lwieofficial",
    twitter: "https://twitter.com/lwieofficial",
    instagram: "https://www.instagram.com/lwieofficial",
    linkedin: "https://www.linkedin.com/company/lwie",
  }

  // Current year for copyright
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t dark:border-gray-700">
      <div className="container mx-auto px-4 py-12">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and About */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center lg:items-start"
            >
              <div className="mb-4 p-3 rounded-xl ">
                <Image src="/images/logo4.png" alt="Logo" width={140} height={50} className="object-contain" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm text-center lg:text-left mb-4">
                LWIE connects people to swap, donate, and find items they love while reducing waste.
              </p>
              <div className="flex space-x-3 mt-2">
                {Object.entries(socialLinks).map(([platform, url]) => (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {platform === "facebook" && <Facebook className="h-5 w-5" />}
                    {platform === "twitter" && <Twitter className="h-5 w-5" />}
                    {platform === "instagram" && <Instagram className="h-5 w-5" />}
                    {platform === "linkedin" && <Linkedin className="h-5 w-5" />}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Help Center
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setGuidelinesOpen(true)}
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Community Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setTermsOpen(true)}
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCookieOpen(true)}
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">123 Swap Street, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">+251 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" />
                <a
                  href="mailto:info@lwie.com"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  info@lwie.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 md:mb-0">
            © {currentYear} LWIE. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="mx-1"
            >
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </motion.div>
            <span>in Ethiopia</span>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Last updated: May 1, 2023</p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">1. Introduction</h3>
            <p>
              Welcome to LWIE. These Terms of Service govern your use of our website and services. By accessing or using
              LWIE, you agree to be bound by these Terms.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">2. Definitions</h3>
            <p>
              "LWIE" refers to our company, website, and services. "User," "you," and "your" refers to the individual or
              entity using our services. "Content" refers to all information and materials available on LWIE.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">3. Account Registration</h3>
            <p>
              To use certain features of LWIE, you must register for an account. You agree to provide accurate
              information and keep it updated. You are responsible for maintaining the confidentiality of your account
              credentials.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">4. User Conduct</h3>
            <p>
              You agree not to use LWIE for any illegal or unauthorized purpose. You must not violate any laws in your
              jurisdiction, including copyright and trademark laws.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">5. Swapping and Transactions</h3>
            <p>
              LWIE facilitates connections between users for swapping items. We are not responsible for the quality,
              safety, or legality of items swapped. All transactions are between users, and LWIE is not a party to these
              transactions.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">6. Termination</h3>
            <p>
              We reserve the right to terminate or suspend your account at our sole discretion, without notice, for
              conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for
              any other reason.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">7. Changes to Terms</h3>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by
              posting an announcement on our website or sending you an email.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">8. Contact Information</h3>
            <p>If you have any questions about these Terms, please contact us at legal@lwie.com.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Last updated: May 1, 2023</p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you create an account, update your
              profile, use interactive features, make a swap, participate in surveys, or contact us.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">2. How We Use Information</h3>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions,
              send communications, and for other purposes you consent to.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">3. Information Sharing</h3>
            <p>
              We do not share your personal information with third parties except as described in this Privacy Policy.
              We may share information with vendors and service providers, for legal reasons, or in connection with a
              business transfer.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">4. Your Choices</h3>
            <p>
              You can access and update certain information about you from your account settings. You can also opt out
              of receiving promotional communications from us by following the instructions in those communications.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">5. Cookies</h3>
            <p>
              We use cookies and similar technologies to collect information about your browsing activities and to
              distinguish you from other users of our website.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">6. Data Security</h3>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
              access, disclosure, alteration, and destruction.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">7. Changes to Privacy Policy</h3>
            <p>
              We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising
              the date at the top of the policy and, in some cases, we may provide you with additional notice.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">8. Contact Information</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@lwie.com.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookie Policy Modal */}
      <Dialog open={cookieOpen} onOpenChange={setCookieOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Cookie Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Last updated: May 1, 2023</p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">1. What Are Cookies</h3>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website.
              They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">2. How We Use Cookies</h3>
            <p>
              We use cookies for various purposes, including to remember your preferences, understand how you use our
              website, and personalize the content and advertisements you see.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">3. Types of Cookies We Use</h3>
            <p>
              <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly.
              <br />
              <strong>Preference Cookies:</strong> These cookies remember your preferences and settings.
              <br />
              <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our
              website.
              <br />
              <strong>Marketing Cookies:</strong> These cookies track your online activity to help advertisers deliver
              more relevant advertising.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">4. Managing Cookies</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can usually find these settings
              in the "Options" or "Preferences" menu of your browser.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">5. Changes to Cookie Policy</h3>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our
              business practices. Any changes will become effective when we post the revised policy.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">6. Contact Information</h3>
            <p>If you have any questions about our use of cookies, please contact us at privacy@lwie.com.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Community Guidelines Modal */}
      <Dialog open={guidelinesOpen} onOpenChange={setGuidelinesOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Community Guidelines</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Last updated: May 1, 2023</p>

            <p>
              At LWIE, we're building a community based on trust, respect, and sustainability. These guidelines help
              ensure a positive experience for everyone.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">1. Be Respectful</h3>
            <p>
              Treat others with respect and kindness. Do not engage in harassment, hate speech, or discriminatory
              behavior. Remember that LWIE is a diverse community with users from different backgrounds.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">2. Be Honest</h3>
            <p>
              Provide accurate descriptions and images of your items. Be transparent about any defects or issues. Honor
              your commitments when arranging swaps or donations.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">3. Communicate Clearly</h3>
            <p>
              Respond to messages in a timely manner. Be clear about your expectations and limitations. If you need to
              cancel a swap, let the other person know as soon as possible.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">4. Prohibited Items</h3>
            <p>
              Do not list illegal items, dangerous goods, counterfeit products, or items that violate intellectual
              property rights. We also prohibit the listing of certain categories like weapons, adult content, and
              controlled substances.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">5. Safety First</h3>
            <p>
              When meeting in person, choose public locations during daylight hours. Let someone know where you're
              going. Trust your instincts and leave if you feel uncomfortable.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">6. Reporting Issues</h3>
            <p>
              If you encounter behavior that violates these guidelines, please report it to us. We take all reports
              seriously and will investigate promptly.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">7. Consequences</h3>
            <p>
              Violations of these guidelines may result in content removal, account suspension, or permanent banning
              from LWIE, depending on the severity and frequency of the violation.
            </p>

            <p>
              These guidelines are not exhaustive, and we reserve the right to remove content or users that we believe
              are detrimental to the LWIE community, even if not explicitly covered here.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
