"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { ForgotPasswordFormData, forgotPasswordSchema } from "./component/validation/forgotPasswordSchema";
import { CustomButton } from "@/components/custom/CustomButton/CustomButton";

 const ForgotPassword = () => {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
		mode: "onChange",
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		try {
			setIsLoading(true);
			// const response = await sendForgotPassword(data);
            console.log(data)
		} catch (error: any) {
			console.error(" Forgot password error:", error.response?.data?.message || error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center px-4 py-8 bg-gray-100 h-screen">
			<h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
			<p className="text-sm text-gray-600 mb-6">
				Enter your email address to receive password reset instructions.
			</p>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full max-w-md space-y-4 bg-white p-6 rounded-md shadow-md"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="example@gmail.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

			      <CustomButton
                  content="submit"
                  isLoading={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                />
            
				</form>
			</Form>
		</div>
	);
};


export default ForgotPassword;
