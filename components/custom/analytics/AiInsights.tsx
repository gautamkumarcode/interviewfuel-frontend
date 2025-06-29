"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Brain, Star, TrendingUp, Zap } from "lucide-react";

export function AIInsights() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Brain className="h-5 w-5" />
							AI-Powered Insights
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="flex items-start gap-3">
								<div className="p-1 bg-blue-100 rounded">
									<TrendingUp className="h-4 w-4 text-blue-600" />
								</div>
								<div>
									<div className="font-medium text-blue-900 mb-1">
										Strong Improvement Trend
									</div>
									<div className="text-sm text-blue-800">
										Your completion rate has improved by 44% over the last 3
										months. Keep up the consistent practice!
									</div>
								</div>
							</div>
						</div>

						<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
							<div className="flex items-start gap-3">
								<div className="p-1 bg-green-100 rounded">
									<Zap className="h-4 w-4 text-green-600" />
								</div>
								<div>
									<div className="font-medium text-green-900 mb-1">
										Time Management Mastery
									</div>
									<div className="text-sm text-green-800">
										You&lsquo;ve reduced your average time per question by 48% while
										maintaining accuracy. Excellent progress!
									</div>
								</div>
							</div>
						</div>

						<div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
							<div className="flex items-start gap-3">
								<div className="p-1 bg-orange-100 rounded">
									<AlertTriangle className="h-4 w-4 text-orange-600" />
								</div>
								<div>
									<div className="font-medium text-orange-900 mb-1">
										Focus Area Identified
									</div>
									<div className="text-sm text-orange-800">
										System Design questions are taking 2x longer than average.
										Consider dedicated practice sessions.
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Star className="h-5 w-5" />
							Personalized Recommendations
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="p-3 border border-gray-200 rounded-lg">
								<div className="font-medium text-gray-900 mb-1">
									📚 Study Plan
								</div>
								<div className="text-sm text-gray-600">
									Focus on Algorithm questions for the next 2 weeks to improve
									your weakest area.
								</div>
							</div>

							<div className="p-3 border border-gray-200 rounded-lg">
								<div className="font-medium text-gray-900 mb-1">
									⏰ Optimal Timing
								</div>
								<div className="text-sm text-gray-600">
									Schedule practice sessions between 7-9 PM when you perform 23%
									better than average.
								</div>
							</div>

							<div className="p-3 border border-gray-200 rounded-lg">
								<div className="font-medium text-gray-900 mb-1">
									🎯 Next Milestone
								</div>
								<div className="text-sm text-gray-600">
									You&lsquo;re 1% away from 90% completion rate. Focus on accuracy in
									your next 5 sessions.
								</div>
							</div>

							<div className="p-3 border border-gray-200 rounded-lg">
								<div className="font-medium text-gray-900 mb-1">
									🔄 Review Strategy
								</div>
								<div className="text-sm text-gray-600">
									Revisit JavaScript closure questions - you haven&lsquo;t practiced
									them in 2 weeks.
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Predicted Performance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="text-center p-4 bg-blue-50 rounded-lg">
							<div className="text-2xl font-bold text-blue-600 mb-1">92%</div>
							<div className="text-sm text-blue-800">
								Predicted completion rate next month
							</div>
						</div>
						<div className="text-center p-4 bg-green-50 rounded-lg">
							<div className="text-2xl font-bold text-green-600 mb-1">3.8m</div>
							<div className="text-sm text-green-800">
								Predicted avg time per question
							</div>
						</div>
						<div className="text-center p-4 bg-purple-50 rounded-lg">
							<div className="text-2xl font-bold text-purple-600 mb-1">65</div>
							<div className="text-sm text-purple-800">
								Predicted questions solved next month
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
