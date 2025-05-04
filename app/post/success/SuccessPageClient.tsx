"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Share2, Eye, Edit, Home, Copy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "@/components/ui/use-toast";
import { getLatestPost } from "@/lib/post-storage";

export default function SuccessPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [postId, setPostId] = useState<string>("");
  const [countdown, setCountdown] = useState(5);
  const [postData, setPostData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get postId from query parameter
    const id = searchParams.get("postId");
    if (id) {
      setPostId(id);
    } else {
      // Fallback to random ID if not provided
      setPostId(`LW-${Math.floor(Math.random() * 1000000)}`);
    }

    // Fetch post data from database
    const fetchPostData = async () => {
      try {
        const latestPost = await getLatestPost();
        if (latestPost && latestPost.id === id) {
          setPostData(latestPost);
        } else if (id) {
          // Fetch specific post by ID if latest post doesn't match
          const response = await fetch(`/api/items?item_id=${id}`);
          const result = await response.json();
          if (response.ok && result.success && result.items.length > 0) {
            const item = result.items[0];
            setPostData({
              id: item.id.toString(),
              type: "item",
              data: {
                title: item.title,
                category: item.category_name,
                description: item.description,
                condition: item.condition,
                location: item.location,
                price: item.price?.toString(),
                acceptCash: item.accept_cash,
                acceptFairTrades: !!item.trade_type,
                specifications: item.specifications || {},
                images: item.images?.map((img: any) => img.url) || [],
                city: item.location?.split(",")[0] || "Unknown",
                subcity: item.location?.split(",")[1]?.trim() || "Unknown",
              },
              createdAt: item.created_at,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        toast({
          title: "Error loading post",
          description: "Unable to load post details.",
          variant: "destructive",
        });
      }
    };

    fetchPostData();

    // Setup countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          router.push("/");
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#00796B", "#00695C", "#004D40", "#B2DFDB", "#E0F2F1"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#00796B", "#00695C", "#004D40", "#B2DFDB", "#E0F2F1"],
      });
    }, 250);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [router, searchParams]);

  const copyPostId = () => {
    navigator.clipboard.writeText(postId);
    toast({
      title: "Post ID copied!",
      description: "The post ID has been copied to your clipboard.",
    });
  };

  const sharePost = async () => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareData = {
      title: postData?.data?.title || "Check out this post!",
      text: `View my ${postData?.type === "service" ? "service" : "item"} listing on the platform!`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "The post link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      toast({
        title: "Error sharing post",
        description: "Unable to share the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const viewPost = () => {
    if (postId) {
      router.push(`/post/${postId}`);
    } else {
      toast({
        title: "Error",
        description: "Post ID is not available.",
        variant: "destructive",
      });
    }
  };

  const editPost = () => {
    if (postId) {
      router.push(`/post/edit/${postId}`);
    } else {
      toast({
        title: "Error",
        description: "Post ID is not available.",
        variant: "destructive",
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto w-full"
      >
        <Card className="overflow-hidden shadow-md">
          <div className="bg-[#00796B] py-8 px-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold mb-4 text-white"
            >
              Post Submitted Successfully!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-white/90 text-base sm:text-lg max-w-xl mx-auto mb-2"
            >
              Your {postData?.type === "service" ? "service" : "item"} has been published and is now visible to other
              users. You&apos;ll be notified when someone shows interest in your listing.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-white/20 text-white font-medium rounded-full py-2 px-4 inline-block text-sm sm:text-base"
            >
              Redirecting to homepage in {countdown} seconds...
            </motion.div>
          </div>

          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
            >
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-medium mb-1 text-gray-600 text-sm sm:text-base">Post ID</h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 font-medium text-sm sm:text-base">#{postId}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-[#00796B] hover:bg-[#E0F2F1]"
                    onClick={copyPostId}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-medium mb-1 text-gray-600 text-sm sm:text-base">Status</h3>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-green-600 font-medium text-sm sm:text-base">Active</p>
                </div>
              </div>
            </motion.div>

            {postData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <h3 className="font-medium mb-2 text-gray-700 text-base sm:text-lg">Post Preview</h3>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    {postData.data.images && postData.data.images.length > 0 ? (
                      <Image
                        src={postData.data.images[0] || "/placeholder.svg?height=80&width=80"}
                        alt={postData.data.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#00796B] text-sm sm:text-base">{postData.data.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {postData.type === "item"
                        ? `Condition: ${postData.data.condition || "Not specified"}`
                        : `Experience: ${postData.data.experience || "Not specified"}`}
                    </p>
                    <p className="text-xs sm:text-sm font-medium">
                      {postData.data.price ? `${postData.data.price} ETB` : "Price not specified"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {postData.data.city}, {postData.data.subcity}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6"
            >
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center text-sm sm:text-base px-4 py-2 w-full sm:w-auto"
                onClick={editPost}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="space-y-3"
            >
              <Link href="/" className="block w-full">
                <Button className="w-full bg-[#00796B] hover:bg-[#00695C] text-white text-sm sm:text-base py-2 sm:py-3">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage Now
                </Button>
              </Link>
              <Link href="/post/selection" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-base py-2 sm:py-3 border-[#00796B] text-[#00796B] hover:bg-[#E0F2F1]"
                >
                  Create Another Post
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
