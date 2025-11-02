"use client";

import {
	Bookmark,
	Building,
	Calendar,
	Check,
	ChevronLeft,
	Code2,
	Copy,
	Eye,
	Share2,
	Star,
	ThumbsUp,
	Zap,
} from "lucide-react";
import * as React from "react";

import { ApiStateLoader } from "@/components/custom/loader/PageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClusterData } from "@/context/clusterData-context";
import { questionService } from "@/services/questions/question-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithoutPagination,
} from "@/types/axios-response";
import { GetSingleQuestionResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { CommentSection } from "./CommentSection";
import { QuestionDetailsSkeleton } from "./QuestionDetailsSkeleton";
import { RelatedQuestions } from "./RelatedQuestions";

interface QuestionDetailViewProps {
	questionId: string;
	onBack: () => void;
}

export const QuestionDetailView = ({
	questionId,
	onBack,
}: QuestionDetailViewProps) => {
	const { userData } = useClusterData();
	const [isBookmarked, setIsBookmarked] = React.useState(false);
	const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

	const { data, isLoading, error, isFetching } = useQuery<
		AxiosResponseTypeWithoutPagination<GetSingleQuestionResponseType>,
		AxiosError<AxiosErrorResponseType>
	>(
		["question", questionId],
		() => questionService.getSingleQuestion(questionId),
		{
			staleTime: 1000 * 60 * 5,
			cacheTime: 1000 * 60 * 10,
			keepPreviousData: true,
		}
	);

	const question = data?.data;

	const { mutate: bookmarkMutate } = useMutation<
		AxiosResponseTypeWithoutPagination<{ bookmarks: number }>,
		AxiosError<AxiosErrorResponseType>
	>(
		["bookmarkStatus", question?.id],
		() => questionService.bookmarkQuestion(question?.id as string),
		{
			onSuccess: () => {
				setIsBookmarked(true);
			},
			onError: (error) => {
				console.error("Error bookmarking question:", error);
				setIsBookmarked(false);
			},
		}
	);
	const { mutate: likeMutate } = useMutation<
		AxiosResponseTypeWithoutPagination<{ likes: number }>,
		AxiosError<AxiosErrorResponseType>
	>(
		["likeStatus", question?.id],
		() => questionService.likeQuestion(question?._id as string),
		{
			onError: (error) => {
				console.error("Error liking question:", error);
			},
		}
	);

	const handleLikes = () => {
		likeMutate();
	};

	const handleBookmarks = () => {
		bookmarkMutate();
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800 border-green-200";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "Hard":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const copyToClipboard = async (code: string, title: string) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedCode(title);
			setTimeout(() => setCopiedCode(null), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	const checkIsLiked = () => {
		return question?.likedBy.includes(userData?._id as string);
	};

	return (
		<ApiStateLoader
			isLoading={isLoading}
			isFetching={isFetching}
			error={error}
			loadingText="Loading question details..."
			renderSkeleton={() => <QuestionDetailsSkeleton />}>
			{!question ? (
				<div className="flex justify-center p-8">
					<p className="text-gray-500">Question not found</p>
				</div>
			) : (
				<div className="min-h-screen bg-gray-50">
					{/* Header with Back Button */}
					<div className="bg-white border-b sticky -top-5 z-10">
						<div className="flex items-center gap-4 py-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={onBack}
								className="gap-2 text-gray-600 hover:text-gray-900">
								<ChevronLeft className="h-4 w-4" />
								<span className="hidden sm:inline">Back to Questions</span>
							</Button>
							<div className="h-6 w-px bg-gray-300" />
							<div className="flex items-center gap-2">
								<Badge className={getDifficultyColor(question.difficulty)}>
									{question.difficulty}
								</Badge>
								<span className="text-sm text-gray-500">
									{question.category?.name || question.subcategory}
								</span>
							</div>
						</div>
					</div>

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{/* Question Header Card */}
						<Card className="mb-8 shadow-sm border-0 bg-white">
							<CardContent className="p-6 sm:p-8">
								{/* Title */}
								<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
									{question.title}
								</h1>

								{/* Tags */}
								{question.tags && question.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-6">
										{question.tags.slice(0, 8).map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="text-xs px-3 py-1">
												{tag}
											</Badge>
										))}
										{question.tags.length > 8 && (
											<Badge variant="secondary" className="text-xs px-3 py-1">
												+{question.tags.length - 8} more
											</Badge>
										)}
									</div>
								)}

								{/* Stats and Actions */}
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
									<div className="flex items-center gap-6 text-sm text-gray-500">
										<div className="flex items-center gap-2">
											<Eye className="h-4 w-4" />
											<span>{question.stats?.views || 0} views</span>
										</div>
										<div className="flex items-center gap-2">
											<ThumbsUp className="h-4 w-4" />
											<span>{question.stats?.likes || 0} likes</span>
										</div>
										<div className="flex items-center gap-2">
											<Bookmark className="h-4 w-4" />
											<span>{question.stats?.bookmarks || 0} saved</span>
										</div>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											<span>
												{new Date(question.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button
											variant={checkIsLiked() ? "default" : "outline"}
											size="sm"
											onClick={() => handleLikes()}
											className="gap-2">
											<ThumbsUp className="h-4 w-4" />
											Like
										</Button>
										<Button
											variant={isBookmarked ? "default" : "outline"}
											size="sm"
											onClick={() => handleBookmarks()}
											className="gap-2">
											<Bookmark className="h-4 w-4" />
											Save
										</Button>
										<Button variant="outline" size="sm" className="gap-2">
											<Share2 className="h-4 w-4" />
											Share
										</Button>
									</div>
								</div>

								{/* Question Content */}
								<div className="prose prose-gray max-w-none">
									<p className="text-gray-700 leading-relaxed text-base">
										{question.content}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Companies */}
						{question.companies && question.companies.length > 0 && (
							<Card className="mb-8 shadow-sm border-0 bg-white">
								<CardHeader className="pb-4">
									<CardTitle className="text-lg flex items-center gap-2 text-gray-900">
										<Building className="h-5 w-5 text-blue-600" />
										Asked by Companies
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="flex flex-wrap gap-2">
										{question.companies.slice(0, 12).map((company) => (
											<Badge
												key={company._id}
												variant="outline"
												className="px-3 py-1.5 text-sm font-medium border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
												{company.name}
											</Badge>
										))}
										{question.companies.length > 12 && (
											<Badge
												variant="outline"
												className="px-3 py-1.5 text-sm font-medium border-gray-200">
												+{question.companies.length - 12} more
											</Badge>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Main Content Tabs */}
						<Card className="shadow-sm border-0 bg-white">
							<Tabs defaultValue="solution" className="w-full">
								<div className="border-b border-gray-200">
									<TabsList className="grid w-full grid-cols-3 h-auto bg-transparent p-0 rounded-none">
										<TabsTrigger
											value="solution"
											className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent py-4 px-6 text-sm font-medium transition-all">
											<Code2 className="h-4 w-4 mr-2" />
											<span className="hidden sm:inline">
												Solution & Explanation
											</span>
											<span className="sm:hidden">Solution</span>
										</TabsTrigger>
										<TabsTrigger
											value="discussion"
											className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent py-4 px-6 text-sm font-medium transition-all">
											<Building className="h-4 w-4 mr-2" />
											Discussion
										</TabsTrigger>
										<TabsTrigger
											value="related"
											className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent py-4 px-6 text-sm font-medium transition-all">
											<Star className="h-4 w-4 mr-2" />
											<span className="hidden sm:inline">
												Related Questions
											</span>
											<span className="sm:hidden">Related</span>
										</TabsTrigger>
									</TabsList>
								</div>

								<TabsContent value="solution" className="p-6 space-y-8">
									{/* Rich Answer Content */}
									{question.richAnswer && (
										<div className="space-y-4">
											<h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
												<Zap className="h-5 w-5 text-yellow-500" />
												Explanation
											</h3>
											<div className="bg-gray-50 rounded-lg p-6">
												<div
													className="prose prose-gray max-w-none"
													dangerouslySetInnerHTML={{
														__html: question.richAnswer,
													}}
												/>
											</div>
										</div>
									)}

									{/* Solutions */}
									{question.solutions && question.solutions.length > 0 && (
										<div className="space-y-6">
											<h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
												<Code2 className="h-5 w-5 text-blue-600" />
												Solutions
											</h3>
											{question.solutions.map((solution, index) => (
												<div
													key={index}
													className="bg-white border border-gray-200 rounded-lg overflow-hidden">
													<div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
														<div className="flex items-center justify-between">
															<h4 className="text-lg font-medium text-gray-900">
																{solution.title || `Solution ${index + 1}`}
															</h4>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	copyToClipboard(
																		solution.code,
																		solution.title || `Solution ${index + 1}`
																	)
																}
																className="gap-2">
																{copiedCode ===
																(solution.title || `Solution ${index + 1}`) ? (
																	<Check className="h-4 w-4" />
																) : (
																	<Copy className="h-4 w-4" />
																)}
																{copiedCode ===
																(solution.title || `Solution ${index + 1}`)
																	? "Copied!"
																	: "Copy Code"}
															</Button>
														</div>
														{(solution.timeComplexity ||
															solution.spaceComplexity) && (
															<div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
																{solution.timeComplexity && (
																	<span>Time: {solution.timeComplexity}</span>
																)}
																{solution.spaceComplexity && (
																	<span>Space: {solution.spaceComplexity}</span>
																)}
															</div>
														)}
													</div>
													<div className="p-6">
														{solution.code && (
															<div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
																<pre className="text-sm text-gray-100">
																	<code>{solution.code}</code>
																</pre>
															</div>
														)}
														{solution.explanation && (
															<div className="prose prose-gray max-w-none">
																<p className="text-gray-700 leading-relaxed">
																	{solution.explanation}
																</p>
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									)}

									{/* Best Practices */}
									{question.bestPractices &&
										question.bestPractices.length > 0 && (
											<div className="space-y-4">
												<h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
													<Star className="h-5 w-5 text-green-600" />
													Best Practices
												</h3>
												<div className="bg-green-50 border border-green-200 rounded-lg p-6">
													<ul className="space-y-3">
														{question.bestPractices.map((practice, index) => (
															<li
																key={index}
																className="flex items-start gap-3">
																<div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
																<span className="text-gray-700 leading-relaxed">
																	{practice}
																</span>
															</li>
														))}
													</ul>
												</div>
											</div>
										)}

									{/* Hints */}
									{question.hints && question.hints.length > 0 && (
										<div className="space-y-4">
											<h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
												<Zap className="h-5 w-5 text-yellow-600" />
												Hints
											</h3>
											<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
												<ul className="space-y-3">
													{question.hints.map((hint, index) => (
														<li key={index} className="flex items-start gap-3">
															<div className="h-6 w-6 rounded-full bg-yellow-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
																{hint.order || index + 1}
															</div>
															<span className="text-gray-700 leading-relaxed">
																{hint.content}
															</span>
														</li>
													))}
												</ul>
											</div>
										</div>
									)}
								</TabsContent>

								<TabsContent value="discussion" className="p-6">
									<CommentSection questionId={question._id} />
								</TabsContent>

								<TabsContent value="related" className="p-6">
									<RelatedQuestions
										questionId={question._id}
										onQuestionClick={(slug: string) => {
											// Navigate to the related question
											window.location.href = `/questions/${slug}`;
										}}
									/>
								</TabsContent>
							</Tabs>
						</Card>
					</div>
				</div>
			)}
		</ApiStateLoader>
	);
};
