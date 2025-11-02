"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { questionService } from "@/services/questions/question-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithoutPagination,
} from "@/types/axios-response";
import { GetAllQuestionsResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import {
	BookOpen,
	ChevronRight,
	Clock,
	Eye,
	Heart,
	RefreshCw,
	Sparkles,
} from "lucide-react";
import React from "react";
import { useQuery } from "react-query";

interface RelatedQuestionsProps {
	questionId: string;
	onQuestionClick?: (questionSlug: string) => void;
}

export const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({
	questionId,
	onQuestionClick,
}) => {
	const {
		data: relatedData,
		isLoading,
		error,
		refetch,
	} = useQuery<
		AxiosResponseTypeWithoutPagination<{
			results: GetAllQuestionsResponseType[];
			total: number;
		}>,
		AxiosError<AxiosErrorResponseType>
	>(
		["relatedQuestions", questionId],
		() => questionService.getRelatedQuestions(questionId, 6),
		{
			enabled: !!questionId,
			staleTime: 1000 * 60 * 10, // 10 minutes
			cacheTime: 1000 * 60 * 30, // 30 minutes
		}
	);

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

	const handleQuestionClick = (question: GetAllQuestionsResponseType) => {
		if (onQuestionClick) {
			onQuestionClick(question.slug);
		} else {
			// Default navigation behavior
			window.location.href = `/questions/${question.slug}`;
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardContent className="p-4">
							<div className="flex items-center justify-between gap-3">
								<div className="flex-1 space-y-3">
									<div className="flex items-center gap-2">
										<div className="h-5 w-16 bg-gray-200 rounded" />
										<div className="h-4 w-20 bg-gray-200 rounded" />
									</div>
									<div className="h-5 w-full bg-gray-200 rounded" />
									<div className="flex items-center gap-4">
										<div className="h-4 w-12 bg-gray-200 rounded" />
										<div className="h-4 w-12 bg-gray-200 rounded" />
									</div>
								</div>
								<div className="h-5 w-5 bg-gray-200 rounded" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<div className="mb-4">
					<BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" />
					<p className="text-red-500 mb-2">Failed to load related questions</p>
					<p className="text-gray-500 text-sm">
						There was an error fetching related questions
					</p>
				</div>
				<Button variant="outline" size="sm" onClick={() => refetch()}>
					<RefreshCw className="h-4 w-4 mr-2" />
					Try Again
				</Button>
			</div>
		);
	}

	if (!relatedData?.data?.results || relatedData.data.results.length === 0) {
		return (
			<div className="text-center py-12">
				<Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
				<p className="text-gray-500 text-lg font-medium mb-2">
					No related questions found
				</p>
				<p className="text-gray-400 text-sm">
					We couldn&apos;t find any questions similar to this one
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<BookOpen className="h-5 w-5 text-blue-600" />
					<h3 className="text-lg font-semibold text-gray-900">
						Related Questions
					</h3>
					<Badge variant="secondary" className="text-xs">
						{relatedData.data.results.length}
					</Badge>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => refetch()}
					className="gap-2">
					<RefreshCw className="h-4 w-4" />
					Refresh
				</Button>
			</div>

			{relatedData.data.results.map((question) => (
				<Card
					key={question.id}
					className="hover:shadow-md transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-blue-500"
					onClick={() => handleQuestionClick(question)}>
					<CardContent className="p-4">
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								{/* Difficulty and Category */}
								<div className="flex items-center gap-2 mb-3">
									<Badge
										className={`${getDifficultyColor(
											question.difficulty
										)} text-xs font-medium`}>
										{question.difficulty}
									</Badge>
									{question.category && (
										<Badge variant="outline" className="text-xs">
											{question.category.name}
										</Badge>
									)}
								</div>

								{/* Title */}
								<h4
									className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight mb-3 overflow-hidden"
									style={{
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
									}}>
									{question.title}
								</h4>

								{/* Stats */}
								<div className="flex items-center gap-4 text-xs text-gray-500">
									<div className="flex items-center gap-1">
										<Eye className="h-3 w-3" />
										<span>{question.stats?.views || 0}</span>
									</div>
									<div className="flex items-center gap-1">
										<Heart className="h-3 w-3" />
										<span>{question.stats?.likes || 0}</span>
									</div>
									{question.timeLimit && (
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>{question.timeLimit}m</span>
										</div>
									)}
								</div>

								{/* Tags */}
								{question.tags && question.tags.length > 0 && (
									<div className="flex flex-wrap gap-1 mt-2">
										{question.tags.slice(0, 3).map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="text-xs px-2 py-0.5">
												{tag}
											</Badge>
										))}
										{question.tags.length > 3 && (
											<Badge
												variant="secondary"
												className="text-xs px-2 py-0.5">
												+{question.tags.length - 3}
											</Badge>
										)}
									</div>
								)}
							</div>

							<ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
						</div>
					</CardContent>
				</Card>
			))}

			{/* Show more button if there might be more questions */}
			{relatedData.data.results.length >= 6 && (
				<div className="text-center pt-4">
					<Button variant="outline" size="sm" onClick={() => refetch()}>
						<RefreshCw className="h-4 w-4 mr-2" />
						Load More
					</Button>
				</div>
			)}
		</div>
	);
};
