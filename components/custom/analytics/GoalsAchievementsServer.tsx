import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardAnalytics } from "@/services/analytics/analytics-services";
import { Award, Target, Trophy } from "lucide-react";

interface GoalsAchievementsServerProps {
	analyticsData: DashboardAnalytics | null;
}

export function GoalsAchievementsServer({
	analyticsData,
}: GoalsAchievementsServerProps) {
	// Mock goals data - in a real app, this would come from the backend
	const goals = [
		{
			id: 1,
			title: "Daily Practice",
			description: "Practice for at least 30 minutes daily",
			progress: 75,
			target: 100,
			type: "daily",
		},
		{
			id: 2,
			title: "Weekly Questions",
			description: "Answer 50 questions this week",
			progress: analyticsData?.overview.totalQuestions || 0,
			target: 50,
			type: "weekly",
		},
		{
			id: 3,
			title: "Accuracy Goal",
			description: "Maintain 80% accuracy",
			progress: analyticsData?.overview.accuracy || 0,
			target: 80,
			type: "accuracy",
		},
	];

	return (
		<div className="space-y-6">
			{/* Current Goals */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Current Goals
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{goals.map((goal) => {
							const progressPercent = Math.min(
								(goal.progress / goal.target) * 100,
								100
							);
							const isCompleted = goal.progress >= goal.target;

							return (
								<div key={goal.id} className="p-4 border rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-semibold text-gray-900">
											{goal.title}
										</h4>
										<Badge variant={isCompleted ? "default" : "secondary"}>
											{isCompleted ? "Completed" : "In Progress"}
										</Badge>
									</div>
									<p className="text-sm text-gray-600 mb-3">
										{goal.description}
									</p>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Progress</span>
											<span>
												{goal.progress} / {goal.target}
												{goal.type === "accuracy" ? "%" : ""}
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className={`h-2 rounded-full ${
													isCompleted ? "bg-green-600" : "bg-blue-600"
												}`}
												style={{ width: `${progressPercent}%` }}
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Achievements */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Award className="h-5 w-5" />
						Recent Achievements
					</CardTitle>
				</CardHeader>
				<CardContent>
					{analyticsData?.achievements &&
					analyticsData.achievements.length > 0 ? (
						<div className="space-y-3">
							{analyticsData.achievements
								.slice(0, 5)
								.map((achievement, index) => (
									<div
										key={index}
										className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
										<Trophy className="h-5 w-5 text-yellow-600" />
										<div>
											<h4 className="font-medium text-gray-900">
												{achievement.achievementId?.title || "Achievement"}
											</h4>
											<p className="text-sm text-gray-600">
												{achievement.achievementId?.description || "Great job!"}
											</p>
										</div>
										<Badge variant="outline" className="ml-auto">
											{achievement.achievementId?.rarity || "common"}
										</Badge>
									</div>
								))}
						</div>
					) : (
						<div className="text-center py-8">
							<Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								No Achievements Yet
							</h3>
							<p className="text-gray-600">
								Keep practicing to unlock your first achievements!
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Statistics */}
			<Card>
				<CardHeader>
					<CardTitle>Your Statistics</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">
								{analyticsData?.overview.totalQuestions || 0}
							</div>
							<div className="text-sm text-gray-600">Questions Answered</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{analyticsData?.overview.accuracy || 0}%
							</div>
							<div className="text-sm text-gray-600">Accuracy</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">
								{analyticsData?.overview.currentStreak || 0}
							</div>
							<div className="text-sm text-gray-600">Current Streak</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-600">
								{Math.round(
									(analyticsData?.overview.totalPracticeTime || 0) / 60
								)}
								h
							</div>
							<div className="text-sm text-gray-600">Practice Time</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
