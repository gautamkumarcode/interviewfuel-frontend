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

export interface User {
  social: SocialLinks;
  preferences: UserPreferences;
  stats: UserStats;
  _id: string;
  name: string;
  email: string;
  username: string;
  avatar: string | null;
  bio: string;
  location: string;
  website: string;
  isActive: boolean;
  role: string;
  achievements: any[];
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profileUrl: string;
  id: string;
}


