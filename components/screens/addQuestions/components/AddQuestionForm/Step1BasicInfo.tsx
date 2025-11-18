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
import { Textarea } from "@/components/ui/textarea";
import { categoryService } from "@/services/categories/category-services";
import { ChevronDown, FileText } from "lucide-react";
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
							<FormLabel className="text-sm md:text-base font-semibold flex items-center gap-2 text-gray-800">
								<div className="w-1.5 h-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-sm animate-pulse"></div>
								Question Title
								<span className="text-red-500 text-xs">*</span>
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
										className="h-10 text-sm bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all duration-200 shadow-sm hover:shadow pr-14 rounded-lg"
									/>
									<div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
										{field.value?.length || 0}/100
									</div>
								</div>
							</FormControl>
							<FormDescription className="text-xs text-gray-500 flex items-start gap-1.5 leading-snug mt-1">
								<div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
								Create a clear, specific title that immediately conveys what the
								question is about
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
							<FormLabel className="text-sm md:text-base font-semibold flex items-center gap-2 text-gray-800">
								<div className="w-1.5 h-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-sm animate-pulse"></div>
								Question Content
								<span className="text-red-500 text-xs">*</span>
							</FormLabel>
							<FormControl>
								<div className="relative group/textarea">
									<Textarea
										placeholder="Describe the problem in detail. Include:
• Problem statement and requirements
• Input/output specifications  
• Constraints and edge cases
• Examples with explanations
• Any additional context needed"
										{...field}
										className="min-h-[180px] text-sm bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-50 transition-all duration-200 shadow-sm hover:shadow resize-none pb-8 rounded-lg leading-relaxed"
										onChange={(e) => {
											field.onChange(e);
											onFormDataChange({ content: e.target.value });
										}}
									/>
									<div className="absolute bottom-2 right-2 text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
										{field.value?.length || 0} characters
									</div>
								</div>
							</FormControl>
							<FormDescription className="text-xs text-gray-500 flex items-start gap-1.5 leading-snug mt-1">
								<div className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
								Provide comprehensive details including examples, constraints,
								and expected behavior
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
							<FormLabel className="text-sm md:text-base font-semibold flex items-center gap-2 text-gray-800">
								<div className="w-1.5 h-1.5 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full shadow-sm animate-pulse"></div>
								Category
								<span className="text-red-500 text-xs">*</span>
							</FormLabel>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											disabled={categoriesLoading}
											className="h-10 text-sm bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all duration-200 shadow-sm hover:shadow w-full justify-between rounded-lg disabled:opacity-60">
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
							<FormDescription className="text-xs text-gray-500 flex items-start gap-1.5 leading-snug mt-1">
								<div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
								Select the primary topic area that best describes this question
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Quick Tips */}
			<div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/60 rounded-lg p-2.5 shadow-sm hover:shadow transition-all duration-300 group/tips">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 opacity-0 group-hover/tips:opacity-100 transition-opacity duration-300"></div>
				<div className="relative flex items-start gap-2">
					<div className="p-1 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex-shrink-0 shadow-sm group-hover/tips:scale-110 transition-transform duration-300">
						<FileText className="h-3 w-3 text-blue-600" />
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="font-bold text-blue-900 mb-1.5 text-xs flex items-center gap-1">
							Writing Guidelines
							<span className="text-[9px] font-normal text-blue-600 bg-blue-100 px-1 py-0.5 rounded-full">
								Tips
							</span>
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800">
							<div className="space-y-1 bg-white/50 rounded p-1.5 backdrop-blur-sm">
								<p className="font-semibold text-blue-900 flex items-center gap-1 text-[11px]">
									<span className="w-1 h-1 bg-blue-500 rounded-full"></span>
									Title Best Practices
								</p>
								<ul className="space-y-0.5 text-[10px] leading-snug">
									<li className="flex items-start gap-1">
										<span className="text-blue-500 mt-0.5">✓</span>
										<span>Keep it under 100 characters</span>
									</li>
									<li className="flex items-start gap-1">
										<span className="text-blue-500 mt-0.5">✓</span>
										<span>Use descriptive keywords</span>
									</li>
									<li className="flex items-start gap-1">
										<span className="text-blue-500 mt-0.5">✓</span>
										<span>Avoid special characters</span>
									</li>
								</ul>
							</div>
							<div className="space-y-1 bg-white/50 rounded p-1.5 backdrop-blur-sm">
								<p className="font-semibold text-blue-900 flex items-center gap-1 text-[11px]">
									<span className="w-1 h-1 bg-purple-500 rounded-full"></span>
									Content Structure
								</p>
								<ul className="space-y-0.5 text-[10px] leading-snug">
									<li className="flex items-start gap-1">
										<span className="text-purple-500 mt-0.5">✓</span>
										<span>Start with problem statement</span>
									</li>
									<li className="flex items-start gap-1">
										<span className="text-purple-500 mt-0.5">✓</span>
										<span>Include input/output examples</span>
									</li>
									<li className="flex items-start gap-1">
										<span className="text-purple-500 mt-0.5">✓</span>
										<span>Mention constraints clearly</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
