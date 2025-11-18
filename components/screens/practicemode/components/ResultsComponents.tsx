"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, CheckCircle, Clock } from "lucide-react";
import { PracticeSession, SessionResults } from "../types";
import { formatTime, getDifficultyColor } from "../utils";

interface ResultsCardsProps {
	results: SessionResults;
}

export function ResultsCards({ results }: ResultsCardsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
			<Card>
				<CardContent className="p-4 sm:p-6 text-center">
					<div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full mb-2 sm:mb-3">
						<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
					</div>
					<div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
						{results.answeredQuestions}/{results.totalQuestions}
					</div>
					<div className="text-xs sm:text-sm text-gray-600">
						Questions Answered
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-4 sm:p-6 text-center">
					<div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full mb-2 sm:mb-3">
						<BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
					</div>
					<div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
						{Math.round(results.completionRate)}%
					</div>
					<div className="text-xs sm:text-sm text-gray-600">
						Completion Rate
					</div>
				</CardContent>
			</Card>

			<Card className="sm:col-span-2 lg:col-span-1">
				<CardContent className="p-4 sm:p-6 text-center">
					<div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full mb-2 sm:mb-3">
						<Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
					</div>
					<div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
						{formatTime(Math.round(results.avgTimePerQuestion))}
					</div>
					<div className="text-xs sm:text-sm text-gray-600">
						Avg Time/Question
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

interface SummaryTabProps {
	session: PracticeSession;
	results: SessionResults;
	aiEvaluations?: Array<{
		score: number;
		feedback: string;
		notes?: string;
	}>;
	isEvaluating?: boolean;
}

export function SummaryTab({
	session,
	results,
	aiEvaluations = [],
	isEvaluating = false,
}: SummaryTabProps) {
	return (
		<Card>
			<CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
				<div className="grid grid-cols-2 gap-3 sm:gap-4">
					<div>
						<div className="text-xs sm:text-sm text-gray-600 mb-1">
							Total Time Used
						</div>
						<div className="text-base sm:text-lg font-semibold">
							{formatTime(results.timeUsed)}
						</div>
					</div>
					<div>
						<div className="text-xs sm:text-sm text-gray-600 mb-1">
							Session Duration
						</div>
						<div className="text-base sm:text-lg font-semibold">
							{formatTime(session.totalTime)}
						</div>
					</div>
				</div>

				<div>
					<div className="text-xs sm:text-sm text-gray-600 mb-2">
						Questions by Difficulty
					</div>
					<div className="space-y-2">
						{["Easy", "Medium", "Hard"].map((difficulty) => {
							const count = session.questions.filter(
								(q) => q.difficulty === difficulty
							).length;
							if (count === 0) return null;
							return (
								<div
									key={difficulty}
									className="flex items-center justify-between">
									<Badge
										className={`${getDifficultyColor(difficulty)} text-xs`}>
										{difficulty}
									</Badge>
									<span className="text-xs sm:text-sm text-gray-600">
										{count} questions
									</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* AI Evaluation Summary */}
				{(aiEvaluations.length > 0 || isEvaluating) && (
					<div>
						<div className="text-xs sm:text-sm text-gray-600 mb-2">
							AI Evaluation
						</div>
						{isEvaluating ? (
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
								<div className="flex items-center gap-2">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
									<span className="text-xs sm:text-sm text-blue-700">
										Evaluating your answers...
									</span>
								</div>
							</div>
						) : aiEvaluations.length > 0 ? (
							<div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
								<div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3">
									<div>
										<div className="text-[10px] sm:text-xs text-green-600">
											Average Score
										</div>
										<div className="text-base sm:text-lg font-semibold text-green-800">
											{(
												aiEvaluations.reduce(
													(sum, evaluation) => sum + evaluation.score,
													0
												) / aiEvaluations.length
											).toFixed(1)}
											/10
										</div>
									</div>
									<div>
										<div className="text-[10px] sm:text-xs text-green-600">
											Highest Score
										</div>
										<div className="text-base sm:text-lg font-semibold text-green-800">
											{Math.max(
												...aiEvaluations.map((evaluation) => evaluation.score)
											)}
											/10
										</div>
									</div>
									<div>
										<div className="text-[10px] sm:text-xs text-green-600">
											Questions Evaluated
										</div>
										<div className="text-base sm:text-lg font-semibold text-green-800">
											{aiEvaluations.length}
										</div>
									</div>
								</div>
								<div className="text-xs sm:text-sm text-green-700">
									✅ Your answers have been evaluated by AI. Check the Your
									Answers & AI Feedback tab for detailed feedback on each
									question.
								</div>
							</div>
						) : null}
					</div>
				)}

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
					<h4 className="text-sm sm:text-base font-medium text-blue-900 mb-2">
						Recommendations
					</h4>
					<ul className="text-xs sm:text-sm text-blue-800 space-y-1">
						{results.completionRate < 50 && (
							<li>• Consider practicing with easier questions first</li>
						)}
						{results.avgTimePerQuestion > 600 && (
							<li>• Work on improving your time management</li>
						)}
						{results.answeredQuestions === results.totalQuestions && (
							<li>
								• Great job completing all questions! Try harder difficulty next
								time
							</li>
						)}
						<li>• Review the questions you found challenging</li>
						<li className="hidden sm:list-item">
							• Practice regularly to build confidence
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
