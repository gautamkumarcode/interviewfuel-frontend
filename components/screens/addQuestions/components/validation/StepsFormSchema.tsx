import { z } from "zod";

export const questionSchema = z.object({
	title: z
		.string()
		.min(10, "Title is required")
		.max(200, "Title cannot exceed 200 characters"),
	content: z
		.string()
		.trim()
		.min(50, "Content must be at least 50 characters")
		.optional(),
	category: z.string().min(1, "Category is required"), // MongoDB ObjectId as string

	difficulty: z.enum(["Easy", "Medium", "Hard"], {
		required_error: "Difficulty level is required",
	}),

	tags: z.array(z.string().trim().toLowerCase()).optional(),

	companies: z
		.array(
			z.object({
				name: z.string().min(1, "Company name is required"),
				frequency: z.number().min(1).default(1),
			})
		)
		.optional(),

	richAnswer: z.string().min(1, "Answer explanation is required"),

	media: z.array(z.string().url("Media must be a valid URL")).optional(),

	solutions: z
		.array(
			z.object({
				title: z.string().min(1, "Solution title is required"),
				language: z.string().min(1, "Language is required"),
				code: z.string().min(1, "Code is required"),
				explanation: z.string().min(1, "Explanation is required"),
			
			})
		)
		.min(1, "At least one solution is required"),

	hints: z
		.array(
			z.object({
				order: z.number(),
				content: z.string().min(1, "Hint content is required"),
			})
		)
		.optional(),

	bestPractices: z.array(z.string()).optional(),

	relatedQuestions: z.array(z.string()).optional(), // ObjectId references

	timeLimit: z.number().min(1).default(30),

	// Fields below are not directly user-facing in the add question form
	// and will be handled server-side or are derived.
});
