"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	categoryService,
	CategoryType,
	CreateCategoryPayload,
} from "@/services/categories/category-services";
import { AxiosError } from "axios";
import {
	ChevronDown,
	Folder,
	Hash,
	Palette,
	Plus,
	Save,
	Tag,
	X,
} from "lucide-react";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

interface CategoryFormProps {
	category?: CategoryType | null;
	onSuccess?: (category: CategoryType) => void;
	onCancel?: () => void;
}

const PREDEFINED_COLORS = [
	"#3B82F6", // Blue
	"#10B981", // Green
	"#F59E0B", // Yellow
	"#EF4444", // Red
	"#8B5CF6", // Purple
	"#F97316", // Orange
	"#06B6D4", // Cyan
	"#84CC16", // Lime
	"#EC4899", // Pink
	"#6B7280", // Gray
];

const PREDEFINED_ICONS = [
	"folder",
	"code",
	"database",
	"server",
	"globe",
	"smartphone",
	"monitor",
	"cpu",
	"cloud",
	"shield",
	"zap",
	"layers",
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
	category,
	onSuccess,
	onCancel,
}) => {
	const queryClient = useQueryClient();
	const isEditing = !!category;

	const [formData, setFormData] = React.useState<CreateCategoryPayload>({
		name: category?.name || "",
		description: category?.description || "",
		color: category?.color || "#3B82F6",
		icon: category?.icon || "folder",
		parentCategory: category?.parentCategory || null,
		tags: category?.tags || [],
		order: category?.order || 0,
	});

	const [newTag, setNewTag] = React.useState("");

	// Get all categories for parent selection
	const { data: categoriesData } = useQuery(
		["categories"],
		() => categoryService.getAllCategories(),
		{
			staleTime: 1000 * 60 * 5, // 5 minutes
		}
	);

	// Create/Update mutation
	const { mutate: saveMutate, isLoading: isSaving } = useMutation(
		(data: CreateCategoryPayload) => {
			if (isEditing && category) {
				return categoryService.updateCategory(category._id, data);
			} else {
				return categoryService.createCategory(data);
			}
		},
		{
			onSuccess: (response) => {
				queryClient.invalidateQueries(["categories"]);
				onSuccess?.(response.data.category);
			},
			onError: (error: AxiosError) => {
				console.error("Save category error:", error);
			},
		}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		saveMutate(formData);
	};

	const handleInputChange = (
		field: keyof CreateCategoryPayload,
		value: any
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const addTag = () => {
		if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
			handleInputChange("tags", [...(formData.tags || []), newTag.trim()]);
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		handleInputChange(
			"tags",
			formData.tags?.filter((tag) => tag !== tagToRemove) || []
		);
	};

	const availableParentCategories =
		categoriesData?.data?.results?.filter((cat) => cat._id !== category?._id) ||
		[];

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Folder className="h-5 w-5" />
					{isEditing ? "Edit Category" : "Create New Category"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<div>
							<Label htmlFor="name" className="text-sm font-medium">
								Category Name *
							</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								placeholder="Enter category name"
								required
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="description" className="text-sm font-medium">
								Description
							</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) =>
									handleInputChange("description", e.target.value)
								}
								placeholder="Enter category description"
								rows={3}
								className="mt-1"
							/>
						</div>
					</div>

					{/* Visual Settings */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label className="text-sm font-medium flex items-center gap-2">
								<Palette className="h-4 w-4" />
								Color
							</Label>
							<div className="mt-2 grid grid-cols-5 gap-2">
								{PREDEFINED_COLORS.map((color) => (
									<button
										key={color}
										type="button"
										onClick={() => handleInputChange("color", color)}
										className={`w-8 h-8 rounded-full border-2 transition-all ${
											formData.color === color
												? "border-gray-900 scale-110"
												: "border-gray-300 hover:scale-105"
										}`}
										style={{ backgroundColor: color }}
									/>
								))}
							</div>
							<Input
								value={formData.color}
								onChange={(e) => handleInputChange("color", e.target.value)}
								placeholder="#3B82F6"
								className="mt-2"
							/>
						</div>

						<div>
							<Label className="text-sm font-medium">Icon</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="mt-1 w-full justify-between">
										<span className="capitalize">
											{formData.icon || "Select an icon"}
										</span>
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-full">
									{PREDEFINED_ICONS.map((icon) => (
										<DropdownMenuItem
											key={icon}
											onClick={() => handleInputChange("icon", icon)}>
											<div className="flex items-center gap-2">
												<span className="capitalize">{icon}</span>
											</div>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Hierarchy */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label className="text-sm font-medium">Parent Category</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="mt-1 w-full justify-between">
										<span>
											{formData.parentCategory
												? availableParentCategories.find(
														(cat) => cat._id === formData.parentCategory
												  )?.name || "Unknown Category"
												: "Select parent category (optional)"}
										</span>
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
									<DropdownMenuItem
										onClick={() => handleInputChange("parentCategory", null)}>
										No Parent (Root Category)
									</DropdownMenuItem>
									{availableParentCategories.map((cat) => (
										<DropdownMenuItem
											key={cat._id}
											onClick={() =>
												handleInputChange("parentCategory", cat._id)
											}>
											{cat.name}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div>
							<Label htmlFor="order" className="text-sm font-medium">
								Display Order
							</Label>
							<Input
								id="order"
								type="number"
								value={formData.order}
								onChange={(e) =>
									handleInputChange("order", parseInt(e.target.value) || 0)
								}
								placeholder="0"
								className="mt-1"
							/>
						</div>
					</div>

					{/* Tags */}
					<div>
						<Label className="text-sm font-medium flex items-center gap-2">
							<Tag className="h-4 w-4" />
							Tags
						</Label>
						<div className="mt-2 space-y-2">
							<div className="flex gap-2">
								<Input
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									placeholder="Add a tag"
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addTag();
										}
									}}
								/>
								<Button
									type="button"
									onClick={addTag}
									size="sm"
									variant="outline">
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							{formData.tags && formData.tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{formData.tags.map((tag) => (
										<div
											key={tag}
											className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
											<Hash className="h-3 w-3" />
											{tag}
											<button
												type="button"
												onClick={() => removeTag(tag)}
												className="ml-1 text-gray-500 hover:text-red-500">
												<X className="h-3 w-3" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-4 border-t">
						{onCancel && (
							<Button type="button" variant="outline" onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button type="submit" disabled={isSaving} className="gap-2">
							<Save className="h-4 w-4" />
							{isSaving
								? "Saving..."
								: isEditing
								? "Update Category"
								: "Create Category"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
