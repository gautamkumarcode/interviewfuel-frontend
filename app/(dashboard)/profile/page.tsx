import ProfileServerWrapper from "@/components/screens/profile/ProfileServerWrapper";
import { getProfileData } from "@/lib/profile-actions";
import { Suspense } from "react";

const ProfilePage = async () => {
	const profileData = await getProfileData();

	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-[50vh]">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			}>
			<ProfileServerWrapper initialData={profileData} />
		</Suspense>
	);
};

export default ProfilePage;
