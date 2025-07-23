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
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type LoginFormData, loginSchema } from "./validation/loginSchema";
import { useTheme } from "@/context/theme.context";
import { loginUser } from "@/services/authservices";
import Link from "next/link";
import { useAuthModal } from "@/context/AuthModalContext";

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [lookUpPass, setLookUpPass] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const { toast } = useTheme();
	const { setView } = useAuthModal();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	const onSubmit = async (data: LoginFormData) => {
		console.log("check out the url ",process.env.NEXT_PUBLIC_API_BASE_URL)
		try {
			setIsLoading(true);
			const response = await loginUser(data);
			if (response?.success) {
				toast.success("Login successful");
				onSuccess?.();
				console.log("Navigating to /questions");
				router.push("/questions");
			} else {
				toast.error("Invalid email or password");
			}
		} catch (error) {
			toast.error("Something went wrong");
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
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
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
						onClick={() => setView("signup")}
						className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
					>
						Create one here
					</button>
				</p>
			</div>
		</div>
	);
};

export default LoginForm;
