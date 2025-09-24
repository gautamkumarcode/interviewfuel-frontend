"use client";

import {
	ArrowLeft,
	Bookmark,
	Building,
	Calendar,
	Check,
	ChevronRight,
	Code2,
	Copy,
	Eye,
	Share2,
	Star,
	Tag,
	ThumbsUp,
	Zap,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { questionService } from "@/services/questions/question-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithoutPagination,
} from "@/types/axios-response";
import { GetSingleQuestionResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import { useQuery } from "react-query";

interface QuestionDetailViewProps {
	questionId: string;
	onBack: () => void;
	
}

export const QuestionDetailView = ({
	questionId,
	onBack,
}: QuestionDetailViewProps) => {
	const [isBookmarked, setIsBookmarked] = React.useState(false);
	const [isLiked, setIsLiked] = React.useState(false);
	const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
	const [newComment, setNewComment] = React.useState("");


	const { data, isLoading } = useQuery<
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

	const handleAddComment = () => {
		if (newComment.trim()) {
			// In a real app, this would make an API call
			console.log("Adding comment:", newComment);
			setNewComment("");
		}
	};

	if (isLoading) {
		return <div className="flex justify-center p-8">Loading question...</div>;
	}

	if (!question) {
		return (
			<div className="flex justify-center p-8">
				<p className="text-gray-500">Question not found</p>
			</div>
		);
	}

	return (
		<div className="mx-auto px-4 sm:px-6 lg:px-8 h-screen overflow-scroll">
			{/* Header */}
			<div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
				<Button
					variant="ghost"
					onClick={onBack}
					className="gap-1 sm:gap-2 text-sm sm:text-base p-2 sm:p-3">
					<ArrowLeft className="h-4 w-4" />
					<span className="hidden sm:inline">Back to Questions</span>
					<span className="sm:hidden">Back</span>
				</Button>
			</div>

			{/* Question Header */}
			<div className="mb-6 sm:mb-8">
				<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
					<div className="flex-1">
						<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
							{question.title}
						</h1>

						<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
							<Badge className={getDifficultyColor(question.difficulty)}>
								{question.difficulty}
							</Badge>
							<Badge variant="outline" className="gap-1 text-xs sm:text-sm">
								<Building className="h-3 w-3" />
								<span className="hidden sm:inline">
									{question.companies?.length} companies
								</span>
								<span className="sm:hidden">{question.companies?.length}</span>
							</Badge>
							<Badge variant="outline" className="gap-1 text-xs sm:text-sm">
								<Tag className="h-3 w-3" />
								<span className="truncate max-w-[100px] sm:max-w-none">
									{question.subcategory}
								</span>
							</Badge>
						</div>

						<div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
							{question.tags?.slice(0, 5).map((tag) => (
								<Badge key={tag} variant="secondary" className="text-xs">
									{tag}
								</Badge>
							))}
							{question.tags?.length > 5 && (
								<Badge variant="secondary" className="text-xs">
									+{question.tags.length - 5} more
								</Badge>
							)}
						</div>

						<div className="grid grid-cols-2 sm:flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
							<div className="flex items-center gap-1">
								<Eye className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="truncate">
									{question.stats?.views}{" "}
									<span className="hidden sm:inline">views</span>
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="truncate">
									{question.stats?.likes}{" "}
									<span className="hidden sm:inline">likes</span>
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="truncate">
									{question.stats?.bookmarks}{" "}
									<span className="hidden sm:inline">bookmarks</span>
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
								<span className="truncate">
									{new Date(question.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 lg:mt-0">
						<Button
							variant={isLiked ? "default" : "outline"}
							size="sm"
							onClick={() => setIsLiked(!isLiked)}
							className="gap-1 sm:gap-2 flex-1 sm:flex-none">
							<ThumbsUp className="h-4 w-4" />
							<span className="hidden sm:inline">Like</span>
							<span className="sm:hidden">👍</span>
						</Button>
						<Button
							variant={isBookmarked ? "default" : "outline"}
							size="sm"
							onClick={() => setIsBookmarked(!isBookmarked)}
							className="gap-1 sm:gap-2 flex-1 sm:flex-none">
							<Bookmark className="h-4 w-4" />
							<span className="hidden sm:inline">Save</span>
							<span className="sm:hidden">💾</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-1 sm:gap-2 flex-1 sm:flex-none">
							<Share2 className="h-4 w-4" />
							<span className="hidden sm:inline">Share</span>
							<span className="sm:hidden">📤</span>
						</Button>
					</div>
				</div>

				<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
					{question.content}
				</p>
			</div>

			{/* Companies */}
			{question.companies?.length > 0 && (
				<Card className="mb-6 sm:mb-8">
					<CardHeader className="pb-3 sm:pb-6">
						<CardTitle className="text-base sm:text-lg flex items-center gap-2">
							<Building className="h-4 w-4 sm:h-5 sm:w-5" />
							Asked by Companies
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="flex flex-wrap gap-1.5 sm:gap-2">
							{question.companies.slice(0, 8).map((company) => (
								<Badge
									key={company._id}
									variant="outline"
									className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
									{company.name}
								</Badge>
							))}
							{question.companies.length > 8 && (
								<Badge
									variant="outline"
									className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
									+{question.companies.length - 8} more
								</Badge>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Main Content */}
			<Tabs defaultValue="solution" className="mb-6 sm:mb-8">
				<TabsList className="grid w-full grid-cols-3 h-auto">
					<TabsTrigger
						value="solution"
						className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5">
						<span className="hidden sm:inline">Solution & Explanation</span>
						<span className="sm:hidden">Solution</span>
					</TabsTrigger>
					<TabsTrigger
						value="discussion"
						className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5">
						Discussion
					</TabsTrigger>
					<TabsTrigger
						value="related"
						className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5">
						<span className="hidden sm:inline">Related Questions</span>
						<span className="sm:hidden">Related</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="solution" className="space-y-6">
					{/* Rich Answer Content */}
					{question.richAnswer && (
						<Card>
							<CardContent className="p-3 sm:p-6">
								<div
									className="prose prose-gray prose-sm sm:prose-base max-w-none"
									dangerouslySetInnerHTML={{ __html: question.richAnswer }}
								/>
							</CardContent>
						</Card>
					)}

					{/* Solutions */}
					{question.solutions?.length > 0 && (
						<div className="space-y-6">
							{question.solutions.map((solution, index) => (
								<Card key={index}>
									<CardHeader className="pb-3 sm:pb-6">
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
											<CardTitle className="text-base sm:text-lg flex items-center gap-2">
												<Code2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
												<span className="truncate">
													{solution.title || `Solution ${index + 1}`}
												</span>
											</CardTitle>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													copyToClipboard(
														solution.code,
														solution.title || `Solution ${index + 1}`
													)
												}
												className="gap-1 sm:gap-2 text-xs sm:text-sm shrink-0 self-start sm:self-auto">
												{copiedCode ===
												(solution.title || `Solution ${index + 1}`) ? (
													<Check className="h-3 w-3 sm:h-4 sm:w-4" />
												) : (
													<Copy className="h-3 w-3 sm:h-4 sm:w-4" />
												)}
												{copiedCode ===
												(solution.title || `Solution ${index + 1}`)
													? "Copied!"
													: "Copy"}
											</Button>
										</div>
									</CardHeader>
									<CardContent className="pt-0">
										{solution.code && (
											<div className="bg-gray-900 rounded-lg p-3 sm:p-4 mb-4 overflow-x-auto">
												<pre className="text-xs sm:text-sm text-gray-100">
													<code>{solution.code}</code>
												</pre>
											</div>
										)}
										{solution.explanation && (
											<p className="text-gray-600 leading-relaxed text-sm sm:text-base">
												{solution.explanation}
											</p>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Best Practices */}
					{question.bestPractices?.length > 0 && (
						<Card>
							<CardHeader className="pb-3 sm:pb-6">
								<CardTitle className="text-base sm:text-lg flex items-center gap-2">
									<Star className="h-4 w-4 sm:h-5 sm:w-5" />
									Best Practices
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<ul className="space-y-3">
									{question.bestPractices.map((practice, index) => (
										<li key={index} className="flex items-start gap-3">
											<div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
											<span className="text-gray-700 text-sm sm:text-base leading-relaxed">
												{practice}
											</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}

					{/* Hints */}
					{question.hints?.length > 0 && (
						<Card>
							<CardHeader className="pb-3 sm:pb-6">
								<CardTitle className="text-base sm:text-lg flex items-center gap-2">
									<Zap className="h-4 w-4 sm:h-5 sm:w-5" />
									Hints
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<ul className="space-y-3">
									{question.hints.map((hint, index) => (
										<li key={index} className="flex items-start gap-3">
											<div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
											<span className="text-gray-700 text-sm sm:text-base leading-relaxed">
												{hint.content}
											</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="discussion" className="space-y-4 sm:space-y-6">
					{/* Add Comment */}
					<Card>
						<CardHeader className="pb-3 sm:pb-6">
							<CardTitle className="text-base sm:text-lg">
								Add a Comment
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-3 sm:space-y-4">
								<Textarea
									placeholder="Share your thoughts, ask questions, or provide additional insights..."
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
								/>
								<div className="flex justify-end">
									<Button
										onClick={handleAddComment}
										disabled={!newComment.trim()}
										className="text-sm sm:text-base">
										Post Comment
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Comments would go here */}
				</TabsContent>

				<TabsContent value="related" className="space-y-3 sm:space-y-4">
					{question.relatedQuestions?.length > 0 ? (
						question.relatedQuestions.map((relatedQ) => (
							<Card
								key={relatedQ._id}
								className="hover:shadow-md transition-shadow cursor-pointer">
								<CardContent className="p-3 sm:p-6">
									<div className="flex items-center justify-between gap-3">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 sm:gap-3 mb-2">
												<Badge
													className={`${getDifficultyColor(
														relatedQ.difficulty
													)} text-xs sm:text-sm`}>
													{relatedQ.difficulty}
												</Badge>
											</div>
											<h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-base leading-tight truncate sm:whitespace-normal">
												{relatedQ.title}
											</h3>
										</div>
										<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
							No related questions found
						</p>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};