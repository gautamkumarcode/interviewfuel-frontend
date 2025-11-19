import { ActivityPatternServer } from "@/components/custom/analytics/ActivityPatternServer";
import { AIInsightsServer } from "@/components/custom/analytics/AiInsightsServer";
import { CategoryAnalysisServer } from "@/components/custom/analytics/CategoryAnalysisServer";
import { GoalsAchievementsServer } from "@/components/custom/analytics/GoalsAchievementsServer";
import { PerformanceTrendsServer } from "@/components/custom/analytics/PerformanceTrendsServer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ActivityPatterns,
	AIInsightsData,
	DashboardAnalytics,
} from "@/services/analytics/analytics-services";
import { Award, Clock, Target, TrendingUp } from "lucide-react";

interface AnalyticsDashboardServerCompleteProps {
	dashboardData: DashboardAnalytics | null;
	activityData: ActivityPatterns | null;
	insightsData: AIInsightsData | null;
	timeRange: number;
}

export function AnalyticsDashboardServerComplete({
	dashboardData,
	activityData,
	insightsData,
	timeRange,
}: AnalyticsDashboardServerCompleteProps) {
	const getCurrentStats = () => ({
		completionRate: {
			current: dashboardData?.overview.accuracy || 0,
			change: dashboardData?.overview.weeklyGrowth || 0,
		},
		avgTime: {
			current: dashboardData?.overview.totalPracticeTime
				? (
						dashboardData.overview.totalPracticeTime /
						dashboardData.overview.totalQuestions
				  ).toFixed(1)
				: 0,
			change: 0.6,
		},
		totalQuestions: {
			current: dashboardData?.overview.totalQuestions || 0,
			change: dashboardData?.overview.weeklyGrowth || 0,
		},
		avgDifficulty: { current: 3.4, change: 0.1 },
	});

	const stats = getCurrentStats();

	if (!dashboardData) {
		return (
			<div className="max-w-7xl mx-auto p-6">
				<Card>
					<CardContent className="p-8 text-center">
						<p className="text-red-500 mb-4">Failed to load analytics data</p>
						<p className="text-gray-600">
							Please try refreshing the page or contact support if the issue
							persists.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto">
			{/* Header */}

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
								<p className="text-sm text-gray-600 mb-1">Current Streak</p>
								<p className="text-2xl font-bold text-gray-900">
									{dashboardData.overview.currentStreak}
								</p>
								<div className="flex items-center gap-1 mt-1">
									<span className="text-xs text-gray-600">
										Best: {dashboardData.overview.longestStreak} days
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

			{/* Tabs for different analytics views */}
			<Tabs defaultValue="trends" className="space-y-6">
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="trends">Performance Trends</TabsTrigger>
					<TabsTrigger value="categories">Category Analysis</TabsTrigger>
					<TabsTrigger value="activity">Activity Patterns</TabsTrigger>
					<TabsTrigger value="goals">Goals & Achievements</TabsTrigger>
					<TabsTrigger value="insights">AI Insights</TabsTrigger>
				</TabsList>

				<TabsContent value="trends">
					<PerformanceTrendsServer />
				</TabsContent>

				<TabsContent value="categories">
					<CategoryAnalysisServer analyticsData={dashboardData} />
				</TabsContent>

				<TabsContent value="activity">
					<ActivityPatternServer
						activityData={activityData}
						timeRange={timeRange}
					/>
				</TabsContent>

				<TabsContent value="goals">
					<GoalsAchievementsServer analyticsData={dashboardData} />
				</TabsContent>

				<TabsContent value="insights">
					<AIInsightsServer insightsData={insightsData} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
