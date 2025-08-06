
"use client"

import { CustomButton } from "@/components/custom/CustomButton/CustomButton"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthModal } from "@/context/AuthModalContext"
import { useTheme } from "@/context/theme.context"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { type LoginFormData, loginSchema } from "./validation/loginSchema"

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [lookUpPass, setLookUpPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useTheme()
  const { openSignup, closeModal } = useAuthModal()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  	const onSubmit = async (data: LoginFormData) => {
		try {
			setIsLoading(true);
			const result = await signIn("credentials", {
				redirect: false,
				...data,
			});
			
			if (result?.error) {
				console.error("Login error:", result.error);
				toast.error(
					"Invalid credentials. Please check your email and password."
				);
			} else if (result?.ok) {
				toast.success("Login successful! Welcome back.");
				closeModal?.();
				onSuccess?.();
				// Profile will be automatically fetched by UserProfileProvider
			}
		} catch (error: any) {
			console.error("Login form error:", error);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

  return (
    <div className="relative w-full max-w-md mx-auto">

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-sm -z-10"></div>
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-800 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 font-medium">Sign in to continue your journey</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          className="pl-12 pr-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-500" />
                        <Input
                          type={lookUpPass ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-12 pr-12 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setLookUpPass((prev) => !prev)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                        >
                          {lookUpPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <CustomButton
                content="Sign In"
                isLoading={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700  text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              />
            </div>
          </form>
        </Form>

        {/* Sign up link */}
        <div className="text-center mt-2">
          <p className="text-gray-600 font-medium">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => openSignup()}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-bold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 hover:underline decoration-2 underline-offset-2"
            >
              Create one here
            </button>
          </p>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm