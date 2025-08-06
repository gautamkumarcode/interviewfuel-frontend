import {
	BookOpen,
	Clock,
	Shield,
	Star,
	TrendingUp,
	Trophy,
} from "lucide-react";

export const getRarityColor = (rarity: string) => {
	const rarityMap: Record<string, string> = {
		common: "bg-gray-100 text-gray-800 border-gray-200",
		uncommon: "bg-green-100 text-green-800 border-green-200",
		rare: "bg-blue-100 text-blue-800 border-blue-200",
		epic: "bg-purple-100 text-purple-800 border-purple-200",
		legendary: "bg-yellow-100 text-yellow-800 border-yellow-200",
	};
	return rarityMap[rarity.toLowerCase()] || rarityMap.common;
};

export const getActivityIcon = (type: string) => {
	const iconMap: Record<string, React.ComponentType> = {
		practice: BookOpen,
		achievement: Trophy,
		milestone: Star,
	};
	return iconMap[type.toLowerCase()] || Clock;
};

export const getAchievementIcon = (iconName: string) => {
	const iconMap: Record<string, React.ComponentType> = {
		trophy: Trophy,
		star: Star,
		shield: Shield,
		"trending-up": TrendingUp,
		"book-open": BookOpen,
	};
	return iconMap[iconName.toLowerCase()] || Trophy;
};

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const formatTimeAgo = (dateString: string) => {
	const now = new Date();
	const date = new Date(dateString);
	const diffInHours = Math.floor(
		(now.getTime() - date.getTime()) / (1000 * 60 * 60)
	);

	if (diffInHours < 1) return "Just now";
	if (diffInHours < 24) return `${diffInHours}h ago`;
	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) return `${diffInDays}d ago`;
	return formatDate(dateString);
};
