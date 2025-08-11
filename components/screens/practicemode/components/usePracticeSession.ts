import { practiceServices } from "@/services/practiceservices/practice-services";
import { useEffect, useRef, useState } from "react";
import { PracticeSession, PracticeSettings, SessionState } from "../types";
import { useSessionPersistence } from "./useSessionPersistence";

interface UsePracticeSessionProps {
	initialSettings: PracticeSettings;
}

export function usePracticeSession({
	initialSettings,
}: UsePracticeSessionProps) {
	const [sessionState, setSessionState] = useState<SessionState>("setup");
	const [settings, setSettings] = useState<PracticeSettings>(initialSettings);
	const [session, setSession] = useState<PracticeSession | null>(null);
	const [currentAnswer, setCurrentAnswer] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSessionRestored, setIsSessionRestored] = useState<boolean>(false);

	// Persistence hook
	const {
		isRestoring,
		restoredSession,
		hasPersistedSession,
		saveSession: persistSession,
		clearPersistedSession,
		updateLastActive,
	} = useSessionPersistence();

	// Refs for timers
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

	// Restore session from persistence on component mount
	useEffect(() => {
		if (!isRestoring && restoredSession && !session) {
			console.log("Restoring session from persistence...");
			setSession(restoredSession.session);
			setSessionState(restoredSession.sessionState);
			setSettings(restoredSession.settings);
			setCurrentAnswer(restoredSession.currentAnswer);
			setIsSessionRestored(true);
		}
	}, [isRestoring, restoredSession, session]);

	// Save session state to persistence whenever it changes
	useEffect(() => {
		if (session && sessionState !== "setup" && !isRestoring) {
			persistSession(session, sessionState, settings, currentAnswer);
		}
	}, [
		session,
		sessionState,
		settings,
		currentAnswer,
		isRestoring,
		persistSession,
	]);

	// Update last active timestamp periodically
	useEffect(() => {
		if (sessionState === "active" && hasPersistedSession) {
			const interval = setInterval(updateLastActive, 30000); // Update every 30 seconds
			return () => clearInterval(interval);
		}
	}, [sessionState, hasPersistedSession, updateLastActive]);

	// Auto-save functionality - saves answer every 30 seconds
	useEffect(() => {
		if (session && currentAnswer && sessionState === "active" && session.isActive) {
			// Clear previous auto-save timer
			if (autoSaveRef.current) {
				clearTimeout(autoSaveRef.current);
			}

			// Set new auto-save timer
			autoSaveRef.current = setTimeout(() => {
				// Double-check session is still active before auto-saving
				if (sessionState === "active" && session.isActive) {
					practiceServices.autoSaveAnswer(
						session._id,
						session.currentQuestionIndex,
						currentAnswer
					);
				}
			}, 30000); // Auto-save every 30 seconds
		}

		return () => {
			if (autoSaveRef.current) {
				clearTimeout(autoSaveRef.current);
			}
		};
	}, [currentAnswer, session, sessionState]); // Add sessionState to dependencies

	// Timer effect for countdown
	useEffect(() => {
		if (
			session &&
			session.isActive &&
			!session.isPaused &&
			session.timeRemaining > 0 &&
			sessionState === "active" // Only run timer when session is active
		) {
			timerRef.current = setInterval(() => {
				setSession((prev) => {
					if (!prev) return prev;
					const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);

					// Auto-complete session when time runs out
					if (newTimeRemaining === 0) {
						practiceServices.completeSession(prev._id).catch(console.error);
						setSessionState("completed");
					}

					return {
						...prev,
						timeRemaining: newTimeRemaining,
					};
				});
			}, 1000);
		} else {
			// Clear timer if session is not active or completed
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [session?.isActive, session?.isPaused, session?.timeRemaining, sessionState]); // Add sessionState to dependencies

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
			if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
		};
	}, []);

	// Function to start a new session by calling the API
	const startSession = async () => {
		setIsLoading(true);
		try {
			// First, reset any old session data
			setSession(null);
			setCurrentAnswer("");
			setIsSessionRestored(false);

			// Clear any existing persistence
			clearPersistedSession();

			const payload = {
				settings: {
					...settings,
					categories:
						settings.categories.length > 0 ? settings.categories : ["Mixed"],
				},
			};

			const apiResponse = await practiceServices.createPracticeSession(payload);

			const { data } = apiResponse;
			const sessionData = data.session; // Access the session from the nested structure

			// On a successful API response, populate the session state
			const now = new Date();

			console.log(sessionData);
			const duration = sessionData.settings?.duration || 0;
			const newSession: PracticeSession = {
				_id: sessionData._id,
				isPaused: false,
				isActive: true,
				currentQuestionIndex: 0,
				questions: sessionData.questions.map((q: any) => ({
					_id: q._id,
					title: q.title,
					content: q.content,
					difficulty: q.difficulty,
					timeLimit: q.timeLimit,
					aiGenerated: q.aiGenerated,
					source: q.source,
					startedAt: q.startedAt,
				})),
				answers: {},
				startTime: now,
				endTime: null,
				timeRemaining: duration * 60, // assuming duration is in minutes, convert to seconds
				totalTime: duration * 60, // assuming duration is in minutes, convert to seconds
				settings: {
					duration: sessionData.settings.duration,
					questionCount: sessionData.settings.questionCount,
					difficulty: sessionData.settings.difficulty,
					categories: sessionData.settings.categories || [],
					source: sessionData.settings.source || "ai",
				},
			};

			setSession(newSession);
			setSessionState("active");
		} catch (error) {
			console.error("Failed to create practice session:", error);
			alert("Failed to create practice session. Please try again.");
			setSessionState("setup"); // Stay on setup screen on error
		} finally {
			setIsLoading(false);
		}
	};

	// Function to advance to the next question or finish the session
	const nextQuestion = async () => {
		if (!session) return;

		// Save the current answer locally (don't submit to backend yet)
		const updatedAnswers = {
			...session.answers,
			[session.questions[session.currentQuestionIndex]._id]: currentAnswer,
		};

		const isLastQuestion =
			session.currentQuestionIndex === session.questions.length - 1;

		if (isLastQuestion) {
			// If it's the last question, update local state and transition to 'completed'
			// The CompletedSession component will handle submitting all answers at once
			const updatedSession = { 
				...session, 
				answers: updatedAnswers,
				isActive: false, // Mark session as inactive when completed
				isPaused: false  // Ensure paused is false when completed
			};
			setSession(updatedSession);
			setSessionState("completed");
			
			// Clear persistence immediately when completing
			clearPersistedSession();
		} else {
			// Otherwise, move to the next question
			const updatedSession = {
				...session,
				answers: updatedAnswers,
				currentQuestionIndex: session.currentQuestionIndex + 1,
			};
			setSession(updatedSession);
			// Load the next question's answer if it exists, otherwise set to an empty string
			setCurrentAnswer(
				updatedSession.answers[
					updatedSession.questions[updatedSession.currentQuestionIndex]._id
				] || ""
			);
		}
	};

	// Function to go back to the previous question
	const previousQuestion = () => {
		if (!session || session.currentQuestionIndex === 0) return;

		// Save the current answer before moving back
		const updatedAnswers = {
			...session.answers,
			[session.questions[session.currentQuestionIndex]._id]: currentAnswer,
		};

		const newQuestionIndex = session.currentQuestionIndex - 1;
		const updatedSession = {
			...session,
			answers: updatedAnswers,
			currentQuestionIndex: newQuestionIndex,
		};
		setSession(updatedSession);
		// Load the previous question's answer
		setCurrentAnswer(
			updatedSession.answers[updatedSession.questions[newQuestionIndex]._id] ||
				""
		);
	};

	// Pauses or resumes the session timer
	const pauseSession = () => {
		if (session) {
			setSession({ ...session, isPaused: !session.isPaused });
		}
	};

	// Resets the entire flow back to the setup screen
	const resetToSetup = () => {
		// Clear persisted session data
		clearPersistedSession();

		setSessionState("setup");
		setSession(null);
		setCurrentAnswer("");
		setIsSessionRestored(false);
	};

	return {
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
		nextQuestion,
		previousQuestion,
		pauseSession,
		resetToSetup,
	};
}
