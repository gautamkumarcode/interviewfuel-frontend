import { AdminOnly } from "@/components/common";
import { QuestionReviewDetail } from "@/components/screens/admin-review/QuestionReviewDetail";
import { AlertCircle } from "lucide-react";

export default async function QuestionReviewPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

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
			<div className="container mx-auto px-4 py-8">
				<QuestionReviewDetail questionId={id} />
			</div>
		</AdminOnly>
	);
}
