import {
	CompleteSessionResponse,
	CreatePracticeSessionResponseType,
	GetSessionResponse,
	GetUserSessionsResponse,
	SubmitAnswerPayload,
	SubmitAnswerResponse,
} from "@/components/screens/practicemode/types";
import { apiEndPoint } from "@/constants/api";
import { AxiosResponseTypeWithoutPagination } from "@/types/axios-response";
import { authenticatedInstance } from "@/utils/axios";

interface CreatePracticeSessionPayload {
	settings: {
		duration: number;
		questionCount: number;
		difficulty: string;
		categories: string[];
		source: string;
	};
}

class PracticeServices {
	/**
	 * Create a new practice session
	 */
	public async createPracticeSession(
		payload: CreatePracticeSessionPayload
	): Promise<
		AxiosResponseTypeWithoutPagination<CreatePracticeSessionResponseType>
	> {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<CreatePracticeSessionResponseType>
		>(apiEndPoint.createPracticeSession, payload);
		return data;
	}

	/**
	 * Get a specific practice session by ID
	 */
	public async getPracticeSessionById(
		sessionId: string
	): Promise<AxiosResponseTypeWithoutPagination<GetSessionResponse>> {
		const { data } = await authenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<GetSessionResponse>
		>(`${apiEndPoint.getPracticeSession}/${sessionId}`);
		return data;
	}

	/**
	 * Validate if a session still exists and is accessible
	 */
	public async validateSession(
		sessionId: string
	): Promise<
		AxiosResponseTypeWithoutPagination<{ isValid: boolean; status?: string }>
	> {
		try {
			const response = await authenticatedInstance.get<
				AxiosResponseTypeWithoutPagination<GetSessionResponse>
			>(`${apiEndPoint.getPracticeSession}/${sessionId}`);

			// response.data is the AxiosResponseTypeWithoutPagination wrapper
			// response.data.data is the GetSessionResponse
			// response.data.data.data.session is the actual session
			const sessionResponse = response.data.data;
			const session = sessionResponse?.data?.session;

			return {
				success: true,
				message: "Session validation successful",
				data: {
					isValid: true,
					status: session?.isActive ? "active" : "completed",
				},
			};
		} catch (error: any) {
			// Session doesn't exist or is inaccessible
			return {
				success: true,
				message: "Session validation completed",
				data: { isValid: false },
			};
		}
	}

	/**
	 * Submit all answers at once for evaluation (works around backend validation)
	 */
	public async submitAllAnswers(
		sessionId: string,
		payload: SubmitAnswerPayload
	): Promise<AxiosResponseTypeWithoutPagination<SubmitAnswerResponse>> {
		try {
			// If backend validation expects individual fields, send the array directly
			// This matches the controller expectation: { answers: [...] }
			const { data } = await authenticatedInstance.put<
				AxiosResponseTypeWithoutPagination<SubmitAnswerResponse>
			>(`${apiEndPoint.submitAnswer}/${sessionId}/answer`, payload);
			return data;
		} catch (error: any) {
			// If the above fails due to validation mismatch, try alternative approach
			console.error(
				"Batch submission failed, trying alternative approach:",
				error
			);
			throw error; // Re-throw the original error for now
		}
	}

	/**
	 * Submit an answer to a question in a practice session (legacy - for single answer)
	 * @deprecated Use submitAllAnswers for batch submission
	 */
	public async submitAnswer(
		sessionId: string,
		questionIndex: number,
		answer: string,
		timeSpent?: number
	): Promise<AxiosResponseTypeWithoutPagination<SubmitAnswerResponse>> {
		const payload: SubmitAnswerPayload = {
			answers: [
				{
					questionIndex,
					answer,
					timeSpent,
				},
			],
		};
		return this.submitAllAnswers(sessionId, payload);
	}

	/**
	 * Mark a practice session as complete
	 */
	public async completeSession(
		sessionId: string
	): Promise<AxiosResponseTypeWithoutPagination<CompleteSessionResponse>> {
		const { data } = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<CompleteSessionResponse>
		>(`${apiEndPoint.completeSession}/${sessionId}/complete`);
		return data;
	}

	/**
	 * Get all practice sessions for the logged-in user
	 */
	public async getUserSessions(
		page?: number,
		limit?: number
	): Promise<AxiosResponseTypeWithoutPagination<GetUserSessionsResponse>> {
		const params = new URLSearchParams();
		if (page) params.append("page", page.toString());
		if (limit) params.append("limit", limit.toString());

		const queryString = params.toString();
		const url = queryString
			? `${apiEndPoint.getUserSessions}?${queryString}`
			: apiEndPoint.getUserSessions;

		const { data } = await authenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<GetUserSessionsResponse>
		>(url);
		return data;
	}

	/**
	 * Auto-save answer (optional - for saving answers without completing question)
	 */
	public async autoSaveAnswer(
		sessionId: string,
		questionIndex: number,
		answer: string
	): Promise<void> {
		try {
			await this.submitAnswer(sessionId, questionIndex, answer, 0);
		} catch (error) {
			// Silent fail for auto-save to not interrupt user experience
			console.warn("Auto-save failed:", error);
		}
	}

	/**
	 * Make a session publicly shareable
	 */
	public async makeSessionPublic(
		sessionId: string
	): Promise<AxiosResponseTypeWithoutPagination<{ shareUrl: string }>> {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ shareUrl: string }>
		>(`${apiEndPoint.getPracticeSession}/${sessionId}/share`);
		return data;
	}

	/**
	 * Get a public session (no authentication required for shared sessions)
	 */
	public async getPublicSession(
		sessionId: string
	): Promise<AxiosResponseTypeWithoutPagination<GetSessionResponse>> {
		try {
			// For shared sessions, use regular session endpoint
			// Backend should handle public access based on session sharing settings
			const { data } = await authenticatedInstance.get<
				AxiosResponseTypeWithoutPagination<GetSessionResponse>
			>(`${apiEndPoint.getPracticeSession}/${sessionId}`);
			return data;
		} catch (error: any) {
			// If not accessible, this will throw
			throw error;
		}
	}
}

export const practiceServices = new PracticeServices();
