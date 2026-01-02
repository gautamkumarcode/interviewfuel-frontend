"use client";

import { HashLoader } from "@/components/custom";
import Sidebar from "@/components/custom/customsidebar/CustomSidebar";
import { CategoryNavbar } from "@/components/custom/navbar/CategoryNavbar";
import Navbar from "@/components/custom/navbar/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const navbarRef = useRef<HTMLDivElement>(null);
	const [isHydrated, setIsHydrated] = useState(false);
	const isMobile = useIsMobile();

	// Get initial state - on mobile always start minimized, on desktop check sessionStorage
	const getInitialMinimized = () => {
		if (typeof window !== "undefined") {
			// Check if we're on mobile first
			const isMobileDevice = window.innerWidth < 768;
			if (isMobileDevice) {
				return true; // Always start minimized on mobile
			}
			// On desktop, check sessionStorage
			return sessionStorage.getItem("minimized") === "true";
		}
		return false;
	};

	const [isMinimized, setIsMinimized] = useState(false); // Start with false to prevent hiding
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [prevIsMobile, setPrevIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		// Set the correct initial state after hydration
		const initialMinimized = getInitialMinimized();
		setIsMinimized(initialMinimized);
		if (isMobile) {
			// Ensure mobile always starts minimized
			sessionStorage.setItem("minimized", "true");
		}
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

		// Capture ref value for cleanup
		const currentSidebar = sidebarRef.current;
		if (currentSidebar) {
			currentSidebar.addEventListener("transitionstart", handleTransitionStart);
			currentSidebar.addEventListener("transitionend", handleTransitionEnd);
		}

		return () => {
			window.removeEventListener(
				"sidebarToggle",
				handleSidebarToggle as EventListener
			);
			if (currentSidebar) {
				currentSidebar.removeEventListener(
					"transitionstart",
					handleTransitionStart
				);
				currentSidebar.removeEventListener(
					"transitionend",
					handleTransitionEnd
				);
			}
		};
	}, [isMobile]);

	// Calculate widths based on minimized state and mobile
	// On mobile, sidebar width should be 0 for layout calculations (overlay mode)
	// On desktop, normal sidebar width logic applies
	const sidebarWidth = isMobile ? 0 : isMinimized ? 56 : 288;
	const navbarHeight = 64; // Default navbar height
	const categoryNavbarHeight = 48; // Category navbar height
	const totalHeaderHeight = navbarHeight + categoryNavbarHeight;

	// Apply CSS variables to root element
	useEffect(() => {
		if (isHydrated) {
			const root = document.documentElement;
			root.style.setProperty("--sidebar-width", `${sidebarWidth}px`);
			root.style.setProperty("--navbar-height", `${navbarHeight}px`);
		}
	}, [sidebarWidth, navbarHeight, isHydrated]);

	// Force layout recalculation when auth state might change
	useEffect(() => {
		const handleStorageChange = () => {
			const currentMinimized = sessionStorage.getItem("minimized") === "true";
			if (currentMinimized !== isMinimized) {
				setIsMinimized(currentMinimized);
			}
		};

		// Listen for storage changes and visibility changes
		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("focus", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("focus", handleStorageChange);
		};
	}, [isMinimized]);

	// Handle screen size changes - auto-minimize sidebar ONLY when switching TO mobile
	useEffect(() => {
		// Only run if we have a previous state to compare
		if (prevIsMobile !== null) {
			// If we just switched from desktop to mobile and sidebar is open
			if (isMobile && !prevIsMobile && !isMinimized) {
				setIsMinimized(true);
				sessionStorage.setItem("minimized", "true");
				window.dispatchEvent(
					new CustomEvent("sidebarToggle", {
						detail: { minimized: true },
					})
				);
			}
		}
		// Update the previous mobile state
		setPrevIsMobile(isMobile ?? false);
	}, [isMobile, isMinimized, prevIsMobile]); // Dependencies for mobile transition logic

	// Show loading state during hydration
	if (!isHydrated) {
		return (
			<div className="w-screen h-screen flex items-center justify-center dark:bg-darkBg bg-[#FAFAFA]">
				<HashLoader size={50} color="#19c862" />
			</div>
		);
	}

	return (
		<div className="w-screen h-screen overflow-hidden dark:bg-darkBg bg-[#FAFAFA]">
			<Sidebar ref={sidebarRef} />

			{isMobile && !isMinimized && (
				<div
					className="fixed inset-0 bg-black/50 z-[998]"
					onClick={() => {
						setIsMinimized(true);
						sessionStorage.setItem("minimized", "true");
						window.dispatchEvent(
							new CustomEvent("sidebarToggle", {
								detail: { minimized: true },
							})
						);
					}}
				/>
			)}

			{/* Navbar - using inline styles to prevent FOUC */}
			<div
				className="fixed top-0 z-[1000]"
				style={{
					marginLeft: isMobile ? "0px" : `${sidebarWidth}px`,
					width: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth}px)`,
					transition: isTransitioning
						? "none"
						: "margin-left 300ms ease-in-out, width 300ms ease-in-out",
				}}>
				<Navbar ref={navbarRef} />
				<CategoryNavbar />
			</div>

			{/* Main content - using inline styles to prevent FOUC */}
			<main
				className="overflow-auto p-4"
				style={{
					marginLeft: isMobile ? "0px" : `${sidebarWidth}px`,
					marginTop: `${totalHeaderHeight}px`,
					width: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth}px)`,
					height: `calc(100vh - ${totalHeaderHeight}px)`,
					transition: isTransitioning
						? "none"
						: "margin-left 300ms ease-in-out, width 300ms ease-in-out",
				}}>
				{children}
			</main>
		</div>
	);
}