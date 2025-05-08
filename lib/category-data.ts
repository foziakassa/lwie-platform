export type SubcategoryOption = {
  value: string
  label: string
}

// Item categories
export const itemCategories = [
  { value: "electronics", label: "Electronics" },
  { value: "vehicles", label: "Vehicles" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "toys", label: "Toys & Games" },
  { value: "home-appliances", label: "Home Appliances" },
]

// Service categories
export const serviceCategories = [
  { value: "home-services", label: "Home Services" },
  { value: "professional-services", label: "Professional Services" },
  { value: "education", label: "Education & Tutoring" },
  { value: "events", label: "Events & Entertainment" },
  { value: "health", label: "Health & Wellness" },
  { value: "tech-services", label: "Tech Services" },
]

// Get subcategories based on category and type (item or service)
export function getSubcategories(category: string, type: "item" | "service"): SubcategoryOption[] {
  const subcategories: Record<string, SubcategoryOption[]> = {
    // Item subcategories
    electronics: [
      { value: "smartphones", label: "Smartphones" },
      { value: "laptops", label: "Laptops & Computers" },
      { value: "tablets", label: "Tablets" },
      { value: "cameras", label: "Cameras" },
      { value: "audio", label: "Audio Equipment" },
      { value: "tvs", label: "TVs & Monitors" },
      { value: "gaming", label: "Gaming Consoles" },
    ],
    vehicles: [
      { value: "cars", label: "Cars" },
      { value: "motorcycles", label: "Motorcycles" },
      { value: "bicycles", label: "Bicycles" },
      { value: "parts", label: "Vehicle Parts" },
    ],
    furniture: [
      { value: "sofas", label: "Sofas & Couches" },
      { value: "tables", label: "Tables" },
      { value: "chairs", label: "Chairs" },
      { value: "beds", label: "Beds & Mattresses" },
      { value: "storage", label: "Storage & Organization" },
    ],
    clothing: [
      { value: "mens", label: "Men's Clothing" },
      { value: "womens", label: "Women's Clothing" },
      { value: "kids", label: "Kids' Clothing" },
      { value: "shoes", label: "Shoes" },
      { value: "accessories", label: "Accessories" },
    ],
    books: [
      { value: "fiction", label: "Fiction" },
      { value: "non-fiction", label: "Non-Fiction" },
      { value: "textbooks", label: "Textbooks" },
      { value: "magazines", label: "Magazines" },
    ],
    sports: [
      { value: "fitness", label: "Fitness Equipment" },
      { value: "outdoor", label: "Outdoor Gear" },
      { value: "team-sports", label: "Team Sports" },
      { value: "water-sports", label: "Water Sports" },
    ],
    toys: [
      { value: "board-games", label: "Board Games" },
      { value: "action-figures", label: "Action Figures" },
      { value: "educational", label: "Educational Toys" },
      { value: "dolls", label: "Dolls & Stuffed Animals" },
    ],
    "home-appliances": [
      { value: "kitchen", label: "Kitchen Appliances" },
      { value: "laundry", label: "Laundry Appliances" },
      { value: "cleaning", label: "Cleaning Appliances" },
      { value: "climate", label: "Climate Control" },
    ],

    // Service subcategories
    "home-services": [
      { value: "cleaning", label: "Cleaning Services" },
      { value: "plumbing", label: "Plumbing" },
      { value: "electrical", label: "Electrical" },
      { value: "gardening", label: "Gardening & Landscaping" },
      { value: "moving", label: "Moving & Delivery" },
    ],
    "professional-services": [
      { value: "legal", label: "Legal Services" },
      { value: "accounting", label: "Accounting & Finance" },
      { value: "marketing", label: "Marketing & Advertising" },
      { value: "design", label: "Design Services" },
      { value: "consulting", label: "Consulting" },
    ],
    education: [
      { value: "academic", label: "Academic Tutoring" },
      { value: "language", label: "Language Lessons" },
      { value: "music", label: "Music Lessons" },
      { value: "art", label: "Art & Craft Classes" },
      { value: "computer", label: "Computer & Tech Training" },
    ],
    events: [
      { value: "photography", label: "Photography" },
      { value: "catering", label: "Catering" },
      { value: "planning", label: "Event Planning" },
      { value: "music", label: "Music & Entertainment" },
      { value: "decoration", label: "Decoration Services" },
    ],
    health: [
      { value: "fitness", label: "Fitness Training" },
      { value: "yoga", label: "Yoga & Meditation" },
      { value: "massage", label: "Massage Therapy" },
      { value: "nutrition", label: "Nutrition Consulting" },
      { value: "counseling", label: "Counseling" },
    ],
    "tech-services": [
      { value: "repair", label: "Device Repair" },
      { value: "development", label: "Software Development" },
      { value: "it-support", label: "IT Support" },
      { value: "web-design", label: "Web Design" },
      { value: "data", label: "Data Services" },
    ],
  }

  return subcategories[category] || []
}

