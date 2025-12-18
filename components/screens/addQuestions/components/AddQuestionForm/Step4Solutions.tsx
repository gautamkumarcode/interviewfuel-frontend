import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, Plus, Trash2 } from "lucide-react";
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
				<h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
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
					className="bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
					<Plus size={16} className="mr-2" />
					Add Solution
				</Button>
			</div>

			<div className="space-y-4">
				<AnimatePresence mode="popLayout">
					{solutionFields.map((field, index) => (
						<motion.div
							key={field.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2 }}>
							<Card className="p-6 space-y-6 border border-gray-200 dark:border-gray-800 shadow-lg bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
								<div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
											<Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
										</div>
										<h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
											Solution {index + 1}
										</h4>
									</div>
									{solutionFields.length > 1 && (
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
											onClick={() => {
												removeSolution(index);
												onFormDataChange({
													solutions: form.getValues("solutions"),
												});
											}}>
											<Trash2 size={16} className="mr-2" /> 
											Remove
										</Button>
									)}
								</div>

								<div className="grid grid-cols-1 gap-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name={`solutions.${index}.title`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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
															className="h-11 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 ring-blue-500/20 transition-all rounded-xl shadow-sm"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`solutions.${index}.language`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
														Language <span className="text-red-500">*</span>
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
															<SelectTrigger className="h-11 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 ring-blue-500/20 transition-all rounded-xl shadow-sm">
																<SelectValue placeholder="Select language" />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="max-h-[300px]">
															<SelectItem value="javascript">JavaScript</SelectItem>
															<SelectItem value="python">Python</SelectItem>
															<SelectItem value="java">Java</SelectItem>
															<SelectItem value="cpp">C++</SelectItem>
															<SelectItem value="csharp">C#</SelectItem>
															<SelectItem value="go">Go</SelectItem>
															<SelectItem value="rust">Rust</SelectItem>
														</SelectContent>
													</Select>
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
												<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
													Code Implementation <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm focus-within:ring-2 ring-blue-500/20 transition-all">
														<Textarea
															placeholder="Paste your solution code here..."
															{...field}
															className="font-mono text-sm min-h-[300px] border-0 bg-gray-50 dark:bg-gray-900 resize-none header-none focus-visible:ring-0 p-4"
															onChange={(e) => {
																field.onChange(e);
																onFormDataChange({
																	solutions: form.getValues("solutions"),
																});
															}}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name={`solutions.${index}.explanation`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
													Explanation <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-950 focus-within:ring-2 ring-blue-500/20 transition-all">
														<RichTextEditor
															content={field.value || ""}
															onChange={(value: string) => {
																field.onChange(value);
																onFormDataChange({
																	solutions: form.getValues("solutions"),
																});
															}}
															placeholder="Explain the approach..."
															minHeight="150px"
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name={`solutions.${index}.timeComplexity`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
														Time Complexity
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., O(n)"
															{...field}
															onChange={(e) => {
																field.onChange(e);
																onFormDataChange({
																	solutions: form.getValues("solutions"),
																});
															}}
															className="h-11 font-mono text-sm bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 ring-purple-500/20 transition-all rounded-xl shadow-sm"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`solutions.${index}.spaceComplexity`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
														Space Complexity
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., O(1)"
															{...field}
															onChange={(e) => {
																field.onChange(e);
																onFormDataChange({
																	solutions: form.getValues("solutions"),
																});
															}}
															className="h-11 font-mono text-sm bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 ring-purple-500/20 transition-all rounded-xl shadow-sm"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</AnimatePresence>
				
				{solutionFields.length === 0 && (
					<div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
						<Code2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No solutions added</h3>
						<p className="text-gray-500 dark:text-gray-400 mb-4">Add at least one solution to continue.</p>
						<Button
							onClick={() => {
								appendSolution({
									title: "",
									language: "javascript",
									code: "",
									explanation: "",
								});
								onFormDataChange({ solutions: form.getValues("solutions") });
							}}
							variant="outline"
							className="bg-white dark:bg-gray-800">
							<Plus size={16} className="mr-2" />
							Add First Solution
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
