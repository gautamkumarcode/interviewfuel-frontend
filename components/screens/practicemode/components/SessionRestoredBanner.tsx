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
		<Card className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
			<CardContent className="p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
					{/* Icon - Hidden on mobile, shown on tablet+ */}
					<div className="hidden sm:block p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md flex-shrink-0">
						<RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
					</div>

					<div className="flex-1 w-full">
						{/* Header */}
						<div className="flex items-start justify-between mb-3 gap-2">
							<div className="flex items-center gap-2">
								{/* Icon for mobile only */}
								<div className="sm:hidden p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md flex-shrink-0">
									<RotateCcw className="h-4 w-4 text-white" />
								</div>
								<h3 className="text-lg sm:text-xl font-bold text-blue-900">
									Welcome Back! 🎯
								</h3>
							</div>
							<button
								onClick={handleDismiss}
								className="text-blue-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors flex-shrink-0"
								aria-label="Close banner">
								<X className="h-4 w-4 sm:h-5 sm:w-5" />
							</button>
						</div>

						<p className="text-sm sm:text-base text-blue-800 mb-4">
							We found your previous practice session and restored your
							progress. You can continue where you left off or start fresh.
						</p>

						{/* Progress Overview */}
						<div className="bg-white/60 backdrop-blur-sm border border-blue-200 rounded-xl p-3 sm:p-4 mb-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
								<div className="flex items-center gap-2 sm:gap-3">
									<div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
										<Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
									</div>
									<div className="min-w-0">
										<p className="text-xs sm:text-sm text-gray-600">Progress</p>
										<p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
											{currentQuestionIndex + 1} of {totalQuestions}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2 sm:gap-3">
									<div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
										<Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
									</div>
									<div className="min-w-0">
										<p className="text-xs sm:text-sm text-gray-600">
											Time Left
										</p>
										<p className="font-semibold text-sm sm:text-base text-gray-900 font-mono">
											{formatTime(timeRemaining)}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2 sm:gap-3 sm:col-span-2 lg:col-span-1">
									<div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
										<CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
									</div>
									<div className="min-w-0">
										<p className="text-xs sm:text-sm text-gray-600">
											Completion
										</p>
										<p className="font-semibold text-sm sm:text-base text-gray-900">
											{Math.round(progress)}%
										</p>
									</div>
								</div>
							</div>

							<div className="mt-3 sm:mt-4">
								<div className="flex items-center justify-between mb-2 gap-2">
									<span className="text-xs sm:text-sm font-medium text-gray-700">
										Session Progress
									</span>
									<Badge
										variant="secondary"
										className="bg-blue-100 text-blue-700 text-xs">
										{Math.round(progress)}%
									</Badge>
								</div>
								<Progress value={progress} className="h-1.5 sm:h-2" />
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
							<Button
								onClick={handleDismiss}
								className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto text-sm sm:text-base">
								<Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								Continue Session
							</Button>

							<Button
								variant="outline"
								onClick={handleStartFresh}
								className="gap-2 bg-white/80 border-blue-300 text-blue-700 hover:bg-blue-50 w-full sm:w-auto text-sm sm:text-base">
								<RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								Start Fresh
							</Button>
						</div>

						<p className="text-xs text-blue-600 mt-2 sm:mt-3">
							💡 Your answers are automatically saved as you progress
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
