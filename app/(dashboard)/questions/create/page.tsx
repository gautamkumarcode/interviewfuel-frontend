"use client";

import { AuthGuard } from "@/components/common";
import AddQuestionHOC from "@/components/screens/addQuestions/AddQuestionsHOC";

const CreateQuestionPage = () => {
	return (
		<AuthGuard redirectMessage="Sign in to contribute questions to the platform">
			<AddQuestionHOC />
		</AuthGuard>
	);
};

export default CreateQuestionPage;
