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
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Lightbulb, Plus, Trash2 } from "lucide-react";
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
		<div className="space-y-12">
			{/* Companies */}
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
							<Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
						</div>
						<h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
							Companies & Frequency
						</h3>
					</div>
					<Button
						type="button"
						onClick={() => {
							appendCompany({ name: "", frequency: 1 });
							onFormDataChange({ companies: form.getValues("companies") });
						}}
						size="sm"
						className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
						<Plus size={16} className="mr-2" />
						Add Company
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<AnimatePresence mode="popLayout">
						{companyFields.map((field, index) => (
							<motion.div
								key={field.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.2 }}>
								<Card className="p-4 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-950">
									<div className="flex gap-4 items-start">
										<FormField
											control={form.control}
											name={`companies.${index}.name`}
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
														Company Name
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Google"
															{...field}
															onChange={(e) => {
																field.onChange(e);
																onFormDataChange({
																	companies: form.getValues("companies"),
																});
															}}
															className="h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-2 ring-indigo-500/20 transition-all rounded-lg"
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
													<FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
															className="h-10 text-center bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:ring-2 ring-indigo-500/20 transition-all rounded-lg"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => {
												removeCompany(index);
												onFormDataChange({
													companies: form.getValues("companies"),
												});
											}}
											className="mt-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 h-10 w-10 p-0 rounded-lg">
											<Trash2 size={16} />
										</Button>
									</div>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>
					
					{companyFields.length === 0 && (
						<div className="col-span-full py-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500">
							No companies added yet.
						</div>
					)}
				</div>
			</div>

			{/* Hints */}
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
							<Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
						</div>
						<h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
							Hints & Tips
						</h3>
					</div>
					<Button
						type="button"
						onClick={() => {
							appendHint({ order: hintFields.length + 1, content: "" });
							onFormDataChange({ hints: form.getValues("hints") });
						}}
						size="sm"
						className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
						<Plus size={16} className="mr-2" />
						Add Hint
					</Button>
				</div>

				<div className="space-y-4">
					<AnimatePresence mode="popLayout">
						{hintFields.map((field, index) => (
							<motion.div
								key={field.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.2 }}>
								<Card className="p-0 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
									<div className="flex">
										<div className="w-12 bg-yellow-50 dark:bg-yellow-900/10 flex items-center justify-center border-r border-gray-100 dark:border-gray-800">
											<span className="font-bold text-yellow-600 dark:text-yellow-500">
												#{index + 1}
											</span>
										</div>
										<div className="flex-1 p-4">
											<FormField
												control={form.control}
												name={`hints.${index}.content`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Textarea
																placeholder={`Enter hint #${index + 1}...`}
																{...field}
																className="min-h-[80px] border-0 bg-transparent resize-none focus-visible:ring-0 p-0 text-sm"
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
										</div>
										<div className="p-2 border-l border-gray-100 dark:border-gray-800 flex items-start">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => {
													removeHint(index);
													onFormDataChange({ hints: form.getValues("hints") });
												}}
												className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
												<Trash2 size={16} />
											</Button>
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>

					{hintFields.length === 0 && (
						<div className="py-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500">
							No hints added yet.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
