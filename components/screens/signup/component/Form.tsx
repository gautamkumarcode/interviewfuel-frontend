"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { type SignupFormData, signupSchema } from "./validation/signupSchema"
import { signupUser } from "@/services/authservices"
import { CustomButton } from "@/components/custom/CustomButton/CustomButton"
import { Mail, User, Lock, EyeOff, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export const SignupForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [lookUpPass, setLookUpPass] = useState<boolean>(false);


	const router = useRouter();

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
		mode: "onChange",
	})

	const onSubmit = async (data: SignupFormData) => {
		try {
			setIsLoading(true)
			const response = await signupUser(data)
			toast.success("login successfull")
			router.push("/login")
		} catch (error: any) {
			toast.error(" Signup failed:", error.response?.data?.message || error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleTogglePasswordCheck = () => {
		setLookUpPass((prev) => !prev)
	}
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
					<p className="text-gray-600">Join us today and start your journey</p>
				</div>

				{/* Form Container */}
				<div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-semibold text-gray-700">Full Name</FormLabel>
										<FormControl>
											<div className="relative">
												<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
												<Input
													placeholder="Gautam Kumar"
													className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage className="text-red-500 text-xs" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-semibold text-gray-700">Username</FormLabel>
										<FormControl>
											<div className="relative">
												<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
												<Input
													placeholder="gautam"
													className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage className="text-red-500 text-xs" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
										<FormControl>
											<div className="relative">
												<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
												<Input
													type="email"
													placeholder="gautam@gmail.com"
													className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage className="text-red-500 text-xs" />
									</FormItem>
								)}
							/>

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
													className={`pl-10 pr-12 h-12 rounded-lg transition-all duration-200 ${form.formState.errors.password
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

							<div className="pt-2">
								<CustomButton
									content="Create Account"
									isLoading={isLoading}
									className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
								/>
							</div>
						</form>
					</Form>

					{/* Footer */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
							>
								Sign in here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
