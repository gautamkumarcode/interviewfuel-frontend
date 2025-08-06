import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	formatDate,
	getAchievementIcon,
	getRarityColor,
} from "@/utils/profileUtils";

interface AchievementCardProps {
	achievement: {
		id: string;
		icon: string;
		earned: boolean;
		title: string;
		description: string;
		rarity: string;
		earnedAt?: string;
		progress?: number;
		target?: number;
	};
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
	// const IconComponent = getAchievementIcon(achievement?.icon || "trophy");

	return (
		<Card
			className={achievement?.earned ? "border-yellow-200 bg-yellow-50" : ""}>
			<CardContent className="p-6">
				<div className="flex items-start gap-4">
					<div
						className={`p-3 rounded-lg ${
							achievement?.earned ? "bg-yellow-100" : "bg-gray-100"
						}`}>
						{/* <IconComponent
							className={`h-6 w-6 ${
								achievement?.earned ? "text-yellow-600" : "text-gray-400"
							}`}
						/> */}
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<h3
								className={`font-semibold ${
									achievement?.earned ? "text-yellow-900" : "text-gray-700"
								}`}>
								{achievement?.title || "Unknown Achievement"}
							</h3>
							<Badge
								className={getRarityColor(achievement?.rarity || "common")}
								variant="outline">
								{achievement?.rarity || "common"}
							</Badge>
						</div>
						<p
							className={`text-sm mb-3 ${
								achievement?.earned ? "text-yellow-700" : "text-gray-600"
							}`}>
							{achievement?.description || "No description available"}
						</p>

						{achievement?.earned ? (
							<div className="text-xs text-yellow-600">
								Earned{" "}
								{achievement?.earnedAt
									? formatDate(achievement.earnedAt)
									: "N/A"}
							</div>
						) : achievement?.progress !== undefined &&
						  achievement?.target !== undefined ? (
							<div className="space-y-2">
								<div className="flex justify-between text-xs">
									<span>Progress</span>
									<span>
										{achievement.progress}/{achievement.target}
									</span>
								</div>
								<Progress
									value={
										achievement.target > 0
											? (achievement.progress / achievement.target) * 100
											: 0
									}
									className="h-2"
								/>
							</div>
						) : (
							<div className="text-xs text-gray-500">Not yet earned</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
