"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { practiceServices } from "@/services/practiceservices/practice-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import { AxiosError } from "axios";
import {
	AlertCircle,
	ArrowLeft,
	Award,
	Calendar,
	CheckCircle,
	Clock,
	FileText,
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "react-query";
import { GetUserSessionsResponse } from "../types";


const History = () => {
	const { data, isLoading, isFetching, error } = useQuery<
		AxiosResponseTypeWithPagination<GetUserSessionsResponse[]>,
		AxiosError<AxiosErrorResponseType>
	>(["allsessions"], () => practiceServices.getUserSessions(1), {
		staleTime: 1000 * 60 * 5,
		cacheTime: 1000 * 60 * 10,
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		retry: (failureCount, error) => {
			if (
				error?.response?.status &&
				error.response.status >= 400 &&
				error.response.status < 500
			) {
				return false;
			}
			return failureCount < 2;
		},
	});

	const sessions = data?.data.results || [];

	// Helper functions
	const formatDate = (dateString: Date) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			return `${hours}h ${minutes % 60}m`;
		}
		return `${minutes}m`;
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "bg-green-100 text-green-800 border-green-200";
			case "active":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "paused":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getAccuracyColor = (accuracy: number) => {
		if (accuracy >= 80) return "text-green-600";
		if (accuracy >= 60) return "text-yellow-600";
		return "text-red-600";
	};

	if (isLoading) {
		return (
			<div className="max-w-6xl mx-auto p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading your practice history...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-6xl mx-auto p-6">
				<div className="flex items-center gap-4 mb-6">
					<Link href="/practice">
						<Button variant="outline" size="sm">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Practice
						</Button>
					</Link>
					<h1 className="text-2xl font-bold">Practice History</h1>
				</div>

				<Card className="p-6 text-center">
					<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<h3 className="text-lg font-medium mb-2 text-red-600">
						Failed to Load History
					</h3>
					<p className="text-gray-600 mb-4">
						Unable to fetch your practice sessions. Please try again later.
					</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<Link href="/practice">
						<Button variant="outline" size="sm">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Practice
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
							<Calendar className="h-8 w-8 text-blue-600" />
							Practice History
						</h1>
						<p className="text-gray-600 mt-1">
							Track your progress and review past sessions
						</p>
					</div>
				</div>

				{sessions?.length > 0 && (
					<div className="text-right">
						<p className="text-2xl font-bold text-blue-600">
							{sessions.length}
						</p>
						<p className="text-sm text-gray-500">Total Sessions</p>
					</div>
				)}
			</div>

			{/* Stats Overview */}
			{sessions.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Target className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Total Questions</p>
									<p className="text-xl font-bold">
										{sessions.reduce(
											(sum, session) =>
												sum + (session.results?.totalQuestions || 0),
											0
										)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-lg">
									<CheckCircle className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Answered</p>
									<p className="text-xl font-bold">
										{sessions.reduce(
											(sum, session) =>
												sum + (session.results?.answeredQuestions || 0),
											0
										)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<TrendingUp className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Avg Accuracy</p>
									<p className="text-xl font-bold">
										{sessions.length > 0
											? Math.round(
													sessions.reduce(
														(sum, session) =>
															sum + (session.results?.accuracy || 0),
														0
													) / sessions.length
											  )
											: 0}
										%
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-orange-100 rounded-lg">
									<Clock className="h-5 w-5 text-orange-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Total Time</p>
									<p className="text-xl font-bold">
										{formatDuration(
											sessions.reduce(
												(sum, session) =>
													sum + (session.results?.totalTimeSpent || 0),
												0
											)
										)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Sessions List */}
			{sessions.length === 0 ? (
				<Card className="p-8 text-center">
					<FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-xl font-medium mb-2">No Practice Sessions Yet</h3>
					<p className="text-gray-600 mb-6">
						Start practicing to see your session history and track your progress
						over time.
					</p>
					<Link href="/practice">
						<Button size="lg">
							<Award className="h-5 w-5 mr-2" />
							Start Practicing
						</Button>
					</Link>
				</Card>
			) : (
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Recent Sessions
					</h2>

					{sessions.map((session, index) => (
						<Card
							key={session._id}
							className="hover:shadow-md transition-shadow">
							<CardContent className="p-6">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-3">
											<h3 className="text-lg font-semibold text-gray-900">
												{session.title ||
													`Practice Session #${sessions.length - index}`}
											</h3>
											<Badge
												className={`${getStatusColor(session.status)} border`}>
												{session.status}
											</Badge>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-gray-400" />
												<span className="text-gray-600">
													{formatDate(session.startedAt)}
												</span>
											</div>

											<div className="flex items-center gap-2">
												<FileText className="h-4 w-4 text-gray-400" />
												<span className="text-gray-600">
													{session.results?.totalQuestions || 0} questions
												</span>
											</div>

											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-gray-400" />
												<span className="text-gray-600">
													{formatDuration(session.results?.totalTimeSpent || 0)}
												</span>
											</div>

											<div className="flex items-center gap-2">
												<Target className="h-4 w-4 text-gray-400" />
												<span className="text-gray-600">
													{session.settings?.difficulty || "Mixed"}
												</span>
											</div>
										</div>

										{/* Categories */}
										{session.settings?.categories &&
											session.settings.categories.length > 0 && (
												<div className="flex items-center gap-2 mt-3">
													<span className="text-xs text-gray-500">
														Categories:
													</span>
													<div className="flex gap-1 flex-wrap">
														{session.settings.categories.map(
															(category, idx) => (
																<Badge
																	key={idx}
																	variant="outline"
																	className="text-xs">
																	{category.name}
																</Badge>
															)
														)}
													</div>
												</div>
											)}
									</div>

									{/* Results Summary */}
									<div className="text-right ml-6">
										{session.results && (
											<div className="space-y-2">
												<div>
													<div
														className={`text-2xl font-bold ${getAccuracyColor(
															session.results.accuracy || 0
														)}`}>
														{Math.round(session.results.accuracy || 0)}%
													</div>
													<div className="text-xs text-gray-500">Accuracy</div>
												</div>

												<div>
													<div className="text-sm font-medium text-gray-700">
														{session.results.answeredQuestions}/
														{session.results.totalQuestions}
													</div>
													<div className="text-xs text-gray-500">Completed</div>
												</div>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Load More / Pagination could go here */}
			{isFetching && (
				<div className="text-center py-4">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
				</div>
			)}
		</div>
	);
};

export default History;
