"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Create a new item post
export async function createItemPost(formData: any) {
  try {
    const supabase = createServerClient()

    // Generate a random email if user is not logged in
    const randomEmail = `user_${Math.random().toString(36).substring(2, 15)}@example.com`

    // Insert into users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert([{ email: randomEmail }])
      .select()

    if (userError) {
      console.error("Error creating user:", userError)
      throw new Error("Failed to create user")
    }

    const userId = userData?.[0]?.id

    // Insert into posts table
    const { data: postResult, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId,
          type: "item",
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          condition: formData.condition,
          description: formData.description,
          location: formData.location,
          hide_address: formData.hideAddress,
        },
      ])
      .select()

    if (postError) {
      console.error("Error creating post:", postError)
      throw new Error("Failed to create post")
    }

    const postId = postResult?.[0]?.id

    // Insert specifications
    if (postId) {
      await supabase.from("specifications").insert([
        {
          post_id: postId,
          brand: formData.brand,
          model: formData.model,
          age_year: formData.ageYear,
          dimensions: formData.dimensions,
          technical_specs: formData.technicalSpecs,
          additional_details: formData.additionalDetails,
        },
      ])

      // Insert trade preferences
      await supabase.from("trade_preferences").insert([
        {
          post_id: postId,
          accept_fair_trades: formData.acceptFairTrades,
          accept_cash_offers: formData.acceptCashOffers,
          preferred_categories: formData.preferredCategories,
          specific_items: formData.specificItems,
        },
      ])

      // Insert images
      if (formData.images && formData.images.length > 0) {
        const imageInserts = formData.images.map((imageUrl: string, index: number) => ({
          post_id: postId,
          image_url: imageUrl,
          position: index,
        }))

        await supabase.from("post_images").insert(imageInserts)
      }
    }

    revalidatePath("/")
    return { success: true, postId }
  } catch (error) {
    console.error("Error in createItemPost:", error)
    return { success: false, error }
  }
}

// Create a new service post
export async function createServicePost(formData: any) {
  try {
    const supabase = createServerClient()

    // Generate a random email if user is not logged in
    const randomEmail = `user_${Math.random().toString(36).substring(2, 15)}@example.com`

    // Insert into users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert([{ email: randomEmail }])
      .select()

    if (userError) {
      console.error("Error creating user:", userError)
      throw new Error("Failed to create user")
    }

    const userId = userData?.[0]?.id

    // Insert into posts table
    const { data: postResult, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId,
          type: "service",
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          description: formData.description,
          location: formData.location,
          hide_address: formData.hideAddress,
        },
      ])
      .select()

    if (postError) {
      console.error("Error creating post:", postError)
      throw new Error("Failed to create post")
    }

    const postId = postResult?.[0]?.id

    // Insert service details
    if (postId) {
      await supabase.from("service_details").insert([
        {
          post_id: postId,
          experience: formData.experience,
          skills: formData.skills,
          availability: formData.availability,
          pricing: formData.pricing,
          negotiable: formData.negotiable,
          additional_info: formData.additionalInfo,
        },
      ])

      // Insert trade preferences
      await supabase.from("trade_preferences").insert([
        {
          post_id: postId,
          accept_fair_trades: formData.acceptFairTrades,
          accept_cash_offers: formData.acceptCashOffers,
          preferred_categories: formData.preferredCategories,
          specific_items: formData.specificItems,
        },
      ])

      // Insert images
      if (formData.images && formData.images.length > 0) {
        const imageInserts = formData.images.map((imageUrl: string, index: number) => ({
          post_id: postId,
          image_url: imageUrl,
          position: index,
        }))

        await supabase.from("post_images").insert(imageInserts)
      }
    }

    revalidatePath("/")
    return { success: true, postId }
  } catch (error) {
    console.error("Error in createServicePost:", error)
    return { success: false, error }
  }
}
