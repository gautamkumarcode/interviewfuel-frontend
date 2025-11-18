"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AlertCircle,
	BookOpen,
	Clock,
	Code,
	Lightbulb,
	Target,
} from "lucide-react";
import { PracticeQuestion } from "../types";
import { getDifficultyColor } from "../utils";

interface QuestionPanelProps {
	question: PracticeQuestion;
}

export function QuestionPanel({ question }: QuestionPanelProps) {
	const getDifficultyIcon = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return { icon: Target, color: "text-green-600" };
			case "Medium":
				return { icon: AlertCircle, color: "text-yellow-600" };
			case "Hard":
				return { icon: Code, color: "text-red-600" };
			default:
				return { icon: Target, color: "text-gray-600" };
		}
	};

	const difficultyConfig = getDifficultyIcon(question.difficulty);
	const DifficultyIcon = difficultyConfig.icon;

	return (
		<Card className="h-fit bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
			<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
					<div className="flex-1 w-full">
						<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
							<Badge
								className={`${getDifficultyColor(
									question.difficulty
								)} flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium`}>
								<DifficultyIcon
									className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${difficultyConfig.color}`}
								/>
								{question.difficulty}
							</Badge>
							{question.source && (
								<Badge
									variant="outline"
									className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm px-2 sm:px-3 py-1">
									{question.source === "ai" ? "🤖 AI Generated" : "📚 Curated"}
								</Badge>
							)}
						</div>
						<CardTitle className="text-lg sm:text-xl font-bold leading-tight text-gray-900">
							{question.title}
						</CardTitle>
					</div>
					<div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
						<div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
							<Clock className="h-3 w-3 sm:h-4 sm:w-4" />
							<span className="font-medium">
								{Math.floor((question.timeLimit || 180) / 60)}:
								{String((question.timeLimit || 180) % 60).padStart(2, "0")}
							</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="px-4 sm:px-6">
				<div className="space-y-4 sm:space-y-6">
					{/* Question Content */}
					<div className="space-y-3 sm:space-y-4">
						<div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
							<BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
							Problem Description
						</div>
						<div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
							<div className="prose prose-sm max-w-none">
								<p className="text-gray-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
									{question.content}
								</p>
							</div>
						</div>
					</div>

					{/* Additional Info */}
					<div className="grid grid-cols-1 gap-3 sm:gap-4">
						{/* Approach Hints */}
						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
							<div className="flex items-start gap-2 sm:gap-3">
								<Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
								<div className="min-w-0">
									<h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-1.5 sm:mb-2">
										Approach Tips
									</h4>
									<ul className="text-xs sm:text-sm text-blue-800 space-y-1">
										<li>
											• Read the problem carefully and identify key requirements
										</li>
										<li className="hidden sm:list-item">
											• Think about edge cases and constraints
										</li>
										<li>• Consider multiple approaches before coding</li>
										<li className="hidden sm:list-item">
											• Explain your thought process as you work
										</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Time Management */}
						<div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
							<div className="flex items-start gap-2 sm:gap-3">
								<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
								<div className="min-w-0">
									<h4 className="text-sm sm:text-base font-semibold text-green-900 mb-1.5 sm:mb-2">
										Time Management
									</h4>
									<div className="text-xs sm:text-sm text-green-800 space-y-1">
										<p>
											• <strong>Planning:</strong> 2-3 minutes
										</p>
										<p>
											• <strong>Implementation:</strong>{" "}
											{Math.floor((question.timeLimit || 30) * 0.6)} minutes
										</p>
										<p>
											• <strong>Testing & Review:</strong>{" "}
											{Math.floor((question.timeLimit || 30) * 0.2)} minutes
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
