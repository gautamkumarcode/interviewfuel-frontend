"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/context/theme.context";
import blogService from "@/services/blog-services";
import {
	categoryService,
	CategoryType,
} from "@/services/categories/category-services";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";

// Use a distinct type for form errors
type FormErrors = {
	title?: string;
	content?: string;
	category?: string;
	excerpt?: string;
};

export default function CreateBlogScreen() {
	const router = useRouter();
	const { toast } = useTheme();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isValidating, setIsValidating] = useState(false);

	// Fetch categories
	const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery(
		["allcategories"],
		() => categoryService.getAllCategories(),
		{
			staleTime: 1000 * 60 * 5, // 5 minutes
			cacheTime: 1000 * 60 * 30, // 30 minutes
		}
	);

	const categories = categoriesData?.data?.results || [];

	const [formData, setFormData] = useState({
		title: "",
		excerpt: "",
		content: "",
		coverImage: "",
		category: "",
		tags: "",
		status: "draft" as "draft" | "published",
		featured: false,
		metaTitle: "",
		metaDescription: "",
		keywords: "",
	});

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};
		let isValid = true;

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
			isValid = false;
		} else if (formData.title.length < 5) {
			newErrors.title = "Title must be at least 5 characters";
			isValid = false;
		}

		if (!formData.content.trim() || formData.content === "<p></p>") {
			newErrors.content = "Content is required";
			isValid = false;
		}

		if (!formData.category) {
			newErrors.category = "Please select a category";
			isValid = false;
		}

		if (!formData.excerpt.trim()) {
			newErrors.excerpt = "Excerpt is required for card previews";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsValidating(true);

		if (!validateForm()) {
			toast.error("Please fix the errors before submitting");
			return;
		}

		setLoading(true);

		try {
			const tagsArray = formData.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter(Boolean);

			const keywordsArray = formData.keywords
				.split(",")
				.map((keyword) => keyword.trim())
				.filter(Boolean);

			const response = await blogService.createBlog({
				title: formData.title,
				excerpt: formData.excerpt,
				content: formData.content,
				coverImage: formData.coverImage || undefined,
				category: formData.category || undefined, // This is now the _id
				tags: tagsArray.length > 0 ? tagsArray : undefined,
				status: formData.status,
				seo: {
					metaTitle: formData.metaTitle || undefined,
					metaDescription: formData.metaDescription || undefined,
					keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
				},
			});

			if (response.success) {
				toast.success(
					`Blog post ${
						formData.status === "published" ? "published" : "saved"
					} successfully!`
				);
				router.push(`/blogs/${response.data.slug}`);
			}
		} catch (error: any) {
			console.error("Error creating blog:", error);
			const errorMessage =
				error?.response?.data?.message ||
				"Failed to create blog post. Please try again.";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size too large. Max 5MB allowed.");
				return;
			}

			if (!file.type.startsWith("image/")) {
				toast.error("Invalid file type. Please upload an image.");
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData({ ...formData, coverImage: reader.result as string });
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setFormData({ ...formData, coverImage: "" });
	};

	return (
		<div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
			{/* Top Navigation Bar */}
			<header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur dark:bg-gray-950/95">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.back()}
							className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
							<ArrowLeft className="h-5 w-5" />
							<span className="sr-only">Back</span>
						</Button>
						<div>
							<h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
								New Blog Post
							</h1>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{formData.status === "published" ? "Public" : "Draft"} mode
							</p>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="hidden sm:flex items-center gap-2 rounded-full border bg-gray-50/50 p-1 dark:bg-gray-900/50">
							<Button
								size="sm"
								variant={formData.status === "draft" ? "secondary" : "ghost"}
								onClick={() => setFormData({ ...formData, status: "draft" })}
								className="rounded-full px-4 h-8 text-xs font-medium">
								Draft
							</Button>
							<Button
								size="sm"
								variant={formData.status === "published" ? "default" : "ghost"}
								onClick={() =>
									setFormData({ ...formData, status: "published" })
								}
								className={`rounded-full px-4 h-8 text-xs font-medium ${
									formData.status === "published"
										? "bg-green-600 hover:bg-green-700 text-white"
										: ""
								}`}>
								Publish
							</Button>
						</div>

						<Button
							onClick={handleSubmit}
							disabled={loading || isCategoriesLoading}
							className={`min-w-[100px] ${
								formData.status === "published"
									? "bg-green-600 hover:bg-green-700"
									: ""
							}`}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : formData.status === "published" ? (
								"Publish"
							) : (
								"Save Draft"
							)}
						</Button>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main Content Column */}
					<div className="space-y-8 lg:col-span-2">
						{/* Title & Editor */}
						<Card className="border-none shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
							<CardContent className="p-6 sm:p-8 space-y-8">
								<div className="space-y-2">
									<Input
										id="title"
										value={formData.title}
										onChange={(e) => {
											setFormData({ ...formData, title: e.target.value });
											if (isValidating) {
												setErrors({ ...errors, title: undefined });
											}
										}}
										placeholder="Enter your article title..."
										className={`border-0 border-b-2 border-gray-100 rounded-none px-0 py-4 text-3xl font-bold placeholder:text-gray-300 focus-visible:ring-0 focus-visible:border-blue-500 lg:text-2xl ${
											errors.title ? "border-red-500" : ""
										}`}
									/>
									{errors.title && (
										<p className="text-sm text-red-500 mt-1">{errors.title}</p>
									)}
								</div>

								<div className="space-y-2">
									<div
										className={`min-h-[500px] rounded-lg border ${
											errors.content
												? "border-red-300 ring-2 ring-red-100"
												: "border-gray-200"
										}`}>
										<RichTextEditor
											content={formData.content}
											onChange={(html) => {
												setFormData({ ...formData, content: html });
												if (isValidating) {
													setErrors({ ...errors, content: undefined });
												}
											}}
											placeholder="Tell your story..."
											minHeight="500px"
										/>
									</div>
									{errors.content && (
										<p className="text-sm text-red-500">{errors.content}</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* SEO Settings */}
						<Card className="border-none shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
							<CardHeader>
								<CardTitle className="text-lg font-medium text-gray-900">
									SEO & Meta Config
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-6 sm:grid-cols-2">
									<div className="space-y-2 sm:col-span-2">
										<Label htmlFor="metaTitle">Meta Title</Label>
										<div className="relative">
											<Input
												id="metaTitle"
												value={formData.metaTitle}
												onChange={(e) =>
													setFormData({
														...formData,
														metaTitle: e.target.value,
													})
												}
												placeholder="SEO Optimized Title"
												maxLength={60}
												className="pr-16"
											/>
											<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
												{formData.metaTitle.length}/60
											</span>
										</div>
									</div>

									<div className="space-y-2 sm:col-span-2">
										<Label htmlFor="metaDescription">Meta Description</Label>
										<div className="relative">
											<Textarea
												id="metaDescription"
												value={formData.metaDescription}
												onChange={(e) =>
													setFormData({
														...formData,
														metaDescription: e.target.value,
													})
												}
												placeholder="Brief summary for search engine results pages..."
												maxLength={160}
												rows={3}
												className="resize-none"
											/>
											<span className="absolute right-3 bottom-3 text-xs text-gray-400">
												{formData.metaDescription.length}/160
											</span>
										</div>
									</div>

									<div className="space-y-2 sm:col-span-2">
										<Label htmlFor="keywords">Keywords</Label>
										<Input
											id="keywords"
											value={formData.keywords}
											onChange={(e) =>
												setFormData({ ...formData, keywords: e.target.value })
											}
											placeholder="react, tutorial, development (comma separated)"
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6 lg:col-span-1">
						{/* Publishing Details */}
						<Card className="border-none shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
							<CardHeader>
								<CardTitle className="text-sm font-medium uppercase tracking-wide text-gray-500">
									Publishing Details
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="category">
										Category <span className="text-red-500">*</span>
									</Label>
									{isCategoriesLoading ? (
										<div className="h-10 w-full animate-pulse rounded-md bg-gray-100"></div>
									) : (
										<Select
											value={formData.category}
											onValueChange={(value) => {
												setFormData({ ...formData, category: value });
												if (isValidating) {
													setErrors({ ...errors, category: undefined });
												}
											}}>
											<SelectTrigger
												className={errors.category ? "border-red-500" : ""}>
												<SelectValue placeholder="Select Category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((category: CategoryType) => (
													<SelectItem key={category._id} value={category._id}>
														{category.name}
													</SelectItem>
												))}
												{categories.length === 0 && (
													<div className="p-2 text-sm text-gray-500">
														No categories found
													</div>
												)}
											</SelectContent>
										</Select>
									)}
									{errors.category && (
										<p className="text-xs text-red-500">{errors.category}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="excerpt">Short Description</Label>
									<Textarea
										id="excerpt"
										value={formData.excerpt}
										onChange={(e) => {
											setFormData({ ...formData, excerpt: e.target.value });
											if (isValidating) {
												setErrors({ ...errors, excerpt: undefined });
											}
										}}
										placeholder="A clearer summary..."
										rows={4}
										className={`resize-none ${
											errors.excerpt ? "border-red-500" : ""
										}`}
									/>
									{errors.excerpt && (
										<p className="text-xs text-red-500">{errors.excerpt}</p>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="tags">Tags</Label>
									<Input
										id="tags"
										value={formData.tags}
										onChange={(e) =>
											setFormData({ ...formData, tags: e.target.value })
										}
										placeholder="Add tags separated by commas"
									/>
								</div>

								<div className="flex items-center justify-between rounded-lg border p-3">
									<div className="space-y-0.5">
										<Label className="text-base font-medium">Featured</Label>
										<p className="text-xs text-gray-500">
											Pin this post to the top
										</p>
									</div>
									<Switch
										checked={formData.featured}
										onCheckedChange={(checked) =>
											setFormData({ ...formData, featured: checked })
										}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Media */}
						<Card className="border-none shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
							<CardHeader>
								<CardTitle className="text-sm font-medium uppercase tracking-wide text-gray-500">
									Media
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="group relative">
										{formData.coverImage ? (
											<div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100">
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={formData.coverImage}
													alt="Cover preview"
													className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
												/>
												<div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
													<Button
														type="button"
														variant="destructive"
														size="icon"
														onClick={removeImage}
														className="rounded-full">
														<X className="h-4 w-4" />
													</Button>
												</div>
											</div>
										) : (
											<label className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 p-8 text-center transition-colors hover:border-gray-900/25 hover:bg-gray-50 cursor-pointer dark:hover:border-gray-100/25 dark:hover:bg-gray-800">
												<div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
													<ImagePlus className="h-6 w-6 text-gray-500" />
												</div>
												<div className="space-y-1">
													<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
														Upload a cover image
													</p>
													<p className="text-xs text-gray-500">
														Drag and drop or click to upload
													</p>
												</div>
												<input
													type="file"
													className="hidden"
													accept="image/*"
													onChange={handleImageUpload}
												/>
											</label>
										)}
									</div>
									<p className="text-center text-xs text-gray-500">
										Recommended: 1200x630px (16:9 aspect ratio)
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
