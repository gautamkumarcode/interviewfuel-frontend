import axios from "axios";

const API_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
	"http://localhost:5000/api";

export interface SearchResult {
	questions: Array<{
		_id: string;
		title: string;
		slug: string;
		difficulty: string;
		tags: string[];
		category: {
			name: string;
			slug: string;
			color: string;
		};
		stats: {
			views: number;
			likes: number;
		};
		createdAt: string;
	}>;
	categories: Array<{
		_id: string;
		name: string;
		slug: string;
		description: string;
		icon: string;
		color: string;
		stats: {
			questionCount: number;
		};
		parentCategory?: {
			name: string;
			slug: string;
		};
	}>;
	tags: Array<{
		tag: string;
		count: number;
	}>;
	total: number;
}

export interface SearchSuggestion {
	type: "question" | "category" | "tag";
	label: string;
	value: string;
	icon?: string;
	color?: string;
	count?: number;
	categorySlug?: string;
}

export interface PopularSearches {
	tags: Array<{ tag: string; count: number }>;
	questions: Array<{
		title: string;
		slug: string;
		stats: { views: number };
	}>;
	categories: Array<{
		name: string;
		slug: string;
		icon: string;
		color: string;
		stats: { questionCount: number };
	}>;
}

class SearchService {
	// Global search
	async search(
		query: string,
		type?: "questions" | "categories" | "tags",
		page: number = 1,
		limit: number = 10
	) {
		try {
			const params: any = { q: query, page, limit };
			if (type) params.type = type;

			const response = await axios.get(`${API_URL}/search`, { params });
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Failed to perform search"
			);
		}
	}

	// Get search suggestions (autocomplete)
	async getSuggestions(query: string, limit: number = 5) {
		try {
			const response = await axios.get(`${API_URL}/search/suggestions`, {
				params: { q: query, limit },
			});
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Failed to get suggestions"
			);
		}
	}

	// Get popular searches
	async getPopularSearches() {
		try {
			const response = await axios.get(`${API_URL}/search/popular`);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Failed to get popular searches"
			);
		}
	}
}

export const searchService = new SearchService();
