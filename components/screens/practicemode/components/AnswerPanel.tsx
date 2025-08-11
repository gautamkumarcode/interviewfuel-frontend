"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface AnswerPanelProps {
	currentAnswer: string;
	onAnswerChange: (answer: string) => void;
	onPrevious: () => void;
	onNext: () => void;
	canGoPrevious: boolean;
	isLastQuestion: boolean;
}

export function AnswerPanel({
	currentAnswer,
	onAnswerChange,
	onPrevious,
	onNext,
	canGoPrevious,
	isLastQuestion,
}: AnswerPanelProps) {
	return (
		<Card className="h-fit">
			<CardHeader>
				<CardTitle className="text-lg">Your Answer</CardTitle>
				<p className="text-sm text-gray-600">
					Write your solution, explain your approach, and include any code if
					needed.
				</p>
			</CardHeader>
			<CardContent>
				<Textarea
					placeholder="Start typing your answer here... Think out loud and explain your approach step by step."
					value={currentAnswer}
					onChange={(e) => onAnswerChange(e.target.value)}
					className="min-h-[300px] resize-none"
				/>

				<div className="flex items-center justify-between mt-4">
					<div className="text-sm text-gray-500">
						{currentAnswer.length} characters
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							onClick={onPrevious}
							disabled={!canGoPrevious}
							className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Previous
						</Button>

						<Button onClick={onNext} className="gap-2">
							{isLastQuestion ? (
								<>
									<CheckCircle className="h-4 w-4" />
									Finish
								</>
							) : (
								<>
									Next
									<ArrowRight className="h-4 w-4" />
								</>
							)}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
