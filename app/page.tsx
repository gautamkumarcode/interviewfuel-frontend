import LandingPage from "@/components/screens/landingPage/LandingPage";

async function getLandingStats() {
	try {
		const apiUrl =
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
		const fullUrl = `${apiUrl}/stats/landing`;

		const res = await fetch(fullUrl, {
			next: { revalidate: 300 }, // Revalidate every 5 minutes
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error("API Error:", errorText);
			throw new Error(`Failed to fetch stats: ${res.status}`);
		}

		const data = await res.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching landing stats:", error);
		// Return default stats if fetch fails
		return {
			users: { total: 100000, formatted: "100K", label: "Developers Trained" },
			questions: {
				total: 10000,
				formatted: "10K",
				label: "Practice Questions",
			},
			successRate: { total: 95, formatted: "95%", label: "Success Rate" },
			companies: { total: 500, formatted: "500+", label: "Companies Hiring" },
		};
	}
}

const page = async () => {
	const stats = await getLandingStats();

	return <LandingPage initialStats={stats} />;
};

export default page;
