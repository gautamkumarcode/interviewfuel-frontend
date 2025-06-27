"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Clock, Star, TrendingUp, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

// Mock data for category-specific questions
const categoryQuestions = {
	javascript: [
		{
			id: 1,
			title:
				"What is the difference between let, const, and var in JavaScript?",
			difficulty: "Easy",
			tags: ["Variables", "ES6", "Fundamentals"],
			views: 1234,
			likes: 89,
			timeAgo: "2 hours ago",
		},
		{
			id: 5,
			title: "Explain the concept of closures in JavaScript",
			difficulty: "Medium",
			tags: ["Closures", "Scope", "Functions"],
			views: 1890,
			likes: 145,
			timeAgo: "6 hours ago",
		},
	],
	react: [
		{
			id: 2,
			title: "Explain React Hooks and their use cases",
			difficulty: "Medium",
			tags: ["Hooks", "State Management", "Functional Components"],
			views: 2156,
			likes: 156,
			timeAgo: "5 hours ago",
		},
	],
};

export default function CategoryPage() {
	const params = useParams();
	const router = useRouter();
	const category = params.category as string;

	const questions =
		categoryQuestions[category as keyof typeof categoryQuestions] || [];
	const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

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

	const handleQuestionClick = (questionId: number) => {
		router.push(`/questions/${questionId}`);
	};

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
				{questions.length > 0 ? (
					questions.map((question) => (
						<Card
							key={question.id}
							className="border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 cursor-pointer group"
							onClick={() => handleQuestionClick(question.id)}>
							<CardContent className="p-6">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<Badge
												className={getDifficultyColor(question.difficulty)}>
												{question.difficulty}
											</Badge>
											<Badge variant="outline" className="text-xs">
												{categoryName}
											</Badge>
										</div>

										<h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
											{question.title}
										</h3>

										<div className="flex flex-wrap gap-2 mb-3">
											{question.tags.map((tag) => (
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
												<span>{question.likes}</span>
											</div>
											<div className="flex items-center gap-1">
												<Users className="h-4 w-4" />
												<span>{question.views} views</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												<span>{question.timeAgo}</span>
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
								<p>Questions for {categoryName} will be available soon.</p>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</>
	);
}
