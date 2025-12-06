import LandingPage from "@/components/screens/landingPage/LandingPage";
import {
	generateCourseSchema,
	generateFAQSchema,
	generateMetadata,
	generateOrganizationSchema,
	generateWebsiteSchema,
} from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
	title: "Home",
	description:
		"Free coding interview questions and practice platform. 10,000+ interview questions for JavaScript, Python, Java, React, System Design. Practice for Google, Amazon, Microsoft, Meta interviews. AI-powered mock interviews with instant feedback.",
	keywords: [
		"free interview questions",
		"coding interview practice",
		"technical interview preparation",
		"system design interview",
		"mock interview platform",
		"interview questions database",
		"leetcode free alternative",
		"FAANG interview prep",
		"software engineer interview",
		"programming interview practice",
		"interview preparation platform",
		"data structures interview questions",
		"algorithms interview questions",
		"javascript interview questions",
		"python interview questions",
		"react interview questions",
		"frontend interview questions",
		"full stack interview questions",
		"backend interview questions",
		"developer interview questions",
		"software engineer interview questions",
		"technical interview questions",
		"coding interview questions",
		"mock interview questions",
		"frontedend developer interview questions",
		"backend developer interview questions",
		"full stack developer interview questions",
	],
});

async function getLandingStats() {
	try {
		const apiUrl =
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
		const fullUrl = `${apiUrl}/stats/landing`;

		const res = await fetch(fullUrl, {
			next: { revalidate: 300 }, // Revalidate every 5 minutes
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error("API Error:", errorText);
			throw new Error(`Failed to fetch stats: ${res.status}`);
		}

		const data = await res.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching landing stats:", error);
		// Return default stats if fetch fails
		return {
			users: { total: 100000, formatted: "100K", label: "Developers Trained" },
			questions: {
				total: 10000,
				formatted: "10K",
				label: "Practice Questions",
			},
			successRate: { total: 95, formatted: "95%", label: "Success Rate" },
			companies: { total: 500, formatted: "500+", label: "Companies Hiring" },
		};
	}
}

const page = async () => {
	const stats = await getLandingStats();

	// Structured data for SEO
	const organizationSchema = generateOrganizationSchema();
	const websiteSchema = generateWebsiteSchema();
	const courseSchema = generateCourseSchema();
	const faqSchema = generateFAQSchema([
		{
			question: "What is InterviewFuel?",
			answer:
				"InterviewFuel is a comprehensive platform for technical interview preparation, offering AI-powered mock interviews, practice questions, and instant feedback.",
		},
		{
			question: "How many practice questions are available?",
			answer:
				"We have over 10,000 curated interview questions covering various topics including data structures, algorithms, system design, and more.",
		},
		{
			question: "Is InterviewFuel free to use?",
			answer:
				"Yes, InterviewFuel offers a free tier with access to practice questions and basic features. Premium features are available with a subscription.",
		},
		{
			question: "What companies do your questions cover?",
			answer:
				"Our questions are based on real interviews from top tech companies including FAANG (Facebook, Amazon, Apple, Netflix, Google) and many startups.",
		},
	]);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(organizationSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(courseSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
			/>
			<LandingPage initialStats={stats} />
		</>
	);
};

export default page;
