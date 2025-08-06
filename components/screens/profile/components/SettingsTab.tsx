import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types/user";
import { Bell, Download, Settings, Shield } from "lucide-react";

interface SettingsSectionProps {
	preferences: User["preferences"];
	onExportData: () => void;
}

export default function SettingsSection({
	preferences,
	onExportData,
}: SettingsSectionProps) {
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
					{Object.entries({
						emailNotifications: "Email Notifications",
						pushNotifications: "Push Notifications",
						weeklyDigest: "Weekly Digest",
						practiceReminders: "Practice Reminders",
					}).map(([key, label]) => (
						<div key={key} className="flex items-center justify-between">
							<div>
								<div className="font-medium">{label}</div>
								<div className="text-sm text-gray-600">
									{key === "emailNotifications"
										? "Receive updates via email"
										: key === "pushNotifications"
										? "Browser push notifications"
										: key === "weeklyDigest"
										? "Weekly progress summary"
										: key === "practiceReminders"
										? "Daily practice reminders"
										: ""}
								</div>
							</div>
							<Switch
								checked={
									preferences?.[key as keyof typeof preferences] || false
								}
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
					{Object.entries({
						publicProfile: "Public Profile",
						showStats: "Show Statistics",
					}).map(([key, label]) => (
						<div key={key} className="flex items-center justify-between">
							<div>
								<div className="font-medium">{label}</div>
								<div className="text-sm text-gray-600">
									{key === "publicProfile"
										? "Make your profile visible to others"
										: key === "showStats"
										? "Display your stats publicly"
										: ""}
								</div>
							</div>
							<Switch
								checked={
									preferences?.[key as keyof typeof preferences] || false
								}
							/>
						</div>
					))}

					<Separator />

					<div className="space-y-3">
						<Button
							variant="outline"
							onClick={onExportData || (() => {})}
							className="w-full gap-2 bg-transparent">
							<Download className="h-4 w-4" />
							Export My Data
						</Button>

						<Button variant="outline" className="w-full gap-2 bg-transparent">
							<Settings className="h-4 w-4" />
							Account Settings
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
