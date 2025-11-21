import { fetchMyLikedQuestions } from "@/app/actions/questoins";
import { QuestionCard } from "@/components/custom/QuestionCard/QuestionCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function LikedQuestionsPage() {
	const likedQuestionsData = await fetchMyLikedQuestions();
	const likedQuestions = likedQuestionsData?.results ?? [];
	console.log(likedQuestions);
	if (likedQuestions.length > 0) {
		return (
			<div className="min-h-screen ">
				<div className=" mx-auto">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Liked Questions
							</h1>
							<p className="text-gray-600 mt-2">
								Questions you have liked and found helpful
							</p>
						</div>
						<Link href="/questions">
							<Button variant="outline" className="gap-2">
								<Search className="h-4 w-4" />
								Browse Questions
							</Button>
						</Link>
					</div>
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
						{likedQuestions.map((question) => (
							<QuestionCard key={question.id} question={question} />
						))}
					</div>
				</div>
			</div>
		);
	}
}
