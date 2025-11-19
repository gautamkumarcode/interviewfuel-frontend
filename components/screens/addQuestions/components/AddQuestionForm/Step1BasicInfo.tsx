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
	FormDescription,
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
		<div className="space-y-3">
			{/* Question Title */}
			<div className="space-y-1.5 group">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium text-gray-700">
								Question Title <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<div className="relative group/input">
									<Input
										placeholder="e.g., Two Sum Problem, Binary Tree Traversal, React Hooks Usage"
										{...field}
										onChange={(e) => {
											field.onChange(e);
											onFormDataChange({ title: e.target.value });
										}}
										className="h-10 text-sm pr-14"
									/>
									<div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
										{field.value?.length || 0}/100
									</div>
								</div>
							</FormControl>
							<FormDescription className="text-xs text-gray-500">
								Write a clear, specific title for your question
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Question Content */}
			<div className="space-y-1.5 group">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium text-gray-700">
								Question Content <span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<RichTextEditor
									content={field.value || ""}
									onChange={(value: string) => {
										field.onChange(value);
										onFormDataChange({ content: value });
									}}
									placeholder="Describe the problem in detail. Include problem statement, input/output specs, constraints, and examples..."
									minHeight="200px"
								/>
							</FormControl>
							<FormDescription className="text-xs text-gray-500">
								Use the toolbar to format your question with code blocks, lists,
								and more
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Category Selection */}
			<div className="space-y-1.5 group">
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium text-gray-700">
								Category <span className="text-red-500">*</span>
							</FormLabel>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											disabled={categoriesLoading}
											className="h-10 text-sm w-full justify-between">
											<span className="truncate text-left">
												{field.value
													? allCategories.find((cat) => cat._id === field.value)
															?.name || "Unknown Category"
													: "Choose the most relevant category"}
											</span>
											<ChevronDown className="h-4 w-4 flex-shrink-0 ml-2 text-gray-500" />
										</Button>
									</FormControl>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto shadow-lg border-2">
									{categoriesLoading ? (
										<DropdownMenuItem disabled>
											<div className="flex items-center gap-2 py-1">
												<div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
												<span className="text-sm">Loading categories...</span>
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
												className="cursor-pointer hover:bg-purple-50 transition-colors">
												<div className="flex items-center gap-2.5 py-1">
													<div className="w-2.5 h-2.5 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex-shrink-0"></div>
													<span className="truncate text-sm">
														{category.name}
													</span>
												</div>
											</DropdownMenuItem>
										))
									) : (
										<DropdownMenuItem disabled>
											<div className="flex items-center gap-2 text-gray-500 py-1">
												<div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
												<span className="text-sm">No categories available</span>
											</div>
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
							<FormDescription className="text-xs text-gray-500">
								Select the most relevant category
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
