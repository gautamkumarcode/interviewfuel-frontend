"use client";

import AnalyticsDashboardHOC from "@/components/screens/analyticsdashboard/AnalyticsDashboardHOC";

export default function AnalyticsPage() {
	return <AnalyticsDashboardHOC onExit={() => window.history.back()} />;
}
