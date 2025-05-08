import { fetchItemById } from "@/lib/api-client"
import { ProductDetail } from "@/components/product-detail"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await fetchItemById(params.id)

    if (!product) {
      return notFound()
    }

    // Mock similar products data
    const similarProducts = [
      {
        id: "sim1",
        title: "Similar Product 1",
        price: 500,
        condition: "Used",
        image: "/placeholder.svg?height=300&width=300&text=Similar+Product+1",
        city: "Addis Ababa",
      },
      {
        id: "sim2",
        title: "Similar Product 2",
        price: 750,
        condition: "Like New",
        image: "/placeholder.svg?height=300&width=300&text=Similar+Product+2",
        city: "Dire Dawa",
      },
      {
        id: "sim3",
        title: "Similar Product 3",
        price: 600,
        condition: "Good",
        image: "/placeholder.svg?height=300&width=300&text=Similar+Product+3",
        city: "Hawassa",
      },
      {
        id: "sim4",
        title: "Similar Product 4",
        price: 450,
        condition: "Fair",
        image: "/placeholder.svg?height=300&width=300&text=Similar+Product+4",
        city: "Bahir Dar",
      },
    ]

    // Format the product data for the component
    const formattedProduct = {
      ...product,
      description: product.description ?? "",
      price: product.price ?? 0,
      condition: product.condition ?? "",
      category: product.category ?? "",
      subcategory: product.subcategory ?? "",
      city: product.city ?? "",
      subcity: product.subcity ?? undefined,
      additional_details: product.additional_details ?? undefined,
      images: product.images ?? [],
      contact_info: {
        phone: product.contact_info?.phone ?? "",
        email: product.contact_info?.email ?? "",
        preferred_contact_method: product.contact_info?.preferred_contact_method ?? "phone",
      },
      user: {
        id: product.user_id,
        name: product.user_name || "Anonymous User",
        avatar: "/placeholder.svg?height=100&width=100&text=User",
        joined_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        response_time: "2 hours",
      },
    }

    return <ProductDetail product={formattedProduct} similarProducts={similarProducts} />
  } catch (error) {
    console.error("Error fetching product:", error)
    return notFound()
  }
}