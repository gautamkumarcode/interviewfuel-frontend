"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Activity, BarChart3, Clock } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

export function ActivityPatterns() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Study Streak
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center">
							<div className="text-4xl font-bold text-green-600 mb-2">12</div>
							<div className="text-gray-600 mb-4">Days Current Streak</div>
							<div className="text-sm text-gray-500">
								Longest streak: 18 days (Feb 1-19)
							</div>
						</div>
						<div className="mt-6 grid grid-cols-7 gap-1">
							{Array.from({ length: 28 }, (_, i) => (
								<div
									key={i}
									className={`h-3 w-3 rounded-sm ${
										Math.random() > 0.3
											? "bg-green-200"
											: Math.random() > 0.7
											? "bg-green-500"
											: "bg-gray-100"
									}`}
								/>
							))}
						</div>
						<div className="flex justify-between text-xs text-gray-500 mt-2">
							<span>4 weeks ago</span>
							<span>Today</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Time Distribution
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span>Morning (6-12 PM)</span>
									<span>35%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-blue-600 h-2 rounded-full"
										style={{ width: "35%" }}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span>Afternoon (12-6 PM)</span>
									<span>25%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-green-600 h-2 rounded-full"
										style={{ width: "25%" }}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span>Evening (6-12 AM)</span>
									<span>40%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-purple-600 h-2 rounded-full"
										style={{ width: "40%" }}
									/>
								</div>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-50 rounded-lg">
							<div className="text-sm text-blue-800">
								<strong>Peak Performance:</strong> You perform best in the
								evening with 92% average completion rate.
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Session Length Analysis
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={{
							sessions: {
								label: "Number of Sessions",
								color: "hsl(var(--chart-1))",
							},
						}}
						className="h-[200px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={[
									{ duration: "15-30 min", sessions: 45 },
									{ duration: "30-45 min", sessions: 32 },
									{ duration: "45-60 min", sessions: 28 },
									{ duration: "60+ min", sessions: 15 },
								]}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="duration" fontSize={12} />
								<YAxis fontSize={12} />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar
									dataKey="sessions"
									fill="var(--color-sessions)"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
