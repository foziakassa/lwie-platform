"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PostItemForm from "../../components/post/post-item-form"
import PostServiceForm from "../../components/post/post-service-form"
import SuccessScreen from "../../components/post/success-screen"

export default function PostItemPage() {
  const [postType, setPostType] = useState<"item" | "service" | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const updateData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }))
  }

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    try {
      // Hardcoded user_id (assuming user is logged in as Abebe Kebede)
      const user_id = 1;

      // Prepare data based on post type
      let postData: any;
      let endpoint: string;

      if (postType === "item") {
        postData = {
          user_id,
          title: formData.title || "Comfortable Leather Sofa",
          category_id: formData.category || "1", // Assuming "Furniture" has category_id 1
          description: formData.description || "Beautiful and comfortable leather sofa in excellent condition. Perfect for your living room or office reception area.",
          condition: formData.condition || "Used",
          location: formData.location || "Addis Ababa",
          trade_type: formData.tradeType || "Swap",
          accept_cash: formData.acceptCash || false,
          price: formData.price || 10500, // Match sample
          specifications: {
            material: formData.material || "Genuine leather",
            color: formData.color || "Brown",
            dimensions: formData.dimensions || "200cm x 90cm x 85cm",
            seatingCapacity: formData.seatingCapacity || "3 people",
            age: formData.age || "2 years",
            reasonForSelling: formData.reasonForSelling || "Moving abroad",
          },
          images: formData.images || [], // No image upload in this demo
          status: "published",
        };
        endpoint = "/api/items";
      } else {
        postData = {
          user_id,
          title: formData.title || "Guitar Lessons",
          category_id: formData.category || "2", // Assuming "Tutoring" has category_id 2
          description: formData.description || "Beginner to advanced guitar lessons by an experienced tutor.",
          hourly_rate: formData.hourlyRate || 5000, // Match sample
          location: formData.location || "Addis Ababa",
          trade_type: formData.tradeType || "serviceForService",
          time_estimation: formData.timeEstimation || 1,
          time_unit: formData.timeUnit || "hours",
          cancellation_policy: formData.cancellationPolicy || "flexible",
          images: formData.images || [],
          status: "published",
        };
        endpoint = "/api/services";
      }

      // Submit to API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create post");
      }

      // Trigger success screen with countdown
      setIsSuccess(true);
      setCountdown(5); // Start countdown from 5 seconds

      // Update URL hash to trigger homepage revalidation
      window.location.hash = `newPost=${Date.now()}`;
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting the post");
      console.error("Submission error:", err);
    }
  }

  const handleDone = () => {
    setIsSuccess(false);
    setPostType(null);
    setFormData({});
    setCurrentStep(1);
    setCountdown(null);
    setError(null);
  }

  // Handle countdown and redirect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  if (isSuccess) {
    return (
      <div className="container mx-auto bg-[#f9fafb] dark:bg-[#1f2937] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {error ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-lg text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleDone}
                className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <SuccessScreen
              postType={postType!}
              onDone={handleDone}
              countdown={countdown}
            />
          )}
        </div>
      </div>
    );
  }

  if (!postType) {
    return (
      <div className="container mx-auto bg-[#f9fafb] dark:bg-[#1f2937] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Create a New Post</h1>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setPostType("item")}
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Post an Item
            </button>
            <button
              onClick={() => setPostType("service")}
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Post a Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-[#f9fafb] dark:bg-[#1f2937] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {postType === "item" ? (
          <PostItemForm
            data={formData}
            updateData={updateData}
            onNext={handleNext}
            onPrevious={currentStep > 1 ? handlePrevious : () => {}}
            onSaveDraft={() => console.log("Save draft clicked")}
            currentStep={currentStep}
            onSubmit={handleSubmit}
          />
        ) : (
          <PostServiceForm
            data={formData}
            updateData={updateData}
            onNext={handleNext}
          onPrevious={currentStep > 1 ? handlePrevious : () => {}}
            onSaveDraft={() => console.log("Save draft clicked")}
            currentStep={currentStep}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}