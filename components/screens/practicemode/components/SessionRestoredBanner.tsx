import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, RefreshCcw, X } from "lucide-react";
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
		<Card className="mb-6 border-blue-200 bg-blue-50">
			<CardContent className="p-4">
				<div className="flex items-start gap-3">
					<AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
					<div className="flex-1">
						<h3 className="font-semibold text-blue-900 mb-1">
							Session Restored
						</h3>
						<p className="text-blue-800 text-sm mb-3">
							We found your previous practice session and restored your
							progress.
						</p>
						<div className="flex items-center gap-4 text-sm text-blue-700 mb-3">
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								<span>{formatTime(timeRemaining)} remaining</span>
							</div>
							<div>
								Question {currentQuestionIndex + 1} of {totalQuestions}
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={handleDismiss}
								className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100">
								Continue Session
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={handleStartFresh}
								className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100">
								<RefreshCcw className="h-3 w-3 mr-1" />
								Start Fresh
							</Button>
						</div>
					</div>
					<button
						onClick={handleDismiss}
						className="text-blue-400 hover:text-blue-600 p-1"
						aria-label="Close banner">
						<X className="h-4 w-4" />
					</button>
				</div>
			</CardContent>
		</Card>
	);
}
