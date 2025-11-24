"use client";

import { ClusterDataProvider } from "@/context/clusterData-context";
import { User } from "@/types/user";
import { ProfilePage } from "./Profile";

interface ProfileServerWrapperProps {
	initialData: User | null;
}

export default function ProfileServerWrapper({
	initialData,
}: ProfileServerWrapperProps) {
	console.log("ProfileServerWrapper received initialData:", initialData);

	if (!initialData) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="text-center space-y-4">
					<h2 className="text-xl font-semibold mb-2">Unable to load profile</h2>
					<p className="text-gray-600">
						Please try refreshing the page or sign in again.
					</p>
					<p className="text-sm text-gray-500">
						Check the browser console for more details.
					</p>
				</div>
			</div>
		);
	}

	return (
		<ClusterDataProvider initialUserData={initialData}>
			<ProfilePage />
		</ClusterDataProvider>
	);
}
