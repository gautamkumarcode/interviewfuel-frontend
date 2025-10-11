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
	if (!initialData) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">Unable to load profile</h2>
					<p className="text-gray-600">
						Please try refreshing the page or sign in again.
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
