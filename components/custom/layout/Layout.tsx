// "use client";

// import React, { useEffect, useState } from "react";
// import Sidebar from "../customsidebar/CustomSidebar";

// interface AppLayoutProps {
// 	children: React.ReactNode;
// }

// export function AppLayout({ children }: AppLayoutProps) {
// 	const [mounted, setMounted] = useState(false);

// 	useEffect(() => {
// 		setMounted(true);
// 	}, []);

// 	if (!mounted) return null;

// 	return (
// 		<div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
// 			{/* Sidebar */}
// 			<div className="flex-shrink-0">
// 				<Sidebar />
// 			</div>

// 			{/* Right Panel: Navbar + Page Content */}
// 			<div className="flex flex-col flex-1 min-w-0">
// 				{/* Navbar */}
// 				<AppNavbar />

// 				{/* Page Content */}
// 				<main className="flex-1 overflow-y-auto p-4">{children}</main>
// 			</div>
// 		</div>
// 	);
// }
