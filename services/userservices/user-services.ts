import { apiEndPoint } from "@/constants/api";
import { AxiosResponseTypeWithoutPagination } from "@/types/axios-response";
import { authenticatedInstance } from "@/utils/axios";

class UserServices {
	public getUserProfile = async (): Promise<
		AxiosResponseTypeWithoutPagination<any[]>
	> => {
		const { data } = await authenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<any[]>
		>(apiEndPoint.getUserProfile);

		return data;
	};
}

export const userServices = new UserServices();
