"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Code,
	Edit3,
	FileText,
	Lightbulb,
	RotateCcw,
	Save,
} from "lucide-react";
import { useState } from "react";

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
	const [isSaved, setIsSaved] = useState(false);

	const wordCount = currentAnswer
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
	const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 words per minute

	const handleAnswerChange = (value: string) => {
		onAnswerChange(value);
		setIsSaved(false);
	};

	const handleAutoSave = () => {
		// Simulate auto-save functionality
		setIsSaved(true);
		setTimeout(() => setIsSaved(false), 2000);
	};

	const answerTemplates = [
		{
			title: "Problem Analysis",
			icon: FileText,
			template:
				"## Problem Analysis\n\n**Understanding:**\n- \n\n**Constraints:**\n- \n\n**Edge Cases:**\n- \n\n",
		},
		{
			title: "Solution Approach",
			icon: Lightbulb,
			template:
				"## Solution Approach\n\n**Algorithm:**\n1. \n2. \n3. \n\n**Time Complexity:** O()\n**Space Complexity:** O()\n\n",
		},
		{
			title: "Code Implementation",
			icon: Code,
			template:
				"## Implementation\n\n```javascript\nfunction solution() {\n    // Your code here\n}\n```\n\n**Explanation:**\n- \n\n",
		},
	];

	const insertTemplate = (template: string) => {
		const newValue = currentAnswer + (currentAnswer ? "\n\n" : "") + template;
		onAnswerChange(newValue);
	};

	return (
		<Card className="h-fit bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
							<Edit3 className="h-5 w-5 text-white" />
						</div>
						<div>
							<CardTitle className="text-xl font-bold text-gray-900">
								Your Solution
							</CardTitle>
							<p className="text-sm text-gray-600 mt-1">
								Explain your approach, write code, and document your thinking
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{isSaved && (
							<Badge className="bg-green-100 text-green-700 border-green-300">
								<Save className="h-3 w-3 mr-1" />
								Saved
							</Badge>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className=" space-y-6">
				{/* Quick Templates */}
				<div className="space-y-3">
					<h4 className="font-medium text-gray-700 flex items-center gap-2">
						<Lightbulb className="h-4 w-4 text-yellow-600" />
						Quick Templates
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
						{answerTemplates.map((template, index) => {
							const Icon = template.icon;
							return (
								<Button
									key={index}
									variant="outline"
									size="sm"
									onClick={() => insertTemplate(template.template)}
									className="h-auto p-3 bg-white/60 hover:bg-white/80 border-white/40 flex flex-col items-center gap-2">
									<Icon className="h-4 w-4" />
									<span className="text-xs font-medium">{template.title}</span>
								</Button>
							);
						})}
					</div>
				</div>

				{/* Answer Input */}
				<div className="space-y-4">
					<div className="relative">
						<Textarea
							placeholder="Start with your approach...

Example structure:
1. Problem Analysis
   - What is the problem asking?
   - What are the constraints?

2. Solution Strategy  
   - What algorithm/approach will you use?
   - Why is this approach suitable?

3. Implementation
   - Write your code
   - Add comments explaining key parts

4. Testing & Edge Cases
   - What test cases would you run?
   - What edge cases should be considered?"
							value={currentAnswer}
							onChange={(e) => handleAnswerChange(e.target.value)}
							className="min-h-[400px] resize-none text-base bg-white/90 backdrop-blur-sm border-2 border-gray-200 focus:border-green-500 transition-all duration-200 font-mono"
						/>
						<div className="absolute bottom-3 right-3 text-xs text-gray-400">
							{currentAnswer.length} chars
						</div>
					</div>

					{/* Answer Stats */}
					<div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
						<div className="flex items-center gap-4">
							<span>{currentAnswer.length} characters</span>
							<span>{wordCount} words</span>
							<span>~{estimatedReadTime} min read</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleAutoSave}
							className="text-xs">
							<Save className="h-3 w-3 mr-1" />
							Auto-save
						</Button>
					</div>
				</div>

				{/* Writing Tips */}
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
					<div className="flex items-start gap-3">
						<FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
						<div>
							<h4 className="font-semibold text-blue-900 mb-2">Writing Tips</h4>
							<ul className="text-sm text-blue-800 space-y-1">
								<li>
									• <strong>Think out loud:</strong> Explain your reasoning as
									you work
								</li>
								<li>
									• <strong>Structure your answer:</strong> Use clear sections
									and headings
								</li>
								<li>
									• <strong>Include code comments:</strong> Explain complex
									logic
								</li>
								<li>
									• <strong>Consider alternatives:</strong> Mention other
									possible approaches
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-200">
					<Button
						type="button"
						variant="outline"
						onClick={(e) => {
							e.preventDefault();
							
							if (canGoPrevious) {
								onPrevious();
							}
						}}
						disabled={!canGoPrevious}
						className={`gap-2 transition-all duration-200 ${
							canGoPrevious
								? "bg-white/60 hover:bg-white/80 border-gray-300 hover:border-gray-400"
								: "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
						}`}>
						<ArrowLeft className="h-4 w-4" />
						Previous Question
					</Button>

					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={(e) => {
								e.preventDefault();
								onAnswerChange("");
							}}
							className="gap-2 bg-white/60 hover:bg-white/80 border-gray-300 hover:border-gray-400 transition-all duration-200">
							<RotateCcw className="h-4 w-4" />
							Clear
						</Button>

						<Button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								onNext();
							}}
							className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
							{isLastQuestion ? (
								<>
									<CheckCircle className="h-4 w-4" />
									Complete Session
								</>
							) : (
								<>
									Next Question
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
