"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const AddQuestion = dynamic(() => import("./AddQuestion"), {
	ssr: true,
});

const EditQuestionHOC = () => {
	const params = useParams();
	const questionId = params?.id as string;

	return <AddQuestion questionId={questionId} />;
};

export default EditQuestionHOC;
