import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

interface PerformanceTrendsServerProps {
	performanceData?: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PerformanceTrendsServer({ performanceData }: PerformanceTrendsServerProps) {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Performance Trends
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Performance Analysis
						</h3>
						<p className="text-gray-600">
							Detailed performance trends will be displayed here based on your practice history.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}