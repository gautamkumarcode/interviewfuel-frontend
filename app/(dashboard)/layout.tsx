"use client";

import Sidebar from "@/components/custom/customsidebar/CustomSidebar";
import Navbar from "@/components/custom/navbar/Navbar";
import { useEffect, useRef, useState } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const navbarRef = useRef<HTMLDivElement>(null);
	const [sidebarWidth, setSidebarWidth] = useState(0);
	const [navbarHeight, setNavbarHeight] = useState(0);

	useEffect(() => {
		const updateLayout = () => {
			if (sidebarRef.current) {
				const sidebarRect = sidebarRef.current.getBoundingClientRect();
				setSidebarWidth(sidebarRect.width);
			}
			if (navbarRef.current) {
				const navbarRect = navbarRef.current.getBoundingClientRect();
				setNavbarHeight(navbarRect.height);
			}
		};

		updateLayout(); // Initial run

		const resizeObserver = new ResizeObserver(() => {
			updateLayout();
		});

		if (sidebarRef.current) {
			resizeObserver.observe(sidebarRef.current);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div className="w-screen h-screen overflow-hidden dark:bg-darkBg bg-[#FAFAFA]">
			<Sidebar ref={sidebarRef} />
			<Navbar ref={navbarRef} />

			<main
				style={{
					marginLeft: `${sidebarWidth}px`,
					marginTop: `${navbarHeight}px`,
					width: `calc(100vw - ${sidebarWidth}px)`,
					height: `calc(100vh - ${navbarHeight}px)`,
				}}
				className="overflow-auto p-4">
				{children}
			</main>
		</div>
	);
}
