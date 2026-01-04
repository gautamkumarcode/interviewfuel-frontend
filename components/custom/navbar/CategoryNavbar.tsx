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
import HashLoader from "../loader/Loader";

interface CategoryWithChildren extends CategoryType {
	subcategories?: CategoryType[];
}

export function CategoryNavbar() {
	const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
	const [loading, setLoading] = useState(true);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const lastScrollY = useRef(0);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const activeCategorySlug = searchParams.get("category");

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await categoryService.getAllCategories();
				if (response.success && response.data?.results) {
					const allCategories = response.data.results;

					// Build parent categories with their subcategories
					const parentCategories = allCategories
						.filter((cat) => cat.isActive && !cat.parentCategory)
						.sort((a, b) => a.order - b.order)
						.map((parent) => ({
							...parent,
							subcategories: allCategories
								.filter(
									(child) =>
										child.isActive && child.parentCategory === parent._id
								)
								.sort((a, b) => a.order - b.order),
						}));

					setCategories(parentCategories);
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

	useEffect(() => {
		// Find the main scrollable container
		const mainElement = document.querySelector("main");

		if (!mainElement) return;

		const handleScroll = () => {
			const currentScrollY = mainElement.scrollTop;

			// Only minimize/maximize after scrolling past 100px
			if (currentScrollY < 100) {
				setIsMinimized(false);
				lastScrollY.current = currentScrollY;
				return;
			}

			// Minimize on scroll down, maximize on scroll up
			if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
				setIsMinimized(true);
			} else if (currentScrollY < lastScrollY.current) {
				setIsMinimized(false);
			}

			lastScrollY.current = currentScrollY;
		};

		mainElement.addEventListener("scroll", handleScroll, { passive: true });
		return () => mainElement.removeEventListener("scroll", handleScroll);
	}, []);

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
			<div className="w-full h-12 border-b border-gray-200 dark:border-gray-800 flex items-center justify-center">
				<HashLoader size={24} color="#19c862" />
			</div>
		);
	}

	if (categories.length === 0) {
		return null;
	}

	return (
		<div
			className={cn(
				"fixed top-16 left-0 right-0 z-40 bg-white dark:bg-primaryGreyBg border-b border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden",
				isMinimized ? "h-8" : "h-12"
			)}
			style={{
				marginLeft: "var(--sidebar-width, 240px)",
				width: "calc(100vw - var(--sidebar-width, 240px))",
			}}>
			{/* Left Scroll Button */}
			{!isMinimized && showLeftArrow && (
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
				className={cn(
					"flex items-center gap-1 overflow-x-auto scrollbar-hide px-4 transition-all duration-300",
					isMinimized ? "py-1" : "py-1.5"
				)}>
				<Link
					href="/questions"
					className={cn(
						"flex-shrink-0 rounded-full font-medium transition-all whitespace-nowrap",
						isMinimized ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
						pathname === "/questions" && !activeCategorySlug
							? "text-primary font-semibold"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
					)}>
					All
				</Link>
				{categories.map((category) => {
					const isParentActive =
						activeCategorySlug?.toLowerCase() === category.slug.toLowerCase();

					return (
						<div key={category._id} className="flex items-center gap-1">
							{/* Parent Category */}
							<Link
								href={`/questions?category=${category.slug}`}
								className={cn(
									"flex-shrink-0 rounded-full font-medium transition-all whitespace-nowrap",
									isMinimized ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
									isParentActive
										? "text-primary font-semibold"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
								)}>
								{category.name}
							</Link>

							{/* Subcategories */}
							{!isMinimized &&
								category.subcategories &&
								category.subcategories.length > 0 && (
									<>
										<span className="text-gray-400 dark:text-gray-600 text-xs">
											•
										</span>
										{category.subcategories.map((subcat) => {
											const isSubActive =
												activeCategorySlug?.toLowerCase() ===
												subcat.slug.toLowerCase();
											return (
												<Link
													key={subcat._id}
													href={`/questions?category=${subcat.slug}`}
													className={cn(
														"flex-shrink-0 px-2 py-1 rounded-full text-xs font-normal transition-all whitespace-nowrap",
														isSubActive
															? "text-primary font-semibold"
															: "text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
													)}>
													{subcat.name}
												</Link>
											);
										})}
									</>
								)}
						</div>
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
