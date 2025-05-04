import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface ListingCardProps {
  id: string
  title: string
  price: number
  condition: string
  location: string
  imageUrl: string
  slug: string
  type: "item" | "service"
}

export function ListingCard({ id, title, price, condition, location, imageUrl, slug, type }: ListingCardProps) {
  return (
    <Link href={`/${type}s/${slug}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer h-full flex flex-col">
        <div className="relative h-48 bg-gray-100">
          <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          <Badge
            className={`absolute top-2 right-2 ${
              type === "service" ? "bg-blue-100 text-blue-800" : "bg-teal-100 text-teal-800"
            }`}
          >
            {type === "service" ? "Service" : condition}
          </Badge>
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">{title}</h3>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{location}</span>
          </div>
          <div className="mt-auto">
            <p className="font-bold text-teal-700">
              {price.toLocaleString()} ETB
              {type === "service" && <span className="text-sm font-normal">/hr</span>}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
