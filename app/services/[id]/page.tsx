import { fetchServiceById } from "@/lib/api-client"
import { ServiceDetail } from "@/components/service-detail"
import { notFound } from "next/navigation"

interface ServicePageProps {
  params: {
    id: string
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  try {
    const service = await fetchServiceById(params.id)

    if (!service) {
      return notFound()
    }

    // Mock similar services data
    const similarServices = [
      {
        id: "sim1",
        title: "Similar Service 1",
        price: 300,
        condition: "Available",
        image: "/placeholder.svg?height=300&width=300&text=Similar+Service+1",
        city: "Addis Ababa",
      },
      {
        id: "sim2",
        title: "Similar Service 2",
        price: 450,
        condition: "Available",
        image: "/placeholder.svg?height=300&width=300&text=Similar+Service+2",
        city: "Dire Dawa",
      },
      {
        id: "sim3",
        title: "Similar Service 3",
        price: 250,
        condition: "Available",
        image: "/placeholder.svg?height=300&width=300&text=Similar+Service+3",
        city: "Hawassa",
      },
    ]

    // Format the service data for the component
    const formattedService = {
      ...service,
      description: service.description ?? "",
      price: service.price ?? 0,
      images: service.images ?? [],
      category: service.category ?? "",
      city: service.city ?? "",
      subcity: service.subcity ?? undefined,
      service_details: service.service_details ?? undefined,
      contact_info: {
        phone: service.contact_info?.phone ?? "",
        email: service.contact_info?.email ?? "",
        preferred_contact_method: service.contact_info?.preferred_contact_method ?? "",
      },
      user: {
        id: service.user_id,
        name: service.user_name || "Anonymous User",
        avatar: "/placeholder.svg?height=100&width=100&text=User",
        joined_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        response_time: "2 hours",
      },
    }

    return <ServiceDetail service={formattedService} similarServices={similarServices} />
  } catch (error) {
    console.error("Error fetching service:", error)
    return notFound()
  }
}
