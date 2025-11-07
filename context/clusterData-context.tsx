"use client";

import {
	categoryService,
	CategoryType,
} from "@/services/categories/category-services";
import { userServices } from "@/services/userservices/user-services";
import { AxiosResponseTypeWithoutPagination } from "@/types/axios-response";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "react-query";

type ClusterDataContextType = {
	categoryData: CategoryType[] | null;
	categoryLoading: boolean;
	userData: User | null;
	userLoading: boolean;
	userError: any;
	refetchUser: () => void;
};

const ClusterDataContext = createContext<ClusterDataContextType | undefined>(
	undefined
);

export const ClusterDataProvider = ({
	children,
	initialUserData,
}: {
	children: ReactNode;
	initialUserData?: User | null;
}) => {
	const { data: session, status } = useSession();

	const { data: categoryData, isLoading: categoryLoading } = useQuery<
		AxiosResponseTypeWithoutPagination<{
			results: CategoryType[];
			total: number;
		}>
	>(["allcategories"], categoryService.getAllCategories);

	const {
		data: userData,
		isLoading: userIsLoading,
		error: userError,
		refetch: refetchUser,
	} = useQuery<AxiosResponseTypeWithoutPagination<{ user: User }>>(
		["userProfile"],
		() => userServices.getUserProfile(),
		{
			enabled: status === "authenticated" && !!session?.accessToken,
			staleTime: 1000 * 60 * 5, // 5 minutes
			cacheTime: 1000 * 60 * 10, // 10 minutes
			initialData: initialUserData
				? {
						success: true,
						message: "Initial data",
						data: { user: initialUserData },
				  }
				: undefined,
		}
	);

	const value = useMemo<ClusterDataContextType>(() => {
		// Determine the actual user data to use
		let actualUserData = null;

		if (initialUserData) {
			// Use initial data if provided
			actualUserData = initialUserData;
		} else if (userData?.data?.user) {
			// Use fetched user data (most up-to-date) - note the nested structure
			actualUserData = userData.data.user;
		} else if (status === "authenticated" && session?.user) {
			// Fallback to session data if available
			actualUserData = {
				_id: session.user.id,
				name: session.user.name,
				email: session.user.email,
				role: session.user.role,
			} as User;
		}

		// Determine loading state
		const isUserLoading =
			status === "loading" ||
			(status === "authenticated" &&
				userIsLoading &&
				!initialUserData &&
				!session?.user);

		return {
			categoryData: categoryData?.data?.results || null,
			categoryLoading,
			userData: actualUserData,
			userLoading: isUserLoading,
			userError,
			refetchUser,
		};
	}, [
		categoryData,
		categoryLoading,
		userData,
		userIsLoading,
		userError,
		refetchUser,
		initialUserData,
		status,
		session,
	]);

	return (
		<ClusterDataContext.Provider value={value}>
			{children}
		</ClusterDataContext.Provider>
	);
};

export const useClusterData = (): ClusterDataContextType => {
	const context = useContext(ClusterDataContext);
	if (!context) {
		throw new Error("useClusterData must be used within a ClusterDataProvider");
	}
	return context;
};
