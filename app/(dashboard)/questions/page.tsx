import QuestionHOC from "@/components/screens/questions/QuestionHOC";
import { Suspense } from "react";

export default function QuestionsPage() {
	// No need for await - searchParams is automatically parsed

	return (
		<Suspense fallback={<div className="p-4">Loading Questions...</div>}>
			<QuestionHOC />
		</Suspense>
	);
}
