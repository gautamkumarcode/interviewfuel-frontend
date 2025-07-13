"use client";

import dynamic from "next/dynamic";

const QuestionPage = dynamic(() => import("./Questions"), {
	ssr: false, // Client-only rendering
});



const QuestionHOC = () => {
	return <QuestionPage />;
};

export default QuestionHOC;
