"use client";

import { AppLayout } from "@/components/custom/layout/Layout";
import { useEffect, useRef, useState } from "react";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const navbarRef = useRef<HTMLDivElement>(null);
	const [sidebarWidth, setSidebarWidth] = useState(0);
	const [navbarHeight, setNavbarHeight] = useState(0);

	useEffect(() => {
		// Function to update the dimensions using getBoundingClientRect
		const updateDimensions = () => {
			if (navbarRef.current) {
				const navbarRect = navbarRef.current.getBoundingClientRect();
				setNavbarHeight(navbarRect.height);
			}

			if (sidebarRef.current) {
				const sidebarRect = sidebarRef.current.getBoundingClientRect();
				setSidebarWidth(sidebarRect.width);

				// Set the left position of the navbar dynamically via the ref
				if (navbarRef.current) {
					navbarRef.current.style.left = `${sidebarRect.width}px`;
				}
			}
		};

		// Initialize the dimensions
		updateDimensions();

		// Set up a ResizeObserver to watch the sidebar for changes in width
		const sidebarElement = sidebarRef.current;

		if (sidebarElement) {
			const resizeObserver = new ResizeObserver(() => {
				updateDimensions(); // Call updateDimensions to handle width changes
			});

			// Start observing the sidebar element
			resizeObserver.observe(sidebarElement);

			// Cleanup function to unobserve when the component unmounts
			return () => {
				resizeObserver.unobserve(sidebarElement);
			};
		}
	}, []);

	return <AppLayout>{children}</AppLayout>;
}
