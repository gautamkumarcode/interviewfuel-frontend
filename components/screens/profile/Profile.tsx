"use client";

import {
	Bell,
	BookOpen,
	Brain,
	Calendar,
	Camera,
	Clock,
	Download,
	Edit,
	Github,
	Linkedin,
	LinkIcon,
	Mail,
	MapPin,
	Settings,
	Share2,
	Shield,
	Star,
	Target,
	TrendingUp,
	Trophy,
	Twitter,
	Zap,
} from "lucide-react";
import * as React from "react";

import { PageLoader } from "@/components/custom/loader/PageLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useClusterData } from "@/context/clusterData-context";

// Mock user data - fallback when real data is not available
const userData = {
	id: "user_123",
	name: "John Doe",
	email: "john.doe@example.com",
	username: "johndoe",
	avatar: "/placeholder-user.jpg",
	bio: "Full-stack developer passionate about creating amazing user experiences. Currently preparing for senior engineer interviews at top tech companies.",
	location: "San Francisco, CA",
	website: "https://johndoe.dev",
	joinDate: "2024-01-15",
	lastActive: "2024-03-19",
	social: {
		github: "johndoe",
		linkedin: "john-doe-dev",
		twitter: "johndoe_dev",
	},
	stats: {
		questionsAnswered: 342,
		practiceHours: 127,
		currentStreak: 12,
		longestStreak: 28,
		completionRate: 89,
		averageTime: 4.4,
		totalSessions: 156,
		favoriteCategory: "JavaScript",
	},
	achievements: [
		{
			id: 1,
			title: "First Steps",
			description: "Complete your first practice session",
			icon: Target,
			earned: true,
			earnedDate: "2024-01-16",
			rarity: "common",
		},
		{
			id: 2,
			title: "Consistency Champion",
			description: "Practice for 7 consecutive days",
			icon: Calendar,
			earned: true,
			earnedDate: "2024-01-23",
			rarity: "uncommon",
		},
		{
			id: 3,
			title: "Speed Demon",
			description: "Average under 5 minutes per question",
			icon: Zap,
			earned: true,
			earnedDate: "2024-02-15",
			rarity: "rare",
		},
		{
			id: 4,
			title: "JavaScript Master",
			description: "Answer 100 JavaScript questions correctly",
			icon: Brain,
			earned: true,
			earnedDate: "2024-03-01",
			rarity: "epic",
		},
		{
			id: 5,
			title: "Perfectionist",
			description: "Achieve 95% completion rate",
			icon: Trophy,
			earned: false,
			progress: 89,
			target: 95,
			rarity: "legendary",
		},
		{
			id: 6,
			title: "Marathon Runner",
			description: "Practice for 100 hours total",
			icon: Clock,
			earned: false,
			progress: 127,
			target: 100,
			rarity: "epic",
		},
	],
	recentActivity: [
		{
			id: 1,
			type: "practice",
			title: "Completed React Hooks practice session",
			timestamp: "2024-03-19T10:30:00Z",
			details: "8/10 questions correct • 4.2 min average",
		},
		{
			id: 2,
			type: "achievement",
			title: "Earned 'Speed Demon' achievement",
			timestamp: "2024-03-18T15:45:00Z",
			details: "Averaged under 5 minutes per question",
		},
		{
			id: 3,
			type: "milestone",
			title: "Reached 300 questions answered",
			timestamp: "2024-03-17T09:15:00Z",
			details: "Keep up the great work!",
		},
		{
			id: 4,
			type: "practice",
			title: "Completed System Design session",
			timestamp: "2024-03-16T14:20:00Z",
			details: "6/8 questions correct • 12.5 min average",
		},
	],
	preferences: {
		emailNotifications: true,
		pushNotifications: false,
		weeklyDigest: true,
		practiceReminders: true,
		publicProfile: true,
		showStats: true,
	},
};

