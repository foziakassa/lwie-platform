import { ProductDetail } from "@/components/product-detail";
import { notFound } from "next/navigation";

interface ProductPageProps {
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

// Function to fetch similar products by subcategory
async function fetchSimilarProducts(subcategory: string) {
  const res = await fetch(`https://liwedoc.vercel.app/api/items/subcategory/${subcategory}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch similar products");
  }

  const data = await res.json();
  return data.items;
}

export default async function ProductPage(props: ProductPageProps) {
  const { id } = props.params;
  console.log("Fetching product with ID:", id);

  try {
    // Fetch product data
    const productRes = await fetch(`https://liwedoc.vercel.app/api/items/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!productRes.ok) {
      console.warn("Product not found:", id);
      return notFound();
    }

    const data = await productRes.json();

    if (!data.success) {
      console.warn("API response was not successful:", data);
      return notFound();
    }

    const product = data.item;

    // Fetch user information if user_id is available
    let user = null;
    if (product.user_id) {
      try {
        const userData = await fetchUserById(product.user_id);
        user = userData; // Assume userData contains user details
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    }

    // Fetch similar products based on the product's subcategory
    const similarProducts = await fetchSimilarProducts(product.subcategory);

    // Format the product data for the component
    const formattedProduct = {
      id: product.id,
      title: product.title,
      description: product.description ?? "",
      price: parseFloat(product.price) || 0,
      condition: product.condition ?? "",
      category: product.category ?? "",
      subcategory: product.subcategory ?? "",
      city: product.city ?? "",
      subcity: product.subcity ?? undefined,
      additional_details: undefined, // Set as needed
      images: product.image_urls ?? [],
      contact_info: {
        phone: product.phone ?? "",
        email: product.email ?? "",
        preferred_contact_method: product.preferred_contact_method ?? "phone",
      },
      user: {
        id: user ? user.id : "Anonymous",
        name: user ? `${user.Firstname} ${user.Lastname}` : "Anonymous User",
        avatar: user && user.Image ? user.Image : "/placeholder.svg?height=100&width=100&text=User",
        joined_date: user ? user.Createdat : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        response_time: user ? "2 hours" : "N/A",
      },
      created_at: product.createdat,
    };

    console.log("Fetched product:", formattedProduct);

    return <ProductDetail product={formattedProduct} similarProducts={similarProducts} />;
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }
}