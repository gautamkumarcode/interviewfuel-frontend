"use client";

import { ApiStateLoader } from "@/components/custom/loader/PageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClusterData } from "@/context/clusterData-context";
import { CategoryType } from "@/services/categories/category-services";
import { questionService } from "@/services/questions/question-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import { GetAllQuestionsResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import { ChevronRight, Clock, Star, TrendingUp, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { useQuery } from "react-query";

export default function Questions() {
	const params = useSearchParams();
	const category = params?.get("category");
	const router = useRouter();
	const { categoryData, categoryLoading } = useClusterData();

	// Improved category matching logic
	const decodedCategory = category
		? decodeURIComponent(category).trim().toLowerCase()
		: null;

	// Use categoryData from context instead of cached data for more reliability
	const categoryList = categoryData ?? [];

	// Enhanced category matching with better error handling
	const matchedCategoryOrSubcategory = React.useMemo(() => {
		if (!decodedCategory || categoryList.length === 0) {
			return null;
		}

		// First, try to match a top-level category
		const topLevelMatch = categoryList.find(
			(cat) => cat.slug.toLowerCase() === decodedCategory
		);

		if (topLevelMatch) {
			return topLevelMatch;
		}

		// If no top-level match, try to match a subcategory
		for (const cat of categoryList) {
			if (cat.subcategories && cat.subcategories.length > 0) {
				const subMatch = cat.subcategories.find(
					(sub: CategoryType) => sub.slug.toLowerCase() === decodedCategory
				);
				if (subMatch) {
					return subMatch;
				}
			}
		}

		return null;
	}, [decodedCategory, categoryList]);

	const categoryName =
		matchedCategoryOrSubcategory?.name ??
		(category ? "Unknown Category" : "All Questions");

	// Enhanced query with better loading states
	const { data, isLoading, isFetching, error, isError } = useQuery<
		AxiosResponseTypeWithPagination<GetAllQuestionsResponseType[]>,
		AxiosError<AxiosErrorResponseType>
	>(
		["allquestions", category || "all"],
		() => questionService.getAllQuestions(category ?? undefined),
		{
			staleTime: 1000 * 60 * 5,
			cacheTime: 1000 * 60 * 10,
			keepPreviousData: true,
			enabled: !categoryLoading, // Always enabled when categories are loaded
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				if (
					error?.response?.status &&
					error.response.status >= 400 &&
					error.response.status < 500
				) {
					return false;
				}
				return failureCount < 2;
			},
			onError: (error) => {
				console.error("Failed to fetch questions:", error);
			},
		}
	);

	const filteredQuestions = data?.data?.results ?? [];

	// Separate loading states for better UX
	const isInitialLoading =
		categoryLoading ||
		isLoading ||
		(category && !matchedCategoryOrSubcategory && !isError);
	const isRefetching = isFetching && !isLoading && !categoryLoading;

	// Enhanced loading skeleton component
	const QuestionSkeleton = () => {
		// Generate random variations for more natural look
		const randomIndex = Math.floor(Math.random() * 3);
		const titleWidth = 75 + randomIndex * 10;
		const showSecondLine = randomIndex % 2 === 0;
		const tagCount = 3 + (randomIndex % 3);

		return (
			<Card className="border-gray-200 bg-white">
				<CardContent className="p-6">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							{/* Badges skeleton */}
							<div className="flex items-center gap-3 mb-3">
								<div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
								<div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
								<div className="h-6 w-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
							</div>

							{/* Title skeleton */}
							<div className="space-y-2 mb-4">
								<div
									className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"
									style={{ width: `${titleWidth}%` }}></div>
								{showSecondLine && (
									<div className="h-6 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
								)}
							</div>

							{/* Tags skeleton */}
							<div className="flex gap-2 mb-4">
								{Array.from({ length: tagCount }).map((_, i) => (
									<div
										key={i}
										className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"
										style={{ width: `${40 + (i % 3) * 20}px` }}></div>
								))}
							</div>

							{/* Stats skeleton */}
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
									<div className="h-4 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
									<div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
									<div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
								</div>
							</div>
						</div>

						{/* Arrow skeleton */}
						<div className="flex flex-col items-center gap-2">
							<div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
							<div className="h-3 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	const getDifficultyColor = (difficulty: string) => {
		const colors: Record<string, string> = {
			Easy: "bg-green-100 text-green-800 border-green-200",
			Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
			Hard: "bg-red-100 text-red-800 border-red-200",
		};
		return colors[difficulty] || "bg-gray-100 text-gray-800 border-gray-200";
	};

	const handleCardClick = (question: GetAllQuestionsResponseType) => {
		const questionCategory =
			question.category?.name?.toLowerCase() || "general";

		router.push(`/questions/${questionCategory}/${question.slug}`);
	};

	return (
		<>
			{/* Enhanced Header with Loading States */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
					{isInitialLoading ? (
						<div className="space-y-2">
							<div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
						</div>
					) : (
						<h1 className="text-2xl font-bold text-gray-900">
							{categoryName} Questions
						</h1>
					)}
				</div>

				{isInitialLoading ? (
					<div className="h-5 w-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
				) : (
					<p className="text-gray-600">
						Master {categoryName} concepts with targeted practice questions
					</p>
				)}

				{/* Category Info */}
				{matchedCategoryOrSubcategory && !isInitialLoading && (
					<div className="mt-3 flex items-center gap-2">
						<Badge variant="outline" className="text-xs">
							{filteredQuestions.length} questions available
						</Badge>
						{matchedCategoryOrSubcategory.stats && (
							<Badge variant="secondary" className="text-xs">
								{matchedCategoryOrSubcategory.stats.questionCount} total in
								category
							</Badge>
						)}
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="flex items-center gap-4 mb-6">
				{isInitialLoading ? (
					<>
						<div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md animate-pulse"></div>
						<div className="h-10 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md animate-pulse"></div>
					</>
				) : (
					<>
						<Button
							onClick={() => router.push("/practice")}
							className="gap-2 bg-green-600 hover:bg-green-700">
							<Clock className="h-4 w-4" />
							Practice {categoryName}
						</Button>
						<Button
							variant="outline"
							className="gap-2 bg-transparent"
							onClick={() => router.push("/analytics")}>
							<TrendingUp className="h-4 w-4" />
							View Progress
						</Button>
					</>
				)}
			</div>

			{/* Enhanced Error Handling */}
			{category &&
				!matchedCategoryOrSubcategory &&
				!categoryLoading &&
				!isError && (
					<Card className="border-yellow-200 bg-yellow-50 mb-6">
						<CardContent className="p-6 text-center">
							<div className="text-yellow-800">
								<h3 className="text-lg font-medium mb-2">Category Not Found</h3>
								<p className="mb-4">
									The category &quot;{category}&quot; could not be found. Please
									select a valid category from the sidebar.
								</p>
								<Button
									variant="outline"
									onClick={() => router.push("/questions")}
									className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
									View All Questions
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

			<ApiStateLoader
				isLoading={isInitialLoading as boolean}
				isFetching={isRefetching}
				error={error}
				loadingText={`Loading ${categoryName} questions...`}
				renderSkeleton={() => <QuestionSkeleton />}
				skeletonCount={6}>
				<div className="space-y-4">
					{filteredQuestions.length > 0 ? (
						<>
							{/* Results Summary */}
							<div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
								<div className="text-sm text-gray-600">
									Showing{" "}
									<span className="font-semibold text-gray-900">
										{filteredQuestions.length}
									</span>{" "}
									questions
									{categoryName !== "All Questions" && (
										<span>
											{" "}
											in{" "}
											<span className="font-semibold text-gray-900">
												{categoryName}
											</span>
										</span>
									)}
								</div>
								<div className="flex items-center gap-2 text-xs text-gray-500">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									Updated {new Date().toLocaleDateString()}
								</div>
							</div>

							{/* Questions List */}
							{filteredQuestions.map((question, index) => (
								<Card
									key={question.id || index}
									onClick={() => handleCardClick(question)}
									className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-gray-300 cursor-pointer group bg-white hover:bg-gray-50">
									<CardContent className="p-6">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-3">
													<Badge
														className={`${getDifficultyColor(
															question.difficulty
														)} font-medium`}>
														{question.difficulty}
													</Badge>
													<Badge
														variant="outline"
														className="text-xs bg-blue-50 text-blue-700 border-blue-200">
														{question.category?.name || "Uncategorized"}
													</Badge>
													{question.timeLimit && (
														<Badge
															variant="secondary"
															className="text-xs bg-gray-100 text-gray-600">
															<Clock className="h-3 w-3 mr-1" />
															{question.timeLimit}min
														</Badge>
													)}
												</div>

												<h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
													{question.title}
												</h3>

												{question.tags && question.tags.length > 0 && (
													<div className="flex flex-wrap gap-2 mb-4">
														{question.tags.slice(0, 5).map((tag, tagIndex) => (
															<Badge
																key={`${tag}-${tagIndex}`}
																variant="secondary"
																className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
																{tag}
															</Badge>
														))}
														{question.tags.length > 5 && (
															<Badge
																variant="secondary"
																className="text-xs bg-gray-100 text-gray-500">
																+{question.tags.length - 5} more
															</Badge>
														)}
													</div>
												)}

												<div className="flex items-center gap-6 text-sm text-gray-500">
													<div className="flex items-center gap-1.5">
														<Star className="h-4 w-4 text-yellow-500" />
														<span className="font-medium">
															{question.stats?.likes || 0}
														</span>
													</div>
													<div className="flex items-center gap-1.5">
														<Users className="h-4 w-4 text-blue-500" />
														<span>{question.stats?.views || 0} views</span>
													</div>
													<div className="flex items-center gap-1.5">
														<Clock className="h-4 w-4 text-gray-400" />
														<span>
															{new Date(question.createdAt).toLocaleDateString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																	year: "numeric",
																}
															)}
														</span>
													</div>
												</div>
											</div>

											<div className="flex flex-col items-center gap-2">
												<ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
												<div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
													View
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</>
					) : (
						<Card className="border-gray-200 bg-gray-50">
							<CardContent className="p-12 text-center">
								<div className="max-w-md mx-auto">
									<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
										<Users className="h-8 w-8 text-gray-400" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										No Questions Available
									</h3>
									<p className="text-gray-600 mb-6">
										{categoryName && categoryName !== "All Questions"
											? `We're working on adding questions for ${categoryName}. Check back soon!`
											: "No questions are available at the moment. Please try selecting a different category."}
									</p>
									<div className="flex flex-col sm:flex-row gap-3 justify-center">
										<Button
											variant="outline"
											onClick={() => router.push("/questions")}
											className="gap-2">
											<TrendingUp className="h-4 w-4" />
											Browse All Categories
										</Button>
										<Button
											onClick={() => router.push("/practice")}
											className="gap-2 bg-green-600 hover:bg-green-700">
											<Clock className="h-4 w-4" />
											Start Practice Mode
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</ApiStateLoader>
		</>
	);
}
