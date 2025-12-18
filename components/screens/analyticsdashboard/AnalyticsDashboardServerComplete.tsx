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
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<Card>
					<CardContent className="p-6 sm:p-8 text-center">
						<p className="text-red-500 mb-4 text-sm sm:text-base">
							Failed to load analytics data
						</p>
						<p className="text-gray-600 text-xs sm:text-sm">
							Please try refreshing the page or contact support if the issue
							persists.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="mx-auto">
			{/* Key Metrics - Responsive Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
				<Card className="hover:shadow-lg transition-shadow">
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div className="flex-1 min-w-0">
								<p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
									Completion Rate
								</p>
								<p className="text-xl sm:text-2xl font-bold text-gray-900">
									{stats.completionRate.current}%
								</p>
								<div className="flex items-center gap-1 mt-1">
									<TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
									<span className="text-xs text-green-600 truncate">
										+{stats.completionRate.change}% this week
									</span>
								</div>
							</div>
							<div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
								<Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div className="flex-1 min-w-0">
								<p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
									Avg Time/Question
								</p>
								<p className="text-xl sm:text-2xl font-bold text-gray-900">
									{stats.avgTime.current}m
								</p>
								<div className="flex items-center gap-1 mt-1">
									<TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
									<span className="text-xs text-green-600 truncate">
										-{stats.avgTime.change}m faster
									</span>
								</div>
							</div>
							<div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0 ml-2">
								<Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div className="flex-1 min-w-0">
								<p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
									Questions Solved
								</p>
								<p className="text-xl sm:text-2xl font-bold text-gray-900">
									{stats.totalQuestions.current}
								</p>
								<div className="flex items-center gap-1 mt-1">
									<TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
									<span className="text-xs text-green-600 truncate">
										+{stats.totalQuestions.change} this week
									</span>
								</div>
							</div>
							<div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0 ml-2">
								<Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardContent className="p-4 sm:p-6">
						<div className="flex items-center justify-between">
							<div className="flex-1 min-w-0">
								<p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
									Current Streak
								</p>
								<p className="text-xl sm:text-2xl font-bold text-gray-900">
									{dashboardData.overview.currentStreak}
								</p>
								<div className="flex items-center gap-1 mt-1">
									<span className="text-xs text-gray-600 truncate">
										Best: {dashboardData.overview.longestStreak} days
									</span>
								</div>
							</div>
							<div className="p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0 ml-2">
								<Award className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabs for different analytics views - Responsive */}
			<Tabs defaultValue="trends" className="space-y-4 sm:space-y-6">
				{/* Mobile: Scrollable tabs */}
				<div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
					<TabsList className="inline-flex sm:grid w-auto sm:w-full grid-cols-1 sm:grid-cols-5 min-w-max sm:min-w-0">
						<TabsTrigger
							value="trends"
							className="text-xs sm:text-sm px-3 sm:px-4">
							<span className="hidden sm:inline">Performance Trends</span>
							<span className="sm:hidden">Trends</span>
						</TabsTrigger>
						<TabsTrigger
							value="categories"
							className="text-xs sm:text-sm px-3 sm:px-4">
							<span className="hidden sm:inline">Category Analysis</span>
							<span className="sm:hidden">Categories</span>
						</TabsTrigger>
						<TabsTrigger
							value="activity"
							className="text-xs sm:text-sm px-3 sm:px-4">
							<span className="hidden sm:inline">Activity Patterns</span>
							<span className="sm:hidden">Activity</span>
						</TabsTrigger>
						<TabsTrigger
							value="goals"
							className="text-xs sm:text-sm px-3 sm:px-4">
							<span className="hidden sm:inline">Goals & Achievements</span>
							<span className="sm:hidden">Goals</span>
						</TabsTrigger>
						<TabsTrigger
							value="insights"
							className="text-xs sm:text-sm px-3 sm:px-4">
							<span className="hidden sm:inline">AI Insights</span>
							<span className="sm:hidden">Insights</span>
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="trends">
					<PerformanceTrendsServer />
				</TabsContent>

				<TabsContent value="categories">
					<CategoryAnalysisServer analyticsData={dashboardData} />
				</TabsContent>

				<TabsContent value="activity">
					<ActivityPatternServer
						activityData={activityData}
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
