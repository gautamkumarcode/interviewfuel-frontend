"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BookOpen,
	Brain,
	Calendar,
	CheckCircle,
	Target,
	Trophy,
	Zap,
} from "lucide-react";

const monthlyGoals = [
	{
		goal: "Complete 100 questions",
		current: 87,
		target: 100,
		category: "Volume",
	},
	{
		goal: "Achieve 85% completion rate",
		current: 89,
		target: 85,
		category: "Accuracy",
	},
	{
		goal: "Average under 5 min/question",
		current: 4.4,
		target: 5.0,
		category: "Speed",
	},
	{
		goal: "Master 3 new categories",
		current: 2,
		target: 3,
		category: "Breadth",
	},
];

const achievements = [
	{
		id: 1,
		title: "First Steps",
		description: "Complete your first practice session",
		icon: Target,
		earned: true,
		earnedDate: "2024-01-01",
	},
	{
		id: 2,
		title: "Consistency Champion",
		description: "Practice for 7 consecutive days",
		icon: Calendar,
		earned: true,
		earnedDate: "2024-01-15",
	},
	{
		id: 3,
		title: "Speed Demon",
		description: "Average under 5 minutes per question",
		icon: Zap,
		earned: true,
		earnedDate: "2024-02-26",
	},
	{
		id: 4,
		title: "Perfectionist",
		description: "Achieve 90% completion rate",
		icon: Trophy,
		earned: false,
		progress: 89,
	},
	{
		id: 5,
		title: "Algorithm Master",
		description: "Solve 50 algorithm questions",
		icon: Brain,
		earned: false,
		progress: 34,
	},
	{
		id: 6,
		title: "Knowledge Seeker",
		description: "Answer 500 questions total",
		icon: BookOpen,
		earned: false,
		progress: 342,
	},
];

export function GoalsAchievements() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5" />
							Monthly Goals
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{monthlyGoals.map((goal, index) => {
								const progress =
									goal.category === "Speed"
										? Math.min(
												100,
												((goal.target - goal.current) / goal.target) * 100 + 100
										  )
										: Math.min(100, (goal.current / goal.target) * 100);
								const isCompleted =
									goal.category === "Speed"
										? goal.current <= goal.target
										: goal.current >= goal.target;

								return (
									<div key={index} className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-medium">{goal.goal}</span>
											<div className="flex items-center gap-2">
												{isCompleted && (
													<CheckCircle className="h-4 w-4 text-green-600" />
												)}
												<Badge variant={isCompleted ? "default" : "outline"}>
													{goal.category === "Speed"
														? `${goal.current}/${goal.target}m`
														: `${goal.current}/${goal.target}`}
												</Badge>
											</div>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className={`h-2 rounded-full transition-all duration-300 ${
													isCompleted ? "bg-green-600" : "bg-blue-600"
												}`}
												style={{ width: `${Math.min(100, progress)}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Trophy className="h-5 w-5" />
							Achievements
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{achievements.map((achievement) => (
								<div
									key={achievement.id}
									className={`flex items-center gap-3 p-3 rounded-lg border ${
										achievement.earned
											? "bg-yellow-50 border-yellow-200"
											: "bg-gray-50 border-gray-200"
									}`}>
									<div
										className={`p-2 rounded-lg ${
											achievement.earned ? "bg-yellow-100" : "bg-gray-100"
										}`}>
										<achievement.icon
											className={`h-5 w-5 ${
												achievement.earned ? "text-yellow-600" : "text-gray-400"
											}`}
										/>
									</div>
									<div className="flex-1">
										<div
											className={`font-medium ${
												achievement.earned ? "text-yellow-900" : "text-gray-700"
											}`}>
											{achievement.title}
										</div>
										<div
											className={`text-sm ${
												achievement.earned ? "text-yellow-700" : "text-gray-500"
											}`}>
											{achievement.description}
										</div>
										{!achievement.earned && achievement.progress && (
											<div className="mt-2">
												<div className="w-full bg-gray-200 rounded-full h-1">
													<div
														className="bg-blue-600 h-1 rounded-full"
														style={{
															width: `${Math.min(
																100,
																(achievement.progress /
																	(achievement.id === 5
																		? 50
																		: achievement.id === 6
																		? 500
																		: 100)) *
																	100
															)}%`,
														}}
													/>
												</div>
												<div className="text-xs text-gray-500 mt-1">
													{achievement.progress}/
													{achievement.id === 5
														? 50
														: achievement.id === 6
														? 500
														: 100}
												</div>
											</div>
										)}
									</div>
									{achievement.earned && (
										<Badge className="bg-yellow-100 text-yellow-800">
											Earned{" "}
											{new Date(achievement.earnedDate!).toLocaleDateString()}
										</Badge>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
