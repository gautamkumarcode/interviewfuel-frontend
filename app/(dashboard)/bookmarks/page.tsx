import { QuestionCard } from "@/components/custom/QuestionCard/QuestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { API_URL } from "@/constants/api";
import { authOptions } from "@/lib/auth";
import { GetAllQuestionsResponseType } from "@/types/interfaces/questions/getQuestion-type";
import { Bookmark, Search } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Server-side page component: fetches user's bookmarked questions on the server
export default async function BookmarksPage() {
	// Get server session (contains accessToken from JWT session)
	const session = await getServerSession(authOptions);

	// If no session, render the same layout but prompt the user to sign in
	if (!session?.accessToken) {
		return (
			<div className="min-h-screen ">
				<div className="mx-auto">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Bookmarked Questions
							</h1>
							<p className="text-gray-600 mt-2">
								Sign in to view your bookmarked questions.
							</p>
						</div>
						<Link href="/questions">
							<Button variant="outline" className="gap-2">
								<Search className="h-4 w-4" />
								Browse Questions
							</Button>
						</Link>
					</div>

					<Card>
						<CardContent className="p-12 text-center">
							<Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No bookmarks yet
							</h3>
							<p className="text-gray-600 mb-6">
								You have not bookmarked any questions yet. Start exploring
								questions and bookmark the ones you want to review later!
							</p>
							<Link href="/questions">
								<Button className="gap-2">
									<Search className="h-4 w-4" />
									Explore Questions
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// fetch bookmarks from the API using the server session token
	let bookmarks: GetAllQuestionsResponseType[] = [];
	try {
		const res = await fetch(`${API_URL}/questions/my-bookmarks`, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		if (res.ok) {
			const json = await res.json();
			bookmarks = json?.data?.results ?? [];
		} else {
			console.error("Failed to fetch bookmarks", res.status, res.statusText);
		}
	} catch (err) {
		console.error("Error fetching bookmarks:", err);
	}

	return (
		<div className="min-h-screen ">
			<div className=" mx-auto ">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Bookmarked Questions
						</h1>
						<p className="text-gray-600 mt-2">
							Questions you have saved for later review
						</p>
					</div>
					<Link href="/questions">
						<Button variant="outline" className="gap-2">
							<Search className="h-4 w-4" />
							Browse Questions
						</Button>
					</Link>
				</div>

				{bookmarks.length === 0 ? (
					<Card>
						<CardContent className="p-12 text-center">
							<Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No bookmarks yet
							</h3>
							<p className="text-gray-600 mb-6">
								You have not bookmarked any questions yet. Start exploring
								questions and bookmark the ones you want to review later!
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
						{bookmarks.map((q: GetAllQuestionsResponseType) => (
							<QuestionCard key={q._id} question={q} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
