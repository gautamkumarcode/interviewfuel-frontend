"use client";
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
import { categoryService } from "@/services/category/categories-services";
import { FileText } from "lucide-react";
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
		<div className="space-y-8">
			{/* Question Title */}
			<div className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold flex items-center gap-2">
								<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
								Question Title
								<span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										placeholder="e.g., Two Sum Problem, Binary Tree Traversal, React Hooks Usage"
										{...field}
										onChange={(e) => {
											field.onChange(e);
											onFormDataChange({ title: e.target.value });
										}}
										className="h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
									/>
									<div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
										{field.value?.length || 0}/100
									</div>
								</div>
							</FormControl>
							<FormDescription className="text-sm text-gray-600 flex items-start gap-2">
								<div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
								Create a clear, specific title that immediately conveys what the
								question is about
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Question Content */}
			<div className="space-y-4">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								Question Content
								<span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<div className="relative">
									<Textarea
										placeholder="Describe the problem in detail. Include:
• Problem statement and requirements
• Input/output specifications  
• Constraints and edge cases
• Examples with explanations
• Any additional context needed"
										{...field}
										className="min-h-[250px] text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-green-500 focus:bg-white transition-all duration-200 shadow-sm resize-none"
										onChange={(e) => {
											field.onChange(e);
											onFormDataChange({ content: e.target.value });
										}}
									/>
									<div className="absolute bottom-3 right-3 text-xs text-gray-400">
										{field.value?.length || 0} characters
									</div>
								</div>
							</FormControl>
							<FormDescription className="text-sm text-gray-600 flex items-start gap-2">
								<div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
								Provide comprehensive details including examples, constraints,
								and expected behavior
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Category Selection */}
			<div className="space-y-4">
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold flex items-center gap-2">
								<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
								Category
								<span className="text-red-500">*</span>
							</FormLabel>
							<Select
								onValueChange={(value) => {
									field.onChange(value);
									onFormDataChange({ category: value });
								}}
								value={field.value}
								disabled={categoriesLoading}>
								<FormControl>
									<SelectTrigger className="h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-purple-500 transition-all duration-200 shadow-sm">
										<SelectValue placeholder="Choose the most relevant category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent className="max-h-60">
									{categoriesLoading ? (
										<SelectItem value="loading" disabled>
											<div className="flex items-center gap-2">
												<div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
												Loading categories...
											</div>
										</SelectItem>
									) : allCategories.length > 0 ? (
										allCategories.map((category) => (
											<SelectItem key={category._id} value={category._id}>
												<div className="flex items-center gap-2">
													<div className="w-3 h-3 bg-purple-500 rounded-full"></div>
													{category.name}
												</div>
											</SelectItem>
										))
									) : (
										<SelectItem value="disabled" disabled>
											<div className="flex items-center gap-2 text-gray-500">
												<div className="w-3 h-3 bg-gray-300 rounded-full"></div>
												No categories available
											</div>
										</SelectItem>
									)}
								</SelectContent>
							</Select>
							<FormDescription className="text-sm text-gray-600 flex items-start gap-2">
								<div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
								Select the primary topic area that best describes this question
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Quick Tips */}
			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-6">
				<div className="flex items-start gap-3">
					<div className="p-2 bg-blue-100 rounded-lg">
						<FileText className="h-4 w-4 text-blue-600" />
					</div>
					<div>
						<h4 className="font-semibold text-blue-900 mb-2">
							Writing Guidelines
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
							<div className="space-y-1">
								<p className="font-medium">Title Best Practices:</p>
								<ul className="space-y-1 text-xs">
									<li>• Keep it under 100 characters</li>
									<li>• Use descriptive keywords</li>
									<li>• Avoid special characters</li>
								</ul>
							</div>
							<div className="space-y-1">
								<p className="font-medium">Content Structure:</p>
								<ul className="space-y-1 text-xs">
									<li>• Start with problem statement</li>
									<li>• Include input/output examples</li>
									<li>• Mention constraints clearly</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
