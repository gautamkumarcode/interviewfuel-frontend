"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useClusterData } from "@/context/clusterData-context";
import { MessageSquare, Send } from "lucide-react";
import React from "react";

interface CommentFormProps {
	onSubmit: (content: string) => Promise<void>;
	isSubmitting?: boolean;
	placeholder?: string;
	title?: string;
	showCard?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
	onSubmit,
	isSubmitting = false,
	placeholder = "Share your thoughts, ask questions, or provide additional insights...",
	title = "Add a Comment",
	showCard = true,
}) => {
	const { userData } = useClusterData();
	const [content, setContent] = React.useState("");
	const [isFocused, setIsFocused] = React.useState(false);

	const handleSubmit = async () => {
		if (!content.trim()) return;

		try {
			await onSubmit(content);
			setContent("");
			setIsFocused(false);
		} catch (error) {
			console.error("Failed to submit comment:", error);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			handleSubmit();
		}
	};

	if (!userData) {
		const notSignedInContent = (
			<div className="py-8 text-center">
				<MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-3" />
				<p className="text-gray-500 mb-2">Join the discussion</p>
				<p className="text-gray-400 text-sm">
					Please sign in to add comments and participate in the discussion
				</p>
			</div>
		);

		return showCard ? (
			<Card className="border-dashed">
				<CardContent>{notSignedInContent}</CardContent>
			</Card>
		) : (
			<div className="border-dashed border-2 rounded-lg">
				{notSignedInContent}
			</div>
		);
	}

	const formContent = (
		<div className="space-y-4">
			{showCard && (
				<div className="flex items-center gap-2 mb-4">
					<MessageSquare className="h-5 w-5" />
					<h4 className="text-base font-medium">{title}</h4>
				</div>
			)}
			<div className="flex items-start gap-3">
				<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
					{userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
				</div>
				<div className="flex-1">
					<Textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className="min-h-[100px] text-sm resize-none border-gray-200 focus:border-blue-300"
						disabled={isSubmitting}
					/>
					{isFocused && (
						<p className="text-xs text-gray-500 mt-2">
							Press Ctrl+Enter to submit quickly
						</p>
					)}
				</div>
			</div>

			{(content.trim() || isFocused) && (
				<div className="flex justify-between items-center">
					<div className="text-xs text-gray-500">
						{content.length}/1000 characters
					</div>
					<div className="flex gap-2">
						{content.trim() && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setContent("");
									setIsFocused(false);
								}}
								disabled={isSubmitting}>
								Cancel
							</Button>
						)}
						<Button
							onClick={handleSubmit}
							disabled={
								!content.trim() || isSubmitting || content.length > 1000
							}
							size="sm"
							className="gap-2">
							<Send className="h-4 w-4" />
							{isSubmitting ? "Posting..." : "Post Comment"}
						</Button>
					</div>
				</div>
			)}
		</div>
	);

	return showCard ? (
		<Card
			className={`transition-all duration-200 ${
				isFocused ? "ring-2 ring-blue-500 ring-opacity-20" : ""
			}`}>
			<CardContent className="pt-6">{formContent}</CardContent>
		</Card>
	) : (
		<div
			className={`transition-all duration-200 ${
				isFocused ? "ring-2 ring-blue-500 ring-opacity-20 rounded-lg p-1" : ""
			}`}>
			{formContent}
		</div>
	);
};
