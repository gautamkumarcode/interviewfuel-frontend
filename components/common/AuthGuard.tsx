"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthModal } from "@/context/AuthModalContext";
import { useClusterData } from "@/context/clusterData-context";
import { Lock, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

interface AuthGuardProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	showMessage?: boolean;
	redirectMessage?: string;
}

/**
 * Component that only renders its children if the user is authenticated.
 * Useful for protecting pages that require login.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
	children,
	fallback,
	showMessage = true,
	redirectMessage = "Please sign in to access this page",
}) => {
	const { userData, userLoading } = useClusterData();
	const { data: session, status } = useSession();
	const { openLogin } = useAuthModal();

	// Check if user is authenticated from either source
	const isAuthenticated =
		!!userData || (status === "authenticated" && !!session);
	const isLoading = userLoading || status === "loading";

	// Show loading state while user data is being fetched
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	// If user is not authenticated, show fallback or default message
	if (!isAuthenticated) {
		if (fallback) {
			return <>{fallback}</>;
		}

		if (showMessage) {
			return (
				<div className="flex items-center justify-center min-h-[60vh]">
					<Card className="max-w-md w-full">
						<CardContent className="p-8 text-center space-y-4">
							<Lock className="w-16 h-16 text-gray-400 mx-auto" />
							<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
								Authentication Required
							</h2>
							<p className="text-gray-600 dark:text-gray-400">
								{redirectMessage}
							</p>
							<Button
								onClick={() => openLogin()}
								className="gap-2 w-full"
								size="lg">
								<LogIn className="h-4 w-4" />
								Sign In
							</Button>
						</CardContent>
					</Card>
				</div>
			);
		}

		return null;
	}

	return <>{children}</>;
};

/**
 * Hook to check if the current user is authenticated
 */
export const useIsAuthenticated = () => {
	const { userData, userLoading } = useClusterData();
	const { data: session, status } = useSession();

	const isAuthenticated =
		!!userData || (status === "authenticated" && !!session);
	const isLoading = userLoading || status === "loading";

	return {
		isAuthenticated,
		isLoading,
		user: userData || session?.user,
	};
};
