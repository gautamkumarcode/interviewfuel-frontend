"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectToCategoryFilterPage() {
	const { category } = useParams();
	const router = useRouter();

	useEffect(() => {
		// Redirect to /questions?category=system-design
		if (category) {
			const encodedCategory = encodeURIComponent(category as string);
			router.replace(`/questions?category=${encodedCategory}`);
		}
	}, [category, router]);

	return null;
}
