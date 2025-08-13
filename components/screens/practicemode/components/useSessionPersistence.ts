import { practiceServices } from "@/services/practiceservices/practice-services";
import { useEffect, useState } from "react";
import { PracticeSession, PracticeSettings, SessionState } from "../types";
import { PersistedSession, SessionPersistence } from "./sessionPersistence";

interface UseSessionPersistenceResult {
	isRestoring: boolean;
	restoredSession: PersistedSession | null;
	hasPersistedSession: boolean;
	saveSession: (
		session: PracticeSession,
		sessionState: SessionState,
		settings: PracticeSettings,
		currentAnswer: string
	) => void;
	clearPersistedSession: () => void;
	updateLastActive: () => void;
}

export function useSessionPersistence(): UseSessionPersistenceResult {
	const [isRestoring, setIsRestoring] = useState(false);
	const [restoredSession, setRestoredSession] =
		useState<PersistedSession | null>(null);
	const [hasPersistedSession, setHasPersistedSession] = useState(false);

	useEffect(() => {
		const restoreSession = async () => {
			setIsRestoring(true);

			try {
				// Check if there's a persisted session
				const persistedSession = SessionPersistence.loadSession();

				if (persistedSession) {
					// Validate session with backend
					const validation = await practiceServices.validateSession(
						persistedSession.session._id
					);

					if (validation.success && validation.data?.isValid) {
						// Session is valid, restore it
						setRestoredSession(persistedSession);
						setHasPersistedSession(true);
					} else {
						// Session is invalid, clear it
						SessionPersistence.clearSession();
						setHasPersistedSession(false);
					}
				}
			} catch (error) {
				console.error("Failed to restore session:", error);
				// Clear invalid session data
				SessionPersistence.clearSession();
				setHasPersistedSession(false);
			} finally {
				setIsRestoring(false);
			}
		};

		// Only try to restore on client side
		if (typeof window !== "undefined") {
			restoreSession();
		}
	}, []);

	const saveSession = (
		session: PracticeSession,
		sessionState: SessionState,
		settings: PracticeSettings,
		currentAnswer: string
	) => {
		if (typeof window !== "undefined") {
			const persistData: PersistedSession = {
				session,
				sessionState,
				settings,
				currentAnswer,
				lastActive: Date.now(),
			};

			SessionPersistence.saveSession(persistData);
			setHasPersistedSession(true);
		}
	};

	const clearPersistedSession = () => {
		if (typeof window !== "undefined") {
			SessionPersistence.clearSession();
			setHasPersistedSession(false);
			setRestoredSession(null);
		}
	};

	const updateLastActive = () => {
		if (typeof window !== "undefined" && hasPersistedSession) {
			SessionPersistence.updateLastActive();
		}
	};

	return {
		isRestoring,
		restoredSession,
		hasPersistedSession,
		saveSession,
		clearPersistedSession,
		updateLastActive,
	};
}
