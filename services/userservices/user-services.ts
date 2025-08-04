import { apiEndPoint } from "@/constants/api";
import { AxiosResponseTypeWithoutPagination } from "@/types/axios-response";
import { authenticatedInstance } from "@/utils/axios";

class UserServices {
	public getUserProfile = async (): Promise<
		AxiosResponseTypeWithoutPagination<any[]>
	> => {
		try {
			console.log("User service: Fetching user profile");

			const { data } = await authenticatedInstance.get<
				AxiosResponseTypeWithoutPagination<any[]>
			>(apiEndPoint.getUserProfile);

			console.log("User service: Profile fetched successfully", {
				hasData: !!data,
				hasUser: !!data?.data,
			});

			return data;
		} catch (error: any) {
			console.error("User service: Get profile error:", {
				message: error?.message,
				response: error?.response?.data,
				status: error?.response?.status,
			});
			throw error;
		}
	};
}

export const userServices = new UserServices();
