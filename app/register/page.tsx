"use client";
import poster from "@/shared/post";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";

const registerSchema = z
  .object({
    Firstname: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
    Lastname: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),
    Email: z.string().email("Please enter a valid email address"),
    Password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.Password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError("");

      const payload = {
        Firstname: data.Firstname,
        Lastname: data.Lastname,
        Email: data.Email,
        Password: data.Password,
      };

      // Use the poster function to send a POST request to register the user
      const response = await poster('users', payload);

      // Check if the user already exists
      if (response.error) {
        if (response.error.includes("User already exists")) {
          setError("User already exists. Please use a different email.");
        } else {
          setError(response.error);
          console.log(response.error) // Display any other error message returned by the API
        }
        return; // Prevent further processing
      }

      // Proceed if registration is successful
      router.push("/registrationbio"); // Navigate to biometric registration

    } catch (error) {
      // setError("Registration failed. Please try again.");
      
          setError("User already exists. Please use a different email.");
       
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image src="/placeholder.svg" alt="LWIE Logo" width={48} height={48} className="mx-auto" />
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join our community and start swapping!</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="f-name" className="sr-only">First Name</label>
                <input
                  {...register("Firstname")}
                  id="f-name"
                  type="text"
                  autoComplete="name"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 mb-4"
                  placeholder="First Name"
                />
                {errors.Firstname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Firstname.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="l-name" className="sr-only">Last Name</label>
                <input
                  {...register("Lastname")}
                  id="l-name"
                  type="text"
                  autoComplete="name"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 mb-4"
                  placeholder="Last Name"
                />
                {errors.Lastname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Lastname.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  {...register("Email")}
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 mb-4"
                  placeholder="Email address"
                />
                {errors.Email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Email.message}</p>}
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  {...register("Password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 mb-4"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
                {errors.Password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Password.message}</p>
                )}
              </div>
              <div className="relative">
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <input
                  {...register("confirmPassword")}
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Next"}
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-teal-600 hover:text-teal-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}