import { API_URL } from "@/constants/api";
import { authenticatedInstance } from "@/utils/axios";

export interface AnalyticsOverview {
	totalQuestions: number;
	totalCorrect: number;
	totalPracticeTime: number;
	accuracy: number;
	currentStreak: number;
	longestStreak: number;
	weeklyGrowth: number;
}

export interface CategoryPerformance {
	name: string;
	attempted: number;
	correct: number;
	averageTime: number;
	accuracy: number;
}

export interface DifficultyStats {
	easy: { attempted: number; correct: number; accuracy: number };
	medium: { attempted: number; correct: number; accuracy: number };
	hard: { attempted: number; correct: number; accuracy: number };
}

export interface RecentActivity {
	date: string;
	questionsAnswered: number;
	practiceTime: number;
	accuracy: number;
	correctAnswers: number;
}

export interface DashboardAnalytics {
	overview: AnalyticsOverview;
	categoryPerformance: CategoryPerformance[];
	difficultyStats: DifficultyStats;
	recentActivity: RecentActivity[];
	achievements: any[];
	timeRange: number;
}

export interface AIInsight {
	type: "positive" | "warning" | "suggestion";
	title: string;
	message: string;
	icon: string;
}

export interface AIInsightsData {
	insights: AIInsight[];
	overallAccuracy: string;
	totalQuestions: number;
	activeDays: number;
	consistencyRate: string;
}

export interface ActivityDay {
	date: string;
	questionsAnswered: number;
	practiceTime: number;
	sessionsCount: number;
	accuracy: number;
	level: number; // 0-4 for GitHub-style intensity
}

export interface ActivityPatterns {
	activityData: ActivityDay[];
	streaks: {
		current: number;
		longest: number;
	};
	timeDistribution: {
		morning: number;
		afternoon: number;
		evening: number;
		night: number;
	};
	weeklyPattern: number[]; // 7 elements for each day of week
	peakHour: number;
	stats: {
		totalQuestions: number;
		totalPracticeTime: number;
		activeDays: number;
		averageDaily: number;
		totalDays: number;
		consistencyRate: string;
	};
}

class AnalyticsService {
	async getDashboardAnalytics(
		timeRange: number = 30
	): Promise<DashboardAnalytics> {
		const response = await authenticatedInstance.get(
			`${API_URL}/analytics/dashboard?timeRange=${timeRange}`
		);
		return response.data.data;
	}

	async getPerformanceAnalytics(
		params: {
			timeRange?: number;
			category?: string;
			difficulty?: string;
		} = {}
	) {
		const queryParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value) queryParams.append(key, value.toString());
		});

		const response = await authenticatedInstance.get(
			`${API_URL}/analytics/performance?${queryParams.toString()}`
		);
		return response.data.data;
	}

	async getAIInsights(timeRange: number = 30): Promise<AIInsightsData> {
		const response = await authenticatedInstance.get(
			`${API_URL}/analytics/insights?timeRange=${timeRange}`
		);
		return response.data.data;
	}

	async getActivityPatterns(
		timeRange: number = 365
	): Promise<ActivityPatterns> {
		const response = await authenticatedInstance.get(
			`${API_URL}/analytics/activity-patterns?timeRange=${timeRange}`
		);
		return response.data.data;
	}

	async updateUserStats() {
		const response = await authenticatedInstance.post(
			`${API_URL}/analytics/update-stats`,
			{}
		);
		return response.data;
	}
}

export const analyticsService = new AnalyticsService();
