import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardAnalytics } from "@/services/analytics/analytics-services";
import { BarChart3, Target } from "lucide-react";

interface CategoryAnalysisServerProps {
	analyticsData: DashboardAnalytics | null;
}

export function CategoryAnalysisServer({
	analyticsData,
}: CategoryAnalysisServerProps) {
	if (
		!analyticsData?.categoryPerformance ||
		analyticsData.categoryPerformance.length === 0
	) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Category Analysis
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center py-8">
							<Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								No Category Data
							</h3>
							<p className="text-gray-600">
								Complete some practice sessions to see your category performance
								analysis.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Category Performance
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{analyticsData.categoryPerformance.map((category, index) => {
							const accuracyPercent = parseFloat(category.accuracy.toString());
							const getAccuracyColor = (accuracy: number) => {
								if (accuracy >= 80) return "text-green-600 bg-green-100";
								if (accuracy >= 60) return "text-yellow-600 bg-yellow-100";
								return "text-red-600 bg-red-100";
							};

							return (
								<div key={index} className="p-4 border rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-semibold text-gray-900">
											{category.name}
										</h4>
										<Badge className={getAccuracyColor(accuracyPercent)}>
											{accuracyPercent}% accuracy
										</Badge>
									</div>
									<div className="grid grid-cols-3 gap-4 text-sm">
										<div>
											<p className="text-gray-600">Attempted</p>
											<p className="font-medium">{category.attempted}</p>
										</div>
										<div>
											<p className="text-gray-600">Correct</p>
											<p className="font-medium">{category.correct}</p>
										</div>
										<div>
											<p className="text-gray-600">Avg Time</p>
											<p className="font-medium">
												{Math.round(category.averageTime)}s
											</p>
										</div>
									</div>
									<div className="mt-3">
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-blue-600 h-2 rounded-full"
												style={{ width: `${accuracyPercent}%` }}
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Difficulty Breakdown */}
			<Card>
				<CardHeader>
					<CardTitle>Difficulty Breakdown</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{Object.entries(analyticsData.difficultyStats).map(
							([level, stats]) => {
								const accuracy = parseFloat(stats.accuracy.toString());
								const getColor = (level: string) => {
									switch (level) {
										case "easy":
											return "border-green-200 bg-green-50";
										case "medium":
											return "border-yellow-200 bg-yellow-50";
										case "hard":
											return "border-red-200 bg-red-50";
										default:
											return "border-gray-200 bg-gray-50";
									}
								};

								return (
									<div
										key={level}
										className={`p-4 border rounded-lg ${getColor(level)}`}>
										<h4 className="font-semibold capitalize mb-2">{level}</h4>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Attempted:</span>
												<span className="font-medium">{stats.attempted}</span>
											</div>
											<div className="flex justify-between">
												<span>Correct:</span>
												<span className="font-medium">{stats.correct}</span>
											</div>
											<div className="flex justify-between">
												<span>Accuracy:</span>
												<span className="font-medium">{accuracy}%</span>
											</div>
										</div>
									</div>
								);
							}
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
