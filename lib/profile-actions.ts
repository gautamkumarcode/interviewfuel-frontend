import { API_URL } from "@/constants/api";
import { authOptions } from "@/lib/auth";
import { User } from "@/types/user";
import { getServerSession } from "next-auth";

export async function getProfileData(): Promise<User | null> {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.accessToken) {
			return null;
		}

		const response = await fetch(`${API_URL}/auth/me`, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
			},
			// Important: Ensure fresh data on each request
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error("Failed to fetch profile data");
		}

		const data = await response.json();
		return data.data; // Assuming your API returns { data: User }
	} catch (error) {
		console.error("Error fetching profile data:", error);
		return null;
	}
}
