"use client";

import type React from "react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Code, Headphones, MapPin, Phone, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
  sendCopy: boolean;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    sendCopy: true,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      sendCopy: e.target.checked,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
        sendCopy: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400&text=Community+Work",
    "/placeholder.svg?height=400&width=400&text=Donation+Drive",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <section className="mb-32 w-full">
      {/* Back to Charity Link */}
      <div className="container px-4 sm:px-6 md:px-12 py-4">
        <Link
          href="/charity"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-teal-500 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Charity
        </Link>
      </div>

      {/* Company Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 mx-2 md:mx-4">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/2 h-48 ">
            {/* Image container */}
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt="Charity work"
              className="w-full h-full object-cover"
            />

            {/* Navigation buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                onClick={prevImage}
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full bg-white/80 text-gray-800 hover:bg-white ml-2"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous image</span>
              </Button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                onClick={nextImage}
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full bg-white/80 text-gray-800 hover:bg-white mr-2"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>

            {/* Image indicator dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 md:w-1/2">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Charity Development Center</h2>
            <p className="text-gray-600 mb-4">
              We are a non-profit organization dedicated to helping those in need through various donation programs
              and community initiatives. Our mission is to create a positive impact in our local community.
            </p>
            <div className="flex flex-wrap gap-2">
              <h3 className="text-sm font-medium text-gray-700 mr-2">Current Needs:</h3>
              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">Clothes</Badge>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Food</Badge>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Books</Badge>
              <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">Toys</Badge>
            </div>
          </div>
        </div>
      </div>

      <div
        id="map"
        className="relative h-[300px] sm:h-[400px] md:h-[480px] overflow-hidden bg-cover bg-[50%] bg-no-repeat"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11672.945750644447!2d-122.42107853750231!3d37.7730507907087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858070cc2fbd55%3A0xa71491d736f62d5c!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1619524992238!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          aria-label="Location map"
        ></iframe>
      </div>

      <div className="container px-4 sm:px-6 md:px-12">
        <div className="block rounded-lg bg-white/80 px-4 py-8 shadow-lg sm:px-6 md:py-12 md:px-8 -mt-[60px] sm:-mt-[80px] md:-mt-[100px] backdrop-blur-[30px] border border-gray-300">
          <div className="flex flex-wrap">
            <div className="mb-10 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
              <form onSubmit={handleSubmit}>
                <div className="relative mb-6">
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`peer block min-h-[auto] w-full rounded border-2 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-primary`}
                    placeholder=" "
                  />
                  <label
                    className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out ${
                      formData.name ? "-translate-y-[0.9rem] scale-[0.8] text-primary" : ""
                    } peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary`}
                    htmlFor="name"
                  >
                    Name
                  </label>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="relative mb-6">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`peer block min-h-[auto] w-full rounded border-2 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-primary`}
                    placeholder=" "
                  />
                  <label
                    className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out ${
                      formData.email ? "-translate-y-[0.9rem] scale-[0.8] text-primary" : ""
                    } peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary`}
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div className="relative mb-6">
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`peer block min-h-[auto] w-full rounded border-2 ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    } bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:border-primary`}
                    rows={3}
                    placeholder=" "
                  />
                  <label
                    htmlFor="message"
                    className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out ${
                      formData.message ? "-translate-y-[0.9rem] scale-[0.8] text-primary" : ""
                    } peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary`}
                  >
                    Message
                  </label>
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>
                <div className="mb-6 inline-block min-h-[1.5rem] justify-center pl-[1.5rem] md:flex">
                  <input
                    className="relative float-left mt-[0.15rem] mr-[6px] -ml-[1.5rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none checked:border-primary checked:bg-primary cursor-pointer"
                    type="checkbox"
                    id="sendCopy"
                    name="sendCopy"
                    checked={formData.sendCopy}
                    onChange={handleCheckboxChange}
                  />
                  <label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="sendCopy">
                    Send me a copy of this message
                  </label>
                </div>
                <Button
                  type="submit"
                  className="mb-6 w-full rounded bg-teal-500 hover:bg-teal-600 text-white px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal transition-colors lg:mb-0"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </form>
            </div>
            <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
              <div className="flex flex-wrap">
                {/* Technical Support Card */}
                <div className="mb-8 w-full shrink-0 grow-0 basis-auto sm:w-1/2 sm:px-3 lg:w-full lg:px-6 xl:w-1/2">
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <div className="inline-block rounded-md p-4 group">
                        <Headphones className="h-6 w-6 text-black transition-colors duration-200 group-hover:text-teal-500" />
                      </div>
                    </div>
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold">Technical support</p>
                      <p className="text-sm text-neutral-500">example@gmail.com</p>
                      <p className="text-sm text-neutral-500">1-600-890-4567</p>
                    </div>
                  </div>
                </div>
                {/* Address Card */}
                <div className="mb-8 w-full shrink-0 grow-0 basis-auto sm:w-1/2 sm:px-3 lg:w-full lg:px-6 xl:w-1/2">
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <div className="inline-block rounded-md p-4 group">
                        <MapPin className="h-6 w-6 text-black transition-colors duration-200 group-hover:text-teal-500" />
                      </div>
                    </div>
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold">Address</p>
                      <p className="text-sm text-neutral-500">
                        123 Innovation Drive, <br /> San Francisco, CA 94103 <br />
                      </p>
                    </div>
                  </div>
                </div>
                {/* Land Line Card */}
                <div className="mb-8 w-full shrink-0 grow-0 basis-auto sm:w-1/2 sm:px-3 lg:mb-8 lg:w-full lg:px-6 xl:w-1/2">
                  <div className="align-start flex">
                    <div className="shrink-0">
                      <div className="inline-block rounded-md p-4 group">
                        <Phone className="h-6 w-6 text-black transition-colors duration-200 group-hover:text-teal-500" />
                      </div>
                    </div>
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold">Land Line</p>
                      <p className="text-neutral-500">(0421) 431 2030</p>
                    </div>
                  </div>
                </div>
                {/* Mobile Card */}
                <div className="w-full shrink-0 grow-0 basis-auto sm:w-1/2 sm:px-3 lg:w-full lg:px-6 xl:mb-8 xl:w-1/2">
                  <div className="align-start flex">
                    <div className="shrink-0">
                      <div className="inline-block rounded-md p-4 group">
                        <Smartphone className="h-6 w-6 text-black transition-colors duration-200 group-hover:text-teal-500" />
                      </div>
                    </div>
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold">Mobile</p>
                      <p className="text-neutral-500">+91 123456789</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;