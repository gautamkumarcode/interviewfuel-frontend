"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchService } from "@/services/search-services";
import {
	FileText,
	Folder,
	Hash,
	Loader2,
	Search,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialQuery = searchParams.get("q") || "";
	const initialType = searchParams.get("type") || "all";

	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [activeTab, setActiveTab] = useState(initialType);
	const [results, setResults] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (initialQuery) {
			performSearch(
				initialQuery,
				initialType === "all" ? undefined : initialType
			);
		}
	}, [initialQuery, initialType]);

	const performSearch = async (query: string, type?: string) => {
		if (!query.trim()) return;

		setLoading(true);
		try {
			const response = await searchService.search(query, type as any, 1, 20);
			setResults(response.data);
		} catch (error) {
			console.error("Search error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
			performSearch(searchQuery);
		}
	};

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		const type = value === "all" ? undefined : value;
		performSearch(searchQuery, type);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Search Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
					<form onSubmit={handleSearch} className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<Input
							type="text"
							placeholder="Search questions, categories, tags..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-12 text-base"
						/>
					</form>
				</div>

				{loading && (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
					</div>
				)}

				{!loading && results && (
					<>
						{/* Results Summary */}
						<div className="mb-6">
							<p className="text-gray-600">
								Found {results.total} results for &quot;
								<span className="font-semibold">{searchQuery}</span>&quot;
							</p>
						</div>

						{/* Tabs */}
						<Tabs value={activeTab} onValueChange={handleTabChange}>
							<TabsList className="mb-6">
								<TabsTrigger value="all">All ({results.total})</TabsTrigger>
								<TabsTrigger value="questions">
									Questions ({results.questions?.length || 0})
								</TabsTrigger>
								<TabsTrigger value="categories">
									Categories ({results.categories?.length || 0})
								</TabsTrigger>
								<TabsTrigger value="tags">
									Tags ({results.tags?.length || 0})
								</TabsTrigger>
							</TabsList>

							<TabsContent value="all" className="space-y-8">
								{/* Questions */}
								{results.questions?.length > 0 && (
									<div>
										<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
											<FileText className="h-5 w-5 text-blue-500" />
											Questions
										</h2>
										<div className="space-y-3">
											{results.questions.map((question: any) => (
												<QuestionCard key={question._id} question={question} />
											))}
										</div>
									</div>
								)}

								{/* Categories */}
								{results.categories?.length > 0 && (
									<div>
										<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
											<Folder className="h-5 w-5 text-green-500" />
											Categories
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{results.categories.map((category: any) => (
												<CategoryCard key={category._id} category={category} />
											))}
										</div>
									</div>
								)}

								{/* Tags */}
								{results.tags?.length > 0 && (
									<div>
										<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
											<Hash className="h-5 w-5 text-purple-500" />
											Tags
										</h2>
										<div className="flex flex-wrap gap-2">
											{results.tags.map((tag: any) => (
												<TagBadge key={tag.tag} tag={tag} />
											))}
										</div>
									</div>
								)}

								{results.total === 0 && (
									<div className="text-center py-12">
										<p className="text-gray-500 mb-4">No results found</p>
										<Button onClick={() => router.push("/")}>
											Back to Home
										</Button>
									</div>
								)}
							</TabsContent>

							<TabsContent value="questions">
								{results.questions?.length > 0 ? (
									<div className="space-y-3">
										{results.questions.map((question: any) => (
											<QuestionCard key={question._id} question={question} />
										))}
									</div>
								) : (
									<p className="text-center py-12 text-gray-500">
										No questions found
									</p>
								)}
							</TabsContent>

							<TabsContent value="categories">
								{results.categories?.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{results.categories.map((category: any) => (
											<CategoryCard key={category._id} category={category} />
										))}
									</div>
								) : (
									<p className="text-center py-12 text-gray-500">
										No categories found
									</p>
								)}
							</TabsContent>

							<TabsContent value="tags">
								{results.tags?.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{results.tags.map((tag: any) => (
											<TagBadge key={tag.tag} tag={tag} />
										))}
									</div>
								) : (
									<p className="text-center py-12 text-gray-500">
										No tags found
									</p>
								)}
							</TabsContent>
						</Tabs>
					</>
				)}
			</div>
		</div>
	);
}

// Question Card Component
function QuestionCard({ question }: { question: any }) {
	const categorySlug = question.category?.slug || "general";
	return (
		<Link href={`/questions/${categorySlug}/${question.slug}`}>
			<div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">
							{question.title}
						</h3>
						<div className="flex flex-wrap items-center gap-2 text-sm">
							<span
								className="px-2 py-0.5 rounded text-xs font-medium"
								style={{
									backgroundColor: question.category?.color + "20",
									color: question.category?.color,
								}}>
								{question.category?.name}
							</span>
							<span
								className={`px-2 py-0.5 rounded text-xs font-medium ${
									question.difficulty === "Easy"
										? "bg-green-100 text-green-700"
										: question.difficulty === "Medium"
										? "bg-yellow-100 text-yellow-700"
										: "bg-red-100 text-red-700"
								}`}>
								{question.difficulty}
							</span>
							{question.tags?.slice(0, 3).map((tag: string) => (
								<span
									key={tag}
									className="text-gray-500 text-xs flex items-center gap-1">
									<Hash className="h-3 w-3" />
									{tag}
								</span>
							))}
						</div>
					</div>
					<div className="flex items-center gap-3 text-sm text-gray-500">
						<span className="flex items-center gap-1">
							<TrendingUp className="h-4 w-4" />
							{question.stats?.views || 0}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

// Category Card Component
function CategoryCard({ category }: { category: any }) {
	return (
		<Link href={`/questions?category=${category.slug}`}>
			<div
				className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
				style={{ borderLeftColor: category.color, borderLeftWidth: "4px" }}>
				<div className="flex items-center gap-3 mb-2">
					<Folder className="h-5 w-5" style={{ color: category.color }} />
					<h3 className="font-semibold text-gray-900">{category.name}</h3>
				</div>
				{category.description && (
					<p className="text-sm text-gray-600 mb-2">{category.description}</p>
				)}
				<p className="text-xs text-gray-500">
					{category.stats?.questionCount || 0} questions
				</p>
			</div>
		</Link>
	);
}

// Tag Badge Component
function TagBadge({ tag }: { tag: any }) {
	return (
		<Link href={`/questions?tag=${tag.tag}`}>
			<div className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-full px-3 py-1.5 cursor-pointer transition-colors">
				<span className="text-sm font-medium text-purple-700 flex items-center gap-1">
					<Hash className="h-3 w-3" />
					{tag.tag}
					<span className="text-xs text-purple-500">({tag.count})</span>
				</span>
			</div>
		</Link>
	);
}
