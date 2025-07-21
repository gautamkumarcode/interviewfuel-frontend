import QuestionsPageWrapper from "@/components/screens/questions/QuestionHOC";
import { Suspense } from "react";

export default async function QuestionsPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<QuestionsPageWrapper />
		</Suspense>
	);
}
