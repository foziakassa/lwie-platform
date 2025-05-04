"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, ArrowLeft, ArrowRight, Save, Shuffle, Check, X, DollarSign } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase"
import { itemCategories } from "@/lib/categories"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  acceptFairTrades: z.boolean(),
  acceptCashOffers: z.boolean(),
  preferredCategories: z.array(z.string()).optional(),
  specificItems: z.string().optional(),
  meetupPreference: z.string({
    required_error: "Please select a meetup preference.",
  }),
  paymentMethods: z.array(z.string()).min(1, {
    message: "Please select at least one payment method.",
  }),
})

// Infer the type of the form values from the schema
type FormValues = z.infer<typeof formSchema>

export default function TradePreferencesForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previousSteps, setPreviousSteps] = useState<{
    basicInfo: any
    specifications: any
    locationDescription: any
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Load previous steps from local storage
    const savedBasicInfo = localStorage.getItem("itemBasicInfo")
    const savedSpecifications = localStorage.getItem("itemSpecifications")
    const savedLocationDescription = localStorage.getItem("itemLocationDescription")

    if (!savedBasicInfo || !savedSpecifications || !savedLocationDescription) {
      // If any step is missing, redirect to the appropriate page
      if (!savedBasicInfo) {
        router.push("/post/item/basic-info")
      } else if (!savedSpecifications) {
        router.push("/post/item/specifications")
      } else if (!savedLocationDescription) {
        router.push("/post/item/location-description")
      }
      return
    }

    setPreviousSteps({
      basicInfo: JSON.parse(savedBasicInfo),
      specifications: JSON.parse(savedSpecifications),
      locationDescription: JSON.parse(savedLocationDescription),
    })

    // Check for draft data
    const draftData = localStorage.getItem("itemTradePreferencesDraft")
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData)
        setTimeout(() => {
          form.reset(parsedData)
        }, 100)
      } catch (error) {
        console.error("Error loading draft data:", error)
      }
    }

    setLoading(false)
  }, [mounted, router])

  // Initialize the form with explicit typing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptFairTrades: true,
      acceptCashOffers: false,
      preferredCategories: [],
      specificItems: "",
      meetupPreference: "",
      paymentMethods: [],
    },
  })

  // Get all categories for preferred categories selection
  const categories = itemCategories.map((category) => ({
    id: category.id,
    name: category.name,
  }))

  const meetupOptions = [
    "Public place only",
    "My location",
    "Buyer's location",
    "Flexible (can be discussed)",
    "Shipping only",
  ]

  const paymentMethods = ["Cash", "Bank Transfer", "Mobile Money", "Telebirr", "CBE Birr", "Amole", "HelloCash"]

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log("onSubmit triggered with values:", values); // Confirm submission starts
    if (!previousSteps) {
      console.error("Previous steps data is missing");
      toast({
        title: "Error",
        description: "Missing previous form data. Please go back and fill out all steps.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Form submission started, isSubmitting:", isSubmitting);

    let postId = "fallback-123"; // Fallback postId if Supabase fails

    try {
      // Combine all form data
      console.log("Combining previous steps:", previousSteps);
      const postData = {
        ...previousSteps.basicInfo,
        ...previousSteps.specifications,
        ...previousSteps.locationDescription,
        ...values,
        type: "item",
        created_at: new Date().toISOString(),
      };

      const supabase = createBrowserClient();

      // Step 1: Create or upsert a user
      const randomEmail = `user_${Math.random().toString(36).substring(2, 15)}@example.com`;
      console.log("Creating user with email:", randomEmail);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .upsert([{ email: randomEmail }], { onConflict: "email" })
        .select("id")
        .single();

      if (userError || !userData) {
        console.error("User creation failed:", userError);
        throw new Error("Failed to create or fetch user: " + (userError?.message || "Unknown error"));
      }

      const userId = userData.id;
      console.log("User created/fetched with ID:", userId);

      // Step 2: Insert the post into the posts table
      const postInsertData = {
        user_id: userId,
        type: "item",
        title: postData.title || "Untitled Item",
        category: postData.category || "",
        subcategory: postData.subcategory || "",
        condition: postData.condition || "Used",
        description: postData.description || "",
        location: postData.location || "",
        hide_address: postData.hideAddress || false,
        price: postData.price ? Number(postData.price) : 0,
        city: postData.city || "",
        neighborhood: postData.subcity || null,
      };

      console.log("Inserting post with data:", postInsertData);

      const { data: postResult, error: postError } = await supabase
        .from("posts")
        .insert([postInsertData])
        .select("id")
        .single();

      if (postError || !postResult) {
        console.error("Post insertion failed:", postError);
        throw new Error("Failed to create post: " + (postError?.message || "Unknown error"));
      }

      postId = postResult.id;
      console.log("Post created with ID:", postId);

      if (!postId) {
        console.error("Post ID is undefined:", postResult);
        throw new Error("Failed to retrieve post ID");
      }

      // Step 3: Insert specifications (optional)
      try {
        const specificationsData = { post_id: postId, ...previousSteps.specifications };
        const { error: specError } = await supabase.from("specifications").insert([specificationsData]);
        if (specError) {
          console.warn("Specifications insertion failed:", specError.message);
        } else {
          console.log("Specifications inserted successfully");
        }
      } catch (specError) {
        console.warn("Specifications insertion failed:", specError);
      }

      // Step 4: Insert trade preferences (optional)
      try {
        const tradePreferencesData = {
          post_id: postId,
          accept_fair_trades: postData.acceptFairTrades,
          accept_cash_offers: postData.acceptCashOffers,
          preferred_categories: postData.preferredCategories || [],
          specific_items: postData.specificItems || "",
          meetup_preference: postData.meetupPreference || "",
          payment_methods: postData.paymentMethods || [],
        };
        const { error: tradeError } = await supabase.from("trade_preferences").insert([tradePreferencesData]);
        if (tradeError) {
          console.warn("Trade preferences insertion failed:", tradeError.message);
        } else {
          console.log("Trade preferences inserted successfully");
        }
      } catch (tradeError) {
        console.warn("Trade preferences insertion failed:", tradeError);
      }

      // Step 5: Insert images (optional)
      try {
        const savedImages = localStorage.getItem("itemImages");
        if (savedImages) {
          const images = JSON.parse(savedImages) as string[];
          if (images && images.length > 0) {
            const imageInserts = images.map((imageUrl: string, index: number) => ({
              post_id: postId,
              image_url: imageUrl,
              position: index,
            }));
            const { error: imageError } = await supabase.from("post_images").insert(imageInserts);
            if (imageError) {
              console.warn("Image insertion failed:", imageError.message);
            } else {
              console.log("Images inserted successfully");
            }
          }
        }
      } catch (imageError) {
        console.warn("Image insertion failed:", imageError);
      }

      // Step 6: Clear local storage
      try {
        localStorage.removeItem("itemBasicInfo");
        localStorage.removeItem("itemSpecifications");
        localStorage.removeItem("itemLocationDescription");
        localStorage.removeItem("itemImages");
        localStorage.removeItem("itemBasicInfoDraft");
        localStorage.removeItem("itemSpecificationsDraft");
        localStorage.removeItem("itemLocationDescriptionDraft");
        localStorage.removeItem("itemTradePreferencesDraft");
        localStorage.removeItem("itemImagesDraft");
        console.log("Local storage cleared");
      } catch (clearError) {
        console.warn("Failed to clear local storage:", clearError);
      }

      // Step 7: Show success toast
      toast({
        title: "Post submitted successfully!",
        description: "Your item has been posted. Redirecting to success page...",
        duration: 3000,
      });

      // Step 8: Redirect to success page with postId
      console.log("Attempting redirect to /post/success?postId=", postId);
      await router.push(`/post/success?postId=${postId}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Submission error details:", error);
      toast({
        title: "Error submitting post",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      // Fallback redirect
      console.log("Falling back to /post/success due to error");
      await router.push("/post/success");
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    const values = form.getValues();
    try {
      // Ensure arrays are properly handled
      const draftData = {
        ...values,
        preferredCategories: values.preferredCategories ?? [],
        paymentMethods: values.paymentMethods ?? [],
        specificItems: values.specificItems ?? "",
      };
      localStorage.setItem("itemTradePreferencesDraft", JSON.stringify(draftData));
      toast({
        title: "Draft saved",
        description: "Your trade preferences draft has been saved. You can continue later.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error saving draft",
        description: "There was a problem saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!mounted) return null;

  if (loading || !previousSteps) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border p-8"
    >
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Shuffle className="h-6 w-6 mr-2 text-teal-600" />
          <h2 className="text-3xl font-bold">Trade Preferences</h2>
        </div>
        <p className="text-gray-600">Set your preferences for trading or selling your item</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-semibold">Trade Options</h3>
              <Badge variant="outline" className="ml-2 bg-teal-50 text-teal-700 border-teal-200">
                How you want to exchange
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className={`border-2 transition-colors duration-300 ${form.watch("acceptFairTrades") ? "border-teal-500 bg-teal-50/30" : "border-gray-200"}`}
              >
                <CardContent className="p-6">
                  <FormField<FormValues>
                    control={form.control}
                    name="acceptFairTrades"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={typeof field.value === "boolean" ? field.value : false}
                            onCheckedChange={field.onChange}
                            className={field.value ? "text-teal-600 border-teal-600" : ""}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-medium">Accept fair trades</FormLabel>
                          <FormDescription>
                            I'm open to swapping my item for other items of similar value
                          </FormDescription>
                        </div>
                        <div className="ml-auto flex-shrink-0">
                          {field.value ? (
                            <div className="bg-teal-100 p-2 rounded-full">
                              <Check className="h-5 w-5 text-teal-600" />
                            </div>
                          ) : (
                            <div className="bg-gray-100 p-2 rounded-full">
                              <X className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card
                className={`border-2 transition-colors duration-300 ${form.watch("acceptCashOffers") ? "border-amber-500 bg-amber-50/30" : "border-gray-200"}`}
              >
                <CardContent className="p-6">
                  <FormField<FormValues>
                    control={form.control}
                    name="acceptCashOffers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={typeof field.value === "boolean" ? field.value : false}
                            onCheckedChange={field.onChange}
                            className={field.value ? "text-amber-600 border-amber-600" : ""}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-medium">Accept cash offers</FormLabel>
                          <FormDescription>I'm willing to sell my item for money</FormDescription>
                        </div>
                        <div className="ml-auto flex-shrink-0">
                          {field.value ? (
                            <div className="bg-amber-100 p-2 rounded-full">
                              <DollarSign className="h-5 w-5 text-amber-600" />
                            </div>
                          ) : (
                            <div className="bg-gray-100 p-2 rounded-full">
                              <X className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-amber-50 border-amber-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="text-amber-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800 mb-2">Trading Safety Tips</h3>
                  <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
                    <li>Meet in public places for exchanges</li>
                    <li>Verify the condition of items before trading</li>
                    <li>Be clear about your expectations</li>
                    <li>Trust your instincts - if something feels off, don't proceed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-8 border-t mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/post/item/location-description")}
              className="px-6 py-6 text-base flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Step
            </Button>
            <div className="space-x-3">
            <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                className="px-6 py-6 text-base flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
                <Button
                  type="submit"
                  className="bg-[#00796B] hover:bg-[#00695C] px-8 py-6 text-base shadow-md flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      Submit Post
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}