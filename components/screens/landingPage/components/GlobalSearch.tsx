"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { searchService } from "@/services/search-services";
import {
	FileText,
	Folder,
	Hash,
	Loader2,
	Search,
	TrendingUp,
	X,
} from "lucide-react";
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

export function GlobalSearch() {
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
	const [popularSearches, setPopularSearches] = useState<any>(null);
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

	// Fetch popular searches on mount
	useEffect(() => {
		const fetchPopular = async () => {
			try {
				const response = await searchService.getPopularSearches();
				setPopularSearches(response.data);
			} catch (error) {
				console.error("Failed to fetch popular searches:", error);
			}
		};
		fetchPopular();
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
			const response = await searchService.getSuggestions(query);
			setSuggestions(response.data);
		} catch (error) {
			console.error("Search error:", error);
			// Show empty results on error
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
		<div className="relative w-full" ref={searchRef}>
			<form onSubmit={handleFullSearch} className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
				<Input
					type="text"
					placeholder="Search questions, categories, tags..."
					value={searchQuery}
					onChange={handleSearchChange}
					onFocus={() => setOpen(true)}
					className="w-full h-14 pl-12 pr-12 text-base bg-white border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-lg rounded-xl font-medium placeholder:text-gray-400 placeholder:font-normal"
				/>
				{searchQuery && (
					<button
						type="button"
						onClick={() => {
							setSearchQuery("");
							setSuggestions({ questions: [], categories: [], tags: [] });
						}}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
						<X className="h-5 w-5" />
					</button>
				)}
			</form>

			{/* Dropdown */}
			{open && (
				<div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-[500px] overflow-y-auto z-[100]">
					{loading && (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-6 w-6 animate-spin text-blue-500" />
						</div>
					)}

					{!loading && searchQuery.length < 2 && popularSearches && (
						<div className="p-3">
							{/* Popular Tags */}
							<div className="mb-4">
								<div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
									🔥 Popular Tags
								</div>
								{popularSearches.tags?.slice(0, 5).map((tag: any) => (
									<button
										key={tag.tag}
										onClick={() => handleSelect("tag", tag.tag)}
										className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all text-left group">
										<Hash className="h-4 w-4 text-purple-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
										<span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
											{tag.tag}
										</span>
										<span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
											{tag.count}
										</span>
									</button>
								))}
							</div>

							{/* Trending Questions */}
							<div>
								<div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
									📈 Trending Questions
								</div>
								{popularSearches.questions?.slice(0, 3).map((q: any) => (
									<button
										key={q.slug}
										onClick={() =>
											handleSelect("question", q.slug, q.category?.slug)
										}
										className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all text-left group">
										<TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
										<span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 line-clamp-2">
											{q.title}
										</span>
									</button>
								))}
							</div>
						</div>
					)}

					{!loading && searchQuery.length >= 2 && !hasResults && (
						<div className="py-12 px-6 text-center">
							<div className="mb-4">
								<Search className="h-12 w-12 text-gray-300 mx-auto" />
							</div>
							<p className="text-base font-semibold text-gray-700 mb-2">
								No results found
							</p>
							<p className="text-sm text-gray-500 mb-4">
								Try different keywords or browse categories
							</p>
							<Button
								size="sm"
								onClick={() => handleFullSearch()}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
								Search for &quot;{searchQuery}&quot;
							</Button>
						</div>
					)}

					{!loading && hasResults && (
						<div className="p-3">
							{/* Questions */}
							{suggestions.questions.length > 0 && (
								<div className="mb-4">
									<div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
										💡 Questions
									</div>
									{suggestions.questions.map((item) => (
										<button
											key={item.value}
											onClick={() =>
												handleSelect(item.type, item.value, item.categorySlug)
											}
											className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-lg transition-all text-left group">
											<FileText className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
											<span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 line-clamp-2 flex-1">
												{item.label}
											</span>
										</button>
									))}
								</div>
							)}

							{/* Categories */}
							{suggestions.categories.length > 0 && (
								<div className="mb-4">
									<div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
										📁 Categories
									</div>
									{suggestions.categories.map((item) => (
										<button
											key={item.value}
											onClick={() => handleSelect(item.type, item.value)}
											className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all text-left group">
											<Folder
												className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform"
												style={{ color: item.color || "#6B7280" }}
											/>
											<span className="text-sm font-medium text-gray-700 group-hover:text-green-700 flex-1">
												{item.label}
											</span>
										</button>
									))}
								</div>
							)}

							{/* Tags */}
							{suggestions.tags.length > 0 && (
								<div className="mb-2">
									<div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
										🏷️ Tags
									</div>
									{suggestions.tags.map((item) => (
										<button
											key={item.value}
											onClick={() => handleSelect(item.type, item.value)}
											className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all text-left group">
											<Hash className="h-4 w-4 text-purple-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
											<span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
												{item.label}
											</span>
											{item.count && (
												<span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
													{item.count}
												</span>
											)}
										</button>
									))}
								</div>
							)}

							{/* See all results */}
							<div className="border-t border-gray-200 pt-3 mt-3">
								<Button
									size="sm"
									onClick={() => handleFullSearch()}
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all">
									See all results for &quot;{searchQuery}&quot;
								</Button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
