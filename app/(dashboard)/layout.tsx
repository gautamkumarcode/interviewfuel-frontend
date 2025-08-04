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
	// Initialize with reasonable default values to prevent layout shift
	// Check sessionStorage for minimized state to set correct initial width
	const getInitialSidebarWidth = () => {
		if (typeof window !== "undefined") {
			const minimized = sessionStorage.getItem("minimized");
			return minimized === "true" ? 56 : 288; // w-14 : w-72
		}
		return 288; // Default to expanded
	};

	const [sidebarWidth, setSidebarWidth] = useState(getInitialSidebarWidth);
	const [navbarHeight, setNavbarHeight] = useState(64); // Default navbar height
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const [previousSidebarWidth, setPreviousSidebarWidth] = useState(
		getInitialSidebarWidth
	);

	useEffect(() => {
		const updateLayout = (): void => {
			if (sidebarRef.current) {
				const sidebarRect = sidebarRef.current.getBoundingClientRect();
				if (sidebarRect.width > 0) {
					// Only update if we get a valid width
					const newWidth = sidebarRect.width;
					// Update immediately for any width change
					setSidebarWidth(newWidth);
				}
			}
			if (navbarRef.current) {
				const navbarRect = navbarRef.current.getBoundingClientRect();
				if (navbarRect.height > 0) {
					// Only update if we get a valid height
					setNavbarHeight(navbarRect.height);
				}
			}
			if (!isLayoutReady) {
				setIsLayoutReady(true);
			}
		};

		// Immediate update
		updateLayout();

		// Quick follow-up updates for initial render
		const timeoutId1 = setTimeout(updateLayout, 10);
		const timeoutId2 = setTimeout(updateLayout, 50);

		// ResizeObserver for real-time updates (critical for sidebar minimize/maximize)
		const resizeObserver = new ResizeObserver((entries) => {
			// Immediate update for faster response
			updateLayout();
		});

		// MutationObserver to detect class changes (for sidebar minimize/maximize)
		const mutationObserver = new MutationObserver((mutations) => {
			let shouldUpdate = false;
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					(mutation.attributeName === "class" ||
						mutation.attributeName === "style")
				) {
					shouldUpdate = true;
				}
			});
			if (shouldUpdate) {
				// Immediate update for class/style changes
				updateLayout();
				// Multiple quick updates to catch the transition
				setTimeout(updateLayout, 10);
				setTimeout(updateLayout, 50);
				setTimeout(updateLayout, 100);
				setTimeout(updateLayout, 200);
			}
		});

		// Listen for transitionstart events to begin updating immediately
		const handleTransitionStart = (e: TransitionEvent) => {
			if (e.target === sidebarRef.current) {
				updateLayout();
				// Start aggressive polling during transition
				let frameCount = 0;
				const maxFrames = 18; // 300ms / 16.67ms ≈ 18 frames

				const pollDuringTransition = () => {
					updateLayout();
					frameCount++;
					if (frameCount < maxFrames) {
						requestAnimationFrame(pollDuringTransition);
					}
				};

				requestAnimationFrame(pollDuringTransition);
			}
		};

		// Listen for transitionend events for final update
		const handleTransitionEnd = (e: TransitionEvent) => {
			if (e.target === sidebarRef.current) {
				updateLayout();
			}
		};

		// Listen for click events on sidebar toggle button
		const handleSidebarClick = (e: Event) => {
			// Get current minimized state
			const currentMinimized = sessionStorage.getItem("minimized") === "true";
			// Predict the new width based on the toggle
			const predictedWidth = currentMinimized ? 288 : 56; // Toggle opposite

			// Set predicted width immediately for instant response
			setSidebarWidth(predictedWidth);
			// Also update CSS variable immediately
			const root = document.documentElement;
			root.style.setProperty("--sidebar-width", `${predictedWidth}px`);

			// Force immediate DOM update with synchronous call
			updateLayout();

			// Backup updates for accuracy
			setTimeout(updateLayout, 50);
			setTimeout(updateLayout, 200);
		};

		if (sidebarRef.current) {
			resizeObserver.observe(sidebarRef.current);
			mutationObserver.observe(sidebarRef.current, {
				attributes: true,
				attributeFilter: ["class", "style"],
				subtree: true,
			});
			sidebarRef.current.addEventListener(
				"transitionstart",
				handleTransitionStart
			);
			sidebarRef.current.addEventListener("transitionend", handleTransitionEnd);
			// Listen for clicks on the entire sidebar to catch toggle button clicks
			sidebarRef.current.addEventListener("click", handleSidebarClick);
		}
		if (navbarRef.current) {
			resizeObserver.observe(navbarRef.current);
		}

		// Listen for custom sidebar toggle events
		const handleCustomSidebarToggle = (e: Event) => {
			const customEvent = e as CustomEvent;
			// Use the event detail for immediate width setting
			if (customEvent.detail && customEvent.detail.width) {
				// Set width immediately and synchronously
				setSidebarWidth(customEvent.detail.width);
				// Also update navbar/main directly via CSS variables
				const root = document.documentElement;
				root.style.setProperty(
					"--sidebar-width",
					`${customEvent.detail.width}px`
				);
			} else {
				// Fallback to sessionStorage
				const currentMinimized = sessionStorage.getItem("minimized") === "true";
				const predictedWidth = currentMinimized ? 56 : 288;
				setSidebarWidth(predictedWidth);
				// Also update CSS variable immediately
				const root = document.documentElement;
				root.style.setProperty("--sidebar-width", `${predictedWidth}px`);
			}

			// Force immediate DOM update with synchronous call
			updateLayout();

			// Single backup update to ensure accuracy
			setTimeout(updateLayout, 50);
		};

		window.addEventListener("sidebarToggle", handleCustomSidebarToggle);

		return () => {
			clearTimeout(timeoutId1);
			clearTimeout(timeoutId2);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			window.removeEventListener("sidebarToggle", handleCustomSidebarToggle);
			if (sidebarRef.current) {
				sidebarRef.current.removeEventListener(
					"transitionstart",
					handleTransitionStart
				);
				sidebarRef.current.removeEventListener(
					"transitionend",
					handleTransitionEnd
				);
				sidebarRef.current.removeEventListener("click", handleSidebarClick);
			}
		};
	}, []); // Remove dependencies to avoid stale closures

	return (
		<div
			className="w-screen h-screen overflow-hidden dark:bg-darkBg bg-[#FAFAFA]"
			style={
				{
					"--sidebar-width": `${sidebarWidth}px`,
					"--navbar-height": `${navbarHeight}px`,
				} as React.CSSProperties
			}>
			<Sidebar ref={sidebarRef} />
			<div
				style={{
					marginLeft: `${sidebarWidth}px`,
					width: `calc(100vw - ${sidebarWidth}px)`,
					transform: `translateX(0)`, // Force GPU acceleration
					willChange: "margin-left, width", // Optimize for changes
				}}
				className="fixed top-0 transition-all duration-300 ease-in-out z-10 min-h-[64px] bg-white dark:bg-primaryGreyBg">
				<Navbar ref={navbarRef} />
			</div>

			<main
				style={{
					marginLeft: `${sidebarWidth}px`,
					marginTop: `${navbarHeight}px`,
					width: `calc(100vw - ${sidebarWidth}px)`,
					height: `calc(100vh - ${navbarHeight}px)`,
					transform: `translateX(0)`, // Force GPU acceleration
					willChange: "margin-left, width", // Optimize for changes
				}}
				className={`overflow-auto p-4 transition-all duration-300 ease-in-out ${
					isLayoutReady ? "opacity-100" : "opacity-95"
				}`}>
				{children}
			</main>
		</div>
	);
}
