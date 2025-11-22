"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { questionSchema } from "../validation/StepsFormSchema";

type QuestionFormData = z.infer<typeof questionSchema>;

interface Step5AdditionalProps {
	onFormDataChange: (data: Partial<QuestionFormData>) => void;
}

export function Step5Additional({ onFormDataChange }: Step5AdditionalProps) {
	const form = useFormContext<QuestionFormData>();

	const {
		fields: companyFields,
		append: appendCompany,
		remove: removeCompany,
	} = useFieldArray({
		control: form.control,
		name: "companies",
	});

	const {
		fields: hintFields,
		append: appendHint,
		remove: removeHint,
	} = useFieldArray({
		control: form.control,
		name: "hints",
	});

	return (
		<div className="space-y-8">
			{/* Companies */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-bold">Companies (Optional)</h3>
					<Button
						type="button"
						onClick={() => {
							appendCompany({ name: "", frequency: 1 });
							onFormDataChange({ companies: form.getValues("companies") });
						}}
						size="sm"
						variant="secondary"
						className="border border-gray-300 hover:bg-gray-100 transition-colors">
						<Plus size={16} className="mr-1" />
						Add Company
					</Button>
				</div>

				<div className="space-y-4">
					{companyFields.map((field, index) => (
						<Card
							key={field.id}
							className="p-4 border-2 border-gray-200 shadow-sm">
							<div className="flex gap-4 items-end">
								<FormField
									control={form.control}
									name={`companies.${index}.name`}
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel className="text-sm text-gray-700 font-medium">
												Company Name
											</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Google, Microsoft"
													{...field}
													onChange={(e) => {
														field.onChange(e);
														onFormDataChange({
															companies: form.getValues("companies"),
														});
													}}
													className="border-2 border-gray-300 focus:border-blue-500 transition-all duration-200"
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`companies.${index}.frequency`}
									render={({ field }) => (
										<FormItem className="w-24">
											<FormLabel className="text-sm text-gray-700 font-medium">
												Frequency
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													min="1"
													max="10"
													{...field}
													onChange={(e) => {
														const value = parseInt(e.target.value) || 1;
														field.onChange(value);
														onFormDataChange({
															companies: form.getValues("companies"),
														});
													}}
													className="border-2 border-gray-300 focus:border-blue-500 transition-all duration-200"
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={() => {
										removeCompany(index);
										onFormDataChange({
											companies: form.getValues("companies"),
										});
									}}
									className="hover:bg-red-600 transition-colors">
									<X size={16} />
								</Button>
							</div>
						</Card>
					))}
				</div>
			</div>

			{/* Hints */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-bold">Hints (Optional)</h3>
					<Button
						type="button"
						onClick={() => {
							appendHint({ order: hintFields.length + 1, content: "" });
							onFormDataChange({ hints: form.getValues("hints") });
						}}
						size="sm"
						variant="secondary"
						className="border border-gray-300 hover:bg-gray-100 transition-colors">
						<Plus size={16} className="mr-1" />
						Add Hint
					</Button>
				</div>

				<div className="space-y-4">
					{hintFields.map((field, index) => (
						<Card
							key={field.id}
							className="p-4 border-2 border-gray-200 shadow-sm">
							<div className="flex gap-4 items-start">
								<div className="w-16 pt-2 text-center">
									<span className="text-xl font-bold text-gray-600">
										#{index + 1}
									</span>
								</div>

								<FormField
									control={form.control}
									name={`hints.${index}.content`}
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel className="text-sm text-gray-700 font-medium">
												Hint Content
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Provide a helpful hint that guides users toward the solution..."
													{...field}
													className="min-h-[120px] border-2 border-gray-300 focus:border-blue-500 transition-all duration-200"
													onChange={(e) => {
														field.onChange(e);
														onFormDataChange({
															hints: form.getValues("hints"),
														});
													}}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={() => {
										removeHint(index);
										onFormDataChange({ hints: form.getValues("hints") });
									}}
									className="mt-9 hover:bg-red-600 transition-colors">
									<X size={16} />
								</Button>
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
