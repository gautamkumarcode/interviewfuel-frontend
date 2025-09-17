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
			<CardHeader className="pb-4">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-3">
							<Badge
								className={`${getDifficultyColor(
									question.difficulty
								)} flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium`}>
								<DifficultyIcon
									className={`h-3.5 w-3.5 ${difficultyConfig.color}`}
								/>
								{question.difficulty}
							</Badge>
							{question.source && (
								<Badge
									variant="outline"
									className="bg-blue-50 text-blue-700 border-blue-200">
									{question.source === "ai" ? "🤖 AI Generated" : "📚 Curated"}
								</Badge>
							)}
						</div>
						<CardTitle className="text-xl font-bold leading-tight text-gray-900 ">
							{question.title}
						</CardTitle>
					</div>
					<div className="flex flex-col items-end gap-2">
						<div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
							<Clock className="h-4 w-4" />
							<span className="font-medium">{question.timeLimit} min</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="">
				<div className="space-y-6">
					{/* Question Content */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
							<BookOpen className="h-4 w-4 text-blue-600" />
							Problem Description
						</div>
						<div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
							<div className="prose prose-sm max-w-none">
								<p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
									{question.content}
								</p>
							</div>
						</div>
					</div>

					{/* Additional Info */}
					<div className="grid grid-cols-1 gap-4">
						{/* Approach Hints */}
						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
								<div>
									<h4 className="font-semibold text-blue-900 mb-2">
										Approach Tips
									</h4>
									<ul className="text-sm text-blue-800 space-y-1">
										<li>
											• Read the problem carefully and identify key requirements
										</li>
										<li>• Think about edge cases and constraints</li>
										<li>• Consider multiple approaches before coding</li>
										<li>• Explain your thought process as you work</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Time Management */}
						<div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
								<div>
									<h4 className="font-semibold text-green-900 mb-2">
										Time Management
									</h4>
									<div className="text-sm text-green-800 space-y-1">
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
