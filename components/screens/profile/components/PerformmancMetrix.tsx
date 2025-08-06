import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/user";
import { TrendingUp } from "lucide-react";

interface PerformanceMetricsProps {
	stats: User["stats"];
}

export default function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					Performance Metrics
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<div className="flex justify-between text-sm mb-2">
						<span>Completion Rate</span>
						<span className="font-medium">{stats?.completionRate || 0}%</span>
					</div>
					<Progress value={stats?.completionRate || 0} className="h-2" />
				</div>

				<div>
					<div className="flex justify-between text-sm mb-2">
						<span>Average Time per Question</span>
						<span className="font-medium">{stats?.averageTime || 0} min</span>
					</div>
					<Progress
						value={
							stats?.averageTime
								? Math.min((stats.averageTime / 10) * 100, 100)
								: 0
						}
						className="h-2"
					/>
				</div>

				<Separator />

				<div className="grid grid-cols-2 gap-4 text-center">
					<div>
						<div className="text-lg font-semibold text-gray-900">
							{stats?.totalSessions || 0}
						</div>
						<div className="text-sm text-gray-600">Total Sessions</div>
					</div>
					<div>
						<div className="text-lg font-semibold text-gray-900">
							{stats?.longestStreak || 0}
						</div>
						<div className="text-sm text-gray-600">Longest Streak</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
