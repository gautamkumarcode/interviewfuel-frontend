import {
	getActivityPatternsData,
	getAIInsightsData,
	getDashboardAnalyticsData,
} from "@/app/actions/analytics-actions";
import { AnalyticsDashboardServerComplete } from "@/components/screens/analyticsdashboard/AnalyticsDashboardServerComplete";
import { AnalyticsPageClient } from "@/components/screens/analyticsdashboard/AnalyticsPageClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { Lock, LogIn } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";

interface AnalyticsPageProps {
	searchParams: Promise<{ timeRange?: string }>;
}

export default async function AnalyticsPage({
	searchParams,
}: AnalyticsPageProps) {
	// Check authentication at server level
	const session = await getServerSession(authOptions);

	if (!session?.accessToken) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Card className="max-w-md w-full">
					<CardContent className="p-8 text-center space-y-4">
						<Lock className="w-16 h-16 text-gray-400 mx-auto" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Authentication Required
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Sign in to view your analytics and track your progress
						</p>
						<Link href="/">
							<Button className="gap-2 w-full" size="lg">
								<LogIn className="h-4 w-4" />
								Sign In
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}
	const resolvedSearchParams = await searchParams;
	const timeRange = parseInt(resolvedSearchParams.timeRange || "30");

	// Fetch all analytics data in parallel but tolerate failures/timeouts
	// Always fetch full year for activity patterns to ensure we have enough data for responsive display
	const activityTimeRange = Math.max(timeRange, 365); // Always get at least 1 year for activity patterns

	// Use Promise.allSettled so a single timeout/failure doesn't crash the whole page render.
	// We still log failures and continue rendering available data.
	const settled = await Promise.allSettled([
		getDashboardAnalyticsData(timeRange),
		getActivityPatternsData(activityTimeRange),
		getAIInsightsData(timeRange),
	]);

	const dashboardData =
		settled[0].status === "fulfilled" ? settled[0].value : null;
	if (settled[0].status === "rejected")
		console.error("Dashboard analytics fetch failed:", settled[0].reason);

	const activityData =
		settled[1].status === "fulfilled" ? settled[1].value : null;
	if (settled[1].status === "rejected")
		console.error("Activity patterns fetch failed:", settled[1].reason);

	const insightsData =
		settled[2].status === "fulfilled" ? settled[2].value : null;
	if (settled[2].status === "rejected")
		console.error("AI insights fetch failed:", settled[2].reason);

	return (
		<AnalyticsPageClient currentTimeRange={timeRange}>
			<Suspense
				fallback={
					<div className="max-w-7xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
							{[...Array(4)].map((_, i) => (
								<Card key={i} className="animate-pulse">
									<CardContent className="p-6">
										<div className="h-4 bg-gray-200 rounded mb-2"></div>
										<div className="h-8 bg-gray-200 rounded"></div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				}>
				<AnalyticsDashboardServerComplete
					dashboardData={dashboardData}
					activityData={activityData}
					insightsData={insightsData}
					timeRange={timeRange}
				/>
			</Suspense>
		</AnalyticsPageClient>
	);
}
