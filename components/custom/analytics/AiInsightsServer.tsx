import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AIInsight,
	AIInsightsData,
} from "@/services/analytics/analytics-services";
import {
	Activity,
	AlertCircle,
	Award,
	BookOpen,
	Brain,
	Calendar,
	CheckCircle,
	Lightbulb,
	Star,
	Target,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";

interface AIInsightsServerProps {
	insightsData: AIInsightsData | null;
}

export function AIInsightsServer({ insightsData }: AIInsightsServerProps) {
	const getInsightIcon = (iconName: string) => {
		const iconProps = { className: "h-4 w-4" };
		switch (iconName) {
			case "trending-up":
				return <TrendingUp {...iconProps} />;
			case "trending-down":
				return <TrendingDown {...iconProps} />;
			case "target":
				return <Target {...iconProps} />;
			case "award":
				return <Award {...iconProps} />;
			case "calendar":
				return <Calendar {...iconProps} />;
			case "calendar-check":
				return <Calendar {...iconProps} />;
			case "book-open":
				return <BookOpen {...iconProps} />;
			case "activity":
				return <Activity {...iconProps} />;
			case "zap":
				return <Zap {...iconProps} />;
			default:
				return <Lightbulb {...iconProps} />;
		}
	};

	const getInsightColor = (type: string) => {
		switch (type) {
			case "positive":
				return {
					bg: "bg-green-50 border-green-200",
					icon: "text-green-600",
					badge: "bg-green-100 text-green-800",
				};
			case "warning":
				return {
					bg: "bg-orange-50 border-orange-200",
					icon: "text-orange-600",
					badge: "bg-orange-100 text-orange-800",
				};
			case "suggestion":
				return {
					bg: "bg-blue-50 border-blue-200",
					icon: "text-blue-600",
					badge: "bg-blue-100 text-blue-800",
				};
			default:
				return {
					bg: "bg-gray-50 border-gray-200",
					icon: "text-gray-600",
					badge: "bg-gray-100 text-gray-800",
				};
		}
	};

	const getInsightTypeLabel = (type: string) => {
		switch (type) {
			case "positive":
				return "Achievement";
			case "warning":
				return "Attention";
			case "suggestion":
				return "Recommendation";
			default:
				return "Insight";
		}
	};

	if (!insightsData) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Brain className="h-5 w-5" />
							AI-Powered Insights
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center py-8">
							<AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-500 mb-4">Failed to load insights</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Overview Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="text-center">
							<p className="text-2xl font-bold text-gray-900">
								{insightsData.overallAccuracy || 0}%
							</p>
							<p className="text-sm text-gray-600">Overall Accuracy</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-center">
							<p className="text-2xl font-bold text-gray-900">
								{insightsData.totalQuestions || 0}
							</p>
							<p className="text-sm text-gray-600">Total Questions</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-center">
							<p className="text-2xl font-bold text-gray-900">
								{insightsData.activeDays || 0}
							</p>
							<p className="text-sm text-gray-600">Active Days</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-center">
							<p className="text-2xl font-bold text-gray-900">
								{insightsData.consistencyRate || 0}%
							</p>
							<p className="text-sm text-gray-600">Consistency Rate</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Brain className="h-5 w-5" />
							AI-Powered Insights
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{insightsData.insights && insightsData.insights.length > 0 ? (
							insightsData.insights.map((insight: AIInsight, index: number) => {
								const colors = getInsightColor(insight.type);
								return (
									<div
										key={index}
										className={`p-4 border rounded-lg ${colors.bg}`}>
										<div className="flex items-start gap-3">
											<div
												className={`p-1 bg-opacity-50 rounded ${colors.icon}`}>
												{getInsightIcon(insight.icon)}
											</div>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<div className="font-medium text-gray-900">
														{insight.title}
													</div>
													<Badge variant="secondary" className={colors.badge}>
														{getInsightTypeLabel(insight.type)}
													</Badge>
												</div>
												<div className="text-sm text-gray-700">
													{insight.message}
												</div>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<div className="text-center py-8">
								<CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Great Job!
								</h3>
								<p className="text-gray-600">
									Keep practicing to unlock more personalized insights.
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Star className="h-5 w-5" />
							Quick Actions
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-3">
							<div className="h-auto p-4 justify-start border rounded-lg hover:bg-gray-50 cursor-pointer">
								<div className="flex items-center">
									<Target className="h-4 w-4 mr-3" />
									<div className="text-left">
										<div className="font-medium">Focus Practice</div>
										<div className="text-xs text-gray-600">
											Work on weak categories
										</div>
									</div>
								</div>
							</div>
							<div className="h-auto p-4 justify-start border rounded-lg hover:bg-gray-50 cursor-pointer">
								<div className="flex items-center">
									<Calendar className="h-4 w-4 mr-3" />
									<div className="text-left">
										<div className="font-medium">Set Schedule</div>
										<div className="text-xs text-gray-600">
											Build consistent habits
										</div>
									</div>
								</div>
							</div>
							<div className="h-auto p-4 justify-start border rounded-lg hover:bg-gray-50 cursor-pointer">
								<div className="flex items-center">
									<Award className="h-4 w-4 mr-3" />
									<div className="text-left">
										<div className="font-medium">Challenge Mode</div>
										<div className="text-xs text-gray-600">
											Try harder questions
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
