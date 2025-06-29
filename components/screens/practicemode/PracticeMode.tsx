"use client";

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	BarChart3,
	CheckCircle,
	Clock,
	Pause,
	Play,
	RotateCcw,
	Square,
	Target,
	Timer,
	Trophy,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";


interface PracticeQuestion {
	id: number;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	tags: string[];
	timeLimit: number; // in minutes
	content: string;
}

interface PracticeSession {
	questions: PracticeQuestion[];
	currentQuestionIndex: number;
	timeRemaining: number;
	totalTime: number;
	isActive: boolean;
	isPaused: boolean;
	answers: { [key: number]: string };
	startTime: Date | null;
	endTime: Date | null;
}

const practiceQuestions: PracticeQuestion[] = [
	{
		id: 1,
		title: "What is the difference between let, const, and var in JavaScript?",
		difficulty: "Easy",
		category: "JavaScript",
		tags: ["Variables", "ES6", "Fundamentals"],
		timeLimit: 5,
		content:
			"Explain the key differences between var, let, and const in JavaScript. Include examples of scope, hoisting, and re-assignment behavior.",
	},
	{
		id: 2,
		title: "Implement a function to reverse a linked list",
		difficulty: "Medium",
		category: "Data Structures",
		tags: ["Linked List", "Algorithms", "Pointers"],
		timeLimit: 15,
		content:
			"Write a function that takes the head of a singly linked list and returns the head of the reversed list. Provide both iterative and recursive solutions.",
	},
	{
		id: 3,
		title: "Design a URL shortener like bit.ly",
		difficulty: "Hard",
		category: "System Design",
		tags: ["System Design", "Scalability", "Database"],
		timeLimit: 30,
		content:
			"Design a URL shortening service like bit.ly. Consider the database schema, API design, caching strategy, and how to handle high traffic loads.",
	},
	{
		id: 4,
		title: "Explain React Hooks and their use cases",
		difficulty: "Medium",
		category: "React",
		tags: ["Hooks", "State Management", "React"],
		timeLimit: 10,
		content:
			"Explain what React Hooks are, why they were introduced, and provide examples of useState, useEffect, and custom hooks.",
	},
	{
		id: 5,
		title: "Find the maximum subarray sum (Kadane's Algorithm)",
		difficulty: "Medium",
		category: "Algorithms",
		tags: ["Dynamic Programming", "Arrays", "Algorithms"],
		timeLimit: 20,
		content:
			"Given an array of integers, find the contiguous subarray with the largest sum. Implement Kadane's algorithm and explain its time complexity.",
	},
];

