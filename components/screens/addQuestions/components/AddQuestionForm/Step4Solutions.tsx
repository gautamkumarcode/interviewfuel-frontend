"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { questionSchema } from "../validation/StepsFormSchema";

type QuestionFormData = z.infer<typeof questionSchema>;

interface Step4SolutionsProps {
	onFormDataChange: (data: Partial<QuestionFormData>) => void;
}

export function Step4Solutions({ onFormDataChange }: Step4SolutionsProps) {
	const form = useFormContext<QuestionFormData>();

	const {
		fields: solutionFields,
		append: appendSolution,
		remove: removeSolution,
	} = useFieldArray({
		control: form.control,
		name: "solutions",
	});

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-bold">
					Code Solutions <span className="text-red-500">*</span>
				</h3>
				<Button
					type="button"
					onClick={() => {
						appendSolution({
							title: "",
							language: "javascript",
							code: "",
							explanation: "",
						});
						onFormDataChange({ solutions: form.getValues("solutions") });
					}}
					size="sm"
					variant="secondary"
					className="border border-gray-300 hover:bg-gray-100 transition-colors">
					<Plus size={16} className="mr-1" />
					Add Solution
				</Button>
			</div>

			{solutionFields.map((field, index) => (
				<Card
					key={field.id}
					className="p-6 space-y-4 border-2 border-gray-200 shadow-sm">
					<div className="flex justify-between items-center pb-4 border-b border-gray-200">
						<h4 className="font-semibold text-xl">Solution {index + 1}</h4>
						{solutionFields.length > 1 && (
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={() => {
									removeSolution(index);
									onFormDataChange({ solutions: form.getValues("solutions") });
								}}>
								<X size={16} /> Remove
							</Button>
						)}
					</div>

					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name={`solutions.${index}.title`}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg font-bold">
											Solution Title <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., Two Pointer Approach"
												{...field}
												onChange={(e) => {
													field.onChange(e);
													onFormDataChange({
														solutions: form.getValues("solutions"),
													});
												}}
												className="border-2 border-gray-300 focus:border-blue-500 transition-all duration-200"
											/>
										</FormControl>
										<FormDescription>
											A descriptive title for this specific solution.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name={`solutions.${index}.language`}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg font-bold">
											Programming Language{" "}
											<span className="text-red-500">*</span>
										</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												onFormDataChange({
													solutions: form.getValues("solutions"),
												});
											}}
											value={field.value}>
											<FormControl>
												<SelectTrigger className="w-full border-2 border-gray-300 focus:border-blue-500 transition-all duration-200">
													<SelectValue placeholder="Select language" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="javascript">JavaScript</SelectItem>
												<SelectItem value="python">Python</SelectItem>
												<SelectItem value="java">Java</SelectItem>
												<SelectItem value="cpp">C++</SelectItem>
												<SelectItem value="csharp">C#</SelectItem>
												<SelectItem value="go">Go</SelectItem>
												<SelectItem value="rust">Rust</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											The programming language used in this solution.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name={`solutions.${index}.code`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg font-bold">
										Code <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter your solution code here..."
											{...field}
											className="font-mono min-h-[300px] border-2 border-gray-300 focus:border-blue-500 transition-all duration-200"
											onChange={(e) => {
												field.onChange(e);
												onFormDataChange({
													solutions: form.getValues("solutions"),
												});
											}}
										/>
									</FormControl>
									<FormDescription>
										The actual code implementation for this solution.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`solutions.${index}.explanation`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg font-bold">
										Explanation <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Explain how this solution works, the algorithm used, and why it's effective..."
											{...field}
											className="min-h-[180px] border-2 border-gray-300 focus:border-blue-500 transition-all duration-200"
											onChange={(e) => {
												field.onChange(e);
												onFormDataChange({
													solutions: form.getValues("solutions"),
												});
											}}
										/>
									</FormControl>
									<FormDescription>
										A detailed explanation of the solution logic and approach.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</Card>
			))}
		</div>
	);
}