// Get specifications based on category and subcategory
export function getSpecifications(category: string, subcategory: string): string[] {
  const specifications: Record<string, Record<string, string[]>> = {
    electronics: {
      smartphones: ["Brand", "Model", "Storage", "Color", "Battery", "Condition Details"],
      laptops: ["Brand", "Model", "Processor", "RAM", "Storage", "Graphics Card", "Battery"],
      tablets: ["Brand", "Model", "Storage", "Screen Size", "Battery", "Connectivity"],
      cameras: ["Brand", "Model", "Type", "Megapixels", "Lens Included"],
      audio: ["Brand", "Type", "Connectivity", "Battery", "Features"],
      tvs: ["Brand", "Screen Size", "Resolution", "Smart Features"],
      gaming: ["Brand", "Model", "Storage", "Battery", "Included Accessories"],
    },
    vehicles: {
      cars: ["Make", "Model", "Year", "Mileage", "Fuel Type", "Transmission"],
      motorcycles: ["Make", "Model", "Year", "Engine Size", "Mileage"],
      bicycles: ["Type", "Brand", "Frame Size", "Gears", "Material"],
      parts: ["Part Type", "Compatible With", "Brand", "Condition Details"],
    },
    furniture: {
      sofas: ["Material", "Color", "Seating Capacity", "Dimensions"],
      tables: ["Material", "Shape", "Dimensions", "Style"],
      chairs: ["Material", "Style", "Color", "Quantity"],
      beds: ["Size", "Material", "Includes Mattress", "Dimensions"],
      storage: ["Type", "Material", "Dimensions", "Color"],
    },
    clothing: {
      mens: ["Type", "Size", "Brand", "Color", "Material"],
      womens: ["Type", "Size", "Brand", "Color", "Material"],
      kids: ["Type", "Size", "Age Range", "Brand", "Color"],
      shoes: ["Type", "Size", "Brand", "Color", "Material"],
      accessories: ["Type", "Brand", "Material", "Color"],
    },
  }

  return specifications[category]?.[subcategory] || []
}

