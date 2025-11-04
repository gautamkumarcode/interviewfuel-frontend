"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	ActivityPatterns as ActivityPatternsType,
	analyticsService,
} from "@/services/analytics/analytics-services";
import { Activity, Calendar, Clock, TrendingUp } from "lucide-react";
import { useQuery } from "react-query";

interface ActivityPatternsProps {
	timeRange?: number;
}

export function ActivityPatterns({ timeRange = 365 }: ActivityPatternsProps) {
	const {
		data: activityData,
		isLoading,
		error,
	} = useQuery<ActivityPatternsType>(
		["activity-patterns", timeRange],
		() => analyticsService.getActivityPatterns(timeRange),
		{
			staleTime: 1000 * 60 * 10, // 10 minutes
		}
	);

	const getIntensityColor = (level: number) => {
		switch (level) {
			case 0:
				return "bg-gray-100 dark:bg-gray-800";
			case 1:
				return "bg-green-200 dark:bg-green-900";
			case 2:
				return "bg-green-300 dark:bg-green-700";
			case 3:
				return "bg-green-400 dark:bg-green-600";
			case 4:
				return "bg-green-500 dark:bg-green-500";
			default:
				return "bg-gray-100 dark:bg-gray-800";
		}
	};

	const getDayName = (dayIndex: number) => {
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		return days[dayIndex];
	};

	const getMonthName = (monthIndex: number) => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		return months[monthIndex];
	};

	const formatTimeDistribution = (distribution: any) => {
		const total =
			distribution.morning +
			distribution.afternoon +
			distribution.evening +
			distribution.night;
		if (total === 0) return { morning: 0, afternoon: 0, evening: 0, night: 0 };

		return {
			morning: Math.round((distribution.morning / total) * 100),
			afternoon: Math.round((distribution.afternoon / total) * 100),
			evening: Math.round((distribution.evening / total) * 100),
			night: Math.round((distribution.night / total) * 100),
		};
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Activity Patterns
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="animate-pulse">
							<div className="h-32 bg-gray-200 rounded mb-4"></div>
							<div className="grid grid-cols-2 gap-4">
								<div className="h-20 bg-gray-200 rounded"></div>
								<div className="h-20 bg-gray-200 rounded"></div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !activityData) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Activity Patterns
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-500">Failed to load activity data</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const timeDistribution = formatTimeDistribution(
		activityData.timeDistribution
	);

	// Group activity data by weeks for heatmap
	const weeks: any[][] = [];
	let currentWeek: any[] = [];

	// Start from the first day and group by weeks
	activityData.activityData.forEach((day, index) => {
		const dayOfWeek = new Date(day.date).getDay();

		// If it's Sunday and we have data, start a new week
		if (dayOfWeek === 0 && currentWeek.length > 0) {
			weeks.push([...currentWeek]);
			currentWeek = [];
		}

		currentWeek.push(day);

		// If it's the last day, push the current week
		if (index === activityData.activityData.length - 1) {
			weeks.push(currentWeek);
		}
	});

	// Get months for header
	const months: { name: string; weeks: number }[] = [];
	let currentMonth = -1;
	let weekCount = 0;

	weeks.forEach((week) => {
		const firstDay = week[0];
		if (firstDay) {
			const month = new Date(firstDay.date).getMonth();
			if (month !== currentMonth) {
				if (weekCount > 0) {
					months[months.length - 1].weeks = weekCount;
				}
				months.push({ name: getMonthName(month), weeks: 0 });
				currentMonth = month;
				weekCount = 0;
			}
			weekCount++;
		}
	});
	if (months.length > 0) {
		months[months.length - 1].weeks = weekCount;
	}

	return (
		<div className="space-y-6">
			{/* GitHub-style Activity Heatmap */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Practice Activity
					</CardTitle>
					<div className="flex items-center gap-4 text-sm text-gray-600">
						<span>
							{activityData.stats.activeDays} active days in the last year
						</span>
						<Badge variant="outline">
							{activityData.stats.consistencyRate}% consistency
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Month headers */}
						<div className="flex text-xs text-gray-500 ml-8 w-full">
							{months.map((month, index) => (
								<div
									key={index}
									className="text-center"
									style={{ flex: month.weeks }}>
									{month.name}
								</div>
							))}
						</div>

						{/* Heatmap grid */}
						<div className="flex w-full">
							{/* Day labels */}
							<div className="flex flex-col text-xs text-gray-500 mr-2">
								<div className="h-3"></div> {/* Spacer for alignment */}
								<div className="h-3 flex items-center">Mon</div>
								<div className="h-3"></div>
								<div className="h-3 flex items-center">Wed</div>
								<div className="h-3"></div>
								<div className="h-3 flex items-center">Fri</div>
								<div className="h-3"></div>
							</div>

							{/* Activity grid */}
							<div className="flex flex-1 gap-1">
								{weeks.map((week, weekIndex) => (
									<div
										key={weekIndex}
										className="flex flex-col gap-1"
										style={{ flex: 1 }}>
										{Array.from({ length: 7 }, (_, dayIndex) => {
											const day = week.find(
												(d) => new Date(d.date).getDay() === dayIndex
											);
											return (
												<TooltipProvider key={dayIndex}>
													<Tooltip>
														<TooltipTrigger asChild>
															<div
																className={`w-3 h-3 rounded-sm cursor-pointer border border-gray-200 dark:border-gray-700 ${
																	day
																		? getIntensityColor(day.level)
																		: "bg-gray-100 dark:bg-gray-800"
																}`}
															/>
														</TooltipTrigger>
														<TooltipContent>
															<div className="text-sm">
																<div className="font-medium">
																	{day
																		? new Date(day.date).toLocaleDateString()
																		: "No data"}
																</div>
																{day && (
																	<div className="text-gray-600">
																		<div>{day.questionsAnswered} questions</div>
																		<div>{day.practiceTime} minutes</div>
																		<div>{day.sessionsCount} sessions</div>
																	</div>
																)}
															</div>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											);
										})}
									</div>
								))}
							</div>
						</div>

						{/* Legend */}
						<div className="flex items-center justify-between text-xs text-gray-500">
							<span>Less</span>
							<div className="flex gap-1">
								{[0, 1, 2, 3, 4].map((level) => (
									<div
										key={level}
										className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
									/>
								))}
							</div>
							<span>More</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Streak Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Study Streaks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="text-center">
								<div className="text-4xl font-bold text-green-600 mb-2">
									{activityData.streaks.current}
								</div>
								<div className="text-gray-600 mb-4">Current Streak (days)</div>
								<div className="text-sm text-gray-500">
									Longest streak: {activityData.streaks.longest} days
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 pt-4 border-t">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">
										{activityData.stats.averageDaily}
									</div>
									<div className="text-xs text-gray-500">Avg questions/day</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">
										{Math.round(activityData.stats.totalPracticeTime / 60)}h
									</div>
									<div className="text-xs text-gray-500">
										Total practice time
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Time Distribution */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Time Distribution
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span>Morning (6AM-12PM)</span>
									<span>{timeDistribution.morning}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-blue-600 h-2 rounded-full"
										style={{ width: `${timeDistribution.morning}%` }}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span>Afternoon (12PM-6PM)</span>
									<span>{timeDistribution.afternoon}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-green-600 h-2 rounded-full"
										style={{ width: `${timeDistribution.afternoon}%` }}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span>Evening (6PM-12AM)</span>
									<span>{timeDistribution.evening}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-purple-600 h-2 rounded-full"
										style={{ width: `${timeDistribution.evening}%` }}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span>Night (12AM-6AM)</span>
									<span>{timeDistribution.night}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-indigo-600 h-2 rounded-full"
										style={{ width: `${timeDistribution.night}%` }}
									/>
								</div>
							</div>
						</div>
						<div className="mt-4 p-3 bg-blue-50 rounded-lg">
							<div className="text-sm text-blue-800">
								<strong>Peak Hour:</strong> {activityData.peakHour}:00 -{" "}
								{activityData.peakHour + 1}:00
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Weekly Pattern */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Weekly Pattern
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-7 gap-2">
						{activityData.weeklyPattern.map((questions, index) => {
							const maxQuestions = Math.max(...activityData.weeklyPattern);
							const height =
								maxQuestions > 0 ? (questions / maxQuestions) * 100 : 0;

							return (
								<div key={index} className="text-center">
									<div className="h-20 flex items-end justify-center mb-2">
										<div
											className="w-8 bg-blue-500 rounded-t"
											style={{ height: `${height}%` }}
										/>
									</div>
									<div className="text-xs text-gray-500">
										{getDayName(index)}
									</div>
									<div className="text-sm font-medium">{questions}</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}