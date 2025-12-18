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
			<div className="space-y-2 group">
				<FormField
					control={form.control}
					name="richAnswer"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
									Detailed Answer <span className="text-red-500">*</span>
								</FormLabel>
								<span className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
									Markdown Supported
								</span>
							</div>
							<FormControl>
								<div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-950 focus-within:ring-2 ring-green-500/20 transition-all">
									<RichTextEditor
										content={field.value || ""}
										onChange={(value: string) => {
											field.onChange(value);
											onFormDataChange({ richAnswer: value });
										}}
										placeholder="Provide a comprehensive answer with step-by-step explanation, key concepts, and examples..."
										minHeight="400px"
									/>
								</div>
							</FormControl>
							<FormDescription className="text-xs text-gray-500 dark:text-gray-400 ml-1">
								Explain the logic thoroughly. You can include time/space complexity analysis here.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
