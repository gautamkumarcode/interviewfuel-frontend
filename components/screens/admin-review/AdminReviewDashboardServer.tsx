import { fetchAdminReviewData } from "@/app/actions/questoins";
import { AdminOnly } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertCircle,
	CheckCircle,
	Clock,
	Eye,
	FileText,
	TrendingUp,
	XCircle,
} from "lucide-react";
import Link from "next/link";

export default async function AdminReviewDashboard() {
	const { stats, pendingQuestions, inReviewQuestions } =
		await fetchAdminReviewData();

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

	return (
		<AdminOnly
			fallback={
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="text-center space-y-4">
						<AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Access Denied
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							This page is only accessible to administrators.
						</p>
					</div>
				</div>
			}>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
							Question Review Dashboard
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-1">
							Manage and review submitted questions
						</p>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Pending Review
							</CardTitle>
							<Clock className="h-4 w-4 text-orange-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats?.statistics?.pending || 0}
							</div>
							<p className="text-xs text-muted-foreground">
								Awaiting initial review
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">In Review</CardTitle>
							<Eye className="h-4 w-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats?.statistics?.inReview || 0}
							</div>
							<p className="text-xs text-muted-foreground">
								Currently being reviewed
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Approved</CardTitle>
							<CheckCircle className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats?.statistics?.approved || 0}
							</div>
							<p className="text-xs text-muted-foreground">Total approved</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Approval Rate
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-purple-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats?.statistics?.approvalRate || 0}%
							</div>
							<p className="text-xs text-muted-foreground">Success rate</p>
						</CardContent>
					</Card>
				</div>

				{/* Questions List */}
				<Tabs defaultValue="pending" className="space-y-4">
					<TabsList>
						<TabsTrigger value="pending">
							Pending ({pendingQuestions.length})
						</TabsTrigger>
						<TabsTrigger value="in_review">
							In Review ({inReviewQuestions.length})
						</TabsTrigger>
						<TabsTrigger value="recent">Recent Reviews</TabsTrigger>
					</TabsList>

					<TabsContent value="pending" className="space-y-4">
						{pendingQuestions.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<FileText className="h-12 w-12 text-gray-400 mb-4" />
									<p className="text-gray-600 dark:text-gray-400">
										No pending questions to review
									</p>
								</CardContent>
							</Card>
						) : (
							pendingQuestions.map((question) => (
								<Card
									key={question.id}
									className="hover:shadow-md transition-shadow">
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
														{question.title}
													</h3>
													<Badge
														className={getDifficultyColor(question.difficulty)}>
														{question.difficulty}
													</Badge>
												</div>
												<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
													<span>By {question.author?.name}</span>
													<span>•</span>
													<span>
														{new Date(question.createdAt).toLocaleDateString()}
													</span>
													{question.category && (
														<>
															<span>•</span>
															<span>{question.category.name}</span>
														</>
													)}
												</div>
												{question.tags && question.tags.length > 0 && (
													<div className="flex flex-wrap gap-2 mt-2">
														{question.tags.slice(0, 5).map((tag) => (
															<Badge key={tag} variant="outline">
																{tag}
															</Badge>
														))}
													</div>
												)}
											</div>
											<Link href={`/admin-review/${question.id}`}>
												<Button>Review</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</TabsContent>

					<TabsContent value="in_review" className="space-y-4">
						{inReviewQuestions.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<Eye className="h-12 w-12 text-gray-400 mb-4" />
									<p className="text-gray-600 dark:text-gray-400">
										No questions currently in review
									</p>
								</CardContent>
							</Card>
						) : (
							inReviewQuestions.map((question) => (
								<Card
									key={question.id}
									className="hover:shadow-md transition-shadow">
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
														{question.title}
													</h3>
													<Badge
														className={getDifficultyColor(question.difficulty)}>
														{question.difficulty}
													</Badge>
												</div>
												<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
													<span>By {question.author?.name}</span>
													<span>•</span>
													<span>
														{new Date(question.createdAt).toLocaleDateString()}
													</span>
													{question.category && (
														<>
															<span>•</span>
															<span>{question.category.name}</span>
														</>
													)}
												</div>
												{question.tags && question.tags.length > 0 && (
													<div className="flex flex-wrap gap-2 mt-2">
														{question.tags.slice(0, 5).map((tag) => (
															<Badge key={tag} variant="outline">
																{tag}
															</Badge>
														))}
													</div>
												)}
											</div>
											<Link href={`/admin-review/${question.id}`}>
												<Button variant="outline">Continue Review</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</TabsContent>

					<TabsContent value="recent" className="space-y-4">
						{!stats?.recentReviews || stats.recentReviews.length === 0 ? (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
									<p className="text-gray-600 dark:text-gray-400">
										No recent reviews
									</p>
								</CardContent>
							</Card>
						) : (
							stats.recentReviews.map((question: any) => (
								<Card
									key={question.id}
									className="hover:shadow-md transition-shadow">
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
														{question.title}
													</h3>
													{question.reviewStatus === "approved" ? (
														<Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
															<CheckCircle className="w-3 h-3 mr-1" />
															Approved
														</Badge>
													) : (
														<Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
															<XCircle className="w-3 h-3 mr-1" />
															Rejected
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
													<span>By {question.author?.name}</span>
													<span>•</span>
													<span>
														Reviewed{" "}
														{new Date(
															question.lastReviewedAt
														).toLocaleDateString()}
													</span>
													{question.verifiedBy && (
														<>
															<span>•</span>
															<span>
																Reviewed by {question.verifiedBy.name}
															</span>
														</>
													)}
												</div>
											</div>
											<Link
												href={`/questions/${question.category.slug}/${question.slug}`}>
												<Button variant="outline">View Question</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</TabsContent>
				</Tabs>
			</div>
		</AdminOnly>
	);
}
