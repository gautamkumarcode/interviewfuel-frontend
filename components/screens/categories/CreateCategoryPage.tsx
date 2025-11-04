"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { CategoryForm } from "./CategoryForm";

export const CreateCategoryPage: React.FC = () => {
	const router = useRouter();

	const handleSuccess = () => {
		// Navigate back to categories list or show success message
		router.push("/categories");
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="gap-2 mb-4">
						<ArrowLeft className="h-4 w-4" />
						Back
					</Button>
					<h1 className="text-3xl font-bold text-gray-900">
						Create New Category
					</h1>
					<p className="text-gray-600 mt-2">
						Add a new category to organize your questions better
					</p>
				</div>

				{/* Form */}
				<CategoryForm onSuccess={handleSuccess} onCancel={handleCancel} />
			</div>
		</div>
	);
};
