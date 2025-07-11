"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { questionService } from "@/services/questions/question-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import { GetAllQuestionsResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { AxiosError } from "axios";
import { ChevronRight, Clock, Star, TrendingUp, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";

export default function Questions() {
	const params = useParams();
	const router = useRouter();
	const category = params.category as string;

	const { data } = useQuery<
		AxiosResponseTypeWithPagination<GetAllQuestionsResponseType[]>,
		AxiosError<AxiosErrorResponseType>
	>(["allquestions"], () => questionService.getAllQuestions(), {
		staleTime: 1000 * 60 * 5,
		cacheTime: 1000 * 60 * 10,
		keepPreviousData: true,
	});

	const categoryName = category
		? category.charAt(0).toUpperCase() + category.slice(1)
		: "All";

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

	// Filter questions by category if category is specified, otherwise show all
	const filteredQuestions = category
		? data?.data?.results?.filter(
				(question) =>
					question.category?.name.toLowerCase() === category.toLowerCase()
		  )
		: data?.data?.results;

	return (
		<>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					{categoryName} Questions
				</h1>
				<p className="text-gray-600">
					Master {categoryName} concepts with targeted practice questions
				</p>
			</div>

			<div className="flex items-center gap-4 mb-6">
				<Button
					onClick={() => router.push("/practice")}
					className="gap-2 bg-green-600 hover:bg-green-700">
					<Clock className="h-4 w-4" />
					Practice {categoryName}
				</Button>
				<Button
					variant="outline"
					className="gap-2 bg-transparent"
					onClick={() => router.push("/analytics")}>
					<TrendingUp className="h-4 w-4" />
					View Progress
				</Button>
			</div>

			{/* Questions List */}
			<div className="space-y-4">
				{filteredQuestions && filteredQuestions.length > 0 ? (
					filteredQuestions.map((question) => (
						<Card
							key={question.id}
							className="border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 cursor-pointer group"
							onClick={() => {
								const questionCategory =
									question.category?.name.toLowerCase() || category;
								router.push(
									`/questions/${questionCategory || "all"}/${question.id}`
								);
							}}>
							<CardContent className="p-6">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<Badge
												className={getDifficultyColor(question.difficulty)}>
												{question.difficulty}
											</Badge>
											<Badge variant="outline" className="text-xs">
												{question.category?.name || "Uncategorized"}
											</Badge>
										</div>

										<h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
											{question.title}
										</h3>

										<div className="flex flex-wrap gap-2 mb-3">
											{question.tags?.map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="text-xs bg-gray-100 text-gray-700">
													{tag}
												</Badge>
											))}
										</div>

										<div className="flex items-center gap-4 text-sm text-gray-500">
											<div className="flex items-center gap-1">
												<Star className="h-4 w-4" />
												<span>{question.stats?.likes || 0}</span>
											</div>
											<div className="flex items-center gap-1">
												<Users className="h-4 w-4" />
												<span>{question.stats?.views || 0} views</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												<span>
													{new Date(question.createdAt).toLocaleDateString()}
												</span>
											</div>
										</div>
									</div>

									<ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card className="border-gray-200">
						<CardContent className="p-12 text-center">
							<div className="text-gray-500">
								<h3 className="text-lg font-medium mb-2">No questions found</h3>
								<p>
									{category
										? `Questions for ${categoryName} will be available soon.`
										: "No questions available at the moment."}
								</p>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</>
	);
}
