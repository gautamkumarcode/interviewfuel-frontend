"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { searchService } from "@/services/search-services";
import { FileText, Folder, Hash, Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Suggestion {
	type: "question" | "category" | "tag";
	label: string;
	value: string;
	icon?: string;
	color?: string;
	count?: number;
	categorySlug?: string;
}

export function NavbarSearch() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [suggestions, setSuggestions] = useState<{
		questions: Suggestion[];
		categories: Suggestion[];
		tags: Suggestion[];
	}>({
		questions: [],
		categories: [],
		tags: [],
	});
	const [loading, setLoading] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Search function
	const performSearch = async (query: string) => {
		if (query.length < 2) {
			setSuggestions({ questions: [], categories: [], tags: [] });
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const response = await searchService.getSuggestions(query, 3);
			setSuggestions(response.data);
		} catch (error) {
			console.error("Search error:", error);
			setSuggestions({ questions: [], categories: [], tags: [] });
		} finally {
			setLoading(false);
		}
	};

	// Debounced search function
	const debouncedSearch = useDebounce(performSearch, 300);

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setOpen(true);

		if (value.length >= 2) {
			setLoading(true);
			debouncedSearch(value);
		} else {
			setSuggestions({ questions: [], categories: [], tags: [] });
		}
	};

	// Handle selection
	const handleSelect = (type: string, value: string, categorySlug?: string) => {
		setOpen(false);
		setSearchQuery("");

		if (type === "question" && categorySlug) {
			router.push(`/questions/${categorySlug}/${value}`);
		} else if (type === "category") {
			router.push(`/questions?category=${value}`);
		} else if (type === "tag") {
			router.push(`/questions?tag=${value}`);
		}
	};

	// Handle full search
	const handleFullSearch = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (searchQuery.trim()) {
			setOpen(false);
			router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
		}
	};

	const hasResults =
		suggestions.questions.length > 0 ||
		suggestions.categories.length > 0 ||
		suggestions.tags.length > 0;

	return (
		<div className="relative w-full max-w-md" ref={searchRef}>
			<form onSubmit={handleFullSearch} className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
				<Input
					type="text"
					placeholder="Search..."
					value={searchQuery}
					onChange={handleSearchChange}
					onFocus={() => setOpen(true)}
					className="w-full h-10 pl-9 pr-9 text-sm bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-green-700 hover:border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-100 transition-all rounded-lg"
				/>
				{searchQuery && (
					<button
						type="button"
						onClick={() => {
							setSearchQuery("");
							setSuggestions({ questions: [], categories: [], tags: [] });
						}}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
						<X className="h-4 w-4" />
					</button>
				)}
			</form>

			{/* Dropdown */}
			{open && (searchQuery.length >= 2 || loading) && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-[100]">
					{loading && (
						<div className="flex items-center justify-center py-6">
							<Loader2 className="h-5 w-5 animate-spin text-blue-500" />
						</div>
					)}

					{!loading && !hasResults && searchQuery.length >= 2 && (
						<div className="py-6 px-4 text-center">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								No results found
							</p>
						</div>
					)}

					{!loading && hasResults && (
						<div className="p-2">
							{/* Questions */}
							{suggestions.questions.length > 0 && (
								<div className="mb-2">
									<div className="px-2 py-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
										Questions
									</div>
									{suggestions.questions.map((item) => (
										<button
											key={item.value}
											onClick={() =>
												handleSelect(item.type, item.value, item.categorySlug)
											}
											className="w-full flex items-start gap-2 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors text-left">
											<FileText className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
											<span className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 flex-1">
												{item.label}
											</span>
										</button>
									))}
								</div>
							)}

							{/* Categories */}
							{suggestions.categories.length > 0 && (
								<div className="mb-2">
									<div className="px-2 py-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
										Categories
									</div>
									{suggestions.categories.map((item) => (
										<button
											key={item.value}
											onClick={() => handleSelect(item.type, item.value)}
											className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors text-left">
											<Folder
												className="h-3.5 w-3.5 flex-shrink-0"
												style={{ color: item.color || "#6B7280" }}
											/>
											<span className="text-xs text-gray-700 dark:text-gray-300 flex-1">
												{item.label}
											</span>
										</button>
									))}
								</div>
							)}

							{/* Tags */}
							{suggestions.tags.length > 0 && (
								<div className="mb-1">
									<div className="px-2 py-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
										Tags
									</div>
									{suggestions.tags.map((item) => (
										<button
											key={item.value}
											onClick={() => handleSelect(item.type, item.value)}
											className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors text-left">
											<Hash className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
											<span className="text-xs text-gray-700 dark:text-gray-300">
												{item.label}
											</span>
											{item.count && (
												<span className="ml-auto text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
													{item.count}
												</span>
											)}
										</button>
									))}
								</div>
							)}

							{/* See all results */}
							{hasResults && (
								<div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
									<button
										onClick={() => handleFullSearch()}
										className="w-full text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-1.5 transition-colors">
										See all results →
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
