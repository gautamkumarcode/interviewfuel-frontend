import ProfileServerWrapper from "@/components/screens/profile/ProfileServerWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getProfileData } from "@/lib/profile-actions";
import { Lock, LogIn } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const ProfilePage = async () => {
	// Check authentication at server level
	const session = await getServerSession(authOptions);

	if (!session?.accessToken) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Card className="max-w-md w-full">
					<CardContent className="p-8 text-center space-y-4">
						<Lock className="w-16 h-16 text-gray-400 mx-auto" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							Authentication Required
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Sign in to view and manage your profile
						</p>
						<Link href="/">
							<Button className="gap-2 w-full" size="lg">
								<LogIn className="h-4 w-4" />
								Sign In
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

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
