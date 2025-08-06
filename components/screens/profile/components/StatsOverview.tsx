import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types/user";

interface StatsOverviewProps {
	stats: User["stats"];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Card>
				<CardContent className="p-4 text-center">
					<div className="text-2xl font-bold text-blue-600 mb-1">
						{stats?.questionsAnswered || 0}
					</div>
					<div className="text-sm text-gray-600">Questions Answered</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="p-4 text-center">
					<div className="text-2xl font-bold text-green-600 mb-1">
						{stats?.practiceHours ? `${stats.practiceHours}h` : "0h"}
					</div>
					<div className="text-sm text-gray-600">Practice Time</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="p-4 text-center">
					<div className="text-2xl font-bold text-orange-600 mb-1">
						{stats?.currentStreak || 0}
					</div>
					<div className="text-sm text-gray-600">Current Streak</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="p-4 text-center">
					<div className="text-2xl font-bold text-purple-600 mb-1">
						{stats?.completionRate ? `${stats.completionRate}%` : "0%"}
					</div>
					<div className="text-sm text-gray-600">Completion Rate</div>
				</CardContent>
			</Card>
		</div>
	);
}
