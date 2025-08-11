/**
 * Demonstration of Session Persistence System
 *
 * This file shows how the session persistence system works in practice.
 * Run this in the browser console while on the practice page to test.
 */

import { SessionPersistence } from "./sessionPersistence";

// Example: Testing Session Persistence
const testSessionPersistence = () => {
	console.log("🧪 Testing Session Persistence System");

	// Check if there's a persisted session
	const hasSession = SessionPersistence.hasPersistedSession();
	console.log("📂 Has persisted session:", hasSession);

	if (hasSession) {
		const session = SessionPersistence.loadSession();
		console.log("📋 Loaded session:", session);

		const timeoutInfo = SessionPersistence.getTimeoutInfo();
		console.log("⏰ Session timeout info:", timeoutInfo);
	}

	// Example session data for testing
	const mockSession = {
		session: {
			_id: "test-session-123",
			questions: [
				{
					_id: "q1",
					title: "What is React?",
					content: "Explain React...",
					difficulty: "Easy",
				},
				{
					_id: "q2",
					title: "What is TypeScript?",
					content: "Explain TypeScript...",
					difficulty: "Medium",
				},
			],
			currentQuestionIndex: 0,
			timeRemaining: 1800, // 30 minutes
			totalTime: 3600,
			isActive: true,
			isPaused: false,
			answers: { q1: "React is a JavaScript library..." },
			startTime: new Date(),
			endTime: null,
			settings: {
				duration: 60,
				questionCount: 5,
				difficulty: "Mixed",
				categories: ["React", "TypeScript"],
				source: "ai",
			},
		},
		sessionState: "active" as const,
		settings: {
			duration: 60,
			questionCount: 5,
			difficulty: "Mixed",
			categories: ["React", "TypeScript"],
			source: "ai",
		},
		currentAnswer: "React is a JavaScript library...",
		lastActive: Date.now(),
	};

	// Save test session
	console.log("💾 Saving mock session...");
	SessionPersistence.saveSession(mockSession);

	// Load it back
	const loadedSession = SessionPersistence.loadSession();
	console.log("📥 Loaded mock session:", loadedSession);

	// Update last active
	SessionPersistence.updateLastActive();
	console.log("🔄 Updated last active timestamp");

	// Clean up
	setTimeout(() => {
		SessionPersistence.clearSession();
		console.log("🧹 Cleaned up test session");
	}, 5000);
};

// Example: Simulating Page Reload Scenario
const simulatePageReload = () => {
	console.log("🔄 Simulating page reload scenario...");

	// 1. User starts a session (this would happen in the component)
	const activeSession = {
		session: {
			_id: "reload-test-456",
			currentQuestionIndex: 2, // User is on question 3
			timeRemaining: 900, // 15 minutes left
			answers: {
				q1: "Answer to question 1",
				q2: "Answer to question 2",
				q3: "Partial answer to question 3...",
			},
			// ... other session data
		},
		sessionState: "active" as const,
		// ... other data
	};

	// 2. Session gets saved automatically (this happens in useEffect)
	console.log("💾 Session saved before reload");

	// 3. Page reloads (simulated by clearing memory state)
	console.log("🔄 Page reloaded - memory state cleared");

	// 4. On page load, system checks for persisted session
	console.log("🔍 Checking for persisted session...");
	const hasPersistedSession = SessionPersistence.hasPersistedSession();

	if (hasPersistedSession) {
		console.log("✅ Found persisted session!");
		const restored = SessionPersistence.loadSession();
		console.log("📋 Restored session data:", {
			sessionId: restored?.session._id,
			currentQuestion: restored?.session.currentQuestionIndex,
			timeRemaining: restored?.session.timeRemaining,
			answeredQuestions: Object.keys(restored?.session.answers || {}).length,
		});

		// 5. Backend validation would happen here
		console.log("🔍 Validating with backend...");
		// practiceServices.validateSession(restored.session._id)

		// 6. Show restoration banner to user
		console.log("🎉 Showing session restored banner");
		console.log("👤 User can choose to continue or start fresh");
	} else {
		console.log("❌ No persisted session found - starting fresh");
	}
};

// Example: Testing Session Timeout
const testSessionTimeout = () => {
	console.log("⏰ Testing session timeout...");

	// Create a session that's "old"
	const oldSession = {
		session: { _id: "timeout-test-789" },
		sessionState: "active" as const,
		settings: {
			duration: 60,
			questionCount: 5,
			difficulty: "Easy",
			categories: [],
			source: "ai",
		},
		currentAnswer: "",
		lastActive: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
	};

	// Manually set old timestamp
	localStorage.setItem(
		"practice_last_active",
		(Date.now() - 25 * 60 * 60 * 1000).toString()
	);
	localStorage.setItem("practice_session", JSON.stringify(oldSession.session));
	localStorage.setItem("practice_session_state", oldSession.sessionState);

	// Try to load - should return null due to timeout
	const loadedSession = SessionPersistence.loadSession();
	console.log("📥 Loaded expired session:", loadedSession); // Should be null

	// Check if localStorage was cleaned up
	const hasSession = SessionPersistence.hasPersistedSession();
	console.log("📂 Has session after timeout:", hasSession); // Should be false
};

// Export for testing
if (typeof window !== "undefined") {
	(window as any).testSessionPersistence = testSessionPersistence;
	(window as any).simulatePageReload = simulatePageReload;
	(window as any).testSessionTimeout = testSessionTimeout;

	console.log("🎯 Session Persistence Test Functions Loaded!");
	console.log("Run these in console:");
	console.log("- testSessionPersistence()");
	console.log("- simulatePageReload()");
	console.log("- testSessionTimeout()");
}
