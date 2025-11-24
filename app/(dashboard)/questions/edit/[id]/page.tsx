"use client";

import { AuthGuard } from "@/components/common";
import EditQuestionHOC from "@/components/screens/addQuestions/EditQuestionHOC";

export default function EditQuestionPage() {
	return (
		<AuthGuard redirectMessage="Sign in to edit your questions">
			<EditQuestionHOC />
		</AuthGuard>
	);
}
