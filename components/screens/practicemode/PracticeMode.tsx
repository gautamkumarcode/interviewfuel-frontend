"use client";

import { ActiveSession } from "./components/ActiveSession";
import { CompletedSession } from "./components/CompletedSession";
import { PracticeSetup } from "./components/PracticeSetup";
import { usePracticeSession } from "./components/usePracticeSession";

const initialSettings = {
	duration: 60, // minutes
	questionCount: 5,
	difficulty: "Mixed",
	categories: [], // Storing an array for now, even if it has one item
	includeTimer: true,
	source: "ai" as const, // Added source field
};

export function PracticeMode() {
	const {
		sessionState,
		session,
		settings,
		currentAnswer,
		isLoading,
		isRestoring,
		isSessionRestored,
		setSettings,
		setCurrentAnswer,
		startSession,
		pauseSession,
		nextQuestion,
		previousQuestion,
		resetToSetup,
	} = usePracticeSession({ initialSettings });

	// Show loading state during restoration
	if (isRestoring) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Restoring your practice session...</p>
				</div>
			</div>
		);
	}

	// Renders the setup screen if the state is 'setup'
	if (sessionState === "setup") {
		return (
			<PracticeSetup
				settings={settings}
				onSettingsChange={setSettings}
				onStartSession={startSession}
			/>
		);
	}

	// Renders the active session if the state is 'active'
	if (sessionState === "active" && session) {
		return (
			<ActiveSession
				session={session}
				currentAnswer={currentAnswer}
				onAnswerChange={setCurrentAnswer}
				onPauseResume={pauseSession}
				onEndSession={resetToSetup}
				onNext={nextQuestion}
				onPrevious={previousQuestion}
				isRestored={isSessionRestored}
			/>
		);
	}

	// Renders the completed screen if the state is 'completed'
	if (sessionState === "completed" && session) {
		return (
			<CompletedSession
				session={session}
				onNewSession={resetToSetup}
				previousQuestion={previousQuestion}
			/>
		);
	}

	return null;
}
