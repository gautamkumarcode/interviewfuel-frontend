"use client";

import { AuthGuard } from "@/components/common";
import { MyQuestionsHOC } from "@/components/screens/MyQuestions/MyQuestionsHOC";

export default function MyQuestionsPage() {
	return (
		<AuthGuard redirectMessage="Sign in to view your submitted questions">
			<MyQuestionsHOC />
		</AuthGuard>
	);
}
