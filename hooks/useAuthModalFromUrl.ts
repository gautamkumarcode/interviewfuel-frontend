"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Hook to handle login modal state based on URL parameters
 * This works with the middleware that redirects to home page with query params
 */
export function useAuthModalFromUrl() {
	const { openLogin, openSignup } = useAuthModal();
	const searchParams = useSearchParams();
	const router = useRouter();
	const hasProcessed = useRef<Set<string>>(new Set());

	useEffect(() => {
		const showLogin = searchParams.get("showLogin");
		const showSignup = searchParams.get("showSignup");
		const error = searchParams.get("error");
		const callbackUrl = searchParams.get("callbackUrl");

		// Create a unique key for this URL state
		const urlKey = `${showLogin}-${showSignup}-${error}-${callbackUrl}`;

		// Prevent processing the same state multiple times
		if (hasProcessed.current.has(urlKey)) return;
		hasProcessed.current.add(urlKey);

		// Open login modal if requested
		if (showLogin === "true") {
			openLogin();

			// Clean up URL parameters after a short delay
			setTimeout(() => {
				const newUrl = new URL(window.location.href);
				newUrl.searchParams.delete("showLogin");

				// Keep error and callbackUrl for the toast/redirect handling
				const searchString = newUrl.search;
				router.replace(newUrl.pathname + searchString, { scroll: false });
			}, 50);
		}

		// Open signup modal if requested
		if (showSignup === "true") {
			openSignup();

			// Clean up URL parameters after a short delay
			setTimeout(() => {
				const newUrl = new URL(window.location.href);
				newUrl.searchParams.delete("showSignup");

				const searchString = newUrl.search;
				router.replace(newUrl.pathname + searchString, { scroll: false });
			}, 50);
		}
	}, [searchParams, openLogin, openSignup, router]);

	// Return utility functions and states
	return {
		error: searchParams.get("error"),
		callbackUrl: searchParams.get("callbackUrl"),
		isFromProtectedRoute: !!searchParams.get("callbackUrl"),
	};
}

/**
 * Hook to handle post-login redirects
 * Use this after successful authentication
 */
export function usePostLoginRedirect() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePostLoginRedirect = () => {
		const callbackUrl = searchParams.get("callbackUrl");

		if (callbackUrl) {
			// Clean up all auth-related query parameters
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.delete("showLogin");
			newUrl.searchParams.delete("showSignup");
			newUrl.searchParams.delete("error");
			newUrl.searchParams.delete("callbackUrl");

			// Redirect to the originally requested page
			router.push(callbackUrl);
		} else {
			// Default redirect to questions or stay on current page
			router.push("/questions");
		}
	};

	return { handlePostLoginRedirect };
}
