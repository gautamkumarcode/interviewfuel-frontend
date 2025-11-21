import { fetchMyQuestions } from "@/app/actions/questoins";
import { QuestionCard } from "@/components/custom/QuestionCard/QuestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

export default async function MyQuestionsPage() {
	const questionData = await fetchMyQuestions();

	return (
		<div className="min-h-screen ">
			<div className=" mx-auto">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
					<div className="">
						<h1 className="text-3xl font-bold text-gray-900">My Questions</h1>
						<p className="text-gray-600 mt-2">
							Manage and track all the questions you have created
						</p>
					</div>
					<Link href="/questions/create">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Add New Question
						</Button>
					</Link>
				</div>

				{questionData && questionData.results.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
						{questionData.results.map((question) => (
							<QuestionCard key={question.id} question={question} />
						))}
					</div>
				) : (
					<Card>
						<CardContent className="p-12 text-center">
							<FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No questions yet
							</h3>
							<p className="text-gray-600 mb-6">
								You have not created any questions yet. Start by adding your
								first question!
							</p>
							<Link href="/questions/create">
								<Button className="gap-2">
									<Plus className="h-4 w-4" />
									Create Your First Question
								</Button>
							</Link>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
