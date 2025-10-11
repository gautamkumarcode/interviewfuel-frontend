"use client";

import { PageLoader } from "@/components/custom/loader/PageLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClusterData } from "@/context/clusterData-context";
import { Achievement, Activity, User } from "@/types/user";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Star, Trophy } from "lucide-react";
import AchievementCard from "./components/AchievementsCards";
import ActivityItem from "./components/AchivementItems";
import PerformanceMetrics from "./components/PerformmancMetrix";
import ProfileHeader from "./components/ProfileHeader";
import SettingsSection from "./components/SettingsTab";
import StatsOverview from "./components/StatsOverview";

export function ProfilePage() {
	const {
		userData: profile,
		userLoading: isLoading,
		userError,
	} = useClusterData();
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState<Partial<User>>(
		profile || {
			name: "",
			userName: "",
			joinDate: new Date().toISOString(),
			stats: {
				questionsAnswered: 0,
				practiceHours: 0,
				currentStreak: 0,
				completionRate: 0,
				averageTime: 0,
				totalSessions: 0,
				longestStreak: 0,
				favoriteCategory: "",
			},
			achievements: [],
			recentActivity: [],
			preferences: {
				emailNotifications: false,
				pushNotifications: false,
				weeklyDigest: false,
				practiceReminders: false,
				publicProfile: false,
				showStats: false,
			},
		}
	);

	if (!profile && !isLoading) {
		return <div>No user data available</div>;
	}

	if (!profile) {
		return (
			<PageLoader
				loading={isLoading}
				error={
					userError ? userError?.message || "Failed to load profile" : null
				}
				loadingText="Loading your profile...">
				<div className="text-center">No profile data found</div>
			</PageLoader>
		);
	}

	const currentUserData = profile;


	const handleExportData = () => {};

	return (
		<PageLoader
			loading={isLoading}
			error={userError ? userError?.message || "Failed to load profile" : null}
			loadingText="Loading your profile...">
			<div className="max-w-6xl mx-auto space-y-6">
				<ProfileHeader
					user={currentUserData}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					editedData={editedData}
					setEditedData={setEditedData}
				/>

				{currentUserData?.stats ? (
					<StatsOverview stats={currentUserData.stats} />
				) : (
					<Card>
						<CardContent className="p-6 text-center text-gray-500">
							No statistics available
						</CardContent>
					</Card>
				)}

				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="achievements">Achievements</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{currentUserData?.stats ? (
								<PerformanceMetrics stats={currentUserData.stats} />
							) : (
								<Card>
									<CardContent className="p-6 text-center text-gray-500">
										No performance data available
									</CardContent>
								</Card>
							)}

							{/* Recent Achievements */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Trophy className="h-5 w-5" />
										Recent Achievements
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{currentUserData?.achievements?.length > 0 ? (
											currentUserData.achievements
												.filter((a: any) => a.earned)
												.slice(0, 3)
												.map((achievement: User["achievements"][number]) => (
													<AchievementCard
														key={achievement.id}
														achievement={achievement}
													/>
												))
										) : (
											<div className="text-center text-gray-500 py-4">
												No achievements earned yet
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Favorite Category */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Star className="h-5 w-5" />
									Favorite Category:{" "}
									{currentUserData?.stats?.favoriteCategory || "Not set"}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-gray-600">
									{currentUserData?.stats?.favoriteCategory
										? "You've answered the most questions in this category. Keep up the great work!"
										: "Start practicing to discover your favorite category!"}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="achievements" className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{currentUserData?.achievements?.length > 0 ? (
								currentUserData.achievements.map((achievement: Achievement) => (
									<AchievementCard
										key={achievement.id}
										achievement={achievement}
									/>
								))
							) : (
								<div className="col-span-full text-center py-8 text-gray-500">
									<Trophy className="h-12 w-12 mx-auto mb-3 text-gray-400" />
									<p>No achievements available</p>
									<p className="text-sm">
										Start practicing to earn your first achievement!
									</p>
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent value="activity" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Clock className="h-5 w-5" />
									Recent Activity
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{currentUserData?.recentActivity?.length > 0 ? (
										currentUserData.recentActivity.map((activity: Activity) => (
											<ActivityItem key={activity.id} activity={activity} />
										))
									) : (
										<div className="text-center py-8 text-gray-500">
											<Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
											<p>No recent activity found</p>
											<p className="text-sm">
												Start practicing to see your activity here!
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="settings" className="space-y-6">
						{currentUserData?.preferences ? (
							<SettingsSection
								preferences={currentUserData.preferences}
								onExportData={handleExportData}
							/>
						) : (
							<Card>
								<CardContent className="p-6 text-center text-gray-500">
									Settings not available
								</CardContent>
							</Card>
						)}

						{/* Danger Zone */}
						<Card className="border-red-200">
							<CardHeader>
								<CardTitle className="text-red-600">Danger Zone</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="p-4 border border-red-200 rounded-lg bg-red-50">
										<h4 className="font-medium text-red-900 mb-2">
											Delete Account
										</h4>
										<p className="text-sm text-red-700 mb-4">
											Once you delete your account, there is no going back.
											Please be certain.
										</p>
										<Button variant="destructive" size="sm">
											Delete Account
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</PageLoader>
	);
}