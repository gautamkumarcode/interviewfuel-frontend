"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	BookOpen,
	ChevronRight,
	Clock,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

const sampleQuestions = [
	{
		id: 1,
		title: "What is the difference between let, const, and var in JavaScript?",
		category: "JavaScript",
		difficulty: "Easy",
		tags: ["Variables", "ES6", "Fundamentals"],
		views: 1234,
		likes: 89,
		timeAgo: "2 hours ago",
	},
	{
		id: 2,
		title: "Explain React Hooks and their use cases",
		category: "React",
		difficulty: "Medium",
		tags: ["Hooks", "State Management", "Functional Components"],
		views: 2156,
		likes: 156,
		timeAgo: "5 hours ago",
	},
	{
		id: 3,
		title: "How do you optimize database queries for better performance?",
		category: "Database",
		difficulty: "Hard",
		tags: ["SQL", "Performance", "Indexing"],
		views: 987,
		likes: 67,
		timeAgo: "1 day ago",
	},
	{
		id: 4,
		title: "What are the principles of RESTful API design?",
		category: "Backend",
		difficulty: "Medium",
		tags: ["REST", "API", "HTTP"],
		views: 1567,
		likes: 123,
		timeAgo: "3 hours ago",
	},
	{
		id: 5,
		title: "Explain the concept of closures in JavaScript",
		category: "JavaScript",
		difficulty: "Medium",
		tags: ["Closures", "Scope", "Functions"],
		views: 1890,
		likes: 145,
		timeAgo: "6 hours ago",
	},
];

export default function HomePage() {
	const router = useRouter();

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

	const handleQuestionClick = (questionId: number, category: string) => {
		router.push(`/questions/${category}/${questionId}`);
	};

	return (
		<>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					All Interview Questions
				</h1>
				<p className="text-gray-600">
					Master your interviews with our comprehensive question bank
				</p>
			</div>

			<div className="flex items-center gap-4 mb-6">
				<Button
					onClick={() => router.push("/practice")}
					className="gap-2 bg-green-600 hover:bg-green-700">
					<Clock className="h-4 w-4" />
					Start Practice Session
				</Button>
				<Button
					variant="outline"
					className="gap-2 bg-transparent"
					onClick={() => router.push("/analytics")}>
					<TrendingUp className="h-4 w-4" />
					View Analytics
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
				<Card className="border-gray-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<BookOpen className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Total Questions</p>
								<p className="text-xl font-semibold">1,247</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-gray-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<Users className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Contributors</p>
								<p className="text-xl font-semibold">89</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-gray-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<TrendingUp className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">This Week</p>
								<p className="text-xl font-semibold">+47</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-gray-200">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-orange-100 rounded-lg">
								<Star className="h-5 w-5 text-orange-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Avg Rating</p>
								<p className="text-xl font-semibold">4.8</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Questions List */}
			<div className="space-y-4">
				{sampleQuestions.map((question) => (
					<Card
						key={question.id}
						className="border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 cursor-pointer group"
						onClick={() => handleQuestionClick(question.id, question.category)}>
						<CardContent className="p-6">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<Badge className={getDifficultyColor(question.difficulty)}>
											{question.difficulty}
										</Badge>
										<Badge variant="outline" className="text-xs">
											{question.category}
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
				))}
			</div>

			{/* Load More Button */}
			<div className="flex justify-center mt-8">
				<Button variant="outline" className="gap-2 bg-transparent">
					Load More Questions
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</>
	);
}
