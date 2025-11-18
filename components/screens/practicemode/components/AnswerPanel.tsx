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
			<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex-shrink-0">
							<Edit3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
						</div>
						<div className="min-w-0">
							<CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
								Your Solution
							</CardTitle>
							<p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">
								Explain your approach, write code, and document your thinking
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{isSaved && (
							<Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
								<Save className="h-3 w-3 mr-1" />
								Saved
							</Badge>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
				{/* Quick Templates */}
				<div className="space-y-2 sm:space-y-3">
					<h4 className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2">
						<Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600" />
						Quick Templates
					</h4>
					<div className="grid grid-cols-3 gap-2">
						{answerTemplates.map((template, index) => {
							const Icon = template.icon;
							return (
								<Button
									key={index}
									variant="outline"
									size="sm"
									onClick={() => insertTemplate(template.template)}
									className="h-auto p-2 sm:p-3 bg-white/60 hover:bg-white/80 border-white/40 flex flex-col items-center gap-1 sm:gap-2">
									<Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									<span className="text-[10px] sm:text-xs font-medium text-center leading-tight">
										{template.title}
									</span>
								</Button>
							);
						})}
					</div>
				</div>

				{/* Answer Input */}
				<div className="space-y-3 sm:space-y-4">
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
							className="min-h-[300px] sm:min-h-[400px] resize-none text-sm sm:text-base bg-white/90 backdrop-blur-sm border-2 border-gray-200 focus:border-green-500 transition-all duration-200 font-mono"
						/>
						<div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-[10px] sm:text-xs text-gray-400">
							{currentAnswer.length} chars
						</div>
					</div>

					{/* Answer Stats */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg">
						<div className="flex items-center gap-2 sm:gap-4 flex-wrap">
							<span className="whitespace-nowrap">
								{currentAnswer.length} chars
							</span>
							<span className="whitespace-nowrap">{wordCount} words</span>
							<span className="whitespace-nowrap">
								~{estimatedReadTime} min read
							</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleAutoSave}
							className="text-xs h-7 px-2 sm:px-3">
							<Save className="h-3 w-3 mr-1" />
							<span className="hidden sm:inline">Auto-save</span>
							<span className="sm:hidden">Save</span>
						</Button>
					</div>
				</div>

				{/* Writing Tips */}
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4">
					<div className="flex items-start gap-2 sm:gap-3">
						<FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
						<div className="min-w-0">
							<h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-1.5 sm:mb-2">
								Writing Tips
							</h4>
							<ul className="text-xs sm:text-sm text-blue-800 space-y-1">
								<li>
									• <strong>Think out loud:</strong> Explain your reasoning as
									you work
								</li>
								<li className="hidden sm:list-item">
									• <strong>Structure your answer:</strong> Use clear sections
									and headings
								</li>
								<li>
									• <strong>Include code comments:</strong> Explain complex
									logic
								</li>
								<li className="hidden sm:list-item">
									• <strong>Consider alternatives:</strong> Mention other
									possible approaches
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-gray-200">
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
						className={`gap-2 transition-all duration-200 text-sm sm:text-base h-9 sm:h-10 ${
							canGoPrevious
								? "bg-white/60 hover:bg-white/80 border-gray-300 hover:border-gray-400"
								: "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
						}`}>
						<ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						<span className="hidden xs:inline">Previous Question</span>
						<span className="xs:hidden">Previous</span>
					</Button>

					<div className="flex items-center gap-2 sm:gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={(e) => {
								e.preventDefault();
								onAnswerChange("");
							}}
							className="gap-2 bg-white/60 hover:bg-white/80 border-gray-300 hover:border-gray-400 transition-all duration-200 text-sm sm:text-base h-9 sm:h-10 flex-1 sm:flex-none">
							<RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span className="hidden sm:inline">Clear</span>
						</Button>

						<Button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								onNext();
							}}
							className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm sm:text-base h-9 sm:h-10 flex-1 sm:flex-none">
							{isLastQuestion ? (
								<>
									<CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									<span className="hidden xs:inline">Complete Session</span>
									<span className="xs:hidden">Complete</span>
								</>
							) : (
								<>
									<span className="hidden xs:inline">Next Question</span>
									<span className="xs:hidden">Next</span>
									<ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								</>
							)}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
