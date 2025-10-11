"use client";

import AuthTabs from "@/components/screens/auth/AuthTabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuthModal } from "@/context/AuthModalContext";
import { useTheme } from "@/context/theme.context";
import {
	useAuthModalFromUrl,
	usePostLoginRedirect,
} from "@/hooks/useAuthModalFromUrl";
import { Suspense, useEffect, useRef } from "react";

const AuthModalContent = () => {
	const { isOpen, closeModal, view } = useAuthModal();
	const { handlePostLoginRedirect } = usePostLoginRedirect();
	const { error, isFromProtectedRoute } = useAuthModalFromUrl();
	const { toast } = useTheme();
	const hasShownToast = useRef<string>("");

	const handleSuccess = () => {
		closeModal();
		handlePostLoginRedirect();
	};

	// Handle toast messages when modal opens
	useEffect(() => {
		if (isOpen) {
			const toastKey = `${error}-${isFromProtectedRoute}`;

			// Prevent showing the same toast multiple times
			if (hasShownToast.current === toastKey) return;
			hasShownToast.current = toastKey;

			// Show error messages
			if (error) {
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
				// Show info message for protected route access
				toast.success("Please log in to access this page.");
			}
		}
	}, [isOpen, error, isFromProtectedRoute, toast]);

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={closeModal}>
				<DialogContent className="max-w-lg w-full p-0 bg-transparent border-none shadow-none">
					<DialogTitle>{""}</DialogTitle>
					<AuthTabs initialTab={view} onSuccess={handleSuccess} />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export const AuthModal = () => {
	return (
		<Suspense fallback={null}>
			<AuthModalContent />
		</Suspense>
	);
};
