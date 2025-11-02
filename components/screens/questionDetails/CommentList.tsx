"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { questionService } from "@/services/questions/question-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import { CommentType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import { MessageCircle } from "lucide-react";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { CommentItem } from "./CommentItem";

type SortOption = "newest" | "oldest" | "most-liked";

export const CommentList: React.FC<{
	questionId: string;
	onReply: (parentId: string, content: string) => Promise<void>;
	sortBy?: SortOption;
	showHeader?: boolean;
}> = ({ questionId, onReply, sortBy = "newest", showHeader = true }) => {
	const queryClient = useQueryClient();

	const {
		data: commentsData,
		isLoading: commentsLoading,
		error,
	} = useQuery<
		AxiosResponseTypeWithPagination<CommentType[]>,
		AxiosError<AxiosErrorResponseType>
	>(
		["comments", questionId],
		() => questionService.getCommentsOfQuestion(questionId),
		{
			enabled: !!questionId,
			staleTime: 1000 * 60 * 2, // 2 minutes
			cacheTime: 1000 * 60 * 10, // 10 minutes
			keepPreviousData: true,
			refetchOnWindowFocus: false,
		}
	);

	// Sort comments based on selected option
	const sortComments = (
		comments: CommentType[],
		sortOption: SortOption
	): CommentType[] => {
		const sorted = [...comments];
		switch (sortOption) {
			case "newest":
				return sorted.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case "oldest":
				return sorted.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			case "most-liked":
				return sorted.sort(
					(a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
				);
			default:
				return sorted;
		}
	};

	// Organize comments into parent-child structure
	const organizeComments = (comments: CommentType[]) => {
		const parentComments = sortComments(
			comments.filter((c) => !c.parentComment),
			sortBy
		);
		const childComments = comments.filter((c) => c.parentComment);

		const commentMap = new Map<string, CommentType[]>();

		childComments.forEach((child) => {
			const parentId = child.parentComment!;
			if (!commentMap.has(parentId)) {
				commentMap.set(parentId, []);
			}
			commentMap.get(parentId)!.push(child);
		});

		// Sort replies as well
		commentMap.forEach((replies, parentId) => {
			commentMap.set(parentId, sortComments(replies, sortBy));
		});

		return { parentComments, commentMap };
	};

	if (commentsLoading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<Card key={i} className="shadow-none border animate-pulse">
						<CardHeader className="pb-2">
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 rounded-full bg-gray-200" />
								<div className="space-y-1">
									<div className="h-4 w-24 bg-gray-200 rounded" />
									<div className="h-3 w-16 bg-gray-200 rounded" />
								</div>
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="space-y-2">
								<div className="h-4 w-full bg-gray-200 rounded" />
								<div className="h-4 w-3/4 bg-gray-200 rounded" />
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
				<p className="text-red-500 mb-2">Failed to load comments</p>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						queryClient.invalidateQueries(["comments", questionId])
					}>
					Try Again
				</Button>
			</div>
		);
	}

	if (!commentsData?.data?.results || commentsData.data.results.length === 0) {
		return (
			<div className="text-center py-12">
				<MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
				<p className="text-gray-500 text-lg font-medium mb-2">
					No comments yet
				</p>
				<p className="text-gray-400 text-sm">
					Be the first to share your thoughts on this question
				</p>
			</div>
		);
	}

	const { parentComments, commentMap } = organizeComments(
		commentsData.data.results
	);

	return (
		<div className="space-y-4">
			{showHeader && (
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold text-gray-900">
						{commentsData.data.results.length}{" "}
						{commentsData.data.results.length === 1 ? "Comment" : "Comments"}
					</h3>
				</div>
			)}

			{parentComments.map((comment) => (
				<CommentItem
					key={comment._id}
					comment={comment}
					questionId={questionId}
					onReply={onReply}
					replies={commentMap.get(comment._id) || []}
					commentMap={commentMap}
					level={0}
				/>
			))}
		</div>
	);
};

export default CommentList;
