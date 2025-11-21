"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClusterData } from "@/context/clusterData-context";
import { questionService } from "@/services/questions/question-services";
import { GetAllQuestionsResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { Clock, ThumbsUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
	question: GetAllQuestionsResponseType;
};

const getDifficultyColor = (difficulty: string) => {
	const colors: Record<string, string> = {
		Easy: "bg-green-100 text-green-800 border-green-200",
		Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
		Hard: "bg-red-100 text-red-800 border-red-200",
	};
	return colors[difficulty] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const QuestionCard: React.FC<Props> = ({ question }) => {
	const { userData } = useClusterData();
	const router = useRouter();

	const handleCardClick = (question: GetAllQuestionsResponseType) => {
		const questionCategory =
			question.category?.name?.toLowerCase() || "general";
		router.push(`/questions/${questionCategory}/${question.slug}`);
	};

	const handleEditClick = (e: React.MouseEvent, questionId: string) => {
		e.stopPropagation(); // Prevent card click
		router.push(`/questions/edit/${questionId}`);
	};

	const handleDeleteClick = async (e: React.MouseEvent, questionId: string) => {
		e.stopPropagation(); // Prevent card click
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this question? This action cannot be undone."
		);
		if (confirmDelete) {
			await questionService.deleteQuestion(questionId);
			router.refresh(); // Refresh the page to reflect the deletion
		}
	};

	const handleDropdownTriggerClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent card click when opening dropdown
	};

	return (
		<Card
			key={question.id}
			onClick={() => handleCardClick(question)}
			className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-gray-300 cursor-pointer group bg-white hover:bg-gray-50 z-10">
			<CardContent className="">
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
								<ThumbsUp className="h-4 w-4 text-yellow-500" />
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
									{new Date(question.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								{question.author?.avatar && (
									<img
										src={question.author.avatar}
										alt={question.author.name}
										className="h-6 w-6 rounded-full"
									/>
								)}
								<span className="text-sm text-gray-500">
									by {question.author?.name}
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-center gap-2 justify-between h-full">
						{question?.author?.id === userData?._id && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										onClick={handleDropdownTriggerClick}
										className="h-8 w-8 p-0">
										•••
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									onClick={(e) => e.stopPropagation()}>
									<DropdownMenuItem
										onClick={(e) => handleEditClick(e, question.id)}>
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-red-400"
										onClick={(e) => handleDeleteClick(e, question.id)}>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
				{question.status === "published" ? (
					<Badge className="text-xs bg-green-100 text-green-800 border-green-200 flex justify-self-end self-end ">
						Published
					</Badge>
				) : (
					<Badge
						variant="outline"
						className="text-xs bg-gray-100 text-gray-500 border-gray-200 flex justify-self-end self-end">
						Draft
					</Badge>
				)}
			</CardContent>
		</Card>
	);
};
