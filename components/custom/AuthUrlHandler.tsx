"use client";

import { useTheme } from "@/context/theme.context";
import { useAuthModalFromUrl } from "@/hooks/useAuthModalFromUrl";
import { useEffect, useRef } from "react";

/**
 * Component to handle authentication modal state based on URL parameters
 * This should be included in your main layout or provider
 */
export function AuthUrlHandler() {
	const { error, isFromProtectedRoute } = useAuthModalFromUrl();
	const { toast } = useTheme();
	const hasShownToast = useRef<string>("");

	useEffect(() => {
		// Create a unique key for this error/route combination
		const toastKey = `${error}-${isFromProtectedRoute}`;

		// Prevent multiple toast notifications for the same scenario
		if (hasShownToast.current === toastKey) return;

		// Handle different error types
		if (error) {
			hasShownToast.current = toastKey;
			switch (error) {
				case "SessionExpired":
					toast.error("Your session has expired. Please log in again.");
					break;
				case "AccessDenied":
					toast.error("Access denied. Please log in to continue.");
					break;
				case "CredentialsSignin":
					toast.error("Invalid credentials. Please try again.");
					break;
				case "Configuration":
					toast.error("Authentication configuration error.");
					break;
				default:
					toast.error("Authentication error. Please try again.");
			}
		} else if (isFromProtectedRoute) {
			// Only show this message if there's no error
			hasShownToast.current = toastKey;
			toast.success("Please log in to access this page.");
		}
	}, [error, isFromProtectedRoute, toast]);

	// This component doesn't render anything
	return null;
}
