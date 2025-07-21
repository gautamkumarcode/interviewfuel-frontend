import dynamic from "next/dynamic";

const QuestionPage = dynamic(() => import("./Questions"), {
	ssr: true, // Client-only
});

export default function QuestionsPageWrapper() {
	return <QuestionPage />;
}
