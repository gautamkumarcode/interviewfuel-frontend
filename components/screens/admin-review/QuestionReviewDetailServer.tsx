import { fetchQuestionForReview } from "@/app/actions/questoins";
import { AdminOnly } from "@/components/common";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { QuestionReviewDetailClient } from "./QuestionReviewDetail";

interface QuestionReviewDetailServerProps {
	questionId: string;
}

export default async function QuestionReviewDetailServer({
	questionId,
}: QuestionReviewDetailServerProps) {
	const questionData = await fetchQuestionForReview(questionId);

	if (!questionData) {
		return (
			<AdminOnly
				fallback={
					<div className="flex items-center justify-center min-h-[60vh]">
						<div className="text-center space-y-4">
							<AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
							<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
								Access Denied
							</h2>
							<p className="text-gray-600 dark:text-gray-400">
								This page is only accessible to administrators.
							</p>
						</div>
					</div>
				}>
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="text-center space-y-4">
						<AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
						<h2 className="text-2xl font-bold">Question Not Found</h2>
						<Link href="/admin-review">
							<Button>Back to Dashboard</Button>
						</Link>
					</div>
				</div>
			</AdminOnly>
		);
	}

	return (
		<AdminOnly
			fallback={
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="text-center space-y-4">
						<AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Access Denied
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							This page is only accessible to administrators.
						</p>
					</div>
				</div>
			}>
			<QuestionReviewDetailClient
				questionId={questionId}
				initialQuestion={questionData}
			/>
		</AdminOnly>
	);
}
