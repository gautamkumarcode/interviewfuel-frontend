"use client";

import Sidebar from "@/components/custom/customsidebar/CustomSidebar";
import Navbar from "@/components/custom/navbar/Navbar";
import { useEffect, useRef, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const navbarRef = useRef<HTMLDivElement>(null);
	const [isHydrated, setIsHydrated] = useState(false);

	// Get initial state from sessionStorage if available
	const getInitialMinimized = () => {
		if (typeof window !== "undefined") {
			return sessionStorage.getItem("minimized") === "true";
		}
		return false;
	};

	const [isMinimized, setIsMinimized] = useState(false); // Start with false to prevent hiding
	const [isTransitioning, setIsTransitioning] = useState(false);

	useEffect(() => {
		// Set the correct initial state after hydration
		setIsMinimized(getInitialMinimized());
		setIsHydrated(true);

		const handleTransitionStart = () => {
			setIsTransitioning(true);
		};

		const handleTransitionEnd = () => {
			setIsTransitioning(false);
		};

		const handleSidebarToggle = (e: CustomEvent) => {
			const newMinimized = e.detail.minimized;
			setIsMinimized(newMinimized);
			sessionStorage.setItem("minimized", String(newMinimized));
		};

		// Listen for custom events from sidebar
		window.addEventListener(
			"sidebarToggle",
			handleSidebarToggle as EventListener
		);

		if (sidebarRef.current) {
			sidebarRef.current.addEventListener(
				"transitionstart",
				handleTransitionStart
			);
			sidebarRef.current.addEventListener("transitionend", handleTransitionEnd);
		}

		return () => {
			window.removeEventListener(
				"sidebarToggle",
				handleSidebarToggle as EventListener
			);
			if (sidebarRef.current) {
				sidebarRef.current.removeEventListener(
					"transitionstart",
					handleTransitionStart
				);
				sidebarRef.current.removeEventListener(
					"transitionend",
					handleTransitionEnd
				);
			}
		};
	}, []);

	// Calculate widths based on minimized state
	const sidebarWidth = isMinimized ? 56 : 288; // w-14 : w-72
	const navbarHeight = 64; // Default navbar height

	// Apply CSS variables to root element
	useEffect(() => {
		if (isHydrated) {
			const root = document.documentElement;
			root.style.setProperty("--sidebar-width", `${sidebarWidth}px`);
			root.style.setProperty("--navbar-height", `${navbarHeight}px`);
		}
	}, [sidebarWidth, navbarHeight, isHydrated]);

	return (
		<div className="w-screen h-screen overflow-hidden dark:bg-darkBg bg-[#FAFAFA]">
			<Sidebar ref={sidebarRef} />

			{/* Navbar - using inline styles to prevent FOUC */}
			<div
				className="fixed top-0 z-10 min-h-[64px] bg-white dark:bg-primaryGreyBg"
				style={{
					marginLeft: `${sidebarWidth}px`,
					width: `calc(100vw - ${sidebarWidth}px)`,
					transition: isTransitioning
						? "none"
						: "margin-left 300ms ease-in-out, width 300ms ease-in-out",
				}}>
				<Navbar ref={navbarRef} />
			</div>

			{/* Main content - using inline styles to prevent FOUC */}
			<main
				className="overflow-auto p-4"
				style={{
					marginLeft: `${sidebarWidth}px`,
					marginTop: `${navbarHeight}px`,
					width: `calc(100vw - ${sidebarWidth}px)`,
					height: `calc(100vh - ${navbarHeight}px)`,
					transition: isTransitioning
						? "none"
						: "margin-left 300ms ease-in-out, width 300ms ease-in-out",
				}}>
				{children}
			</main>
		</div>
	);
}