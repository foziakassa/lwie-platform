"use client"

import Head from "next/head"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link,
  PhoneIcon as WhatsApp,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ImpactStoryPage() {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(124)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleDonate = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Thank you for your donation!",
        description: "Your generosity will make a real difference.",
        variant: "default",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Impact Story: How Your Donations Changed Lives in Hawassa</title>
        <meta
          name="description"
          content="Learn how your donations have made a difference in the lives of children in Hawassa, Ethiopia through the Hope for Children Organization."
        />
        <meta property="og:title" content="How Your Donations Changed Lives in Hawassa" />
        <meta
          property="og:description"
          content="Learn how your donations have made a difference in the lives of children in Hawassa."
        />
        <meta property="og:image" content="/happy.jpg" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Charities
            </Button>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="relative h-80 w-full">
                  <Image
                    src="/happy.jpg"
                    alt="Children in Hawassa smiling with new school supplies"
                    fill
                    className="object-cover"
                    priority={true}
                  />
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Ayana Tadesse" />
                        <AvatarFallback>AT</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Ayana Tadesse</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Director at Hope for Children Organization
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>June 15, 2023</span>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    How Your Donations Changed Lives in Hawassa
                  </h1>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Hawassa, Ethiopia</span>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      In the heart of Hawassa, a transformation has taken place that has forever changed the lives of
                      200 children. Thanks to the generous donations through LWIE, these children now have access to
                      school supplies and educational materials that were once beyond their reach.
                    </p>

                    <p>
                      Six months ago, the situation at Hope for Children Organization was challenging. Many children
                      were sharing tattered textbooks, with some having to take turns using pencils and notebooks. The
                      lack of proper educational materials was significantly impacting their ability to learn and grow
                      academically.
                    </p>

                    <h2>The Impact of Your Generosity</h2>

                    <p>
                      When the first shipment of donations arrived, the excitement was palpable. Children's eyes lit up
                      as they received their very own school supplies – many for the first time in their lives. Teachers
                      reported an immediate improvement in classroom participation and homework completion.
                    </p>

                    <p>
                      "I've been teaching for 15 years, and I've never seen such a dramatic change in student
                      engagement," says Tigist Bekele, a 4th-grade teacher at the center. "When children have their own
                      books and supplies, they take pride in their education. They feel valued and important."
                    </p>

                    <div className="grid grid-cols-2 gap-4 my-6">
                      <div className="relative h-60 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=240&width=320"
                          alt="Children with new school supplies"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative h-60 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=240&width=320"
                          alt="Classroom with new materials"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <h2>Measurable Results</h2>

                    <p>
                      The impact of these donations extends far beyond the immediate joy they brought. In just six
                      months, we've observed:
                    </p>

                    <ul>
                      <li>A 40% increase in attendance rates</li>
                      <li>A 35% improvement in average test scores</li>
                      <li>A 60% increase in homework completion</li>
                      <li>A 25% increase in parental involvement in education</li>
                    </ul>

                    <p>
                      These statistics represent real children whose educational journeys have been transformed. Take
                      Meron, a 10-year-old girl who previously struggled to keep up with her studies because she didn't
                      have consistent access to textbooks. With her own set of books and supplies, she has blossomed
                      into one of the top students in her class.
                    </p>

                    <h2>Looking Forward</h2>

                    <p>
                      While we celebrate these successes, we recognize that our work is far from complete. There are
                      still many children in Hawassa and surrounding areas who lack basic educational materials. With
                      continued support, we aim to expand our reach to five more schools in the region by the end of the
                      year.
                    </p>

                    <p>
                      Your donations don't just provide material items – they provide hope, dignity, and opportunity.
                      They tell these children that they matter, that their education matters, and that their dreams are
                      worth investing in.
                    </p>

                    <p>
                      On behalf of all the children, teachers, and families at Hope for Children Organization, thank you
                      for your generosity and compassion. Together, we are building a brighter future for the children
                      of Hawassa.
                    </p>

                    <blockquote>
                      "Education is the most powerful weapon which you can use to change the world. When you equip a
                      child with the tools for education, you're not just changing one life – you're changing
                      generations to come."
                    </blockquote>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className={liked ? "text-red-500 border-red-200 dark:border-red-800" : ""}
                        onClick={handleLike}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                        <span>{likeCount}</span>
                      </Button>
                      <TooltipProvider>
                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Share this story">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  <span>Share</span>
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share this impact story</p>
                            </TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
                            <DropdownMenuItem
                              className="hover:text-teal-600 focus:text-teal-600"
                              onClick={() =>
                                window.open(
                                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <Facebook className="h-4 w-4 mr-2" />
                              Facebook
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:text-teal-600 focus:text-teal-600"
                              onClick={() =>
                                window.open(
                                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("How Your Donations Changed Lives in Hawassa")}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <Twitter className="h-4 w-4 mr-2" />
                              Twitter
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:text-teal-600 focus:text-teal-600"
                              onClick={() =>
                                window.open(
                                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:text-teal-600 focus:text-teal-600"
                              onClick={() =>
                                window.open(
                                  `https://wa.me/?text=${encodeURIComponent(`Check out this impact story: ${window.location.href}`)}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <WhatsApp className="h-4 w-4 mr-2" />
                              WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:text-teal-600 focus:text-teal-600"
                              onClick={() =>
                                window.open(
                                  `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("How Your Donations Changed Lives in Hawassa")}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Telegram
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:text-teal-600 focus:text-teal-600"
                              onClick={() =>
                                window.open(
                                  `mailto:?subject=${encodeURIComponent("How Your Donations Changed Lives in Hawassa")}&body=${encodeURIComponent(`Check out this impact story: ${window.location.href}`)}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:text-teal-600 focus:text-teal-600"
                              onClick={() => {
                                navigator.clipboard
                                  .writeText(window.location.href)
                                  .then(() => {
                                    toast({
                                      title: "Link copied!",
                                      description: "The link has been copied to your clipboard.",
                                      duration: 3000,
                                    })
                                  })
                                  .catch(() => {
                                    toast({
                                      title: "Failed to copy link",
                                      description: "Please try again or copy the URL manually.",
                                      variant: "destructive",
                                    })
                                  })
                              }}
                            >
                              <Link className="h-4 w-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TooltipProvider>
                    </div>
                    <Button onClick={handleDonate} disabled={isLoading} aria-label="Donate to this cause">
                      {isLoading ? "Processing..." : "Donate Now"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">More Impact Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group cursor-pointer" onClick={() => router.push("/impact-story")}>
                    <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                      <Image
                        src="/placeholder.svg?height=192&width=384"
                        alt="Building a Library in Rural Amhara"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Building a Library in Rural Amhara
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      How community donations helped establish the first library in Lalibela
                    </p>
                  </div>
                  <div className="group cursor-pointer" onClick={() => router.push("/impact-story")}>
                    <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                      <Image
                        src="/placeholder.svg?height=192&width=384"
                        alt="Clean Water Initiative in Tigray"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Clean Water Initiative in Tigray
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      How your donations helped bring clean water to 5 villages
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
