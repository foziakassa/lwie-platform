"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { savePost } from "@/lib/posts-storage"
import { serviceCategories } from "@/lib/categories"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Briefcase, Wrench, Scissors, Palette, Truck, Utensils, Laptop, Heart, GraduationCap, Home } from "lucide-react"

export function PostServiceForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    location: "",
    pricing: {
      type: "hourly",
      rate: "",
      currency: "ETB"
    },
    experience: "",
    terms: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePricingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category: value,
      subcategory: "" // Reset subcategory when category changes
    }));
  };

  const handleSubcategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, subcategory: value }));
  };

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const getSubcategories = () => {
    const category = serviceCategories.find(cat => cat.name === formData.category);
    return category?.subcategories || [];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Professional":
        return <Briefcase className="h-5 w-5 mr-2" />;
      case "Home Services":
        return <Home className="h-5 w-5 mr-2" />;
      case "Repair":
        return <Wrench className="h-5 w-5 mr-2" />;
      case "Beauty":
        return <Scissors className="h-5 w-5 mr-2" />;
      case "Creative":
        return <Palette className="h-5 w-5 mr-2" />;
      case "Transport":
        return <Truck className="h-5 w-5 mr-2" />;
      case "Food":
        return <Utensils className="h-5 w-5 mr-2" />;
      case "Tech":
        return <Laptop className="h-5 w-5 mr-2" />;
      case "Health":
        return <Heart className="h-5 w-5 mr-2" />;
      case "Education":
        return <GraduationCap className="h-5 w-5 mr-2" />;
      default:
        return <Briefcase className="h-5 w-5 mr-2" />;
    }
  };

  const handleSaveDraft = () => {
    const post = {
      id: Date.now().toString(),
      type: "service",
      title: formData.title,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      location: formData.location,
      pricing: formData.pricing,
      experience: formData.experience,
      terms: formData.terms,
      images: images,
      createdAt: new Date().toISOString(),
      status: "draft"
    };
    
    savePost(post);
    alert("Draft saved successfully!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.category || !formData.description || !formData.location) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }
    
    const post = {
      id: Date.now().toString(),
      type: "service",
      title: formData.title,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      location: formData.location,
      pricing: formData.pricing,
      experience: formData.experience,
      terms: formData.terms,
      images: images,
      createdAt: new Date().toISOString(),
      status: "published"
    };
    
    savePost(post);
    router.push("/post/success");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 shadow-md rounded-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="pricing-terms">Pricing & Terms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic-info" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="What service are you offering?" 
                  required 
                />
              </div>
              
              <div className="space-y-2">

\
