"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, MapPin, Share2, Heart, Facebook, Twitter, Linkedin, Mail, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ImpactStoryPage() {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(124)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Charities
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-80 w-full">
                <Image src="/happy.jpg" alt="Children in Hawassa" fill className="object-cover" />
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
                    In the heart of Hawassa, a transformation has taken place that has forever changed the lives of 200
                    children. Thanks to the generous donations through LWIE, these children now have access to school
                    supplies and educational materials that were once beyond their reach.
                  </p>
                  {/* Additional content omitted for brevity */}

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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            <span>Share</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem
                            className="hover:text-teal-600"
                            onClick={() =>
                              window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                                "_blank"
                              )
                            }
                          >
                            <Facebook className="h-4 w-4 mr-2" />
                            Facebook
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:text-teal-600"
                            onClick={() =>
                              window.open(
                                `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("How Your Donations Changed Lives in Hawassa")}`,
                                "_blank"
                              )
                            }
                          >
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:text-teal-600"
                            onClick={() =>
                              window.open(
                                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                                "_blank"
                              )
                            }
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:text-teal-600"
                            onClick={() =>
                              window.open(
                                `mailto:?subject=${encodeURIComponent("How Your Donations Changed Lives in Hawassa")}&body=${encodeURIComponent(`Check out this impact story: ${window.location.href}`)}`,
                                "_blank"
                              )
                            }
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:text-teal-600"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              alert("Link copied to clipboard!");
                            }}
                          >
                            <Link className="h-4 w-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Button onClick={() => router.push("/")}>Donate Now</Button>
                  </div>
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
                      alt="Impact Story"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
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
                      alt="Impact Story"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
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
  )
}