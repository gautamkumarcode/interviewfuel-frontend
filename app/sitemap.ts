import { MetadataRoute } from "next";

// Fetch categories from API
async function getCategories() {
	try {
		const apiUrl =
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
		const res = await fetch(`${apiUrl}/categories`, {
			next: { revalidate: 3600 }, // Revalidate every hour
		});
		if (!res.ok) return [];
		const data = await res.json();
		return data.data || [];
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}

// Fetch questions from API
async function getQuestions() {
	try {
		const apiUrl =
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
		const res = await fetch(`${apiUrl}/questions?limit=1000`, {
			next: { revalidate: 3600 }, // Revalidate every hour
		});
		if (!res.ok) return [];
		const data = await res.json();
		return data.data?.questions || [];
	} catch (error) {
		console.error("Error fetching questions:", error);
		return [];
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://interviewfuel.dev";

	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		// Home page
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},

		// Auth routes
		{
			url: `${baseUrl}/forgot-password`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},

		// Main dashboard routes
		{
			url: `${baseUrl}/questions`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/questions/create`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/categories`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/practice`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/practice/history`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/practice/analytics`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/search`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},

		// User profile routes
		{
			url: `${baseUrl}/profile`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/my-questions`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/liked-questions`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/bookmarks`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.6,
		},

		// Admin routes
		{
			url: `${baseUrl}/admin-users`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.4,
		},
		{
			url: `${baseUrl}/admin-review`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/analytics`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.5,
		},
	];

	// Fetch dynamic routes
	const [categories, questions] = await Promise.all([
		getCategories(),
		getQuestions(),
	]);

	// Category pages - ensure categories is an array
	const categoryPages: MetadataRoute.Sitemap = Array.isArray(categories)
		? categories.map((category: any) => ({
				url: `${baseUrl}/questions/${
					category.slug ||
					category.name?.toLowerCase().replace(/\s+/g, "-") ||
					"category"
				}`,
				lastModified: new Date(category.updatedAt || new Date()),
				changeFrequency: "weekly" as const,
				priority: 0.7,
		  }))
		: [];

	// Question detail pages - ensure questions is an array
	const questionPages: MetadataRoute.Sitemap = Array.isArray(questions)
		? questions.map((question: any) => ({
				url: `${baseUrl}/questions/${question.category?.slug || "general"}/${
					question.slug || question._id
				}`,
				lastModified: new Date(question.updatedAt || new Date()),
				changeFrequency: "monthly" as const,
				priority: 0.6,
		  }))
		: [];

	return [...staticPages, ...categoryPages, ...questionPages];
}
