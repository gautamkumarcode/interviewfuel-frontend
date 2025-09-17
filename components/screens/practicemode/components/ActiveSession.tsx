"use client";

import { useEffect, useState } from "react";

import { PracticeSession } from "../types";
import { AnswerPanel } from "./AnswerPanel";
import { PauseOverlay } from "./PauseOverlay";
import { QuestionPanel } from "./QuestionPanel";
import { SessionHeader } from "./SessionHeader";
import { SessionPersistence } from "./sessionPersistence";
import { SessionRestoredBanner } from "./SessionRestoredBanner";

interface ActiveSessionProps {
	session: PracticeSession;
	currentAnswer: string;
	onAnswerChange: (answer: string) => void;
	onPauseResume: () => void;
	onEndSession: () => void;
	onNext: () => void;
	onPrevious: () => void;
	isRestored?: boolean;
}

export function ActiveSession({
	session,
	currentAnswer,
	onAnswerChange,
	onPauseResume,
	onEndSession,
	onNext,
	onPrevious,
	isRestored = false,
}: ActiveSessionProps) {
	const [showRestoredBanner, setShowRestoredBanner] = useState(false);
	const currentQuestion = session.questions[session.currentQuestionIndex];

	// Check if this session was restored from persistence
	useEffect(() => {
		if (isRestored) {
			setShowRestoredBanner(true);
		}
	}, [isRestored]);

	const handleStartFresh = () => {
		// Clear persistence and restart
		SessionPersistence.clearSession();
		onEndSession();
	};

	return (
		<div className=" mx-auto">
			{showRestoredBanner && (
				<SessionRestoredBanner
					sessionId={session._id}
					timeRemaining={session.timeRemaining}
					currentQuestionIndex={session.currentQuestionIndex}
					totalQuestions={session.questions.length}
					onDismiss={() => setShowRestoredBanner(false)}
					onStartFresh={handleStartFresh}
				/>
			)}

			<SessionHeader
				session={session}
				onPauseResume={onPauseResume}
				onEndSession={onEndSession}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
				<QuestionPanel question={currentQuestion} />

				<AnswerPanel
					currentAnswer={currentAnswer}
					onAnswerChange={onAnswerChange}
					onPrevious={() => {
						onPrevious();
					}}
					onNext={() => {
						onNext();
					}}
					canGoPrevious={session.currentQuestionIndex > 0}
					isLastQuestion={
						session.currentQuestionIndex === session.questions.length - 1
					}
				/>
			</div>

			<PauseOverlay isPaused={session.isPaused} onResume={onPauseResume} />
		</div>
	);
}
