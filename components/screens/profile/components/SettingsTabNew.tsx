"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useClusterData } from "@/context/clusterData-context";
import { userServices } from "@/services/userservices/user-services";
import { User } from "@/types/user";
import { Bell, Download, Settings, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";

interface SettingsSectionNewProps {
	preferences: User["preferences"];
}

export default function SettingsSectionNew({
	preferences: initialPreferences,
}: SettingsSectionNewProps) {
	const [preferences, setPreferences] = useState(initialPreferences);
	const [isSaving, setIsSaving] = useState(false);
	const { refetchUser } = useClusterData();
	const queryClient = useQueryClient();
	const router = useRouter();

	const handleToggle = async (key: keyof User["preferences"]) => {
		const newPreferences = {
			...preferences,
			[key]: !preferences[key],
		};

		setPreferences(newPreferences);
		setIsSaving(true);

		try {
			await userServices.updatePreferences(newPreferences);

			// Invalidate React Query cache
			await queryClient.invalidateQueries(["userProfile"]);

			// Refresh server-side data
			router.refresh();

			// Also refetch client-side data
			await refetchUser();
		} catch (error) {
			console.error("Failed to update preferences:", error);
			// Revert on error
			setPreferences(preferences);
			alert("Failed to update preferences. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleExportData = async () => {
		try {
			const blob = await userServices.exportData();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `user-data-${Date.now()}.json`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error("Failed to export data:", error);
			alert("Failed to export data. Please try again.");
		}
	};

	return (
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
					{[
						{
							key: "emailNotifications" as const,
							label: "Email Notifications",
							description: "Receive updates via email",
						},
						{
							key: "pushNotifications" as const,
							label: "Push Notifications",
							description: "Browser push notifications",
						},
						{
							key: "weeklyDigest" as const,
							label: "Weekly Digest",
							description: "Weekly progress summary",
						},
						{
							key: "practiceReminders" as const,
							label: "Practice Reminders",
							description: "Daily practice reminders",
						},
					].map(({ key, label, description }) => (
						<div key={key} className="flex items-center justify-between">
							<div>
								<div className="font-medium">{label}</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">
									{description}
								</div>
							</div>
							<Switch
								checked={preferences?.[key] || false}
								onCheckedChange={() => handleToggle(key)}
								disabled={isSaving}
							/>
						</div>
					))}
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
					{[
						{
							key: "publicProfile" as const,
							label: "Public Profile",
							description: "Make your profile visible to others",
						},
						{
							key: "showStats" as const,
							label: "Show Statistics",
							description: "Display your stats publicly",
						},
					].map(({ key, label, description }) => (
						<div key={key} className="flex items-center justify-between">
							<div>
								<div className="font-medium">{label}</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">
									{description}
								</div>
							</div>
							<Switch
								checked={preferences?.[key] || false}
								onCheckedChange={() => handleToggle(key)}
								disabled={isSaving}
							/>
						</div>
					))}

					<Separator />

					<div className="space-y-3">
						<Button
							variant="outline"
							onClick={handleExportData}
							className="w-full gap-2">
							<Download className="h-4 w-4" />
							Export My Data
						</Button>

						<Button variant="outline" className="w-full gap-2">
							<Settings className="h-4 w-4" />
							Account Settings
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
