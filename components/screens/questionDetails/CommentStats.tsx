"use client";

import { Badge } from "@/components/ui/badge";
import { CommentType } from "@/types/interfaces/questions/getQuestion-type";
import { Heart, MessageCircle, Users } from "lucide-react";
import React from "react";

interface CommentStatsProps {
	comments: CommentType[];
}

export const CommentStats: React.FC<CommentStatsProps> = ({ comments }) => {
	const totalComments = comments.length;
	const totalLikes = comments.reduce(
		(sum, comment) => sum + (comment.likes?.length || 0),
		0
	);
	const uniqueAuthors = new Set(
		comments.map((c) => c.author?._id).filter(Boolean)
	).size;
	const recentComments = comments.filter((c) => {
		const commentDate = new Date(c.createdAt);
		const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
		return commentDate > dayAgo;
	}).length;

	if (totalComments === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-3 py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
			<div className="flex items-center gap-2">
				<MessageCircle className="h-4 w-4 text-blue-600" />
				<span className="text-sm font-medium text-gray-700">
					{totalComments} {totalComments === 1 ? "comment" : "comments"}
				</span>
			</div>

			{totalLikes > 0 && (
				<div className="flex items-center gap-2">
					<Heart className="h-4 w-4 text-red-500" />
					<span className="text-sm text-gray-600">
						{totalLikes} {totalLikes === 1 ? "like" : "likes"}
					</span>
				</div>
			)}

			{uniqueAuthors > 1 && (
				<div className="flex items-center gap-2">
					<Users className="h-4 w-4 text-green-600" />
					<span className="text-sm text-gray-600">
						{uniqueAuthors} participants
					</span>
				</div>
			)}

			{recentComments > 0 && (
				<Badge variant="secondary" className="text-xs">
					{recentComments} recent
				</Badge>
			)}
		</div>
	);
};
