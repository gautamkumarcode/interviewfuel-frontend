"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { categoryService } from "@/services/categories/category-services";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";
import { questionSchema } from "../validation/StepsFormSchema";

type QuestionFormData = z.infer<typeof questionSchema>;

interface Step1BasicInfoProps {
	onFormDataChange: (data: Partial<QuestionFormData>) => void;
}

export function Step1BasicInfo({ onFormDataChange }: Step1BasicInfoProps) {
	const form = useFormContext<QuestionFormData>();

	// Fetch categories
	const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
		["allcategories"],
		() => categoryService.getAllCategories()
	);

	const categories = categoriesData?.data?.results || [];
	const allCategories = categories.flatMap((cat) => [
		{ _id: cat._id, name: cat.name },
		...(cat.subcategories || []).map((sub) => ({
			_id: sub._id,
			name: sub.name,
		})),
	]);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Question Title */}
				<div className="space-y-2 group">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
									Question Title <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<div className="relative group/input">
										<Input
											placeholder="e.g., Two Sum Problem, Binary Tree Traversal"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												onFormDataChange({ title: e.target.value });
											}}
											className="h-11 text-sm bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 ring-blue-500/20 transition-all rounded-xl shadow-sm"
										/>
										<div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
											{field.value?.length || 0}/100
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Category Selection */}
				<div className="space-y-2 group">
					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
									Category <span className="text-red-500">*</span>
								</FormLabel>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												disabled={categoriesLoading}
												className="h-11 w-full justify-between bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl shadow-sm transition-all">
												<span className={`truncate ${!field.value && "text-gray-400"}`}>
													{field.value
														? allCategories.find((cat) => cat._id === field.value)
																?.name || "Unknown Category"
														: "Select a category"}
												</span>
												<ChevronDown className="h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</DropdownMenuTrigger>
									<DropdownMenuContent 
										className="w-[300px] max-h-[300px] overflow-y-auto p-1 rounded-xl shadow-xl border-gray-200 dark:border-gray-800"
										align="start">
										{categoriesLoading ? (
											<DropdownMenuItem disabled className="p-3 justify-center">
												<div className="flex items-center gap-2 text-gray-500">
													<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
													<span>Loading...</span>
												</div>
											</DropdownMenuItem>
										) : allCategories.length > 0 ? (
											allCategories.map((category) => (
												<DropdownMenuItem
													key={category._id}
													onClick={() => {
														field.onChange(category._id);
														onFormDataChange({ category: category._id });
													}}
													className="rounded-lg cursor-pointer py-2.5 px-3 mb-1 last:mb-0 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600 dark:focus:text-blue-400">
													<div className="flex items-center gap-3">
														<div className="w-2 h-2 bg-blue-500 rounded-full opacity-50" />
														<span className="font-medium">{category.name}</span>
													</div>
												</DropdownMenuItem>
											))
										) : (
											<DropdownMenuItem disabled className="p-4 text-center text-gray-500">
												No categories found
											</DropdownMenuItem>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>

			{/* Question Content */}
			<div className="space-y-2 group">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
								Problem Description <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-950 focus-within:ring-2 ring-blue-500/20 transition-all">
									<RichTextEditor
										content={field.value || ""}
										onChange={(value: string) => {
											field.onChange(value);
											onFormDataChange({ content: value });
										}}
										placeholder="Describe the problem in detail..."
										minHeight="300px"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
