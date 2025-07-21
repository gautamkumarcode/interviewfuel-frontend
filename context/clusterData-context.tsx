import { categoryService } from "@/services/category/categories-services";
import { AxiosResponseTypeWithPagination } from "@/types/axios-response";
import { GetCategoriesResponseType } from "@/types/interfaces/category/category-type";
import { createContext } from "react";

import { ReactNode, useContext } from "react";
import { useQuery } from "react-query";

type ClusterDataContextType = {
	categoryData: GetCategoriesResponseType[] | null;
	categoryLoading: boolean;
};

const ClusterDataContext = createContext<ClusterDataContextType | undefined>(
	undefined
);
export const ClusterDataProvider = ({ children }: { children: ReactNode }) => {
	const { data, isLoading } = useQuery<
		AxiosResponseTypeWithPagination<GetCategoriesResponseType[]>
	>(["allcategories"], () => categoryService.getAllCategories());

	const categories: GetCategoriesResponseType[] | null =
		data?.data?.results || null;

	const categoryLoading = isLoading;
	return (
		<ClusterDataContext.Provider
			value={{ categoryData: categories, categoryLoading }}>
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
