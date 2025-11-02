"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useClusterData } from "@/context/clusterData-context";
import { questionService } from "@/services/questions/question-services";
import { CommentType } from "@/types/interfaces/questions/getQuestion-type";
import {
	Edit3,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Reply,
	Trash2,
} from "lucide-react";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

const timeAgo = (isoDate?: string) => {
	if (!isoDate) return "";
	const d = new Date(isoDate);
	const now = new Date();
	const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
	if (diff < 60) return `${diff}s ago`;
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
	return new Date(isoDate).toLocaleDateString();
};

interface CommentItemProps {
	comment: CommentType;
	questionId: string;
	onReply: (parentId: string, content: string) => Promise<void>;
	replies: CommentType[];
	commentMap: Map<string, CommentType[]>;
	level?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
	comment,
	questionId,
	onReply,
	replies,
	commentMap,
	level = 0,
}) => {
	const { userData } = useClusterData();
	const queryClient = useQueryClient();

	const [isReplying, setIsReplying] = React.useState(false);
	const [isEditing, setIsEditing] = React.useState(false);
	const [replyContent, setReplyContent] = React.useState("");
	const [editContent, setEditContent] = React.useState(comment.content);
	const [isLiked, setIsLiked] = React.useState(
		comment.likes?.includes(userData?._id || "") || false
	);
	const [likesCount, setLikesCount] = React.useState(
		comment.likes?.length || 0
	);

	const isOwner = userData?._id === comment.author?._id;
	const maxLevel = 3;

	// Like comment mutation
	const { mutate: likeCommentMutate, isLoading: isLiking } = useMutation(
		() => questionService.likeComment(questionId, comment._id),
		{
			onMutate: async () => {
				// Cancel any outgoing refetches
				await queryClient.cancelQueries(["comments", questionId]);

				// Snapshot the previous value
				const previousComments = queryClient.getQueryData([
					"comments",
					questionId,
				]);

				// Optimistic update for local state
				const newIsLiked = !isLiked;
				const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;

				setIsLiked(newIsLiked);
				setLikesCount(newLikesCount);

				// Optimistically update the query data
				queryClient.setQueryData(["comments", questionId], (old: any) => {
					if (!old?.data?.results) return old;

					return {
						...old,
						data: {
							...old.data,
							results: old.data.results.map((c: any) => {
								if (c._id === comment._id) {
									const currentLikes = c.likes || [];
									const userId = userData?._id;

									if (newIsLiked && userId && !currentLikes.includes(userId)) {
										return { ...c, likes: [...currentLikes, userId] };
									} else if (!newIsLiked && userId) {
										return {
											...c,
											likes: currentLikes.filter((id: string) => id !== userId),
										};
									}
								}
								return c;
							}),
						},
					};
				});

				return {
					previousComments,
					previousIsLiked: isLiked,
					previousLikesCount: likesCount,
				};
			},
			onError: (error, variables, context) => {
				// Revert on error
				if (context) {
					setIsLiked(context.previousIsLiked);
					setLikesCount(context.previousLikesCount);

					if (context.previousComments) {
						queryClient.setQueryData(
							["comments", questionId],
							context.previousComments
						);
					}
				}
				console.error("Failed to like comment:", error);
			},
			onSettled: () => {
				// Refetch to ensure we have the latest data
				queryClient.invalidateQueries(["comments", questionId]);
			},
		}
	);

	// Edit comment mutation
	const { mutate: editCommentMutate, isLoading: isEditingComment } =
		useMutation(
			(content: string) =>
				questionService.editComment(questionId, comment._id, content),
			{
				onMutate: async (newContent) => {
					// Cancel any outgoing refetches
					await queryClient.cancelQueries(["comments", questionId]);

					// Snapshot the previous value
					const previousComments = queryClient.getQueryData([
						"comments",
						questionId,
					]);

					// Optimistically update to the new value
					queryClient.setQueryData(["comments", questionId], (old: any) => {
						if (!old?.data?.results) return old;

						return {
							...old,
							data: {
								...old.data,
								results: old.data.results.map((c: any) =>
									c._id === comment._id
										? { ...c, content: newContent, isEdited: true }
										: c
								),
							},
						};
					});

					return { previousComments };
				},
				onSuccess: () => {
					setIsEditing(false);
				},
				onError: (error, variables, context) => {
					// Revert the optimistic update on error
					if (context?.previousComments) {
						queryClient.setQueryData(
							["comments", questionId],
							context.previousComments
						);
					}
					console.error("Failed to edit comment:", error);
				},
				onSettled: () => {
					// Always refetch to ensure we have the latest data
					queryClient.invalidateQueries(["comments", questionId]);
				},
			}
		);

	// Delete comment mutation
	const { mutate: deleteCommentMutate, isLoading: isDeletingComment } =
		useMutation(() => questionService.deleteComment(questionId, comment._id), {
			onMutate: async () => {
				// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
				await queryClient.cancelQueries(["comments", questionId]);

				// Snapshot the previous value
				const previousComments = queryClient.getQueryData([
					"comments",
					questionId,
				]);

				// Optimistically update to the new value
				queryClient.setQueryData(["comments", questionId], (old: any) => {
					if (!old?.data?.results) return old;

					return {
						...old,
						data: {
							...old.data,
							results: old.data.results.map((c: any) =>
								c._id === comment._id ? { ...c, isDeleted: true } : c
							),
						},
					};
				});

				// Return a context object with the snapshotted value
				return { previousComments };
			},
			onError: (err, variables, context) => {
				// If the mutation fails, use the context returned from onMutate to roll back
				if (context?.previousComments) {
					queryClient.setQueryData(
						["comments", questionId],
						context.previousComments
					);
				}
				console.error("Failed to delete comment:", err);
			},
			onSettled: () => {
				// Always refetch after error or success to ensure we have the latest data
				queryClient.invalidateQueries(["comments", questionId]);
			},
		});

	const handleReply = async () => {
		if (!replyContent.trim()) return;

		try {
			await onReply(comment._id, replyContent);
			setReplyContent("");
			setIsReplying(false);
		} catch (error) {
			console.error("Failed to reply:", error);
		}
	};

	const handleEdit = () => {
		if (!editContent.trim() || editContent === comment.content) {
			setIsEditing(false);
			setEditContent(comment.content);
			return;
		}
		editCommentMutate(editContent);
	};

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this comment?")) {
			deleteCommentMutate();
		}
	};

	if (comment.isDeleted) {
		return (
			<div className={`${level > 0 ? "ml-6 sm:ml-8" : ""}`}>
				<Card className="shadow-none border border-dashed bg-gray-50">
					<CardContent className="py-4">
						<p className="text-gray-400 text-sm italic">
							This comment has been deleted
						</p>
					</CardContent>
				</Card>
				{/* Still show replies to deleted comments */}
				{replies.length > 0 && level < maxLevel && (
					<div className="mt-3 space-y-3">
						{replies.map((reply) => (
							<CommentItem
								key={reply._id}
								comment={reply}
								questionId={questionId}
								onReply={onReply}
								replies={commentMap.get(reply._id) || []}
								commentMap={commentMap}
								level={level + 1}
							/>
						))}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={`${level > 0 ? "ml-6 sm:ml-8" : ""}`}>
			<Card className="shadow-none border-l-2 border-l-transparent hover:border-l-blue-200 transition-colors">
				<CardHeader className="pb-2">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
								{comment.author?.name
									? comment.author.name.charAt(0).toUpperCase()
									: "U"}
							</div>
							<div>
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold text-gray-900">
										{comment.author?.name || "Anonymous User"}
									</span>
									{comment.isEdited && (
										<span className="text-xs text-gray-400">(edited)</span>
									)}
								</div>
								<div className="text-xs text-gray-500">
									{timeAgo(comment.createdAt)}
								</div>
							</div>
						</div>

						{isOwner && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => setIsEditing(true)}>
										<Edit3 className="h-4 w-4 mr-2" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleDelete}
										disabled={isDeletingComment}
										className="text-red-600 focus:text-red-600">
										<Trash2 className="h-4 w-4 mr-2" />
										{isDeletingComment ? "Deleting..." : "Delete"}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					{isEditing ? (
						<div className="space-y-3">
							<Textarea
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								className="min-h-[80px] text-sm resize-none"
							/>
							<div className="flex justify-end gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setIsEditing(false);
										setEditContent(comment.content);
									}}>
									Cancel
								</Button>
								<Button
									size="sm"
									onClick={handleEdit}
									disabled={!editContent.trim() || isEditingComment}>
									{isEditingComment ? "Saving..." : "Save"}
								</Button>
							</div>
						</div>
					) : (
						<>
							<p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
								{comment.content}
							</p>

							<div className="flex items-center gap-4">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => likeCommentMutate()}
									disabled={isLiking}
									className={`gap-1 h-8 px-2 ${
										isLiked
											? "text-red-600 hover:text-red-700"
											: "text-gray-500"
									}`}>
									<Heart
										className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
									/>
									<span className="text-xs">{likesCount}</span>
								</Button>

								{level < maxLevel && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsReplying(!isReplying)}
										className="gap-1 h-8 px-2 text-gray-500">
										<Reply className="h-4 w-4" />
										<span className="text-xs">Reply</span>
									</Button>
								)}

								{replies.length > 0 && (
									<div className="flex items-center gap-1 text-xs text-gray-500">
										<MessageCircle className="h-3 w-3" />
										<span>
											{replies.length}{" "}
											{replies.length === 1 ? "reply" : "replies"}
										</span>
									</div>
								)}
							</div>

							{/* Reply Form */}
							{isReplying && (
								<div className="mt-4 space-y-3">
									<Textarea
										value={replyContent}
										onChange={(e) => setReplyContent(e.target.value)}
										placeholder={`Reply to ${
											comment.author?.name || "this comment"
										}...`}
										className="min-h-[80px] text-sm resize-none"
									/>
									<div className="flex justify-end gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setIsReplying(false);
												setReplyContent("");
											}}>
											Cancel
										</Button>
										<Button
											size="sm"
											onClick={handleReply}
											disabled={!replyContent.trim()}>
											Reply
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Nested Replies */}
			{level < maxLevel && replies.length > 0 && (
				<div className="mt-3 space-y-3">
					{replies.map((reply) => {
						const nestedReplies = commentMap.get(reply._id) || [];
						return (
							<CommentItem
								key={reply._id}
								comment={reply}
								questionId={questionId}
								onReply={onReply}
								replies={nestedReplies}
								commentMap={commentMap}
								level={level + 1}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
