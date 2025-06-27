"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function MobileBreadcrumb() {
	const pathname = usePathname();
	const router = useRouter();

	const getCurrentPageTitle = () => {
		const segments = pathname.split("/").filter(Boolean);

		if (pathname === "/") return "Home";
		if (pathname === "/practice") return "Practice Session";
		if (pathname === "/analytics") return "Analytics";

		if (segments[0] === "questions") {
			if (segments[1] && /^\d+$/.test(segments[1])) {
				return `Question #${segments[1]}`;
			} else if (segments[1]) {
				const categoryLabels: Record<string, string> = {
					javascript: "JavaScript",
					react: "React",
					vue: "Vue.js",
					angular: "Angular",
					"html-css": "HTML/CSS",
					typescript: "TypeScript",
					nodejs: "Node.js",
					python: "Python",
					java: "Java",
					csharp: "C#",
					go: "Go",
					php: "PHP",
					"react-native": "React Native",
					flutter: "Flutter",
					ios: "iOS (Swift)",
					android: "Android (Kotlin)",
					ml: "Machine Learning",
					"data-analysis": "Data Analysis",
					sql: "SQL",
					statistics: "Statistics",
					scalability: "Scalability",
					microservices: "Microservices",
					"load-balancing": "Load Balancing",
					caching: "Caching",
				};
				return (
					categoryLabels[segments[1]] ||
					segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
				);
			}
			return "Questions";
		}

		return (
			segments[segments.length - 1]?.charAt(0).toUpperCase() +
				segments[segments.length - 1]?.slice(1) || "Page"
		);
	};

	const handleBack = () => {
		if (window.history.length > 1) {
			router.back();
		} else {
			router.push("/");
		}
	};

	// Don't show back button on home page
	if (pathname === "/") return null;

	return (
		<div className="flex items-center gap-3 md:hidden">
			<Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
				<ChevronLeft className="h-4 w-4" />
				Back
			</Button>
			<div className="text-sm font-medium text-gray-900 truncate">
				{getCurrentPageTitle()}
			</div>
		</div>
	);
}
