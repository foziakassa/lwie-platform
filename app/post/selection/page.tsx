import type { Metadata } from "next"
import PostTypeSelection from "@/components/post/post-type-selection"

export const metadata: Metadata = {
  title: "Create a New Post - Lwie",
  description: "Create a new post to swap or trade items and services",
}

export default function PostSelectionPage() {
  return <PostTypeSelection />
}
