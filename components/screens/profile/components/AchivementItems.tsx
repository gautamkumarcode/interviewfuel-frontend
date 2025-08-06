import { formatTimeAgo } from "@/utils/profileUtils";

interface ActivityItemProps {
	activity: {
		id: string;
		type: string;
		title: string;
		description: string;
		timestamp: string;
		details?: {
			category?: string;
			score?: number;
			duration?: number;
		};
	};
}

export default function ActivityItem({ activity }: ActivityItemProps) {
	// const IconComponent = getActivityIcon(activity?.type || "default");

	return (
		<div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
			<div className="p-2 bg-blue-100 rounded-lg">
				{/* <IconComponent className="h-5 w-5 text-blue-600" /> */}
			</div>
			<div className="flex-1">
				<h4 className="font-medium text-gray-900">
					{activity?.title || "Unknown Activity"}
				</h4>
				<p className="text-sm text-gray-600 mt-1">
					{activity?.description || "No description available"}
				</p>
				{activity?.details ? (
					<div className="text-xs text-gray-500 mt-1">
						{activity.details.category
							? `Category: ${activity.details.category}`
							: null}
						{activity.details.score
							? ` • Score: ${activity.details.score}`
							: null}
						{activity.details.duration
							? ` • Duration: ${activity.details.duration}min`
							: null}
					</div>
				) : null}
				<p className="text-xs text-gray-500 mt-2">
					{activity?.timestamp
						? formatTimeAgo(activity.timestamp)
						: "Unknown time"}
				</p>
			</div>
		</div>
	);
}
