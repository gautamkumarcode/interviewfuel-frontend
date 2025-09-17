"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Plus, Settings, X } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { questionSchema } from "../validation/StepsFormSchema";

type QuestionFormData = z.infer<typeof questionSchema>;

interface Step2DetailsProps {
	onFormDataChange: (data: Partial<QuestionFormData>) => void;
}

export function Step2Details({ onFormDataChange }: Step2DetailsProps) {
	const form = useFormContext<QuestionFormData>();
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState<string[]>(form.getValues("tags") || []);

	const addTag = () => {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			const newTags = [...tags, tagInput.trim()];
			setTags(newTags);
			form.setValue("tags", newTags);
			setTagInput("");
			onFormDataChange({ tags: newTags });
		}
	};

	const removeTag = (tagToRemove: string) => {
		const newTags = tags.filter((tag) => tag !== tagToRemove);
		setTags(newTags);
		form.setValue("tags", newTags);
		onFormDataChange({ tags: newTags });
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag();
		}
	};

	const difficultyOptions = [
		{
			value: "Easy",
			label: "Easy",
			color: "bg-green-500",
			description: "Beginner-friendly, basic concepts",
		},
		{
			value: "Medium",
			label: "Medium",
			color: "bg-yellow-500",
			description: "Intermediate level, some complexity",
		},
		{
			value: "Hard",
			label: "Hard",
			color: "bg-red-500",
			description: "Advanced, requires deep understanding",
		},
	];

	const suggestedTags = [
		"javascript",
		"python",
		"java",
		"algorithms",
		"data-structures",
		"arrays",
		"strings",
		"trees",
		"graphs",
		"dynamic-programming",
		"sorting",
		"searching",
		"recursion",
		"hash-tables",
		"linked-lists",
	];

	return (
		<div className="space-y-8">
			{/* Difficulty and Time Limit */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Difficulty Selection */}
				<FormField
					control={form.control}
					name="difficulty"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold flex items-center gap-2">
								<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
								Difficulty Level
								<span className="text-red-500">*</span>
							</FormLabel>
							<Select
								onValueChange={(value) => {
									field.onChange(value);
									onFormDataChange({
										difficulty: value as "Easy" | "Medium" | "Hard",
									});
								}}
								value={field.value}>
								<FormControl>
									<SelectTrigger className="h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-purple-500 transition-all duration-200 shadow-sm">
										<SelectValue placeholder="Choose difficulty level" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{difficultyOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-3">
												<div
													className={`w-3 h-3 ${option.color} rounded-full`}></div>
												<div>
													<div className="font-medium">{option.label}</div>
													<div className="text-xs text-gray-500">
														{option.description}
													</div>
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription className="text-sm text-gray-600 flex items-start gap-2">
								<div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
								Select the appropriate challenge level for this question
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Time Limit */}
				<FormField
					control={form.control}
					name="timeLimit"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg font-semibold flex items-center gap-2">
								<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
								Time Limit (minutes)
								<span className="text-red-500">*</span>
							</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										type="number"
										placeholder="30"
										min="5"
										max="180"
										{...field}
										onChange={(e) => {
											const value = parseInt(e.target.value) || 0;
											field.onChange(value);
											onFormDataChange({ timeLimit: value });
										}}
										className="h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-orange-500 transition-all duration-200 shadow-sm"
									/>
									<div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
										min
									</div>
								</div>
							</FormControl>
							<FormDescription className="text-sm text-gray-600 flex items-start gap-2">
								<div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
								Recommended time for candidates to solve this question
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* URL Slug
			<FormField
				control={form.control}
				name="slug"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-lg font-semibold flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							URL Slug
							<span className="text-red-500">*</span>
						</FormLabel>
						<FormControl>
							<div className="relative">
								<Input
									placeholder="two-sum-problem"
									{...field}
									onChange={(e) => {
										const slug = e.target.value
											.toLowerCase()
											.replace(/[^a-z0-9]+/g, "-")
											.replace(/^-|-$/g, "");
										field.onChange(slug);
										onFormDataChange({ slug });
									}}
									className="h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 shadow-sm font-mono"
								/>
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
									/questions/
								</div>
								<div className="pl-20"></div>
							</div>
						</FormControl>
						<FormDescription className="text-sm text-gray-600 flex items-start gap-2">
							<div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
							URL-friendly identifier (auto-formatted: lowercase, hyphens only)
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/> */}

			{/* Tags Section */}
			<div className="space-y-4">
				<FormLabel className="text-lg font-semibold flex items-center gap-2">
					<div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
					Tags
					<span className="text-red-500">*</span>
				</FormLabel>

				{/* Current Tags */}
				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
						{tags.map((tag, index) => (
							<Badge
								key={index}
								variant="secondary"
								className="flex items-center gap-2 text-sm py-2 px-3 bg-white/80 border border-indigo-300 hover:bg-white transition-colors">
								{tag}
								<X
									size={14}
									className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
									onClick={() => removeTag(tag)}
								/>
							</Badge>
						))}
					</div>
				)}

				{/* Add Tag Input */}
				<div className="space-y-3">
					<div className="flex gap-3">
						<Input
							placeholder="Type a tag and press Enter..."
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyPress={handleKeyPress}
							className="flex-grow h-12 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-indigo-500 transition-all duration-200 shadow-sm"
						/>
						<Button
							type="button"
							onClick={addTag}
							disabled={!tagInput.trim()}
							className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
							<Plus size={16} className="mr-2" />
							Add Tag
						</Button>
					</div>

					{/* Suggested Tags */}
					<div className="space-y-2">
						<p className="text-sm font-medium text-gray-700">Suggested tags:</p>
						<div className="flex flex-wrap gap-2">
							{suggestedTags
								.filter((tag) => !tags.includes(tag))
								.slice(0, 8)
								.map((tag) => (
									<Button
										key={tag}
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											if (!tags.includes(tag)) {
												const newTags = [...tags, tag];
												setTags(newTags);
												form.setValue("tags", newTags);
												onFormDataChange({ tags: newTags });
											}
										}}
										className="text-xs h-8 bg-white/60 hover:bg-indigo-50 border-gray-300 hover:border-indigo-400 transition-all duration-200">
										<Plus size={12} className="mr-1" />
										{tag}
									</Button>
								))}
						</div>
					</div>
				</div>

				<FormDescription className="text-sm text-gray-600 flex items-start gap-2">
					<div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
					Add relevant tags to help categorize and search for this question. At
					least one tag is required.
				</FormDescription>

				{form.formState.errors.tags && (
					<p className="text-sm font-medium text-destructive mt-2 flex items-center gap-2">
						<X size={14} />
						{form.formState.errors.tags.message}
					</p>
				)}
			</div>

			{/* Quick Tips */}
			<div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
				<div className="flex items-start gap-3">
					<div className="p-2 bg-purple-100 rounded-lg">
						<Settings className="h-4 w-4 text-purple-600" />
					</div>
					<div>
						<h4 className="font-semibold text-purple-900 mb-2">
							Configuration Tips
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800">
							<div className="space-y-1">
								<p className="font-medium">Difficulty Guidelines:</p>
								<ul className="space-y-1 text-xs">
									<li>• Easy: 5-15 minutes</li>
									<li>• Medium: 15-45 minutes</li>
									<li>• Hard: 45+ minutes</li>
								</ul>
							</div>
							<div className="space-y-1">
								<p className="font-medium">Tag Best Practices:</p>
								<ul className="space-y-1 text-xs">
									<li>• Use 3-8 relevant tags</li>
									<li>• Include technology and concept tags</li>
									<li>• Keep tags lowercase and specific</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
