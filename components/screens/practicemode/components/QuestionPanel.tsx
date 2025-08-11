"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PracticeQuestion } from "../types";
import { getDifficultyColor } from "../utils";

interface QuestionPanelProps {
	question: PracticeQuestion;
}

export function QuestionPanel({ question }: QuestionPanelProps) {
	return (
		<Card className="h-fit">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<Badge className={getDifficultyColor(question.difficulty)}>
								{question.difficulty}
							</Badge>
							{/* <Badge variant="outline">{question.category}</Badge> */}
						</div>
						<CardTitle className="text-lg leading-tight">
							{question.title}
						</CardTitle>
					</div>
					<div className="text-sm text-gray-500">
						{question.timeLimit} min suggested
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex flex-wrap gap-2">
						{/* {question.tags.map((tag) => (
							<Badge key={tag} variant="secondary" className="text-xs">
								{tag}
							</Badge>
						))} */}
					</div>
					<div className="prose prose-sm max-w-none">
						<p className="text-gray-700 leading-relaxed">{question.content}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
