"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { questionService } from "@/services/questions/question-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import { CommentType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { CommentStats } from "./CommentStats";

interface CommentSectionProps {
	questionId: string;
}

type SortOption = "newest" | "oldest" | "most-liked";

export const CommentSection: React.FC<CommentSectionProps> = ({
	questionId,
}) => {
	const queryClient = useQueryClient();
	const [sortBy, setSortBy] = React.useState<SortOption>("newest");

	// Get comments data for stats
	const { data: comments } = useQuery<
		AxiosResponseTypeWithPagination<CommentType[]>,
		AxiosError<AxiosErrorResponseType>
	>(
		["comments", questionId],
		() => questionService.getCommentsOfQuestion(questionId),
		{
			enabled: !!questionId,
			staleTime: 1000 * 60 * 2,
			cacheTime: 1000 * 60 * 10,
		}
	);

	const commentsData = comments;
	// Add comment mutation
	const { mutate: addCommentMutate, isLoading: isAddingComment } = useMutation<
		any,
		AxiosError<AxiosErrorResponseType>,
		{ questionId: string; content: string; parentComment?: string | null }
	>((data) => questionService.addCommentToQuestions(data), {
		onSuccess: (response) => {
			// Immediately invalidate and refetch comments
			queryClient.invalidateQueries(["comments", questionId]);

			// Force a refetch to ensure the new comment appears immediately
			queryClient.refetchQueries(["comments", questionId]);
		},
		onError: (error) => {
			console.error("Error adding comment:", error);
			// You could add a toast notification here
		},
	});

	// Reply to comment function
	const handleReply = async (
		parentId: string,
		content: string
	): Promise<void> => {
		return new Promise<void>((resolve, reject) => {
			addCommentMutate(
				{
					questionId,
					content,
					parentComment: parentId,
				},
				{
					onSuccess: () => resolve(),
					onError: (err) => reject(err),
				}
			);
		});
	};

	// Add new comment function
	const handleAddComment = async (content: string): Promise<void> => {
		return new Promise<void>((resolve, reject) => {
			addCommentMutate(
				{
					questionId,
					content,
				},
				{
					onSuccess: () => resolve(),
					onError: (err) => reject(err),
				}
			);
		});
	};

	const getSortLabel = (sort: SortOption) => {
		switch (sort) {
			case "newest":
				return "Newest First";
			case "oldest":
				return "Oldest First";
			case "most-liked":
				return "Most Liked";
			default:
				return "Newest First";
		}
	};

	return (
		<div className="bg-white rounded-lg">
			{/* Section Header */}
			<div className="px-6 border-b bg-gray-50 rounded-t-lg">
				<div className="flex items-center justify-between">
					{/* Comment Stats and Sort Dropdown */}
					{commentsData?.data?.results &&
						commentsData.data.results.length > 0 && (
							<>
								<div className="mt-3">
									<CommentStats comments={commentsData.data.results} />
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm" className="gap-2">
											<ArrowUpDown className="h-4 w-4" />
											{getSortLabel(sortBy)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => setSortBy("newest")}>
											Newest First
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setSortBy("oldest")}>
											Oldest First
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setSortBy("most-liked")}>
											Most Liked
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						)}
				</div>
			</div>

			{/* Comment Form */}
			<div className="px-6 py-4 border-b bg-white">
				<CommentForm
					onSubmit={handleAddComment}
					isSubmitting={isAddingComment}
					showCard={false}
				/>
			</div>

			{/* Comments List */}
			<div className="px-6 py-4">
				<CommentList
					questionId={questionId}
					onReply={handleReply}
					sortBy={sortBy}
					showHeader={false}
				/>
			</div>
		</div>
	);
};
