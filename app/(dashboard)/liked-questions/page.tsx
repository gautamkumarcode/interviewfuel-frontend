import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Search } from "lucide-react";
import Link from "next/link";

export default function LikedQuestionsPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

				{/* Empty State */}
				<Card>
					<CardContent className="p-12 text-center">
						<Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No liked questions yet
						</h3>
						<p className="text-gray-600 mb-6">
							You have not liked any questions yet. Start exploring questions
							and like the ones you find helpful!
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