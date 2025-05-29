import { type NextRequest, NextResponse } from "next/server"
import { getUserPostsStatus } from "@/lib/api-service"

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("x-user-email")

    if (!userEmail) {
      // Return default values for new users
      return NextResponse.json({
        remainingFreePosts: 3,
        remainingPaidPosts: 0,
        totalPaidPosts: 0,
        usedPaidPosts: 0,
        totalFreePosts: 3,
        success: true,
      })
    }

    const postsStatus = await getUserPostsStatus(userEmail)
    return NextResponse.json(postsStatus)
  } catch (error) {
    console.error("Error fetching posts status:", error)

    // Return default values for new users when API fails
    return NextResponse.json({
      remainingFreePosts: 3,
      remainingPaidPosts: 0,
      totalPaidPosts: 0,
      usedPaidPosts: 0,
      totalFreePosts: 3,
      success: true,
    })
  }
}
