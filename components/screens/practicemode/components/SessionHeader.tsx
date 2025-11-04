"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	Pause,
	Play,
	Settings,
	Square,
	Target,
	Timer,
} from "lucide-react";
import { PracticeSession } from "../types";
import { formatTime } from "../utils";

interface SessionHeaderProps {
	session: PracticeSession;
	onPauseResume: () => void;
	onEndSession: () => void;
}

export function SessionHeader({
	session,
	onPauseResume,
	onEndSession,
}: SessionHeaderProps) {
	const progress =
		((session.currentQuestionIndex + 1) / session.questions.length) * 100;
	const isLowTime = session.timeRemaining < 300; // Less than 5 minutes
	const isCriticalTime = session.timeRemaining < 60; // Less than 1 minute

	const getTimeColor = () => {
		if (isCriticalTime) return "text-red-600 animate-pulse";
		if (isLowTime) return "text-orange-600";
		return "text-gray-900";
	};

	const getTimeBackground = () => {
		if (isCriticalTime) return "bg-red-50 border-red-200";
		if (isLowTime) return "bg-orange-50 border-orange-200";
		return "bg-gray-50 border-gray-200";
	};

	const currentQuestion = session.questions[session.currentQuestionIndex];

	return (
		<div className="bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm border-b border-white/20 sticky top-0 z-20 shadow-lg">
			<div className="max-w-7xl mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Left Section - Progress */}
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
								<Target className="h-5 w-5 text-white" />
							</div>
							<div>
								<Badge
									variant="outline"
									className="gap-2 bg-white/80 border-blue-200 text-blue-700 px-3 py-1">
									<Timer className="h-3 w-3" />
									Question {session.currentQuestionIndex + 1} of{" "}
									{session.questions.length}
								</Badge>
								<div className="text-xs text-gray-600 mt-1">
									{Math.round(progress)}% Complete
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Progress value={progress} className="w-40 h-2 bg-gray-200" />
							<div className="flex items-center gap-1 text-sm text-gray-600">
								<CheckCircle2 className="h-4 w-4 text-green-600" />
								<span>{session.currentQuestionIndex}</span>
								<span className="text-gray-400">/</span>
								<span>{session.questions.length}</span>
							</div>
						</div>
					</div>

					{/* Right Section - Timer & Controls */}
					<div className="flex items-center gap-6">
						{/* Timer Display */}
						<div
							className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 ${getTimeBackground()}`}>
							<Clock
								className={`h-5 w-5 ${
									isLowTime ? "text-orange-600" : "text-gray-600"
								}`}
							/>
							<div className="text-center">
								<div
									className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
									{formatTime(session.timeRemaining)}
								</div>
								<div className="text-xs text-gray-500">
									{isLowTime ? "Time Running Low!" : "Time Remaining"}
								</div>
							</div>
						</div>

						{/* Session Info */}
						<div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
							<div className="flex items-center gap-1">
								<Settings className="h-4 w-4" />
								<span>{session.settings?.difficulty || "Mixed"}</span>
							</div>
							<div className="flex items-center gap-1">
								<Target className="h-4 w-4" />
								<span>
									{session.settings?.source === "ai"
										? "🧠 AI Smart Time"
										: "📚 Database"}
								</span>
								{currentQuestion && currentQuestion.timeLimit && (
									<div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
										<Clock className="h-3 w-3 text-blue-600" />
										<span className="text-blue-700 font-medium text-xs">
											{Math.floor(currentQuestion.timeLimit / 60)}:
											{String(currentQuestion.timeLimit % 60).padStart(2, "0")}
											<span className="ml-1 opacity-75">this Q</span>
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Control Buttons */}
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="sm"
								onClick={onPauseResume}
								className="gap-2 bg-white/80 hover:bg-white border-gray-300 hover:border-gray-400 transition-all duration-200">
								{session.isPaused ? (
									<>
										<Play className="h-4 w-4 text-green-600" />
										Resume
									</>
								) : (
									<>
										<Pause className="h-4 w-4 text-blue-600" />
										Pause
									</>
								)}
							</Button>

							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="gap-2 bg-white/80 hover:bg-red-50 border-gray-300 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200">
										<Square className="h-4 w-4" />
										End Session
									</Button>
								</DialogTrigger>
								<DialogContent className="bg-white/95 backdrop-blur-sm">
									<DialogHeader>
										<DialogTitle className="flex items-center gap-2 text-xl">
											<AlertTriangle className="h-5 w-5 text-orange-600" />
											End Practice Session?
										</DialogTitle>
										<DialogDescription className="text-base">
											Are you sure you want to end this practice session? Your
											progress will be saved and you&apos;ll be taken to the
											results page.
										</DialogDescription>
									</DialogHeader>
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 my-4">
										<div className="text-sm text-blue-800">
											<p className="font-medium mb-2">Current Progress:</p>
											<ul className="space-y-1">
												<li>
													• Completed: {session.currentQuestionIndex} of{" "}
													{session.questions.length} questions
												</li>
												<li>
													• Time used:{" "}
													{formatTime(
														session.totalTime - session.timeRemaining
													)}{" "}
													of {formatTime(session.totalTime)}
												</li>
												<li>• Progress: {Math.round(progress)}%</li>
											</ul>
										</div>
									</div>
									<div className="flex justify-end gap-3">
										<Button variant="outline" className="bg-white">
											Continue Session
										</Button>
										<Button
											onClick={onEndSession}
											className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
											<Square className="h-4 w-4 mr-2" />
											End Session
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</div>

				{/* Warning Banner for Low Time */}
				{isLowTime && (
					<div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
						<div className="flex items-center gap-2 text-orange-800">
							<AlertTriangle className="h-4 w-4" />
							<span className="text-sm font-medium">
								{isCriticalTime
									? "⚠️ Less than 1 minute remaining!"
									: "⏰ Time is running low - consider wrapping up your current answer"}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
