import { API_URL } from "@/constants/api";
import {
	GetAllQuestionsResponseType,
	GetSingleQuestionResponseType,
} from "@/types/interfaces/questions/getQuestion-type";
import { fetchWithTimeout, getAuthHeaders } from "./analytics-actions";

async function getMyQuestionsData(
	page: number = 1,
	pageSize: number = 10
): Promise<{
	pagination: {
		current: number;
		total: number;
		totalPages: number;
		limit: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	results: GetAllQuestionsResponseType[];
} | null> {
	try {
		const headers = await getAuthHeaders();
		const response = await fetchWithTimeout(
			`${API_URL}/questions/my-questions?page=${page}&pageSize=${pageSize}`,
			{
				headers,
				cache: "no-store",
			},
			15000 // 15 second timeout
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch my questions: ${response.status} ${response.statusText}`
			);
		}
		const data = await response.json();
		console.log(data);
		return data.data;
	} catch (error) {
		console.error("Error fetching my questions data:", error);
		return null;
	}
}
export async function fetchMyQuestions(
	page: number = 2,
	pageSize: number = 5
): Promise<{
	pagination: {
		current: number;
		total: number;
		totalPages: number;
		limit: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	results: GetAllQuestionsResponseType[];
} | null> {
	try {
		const myQuestionsData = await getMyQuestionsData(page, pageSize);
		return myQuestionsData;
	} catch (error) {
		console.error("Error in fetchMyQuestions:", error);
		return null;
	}
}

async function getMyLikedQuestions(): Promise<{
	pagination: {
		current: number;
		total: number;
		totalPages: number;
		limit: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	results: GetAllQuestionsResponseType[];
}> {
	try {
		const headers = await getAuthHeaders();
		const response = await fetchWithTimeout(
			`${API_URL}/questions/my-likes`,
			{
				headers,
				cache: "no-store",
			},
			15000 // 15 second timeout
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch my liked questions: ${response.status} ${response.statusText}`
			);
		}
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching my liked questions:", error);
		throw error;
	}
}

export async function fetchMyLikedQuestions(): Promise<{
	pagination: {
		current: number;
		total: number;
		totalPages: number;
		limit: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	results: GetAllQuestionsResponseType[];
} | null> {
	try {
		const myLikedQuestionsData = await getMyLikedQuestions();
		return myLikedQuestionsData;
	} catch (error) {
		console.error("Error in fetchMyLikedQuestions:", error);
		return null;
	}
}

// Admin Review Actions
async function getReviewStatistics(): Promise<{
	statistics: {
		pending: number;
		inReview: number;
		approved: number;
		rejected: number;
		total: number;
		approvalRate: string;
	};
	recentReviews: GetAllQuestionsResponseType[];
} | null> {
	try {
		const headers = await getAuthHeaders();
		const response = await fetchWithTimeout(
			`${API_URL}/questions/admin/review-stats`,
			{
				headers,
				cache: "no-store",
			},
			15000
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch review stats: ${response.status} ${response.statusText}`
			);
		}
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching review statistics:", error);
		return null;
	}
}

async function getPendingQuestions(reviewStatus: string = "pending"): Promise<{
	pagination: {
		current: number;
		total: number;
		pages: number;
		limit: number;
	};
	results: GetAllQuestionsResponseType[];
} | null> {
	try {
		const headers = await getAuthHeaders();
		const response = await fetchWithTimeout(
			`${API_URL}/questions/admin/pending?reviewStatus=${reviewStatus}`,
			{
				headers,
				cache: "no-store",
			},
			15000
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch pending questions: ${response.status} ${response.statusText}`
			);
		}
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching pending questions:", error);
		return null;
	}
}

async function getQuestionForReview(
	id: string
): Promise<GetSingleQuestionResponseType | null> {
	try {
		const headers = await getAuthHeaders();
		const response = await fetchWithTimeout(
			`${API_URL}/questions/admin/review/${id}`,
			{
				headers,
				cache: "no-store",
			},
			15000
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch question: ${response.status} ${response.statusText}`
			);
		}
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching question for review:", error);
		return null;
	}
}

export async function fetchAdminReviewData(): Promise<{
	stats: {
		statistics: {
			pending: number;
			inReview: number;
			approved: number;
			rejected: number;
			total: number;
			approvalRate: string;
		};
		recentReviews: GetAllQuestionsResponseType[];
	} | null;
	pendingQuestions: GetAllQuestionsResponseType[];
	inReviewQuestions: GetAllQuestionsResponseType[];
}> {
	try {
		const [stats, pending, inReview] = await Promise.all([
			getReviewStatistics(),
			getPendingQuestions("pending"),
			getPendingQuestions("in_review"),
		]);

		return {
			stats,
			pendingQuestions: pending?.results || [],
			inReviewQuestions: inReview?.results || [],
		};
	} catch (error) {
		console.error("Error in fetchAdminReviewData:", error);
		return {
			stats: null,
			pendingQuestions: [],
			inReviewQuestions: [],
		};
	}
}

export async function fetchQuestionForReview(
	id: string
): Promise<GetSingleQuestionResponseType | null> {
	try {
		const questionData = await getQuestionForReview(id);
		return questionData;
	} catch (error) {
		console.error("Error in fetchQuestionForReview:", error);
		return null;
	}
}
