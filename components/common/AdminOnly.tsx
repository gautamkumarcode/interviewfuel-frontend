"use client";

import { useClusterData } from "@/context/clusterData-context";
import React from "react";

interface AdminOnlyProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	showMessage?: boolean;
	allowModerator?: boolean;
}

/**
 * Component that only renders its children if the current user is an admin.
 * Useful for wrapping admin-only buttons, forms, or sections.
 */
export const AdminOnly: React.FC<AdminOnlyProps> = ({
	children,
	fallback = null,
	showMessage = false,
	allowModerator = false,
}) => {
	const { userData, userLoading } = useClusterData();
	const isAdmin = userData?.role === "admin";
	const isModerator = userData?.role === "moderator";
	const hasAccess = isAdmin || (allowModerator && isModerator);

	console.log("AdminOnly check: ", {
		isAdmin,
		isModerator,
		hasAccess,
		userLoading,
		userData: userData
			? {
					id: userData._id,
					role: userData.role,
					name: userData.name,
			  }
			: null,
	});

	// Show loading state while user data is being fetched
	if (userLoading) {
		return <>{fallback}</>;
	}

	if (!hasAccess) {
		if (showMessage) {
			return (
				<div className="text-sm text-gray-500 italic">
					{allowModerator
						? "Admin or moderator access required"
						: "Admin access required"}
				</div>
			);
		}
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

/**
 * Component that renders its children if the current user is an admin or moderator.
 * Useful for content management features.
 */
export const ModeratorOnly: React.FC<
	Omit<AdminOnlyProps, "allowModerator">
> = ({ children, fallback = null, showMessage = false }) => {
	return (
		<AdminOnly
			allowModerator={true}
			fallback={fallback}
			showMessage={showMessage}>
			{children}
		</AdminOnly>
	);
};

/**
 * Hook to check if the current user is an admin
 */
export const useIsAdmin = () => {
	const { userData } = useClusterData();
	return userData?.role === "admin";
};

/**
 * Hook to check if the current user has moderator access (admin or moderator)
 */
export const useHasModeratorAccess = () => {
	const { userData } = useClusterData();
	return userData?.role === "admin" || userData?.role === "moderator";
};

/**
 * Hook to get user role information
 */
export const useUserRole = () => {
	const { userData } = useClusterData();
	return {
		role: userData?.role || "user",
		isAdmin: userData?.role === "admin",
		isModerator: userData?.role === "moderator",
		isUser: userData?.role === "user" || !userData?.role,
		hasAdminAccess: userData?.role === "admin",
		hasModeratorAccess:
			userData?.role === "admin" || userData?.role === "moderator",
		userData: userData,
	};
};
