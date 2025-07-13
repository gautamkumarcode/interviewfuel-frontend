import { apiEndPoint } from "@/constants/api";
import { AxiosResponseTypeWithPagination } from "@/types/axios-response";
import { GetCategoriesResponseType } from "@/types/interfaces/category/category-type";
import { unauthenticatedInstance } from "@/utils/axios";

class CategoryServices {
	public async getAllCategories(): Promise<
		AxiosResponseTypeWithPagination<GetCategoriesResponseType[]>
	> {
		const { data } = await unauthenticatedInstance.get<
			AxiosResponseTypeWithPagination<GetCategoriesResponseType[]>
		>(apiEndPoint.getCategory);
		return data;
	}
}

export const categoryService = new CategoryServices();
