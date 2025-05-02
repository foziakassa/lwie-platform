export interface Subcategory {
  id: string
  name: string
  fields?: {
    name: string
    type: "text" | "select" | "number" | "textarea"
    label: string
    placeholder?: string
    options?: string[]
    required?: boolean
  }[]
}

export interface Category {
  id: string
  name: string
  icon: string
  subcategories: Subcategory[]
}

export const itemCategories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "laptop",
    subcategories: [
      {
        id: "smartphones",
        name: "Smartphones",
        fields: [
          {
            name: "brand",
            type: "select",
            label: "Brand",
            options: ["Apple", "Samsung", "Google", "Xiaomi", "Huawei", "OnePlus", "Other"],
            required: true,
          },
          {
            name: "model",
            type: "text",
            label: "Model",
            placeholder: "e.g., iPhone 13 Pro, Galaxy S21",
            required: true,
          },
          {
            name: "storage",
            type: "select",
            label: "Storage Capacity",
            options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "Other"],
            required: true,
          },
          {
            name: "color",
            type: "text",
            label: "Color",
            placeholder: "e.g., Black, White, Gold",
            required: false,
          },
          {
            name: "accessories",
            type: "textarea",
            label: "Included Accessories",
            placeholder: "e.g., Charger, Earphones, Original Box",
            required: false,
          },
        ],
      },
      {
        id: "laptops",
        name: "Laptops & Computers",
        fields: [
          {
            name: "brand",
            type: "select",
            label: "Brand",
            options: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft", "Other"],
            required: true,
          },
          {
            name: "model",
            type: "text",
            label: "Model",
            placeholder: "e.g., MacBook Pro, XPS 13",
            required: true,
          },
          {
            name: "processor",
            type: "text",
            label: "Processor",
            placeholder: "e.g., Intel i7, AMD Ryzen 5",
            required: false,
          },
          {
            name: "ram",
            type: "select",
            label: "RAM",
            options: ["2GB", "4GB", "8GB", "16GB", "32GB", "64GB", "Other"],
            required: false,
          },
          {
            name: "storage",
            type: "text",
            label: "Storage",
            placeholder: "e.g., 512GB SSD, 1TB HDD",
            required: false,
          },
          {
            name: "screenSize",
            type: "text",
            label: "Screen Size",
            placeholder: "e.g., 13.3 inches, 15.6 inches",
            required: false,
          },
        ],
      },
      {
        id: "tablets",
        name: "Tablets & E-readers",
        fields: [
          {
            name: "brand",
            type: "select",
            label: "Brand",
            options: ["Apple", "Samsung", "Amazon", "Microsoft", "Lenovo", "Other"],
            required: true,
          },
          {
            name: "model",
            type: "text",
            label: "Model",
            placeholder: "e.g., iPad Pro, Galaxy Tab S7",
            required: true,
          },
          {
            name: "storage",
            type: "select",
            label: "Storage Capacity",
            options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "Other"],
            required: false,
          },
          {
            name: "connectivity",
            type: "select",
            label: "Connectivity",
            options: ["WiFi Only", "WiFi + Cellular", "Other"],
            required: false,
          },
        ],
      },
      {
        id: "audio",
        name: "Audio Equipment",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Headphones", "Earbuds", "Speakers", "Microphones", "Amplifiers", "Other"],
            required: true,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Bose, Sony, JBL",
            required: true,
          },
          {
            name: "model",
            type: "text",
            label: "Model",
            placeholder: "e.g., QuietComfort 35, WH-1000XM4",
            required: false,
          },
          {
            name: "connectivity",
            type: "select",
            label: "Connectivity",
            options: ["Wired", "Wireless", "Bluetooth", "WiFi", "Other"],
            required: false,
          },
        ],
      },
      {
        id: "cameras",
        name: "Cameras & Photography",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["DSLR", "Mirrorless", "Point & Shoot", "Action Camera", "Film Camera", "Drone", "Other"],
            required: true,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Canon, Nikon, Sony",
            required: true,
          },
          {
            name: "model",
            type: "text",
            label: "Model",
            placeholder: "e.g., EOS R5, Z6 II",
            required: false,
          },
          {
            name: "megapixels",
            type: "text",
            label: "Megapixels",
            placeholder: "e.g., 24MP, 45MP",
            required: false,
          },
          {
            name: "lenses",
            type: "textarea",
            label: "Included Lenses",
            placeholder: "e.g., 24-70mm f/2.8, 50mm f/1.8",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "car",
    subcategories: [
      {
        id: "cars",
        name: "Cars",
        fields: [
          {
            name: "make",
            type: "text",
            label: "Make",
            placeholder: "e.g., Toyota, Honda, Ford",
            required: true,
          },
          {
            name: "model",
            type: "text",
            label: "Model",
            placeholder: "e.g., Camry, Civic, F-150",
            required: true,
          },
          {
            name: "year",
            type: "number",
            label: "Year",
            placeholder: "e.g., 2018",
            required: true,
          },
          {
            name: "mileage",
            type: "number",
            label: "Mileage (km)",
            placeholder: "e.g., 50000",
            required: true,
          },
          {
            name: "transmission",
            type: "select",
            label: "Transmission",
            options: ["Automatic", "Manual", "CVT", "Other"],
            required: false,
          },
          {
            name: "fuelType",
            type: "select",
            label: "Fuel Type",
            options: ["Petrol", "Diesel", "Electric", "Hybrid", "Other"],
            required: false,
          },
          {
            name: "color",
            type: "text",
            label: "Color",
            placeholder: "e.g., White, Black, Silver",
            required: false,
          },
        ],
      },
      {
        id: "motorcycles",
        name: "Motorcycles",
        fields: [
          {
            name: "make",
            type: "text",
            label: "Make",
            placeholder: "e.g., Honda, Yamaha, Harley-Davidson",
            required: true,
          },
          {
            name: "model",
            type: "text",
            label: "Model",
            placeholder: "e.g., CBR, YZF, Sportster",
            required: true,
          },
          {
            name: "year",
            type: "number",
            label: "Year",
            placeholder: "e.g., 2020",
            required: true,
          },
          {
            name: "engineSize",
            type: "text",
            label: "Engine Size",
            placeholder: "e.g., 600cc, 1200cc",
            required: false,
          },
          {
            name: "mileage",
            type: "number",
            label: "Mileage (km)",
            placeholder: "e.g., 15000",
            required: false,
          },
        ],
      },
      {
        id: "bicycles",
        name: "Bicycles",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Road Bike", "Mountain Bike", "Hybrid", "City Bike", "Electric Bike", "BMX", "Other"],
            required: true,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Trek, Specialized, Giant",
            required: true,
          },
          {
            name: "frameSize",
            type: "text",
            label: "Frame Size",
            placeholder: "e.g., 54cm, Medium",
            required: false,
          },
          {
            name: "wheelSize",
            type: "text",
            label: "Wheel Size",
            placeholder: "e.g., 26 inch, 700c",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: "armchair",
    subcategories: [
      {
        id: "sofas",
        name: "Sofas & Armchairs",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Sofa", "Loveseat", "Sectional", "Armchair", "Recliner", "Other"],
            required: true,
          },
          {
            name: "material",
            type: "select",
            label: "Material",
            options: ["Leather", "Fabric", "Microfiber", "Velvet", "Other"],
            required: false,
          },
          {
            name: "color",
            type: "text",
            label: "Color",
            placeholder: "e.g., Brown, Gray, Black",
            required: false,
          },
          {
            name: "dimensions",
            type: "text",
            label: "Dimensions",
            placeholder: "e.g., 200cm x 90cm x 85cm",
            required: false,
          },
        ],
      },
      {
        id: "tables",
        name: "Tables & Desks",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Dining Table", "Coffee Table", "Side Table", "Desk", "Console Table", "Other"],
            required: true,
          },
          {
            name: "material",
            type: "select",
            label: "Material",
            options: ["Wood", "Glass", "Metal", "Plastic", "Marble", "Other"],
            required: false,
          },
          {
            name: "dimensions",
            type: "text",
            label: "Dimensions",
            placeholder: "e.g., 150cm x 80cm x 75cm",
            required: false,
          },
        ],
      },
      {
        id: "beds",
        name: "Beds & Mattresses",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Bed Frame", "Mattress", "Bunk Bed", "Sofa Bed", "Other"],
            required: true,
          },
          {
            name: "size",
            type: "select",
            label: "Size",
            options: ["Single", "Twin", "Double", "Queen", "King", "Other"],
            required: true,
          },
          {
            name: "material",
            type: "text",
            label: "Material",
            placeholder: "e.g., Wood, Metal, Upholstered",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: "shirt",
    subcategories: [
      {
        id: "mens",
        name: "Men's Clothing",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Shirts", "T-shirts", "Pants", "Jeans", "Jackets", "Suits", "Shoes", "Other"],
            required: true,
          },
          {
            name: "size",
            type: "text",
            label: "Size",
            placeholder: "e.g., M, L, 32, 42",
            required: true,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Nike, Adidas, Levi's",
            required: false,
          },
          {
            name: "color",
            type: "text",
            label: "Color",
            placeholder: "e.g., Blue, Black, White",
            required: false,
          },
        ],
      },
      {
        id: "womens",
        name: "Women's Clothing",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Dresses", "Tops", "Pants", "Skirts", "Jackets", "Shoes", "Bags", "Other"],
            required: true,
          },
          {
            name: "size",
            type: "text",
            label: "Size",
            placeholder: "e.g., S, M, 8, 10",
            required: true,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Zara, H&M, Nike",
            required: false,
          },
          {
            name: "color",
            type: "text",
            label: "Color",
            placeholder: "e.g., Red, Black, Blue",
            required: false,
          },
        ],
      },
      {
        id: "kids",
        name: "Kids' Clothing",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Other"],
            required: true,
          },
          {
            name: "size",
            type: "text",
            label: "Size",
            placeholder: "e.g., 2T, 4T, 6, 8",
            required: true,
          },
          {
            name: "gender",
            type: "select",
            label: "Gender",
            options: ["Boys", "Girls", "Unisex"],
            required: false,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Carter's, Gap Kids, Nike",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "home_appliances",
    name: "Home Appliances",
    icon: "refrigerator",
    subcategories: [
      {
        id: "kitchen",
        name: "Kitchen Appliances",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Refrigerator", "Microwave", "Blender", "Coffee Maker", "Toaster", "Other"],
            required: true,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Samsung, LG, KitchenAid",
            required: true,
          },
          {
            name: "model",
            type: "text",
            label: "Model",
            placeholder: "e.g., RT45K5000S8",
            required: false,
          },
          {
            name: "color",
            type: "text",
            label: "Color",
            placeholder: "e.g., Stainless Steel, White, Black",
            required: false,
          },
        ],
      },
      {
        id: "laundry",
        name: "Laundry Appliances",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Washing Machine", "Dryer", "Washer/Dryer Combo", "Iron", "Other"],
            required: true,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Samsung, LG, Whirlpool",
            required: true,
          },
          {
            name: "capacity",
            type: "text",
            label: "Capacity",
            placeholder: "e.g., 8kg, 10kg",
            required: false,
          },
        ],
      },
      {
        id: "climate",
        name: "Climate Control",
        fields: [
          {
            name: "type",
            type: "select",
            label: "Type",
            options: ["Air Conditioner", "Heater", "Fan", "Dehumidifier", "Air Purifier", "Other"],
            required: true,
          },
          {
            name: "brand",
            type: "text",
            label: "Brand",
            placeholder: "e.g., Daikin, Carrier, Dyson",
            required: true,
          },
          {
            name: "btu",
            type: "text",
            label: "BTU/Capacity",
            placeholder: "e.g., 12000 BTU, 1.5 Ton",
            required: false,
          },
        ],
      },
    ],
  },
]
