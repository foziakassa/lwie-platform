import type { Metadata } from "next"
import AdvertisementForm from "@/components/advertisement-form"

export const metadata: Metadata = {
  title: "Advertise With Us",
  description: "Promote your company's products on our e-commerce platform",
}

export default function AdvertisePage() {
  return (
    <div className=" md:px-6 bg-[#f9fafb] dark:bg-[#1f2937]">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Advertise With Us</h1>
          <p className="text-muted-foreground">Fill out the form below to promote your products on our platform</p>
        </div>
        <AdvertisementForm />
      </div>
    </div>
  )
}




