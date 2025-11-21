import dynamic from "next/dynamic";

const MyQuestionPage = dynamic(() => import("./MyQuestions"), {
	ssr: true,
});

export const MyQuestionsHOC = () => {
	return <MyQuestionPage />;
};
