"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
	return (
		<div className="max-w-4xl mx-auto p-6">
			{/* Simple Header */}
			<div className="flex items-center gap-4 mb-6">
				<Link href="/practice">
					<Button variant="outline" size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Practice
					</Button>
				</Link>
				<h1 className="text-2xl font-bold">Practice History</h1>
			</div>

			{/* Simple Message */}
			<Card className="p-6 text-center">
				<h3 className="text-lg font-medium mb-2">Practice History</h3>
				<p className="text-gray-600 mb-4">
					Your completed practice sessions will appear here.
				</p>
				<Link href="/practice">
					<Button>Start Practicing</Button>
				</Link>
			</Card>
		</div>
	);
}
