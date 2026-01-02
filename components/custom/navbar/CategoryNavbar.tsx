"use client";

import { cn } from "@/lib/utils";
import {
	categoryService,
	CategoryType,
} from "@/services/categories/category-services";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function CategoryNavbar() {
	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [loading, setLoading] = useState(true);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const activeCategorySlug = searchParams.get("category");

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await categoryService.getAllCategories();
				if (response.success && response.data?.results) {
					// Filter only active parent categories (no parentCategory)
					const activeCategories = response.data.results
						.filter((cat) => cat.isActive && !cat.parentCategory)
						.sort((a, b) => a.order - b.order);
					setCategories(activeCategories);
				}
			} catch (error) {
				console.error("Failed to fetch categories:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		checkScrollButtons();
	}, [categories]);

	const checkScrollButtons = () => {
		const container = scrollContainerRef.current;
		if (container) {
			setShowLeftArrow(container.scrollLeft > 0);
			setShowRightArrow(
				container.scrollLeft < container.scrollWidth - container.clientWidth
			);
		}
	};

	const scroll = (direction: "left" | "right") => {
		const container = scrollContainerRef.current;
		if (container) {
			const scrollAmount = 300;
			container.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
			setTimeout(checkScrollButtons, 300);
		}
	};

	if (loading) {
		return (
			<div className="w-full h-12 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-pulse" />
		);
	}

	if (categories.length === 0) {
		return null;
	}

	return (
		<div className="relative w-full border-b border-gray-200 dark:border-gray-800">
			{/* Left Scroll Button */}
			{showLeftArrow && (
				<button
					onClick={() => scroll("left")}
					className="absolute left-0 top-0 h-full z-10 px-2 bg-gradient-to-r from-white dark:from-primaryGreyBg to-transparent transition-colors"
					aria-label="Scroll left">
					<ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
				</button>
			)}

			{/* Categories Container */}
			<div
				ref={scrollContainerRef}
				onScroll={checkScrollButtons}
				className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-4 py-1.5">
				<Link
					href="/questions"
					className={cn(
						"flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap",
						pathname === "/questions" && !activeCategorySlug
							? "text-primary font-semibold"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
					)}>
					All
				</Link>
				{categories.map((category) => {
					const isActive =
						activeCategorySlug?.toLowerCase() === category.slug.toLowerCase();
					return (
						<Link
							key={category._id}
							href={`/questions?category=${category.slug}`}
							className={cn(
								"flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap",
								isActive
									? "text-primary font-semibold"
									: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
							)}>
							{category.name}
						</Link>
					);
				})}
			</div>

			{/* Right Scroll Button */}
			{showRightArrow && (
				<button
					onClick={() => scroll("right")}
					className="absolute right-0 top-0 h-full z-10 px-2 bg-gradient-to-l from-white dark:from-primaryGreyBg to-transparent transition-colors"
					aria-label="Scroll right">
					<ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
				</button>
			)}
		</div>
	);
}
