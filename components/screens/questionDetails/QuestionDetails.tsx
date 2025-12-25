"use client";

import {
	Bookmark,
	Calendar,
	Check,
	ChevronLeft,
	Clock,
	Code2,
	Copy,
	Edit,
	Eye,
	GitPullRequest,
	MessageSquare,
	Share2,
	Star,
	ThumbsUp,
	Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { ApiStateLoader } from "@/components/custom/loader/PageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HtmlContent } from "@/components/ui/html-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClusterData } from "@/context/clusterData-context";
import { questionService } from "@/services/questions/question-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithoutPagination,
} from "@/types/axios-response";
import { GetSingleQuestionResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CommentSection } from "./CommentSection";
import { ContributionModal } from "./ContributionModal";
import { ContributorsList } from "./ContributorsList";
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
	const router = useRouter();
	const { userData } = useClusterData();
	const [isBookmarked, setIsBookmarked] = React.useState(false);
	const [contributionModalOpen, setContributionModalOpen] =
		React.useState(false);
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
				// Invalidate and refetch question data
				queryClient.invalidateQueries(["question", questionId]);
			},
			onError: (error) => {
				console.error("Error bookmarking question:", error);
				setIsBookmarked(false);
			},
		}
	);

	const queryClient = useQueryClient();

	const { mutate: likeMutate } = useMutation<
		AxiosResponseTypeWithoutPagination<{ likes: number }>,
		AxiosError<AxiosErrorResponseType>
	>(
		["likeStatus", question?.id],
		() => questionService.likeQuestion(question?._id as string),
		{
			onSuccess: () => {
				// Invalidate and refetch question data
				queryClient.invalidateQueries(["question", questionId]);
			},
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
				return "bg-emerald-100 text-emerald-700 border-emerald-200";
			case "Medium":
				return "bg-amber-100 text-amber-700 border-amber-200";
			case "Hard":
				return "bg-rose-100 text-rose-700 border-rose-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
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

	const canEditQuestion = () => {
		if (!userData || !question || !question.author) return false;
		const authorId =
			(question.author as any)._id || (question.author as any).id;
		const isAuthor = authorId === userData._id;
		const isAdmin = userData.role === "admin";
		return isAuthor || isAdmin;
	};

	const handleEditQuestion = () => {
		// Use question._id (MongoDB ObjectId) not questionId (slug)
		if (question?._id) {
			router.push(`/questions/edit/${question._id}`);
		}
	};

	return (
		<ApiStateLoader
			isLoading={isLoading}
			isFetching={isFetching}
			error={error}
			loadingText="Loading question..."
			renderSkeleton={() => <QuestionDetailsSkeleton />}>
			{!question ? (
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<p className="text-gray-500 text-lg">Question not found</p>
						<Button onClick={onBack} variant="outline" className="mt-4">
							Go Back
						</Button>
					</div>
				</div>
			) : (
				<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
					{/* Header */}
					<div className="bg-white border-b shadow-sm sticky -top-4 z-[999]">
						<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
							<div className="flex items-center justify-between py-2 sm:py-4 gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={onBack}
									className="gap-1 sm:gap-2 hover:bg-gray-100 px-2 sm:px-3">
									<ChevronLeft className="h-4 w-4" />
									<span className="hidden md:inline">Back</span>
								</Button>
								<div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
									{canEditQuestion() && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleEditQuestion}
											className="gap-1 sm:gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 px-2 sm:px-3">
											<Edit className="h-3 w-3 sm:h-4 sm:w-4" />
											<span className="hidden sm:inline">Edit</span>
										</Button>
									)}
									<Button
										variant="outline"
										size="sm"
										onClick={() => setContributionModalOpen(true)}
										className="gap-1 sm:gap-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 px-2 sm:px-3">
										<GitPullRequest className="h-3 w-3 sm:h-4 sm:w-4" />
										<span className="hidden md:inline">Contribute</span>
									</Button>
									<Button
										variant={checkIsLiked() ? "default" : "outline"}
										size="sm"
										onClick={handleLikes}
										className="gap-1 sm:gap-2 px-2 sm:px-3">
										<ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
										<span className="hidden sm:inline">
											{question.stats?.likes || 0}
										</span>
									</Button>
									<Button
										variant={isBookmarked ? "default" : "outline"}
										size="sm"
										onClick={handleBookmarks}
										className="gap-1 sm:gap-2 px-2 sm:px-3">
										<Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
										<span className="hidden md:inline">Save</span>
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="gap-1 sm:gap-2 px-2 sm:px-3">
										<Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
										<span className="hidden md:inline">Share</span>
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4">
						{/* Question Header */}
						<Card className="mb-4 sm:mb-6 overflow-hidden border-0 shadow-lg p-0">
							<div className="bg-gradient-to-r from-green-100 to-purple-100 p-4 sm:p-6">
								<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									<Badge
										className={`${getDifficultyColor(
											question.difficulty
										)} font-semibold px-2 sm:px-3 py-1 text-xs sm:text-sm`}>
										{question.difficulty}
									</Badge>
									<Badge
										variant="secondary"
										className="bg-white/20 border-0 text-xs sm:text-sm px-2 sm:px-3">
										{question.category?.name || question.subcategory}
									</Badge>
									{question.timeLimit && (
										<Badge
											variant="secondary"
											className="bg-white/20 border-0 gap-1 text-xs sm:text-sm px-2 sm:px-3">
											<Clock className="h-3 w-3" />
											{question.timeLimit} min
										</Badge>
									)}
								</div>
								<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
									{question.title}
								</h1>
							</div>

							<div className="p-4 sm:p-6">
								{/* Stats */}
								<div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
									<div className="flex items-center gap-1.5 sm:gap-2">
										<Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
										<span>
											{question.stats?.views || 0}
											<span className="hidden sm:inline"> views</span>
										</span>
									</div>
									<div className="flex items-center gap-1.5 sm:gap-2">
										<ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
										<span>
											{question.stats?.likes || 0}
											<span className="hidden sm:inline"> likes</span>
										</span>
									</div>
									<div className="flex items-center gap-1.5 sm:gap-2">
										<Bookmark className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
										<span>
											{question.stats?.bookmarks || 0}
											<span className="hidden sm:inline"> saved</span>
										</span>
									</div>
									<div className="flex items-center gap-1.5 sm:gap-2">
										<Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
										<span className="hidden xs:inline">
											{new Date(question.createdAt).toLocaleDateString()}
										</span>
									</div>
								</div>

								{/* Tags */}
								{question.tags && question.tags.length > 0 && (
									<div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
										{question.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
												#{tag}
											</Badge>
										))}
									</div>
								)}

								{/* Question Content */}
								<div className="prose-custom text-sm sm:text-base">
									<HtmlContent content={question.content} />
								</div>
							</div>
						</Card>

						{/* Contributors */}
						{question.contributors && question.contributors.length > 0 && (
							<ContributorsList
								contributors={question.contributors}
								author={{
									_id:
										(question.author as any)._id || (question.author as any).id,
									name: question.author.name,
									username: question.author.username,
									avatar: question.author.avatar || undefined,
								}}
							/>
						)}

						{/* Companies */}
						{/* {question.companies && question.companies.length > 0 && (
							<Card className="mb-6 border-0 shadow-md">
								<div className="p-6">
									<div className="flex items-center gap-2 mb-4">
										<Building className="h-5 w-5 text-green-600" />
										<h3 className="text-lg font-semibold text-gray-900">
											Asked by Companies
										</h3>
									</div>
									<div className="flex flex-wrap gap-2">
										{question.companies.map((company) => (
											<Badge
												key={company._id}
												variant="outline"
												className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
												{company.name}
											</Badge>
										))}
									</div>
								</div>
							</Card>
						)} */}

						{/* Contribution Modal */}
						<ContributionModal
							open={contributionModalOpen}
							onClose={() => setContributionModalOpen(false)}
							questionId={question._id}
						/>

						{/* Tabs */}
						<Card className="border-0 shadow-lg">
							<Tabs defaultValue="solution" className="w-full">
								<div className="border-b bg-gray-50">
									<TabsList className="grid w-full grid-cols-3 h-auto bg-transparent p-0 rounded-none">
										<TabsTrigger
											value="solution"
											className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-sm py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 font-medium text-xs sm:text-sm md:text-base">
											<Code2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
											<span className="hidden md:inline">Solution</span>
										</TabsTrigger>
										<TabsTrigger
											value="discussion"
											className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-sm py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 font-medium text-xs sm:text-sm md:text-base">
											<MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
											<span className="hidden md:inline">Discussion</span>
										</TabsTrigger>
										<TabsTrigger
											value="related"
											className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 rounded-sm py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 font-medium text-xs sm:text-sm md:text-base">
											<Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
											<span className="hidden md:inline">Related</span>
										</TabsTrigger>
									</TabsList>
								</div>

								<TabsContent
									value="solution"
									className="px-2 sm:px-4 md:px-6 py-4 space-y-4 sm:space-y-6 md:space-y-8 shadow-none">
									{/* Rich Answer */}
									{question.richAnswer && (
										<div className="space-y-3 sm:space-y-4">
											<div className="flex items-center gap-2">
												<h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
													Explanation
												</h3>
											</div>
											<div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-yellow-100">
												<HtmlContent content={question.richAnswer} />
											</div>
										</div>
									)}

									{/* Solutions */}
									{question.solutions && question.solutions.length > 0 && (
										<div className="space-y-4 sm:space-y-6">
											<div className="flex items-center gap-2">
												<Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
												<h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
													Code Solutions
												</h3>
											</div>
											{question.solutions.map((solution, index) => (
												<Card
													key={index}
													className="overflow-hidden border-2 border-gray-200 hover:border-green-300 transition-colors">
													<div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b">
														<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
															<div className="flex-1">
																<h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
																	{solution.title || `Solution ${index + 1}`}
																</h4>
																{(solution.timeComplexity ||
																	solution.spaceComplexity) && (
																	<div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2 text-xs sm:text-sm">
																		{solution.timeComplexity && (
																			<span className="text-gray-600">
																				⏱️ Time: {solution.timeComplexity}
																			</span>
																		)}
																		{solution.spaceComplexity && (
																			<span className="text-gray-600">
																				💾 Space: {solution.spaceComplexity}
																			</span>
																		)}
																	</div>
																)}
															</div>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	copyToClipboard(
																		solution.code,
																		solution.title || `Solution ${index + 1}`
																	)
																}
																className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 w-full sm:w-auto">
																{copiedCode ===
																(solution.title || `Solution ${index + 1}`) ? (
																	<>
																		<Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
																		<span className="hidden xs:inline">
																			Copied!
																		</span>
																	</>
																) : (
																	<>
																		<Copy className="h-3 w-3 sm:h-4 sm:w-4" />
																		<span className="hidden xs:inline">
																			Copy
																		</span>
																	</>
																)}
															</Button>
														</div>
													</div>
													<div className="space-y-3 sm:space-y-4 px-2 sm:px-3 md:px-4">
														{solution.code && (
															<div className="relative group">
																<div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
																	<Badge className="bg-gray-800 text-white text-[10px] sm:text-xs px-1.5 sm:px-2">
																		{solution.language}
																	</Badge>
																</div>
																<div className="bg-gray-900 rounded-lg p-2 sm:p-3 md:p-4 overflow-x-auto">
																	<pre className="text-xs sm:text-sm text-gray-100 font-mono">
																		<code>{solution.code}</code>
																	</pre>
																</div>
															</div>
														)}
														{solution.explanation && (
															<div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
																<HtmlContent content={solution.explanation} />
															</div>
														)}
													</div>
												</Card>
											))}
										</div>
									)}

									{/* Hints */}
									{question.hints && question.hints.length > 0 && (
										<div className="space-y-3 sm:space-y-4">
											<div className="flex items-center gap-2">
												<Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
												<h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
													Hints
												</h3>
											</div>
											<div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-100 space-y-2 sm:space-y-3">
												{question.hints.map((hint, index) => (
													<div
														key={index}
														className="flex items-start gap-2 sm:gap-3">
														<div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center">
															{hint.order || index + 1}
														</div>
														<p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed pt-0.5">
															{hint.content}
														</p>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Best Practices */}
									{question.bestPractices &&
										question.bestPractices.length > 0 && (
											<div className="space-y-3 sm:space-y-4">
												<div className="flex items-center gap-2">
													<Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
													<h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
														Best Practices
													</h3>
												</div>
												<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-100 space-y-2 sm:space-y-3">
													{question.bestPractices.map((practice, index) => (
														<div
															key={index}
															className="flex items-start gap-2 sm:gap-3">
															<div className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mt-1.5 sm:mt-2" />
															<p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
																{practice}
															</p>
														</div>
													))}
												</div>
											</div>
										)}
								</TabsContent>

								<TabsContent value="discussion" className="">
									<CommentSection questionId={question._id} />
								</TabsContent>

								<TabsContent value="related" className="p-3 sm:p-4 md:p-6">
									<RelatedQuestions
										questionId={question._id}
										onQuestionClick={(slug: string) => {
											window.location.href = `/questions/${question.category.slug}/${slug}`;
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
