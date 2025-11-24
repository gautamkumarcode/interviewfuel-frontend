"use client";
import { CustomButton } from "@/components/custom/CustomButton/CustomButton";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthModal } from "@/context/AuthModalContext";
import { useTheme } from "@/context/theme.context";
import { signupUser } from "@/services/authservices";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type SignupFormData, signupSchema } from "./validation/signupSchema";

type Props = {
	onSuccess?: () => void;
};

export const SignupForm = ({ onSuccess }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lookUpPass, setLookUpPass] = useState<boolean>(false);
	const { toast } = useTheme();
	const { openLogin } = useAuthModal();

	// Get the current page URL for redirect after signup
	const callbackUrl =
		typeof window !== "undefined" ? window.location.href : "/";

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	const onSubmit = async (data: SignupFormData) => {
		try {
			setIsLoading(true);

			const response = await signupUser(data);

			if (response?.success) {
				toast.success(
					"Account created successfully! Please login to continue."
				);
				onSuccess?.();
			} else {
				toast.error(response?.message || "Signup failed. Please try again.");
			}
		} catch (error: any) {
			console.error("Signup error:", {
				message: error?.message,
				response: error?.response?.data,
				status: error?.response?.status,
			});

			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				"Something went wrong. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="relative w-full max-w-xl mx-auto">
			<div className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 rounded-3xl blur-sm -z-10"></div>

				<div className="text-center mb-2">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-4 shadow-lg">
						<UserPlus className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-green-800 bg-clip-text text-transparent mb-2">
						Create Account
					</h1>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Full Name Field */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-sm font-semibold text-gray-700">
										Full Name
									</FormLabel>
									<FormControl>
										<div className="relative group">
											<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											<div className="relative">
												<User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
												<Input
													className="pl-12 pr-4 py-4 h-12 bg-gray-50/50 border-2 border-gray-200 rounded-md focus:border-emerald-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
													placeholder="Your full name"
													{...field}
												/>
											</div>
										</div>
									</FormControl>
									<FormMessage className="text-red-500 text-sm" />
								</FormItem>
							)}
						/>

						{/* Username Field */}
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-sm font-semibold text-gray-700">
										Username
									</FormLabel>
									<FormControl>
										<div className="relative group">
											<div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											<div className="relative">
												<User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
												<Input
													className="pl-12 pr-4 py-4 h-12 bg-gray-50/50 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
													placeholder="username"
													{...field}
												/>
											</div>
										</div>
									</FormControl>
									<FormMessage className="text-red-500 text-sm" />
								</FormItem>
							)}
						/>

						{/* Email Field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-sm font-semibold text-gray-700">
										Email Address
									</FormLabel>
									<FormControl>
										<div className="relative group">
											<div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											<div className="relative">
												<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
												<Input
													type="email"
													className="pl-12 pr-4 py-4 h-12 bg-gray-50/50 border-2 border-gray-200 rounded-md focus:border-indigo-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
													placeholder="user@gmail.com"
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
									<FormLabel className="text-sm font-semibold text-gray-700">
										Password
									</FormLabel>
									<FormControl>
										<div className="relative group">
											<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											<div className="relative">
												<Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-500" />
												<Input
													type={lookUpPass ? "text" : "password"}
													placeholder="Enter your password"
													className="pl-12 pr-12 py-4 h-12  bg-gray-50/50 border-2 border-gray-200 rounded-md focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
													{...field}
												/>
												<button
													type="button"
													onClick={() => setLookUpPass((prev) => !prev)}
													className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100">
													{lookUpPass ? (
														<EyeOff size={18} />
													) : (
														<Eye size={18} />
													)}
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
								content="Create Account"
								isLoading={isLoading}
								className="w-full py-3 h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
							/>
						</div>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-white text-gray-500 font-medium">
									Or sign up with
								</span>
							</div>
						</div>

						{/* OAuth Buttons */}
						<div className="grid grid-cols-2 gap-4">
							<button
								type="button"
								onClick={() => signIn("google", { callbackUrl })}
								disabled={isLoading}
								className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-md hover:border-red-300 hover:bg-red-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group">
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<path
										fill="#4285F4"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="#34A853"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="#FBBC05"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="#EA4335"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								<span className="font-medium text-gray-700">Google</span>
							</button>
							<button
								type="button"
								onClick={() => signIn("github", { callbackUrl })}
								disabled={isLoading}
								className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group">
								<svg
									className="w-5 h-5"
									viewBox="0 0 24 24"
									fill="currentColor">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
								<span className="font-medium text-gray-700">GitHub</span>
							</button>
						</div>
					</form>
				</Form>
				{/* Login link */}
				<div className="text-center mt-4">
					<p className="text-gray-600 font-medium">
						Already have an account?{" "}
						<button
							type="button"
							onClick={() => openLogin()}
							className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-bold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 hover:underline decoration-2 underline-offset-2">
							Login Here
						</button>
					</p>
				</div>
				<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
					<div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
				</div>
			</div>
		</div>
	);
};