"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/context/theme.context";
import { questionService } from "@/services/questions/question-services";
import { GetSingleQuestionResponseType } from "@/types/interfaces/questions/getQuestion-type";
import {
	AlertCircle,
	ArrowLeft,
	Building2,
	Calendar,
	CheckCircle,
	Clock,
	MessageSquare,
	Tag,
	User,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QuestionReviewDetailProps {
	questionId: string;
}

export function QuestionReviewDetail({
	questionId,
}: QuestionReviewDetailProps) {
	const router = useRouter();
	const [question, setQuestion] =
		useState<GetSingleQuestionResponseType | null>(null);
	const [loading, setLoading] = useState(true);
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [showApproveDialog, setShowApproveDialog] = useState(false);
	const [showRejectDialog, setShowRejectDialog] = useState(false);
	const { toast } = useTheme();

	useEffect(() => {
		fetchQuestion();
	}, [questionId]);

	const fetchQuestion = async () => {
		try {
			setLoading(true);
			const response = await questionService.getQuestionForReview(questionId);
			setQuestion(response.data);
		} catch (error) {
			console.error("Error fetching question:", error);
			toast.error("Failed to load question details");
		} finally {
			setLoading(false);
		}
	};

	const handleAddComment = async () => {
		if (!comment.trim()) {
			toast.error("Please enter a comment");
			return;
		}

		try {
			setSubmitting(true);
			await questionService.addReviewComment(questionId, comment);
			toast.success("Comment added successfully");
			setComment("");
			fetchQuestion();
		} catch (error) {
			console.error("Error adding comment:", error);
			toast.error("Failed to add comment");
		} finally {
			setSubmitting(false);
		}
	};

	const handleApprove = async () => {
		try {
			setSubmitting(true);
			await questionService.updateQuestionReviewStatus(
				questionId,
				"approved",
				comment.trim() || undefined
			);
			toast.success("Question approved successfully");
			router.push("/admin-review");
		} catch (error) {
			console.error("Error approving question:", error);
			toast.error("Failed to approve question");
			setSubmitting(false);
		}
	};

	const handleReject = async () => {
		if (!comment.trim()) {
			toast.error("Please provide a reason for rejection");
			return;
		}

		try {
			setSubmitting(true);
			await questionService.updateQuestionReviewStatus(
				questionId,
				"rejected",
				comment
			);
			toast.success("Question rejected");
			router.push("/admin-review");
		} catch (error) {
			console.error("Error rejecting question:", error);
			toast.error("Failed to reject question");
			setSubmitting(false);
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty?.toLowerCase()) {
			case "easy":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "hard":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
						<Clock className="w-3 h-3 mr-1" />
						Pending
					</Badge>
				);
			case "in_review":
				return (
					<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
						<AlertCircle className="w-3 h-3 mr-1" />
						In Review
					</Badge>
				);
			case "approved":
				return (
					<Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
						<CheckCircle className="w-3 h-3 mr-1" />
						Approved
					</Badge>
				);
			case "rejected":
				return (
					<Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
						<XCircle className="w-3 h-3 mr-1" />
						Rejected
					</Badge>
				);
			default:
				return null;
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-64 w-full" />
				<Skeleton className="h-48 w-full" />
			</div>
		);
	}

	if (!question) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center space-y-4">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
					<h2 className="text-2xl font-bold">Question Not Found</h2>
					<Link href="/admin-review">
						<Button>Back to Dashboard</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Link href="/admin-review">
					<Button variant="ghost" className="gap-2">
						<ArrowLeft className="w-4 h-4" />
						Back to Dashboard
					</Button>
				</Link>
				<div className="flex items-center gap-2">
					{getStatusBadge((question as any).reviewStatus)}
				</div>
			</div>

			{/* Question Details */}
			<Card>
				<CardHeader>
					<div className="space-y-4">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<CardTitle className="text-2xl">{question.title}</CardTitle>
								<div className="flex items-center gap-2 mt-2">
									<Badge className={getDifficultyColor(question.difficulty)}>
										{question.difficulty}
									</Badge>
									{question.category && (
										<Badge variant="outline">{question.category.name}</Badge>
									)}
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
							<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
								<User className="w-4 h-4" />
								<span>
									By {question.author?.name} (@{question.author?.username})
								</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
								<Calendar className="w-4 h-4" />
								<span>{new Date(question.createdAt).toLocaleDateString()}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
								<Clock className="w-4 h-4" />
								<span>{question.timeLimit} minutes</span>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Content */}
					{question.content && (
						<div>
							<h3 className="text-lg font-semibold mb-2">Question Content</h3>
							<div
								className="prose dark:prose-invert max-w-none"
								dangerouslySetInnerHTML={{ __html: question.content }}
							/>
						</div>
					)}

					{/* Answer */}
					{question.richAnswer && (
						<div>
							<h3 className="text-lg font-semibold mb-2">Answer</h3>
							<div
								className="prose dark:prose-invert max-w-none"
								dangerouslySetInnerHTML={{ __html: question.richAnswer }}
							/>
						</div>
					)}

					{/* Tags */}
					{question.tags && question.tags.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
								<Tag className="w-4 h-4" />
								Tags
							</h3>
							<div className="flex flex-wrap gap-2">
								{question.tags.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Companies */}
					{question.companies && question.companies.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
								<Building2 className="w-4 h-4" />
								Companies
							</h3>
							<div className="flex flex-wrap gap-2">
								{question.companies.map((company) => (
									<Badge key={company.id} variant="outline">
										{company.name}
										{company.frequency > 1 && (
											<span className="ml-1 text-xs">
												({company.frequency}x)
											</span>
										)}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Solutions */}
					{question.solutions && question.solutions.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-2">Solutions</h3>
							<div className="space-y-4">
								{question.solutions.map((solution) => (
									<Card key={solution.id}>
										<CardHeader>
											<CardTitle className="text-base">
												{solution.title}
											</CardTitle>
											<Badge variant="outline" className="w-fit">
												{solution.language}
											</Badge>
										</CardHeader>
										<CardContent className="space-y-2">
											<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
												<code>{solution.code}</code>
											</pre>
											{solution.explanation && (
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{solution.explanation}
												</p>
											)}
											{(solution.timeComplexity ||
												solution.spaceComplexity) && (
												<div className="flex gap-4 text-sm">
													{solution.timeComplexity && (
														<span>Time: {solution.timeComplexity}</span>
													)}
													{solution.spaceComplexity && (
														<span>Space: {solution.spaceComplexity}</span>
													)}
												</div>
											)}
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					)}

					{/* Hints */}
					{question.hints && question.hints.length > 0 && (
						<div>
							<h3 className="text-lg font-semibold mb-2">Hints</h3>
							<div className="space-y-2">
								{question.hints
									.sort((a, b) => a.order - b.order)
									.map((hint) => (
										<Card key={hint.id}>
											<CardContent className="p-4">
												<div className="flex items-start gap-2">
													<Badge variant="outline" className="mt-0.5">
														{hint.order}
													</Badge>
													<p className="text-sm">{hint.content}</p>
												</div>
											</CardContent>
										</Card>
									))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Review Comments */}
			{(question as any).reviewComments &&
				(question as any).reviewComments.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<MessageSquare className="w-5 h-5" />
								Review Comments
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{(question as any).reviewComments.map((reviewComment: any) => (
								<div
									key={reviewComment._id}
									className="border-l-2 border-blue-500 pl-4 py-2">
									<div className="flex items-center gap-2 mb-1">
										<span className="font-semibold">
											{reviewComment.reviewer?.name}
										</span>
										<span className="text-sm text-gray-500">
											{new Date(reviewComment.date).toLocaleString()}
										</span>
									</div>
									<p className="text-gray-700 dark:text-gray-300">
										{reviewComment.comment}
									</p>
								</div>
							))}
						</CardContent>
					</Card>
				)}

			{/* Review Actions */}
			{(question as any).reviewStatus !== "approved" &&
				(question as any).reviewStatus !== "rejected" && (
					<Card>
						<CardHeader>
							<CardTitle>Review Action</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="text-sm font-medium mb-2 block">
									Add Comment (Required for rejection)
								</label>
								<Textarea
									placeholder="Add your review comments here..."
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									rows={4}
									className="w-full"
								/>
							</div>

							<div className="flex gap-4">
								<Button
									onClick={handleAddComment}
									variant="outline"
									disabled={!comment.trim() || submitting}
									className="flex-1">
									<MessageSquare className="w-4 h-4 mr-2" />
									Add Comment Only
								</Button>

								<Button
									onClick={() => setShowApproveDialog(true)}
									disabled={submitting}
									className="flex-1 bg-green-600 hover:bg-green-700">
									<CheckCircle className="w-4 h-4 mr-2" />
									Approve
								</Button>

								<Button
									onClick={() => setShowRejectDialog(true)}
									disabled={submitting}
									variant="destructive"
									className="flex-1">
									<XCircle className="w-4 h-4 mr-2" />
									Reject
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

			{/* Approve Dialog */}
			<AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Approve Question</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to approve this question? It will be
							published and visible to all users.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleApprove} disabled={submitting}>
							{submitting ? "Approving..." : "Approve"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Reject Dialog */}
			<AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Reject Question</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to reject this question? Please ensure you
							have provided a reason in the comment field above.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleReject}
							disabled={!comment.trim() || submitting}
							className="bg-red-600 hover:bg-red-700">
							{submitting ? "Rejecting..." : "Reject"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
