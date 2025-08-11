export interface PracticeQuestion {
	_id: string;
	title: string;
	content: string;
	difficulty: string;
	timeLimit?: number;
	aiGenerated?: boolean;
	source?: string;
	startedAt?: string;
}

export interface PracticeSession {
	_id: string; // Unique identifier for the session
	questions: PracticeQuestion[];
	currentQuestionIndex: number;
	timeRemaining: number;
	totalTime: number;
	isActive: boolean;
	isPaused: boolean;
	answers: { [key: string]: string }; // Changed to string keys to match _id
	startTime: Date | null;
	endTime: Date | null;
	settings: PracticeSettings; // Settings used for this session
}

export interface PracticeSettings {
	duration: number; // minutes
	questionCount: number;
	difficulty: string;
	categories: string[]; // Changed from category to categories array
	source: string; // Added source field
}

export interface CreatePracticeSessionPayload {
	settings: {
		duration: number;
		questionCount: number;
		difficulty: string;
		categories: string[];
		source: string;
	};
}

export type SessionState = "setup" | "active" | "completed";

export interface SessionResults {
	answeredQuestions: number;
	totalQuestions: number;
	completionRate: number;
	timeUsed: number;
	avgTimePerQuestion: number;
}

export interface CreatePracticeSessionResponseType {
	session: {
		user: string;
		title: string;
		questions: PracticeQuestion[];
		settings: {
			duration: number;
			questionCount: number;
			difficulty: string;
			categories: string[];
			includeTimer: boolean;
			randomOrder: boolean;
			source?: string;
		};
		results: {
			totalQuestions: number;
			answeredQuestions: number;
			correctAnswers: number;
			completionRate: number;
			accuracy: number;
			totalTimeSpent: number;
			averageTimePerQuestion: number;
		};
		status: string;
		totalPausedTime: number;
		_id: string;
		startedAt: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
}

// Additional types for the new API endpoints
export interface SubmitAnswerPayload {
	answers: Array<{
		questionIndex: number;
		answer: string;
		timeSpent?: number;
	}>;
}

export interface SubmitAnswerResponse {
	success: boolean;
	message: string;
	data?: Array<{
		score: number;
		feedback: string;
		notes?: string;
	}>;
}

export interface CompleteSessionResponse {
	success: boolean;
	message: string;
	data?: {
		session: PracticeSession;
		finalResults: {
			totalQuestions: number;
			answeredQuestions: number;
			correctAnswers: number;
			completionRate: number;
			accuracy: number;
			totalTimeSpent: number;
			averageTimePerQuestion: number;
		};
	};
}

export interface GetSessionResponse {
	success: boolean;
	message: string;
	data?: {
		session: PracticeSession;
	};
}

export interface GetUserSessionsResponse {
	success: boolean;
	message: string;
	data?: {
		sessions: PracticeSession[];
		pagination?: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	};
}

export interface Question {
	aiGenerated: boolean;
	title: string;
	content: string;
	difficulty: Difficulty;
	timeLimit: number;
	source: Source;
	startedAt: Date;
	_id: string;
}

export enum Difficulty {
	Medium = "Medium",
}

export enum Source {
	AI = "ai",
}

export interface Results {
	totalQuestions: number;
	answeredQuestions: number;
	correctAnswers: number;
	completionRate: number;
	accuracy: number;
	totalTimeSpent: number;
	averageTimePerQuestion: number;
}

export interface Settings {
	duration: number;
	questionCount: number;
	difficulty: Difficulty;
	categories: string[];
	includeTimer: boolean;
	randomOrder: boolean;
	source: Source;
}
