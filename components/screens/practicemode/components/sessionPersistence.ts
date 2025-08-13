import { PracticeSession, PracticeSettings, SessionState } from "../types";

const STORAGE_KEYS = {
	SESSION: "practice_session",
	SESSION_STATE: "practice_session_state",
	SETTINGS: "practice_settings",
	CURRENT_ANSWER: "practice_current_answer",
	LAST_ACTIVE: "practice_last_active",
} as const;

// Session timeout - 24 hours
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

export interface PersistedSession {
	session: PracticeSession;
	sessionState: SessionState;
	settings: PracticeSettings;
	currentAnswer: string;
	lastActive: number;
}

export class SessionPersistence {
	/**
	 * Save current session state to localStorage
	 */
	static saveSession(data: PersistedSession): void {
		try {
			localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data.session));
			localStorage.setItem(STORAGE_KEYS.SESSION_STATE, data.sessionState);
			localStorage.setItem(
				STORAGE_KEYS.SETTINGS,
				JSON.stringify(data.settings)
			);
			localStorage.setItem(STORAGE_KEYS.CURRENT_ANSWER, data.currentAnswer);
			localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
		} catch (error) {
			console.warn("Failed to save session to localStorage:", error);
		}
	}

	/**
	 * Load session state from localStorage
	 */
	static loadSession(): PersistedSession | null {
		try {
			const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
			const sessionState = localStorage.getItem(
				STORAGE_KEYS.SESSION_STATE
			) as SessionState;
			const settingsData = localStorage.getItem(STORAGE_KEYS.SETTINGS);
			const currentAnswer = localStorage.getItem(STORAGE_KEYS.CURRENT_ANSWER);
			const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);

			// Check if all required data exists
			if (!sessionData || !sessionState || !settingsData || !lastActive) {
				return null;
			}

			// Check if session is expired
			const lastActiveTime = parseInt(lastActive, 10);
			if (Date.now() - lastActiveTime > SESSION_TIMEOUT) {
				this.clearSession();
				return null;
			}

			// Only restore active or completed sessions, not setup
			if (sessionState === "setup") {
				return null;
			}

			return {
				session: JSON.parse(sessionData),
				sessionState,
				settings: JSON.parse(settingsData),
				currentAnswer: currentAnswer || "",
				lastActive: lastActiveTime,
			};
		} catch (error) {
			console.warn("Failed to load session from localStorage:", error);
			this.clearSession();
			return null;
		}
	}

	/**
	 * Clear session data from localStorage
	 */
	static clearSession(): void {
		try {
			Object.values(STORAGE_KEYS).forEach((key) => {
				localStorage.removeItem(key);
			});
		} catch (error) {
			console.warn("Failed to clear session from localStorage:", error);
		}
	}

	/**
	 * Update last active timestamp
	 */
	static updateLastActive(): void {
		try {
			localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
		} catch (error) {
			console.warn("Failed to update last active timestamp:", error);
		}
	}

	/**
	 * Check if there's a persisted session
	 */
	static hasPersistedSession(): boolean {
		return this.loadSession() !== null;
	}

	/**
	 * Get session timeout info
	 */
	static getTimeoutInfo(): { isExpired: boolean; timeRemaining: number } {
		const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
		if (!lastActive) {
			return { isExpired: true, timeRemaining: 0 };
		}

		const lastActiveTime = parseInt(lastActive, 10);
		const timeElapsed = Date.now() - lastActiveTime;
		const timeRemaining = Math.max(0, SESSION_TIMEOUT - timeElapsed);

		return {
			isExpired: timeElapsed > SESSION_TIMEOUT,
			timeRemaining,
		};
	}
}
