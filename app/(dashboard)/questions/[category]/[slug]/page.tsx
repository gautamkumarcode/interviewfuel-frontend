"use client";

import QuestionsDetailsHOC from "@/components/screens/questionDetails/QuestionsDetailsHOC";
import { useParams } from "next/navigation";

export default function QuestionPage() {
	const params = useParams();
	const slug = params.slug as string;

	return (
		<QuestionsDetailsHOC
			questionId={slug as string}
			onBack={() => window.history.back()}
		/>
	);
}
