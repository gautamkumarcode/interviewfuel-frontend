"use client"

import { CustomButton } from "@/components/custom/CustomButton/CustomButton"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  type LoginFormData,
  loginSchema,
} from "./validation/loginSchema"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUser } from "@/services/authservices"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LoginForm = () => {
  const [lookUpPass, setLookUpPass] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
   
	const router =useRouter();

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
		  setIsLoading(true)
		  const response = await loginUser(data)
		  toast.success("login successfull")
		  router.push("/dashboard")
		} catch (error: any) {
			toast.error("signup failed",error.response?.data?.message || error.message)
		} finally {
		  setIsLoading(false)
		}
  }

  const handleTogglePasswordCheck = () => {
    setLookUpPass((prev) => !prev)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="text"
                          placeholder="Enter your email"
                          className={`pl-10 h-12 rounded-lg transition-all duration-200 ${
                            form.formState.errors.email
                              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                              : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          }`}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={lookUpPass ? "text" : "password"}
                          placeholder="Enter your password"
                          className={`pl-10 pr-12 h-12 rounded-lg transition-all duration-200 ${
                            form.formState.errors.password
                              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                              : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          }`}
                          {...field}
                        />
                        {/* Eye toggle icon */}
                        <button
                          type="button"
                          onClick={handleTogglePasswordCheck}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                        >
                          {lookUpPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-2">
                <CustomButton
                  content="Sign In"
                  isLoading={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                />
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
             Don&apos;t have an account?
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
