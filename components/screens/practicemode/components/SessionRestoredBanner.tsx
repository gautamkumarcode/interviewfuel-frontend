import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	CheckCircle2,
	Clock,
	Play,
	RefreshCcw,
	RotateCcw,
	Target,
	X,
} from "lucide-react";
import { useState } from "react";

interface SessionRestoredBannerProps {
	sessionId: string;
	timeRemaining: number;
	currentQuestionIndex: number;
	totalQuestions: number;
	onDismiss: () => void;
	onStartFresh: () => void;
}

export function SessionRestoredBanner({
	sessionId,
	timeRemaining,
	currentQuestionIndex,
	totalQuestions,
	onDismiss,
	onStartFresh,
}: SessionRestoredBannerProps) {
	const [isVisible, setIsVisible] = useState(true);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

	const handleDismiss = () => {
		setIsVisible(false);
		onDismiss();
	};

	const handleStartFresh = () => {
		setIsVisible(false);
		onStartFresh();
	};

	if (!isVisible) return null;

	return (
		<Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
			<CardContent className="p-6">
				<div className="flex items-start gap-4">
					<div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
						<RotateCcw className="h-6 w-6 text-white" />
					</div>

					<div className="flex-1">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-xl font-bold text-blue-900">
								Welcome Back! 🎯
							</h3>
							<button
								onClick={handleDismiss}
								className="text-blue-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors"
								aria-label="Close banner">
								<X className="h-5 w-5" />
							</button>
						</div>

						<p className="text-blue-800 mb-4">
							We found your previous practice session and restored your
							progress. You can continue where you left off or start fresh.
						</p>

						{/* Progress Overview */}
						<div className="bg-white/60 backdrop-blur-sm border border-blue-200 rounded-xl p-4 mb-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-blue-100 rounded-lg">
										<Target className="h-4 w-4 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Progress</p>
										<p className="font-semibold text-gray-900">
											{currentQuestionIndex + 1} of {totalQuestions}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="p-2 bg-green-100 rounded-lg">
										<Clock className="h-4 w-4 text-green-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Time Left</p>
										<p className="font-semibold text-gray-900 font-mono">
											{formatTime(timeRemaining)}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="p-2 bg-purple-100 rounded-lg">
										<CheckCircle2 className="h-4 w-4 text-purple-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Completion</p>
										<p className="font-semibold text-gray-900">
											{Math.round(progress)}%
										</p>
									</div>
								</div>
							</div>

							<div className="mt-4">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-gray-700">
										Session Progress
									</span>
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-700">
										{Math.round(progress)}%
									</Badge>
								</div>
								<Progress value={progress} className="h-2" />
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-3">
							<Button
								onClick={handleDismiss}
								className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
								<Play className="h-4 w-4" />
								Continue Session
							</Button>

							<Button
								variant="outline"
								onClick={handleStartFresh}
								className="gap-2 bg-white/80 border-blue-300 text-blue-700 hover:bg-blue-50">
								<RefreshCcw className="h-4 w-4" />
								Start Fresh
							</Button>
						</div>

						<p className="text-xs text-blue-600 mt-2">
							💡 Your answers are automatically saved as you progress
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
