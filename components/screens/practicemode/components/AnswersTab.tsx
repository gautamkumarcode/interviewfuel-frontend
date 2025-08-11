"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PracticeSession } from "../types";
import { getDifficultyColor } from "../utils";

interface AnswersTabProps {
	session: PracticeSession;
	aiEvaluations?: Array<{
		score: number;
		feedback: string;
		notes?: string;
	}>;
	isEvaluating?: boolean;
}

export function AnswersTab({
	session,
	aiEvaluations = [],
	isEvaluating = false,
}: AnswersTabProps) {
	return (
		<div className="space-y-4">
			{session.questions.map((question, index) => {
				const aiEval = aiEvaluations[index];
				const hasAnswer = session.answers[question._id];

				return (
					<Card key={question._id}>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<Badge className={getDifficultyColor(question.difficulty)}>
											{question.difficulty}
										</Badge>
										{hasAnswer ? (
											<Badge className="bg-green-100 text-green-800">
												Answered
											</Badge>
										) : (
											<Badge variant="outline">Not Answered</Badge>
										)}
										{aiEval && (
											<Badge
												className={`${
													aiEval.score >= 7
														? "bg-green-100 text-green-800"
														: aiEval.score >= 5
														? "bg-yellow-100 text-yellow-800"
														: "bg-red-100 text-red-800"
												}`}>
												Score: {aiEval.score}/10
											</Badge>
										)}
									</div>
									<CardTitle className="text-lg">{question.title}</CardTitle>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{/* User's Answer */}
								{hasAnswer ? (
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="text-sm text-gray-600 mb-2">
											Your Answer:
										</div>
										<div className="whitespace-pre-wrap text-sm">
											{session.answers[question._id]}
										</div>
									</div>
								) : (
									<div className="text-gray-500 italic">No answer provided</div>
								)}

								{/* AI Evaluation */}
								{isEvaluating && (
									<div className="bg-blue-50 rounded-lg p-4">
										<div className="flex items-center gap-2">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
											<span className="text-sm text-blue-700">
												Evaluating answer...
											</span>
										</div>
									</div>
								)}

								{aiEval && !isEvaluating && (
									<div className="bg-blue-50 rounded-lg p-4">
										<div className="text-sm text-blue-700 font-medium mb-2">
											AI Evaluation (Score: {aiEval.score}/10)
										</div>
										<div className="text-sm text-blue-800 mb-2">
											<strong>Feedback:</strong> {aiEval.feedback}
										</div>
										{aiEval.notes && (
											<div className="text-sm text-blue-800">
												<strong>Notes:</strong> {aiEval.notes}
											</div>
										)}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
