import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

export default function MyQuestionsPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
					<div>
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

				{/* Empty State */}
				<Card>
					<CardContent className="p-12 text-center">
						<FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No questions yet
						</h3>
						<p className="text-gray-600 mb-6">
							You have not created any questions yet. Start by adding your first
							question!
						</p>
						<Link href="/questions/create">
							<Button className="gap-2">
								<Plus className="h-4 w-4" />
								Create Your First Question
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}