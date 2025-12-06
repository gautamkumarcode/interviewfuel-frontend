import QuestionsPageWrapper from "@/components/screens/questions/QuestionHOC";
import { generateItemListSchema, generateMetadata } from "@/lib/seo";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = generateMetadata({
	title: "Interview Questions",
	description:
		"Browse 10,000+ coding and technical interview questions. Practice JavaScript, Python, Java, React, System Design, Data Structures, Algorithms and more. Get hired at top tech companies.",
	keywords: [
		"coding interview questions",
		"technical interview questions",
		"programming questions",
		"javascript interview questions",
		"python interview questions",
		"react interview questions",
		"system design questions",
		"data structures questions",
		"algorithm questions",
		"FAANG interview prep",
	],
});

export default async function QuestionsPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateItemListSchema([
							{
								name: "JavaScript Interview Questions",
								url: "https://interviewfuel.dev/questions/javascript",
								description: "Master JavaScript interview questions",
							},
							{
								name: "React Interview Questions",
								url: "https://interviewfuel.dev/questions/react",
								description: "Top React.js interview questions and answers",
							},
							{
								name: "System Design Interview",
								url: "https://interviewfuel.dev/questions/system-design",
								description:
									"System design interview questions for senior roles",
							},
							{
								name: "Data Structures Interview Questions",
								url: "https://interviewfuel.dev/questions/data-structures",
								description: "Practice data structures for coding interviews",
							},
						])
					),
				}}
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<QuestionsPageWrapper />
			</Suspense>
		</>
	);
}