// Get specification options based on category, subcategory, and specification
export function getSpecificationOptions(
  category: string,
  subcategory: string,
  specification: string,
  dependentValues?: Record<string, string>,
): string[] {
  const options: Record<string, Record<string, Record<string, string[]>>> = {
    electronics: {
      smartphones: {
        Brand: ["Apple", "Samsung", "Xiaomi", "Huawei", "Google", "OnePlus", "Oppo", "Vivo", "Tecno", "Infinix"],
        Storage: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
        Color: ["Black", "White", "Silver", "Gold", "Blue", "Red", "Green", "Purple", "Yellow"],
        Battery: ["1000-2000 mAh", "2000-3000 mAh", "3000-4000 mAh", "4000-5000 mAh", "5000+ mAh"],
      },
      laptops: {
        Brand: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft", "MSI", "Toshiba", "Samsung"],
        Processor: [
          "Intel Core i3",
          "Intel Core i5",
          "Intel Core i7",
          "Intel Core i9",
          "AMD Ryzen 3",
          "AMD Ryzen 5",
          "AMD Ryzen 7",
          "AMD Ryzen 9",
          "Apple M1",
          "Apple M2",
          "Apple M3",
        ],
        RAM: ["4GB", "8GB", "16GB", "32GB", "64GB"],
        Storage: ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
        "Graphics Card": [
          "Integrated",
          "NVIDIA GTX 1650",
          "NVIDIA GTX 1660",
          "NVIDIA RTX 3050",
          "NVIDIA RTX 3060",
          "NVIDIA RTX 3070",
          "NVIDIA RTX 4060",
          "AMD Radeon",
        ],
        Battery: ["Up to 5 hours", "5-8 hours", "8-12 hours", "12-15 hours", "15+ hours"],
      },
      tablets: {
        Brand: ["Apple", "Samsung", "Microsoft", "Lenovo", "Huawei", "Amazon", "Google"],
        Storage: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
        "Screen Size": ["7-8 inch", "9-10 inch", "11-12 inch", "12+ inch"],
        Connectivity: ["Wi-Fi Only", "Wi-Fi + Cellular"],
        Battery: ["Up to 6 hours", "6-10 hours", "10-12 hours", "12+ hours"],
      },
      audio: {
        Brand: ["Sony", "Bose", "JBL", "Apple", "Samsung", "Sennheiser", "Audio-Technica", "Beats", "Skullcandy"],
        Type: ["Headphones", "Earbuds", "Speakers", "Soundbars", "Microphones"],
        Connectivity: ["Wired", "Bluetooth", "Wi-Fi", "Multi-connection"],
        Battery: ["Up to 5 hours", "5-10 hours", "10-20 hours", "20-30 hours", "30+ hours", "Not applicable"],
      },
      gaming: {
        Brand: ["Sony", "Microsoft", "Nintendo", "Valve", "Razer", "Logitech", "SteelSeries"],
        Battery: ["Up to 5 hours", "5-10 hours", "10+ hours", "Not applicable"],
      },
    },
    vehicles: {
      cars: {
        Make: [
          "Toyota",
          "Honda",
          "Ford",
          "Chevrolet",
          "Nissan",
          "Hyundai",
          "Kia",
          "Volkswagen",
          "BMW",
          "Mercedes-Benz",
          "Audi",
          "Suzuki",
        ],
        "Fuel Type": ["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"],
        Transmission: ["Automatic", "Manual", "CVT", "Semi-Automatic"],
      },
    },
    furniture: {
      sofas: {
        Material: ["Leather", "Fabric", "Microfiber", "Velvet", "Faux Leather", "Wood", "Metal"],
        Color: ["Black", "Brown", "White", "Gray", "Beige", "Blue", "Green", "Red", "Yellow", "Purple", "Orange"],
        "Seating Capacity": ["1-2 People", "3 People", "4 People", "5+ People", "Sectional"],
      },
    },
  }

  // Brand-specific models mapping
  const brandModels: Record<string, Record<string, Record<string, string[]>>> = {
    electronics: {
      smartphones: {
        Apple: ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone SE", "iPhone 12", "iPhone 11"],
        Samsung: ["Galaxy S22", "Galaxy S23", "Galaxy S24", "Galaxy A53", "Galaxy Note 20", "Galaxy Z Flip"],
        Xiaomi: ["Redmi Note 12", "Redmi Note 13", "Mi 12", "Mi 13", "POCO F5", "POCO X5"],
        Huawei: ["P40", "P50", "Mate 40", "Mate 50", "Nova 9", "Nova 10"],
        Google: ["Pixel 7", "Pixel 8", "Pixel 7a", "Pixel 8a", "Pixel 6", "Pixel 6a"],
        OnePlus: ["OnePlus 11", "OnePlus 10", "OnePlus Nord 3", "OnePlus Nord CE 3", "OnePlus 9"],
        Oppo: ["Find X5", "Find X6", "Reno 8", "Reno 9", "A78", "A98"],
        Vivo: ["V27", "V29", "X90", "X100", "Y35", "Y36"],
        Tecno: ["Phantom X2", "Camon 20", "Spark 10", "Pova 5", "Pop 7"],
        Infinix: ["Note 30", "Hot 30", "Zero 30", "Smart 7", "Note 12"],
      },
      laptops: {
        Apple: ["MacBook Air M1", "MacBook Air M2", 'MacBook Pro 13"', 'MacBook Pro 14"', 'MacBook Pro 16"'],
        Dell: ["XPS 13", "XPS 15", "XPS 17", "Inspiron 15", "Inspiron 14", "Latitude 7420", "Precision 5570"],
        HP: ["Spectre x360", "Envy 13", "Envy 15", "Pavilion 14", "Pavilion 15", "EliteBook 840", "Omen 16"],
        Lenovo: ["ThinkPad X1 Carbon", "ThinkPad T14", "Yoga 9i", "IdeaPad Slim 5", "Legion 5", "Legion 7"],
        Asus: ["ZenBook 14", "ZenBook Pro", "ROG Zephyrus G14", "ROG Strix", "VivoBook 15", "TUF Gaming A15"],
        Acer: ["Swift 5", "Swift 3", "Aspire 5", "Predator Helios 300", "Nitro 5", "ConceptD 7"],
        Microsoft: ["Surface Laptop 5", "Surface Laptop Studio", "Surface Pro 9", "Surface Book 3"],
        MSI: ["GS66 Stealth", "GE76 Raider", "Prestige 14", "Modern 15", "Katana GF66", "Creator Z16"],
        Toshiba: ["Portege X30", "Tecra X40", "Satellite Pro C50", "Dynabook Tecra A50"],
        Samsung: ["Galaxy Book3 Pro", "Galaxy Book3 Ultra", "Galaxy Book3 360", "Galaxy Book Go"],
      },
      tablets: {
        Apple: ["iPad (9th gen)", "iPad (10th gen)", "iPad Air", 'iPad Pro 11"', 'iPad Pro 12.9"', "iPad mini"],
        Samsung: ["Galaxy Tab S8", "Galaxy Tab S8+", "Galaxy Tab S8 Ultra", "Galaxy Tab A8", "Galaxy Tab A7 Lite"],
        Microsoft: ["Surface Pro 9", "Surface Pro 8", "Surface Go 3"],
        Lenovo: ["Tab P11 Pro", "Tab P11", "Tab M10", "Yoga Tab 13"],
        Huawei: ["MatePad Pro", "MatePad 11", "MatePad T10"],
        Amazon: ["Fire HD 10", "Fire HD 8", "Fire 7"],
        Google: ["Pixel Tablet"],
      },
      audio: {
        Sony: ["WH-1000XM5", "WH-1000XM4", "WF-1000XM4", "SRS-XB33", "HT-A7000"],
        Bose: ["QuietComfort 45", "Noise Cancelling 700", "QuietComfort Earbuds", "SoundLink Revolve+"],
        JBL: ["Flip 6", "Charge 5", "Tune 760NC", "Live Pro 2", "Quantum 800"],
        Apple: ["AirPods Pro", "AirPods Max", "AirPods (3rd gen)", "HomePod mini"],
        Samsung: ["Galaxy Buds Pro", "Galaxy Buds2", "Galaxy Buds Live", "HW-Q990B"],
        Sennheiser: ["Momentum 4", "HD 660S", "IE 600", "AMBEO Soundbar"],
        "Audio-Technica": ["ATH-M50x", "ATH-ANC900BT", "AT2020", "ATH-G1"],
        Beats: ["Beats Studio Buds", "Beats Fit Pro", "Beats Solo 3", "Beats Studio 3"],
        Skullcandy: ["Crusher Evo", "Indy ANC", "Hesh ANC", "Dime 2"],
      },
      gaming: {
        Sony: ["PlayStation 5", "PlayStation 4", "PlayStation 4 Pro", "PlayStation VR2"],
        Microsoft: ["Xbox Series X", "Xbox Series S", "Xbox One X", "Xbox One S"],
        Nintendo: ["Switch", "Switch Lite", "Switch OLED"],
        Valve: ["Steam Deck"],
        Razer: ["Kishi", "Wolverine V2", "Kaira Pro"],
        Logitech: ["G29", "G920", "G Pro X", "G502"],
        SteelSeries: ["Arctis Nova Pro", "Arctis 7+", "Stratus+"],
      },
    },
    vehicles: {
      cars: {
        Toyota: ["Corolla", "Camry", "RAV4", "Highlander", "Land Cruiser", "Prius", "Yaris", "Fortuner", "Hilux"],
        Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit", "Odyssey"],
        Ford: ["F-150", "Ranger", "Explorer", "Escape", "Mustang", "Edge", "Bronco"],
        Chevrolet: ["Silverado", "Malibu", "Equinox", "Tahoe", "Suburban", "Traverse", "Trax"],
        Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Murano", "Kicks", "Frontier"],
        Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "Palisade", "Venue"],
        Kia: ["Sportage", "Sorento", "Forte", "K5", "Telluride", "Soul", "Seltos"],
        Volkswagen: ["Golf", "Jetta", "Passat", "Tiguan", "Atlas", "Taos", "ID.4"],
        BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series", "X1", "X7"],
        "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "A-Class", "GLA"],
        Audi: ["A4", "A6", "Q5", "Q7", "A3", "Q3", "e-tron"],
        Suzuki: ["Swift", "Vitara", "Jimny", "S-Presso", "Baleno", "Ertiga", "XL7"],
      },
    },
  }

  // Get base options
  const result = options[category]?.[subcategory]?.[specification] || []

  // If this is a Model field and we have a Brand/Make value, filter the models
  if (specification === "Model" && dependentValues) {
    const brandValue = dependentValues["Brand"] || dependentValues["Make"]
    if (brandValue && brandModels[category]?.[subcategory]?.[brandValue]) {
      return brandModels[category][subcategory][brandValue]
    }
  }

  return result
}
