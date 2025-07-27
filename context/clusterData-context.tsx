"use client";

import { categoryService } from "@/services/category/categories-services";
import { userServices } from "@/services/userservices/user-services";
import {
	AxiosResponseTypeWithoutPagination,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import { GetCategoriesResponseType } from "@/types/interfaces/category/category-type";
import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "react-query";

type ClusterDataContextType = {
	categoryData: GetCategoriesResponseType[] | null;
	categoryLoading: boolean;
};

const ClusterDataContext = createContext<ClusterDataContextType | undefined>(
	undefined
);

export const ClusterDataProvider = ({ children }: { children: ReactNode }) => {
	const { data: session, status } = useSession();

	// Optional: log session for debugging
	if (process.env.NODE_ENV === "development") {
		console.log("Session in ClusterDataProvider:", session);
	}

	// Separate user profile query (change key to avoid collision)
	const {
		data: userData,
		isLoading: userLoading,
		error: userError,
	} = useQuery<AxiosResponseTypeWithoutPagination<any[]>>(
		["userProfile"],
		userServices.getUserProfile
	);

	// Fetch all categories
	const {
		data: categoryData,
		isLoading: categoryLoading,
		error: categoryError,
	} = useQuery<AxiosResponseTypeWithPagination<GetCategoriesResponseType[]>>(
		["allcategories"],
		categoryService.getAllCategories
	);

	const value = useMemo<ClusterDataContextType>(
		() => ({
			categoryData: categoryData?.data?.results || null,
			categoryLoading,
		}),
		[categoryData, categoryLoading]
	);

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
