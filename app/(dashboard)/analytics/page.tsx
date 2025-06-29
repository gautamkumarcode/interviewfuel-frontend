"use client";

import AnalyticsDashboardHOC from "@/components/screens/analyticsdashboard/AnalyticsDashboardHOC";

export default function AnalyticsPage(props: any) {
	return <AnalyticsDashboardHOC onExit={() => window.history.back()} />;
}
