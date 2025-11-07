import { apiEndPoint } from "@/constants/api";
import { AxiosResponseTypeWithoutPagination } from "@/types/axios-response";
import { User } from "@/types/user";
import { authenticatedInstance } from "@/utils/axios";

class UserServices {
	public getUserProfile = async (): Promise<
		AxiosResponseTypeWithoutPagination<{ user: User }>
	> => {
		const { data } = await authenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<{ user: User }>
		>(apiEndPoint.getUserProfile);

		return data;
	};
}

export const userServices = new UserServices();
