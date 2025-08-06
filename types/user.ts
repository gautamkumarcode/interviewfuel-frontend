export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  practiceReminders: boolean;
  publicProfile: boolean;
  showStats: boolean;
}

export interface UserStats {
  questionsAnswered: number;
  practiceHours: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  averageTime: number;
  totalSessions: number;
  favoriteCategory: string;
}

export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
	earned: boolean;
	earnedAt?: string;
	category: string;
	points: number;
	progress?: number;
	target?: number;
}

export interface Activity {
	id: string;
	type: "practice" | "achievement" | "milestone";
	title: string;
	description: string;
	timestamp: string;
	details?: {
		category?: string;
		score?: number;
		duration?: number;
	};
}

export interface User {
	social: SocialLinks;
	preferences: UserPreferences;
	stats: UserStats;
	_id: string;
	name: string;
	email: string;
	userName: string;
	avatar: string | null;
	bio: string;
	location: string;
	website: string;
	isActive: boolean;
	role: string;
	achievements: Achievement[];
	recentActivity: Activity[];
	lastActive: string;
	createdAt: string;
	updatedAt: string;
	joinDate: string;
	__v: number;
	profileUrl: string;
	id: string;
}


