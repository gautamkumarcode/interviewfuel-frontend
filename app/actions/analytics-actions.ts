import { API_URL } from "@/constants/api";
import { authOptions } from "@/lib/auth";
import {
	ActivityPatterns,
	AIInsightsData,
	DashboardAnalytics,
} from "@/services/analytics/analytics-services";
import { getServerSession } from "next-auth";

export async function getAuthHeaders() {
	const session = await getServerSession(authOptions);
	if (!session?.accessToken) {
		throw new Error("No authentication token");
	}
	return {
		Authorization: `Bearer ${session.accessToken}`,
		"Content-Type": "application/json",
	};
}

// Create a fetch wrapper with timeout and better error handling
export async function fetchWithTimeout(
	url: string,
	options: RequestInit = {},
	timeoutMs: number = 10000
) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === "AbortError") {
			throw new Error(`Request timeout after ${timeoutMs}ms`);
		}
		throw error;
	}
}

export async function getDashboardAnalyticsData(
	timeRange: number = 30
): Promise<DashboardAnalytics | null> {
	try {
		const headers = await getAuthHeaders();
		const response = await fetchWithTimeout(
			`${API_URL}/analytics/dashboard?timeRange=${timeRange}`,
			{
				headers,
				cache: "no-store",
			},
			15000 // 15 second timeout
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch dashboard analytics: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching dashboard analytics:", error);
		return null;
	}
}

export async function getActivityPatternsData(
	timeRange: number = 365
): Promise<ActivityPatterns | null> {
	try {
		const headers = await getAuthHeaders();
		const response = await fetchWithTimeout(
			`${API_URL}/analytics/activity-patterns?timeRange=${timeRange}`,
			{
				headers,
				cache: "no-store",
			},
			20000 // 20 second timeout for activity patterns (more data)
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch activity patterns data: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching activity patterns data:", error);
		return null;
	}
}

export async function getAIInsightsData(
	timeRange: number = 30
): Promise<AIInsightsData | null> {
	try {
		const headers = await getAuthHeaders();
		const response = await fetchWithTimeout(
			`${API_URL}/analytics/insights?timeRange=${timeRange}`,
			{
				headers,
				cache: "no-store",
			},
			25000 // 15 second timeout
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch AI insights: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching AI insights:", error);
		return null;
	}
}

export async function getPerformanceAnalyticsData(
	params: {
		timeRange?: number;
		category?: string;
		difficulty?: string;
	} = {}
) {
	try {
		const headers = await getAuthHeaders();
		const queryParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value) queryParams.append(key, value.toString());
		});

		const response = await fetch(
			`${API_URL}/analytics/performance?${queryParams.toString()}`,
			{
				headers,
				cache: "no-store",
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch performance analytics");
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching performance analytics:", error);
		return null;
	}
}
