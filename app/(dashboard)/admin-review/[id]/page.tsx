import { QuestionReviewDetailHOC } from "@/components/screens/admin-review/QuestionReviewDetailHOC";

export default async function QuestionReviewPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <QuestionReviewDetailHOC questionId={id} />;
}
