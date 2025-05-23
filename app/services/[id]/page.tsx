import { fetchServiceById } from "@/lib/api-client"; // Ensure this function exists
import { ServiceDetail } from "@/components/service-detail";
import { notFound } from "next/navigation";

// Define the interface for ServicePageProps
interface ServicePageProps {
  params: {
    id: string;
  };
}

// Function to fetch user details by user ID
async function fetchUserById(userId: string) {
  const res = await fetch(`https://liwedoc.vercel.app/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("User not found");
  }

  return await res.json();
}

export default async function ServicePage(props: ServicePageProps) {
  const { id } = props.params;
  console.log("Fetching service with ID:", id);

  try {
    // Fetch service data
    const serviceRes = await fetch(`https://liwedoc.vercel.app/api/services/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!serviceRes.ok) {
      console.warn("Service not found:", id);
      return notFound();
    }

    const data = await serviceRes.json();

    if (!data.success) {
      console.warn("API response was not successful:", data);
      return notFound();
    }

    const service = data.service;

    // Fetch user information if user_id is available
    let user = null;
    if (service.user_id) {
      try {
        const userData = await fetchUserById(service.user_id);
        user = userData; // Assume userData contains user details
      } catch (error) {
        console.error("Error fetching user:", error);
      }
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
    ];

    // Format the service data for the component
    const formattedService = {
      id: service.id,
      title: service.title,
      description: service.description ?? "",
      price: parseFloat(service.price) || 0,
      condition: service.condition ?? "",
      category: service.category ?? "",
      subcategory: service.subcategory ?? "",
      city: service.city ?? "",
      subcity: service.subcity ?? undefined,
      additional_details: undefined, // Set as needed
      images: service.image_urls ?? [],
      contact_info: {
        phone: service.phone ?? "",
        email: service.email ?? "",
        preferred_contact_method: service.preferred_contact_method ?? "phone",
      },
      user: {
        id: user ? user.id : "Anonymous",
        name: user ? `${user.Firstname} ${user.Lastname}` : "Anonymous User",
        avatar: user && user.Image ? user.Image : "/placeholder.svg?height=100&width=100&text=User",
        joined_date: user ? user.Createdat : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        response_time: user ? "2 hours" : "N/A",
      },
      created_at: service.createdat,
    };

    console.log("Fetched service:", formattedService);

    return <ServiceDetail service={formattedService} similarServices={similarServices} />;
  } catch (error) {
    console.error("Error fetching service:", error);
    return notFound();
  }
}