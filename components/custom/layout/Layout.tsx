"use client";

import React, { useEffect, useState } from "react";
import { CustomSidebar } from "../CustomSidebar/CustomSidebar";

interface AppLayoutProps {
	children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Avoid rendering until client-side hydration is done
		setMounted(true);
	}, []);

	if (!mounted) return null; // Or show a loader/skeleton

	return (
		<div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
			<CustomSidebar>
				<main className="flex-1 p-6">{children}</main>
			</CustomSidebar>
		</div>
	);
}
