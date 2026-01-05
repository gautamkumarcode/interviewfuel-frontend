"use client";

import { ApiStateLoader } from "@/components/custom/loader/PageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import blogService, { type BlogPost } from "@/services/blog-services";
import { categoryService, CategoryType } from "@/services/categories/category-services";
import {
    Calendar,
    Clock,
    Eye,
    Heart,
    MessageSquare,
    PenSquare,
    Search,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function BlogsScreen() {
	const router = useRouter();
	const [blogs, setBlogs] = useState<BlogPost[]>([]);
	const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState("");
	const [filterTag, setFilterTag] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// Fetch categories
	const { data: categoriesData } = useQuery(
		["allcategories"],
		() => categoryService.getAllCategories(),
		{
			staleTime: 1000 * 60 * 5,
		}
	);
	const categories = categoriesData?.data?.results || [];

	useEffect(() => {
		fetchBlogs();
		fetchFeaturedBlogs();
	}, [currentPage, filterCategory, filterTag, searchQuery]);

	const fetchBlogs = async () => {
		try {
			setLoading(true);
			const response = await blogService.getAllBlogs({
				page: currentPage,
				limit: 12,
				status: "published",
				category: filterCategory || undefined,
				tag: filterTag || undefined,
				search: searchQuery || undefined,
				sort: "-publishedAt",
			});

			if (response.success && response.data) {
				setBlogs(response.data.blogs);
				setTotalPages(response.data.pagination.pages);
			}
		} catch (error) {
			console.error("Error fetching blogs:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchFeaturedBlogs = async () => {
		try {
			const response = await blogService.getFeaturedBlogs(3);
			if (response.success && response.data) {
				setFeaturedBlogs(response.data);
			}
		} catch (error) {
			console.error("Error fetching featured blogs:", error);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1);
		fetchBlogs();
	};

	const BlogSkeleton = () => (
		<Card className="overflow-hidden border-gray-200 bg-white h-full">
			<div className="h-48 bg-gray-200 animate-pulse" />
			<div className="p-6 space-y-3">
				<div className="flex gap-2 mb-2">
					<div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
					<div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
				</div>
				<div className="h-6 bg-gray-200 rounded animate-pulse" />
				<div className="h-4 bg-gray-200 rounded animate-pulse" />
				<div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
				<div className="flex justify-between mt-4">
					<div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
					<div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
				</div>
			</div>
		</Card>
	);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 -m-4 pt-0">
			{/* Header */}
			<div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
						<div>
							<h1 className="text-3xl md:text-4xl font-bold mb-2">Tech Blog</h1>
							<p className="text-blue-100 text-lg">
								Insights, tutorials, and stories from the tech world
							</p>
						</div>
						<Button
							onClick={() => router.push("/blogs/create")}
							className="bg-white text-blue-600 hover:bg-blue-50 self-start md:self-center shadow-lg hover:shadow-xl transition-all"
						>
							<PenSquare className="w-4 h-4 mr-2" />
							Write Article
						</Button>
					</div>

					{/* Search Bar */}
					<form onSubmit={handleSearch} className="relative max-w-2xl">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<Input
							type="text"
							placeholder="Search articles..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-12 pr-4 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm focus-visible:ring-offset-0 focus-visible:ring-white/30"
						/>
					</form>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Featured Blogs */}
				{featuredBlogs.length > 0 && !loading && (
					<div className="mb-12">
						<div className="flex items-center gap-2 mb-6">
							<div className="p-2 bg-orange-100 rounded-lg">
								<TrendingUp className="w-5 h-5 text-orange-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Featured Articles
							</h2>
						</div>
						<div className="grid md:grid-cols-3 gap-6">
							{featuredBlogs.map((blog) => (
								<Link
									key={blog._id}
									href={`/blogs/${blog.slug}`}
									className="group transform hover:-translate-y-1 transition-all duration-300"
								>
									<Card className="overflow-hidden border-gray-200 bg-white hover:shadow-xl transition-all duration-300 h-full">
										{blog.coverImage && (
											<div className="relative h-48 overflow-hidden">
												<Image
													src={blog.coverImage}
													alt={blog.title}
													fill
													className="object-cover group-hover:scale-110 transition-transform duration-500"
												/>
												<div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
													Featured
												</div>
											</div>
										)}
										<CardContent className="p-6">
											<div className="flex items-center gap-2 mb-3">
												{blog.category && (
													<Badge
														variant="secondary"
														className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100"
													>
														{blog.category.name}
													</Badge>
												)}
												<span className="text-xs text-gray-500 flex items-center gap-1">
													<Clock className="w-3 h-3" />
													{blog.readTime} min
												</span>
											</div>
											<h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
												{blog.title}
											</h3>
											<p className="text-gray-600 text-sm line-clamp-2 mb-4">
												{blog.excerpt}
											</p>
											<div className="flex items-center justify-between pt-4 border-t border-gray-100">
												<div className="flex items-center gap-4 text-sm text-gray-500">
													<span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
														<Heart className="w-4 h-4" />
														{blog.stats.likes}
													</span>
													<span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
														<Eye className="w-4 h-4" />
														{blog.views}
													</span>
												</div>
												<span className="text-xs text-gray-400">
													{new Date(blog.publishedAt!).toLocaleDateString()}
												</span>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>
				)}

				{/* Filters */}
				<div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
					<span className="text-sm font-medium text-gray-500 mr-2">
						Filter by:
					</span>
					<Select
						value={filterCategory || "all"}
						onValueChange={(value) =>
							setFilterCategory(value === "all" ? "" : value)
						}
					>
						<SelectTrigger className="w-[180px] border-gray-200">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{categories.map((category: CategoryType) => (
								<SelectItem key={category._id} value={category._id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={filterTag || "all"}
						onValueChange={(value) =>
							setFilterTag(value === "all" ? "" : value)
						}
					>
						<SelectTrigger className="w-[180px] border-gray-200">
							<SelectValue placeholder="Tag" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Tags</SelectItem>
							<SelectItem value="tutorial">Tutorial</SelectItem>
							<SelectItem value="guide">Guide</SelectItem>
							<SelectItem value="news">News</SelectItem>
							<SelectItem value="best-practices">Best Practices</SelectItem>
						</SelectContent>
					</Select>

					<div className="ml-auto text-sm text-gray-500">
						Showing {blogs.length} articles
					</div>
				</div>

				{/* Blog Grid */}
				<ApiStateLoader
					isLoading={loading}
					isFetching={false}
					renderSkeleton={() => (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 9 }).map((_, i) => (
								<BlogSkeleton key={i} />
							))}
						</div>
					)}
				>
					{blogs.length === 0 ? (
						<div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
							<div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Search className="w-10 h-10 text-gray-400" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">
								No articles found
							</h3>
							<p className="text-gray-500 max-w-sm mx-auto mb-6">
								We couldn't find any blog posts matching your current filters.
								Try adjusting your search criteria.
							</p>
							<Button
								variant="outline"
								onClick={() => {
									setFilterCategory("");
									setFilterTag("");
									setSearchQuery("");
								}}
							>
								Clear All Filters
							</Button>
						</div>
					) : (
						<>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{blogs.map((blog) => (
									<Link
										key={blog._id}
										href={`/blogs/${blog.slug}`}
										className="group"
									>
										<Card className="overflow-hidden border-gray-200 bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
											{blog.coverImage && (
												<div className="relative h-48 overflow-hidden">
													<Image
														src={blog.coverImage}
														alt={blog.title}
														fill
														className="object-cover group-hover:scale-105 transition-transform duration-500"
													/>
													{blog.category && (
														<Badge
															variant="secondary"
															className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white shadow-sm"
														>
															{blog.category.name}
														</Badge>
													)}
												</div>
											)}
											<CardContent className="p-6 flex-1 flex flex-col">
												<div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
													<span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
														<Calendar className="w-3 h-3" />
														{new Date(blog.publishedAt!).toLocaleDateString()}
													</span>
													<span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
														<Clock className="w-3 h-3" />
														{blog.readTime} min
													</span>
												</div>

												<h3 className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
													{blog.title}
												</h3>

												{blog.excerpt && (
													<p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
														{blog.excerpt}
													</p>
												)}

												<div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500">
													<div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
														<Heart className="w-4 h-4" />
														{blog.stats.likes}
													</div>
													<div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
														<MessageSquare className="w-4 h-4" />
														{blog.stats.comments}
													</div>
													<div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors ml-auto">
														<Eye className="w-4 h-4" />
														{blog.views}
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex justify-center gap-2 mt-12">
									<Button
										variant="outline"
										disabled={currentPage === 1}
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										className="border-gray-200"
									>
										Previous
									</Button>
									<div className="flex items-center gap-2">
										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											(page) => (
												<Button
													key={page}
													variant={currentPage === page ? "default" : "outline"}
													onClick={() => setCurrentPage(page)}
													className={`w-10 ${
														currentPage !== page ? "border-gray-200" : ""
													}`}
												>
													{page}
												</Button>
											)
										)}
									</div>
									<Button
										variant="outline"
										disabled={currentPage === totalPages}
										onClick={() =>
											setCurrentPage((p) => Math.min(totalPages, p + 1))
										}
										className="border-gray-200"
									>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</ApiStateLoader>
			</div>
		</div>
	);
}
