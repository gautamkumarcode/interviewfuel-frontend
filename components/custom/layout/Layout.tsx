"use client";

import type * as React from "react";
import { CustomSidebar } from "../CustomSidebar/CustomSidebar";

interface AppLayoutProps {
	children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="flex min-h-screen w-full bg-gray-50 ">
			<CustomSidebar >
				<main className="flex-1 p-6">{children}</main>
			</CustomSidebar>
		</div>
	);
}