export function ProfilePage() {
	const {
		userData: profile,
		userLoading: isLoading,
		userError,
	} = useClusterData();
	const [isEditing, setIsEditing] = React.useState(false);

	// Use real profile data or fallback to mock data
	const currentUserData = profile
		? {
				...userData, // spread mock data as fallback
				name: profile.name || userData.name,
				email: profile.email || userData.email,
				avatar: profile.avatar || userData.avatar,
				bio: profile.bio || userData.bio,
				joinDate: profile.createdAt
					? new Date(profile.createdAt).toLocaleDateString()
					: userData.joinDate,
		  }
		: userData;

	const [editedData, setEditedData] = React.useState({
		name: currentUserData.name,
		bio: currentUserData.bio,
		location: currentUserData.location,
		website: currentUserData.website,
		github: currentUserData.social?.github || "",
		linkedin: currentUserData.social?.linkedin || "",
		twitter: currentUserData.social?.twitter || "",
	});

	const getRarityColor = (rarity: string) => {
		switch (rarity) {
			case "common":
				return "bg-gray-100 text-gray-800 border-gray-200";
			case "uncommon":
				return "bg-green-100 text-green-800 border-green-200";
			case "rare":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "epic":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "legendary":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "practice":
				return BookOpen;
			case "achievement":
				return Trophy;
			case "milestone":
				return Star;
			default:
				return Clock;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTimeAgo = (dateString: string) => {
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

	const handleSaveProfile = () => {
		// In a real app, this would make an API call

		setIsEditing(false);
	};

	const handleExportData = () => {
		// In a real app, this would generate and download user data
	};

	return (
		<PageLoader
			loading={isLoading}
			error={userError ? userError?.message || "Failed to load profile" : null}
			loadingText="Loading your profile..."
		>
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Profile Header */}
				<Card>
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row gap-6">
							{/* Avatar and Basic Info */}
							<div className="flex flex-col items-center md:items-start">
								<div className="relative">
									<Avatar className="h-24 w-24 md:h-32 md:w-32">
										<AvatarImage
											src={currentUserData.avatar || "/placeholder.svg"}
											alt={currentUserData.name}
										/>
										<AvatarFallback className="text-2xl">
											{currentUserData.name
												.split(" ")
												.map((n: string) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<Button
										size="sm"
										variant="outline"
										className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent">
										<Camera className="h-4 w-4" />
									</Button>
								</div>

								<div className="mt-4 text-center md:text-left">
									<h1 className="text-2xl font-bold text-gray-900">
										{currentUserData.name}
									</h1>
									<p className="text-gray-600">@{currentUserData.username}</p>
									<div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
										<Calendar className="h-4 w-4" />
										<span>Joined {formatDate(currentUserData.joinDate)}</span>
									</div>
								</div>
							</div>

							{/* Profile Details */}
							<div className="flex-1">
								<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
									<div className="space-y-3">
										<p className="text-gray-700 leading-relaxed">
											{currentUserData?.bio || "No bio available"}
										</p>

										<div className="flex flex-wrap gap-4 text-sm text-gray-600">
											<div className="flex items-center gap-1">
												<Mail className="h-4 w-4" />
												<span>{currentUserData?.email}</span>
											</div>
											<div className="flex items-center gap-1">
												<MapPin className="h-4 w-4" />
												<span>{currentUserData?.location || "Location not set"}</span>
											</div>
											{currentUserData?.website && (<div className="flex items-center gap-1">
												<LinkIcon className="h-4 w-4" />
												<a
													href={currentUserData.website}
													className="text-blue-600 hover:underline">
													{currentUserData.website}
												</a>
											</div>)}
										</div>

										{/* Social Links */}
										<div className="flex gap-3">
											<Button
												variant="outline"
												size="sm"
												className="gap-2 bg-transparent">
												<Github className="h-4 w-4" />
												GitHub
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="gap-2 bg-transparent">
												<Linkedin className="h-4 w-4" />
												LinkedIn
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="gap-2 bg-transparent">
												<Twitter className="h-4 w-4" />
												Twitter
											</Button>
										</div>
									</div>

									<div className="flex gap-2">
										<Dialog open={isEditing} onOpenChange={setIsEditing}>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													className="gap-2 bg-transparent">
													<Edit className="h-4 w-4" />
													Edit Profile
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-2xl">
												<DialogHeader>
													<DialogTitle>Edit Profile</DialogTitle>
													<DialogDescription>
														Update your profile information and social links.
													</DialogDescription>
												</DialogHeader>
												<div className="space-y-4">
													<div className="grid grid-cols-2 gap-4">
														<div>
															<Label htmlFor="name">Full Name</Label>
															<Input
																id="name"
																value={editedData.name}
																onChange={(e) =>
																	setEditedData({
																		...editedData,
																		name: e.target.value,
																	})
																}
															/>
														</div>
														<div>
															<Label htmlFor="location">Location</Label>
															<Input
																id="location"
																value={editedData.location}
																onChange={(e) =>
																	setEditedData({
																		...editedData,
																		location: e.target.value,
																	})
																}
															/>
														</div>
													</div>

													<div>
														<Label htmlFor="bio">Bio</Label>
														<Textarea
															id="bio"
															value={editedData.bio}
															onChange={(e) =>
																setEditedData({
																	...editedData,
																	bio: e.target.value,
																})
															}
															rows={3}
														/>
													</div>

													<div>
														<Label htmlFor="website">Website</Label>
														<Input
															id="website"
															value={editedData.website}
															onChange={(e) =>
																setEditedData({
																	...editedData,
																	website: e.target.value,
																})
															}
														/>
													</div>

													<div className="grid grid-cols-3 gap-4">
														<div>
															<Label htmlFor="github">GitHub Username</Label>
															<Input
																id="github"
																value={editedData.github}
																onChange={(e) =>
																	setEditedData({
																		...editedData,
																		github: e.target.value,
																	})
																}
															/>
														</div>
														<div>
															<Label htmlFor="linkedin">
																LinkedIn Username
															</Label>
															<Input
																id="linkedin"
																value={editedData.linkedin}
																onChange={(e) =>
																	setEditedData({
																		...editedData,
																		linkedin: e.target.value,
																	})
																}
															/>
														</div>
														<div>
															<Label htmlFor="twitter">Twitter Username</Label>
															<Input
																id="twitter"
																value={editedData.twitter}
																onChange={(e) =>
																	setEditedData({
																		...editedData,
																		twitter: e.target.value,
																	})
																}
															/>
														</div>
													</div>

													<div className="flex justify-end gap-2">
														<Button
															variant="outline"
															onClick={() => setIsEditing(false)}>
															Cancel
														</Button>
														<Button onClick={handleSaveProfile}>
															Save Changes
														</Button>
													</div>
												</div>
											</DialogContent>
										</Dialog>

										<Button variant="outline" className="gap-2 bg-transparent">
											<Share2 className="h-4 w-4" />
											Share
										</Button>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Stats Overview */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-blue-600 mb-1">
								{currentUserData.stats.questionsAnswered}
							</div>
							<div className="text-sm text-gray-600">Questions Answered</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-green-600 mb-1">
								{currentUserData.stats.practiceHours}h
							</div>
							<div className="text-sm text-gray-600">Practice Time</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-orange-600 mb-1">
								{currentUserData.stats.currentStreak}
							</div>
							<div className="text-sm text-gray-600">Current Streak</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-purple-600 mb-1">
								{currentUserData.stats.completionRate}%
							</div>
							<div className="text-sm text-gray-600">Completion Rate</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content Tabs */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="achievements">Achievements</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Performance Metrics */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<TrendingUp className="h-5 w-5" />
										Performance Metrics
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<div className="flex justify-between text-sm mb-2">
											<span>Completion Rate</span>
											<span className="font-medium">
												{currentUserData.stats.completionRate}%
											</span>
										</div>
										<Progress
											value={currentUserData.stats.completionRate}
											className="h-2"
										/>
									</div>

									<div>
										<div className="flex justify-between text-sm mb-2">
											<span>Average Time per Question</span>
											<span className="font-medium">
												{currentUserData.stats.averageTime} min
											</span>
										</div>
										<Progress value={75} className="h-2" />
									</div>

									<Separator />

									<div className="grid grid-cols-2 gap-4 text-center">
										<div>
											<div className="text-lg font-semibold text-gray-900">
												{currentUserData.stats.totalSessions}
											</div>
											<div className="text-sm text-gray-600">
												Total Sessions
											</div>
										</div>
										<div>
											<div className="text-lg font-semibold text-gray-900">
												{currentUserData.stats.longestStreak}
											</div>
											<div className="text-sm text-gray-600">
												Longest Streak
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

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
										{currentUserData.achievements
											.filter((a) => a.earned)
											.slice(0, 3)
											.map((achievement) => (
												<div
													key={achievement.id}
													className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
													<div className="p-2 bg-yellow-100 rounded-lg">
														<achievement.icon className="h-5 w-5 text-yellow-600" />
													</div>
													<div className="flex-1">
														<div className="font-medium text-yellow-900">
															{achievement.title}
														</div>
														<div className="text-sm text-yellow-700">
															{achievement.description}
														</div>
													</div>
													<Badge className={getRarityColor(achievement.rarity)}>
														{achievement.rarity}
													</Badge>
												</div>
											))}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Favorite Category */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Star className="h-5 w-5" />
									Favorite Category: {currentUserData.stats.favoriteCategory}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-gray-600">
									You&lsquo;ve answered the most questions in this category.
									Keep up the great work!
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="achievements" className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{currentUserData.achievements.map((achievement) => (
								<Card
									key={achievement.id}
									className={
										achievement.earned ? "border-yellow-200 bg-yellow-50" : ""
									}>
									<CardContent className="p-6">
										<div className="flex items-start gap-4">
											<div
												className={`p-3 rounded-lg ${
													achievement.earned ? "bg-yellow-100" : "bg-gray-100"
												}`}>
												<achievement.icon
													className={`h-6 w-6 ${
														achievement.earned
															? "text-yellow-600"
															: "text-gray-400"
													}`}
												/>
											</div>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<h3
														className={`font-semibold ${
															achievement.earned
																? "text-yellow-900"
																: "text-gray-700"
														}`}>
														{achievement.title}
													</h3>
													<Badge
														className={getRarityColor(achievement.rarity)}
														variant="outline">
														{achievement.rarity}
													</Badge>
												</div>
												<p
													className={`text-sm mb-3 ${
														achievement.earned
															? "text-yellow-700"
															: "text-gray-600"
													}`}>
													{achievement.description}
												</p>

												{achievement.earned ? (
													<div className="text-xs text-yellow-600">
														Earned {formatDate(achievement.earnedDate!)}
													</div>
												) : achievement.progress !== undefined ? (
													<div className="space-y-2">
														<div className="flex justify-between text-xs">
															<span>Progress</span>
															<span>
																{achievement.progress}/{achievement.target}
															</span>
														</div>
														<Progress
															value={
																(achievement.progress / achievement.target!) *
																100
															}
															className="h-2"
														/>
													</div>
												) : (
													<div className="text-xs text-gray-500">
														Not yet earned
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
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
									{currentUserData.recentActivity.map((activity) => {
										const IconComponent = getActivityIcon(activity.type);
										return (
											<div
												key={activity.id}
												className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
												<div className="p-2 bg-blue-100 rounded-lg">
													<IconComponent className="h-5 w-5 text-blue-600" />
												</div>
												<div className="flex-1">
													<h4 className="font-medium text-gray-900">
														{activity.title}
													</h4>
													<p className="text-sm text-gray-600 mt-1">
														{activity.details}
													</p>
													<p className="text-xs text-gray-500 mt-2">
														{formatTimeAgo(activity.timestamp)}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="settings" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Notification Settings */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Bell className="h-5 w-5" />
										Notifications
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium">Email Notifications</div>
											<div className="text-sm text-gray-600">
												Receive updates via email
											</div>
										</div>
										<Switch checked={currentUserData.preferences.emailNotifications} />
									</div>

									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium">Push Notifications</div>
											<div className="text-sm text-gray-600">
												Browser push notifications
											</div>
										</div>
										<Switch checked={currentUserData.preferences.pushNotifications} />
									</div>

									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium">Weekly Digest</div>
											<div className="text-sm text-gray-600">
												Weekly progress summary
											</div>
										</div>
										<Switch checked={currentUserData.preferences.weeklyDigest} />
									</div>

									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium">Practice Reminders</div>
											<div className="text-sm text-gray-600">
												Daily practice reminders
											</div>
										</div>
										<Switch checked={currentUserData.preferences.practiceReminders} />
									</div>
								</CardContent>
							</Card>

							{/* Privacy Settings */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Shield className="h-5 w-5" />
										Privacy
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium">Public Profile</div>
											<div className="text-sm text-gray-600">
												Make your profile visible to others
											</div>
										</div>
										<Switch checked={currentUserData.preferences.publicProfile} />
									</div>

									<div className="flex items-center justify-between">
										<div>
											<div className="font-medium">Show Statistics</div>
											<div className="text-sm text-gray-600">
												Display your stats publicly
											</div>
										</div>
										<Switch checked={currentUserData.preferences.showStats} />
									</div>

									<Separator />

									<div className="space-y-3">
										<Button
											variant="outline"
											onClick={handleExportData}
											className="w-full gap-2 bg-transparent">
											<Download className="h-4 w-4" />
											Export My Data
										</Button>

										<Button
											variant="outline"
											className="w-full gap-2 bg-transparent">
											<Settings className="h-4 w-4" />
											Account Settings
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

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
