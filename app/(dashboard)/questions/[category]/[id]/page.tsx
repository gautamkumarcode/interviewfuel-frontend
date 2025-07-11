"use client";

import QuestionsDetailsHOC from "@/components/screens/questionDetails/QuestionsDetailsHOC";
import { useParams } from "next/navigation";

export default function QuestionPage() {
	const params = useParams();
	const questionId = params.id;

	return (
		<QuestionsDetailsHOC
			questionId={questionId as string}
			onBack={() => window.history.back()}
		/>
	);
}
