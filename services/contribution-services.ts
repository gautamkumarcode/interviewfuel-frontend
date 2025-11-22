import { apiEndPoint } from "@/constants/api";
import { authenticatedInstance, unauthenticatedInstance } from "@/utils/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ContributionContent {
	solution?: {
		title: string;
		language: string;
		code: string;
		explanation: string;
		timeComplexity?: string;
		spaceComplexity?: string;
	};
	hint?: {
		order: number;
		content: string;
	};
	explanation?: {
		richAnswer: string;
	};
	bestPractice?: {
		practice: string;
	};
	correction?: {
		field: string;
		oldValue: string;
		newValue: string;
		reason: string;
	};
	company?: {
		name: string;
		frequency: number;
	};
}

export interface SubmitContributionData {
	type:
		| "solution"
		| "hint"
		| "explanation"
		| "bestPractice"
		| "correction"
		| "company";
	content: ContributionContent;
	description: string;
}

export interface Contribution {
	_id: string;
	question: string;
	contributor: {
		_id: string;
		name: string;
		username: string;
		avatar?: string;
	};
	type: string;
	content: ContributionContent;
	description: string;
	status: "pending" | "approved" | "rejected";
	reviewedBy?: {
		_id: string;
		name: string;
		username: string;
	};
	reviewedAt?: string;
	reviewComment?: string;
	createdAt: string;
	updatedAt: string;
}

export const contributionService = {
	// Submit a contribution
	submitContribution: async (
		questionId: string,
		data: SubmitContributionData
	) => {
		const response = await authenticatedInstance.post(
			`${apiEndPoint.getAllQuestions}/${questionId}/contribute`,
			data
		);
		return response.data;
	},

	// Get contributions for a question
	getQuestionContributions: async (questionId: string, status?: string) => {
		const params = status ? { status } : {};
		const response = await unauthenticatedInstance.get(
			`${apiEndPoint.getAllQuestions}/${questionId}/contributions`,
			{ params }
		);
		return response.data;
	},

	// Get user's contributions
	getMyContributions: async () => {
		const response = await authenticatedInstance.get(
			`/contributions/my-contributions`
		);
		return response.data;
	},

	// Get pending contributions (for author/admin)
	getPendingContributions: async () => {
		const response = await authenticatedInstance.get(`/contributions/pending`);
		return response.data;
	},

	// Approve a contribution
	approveContribution: async (contributionId: string, comment?: string) => {
		const response = await authenticatedInstance.patch(
			`/contributions/${contributionId}/approve`,
			{ comment }
		);
		return response.data;
	},

	// Reject a contribution
	rejectContribution: async (contributionId: string, comment: string) => {
		const response = await authenticatedInstance.patch(
			`/contributions/${contributionId}/reject`,
			{ comment }
		);
		return response.data;
	},
};
