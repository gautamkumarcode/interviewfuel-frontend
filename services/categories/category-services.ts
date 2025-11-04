import { apiEndPoint } from "@/constants/api";
import { AxiosResponseTypeWithoutPagination } from "@/types/axios-response";
import { authenticatedInstance, unauthenticatedInstance } from "@/utils/axios";

export interface CategoryType {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	color?: string;
	parentCategory?: string | null;
	tags?: string[];
	stats: {
		questionCount: number;
		totalViews: number;
		averageDifficulty: number;
	};
	isActive: boolean;
	order: number;
	createdAt: string;
	updatedAt: string;
	subcategories?: CategoryType[];
}

export interface CreateCategoryPayload {
	name: string;
	description?: string;
	color?: string;
	icon?: string;
	parentCategory?: string | null;
	tags?: string[];
	order?: number;
}

class CategoryService {
	public getAllCategories = async (): Promise<
		AxiosResponseTypeWithoutPagination<{
			results: CategoryType[];
			total: number;
		}>
	> => {
		const { data } = await unauthenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<{
				results: CategoryType[];
				total: number;
			}>
		>(`${apiEndPoint.getCategory}`);
		return data;
	};

	public getCategoryBySlug = async (
		slug: string
	): Promise<
		AxiosResponseTypeWithoutPagination<{ category: CategoryType }>
	> => {
		const { data } = await unauthenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<{ category: CategoryType }>
		>(`${apiEndPoint.getCategory}/${slug}`);
		return data;
	};

	public createCategory = async (
		payload: CreateCategoryPayload
	): Promise<
		AxiosResponseTypeWithoutPagination<{ category: CategoryType }>
	> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ category: CategoryType }>
		>(`${apiEndPoint.getCategory}`, payload);
		return data;
	};

	public updateCategory = async (
		id: string,
		payload: Partial<CreateCategoryPayload>
	): Promise<
		AxiosResponseTypeWithoutPagination<{ category: CategoryType }>
	> => {
		const { data } = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<{ category: CategoryType }>
		>(`${apiEndPoint.getCategory}/${id}`, payload);
		return data;
	};

	public deleteCategory = async (
		id: string
	): Promise<AxiosResponseTypeWithoutPagination<any>> => {
		const { data } = await authenticatedInstance.delete<
			AxiosResponseTypeWithoutPagination<any>
		>(`${apiEndPoint.getCategory}/${id}`);
		return data;
	};

	public bulkCreateCategories = async (
		categories: CreateCategoryPayload[]
	): Promise<
		AxiosResponseTypeWithoutPagination<{ categories: CategoryType[] }>
	> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ categories: CategoryType[] }>
		>(`${apiEndPoint.getCategory}/bulk`, { categories });
		return data;
	};
}

export const categoryService = new CategoryService();