export function PracticeMode() {
	const [sessionState, setSessionState] = React.useState<
		"setup" | "active" | "completed"
	>("setup");
	const [session, setSession] = React.useState<PracticeSession>({
		questions: [],
		currentQuestionIndex: 0,
		timeRemaining: 0,
		totalTime: 0,
		isActive: false,
		isPaused: false,
		answers: {},
		startTime: null,
		endTime: null,
	});

	// Practice settings
	const [settings, setSettings] = React.useState({
		duration: 60, // minutes
		questionCount: 5,
		difficulty: "Mixed",
		category: "All",
		includeTimer: true,
	});

	const [currentAnswer, setCurrentAnswer] = React.useState("");
	const timerRef = React.useRef<NodeJS.Timeout | null>(null);

	// Timer effect
	React.useEffect(() => {
		if (session.isActive && !session.isPaused && session.timeRemaining > 0) {
			timerRef.current = setInterval(() => {
				setSession((prev) => ({
					...prev,
					timeRemaining: Math.max(0, prev.timeRemaining - 1),
				}));
			}, 1000);
		} else {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [session.isActive, session.isPaused, session.timeRemaining]);

	// Auto-complete session when time runs out
	React.useEffect(() => {
		if (session.timeRemaining === 0 && session.isActive) {
			completeSession();
		}
	}, [session.timeRemaining, session.isActive]);

	const startSession = () => {
		const selectedQuestions = practiceQuestions.slice(
			0,
			settings.questionCount
		);
		const totalTime = settings.duration * 60; // convert to seconds

		setSession({
			questions: selectedQuestions,
			currentQuestionIndex: 0,
			timeRemaining: totalTime,
			totalTime,
			isActive: true,
			isPaused: false,
			answers: {},
			startTime: new Date(),
			endTime: null,
		});
		setSessionState("active");
		setCurrentAnswer("");
	};

	const pauseSession = () => {
		setSession((prev) => ({ ...prev, isPaused: !prev.isPaused }));
	};

	const completeSession = () => {
		setSession((prev) => ({
			...prev,
			isActive: false,
			isPaused: false,
			endTime: new Date(),
		}));
		setSessionState("completed");
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
	};

	const nextQuestion = () => {
		// Save current answer
		if (currentAnswer.trim()) {
			setSession((prev) => ({
				...prev,
				answers: {
					...prev.answers,
					[prev.questions[prev.currentQuestionIndex].id]: currentAnswer,
				},
			}));
		}

		if (session.currentQuestionIndex < session.questions.length - 1) {
			setSession((prev) => ({
				...prev,
				currentQuestionIndex: prev.currentQuestionIndex + 1,
			}));
			setCurrentAnswer("");
		} else {
			completeSession();
		}
	};

	const previousQuestion = () => {
		if (session.currentQuestionIndex > 0) {
			// Save current answer
			if (currentAnswer.trim()) {
				setSession((prev) => ({
					...prev,
					answers: {
						...prev.answers,
						[prev.questions[prev.currentQuestionIndex].id]: currentAnswer,
					},
				}));
			}

			setSession((prev) => ({
				...prev,
				currentQuestionIndex: prev.currentQuestionIndex - 1,
			}));

			// Load previous answer
			const prevQuestionId =
				session.questions[session.currentQuestionIndex - 1].id;
			setCurrentAnswer(session.answers[prevQuestionId] || "");
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

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

	const calculateResults = () => {
		const answeredQuestions = Object.keys(session.answers).length;
		const totalQuestions = session.questions.length;
		const completionRate = (answeredQuestions / totalQuestions) * 100;
		const timeUsed = session.totalTime - session.timeRemaining;
		const avgTimePerQuestion = timeUsed / Math.max(answeredQuestions, 1);

		return {
			answeredQuestions,
			totalQuestions,
			completionRate,
			timeUsed,
			avgTimePerQuestion,
		};
	};

	if (sessionState === "setup") {
		return (
			<div className="max-w-2xl mx-auto">
				<div className="flex items-center gap-4 mb-6">
					<Button variant="ghost"  className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Questions
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl flex items-center gap-2">
							<Target className="h-6 w-6" />
							Practice Session Setup
						</CardTitle>
						<p className="text-gray-600">
							Configure your practice session to simulate real interview
							conditions
						</p>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="duration">Session Duration (minutes)</Label>
								<div className="px-3">
									<Slider
										id="duration"
										min={15}
										max={120}
										step={15}
										value={[settings.duration]}
										onValueChange={(value) =>
											setSettings((prev) => ({ ...prev, duration: value[0] }))
										}
										className="w-full"
									/>
									<div className="flex justify-between text-sm text-gray-500 mt-1">
										<span>15 min</span>
										<span className="font-medium">{settings.duration} min</span>
										<span>120 min</span>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="questionCount">Number of Questions</Label>
								<Select
									value={settings.questionCount.toString()}
									onValueChange={(value) =>
										setSettings((prev) => ({
											...prev,
											questionCount: Number.parseInt(value),
										}))
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="3">3 Questions</SelectItem>
										<SelectItem value="5">5 Questions</SelectItem>
										<SelectItem value="10">10 Questions</SelectItem>
										<SelectItem value="15">15 Questions</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="difficulty">Difficulty Level</Label>
								<Select
									value={settings.difficulty}
									onValueChange={(value) =>
										setSettings((prev) => ({ ...prev, difficulty: value }))
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Easy">Easy Only</SelectItem>
										<SelectItem value="Medium">Medium Only</SelectItem>
										<SelectItem value="Hard">Hard Only</SelectItem>
										<SelectItem value="Mixed">Mixed Difficulty</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">Category Focus</Label>
								<Select
									value={settings.category}
									onValueChange={(value) =>
										setSettings((prev) => ({ ...prev, category: value }))
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="All">All Categories</SelectItem>
										<SelectItem value="JavaScript">JavaScript</SelectItem>
										<SelectItem value="React">React</SelectItem>
										<SelectItem value="Algorithms">Algorithms</SelectItem>
										<SelectItem value="System Design">System Design</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
								<div>
									<h4 className="font-medium text-blue-900 mb-1">
										Practice Session Tips
									</h4>
									<ul className="text-sm text-blue-800 space-y-1">
										<li>• Treat this like a real interview - think out loud</li>
										<li>
											• Focus on problem-solving approach, not just the final
											answer
										</li>
										<li>• Use the timer to practice time management</li>
										<li>
											• You can pause if needed, but try to work continuously
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="flex justify-center">
							<Button
								onClick={startSession}
								size="lg"
								className="gap-2 bg-green-600 hover:bg-green-700">
								<Play className="h-5 w-5" />
								Start Practice Session
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (sessionState === "active") {
		const currentQuestion = session.questions[session.currentQuestionIndex];
		const progress =
			((session.currentQuestionIndex + 1) / session.questions.length) * 100;

		return (
			<div className="max-w-4xl mx-auto">
				{/* Session Header */}
				<div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4 mb-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Badge variant="outline" className="gap-1">
								<Timer className="h-3 w-3" />
								Question {session.currentQuestionIndex + 1} of{" "}
								{session.questions.length}
							</Badge>
							<Progress value={progress} className="w-32" />
						</div>

						<div className="flex items-center gap-4">
							<div
								className={`text-2xl font-mono font-bold ${
									session.timeRemaining < 300 ? "text-red-600" : "text-gray-900"
								}`}>
								{formatTime(session.timeRemaining)}
							</div>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={pauseSession}
									className="gap-2">
									{session.isPaused ? (
										<Play className="h-4 w-4" />
									) : (
										<Pause className="h-4 w-4" />
									)}
									{session.isPaused ? "Resume" : "Pause"}
								</Button>

								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm">
											<Square className="h-4 w-4" />
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>End Practice Session?</DialogTitle>
											<DialogDescription>
												Are you sure you want to end this practice session? Your
												progress will be saved.
											</DialogDescription>
										</DialogHeader>
										<div className="flex justify-end gap-2">
											<Button variant="outline">Cancel</Button>
											<Button onClick={completeSession} variant="destructive">
												End Session
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</div>
				</div>

				{/* Question Content */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Question Panel */}
					<Card className="h-fit">
						<CardHeader>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<Badge
											className={getDifficultyColor(
												currentQuestion.difficulty
											)}>
											{currentQuestion.difficulty}
										</Badge>
										<Badge variant="outline">{currentQuestion.category}</Badge>
									</div>
									<CardTitle className="text-lg leading-tight">
										{currentQuestion.title}
									</CardTitle>
								</div>
								<div className="text-sm text-gray-500">
									{currentQuestion.timeLimit} min suggested
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex flex-wrap gap-2">
									{currentQuestion.tags.map((tag) => (
										<Badge key={tag} variant="secondary" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
								<div className="prose prose-sm max-w-none">
									<p className="text-gray-700 leading-relaxed">
										{currentQuestion.content}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Answer Panel */}
					<Card className="h-fit">
						<CardHeader>
							<CardTitle className="text-lg">Your Answer</CardTitle>
							<p className="text-sm text-gray-600">
								Write your solution, explain your approach, and include any code
								if needed.
							</p>
						</CardHeader>
						<CardContent>
							<Textarea
								placeholder="Start typing your answer here... Think out loud and explain your approach step by step."
								value={currentAnswer}
								onChange={(e) => setCurrentAnswer(e.target.value)}
								className="min-h-[300px] resize-none"
							/>

							<div className="flex items-center justify-between mt-4">
								<div className="text-sm text-gray-500">
									{currentAnswer.length} characters
								</div>

								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										onClick={previousQuestion}
										disabled={session.currentQuestionIndex === 0}
										className="gap-2">
										<ArrowLeft className="h-4 w-4" />
										Previous
									</Button>

									<Button onClick={nextQuestion} className="gap-2">
										{session.currentQuestionIndex ===
										session.questions.length - 1 ? (
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
				</div>

				{/* Session Pause Overlay */}
				{session.isPaused && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
						<Card className="w-96">
							<CardContent className="p-6 text-center">
								<Pause className="h-12 w-12 mx-auto mb-4 text-gray-400" />
								<h3 className="text-lg font-semibold mb-2">Session Paused</h3>
								<p className="text-gray-600 mb-4">
									Take your time. Click resume when you&lsquo;re ready to continue.
								</p>
								<Button onClick={pauseSession} className="gap-2">
									<Play className="h-4 w-4" />
									Resume Session
								</Button>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		);
	}

	if (sessionState === "completed") {
		const results = calculateResults();

		return (
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
						<Trophy className="h-8 w-8 text-green-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Practice Session Complete!
					</h1>
					<p className="text-gray-600">
						Here&lsquo;s how you performed in this session
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card>
						<CardContent className="p-6 text-center">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
								<CheckCircle className="h-6 w-6 text-blue-600" />
							</div>
							<div className="text-2xl font-bold text-gray-900 mb-1">
								{results.answeredQuestions}/{results.totalQuestions}
							</div>
							<div className="text-sm text-gray-600">Questions Answered</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 text-center">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
								<BarChart3 className="h-6 w-6 text-green-600" />
							</div>
							<div className="text-2xl font-bold text-gray-900 mb-1">
								{Math.round(results.completionRate)}%
							</div>
							<div className="text-sm text-gray-600">Completion Rate</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 text-center">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
								<Clock className="h-6 w-6 text-purple-600" />
							</div>
							<div className="text-2xl font-bold text-gray-900 mb-1">
								{formatTime(Math.round(results.avgTimePerQuestion))}
							</div>
							<div className="text-sm text-gray-600">Avg Time/Question</div>
						</CardContent>
					</Card>
				</div>

				<Tabs defaultValue="summary" className="mb-8">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="summary">Session Summary</TabsTrigger>
						<TabsTrigger value="answers">Your Answers</TabsTrigger>
					</TabsList>

					<TabsContent value="summary">
						<Card>
							<CardHeader>
								<CardTitle>Performance Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<div className="text-sm text-gray-600 mb-1">
											Total Time Used
										</div>
										<div className="text-lg font-semibold">
											{formatTime(results.timeUsed)}
										</div>
									</div>
									<div>
										<div className="text-sm text-gray-600 mb-1">
											Session Duration
										</div>
										<div className="text-lg font-semibold">
											{formatTime(session.totalTime)}
										</div>
									</div>
								</div>

								<div>
									<div className="text-sm text-gray-600 mb-2">
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
													<Badge className={getDifficultyColor(difficulty)}>
														{difficulty}
													</Badge>
													<span className="text-sm text-gray-600">
														{count} questions
													</span>
												</div>
											);
										})}
									</div>
								</div>

								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<h4 className="font-medium text-blue-900 mb-2">
										Recommendations
									</h4>
									<ul className="text-sm text-blue-800 space-y-1">
										{results.completionRate < 50 && (
											<li>• Consider practicing with easier questions first</li>
										)}
										{results.avgTimePerQuestion > 600 && (
											<li>• Work on improving your time management</li>
										)}
										{results.answeredQuestions === results.totalQuestions && (
											<li>
												• Great job completing all questions! Try harder
												difficulty next time
											</li>
										)}
										<li>• Review the questions you found challenging</li>
										<li>• Practice regularly to build confidence</li>
									</ul>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="answers">
						<div className="space-y-4">
							{session.questions.map((question) => (
								<Card key={question.id}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<Badge
														className={getDifficultyColor(question.difficulty)}>
														{question.difficulty}
													</Badge>
													{session.answers[question.id] ? (
														<Badge className="bg-green-100 text-green-800">
															Answered
														</Badge>
													) : (
														<Badge variant="outline">Not Answered</Badge>
													)}
												</div>
												<CardTitle className="text-lg">
													{question.title}
												</CardTitle>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										{session.answers[question.id] ? (
											<div className="bg-gray-50 rounded-lg p-4">
												<div className="text-sm text-gray-600 mb-2">
													Your Answer:
												</div>
												<div className="whitespace-pre-wrap text-sm">
													{session.answers[question.id]}
												</div>
											</div>
										) : (
											<div className="text-gray-500 italic">
												No answer provided
											</div>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<div className="flex justify-center gap-4">
					<Button
						onClick={() => setSessionState("setup")}
						variant="outline"
						className="gap-2">
						<RotateCcw className="h-4 w-4" />
						Start New Session
					</Button>
					<Button  className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Questions
					</Button>
				</div>
			</div>
		);
	}

	return null;
}
