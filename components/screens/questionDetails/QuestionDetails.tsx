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
		<div className="mx-auto">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" onClick={onBack} className="gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back to Questions
				</Button>
			</div>

			{/* Question Header */}
			<div className="mb-8">
				<div className="flex items-start justify-between gap-4 mb-4">
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-gray-900 mb-3">
							{question.title}
						</h1>

						<div className="flex flex-wrap items-center gap-3 mb-4">
							<Badge className={getDifficultyColor(question.difficulty)}>
								{question.difficulty}
							</Badge>
							<Badge variant="outline" className="gap-1">
								<Building className="h-3 w-3" />
								{question.companies?.length} companies
							</Badge>
							<Badge variant="outline" className="gap-1">
								<Tag className="h-3 w-3" />
								{question.subcategory}
							</Badge>
						</div>

						<div className="flex flex-wrap gap-2 mb-4">
							{question.tags?.map((tag) => (
								<Badge key={tag} variant="secondary" className="text-xs">
									{tag}
								</Badge>
							))}
						</div>

						<div className="flex items-center gap-6 text-sm text-gray-500">
							<div className="flex items-center gap-1">
								<Eye className="h-4 w-4" />
								<span>{question.stats?.views} views</span>
							</div>
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4" />
								<span>{question.stats?.likes} likes</span>
							</div>
							<div className="flex items-center gap-1">
								<Bookmark className="h-4 w-4" />
								<span>{question.stats?.bookmarks} bookmarks</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								<span>{new Date(question.createdAt).toLocaleDateString()}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant={isLiked ? "default" : "outline"}
							size="sm"
							onClick={() => setIsLiked(!isLiked)}
							className="gap-2">
							<ThumbsUp className="h-4 w-4" />
							Like
						</Button>
						<Button
							variant={isBookmarked ? "default" : "outline"}
							size="sm"
							onClick={() => setIsBookmarked(!isBookmarked)}
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

				<p className="text-gray-600 leading-relaxed">{question.content}</p>
			</div>

			{/* Companies */}
			{question.companies?.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Building className="h-5 w-5" />
							Asked by Companies
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{question.companies.map((company) => (
								<Badge
									key={company._id}
									variant="outline"
									className="px-3 py-1">
									{company.name}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Main Content */}
			<Tabs defaultValue="solution" className="mb-8">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="solution">Solution & Explanation</TabsTrigger>
					<TabsTrigger value="discussion">Discussion</TabsTrigger>
					<TabsTrigger value="related">Related Questions</TabsTrigger>
				</TabsList>

				<TabsContent value="solution" className="space-y-6">
					{/* Rich Answer Content */}
					{question.richAnswer && (
						<Card>
							<CardContent className="p-6">
								<div
									className="prose prose-gray max-w-none"
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
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="text-lg flex items-center gap-2">
												<Code2 className="h-5 w-5" />
												{solution.title || `Solution ${index + 1}`}
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
													: "Copy"}
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										{solution.code && (
											<div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
												<pre className="text-sm text-gray-100">
													<code>{solution.code}</code>
												</pre>
											</div>
										)}
										{solution.explanation && (
											<p className="text-gray-600 leading-relaxed">
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
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Star className="h-5 w-5" />
									Best Practices
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{question.bestPractices.map((practice, index) => (
										<li key={index} className="flex items-start gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
											<span className="text-gray-700">{practice}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}

					{/* Hints */}
					{question.hints?.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Zap className="h-5 w-5" />
									Hints
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{question.hints.map((hint, index) => (
										<li key={index} className="flex items-start gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
											<span className="text-gray-700">{hint.content}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="discussion" className="space-y-6">
					{/* Add Comment */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Add a Comment</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Textarea
									placeholder="Share your thoughts, ask questions, or provide additional insights..."
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									className="min-h-[100px]"
								/>
								<div className="flex justify-end">
									<Button
										onClick={handleAddComment}
										disabled={!newComment.trim()}>
										Post Comment
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Comments would go here */}
				</TabsContent>

				<TabsContent value="related" className="space-y-4">
					{question.relatedQuestions?.length > 0 ? (
						question.relatedQuestions.map((relatedQ) => (
							<Card
								key={relatedQ._id}
								className="hover:shadow-md transition-shadow cursor-pointer">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<Badge
													className={getDifficultyColor(relatedQ.difficulty)}>
													{relatedQ.difficulty}
												</Badge>
											</div>
											<h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
												{relatedQ.title}
											</h3>
										</div>
										<ChevronRight className="h-5 w-5 text-gray-400" />
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<p className="text-gray-500 text-center py-4">
							No related questions found
						</p>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};