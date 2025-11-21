import dynamic from "next/dynamic";

const QuestionReviewDetailPage = dynamic(
	() => import("./QuestionReviewDetailServer"),
	{
		ssr: true,
	}
);

interface QuestionReviewDetailHOCProps {
	questionId: string;
}

export const QuestionReviewDetailHOC = ({
	questionId,
}: QuestionReviewDetailHOCProps) => {
	return <QuestionReviewDetailPage questionId={questionId} />;
};
