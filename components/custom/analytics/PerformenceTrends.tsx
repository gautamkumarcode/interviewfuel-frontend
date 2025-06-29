"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import * as React from "react";



const difficultyDistribution = [
	{ difficulty: "Easy", count: 89, percentage: 45, color: "#10b981" },
	{ difficulty: "Medium", count: 76, percentage: 38, color: "#f59e0b" },
	{ difficulty: "Hard", count: 34, percentage: 17, color: "#ef4444" },
];

;

export function PerformanceTrends() {
	const [selectedMetric, setSelectedMetric] = React.useState("completionRate");



	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Performance Chart */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								Performance Over Time
							</CardTitle>
							<Select value={selectedMetric} onValueChange={setSelectedMetric}>
								<SelectTrigger className="w-48">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="completionRate">
										Completion Rate
									</SelectItem>
									<SelectItem value="avgTime">Average Time</SelectItem>
									<SelectItem value="questionsAnswered">
										Questions Answered
									</SelectItem>
									<SelectItem value="difficulty">Average Difficulty</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardHeader>
					<CardContent>
						
					</CardContent>
				</Card>

				{/* Difficulty Distribution */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PieChart className="h-5 w-5" />
							Difficulty Distribution
						</CardTitle>
					</CardHeader>
					<CardContent>
					
						<div className="mt-4 space-y-2">
							{difficultyDistribution.map((item) => (
								<div
									key={item.difficulty}
									className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: item.color }}
										/>
										<span>{item.difficulty}</span>
									</div>
									<span className="font-medium">
										{item.count} ({item.percentage}%)
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Weekly Progress */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Weekly Activity
					</CardTitle>
				</CardHeader>
				<CardContent>
				
				</CardContent>
			</Card>
		</div>
	);
}
