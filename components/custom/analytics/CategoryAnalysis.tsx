"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart3, CheckCircle } from "lucide-react";

const categoryPerformance = [
	{
		category: "JavaScript",
		attempted: 45,
		correct: 38,
		avgTime: 4.2,
		improvement: 15,
	},
	{
		category: "React",
		attempted: 32,
		correct: 28,
		avgTime: 5.1,
		improvement: 22,
	},
	{
		category: "Algorithms",
		attempted: 28,
		correct: 21,
		avgTime: 8.3,
		improvement: 8,
	},
	{
		category: "System Design",
		attempted: 15,
		correct: 11,
		avgTime: 12.5,
		improvement: 35,
	},
	{
		category: "Database",
		attempted: 22,
		correct: 18,
		avgTime: 6.7,
		improvement: 18,
	},
	{
		category: "Node.js",
		attempted: 19,
		correct: 16,
		avgTime: 5.8,
		improvement: 12,
	},
];

export function CategoryAnalysis() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Performance by Category
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{categoryPerformance.map((category) => {
							const accuracy = Math.round(
								(category.correct / category.attempted) * 100
							);
							return (
								<div key={category.category} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<span className="font-medium">{category.category}</span>
											<Badge variant="outline" className="text-xs">
												{accuracy}% accuracy
											</Badge>
											<Badge
												className={`text-xs ${
													category.improvement > 20
														? "bg-green-100 text-green-800"
														: category.improvement > 10
														? "bg-yellow-100 text-yellow-800"
														: "bg-gray-100 text-gray-800"
												}`}>
												+{category.improvement}% improvement
											</Badge>
										</div>
										<div className="text-sm text-gray-600">
											{category.correct}/{category.attempted} •{" "}
											{category.avgTime}m avg
										</div>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-blue-600 h-2 rounded-full transition-all duration-300"
											style={{ width: `${accuracy}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Strengths</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
								<CheckCircle className="h-5 w-5 text-green-600" />
								<div>
									<div className="font-medium text-green-900">
										JavaScript Fundamentals
									</div>
									<div className="text-sm text-green-700">
										84% accuracy, improving fast
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
								<CheckCircle className="h-5 w-5 text-green-600" />
								<div>
									<div className="font-medium text-green-900">
										React Components
									</div>
									<div className="text-sm text-green-700">
										88% accuracy, consistent performance
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Areas for Improvement</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
								<AlertTriangle className="h-5 w-5 text-orange-600" />
								<div>
									<div className="font-medium text-orange-900">
										Algorithm Complexity
									</div>
									<div className="text-sm text-orange-700">
										75% accuracy, needs more practice
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
								<AlertTriangle className="h-5 w-5 text-orange-600" />
								<div>
									<div className="font-medium text-orange-900">
										System Design
									</div>
									<div className="text-sm text-orange-700">
										73% accuracy, taking too long
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
