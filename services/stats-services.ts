import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface LandingStats {
	users: {
		total: number;
		formatted: string;
		label: string;
	};
	questions: {
		total: number;
		formatted: string;
		label: string;
	};
	successRate: {
		total: number;
		formatted: string;
		label: string;
	};
	companies: {
		total: number;
		formatted: string;
		label: string;
	};
	categories?: {
		total: number;
		formatted: string;
		label: string;
	};
	practiceHours?: {
		total: number;
		formatted: string;
		label: string;
	};
	sessions?: {
		total: number;
		formatted: string;
		label: string;
	};
}

export interface RecentActivity {
	recentSessions: Array<{
		userId: {
			name: string;
			userName: string;
			avatar?: string;
		};
		score: number;
		completedAt: string;
	}>;
	recentQuestions: Array<{
		title: string;
		category: {
			name: string;
		};
		difficulty: string;
		createdAt: string;
	}>;
	topPerformers: Array<{
		name: string;
		userName: string;
		avatar?: string;
		stats: {
			questionsAnswered: number;
			currentStreak: number;
		};
	}>;
}

export interface TrendingData {
	trendingCategories: Array<{
		_id: string;
		name: string;
		description: string;
		icon?: string;
		questionCount: number;
	}>;
	popularQuestions: Array<{
		_id: string;
		title: string;
		category: {
			name: string;
		};
		difficulty: string;
		stats: {
			views: number;
			likes: number;
			bookmarks: number;
		};
	}>;
}

/**
 * Fetch landing page statistics
 */
export const getLandingStats = async (): Promise<LandingStats> => {
	try {
		const response = await axios.get(`${API_URL}/api/stats/landing`);
		return response.data.data;
	} catch (error) {
		console.error("Error fetching landing stats:", error);
		throw error;
	}
};

/**
 * Fetch recent activity
 */
export const getRecentActivity = async (
	limit: number = 10
): Promise<RecentActivity> => {
	try {
		const response = await axios.get(`${API_URL}/api/stats/activity`, {
			params: { limit },
		});
		return response.data.data;
	} catch (error) {
		console.error("Error fetching recent activity:", error);
		throw error;
	}
};

/**
 * Fetch trending topics
 */
export const getTrendingTopics = async (
	limit: number = 6
): Promise<TrendingData> => {
	try {
		const response = await axios.get(`${API_URL}/api/stats/trending`, {
			params: { limit },
		});
		return response.data.data;
	} catch (error) {
		console.error("Error fetching trending topics:", error);
		throw error;
	}
};
