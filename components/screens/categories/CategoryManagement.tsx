"use client";

import { AdminOnly } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	categoryService,
	CategoryType,
} from "@/services/categories/category-services";
import { AxiosError } from "axios";
import {
	Edit,
	Eye,
	Folder,
	Hash,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CategoryForm } from "./CategoryForm";

export const CategoryManagement: React.FC = () => {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = React.useState("");
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [editingCategory, setEditingCategory] =
		React.useState<CategoryType | null>(null);

	// Fetch categories
	const {
		data: categoriesData,
		isLoading,
		error,
	} = useQuery(["categories"], () => categoryService.getAllCategories(), {
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	// Delete mutation
	const { mutate: deleteMutate } = useMutation(
		(categoryId: string) => categoryService.deleteCategory(categoryId),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["categories"]);
			},
			onError: (error: AxiosError) => {
				console.error("Delete category error:", error);
			},
		}
	);

	const categories = categoriesData?.data?.results || [];

	// Filter categories based on search term
	const filteredCategories = categories.filter(
		(category) =>
			category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			category.tags?.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			)
	);

	const handleCreateNew = () => {
		setEditingCategory(null);
		setIsFormOpen(true);
	};

	const handleEdit = (category: CategoryType) => {
		setEditingCategory(category);
		setIsFormOpen(true);
	};

	const handleDelete = (category: CategoryType) => {
		if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
			deleteMutate(category._id);
		}
	};

	const handleFormSuccess = () => {
		setIsFormOpen(false);
		setEditingCategory(null);
	};

	const handleFormCancel = () => {
		setIsFormOpen(false);
		setEditingCategory(null);
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[...Array(5)].map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="h-5 w-32 bg-gray-200 rounded" />
									<div className="h-4 w-48 bg-gray-200 rounded" />
								</div>
								<div className="h-8 w-8 bg-gray-200 rounded" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-6 text-center">
					<p className="text-red-500">Failed to load categories</p>
					<Button
						variant="outline"
						onClick={() => queryClient.invalidateQueries(["categories"])}
						className="mt-2">
						Retry
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Category Management
					</h1>
					<p className="text-gray-600">
						Manage question categories and their hierarchy
					</p>
				</div>
				<AdminOnly
					fallback={
						<div className="text-sm text-gray-500 italic">
							Admin access required to create categories
						</div>
					}>
					<Button onClick={handleCreateNew} className="gap-2">
						<Plus className="h-4 w-4" />
						Create Category
					</Button>
				</AdminOnly>
			</div>

			{/* Search */}
			<Card>
				<CardContent className="p-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search categories..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Folder className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Total Categories</p>
								<p className="text-2xl font-bold">{categories.length}</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<Eye className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Active Categories</p>
								<p className="text-2xl font-bold">
									{categories.filter((cat) => cat.isActive).length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Hash className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Total Questions</p>
								<p className="text-2xl font-bold">
									{categories.reduce(
										(sum, cat) => sum + cat.stats.questionCount,
										0
									)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Categories List */}
			<div className="space-y-4">
				{filteredCategories.length === 0 ? (
					<Card>
						<CardContent className="p-8 text-center">
							<Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500 text-lg font-medium mb-2">
								{searchTerm ? "No categories found" : "No categories yet"}
							</p>
							<p className="text-gray-400 text-sm mb-4">
								{searchTerm
									? "Try adjusting your search terms"
									: "Create your first category to get started"}
							</p>
							{!searchTerm && (
								<AdminOnly>
									<Button onClick={handleCreateNew} className="gap-2">
										<Plus className="h-4 w-4" />
										Create First Category
									</Button>
								</AdminOnly>
							)}
						</CardContent>
					</Card>
				) : (
					filteredCategories.map((category) => (
						<Card
							key={category._id}
							className="hover:shadow-md transition-shadow">
							<CardContent className="p-6">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<div
												className="w-4 h-4 rounded-full"
												style={{ backgroundColor: category.color }}
											/>
											<h3 className="text-lg font-semibold text-gray-900">
												{category.name}
											</h3>
											<Badge
												variant={category.isActive ? "default" : "secondary"}
												className="text-xs">
												{category.isActive ? "Active" : "Inactive"}
											</Badge>
										</div>

										{category.description && (
											<p className="text-gray-600 mb-3">
												{category.description}
											</p>
										)}

										<div className="flex items-center gap-4 text-sm text-gray-500">
											<span>{category.stats.questionCount} questions</span>
											<span>Order: {category.order}</span>
											{category.parentCategory && (
												<span>Has parent category</span>
											)}
										</div>

										{category.tags && category.tags.length > 0 && (
											<div className="flex flex-wrap gap-1 mt-3">
												{category.tags.map((tag) => (
													<Badge
														key={tag}
														variant="outline"
														className="text-xs">
														{tag}
													</Badge>
												))}
											</div>
										)}
									</div>

									<AdminOnly>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => handleEdit(category)}>
													<Edit className="h-4 w-4 mr-2" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleDelete(category)}
													className="text-red-600 focus:text-red-600">
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</AdminOnly>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Form Dialog */}
			<AdminOnly>
				<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>
								{editingCategory ? "Edit Category" : "Create New Category"}
							</DialogTitle>
						</DialogHeader>
						<CategoryForm
							category={editingCategory}
							onSuccess={handleFormSuccess}
							onCancel={handleFormCancel}
						/>
					</DialogContent>
				</Dialog>
			</AdminOnly>
		</div>
	);
};
