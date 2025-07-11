"use client";
import QuestionHOC from "@/components/screens/questions/QuestionHOC";
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

	return <QuestionHOC />;
}
