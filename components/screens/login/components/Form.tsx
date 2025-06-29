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
import { Link } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";


const LoginForm = () => {
	const [lookUpPass, setLookUpPass] = useState<boolean>(false);
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	const onSubmit = async (data: any) => {
		console.log("Form submitted with data:", data);
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4 w-1/2 mx-auto sm:gap-6 font-manrope ">
				<FormField
					name="email"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-thin">
								Email <span className="text-red-600">*</span>
							</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="Enter Email"
									className={`flex ${
										form.formState.errors.email
											? "border-red-500"
											: "focus:border-green-500"
									} rounded-[6px] font-thin text-sm bg-transparent sm:h-14 h-12 `}
									{...field}
								/>
							</FormControl>

							<FormMessage className="text-xs text-red-600" />
						</FormItem>
					)}
				/>

				<FormField
					name="password"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-thin">
								Password <span className="text-red-600">*</span>
							</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										type={lookUpPass ? "text" : "password"}
										className={`flex rounded-[6px] font-thin text-sm bg-transparent sm:h-14 h-12 ${
											form.formState.errors.password
												? "border-red-500"
												: "focus:border-green-500"
										}`}
										placeholder="Enter Password"
										{...field}
									/>
									{/* <span className="absolute top-4 text-md right-6 w-3 h-3 sm:top-5">
											{lookUpPass ? (
												<OpenEye
													onClick={handleTogglePasswordCheck}
													className="text-[#FFFFFF] cursor-pointer"
												/>
											) : (
												<CloseEye
													onClick={handleTogglePasswordCheck}
													className="text-[#FFFFFF] cursor-pointer"
												/>
											)}
										</span> */}
								</div>
							</FormControl>
							<FormMessage className="text-xs text-red-600" />
						</FormItem>
					)}
				/>

				<div className="flex justify-end my-1">
					<Link href={"/forgot-password"} className="flex text-xs">
						Forgot Password?
					</Link>
				</div>
				{/* <div className="w-full mb-4">
						<RecaptchaWrapper onVerificationChange={setIsVerified} />
					</div> */}
				<CustomButton content="Login" isLoading={true} />
				{/* <HashLoader color="blue" /> */}
			</form>
		</Form>
	);
};

export default LoginForm;
