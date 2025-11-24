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

	public updateProfile = async (
		profileData: Partial<User>
	): Promise<AxiosResponseTypeWithoutPagination<{ user: User }>> => {
		const { data } = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<{ user: User }>
		>("/auth/profile", profileData);

		return data;
	};

	public uploadAvatar = async (
		file: File
	): Promise<AxiosResponseTypeWithoutPagination<{ avatarUrl: string }>> => {
		const formData = new FormData();
		formData.append("avatar", file);

		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ avatarUrl: string }>
		>("/auth/avatar", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return data;
	};

	public deleteAvatar = async (): Promise<
		AxiosResponseTypeWithoutPagination<{ message: string }>
	> => {
		const { data } = await authenticatedInstance.delete<
			AxiosResponseTypeWithoutPagination<{ message: string }>
		>("/auth/avatar");

		return data;
	};

	public updatePreferences = async (
		preferences: User["preferences"]
	): Promise<AxiosResponseTypeWithoutPagination<{ user: User }>> => {
		const { data } = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<{ user: User }>
		>("/auth/preferences", { preferences });

		return data;
	};

	public changePassword = async (
		currentPassword: string,
		newPassword: string
	): Promise<AxiosResponseTypeWithoutPagination<{ message: string }>> => {
		const { data } = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<{ message: string }>
		>("/auth/change-password", { currentPassword, newPassword });

		return data;
	};

	public deleteAccount = async (
		password: string
	): Promise<AxiosResponseTypeWithoutPagination<{ message: string }>> => {
		const { data } = await authenticatedInstance.delete<
			AxiosResponseTypeWithoutPagination<{ message: string }>
		>("/auth/account", {
			data: { password },
		});

		return data;
	};

	public exportData = async (): Promise<Blob> => {
		const { data } = await authenticatedInstance.get("/auth/export-data", {
			responseType: "blob",
		});

		return data;
	};
}

export const userServices = new UserServices();
