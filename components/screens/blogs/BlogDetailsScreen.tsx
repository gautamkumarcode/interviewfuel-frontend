"use client";

import { ApiStateLoader } from "@/components/custom/loader/PageLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HtmlContent } from "@/components/ui/html-content";
import blogService, { type BlogPost } from "@/services/blog-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithoutPagination,
} from "@/types/axios-response";
import { AxiosError } from "axios";
import { Bookmark, Clock, Heart, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";

// Response type for getBlogBySlug
interface BlogDetailResponse {
	blog: BlogPost;
	isLiked: boolean;
	isBookmarked: boolean;
}

export default function BlogDetailsScreen() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const slug = params.slug as string;

	// Fetch blog data using React Query
	const {
		data: blogData,
		isLoading,
		isFetching,
	} = useQuery<
		AxiosResponseTypeWithoutPagination<BlogDetailResponse>,
		AxiosError<AxiosErrorResponseType>
	>(["blog", slug], () => blogService.getBlogBySlug(slug), {
		enabled: !!slug,
		staleTime: 1000 * 60 * 5, // 5 minutes
		cacheTime: 1000 * 60 * 10, // 10 minutes
		select: (response) => ({
			...response,
			data: {
				...response.data,
				blog: {
					...response.data.blog,
					isLiked: response.data.isLiked ?? false,
					isBookmarked: response.data.isBookmarked ?? false,
				},
			},
		}),
	});

	const blog = blogData?.data?.blog;

	// Like mutation
	const { mutate: likeMutate } = useMutation<
		AxiosResponseTypeWithoutPagination<{ isLiked: boolean }>,
		AxiosError<AxiosErrorResponseType>
	>(() => blogService.likeBlog(blog?._id as string), {
		onSuccess: (response) => {
			// Optimistically update the cache
			queryClient.setQueryData<
				AxiosResponseTypeWithoutPagination<BlogDetailResponse> | undefined
			>(["blog", slug], (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					data: {
						...oldData.data,
						isLiked: response.data.isLiked,
						blog: {
							...oldData.data.blog,
							isLiked: response.data.isLiked,
							stats: {
								...oldData.data.blog.stats,
								likes: response.data.isLiked
									? oldData.data.blog.stats.likes + 1
									: oldData.data.blog.stats.likes - 1,
							},
						},
					},
				};
			});
		},
		onError: (error) => {
			console.error("Error liking blog:", error);
		},
	});

	// Bookmark mutation
	const { mutate: bookmarkMutate } = useMutation<
		AxiosResponseTypeWithoutPagination<{ isBookmarked: boolean }>,
		AxiosError<AxiosErrorResponseType>
	>(() => blogService.bookmarkBlog(blog?._id as string), {
		onSuccess: (response) => {
			// Optimistically update the cache
			queryClient.setQueryData<
				AxiosResponseTypeWithoutPagination<BlogDetailResponse> | undefined
			>(["blog", slug], (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					data: {
						...oldData.data,
						isBookmarked: response.data.isBookmarked,
						blog: {
							...oldData.data.blog,
							isBookmarked: response.data.isBookmarked,
							stats: {
								...oldData.data.blog.stats,
								bookmarks: response.data.isBookmarked
									? oldData.data.blog.stats.bookmarks + 1
									: oldData.data.blog.stats.bookmarks - 1,
							},
						},
					},
				};
			});
		},
		onError: (error) => {
			console.error("Error bookmarking blog:", error);
		},
	});

	const handleLike = () => {
		if (!blog) return;
		likeMutate();
	};

	const handleBookmark = () => {
		if (!blog) return;
		bookmarkMutate();
	};

	const handleShare = async () => {
		if (!blog) return;
		try {
			await navigator.share({
				title: blog.title,
				text: blog.excerpt,
				url: window.location.href,
			});
		} catch (error) {
			navigator.clipboard.writeText(window.location.href);
		}
	};

	const BlogDetailSkeleton = () => (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
			<div className="h-96 bg-gray-200 rounded-xl mb-8" />
			<div className="space-y-4">
				<div className="h-8 w-3/4 bg-gray-200 rounded" />
				<div className="h-4 w-1/2 bg-gray-200 rounded" />
				<div className="h-4 w-full bg-gray-200 rounded" />
				<div className="h-4 w-full bg-gray-200 rounded" />
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 -m-4 pt-0">
			<ApiStateLoader
				isLoading={isLoading}
				isFetching={isFetching}
				renderSkeleton={() => <BlogDetailSkeleton />}>
				{!blog ? (
					<div className="min-h-screen flex items-center justify-center">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-gray-900 mb-4">
								Blog Not Found
							</h1>
							<Button onClick={() => router.push("/blogs")}>
								Back to Articles
							</Button>
						</div>
					</div>
				) : (
					<>
						{/* Hero Section */}
						<div className="relative h-[400px] lg:h-[500px] w-full ">
							{blog.coverImage && (
								<>
									<Image
										src={blog.coverImage}
										alt={blog.title}
										fill
										className="object-cover opacity-80"
										priority
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
								</>
							)}
							<div className="absolute bottom-0 left-0 right-0 p-8">
								<div className=" mx-auto">
									<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
										{blog.title}
									</h1>
									<div className="flex items-center gap-3 mb-4">
										{blog.category && (
											<Badge className="bg-blue-600 hover:bg-blue-700 border-none text-white">
												{blog.category.name}
											</Badge>
										)}
										<span className="text-gray-300 flex items-center gap-1 text-sm bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
											<Clock className="w-4 h-4" />
											{blog.readTime} min read
										</span>
									</div>

									<div className="flex items-center gap-6 text-gray-200">
										<div className="flex items-center gap-3">
											<Avatar className="h-12 w-12 border-2 border-white/20">
												<AvatarImage src={blog.author.profilePicture} />
												<AvatarFallback className="bg-blue-600 text-white">
													{blog.author.name?.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-semibold text-white">
													{blog.author.username}
												</p>
												<p className="text-sm text-gray-400">
													{new Date(blog.publishedAt!).toLocaleDateString(
														"en-US",
														{
															month: "long",
															day: "numeric",
															year: "numeric",
														},
													)}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
							{/* Action Bar */}
							<div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 sticky top-20 bg-gray-50/95 backdrop-blur z-10 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
								<div className="flex items-center gap-4">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => router.back()}
										className="hover:bg-gray-200 text-gray-600">
										← Back
									</Button>
								</div>
								<div className="flex items-center gap-3">
									<Button
										variant={blog.isLiked ? "default" : "outline"}
										size="sm"
										onClick={handleLike}
										className={`gap-2 ${
											blog.isLiked
												? "bg-red-500 hover:bg-red-600 text-white"
												: ""
										}`}>
										<Heart
											className={`w-4 h-4 ${blog.isLiked ? "fill-current" : ""}`}
										/>
										{blog.stats.likes}
									</Button>
									<Button
										variant={blog.isBookmarked ? "default" : "outline"}
										size="sm"
										onClick={handleBookmark}
										className={
											blog.isBookmarked
												? "bg-blue-600 text-white hover:bg-blue-700"
												: ""
										}>
										<Bookmark
											className={`w-4 h-4 ${
												blog.isBookmarked ? "fill-current" : ""
											}`}
										/>
									</Button>
									<Button variant="outline" size="sm" onClick={handleShare}>
										<Share2 className="w-4 h-4" />
									</Button>
								</div>
							</div>

							{/* Content */}
							<article className="prose prose-lg dark:prose-invert max-w-none mb-12">
								<p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-8 border-l-4 border-blue-500 pl-4 py-1">
									{blog.excerpt}
								</p>
								<HtmlContent content={blog.content} />
							</article>

							{/* Tags */}
							{blog.tags && blog.tags.length > 0 && (
								<div className="flex items-center gap-2 flex-wrap mb-12 pt-8 border-t border-gray-200">
									<span className="text-sm font-medium text-gray-500 mr-2">
										Tags:
									</span>
									{blog.tags.map((tag) => (
										<Link key={tag} href={`/blogs?tag=${tag}`}>
											<Badge
												variant="secondary"
												className="hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer">
												#{tag}
											</Badge>
										</Link>
									))}
								</div>
							)}

							{/* Related Questions */}
							{blog.relatedQuestions && blog.relatedQuestions.length > 0 && (
								<div className="mb-12 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
									<h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
										Related Practice Questions
									</h2>
									<div className="grid md:grid-cols-2 gap-4">
										{blog.relatedQuestions.map((question: any) => (
											<Link
												key={question._id}
												href={`/questions/${question._id}`}
												className="group">
												<Card className="hover:shadow-md transition-all border-gray-200 hover:border-blue-200">
													<CardContent className="p-4">
														<h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
															{question.questionText}
														</h3>
														<div className="flex items-center gap-2">
															<Badge
																variant="outline"
																className={`${
																	question.difficulty === "Easy"
																		? "bg-green-50 text-green-700 border-green-200"
																		: question.difficulty === "Medium"
																			? "bg-yellow-50 text-yellow-700 border-yellow-200"
																			: "bg-red-50 text-red-700 border-red-200"
																}`}>
																{question.difficulty}
															</Badge>
															{question.category && (
																<span className="text-xs text-gray-500">
																	• {question.category.name}
																</span>
															)}
														</div>
													</CardContent>
												</Card>
											</Link>
										))}
									</div>
								</div>
							)}

							{/* Comments Section */}
							<div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
								<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
									<MessageSquare className="w-5 h-5" />
									Comments ({blog.stats.comments})
								</h2>
								<div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
									<MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
									<p className="text-gray-500">
										Join the discussion! Comments section coming soon.
									</p>
								</div>
							</div>
						</div>
					</>
				)}
			</ApiStateLoader>
		</div>
	);
}
