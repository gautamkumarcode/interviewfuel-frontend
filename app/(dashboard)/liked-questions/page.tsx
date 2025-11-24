import { fetchMyLikedQuestions } from "@/app/actions/questoins";
import { QuestionCard } from "@/components/custom/QuestionCard/QuestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { Heart, Lock, LogIn, Search } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LikedQuestionsPage() {
	// Check authentication at server level
	const session = await getServerSession(authOptions);

	if (!session?.accessToken) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Card className="max-w-md w-full">
					<CardContent className="p-8 text-center space-y-4">
						<Lock className="w-16 h-16 text-gray-400 mx-auto" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Authentication Required
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Sign in to view your liked questions
						</p>
						<Link href="/">
							<Button className="gap-2 w-full" size="lg">
								<LogIn className="h-4 w-4" />
								Sign In
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	const likedQuestionsData = await fetchMyLikedQuestions();
	const likedQuestions = likedQuestionsData?.results ?? [];

	return (
		<div className="min-h-screen">
			<div className="mx-auto">
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

				{likedQuestions.length === 0 ? (
					<Card>
						<CardContent className="p-12 text-center">
							<Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No liked questions yet
							</h3>
							<p className="text-gray-600 mb-6">
								Start exploring questions and like the ones you find helpful!
							</p>
							<Link href="/questions">
								<Button className="gap-2">
									<Search className="h-4 w-4" />
									Explore Questions
								</Button>
							</Link>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
						{likedQuestions.map((question) => (
							<QuestionCard key={question.id} question={question} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
