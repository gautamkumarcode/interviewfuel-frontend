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
				<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
					{/* Modern Sticky Header */}
					<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky -top-[20px] z-40 shadow-sm">
						<div className=" mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex items-center justify-between py-3 sm:py-4">
								{/* Left: Back Button */}
								<Button
									variant="ghost"
									size="sm"
									onClick={onBack}
									className="gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 -ml-2">
									<ChevronLeft className="h-4 w-4" />
									<span className="font-medium">Back</span>
								</Button>

								{/* Right: Action Buttons */}
								<div className="flex items-center gap-2">
									{canEditQuestion() && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleEditQuestion}
											className="gap-1.5">
											<Edit className="h-4 w-4" />
											<span className="hidden sm:inline">Edit</span>
										</Button>
									)}
									<Button
										variant="outline"
										size="sm"
										onClick={() => setContributionModalOpen(true)}
										className="gap-1.5">
										<GitPullRequest className="h-4 w-4" />
										<span className="hidden sm:inline">Contribute</span>
									</Button>
									<Button
										variant={checkIsLiked() ? "default" : "outline"}
										size="sm"
										onClick={handleLikes}
										className="gap-1.5">
										<ThumbsUp className="h-4 w-4" />
										<span>{question.stats?.likes || 0}</span>
									</Button>
									<Button
										variant={isBookmarked ? "default" : "outline"}
										size="sm"
										onClick={handleBookmarks}
										className="gap-1.5">
										<Bookmark className="h-4 w-4" />
									</Button>
									<Button variant="outline" size="sm" className="gap-1.5">
										<Share2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
						{/* Question Header Card */}
						<Card className="mb-6 border-0 shadow-sm overflow-hidden p-0">
							{/* Gradient Header */}
							<div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 px-6 py-8 sm:px-8 sm:py-10">
								{/* Badges */}
								<div className="flex flex-wrap items-center gap-2 mb-4">
									<Badge
										className={`${getDifficultyColor(
											question.difficulty
										)} font-semibold px-3 py-1`}>
										{question.difficulty}
									</Badge>
									<Badge
										variant="secondary"
										className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm">
										{question.category?.name || question.subcategory}
									</Badge>
									{question.timeLimit && (
										<Badge
											variant="secondary"
											className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm gap-1">
											<Clock className="h-3 w-3" />
											{question.timeLimit} min
										</Badge>
									)}
								</div>

								{/* Title */}
								<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
									{question.title}
								</h1>

								{/* Stats Bar */}
								<div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-300">
									<div className="flex items-center gap-2">
										<Eye className="h-4 w-4" />
										<span>{question.stats?.views || 0} views</span>
									</div>
									<div className="flex items-center gap-2">
										<MessageSquare className="h-4 w-4" />
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
							</div>

							{/* Content Body */}
							<div className="px-6 py-6 sm:px-8 sm:py-8">
								{/* Tags */}
								{question.tags && question.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
										{question.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="px-3 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
												#{tag}
											</Badge>
										))}
									</div>
								)}

								{/* Question Description */}
								<div className="prose prose-gray dark:prose-invert max-w-none">
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

						{/* Tabs Section */}
						<Card className="border-0 shadow-sm overflow-hidden">
							<Tabs defaultValue="solution" className="w-full">
								{/* Modern Tab Navigation */}
								<div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
									<TabsList className="w-full h-auto bg-transparent p-0 rounded-none grid grid-cols-3">
										<TabsTrigger
											value="solution"
											className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none py-4 px-6 font-medium transition-colors">
											<Code2 className="h-4 w-4 mr-2" />
											<span className="hidden sm:inline">Solution</span>
										</TabsTrigger>
										<TabsTrigger
											value="discussion"
											className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none py-4 px-6 font-medium transition-colors">
											<MessageSquare className="h-4 w-4 mr-2" />
											<span className="hidden sm:inline">Discussion</span>
										</TabsTrigger>
										<TabsTrigger
											value="related"
											className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none py-4 px-6 font-medium transition-colors">
											<Star className="h-4 w-4 mr-2" />
											<span className="hidden sm:inline">Related</span>
										</TabsTrigger>
									</TabsList>
								</div>

								{/* Tab Content */}
								<TabsContent value="solution" className="p-6 sm:p-8 space-y-8">
									{/* Rich Answer */}
									{question.richAnswer && (
										<div className="space-y-4">
											<h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
												<div className="w-1 h-6 bg-blue-600 rounded-full"></div>
												Explanation
											</h3>
											<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-100 dark:border-gray-600">
												<HtmlContent content={question.richAnswer} />
											</div>
										</div>
									)}

									{/* Solutions */}
									{question.solutions && question.solutions.length > 0 && (
										<div className="space-y-6">
											<h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
												<div className="w-1 h-6 bg-green-600 rounded-full"></div>
												Code Solutions
											</h3>
											{question.solutions.map((solution, index) => (
												<Card
													key={index}
													className="overflow-hidden border border-gray-200 dark:border-gray-700">
													{/* Solution Header */}
													<div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
														<div className="flex items-start justify-between gap-4">
															<div className="flex-1">
																<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
																	{solution.title || `Solution ${index + 1}`}
																</h4>
																{(solution.timeComplexity ||
																	solution.spaceComplexity) && (
																	<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
																		{solution.timeComplexity && (
																			<div className="flex items-center gap-1.5">
																				<Clock className="h-4 w-4" />
																				<span>
																					Time: {solution.timeComplexity}
																				</span>
																			</div>
																		)}
																		{solution.spaceComplexity && (
																			<div className="flex items-center gap-1.5">
																				<Zap className="h-4 w-4" />
																				<span>
																					Space: {solution.spaceComplexity}
																				</span>
																			</div>
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
																className="gap-2 shrink-0">
																{copiedCode ===
																(solution.title || `Solution ${index + 1}`) ? (
																	<>
																		<Check className="h-4 w-4 text-green-600" />
																		<span>Copied!</span>
																	</>
																) : (
																	<>
																		<Copy className="h-4 w-4" />
																		<span>Copy</span>
																	</>
																)}
															</Button>
														</div>
													</div>

													{/* Code Block */}
													<div className="p-0">
														{solution.code && (
															<div className="relative group">
																<div className="absolute top-4 right-4 z-10">
																	<Badge className="bg-gray-800 text-white px-3 py-1">
																		{solution.language}
																	</Badge>
																</div>
																<div className="bg-gray-900 dark:bg-black p-6 overflow-x-auto">
																	<pre className="text-sm text-gray-100 font-mono leading-relaxed">
																		<code>{solution.code}</code>
																	</pre>
																</div>
															</div>
														)}
														{solution.explanation && (
															<div className="p-6 bg-green-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
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
										<div className="space-y-4">
											<h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
												<div className="w-1 h-6 bg-purple-600 rounded-full"></div>
												Hints
											</h3>
											<div className="space-y-3">
												{question.hints.map((hint, index) => (
													<div
														key={index}
														className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-gray-700">
														<div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
															{hint.order || index + 1}
														</div>
														<p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
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
											<div className="space-y-4">
												<h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
													<div className="w-1 h-6 bg-green-600 rounded-full"></div>
													Best Practices
												</h3>
												<div className="space-y-3">
													{question.bestPractices.map((practice, index) => (
														<div
															key={index}
															className="flex items-start gap-3 p-4 bg-green-50 dark:bg-gray-800 rounded-lg border border-green-100 dark:border-gray-700">
															<Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
															<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
																{practice}
															</p>
														</div>
													))}
												</div>
											</div>
										)}
								</TabsContent>

								<TabsContent value="discussion" className="p-6 sm:p-8">
									<CommentSection questionId={question._id} />
								</TabsContent>

								<TabsContent value="related" className="p-6 sm:p-8">
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
