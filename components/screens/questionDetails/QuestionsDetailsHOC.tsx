import dynamic from "next/dynamic";

interface QuestionsDetailsHOCProps {
	questionId: string;
	onBack: () => void;
}

const QuestionsDetails = dynamic(
	() => import("./QuestionDetails").then((mod) => mod.QuestionDetailView),
	{
		ssr: false,
	}
);

const QuestionsDetailsHOC = (props: QuestionsDetailsHOCProps) => {
	return (
		<QuestionsDetails questionId={props.questionId} onBack={props.onBack} />
	);
};

export default QuestionsDetailsHOC;
