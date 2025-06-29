"use client";

import { ActivityPatterns } from "@/components/custom/analytics/ActivityParttern";
import { AIInsights } from "@/components/custom/analytics/AiInsights";
import { CategoryAnalysis } from "@/components/custom/analytics/CategoryAnalysis";
import { GoalsAchievements } from "@/components/custom/analytics/GoalAchivement";
import { PerformanceTrends } from "@/components/custom/analytics/PerformenceTrends";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Award, Clock, Target, TrendingUp } from "lucide-react";
import * as React from "react";

interface AnalyticsDashboardProps {
	onExit: () => void;
}

export const AnalyticsDashboard = ({ onExit }: AnalyticsDashboardProps) => {
	const [timeRange, setTimeRange] = React.useState("3months");

	const getCurrentStats = () => ({
		completionRate: { current: 89, change: 5 },
		avgTime: { current: 4.4, change: 0.6 },
		totalQuestions: { current: 43, change: 3 },
		avgDifficulty: { current: 3.4, change: 0.1 },
	});

	const stats = getCurrentStats();

	return (
		<div className="max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<Button variant="ghost" onClick={onExit} className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Questions
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Performance Analytics
						</h1>
						<p className="text-gray-600">
							Track your progress and identify areas for improvement
						</p>
					</div>
				</div>

				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger className="w-40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="1month">Last Month</SelectItem>
						<SelectItem value="3months">Last 3 Months</SelectItem>
						<SelectItem value="6months">Last 6 Months</SelectItem>
						<SelectItem value="1year">Last Year</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 mb-1">Completion Rate</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.completionRate.current}%
								</p>
								<div className="flex items-center gap-1 mt-1">
									<TrendingUp className="h-3 w-3 text-green-600" />
									<span className="text-xs text-green-600">
										+{stats.completionRate.change}% this week
									</span>
								</div>
							</div>
							<div className="p-3 bg-blue-100 rounded-lg">
								<Target className="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 mb-1">Avg Time/Question</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.avgTime.current}m
								</p>
								<div className="flex items-center gap-1 mt-1">
									<TrendingUp className="h-3 w-3 text-green-600" />
									<span className="text-xs text-green-600">
										-{stats.avgTime.change}m faster
									</span>
								</div>
							</div>
							<div className="p-3 bg-green-100 rounded-lg">
								<Clock className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 mb-1">Questions Solved</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.totalQuestions.current}
								</p>
								<div className="flex items-center gap-1 mt-1">
									<TrendingUp className="h-3 w-3 text-green-600" />
									<span className="text-xs text-green-600">
										+{stats.totalQuestions.change} this week
									</span>
								</div>
							</div>
							<div className="p-3 bg-purple-100 rounded-lg">
								<Target className="h-6 w-6 text-purple-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 mb-1">Avg Difficulty</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.avgDifficulty.current}
								</p>
								<div className="flex items-center gap-1 mt-1">
									<TrendingUp className="h-3 w-3 text-green-600" />
									<span className="text-xs text-green-600">
										+{stats.avgDifficulty.change} harder
									</span>
								</div>
							</div>
							<div className="p-3 bg-orange-100 rounded-lg">
								<Award className="h-6 w-6 text-orange-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="trends" className="space-y-6">
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="trends">Performance Trends</TabsTrigger>
					<TabsTrigger value="categories">Category Analysis</TabsTrigger>
					<TabsTrigger value="activity">Activity Patterns</TabsTrigger>
					<TabsTrigger value="goals">Goals & Achievements</TabsTrigger>
					<TabsTrigger value="insights">AI Insights</TabsTrigger>
				</TabsList>

				<TabsContent value="trends">
					<PerformanceTrends />
				</TabsContent>

				<TabsContent value="categories">
					<CategoryAnalysis />
				</TabsContent>

				<TabsContent value="activity">
					<ActivityPatterns />
				</TabsContent>

				<TabsContent value="goals">
					<GoalsAchievements />
				</TabsContent>

				<TabsContent value="insights">
					<AIInsights />
				</TabsContent>
			</Tabs>
		</div>
	);
};
