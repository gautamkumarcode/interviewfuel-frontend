import { API_URL } from "@/constants/api";
import { authOptions } from "@/lib/auth";
import { User } from "@/types/user";
import { getServerSession } from "next-auth";

export async function getProfileData(): Promise<User | null> {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.accessToken) {
			console.error("No access token in session");
			return null;
		}

		console.log("Fetching profile from:", `${API_URL}/auth/me`);

		const response = await fetch(`${API_URL}/auth/me`, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
			},
			// Important: Ensure fresh data on each request
			cache: "no-store",
		});

		if (!response.ok) {
			console.error(
				"Profile fetch failed:",
				response.status,
				response.statusText
			);
			const errorText = await response.text();
			console.error("Error response:", errorText);
			throw new Error(`Failed to fetch profile data: ${response.status}`);
		}

		const data = await response.json();
		console.log("Profile data received:", data);
		// API returns { success: true, data: { user: User } }
		return data.data?.user || data.data;
	} catch (error) {
		console.error("Error fetching profile data:", error);
		return null;
	}
}
