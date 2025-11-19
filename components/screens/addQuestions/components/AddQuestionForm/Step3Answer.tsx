"use client";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
							<RichTextEditor
								content={field.value || ""}
								onChange={(value: string) => {
									field.onChange(value);
									onFormDataChange({ richAnswer: value });
								}}
								placeholder="Provide a comprehensive answer with step-by-step explanation, key concepts, and examples..."
								minHeight="350px"
							/>
						</FormControl>
						<FormDescription>
							Use the rich text editor to format your answer with code blocks,
							lists, headings, and more.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
