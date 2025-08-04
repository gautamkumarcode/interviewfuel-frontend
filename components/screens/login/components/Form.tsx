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
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type LoginFormData, loginSchema } from "./validation/loginSchema";

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [lookUpPass, setLookUpPass] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const { toast } = useTheme();
	const { openSignup ,closeModal} = useAuthModal();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});

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
		<div className="w-full max-w-md p-6 rounded-2xl bg-white shadow-lg">
			{/* Header */}
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
				<p className="text-sm text-gray-600">Sign in to your account</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Email */}
					<FormField
						name="email"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email Address</FormLabel>
								<FormControl>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<Input
											placeholder="Enter your email"
											type="email"
											className="pl-10"
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password */}
					<FormField
						name="password"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
										<Input
											type={lookUpPass ? "text" : "password"}
											placeholder="Enter your password"
											className="pl-10 pr-10"
											{...field}
										/>
										<button
											type="button"
											onClick={() => setLookUpPass((prev) => !prev)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
											{lookUpPass ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<CustomButton
						content="Sign In"
						isLoading={isLoading}
						className="w-full"
					/>
				</form>
			</Form>
			<div className="mt-6 text-center">
				<p className="text-sm text-gray-600">
					Don&apos;t have an account?{" "}
					<button
						type="button"
						onClick={() => openSignup()}
						className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
						Create one here
					</button>
				</p>
			</div>
		</div>
	);
};

export default LoginForm;
