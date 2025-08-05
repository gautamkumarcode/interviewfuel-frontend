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
import { useTheme } from "@/context/theme.context";
import { signupUser } from "@/services/authservices";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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
				toast.success("Account created successfully! Please login to continue.");
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
			
			const errorMessage = error?.response?.data?.message || 
							   error?.message || 
							   "Something went wrong. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full p-6 bg-white shadow-lg rounded-md">
			<h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{/* Full Name */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
										<Input
											className="pl-10"
											placeholder="Gautam Kumar"
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Username */}
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
										<Input className="pl-10" placeholder="gautam" {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Email */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email Address</FormLabel>
								<FormControl>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
										<Input
											type="email"
											className="pl-10"
											placeholder="gautam@gmail.com"
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
										<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
										<Input
											type={lookUpPass ? "text" : "password"}
											placeholder="Enter your password"
											className="pl-10 pr-10"
											{...field}
										/>
										<button
											type="button"
											onClick={() => setLookUpPass((prev) => !prev)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
											{lookUpPass ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<div>
						<CustomButton
							content="Create Account"
							isLoading={isLoading}
							className="w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
						/>
					</div>
				</form>
			</Form>
			<div className="mt-6 text-center">
				<p className="text-sm text-gray-600">
					Already have an account?{" "}
					<button
						type="button"
						// onClick={() => setView("login")}
						className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
						Login Here
					</button>
				</p>
			</div>
		</div>
	);
};
