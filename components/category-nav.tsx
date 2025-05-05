"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  "All",
  "Electronics",
  "Home Appliances",
  "Toys and Games",
  "Sport",
  "Health and Beauty Products",
  "Clothing",
  "Pet Supplies",
  "Medical Instrument",
  "Travel Gear",
  "Craft and Hobby Supplies",
  "Books",
  "Furniture",            
  "Gardening Supplies",   
  "Office Supplies",      
  "Automotive",          
  "Jewelry",              
  "Video Games",          
  "Outdoor Gear",         
  "Kitchen Accessories",  
  "Seasonal Items",       
];

export function CategoryNav() {
  const [currentCategory, setCurrentCategory] = useState(0);

  const scrollCategories = (direction: "left" | "right") => {
    const container = document.getElementById("categories-container");
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-[rgba(184,200,200,1)] dark:bg-gray-800 shadow relative py-2"> {/* Modified background color */}
      {/* Left Scroll Button */}
      <button
        onClick={() => scrollCategories("left")}
        title="Scroll left"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-20 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Categories Container */}
      <div
        id="categories-container"
        className="container mx-auto px-12 overflow-x-auto scrollbar-hide"
      >
        <div className="flex items-center space-x-8 py-2 whitespace-nowrap">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setCurrentCategory(index)}
              className={`text-sm font-medium transition-colors ${
                currentCategory === index
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scrollCategories("right")}
        title="Scroll right"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-20 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </nav>
  );
}
export default CategoryNav;