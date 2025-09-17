"use client";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { questionSchema } from "../validation/StepsFormSchema";

type QuestionFormData = z.infer<typeof questionSchema>;

interface Step3AnswerProps {
	onFormDataChange: (data: Partial<QuestionFormData>) => void;
}

export function Step3Answer({ onFormDataChange }: Step3AnswerProps) {
	const form = useFormContext<QuestionFormData>();

	return (
		<div className="space-y-6">
			<FormField
				control={form.control}
				name="richAnswer"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-xl font-bold">
							Detailed Answer <span className="text-red-500">*</span>
						</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Provide a comprehensive answer with step-by-step explanation, key concepts, and examples"
								{...field}
								className="min-h-[350px] border-2 border-gray-300 focus:border-blue-500 transition-all duration-200"
								onChange={(e) => {
									field.onChange(e);
									onFormDataChange({ richAnswer: e.target.value });
								}}
							/>
						</FormControl>
						<FormDescription>
							Craft a comprehensive explanation including the solution approach,
							key concepts, and detailed reasoning.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
