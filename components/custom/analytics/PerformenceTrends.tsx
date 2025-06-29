"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import * as React from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

interface PerformanceTrendsProps {
	timeRange: string;
}

const performanceData = [
	{
		date: "2024-01-01",
		completionRate: 45,
		avgTime: 8.5,
		questionsAnswered: 12,
		difficulty: 2.1,
	},
	{
		date: "2024-01-08",
		completionRate: 52,
		avgTime: 7.8,
		questionsAnswered: 15,
		difficulty: 2.3,
	},
	{
		date: "2024-01-15",
		completionRate: 58,
		avgTime: 7.2,
		questionsAnswered: 18,
		difficulty: 2.4,
	},
	{
		date: "2024-01-22",
		completionRate: 63,
		avgTime: 6.9,
		questionsAnswered: 21,
		difficulty: 2.6,
	},
	{
		date: "2024-01-29",
		completionRate: 67,
		avgTime: 6.5,
		questionsAnswered: 24,
		difficulty: 2.7,
	},
	{
		date: "2024-02-05",
		completionRate: 71,
		avgTime: 6.1,
		questionsAnswered: 27,
		difficulty: 2.8,
	},
	{
		date: "2024-02-12",
		completionRate: 74,
		avgTime: 5.8,
		questionsAnswered: 29,
		difficulty: 2.9,
	},
	{
		date: "2024-02-19",
		completionRate: 78,
		avgTime: 5.5,
		questionsAnswered: 32,
		difficulty: 3.0,
	},
	{
		date: "2024-02-26",
		completionRate: 81,
		avgTime: 5.2,
		questionsAnswered: 35,
		difficulty: 3.1,
	},
	{
		date: "2024-03-05",
		completionRate: 84,
		avgTime: 4.9,
		questionsAnswered: 38,
		difficulty: 3.2,
	},
	{
		date: "2024-03-12",
		completionRate: 87,
		avgTime: 4.6,
		questionsAnswered: 41,
		difficulty: 3.3,
	},
	{
		date: "2024-03-19",
		completionRate: 89,
		avgTime: 4.4,
		questionsAnswered: 43,
		difficulty: 3.4,
	},
];

const difficultyDistribution = [
	{ difficulty: "Easy", count: 89, percentage: 45, color: "#10b981" },
	{ difficulty: "Medium", count: 76, percentage: 38, color: "#f59e0b" },
	{ difficulty: "Hard", count: 34, percentage: 17, color: "#ef4444" },
];

const weeklyActivity = [
	{ day: "Mon", sessions: 3, timeSpent: 45 },
	{ day: "Tue", sessions: 2, timeSpent: 32 },
	{ day: "Wed", sessions: 4, timeSpent: 58 },
	{ day: "Thu", sessions: 1, timeSpent: 25 },
	{ day: "Fri", sessions: 3, timeSpent: 41 },
	{ day: "Sat", sessions: 5, timeSpent: 72 },
	{ day: "Sun", sessions: 2, timeSpent: 38 },
];

export function PerformanceTrends({ timeRange }: PerformanceTrendsProps) {
	const [selectedMetric, setSelectedMetric] = React.useState("completionRate");

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	const getMetricLabel = (metric: string) => {
		switch (metric) {
			case "completionRate":
				return "Completion Rate (%)";
			case "avgTime":
				return "Avg Time (min)";
			case "questionsAnswered":
				return "Questions Answered";
			case "difficulty":
				return "Avg Difficulty";
			default:
				return "Completion Rate (%)";
		}
	};

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
						<ChartContainer
							config={{
								metric: {
									label: getMetricLabel(selectedMetric),
									color: "hsl(var(--chart-1))",
								},
							}}
							className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={performanceData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="date"
										tickFormatter={formatDate}
										fontSize={12}
									/>
									<YAxis fontSize={12} />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Area
										type="monotone"
										dataKey={selectedMetric}
										stroke="var(--color-metric)"
										fill="var(--color-metric)"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>
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
						<ChartContainer
							config={{
								easy: { label: "Easy", color: "#10b981" },
								medium: { label: "Medium", color: "#f59e0b" },
								hard: { label: "Hard", color: "#ef4444" },
							}}
							className="h-[250px]">
							<ResponsiveContainer width="100%" height="100%">
								<RechartsPieChart>
									<ChartTooltip content={<ChartTooltipContent />} />
									<RechartsPieChart
										data={difficultyDistribution}
										cx="50%"
										cy="50%"
										outerRadius={80}>
										{difficultyDistribution.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</RechartsPieChart>
								</RechartsPieChart>
							</ResponsiveContainer>
						</ChartContainer>
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
					<ChartContainer
						config={{
							sessions: { label: "Sessions", color: "hsl(var(--chart-1))" },
							timeSpent: {
								label: "Time Spent (min)",
								color: "hsl(var(--chart-2))",
							},
						}}
						className="h-[200px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={weeklyActivity}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="day" fontSize={12} />
								<YAxis fontSize={12} />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar
									dataKey="sessions"
									fill="var(--color-sessions)"
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey="timeSpent"
									fill="var(--color-timeSpent)"
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
