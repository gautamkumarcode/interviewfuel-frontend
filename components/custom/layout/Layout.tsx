"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import type * as React from "react";
import { AppNavbar } from "../navbar/Navbar";
import { CustomSidebar } from "../customsidebar/CustomSidebar";
// import { AppSidebar } from "../sidebar/Sidebar";

interface AppLayoutProps {
	children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	return (
		// <SidebarProvider>
			<div className="flex min-h-screen w-full bg-gray-50 ">
				{/* <AppSidebar /> */}
				<CustomSidebar >
					<main className="flex-1 p-6">{children}</main>
				</CustomSidebar>
				{/* <div className="flex-1 flex flex-col">
					<AppNavbar />
					<main className="flex-1 p-6">{children}</main>
				</div> */}
			</div>
		// </SidebarProvider>
	);
}
