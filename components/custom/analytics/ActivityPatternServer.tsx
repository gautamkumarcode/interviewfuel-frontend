import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityPatterns as ActivityPatternsType } from "@/services/analytics/analytics-services";
import { Activity, Calendar, Clock, TrendingUp } from "lucide-react";

interface ActivityPatternServerProps {
	activityData: ActivityPatternsType | null;
	timeRange: number;
}

export function ActivityPatternServer({
	activityData,
	timeRange,
}: ActivityPatternServerProps) {
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

	if (!activityData) {
		return (
			<div className="space-y-6 w-full">
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

	// Get display data - always use full year
	const displayData = activityData.activityData.slice(-365);

	// Safety check for empty data
	if (!displayData || displayData.length === 0) {
		return (
			<div className="space-y-6 w-full">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Activity Patterns
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-500">No activity data available</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Create heatmap data structure
	const createHeatmapData = () => {
		const weeks: any[][] = [];
		const startDate = new Date(displayData[0]?.date || new Date());
		const endDate = new Date(
			displayData[displayData.length - 1]?.date || new Date()
		);

		// Find the Sunday before the start date
		const firstSunday = new Date(startDate);
		firstSunday.setDate(startDate.getDate() - startDate.getDay());

		// Create weeks array
		const currentDate = new Date(firstSunday);
		while (currentDate <= endDate) {
			const week: any[] = [];

			// Add 7 days to the week
			for (let i = 0; i < 7; i++) {
				const dayData = displayData.find((d) => {
					const dataDate = new Date(d.date);
					return dataDate.toDateString() === currentDate.toDateString();
				});

				week.push(dayData || null);
				currentDate.setDate(currentDate.getDate() + 1);
			}

			weeks.push(week);
		}

		return weeks;
	};

	const allWeeks = createHeatmapData();
	const weeksToShow = allWeeks.slice(-52); // Full year
	const mobileWeeksToShow = allWeeks.slice(-8); // ~8 weeks for mobile

	// Get months for header
	const getMonthsForWeeks = (weeks: any[][]) => {
		const months: { name: string; weeks: number }[] = [];
		let currentMonth = -1;
		let weekCount = 0;

		weeks.forEach((week) => {
			const firstDay = week.find((day) => day !== null);
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
			}
			weekCount++;
		});
		if (months.length > 0) {
			months[months.length - 1].weeks = weekCount;
		}
		return months;
	};

	const fullYearMonths = getMonthsForWeeks(weeksToShow);
	const mobileMonths = getMonthsForWeeks(mobileWeeksToShow);

	return (
		<div className="space-y-6 w-full">
			{/* Activity Heatmap - Fixed full width */}
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						<span className="hidden md:inline">
							Practice Activity (Last Year)
						</span>
						<span className="md:hidden">Practice Activity (Last 2 Months)</span>
					</CardTitle>
					<div className="flex items-center gap-4 text-sm text-gray-600">
						<span>{activityData.stats.activeDays} active days</span>
						<Badge variant="outline">
							{activityData.stats.consistencyRate}% consistency
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="p-6 w-full justify-center items-center flex">
					<div className="space-y-4 w-full justify-center items-center ">
						{/* Desktop View - Full Year */}
						<div className="hidden md:flex flex-col w-full justify-center items-center ">
							{/* Month headers */}
							<div className="flex mb-2 w-full">
								<div className="w-8 mr-2 flex-shrink-0"></div>
								<div className="flex text-xs text-gray-500">
									{fullYearMonths.map((month, index) => (
										<div
											key={index}
											className="text-center"
											style={{
												width: `${month.weeks * 12 + (month.weeks - 1)}px`, // 12px per week + 1px gap between weeks
											}}>
											{month.name}
										</div>
									))}
								</div>
							</div>

							{/* Full year heatmap grid */}
							<div className="w-full flex flex-col justify-center items-center">
								<div className="flex w-full justify-center items-center">
									{/* Day labels */}
									<div className="flex flex-col text-xs text-gray-500 mr-2 flex-shrink-0 w-8">
										{["", "Mon", "", "Wed", "", "Fri", ""].map((day, index) => (
											<div
												key={index}
												className="h-3 mb-1 flex items-center justify-end pr-1">
												{day}
											</div>
										))}
									</div>

									{/* Activity grid - Full width */}
									<div className="overflow-x-auto w-full">
										<div className="flex">
											{weeksToShow.map((week, weekIndex) => (
												<div
													key={weekIndex}
													className="flex flex-col"
													style={{
														marginRight:
															weekIndex < weeksToShow.length - 1 ? "1px" : "0",
														width: "12px",
													}}>
													{week.map((day, dayIndex) => (
														<div
															key={dayIndex}
															className={`
																w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-700 
																transition-all duration-100 ease-in-out cursor-pointer
																hover:scale-125 hover:z-20 hover:border-gray-400 hover:shadow-md
																${day ? getIntensityColor(day.level) : "bg-gray-100 dark:bg-gray-800"}
															`}
															style={{
																marginBottom: dayIndex < 6 ? "1px" : "0",
															}}
															title={
																day
																	? `${new Date(
																			day.date
																	  ).toLocaleDateString()}: ${
																			day.questionsAnswered
																	  } questions, ${day.practiceTime} minutes`
																	: "No activity"
															}
														/>
													))}
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Mobile View */}
						<div className="md:hidden w-full">
							{/* Month headers for mobile */}
							<div className="flex mb-2 w-full">
								<div className="w-10 mr-2 flex-shrink-0"></div>
								<div className="flex text-xs text-gray-500">
									{mobileMonths.map((month, index) => (
										<div
											key={index}
											className="text-center"
											style={{
												width: `${month.weeks * 16 + (month.weeks - 1) * 2}px`, // 16px per week + 2px gap between weeks
											}}>
											{month.name}
										</div>
									))}
								</div>
							</div>

							{/* Mobile heatmap grid */}
							<div className="w-full">
								<div className="flex w-full">
									{/* Day labels */}
									<div className="flex flex-col text-xs text-gray-500 mr-2 flex-shrink-0 w-10">
										{["", "Mon", "", "Wed", "", "Fri", ""].map((day, index) => (
											<div
												key={index}
												className="h-4 mb-1 flex items-center justify-end pr-1">
												{day}
											</div>
										))}
									</div>

									{/* Activity grid - Full width for mobile */}
									<div className="overflow-x-auto">
										<div className="flex">
											{mobileWeeksToShow.map((week, weekIndex) => (
												<div
													key={weekIndex}
													className="flex flex-col"
													style={{
														marginRight:
															weekIndex < mobileWeeksToShow.length - 1
																? "2px"
																: "0",
														width: "16px",
													}}>
													{week.map((day, dayIndex) => (
														<div
															key={dayIndex}
															className={`
																w-4 h-4 rounded-sm border border-gray-200 dark:border-gray-700 
																transition-all duration-100 ease-in-out cursor-pointer
																hover:scale-110 hover:z-20 hover:border-gray-400 hover:shadow-lg
																${day ? getIntensityColor(day.level) : "bg-gray-100 dark:bg-gray-800"}
															`}
															style={{
																marginBottom: dayIndex < 6 ? "2px" : "0",
															}}
															title={
																day
																	? `${new Date(
																			day.date
																	  ).toLocaleDateString()}: ${
																			day.questionsAnswered
																	  } questions, ${day.practiceTime} minutes`
																	: "No activity"
															}
														/>
													))}
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Legend */}
						<div className="flex items-center justify-between text-xs text-gray-500 mt-4 w-full">
							<span className="flex-shrink-0">Less</span>
							<div className="flex gap-1 mx-4 flex-1 justify-center">
								{[0, 1, 2, 3, 4].map((level) => (
									<div
										key={level}
										className={`rounded-sm ${getIntensityColor(
											level
										)} w-3 h-3 flex-shrink-0`}
									/>
								))}
							</div>
							<span className="flex-shrink-0">More</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
				{/* Streak Information */}
				<Card className="w-full">
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
				<Card className="w-full">
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
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Weekly Pattern
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-7 gap-2 w-full">
						{activityData.weeklyPattern.map((questions, index) => {
							const maxQuestions = Math.max(...activityData.weeklyPattern);
							const height =
								maxQuestions > 0 ? (questions / maxQuestions) * 100 : 0;

							return (
								<div key={index} className="text-center w-full">
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
