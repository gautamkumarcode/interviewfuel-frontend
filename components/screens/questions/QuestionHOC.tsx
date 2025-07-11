import dynamic from "next/dynamic";

const QuestionPage = dynamic(() => import("./Questions"), {
	ssr: true,
});

const QuestionHOC = () => {
	return <QuestionPage />;
};

export default QuestionHOC;
