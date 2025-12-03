import { AxiosResponseTypeWithoutPagination } from "@/types/axios-response";
import { authenticatedInstance } from "@/utils/axios";

interface User {
	_id: string;
	name: string;
	email: string;
	userName: string;
	role: string;
	isActive: boolean;
	bio?: string;
	createdAt: string;
}

interface UserStats {
	total: number;
	active: number;
	inactive: number;
	admins: number;
	regular: number;
	newUsersLast30Days: number;
}

interface GetUsersParams {
	page?: number;
	limit?: number;
	search?: string;
	role?: string;
	status?: string;
	sortBy?: string;
	order?: string;
}

interface GetUsersResponse {
	users: User[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

interface CreateUserData {
	name: string;
	email: string;
	userName: string;
	password: string;
	role?: string;
	bio?: string;
}

interface UpdateUserData {
	name?: string;
	email?: string;
	userName?: string;
	role?: string;
	bio?: string;
}

class AdminUserService {
	public getUsers = async (
		params: GetUsersParams = {}
	): Promise<AxiosResponseTypeWithoutPagination<GetUsersResponse>> => {
		const { data } = await authenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<GetUsersResponse>
		>("/admin/users", { params });

		return data;
	};

	public getUserStats = async (): Promise<
		AxiosResponseTypeWithoutPagination<{ stats: UserStats }>
	> => {
		const { data } = await authenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<{ stats: UserStats }>
		>("/admin/users/stats");

		return data;
	};

	public getUserById = async (
		userId: string
	): Promise<AxiosResponseTypeWithoutPagination<{ user: User }>> => {
		const { data } = await authenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<{ user: User }>
		>(`/admin/users/${userId}`);

		return data;
	};

	public createUser = async (
		userData: CreateUserData
	): Promise<AxiosResponseTypeWithoutPagination<{ user: User }>> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ user: User }>
		>("/admin/users", userData);

		return data;
	};

	public updateUser = async (
		userId: string,
		userData: UpdateUserData
	): Promise<AxiosResponseTypeWithoutPagination<{ user: User }>> => {
		const { data } = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<{ user: User }>
		>(`/admin/users/${userId}`, userData);

		return data;
	};

	public deleteUser = async (
		userId: string
	): Promise<AxiosResponseTypeWithoutPagination<{ message: string }>> => {
		const { data } = await authenticatedInstance.delete<
			AxiosResponseTypeWithoutPagination<{ message: string }>
		>(`/admin/users/${userId}`);

		return data;
	};

	public resetUserPassword = async (
		userId: string,
		newPassword: string
	): Promise<AxiosResponseTypeWithoutPagination<{ message: string }>> => {
		const { data } = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<{ message: string }>
		>(`/admin/users/${userId}/reset-password`, { newPassword });

		return data;
	};

	public toggleUserStatus = async (
		userId: string
	): Promise<
		AxiosResponseTypeWithoutPagination<{ message: string; isActive: boolean }>
	> => {
		const { data } = await authenticatedInstance.patch<
			AxiosResponseTypeWithoutPagination<{
				message: string;
				isActive: boolean;
			}>
		>(`/admin/users/${userId}/toggle-status`);

		return data;
	};

	public bulkDeleteUsers = async (
		userIds: string[]
	): Promise<
		AxiosResponseTypeWithoutPagination<{
			message: string;
			deletedCount: number;
		}>
	> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{
				message: string;
				deletedCount: number;
			}>
		>("/admin/users/bulk-delete", { userIds });

		return data;
	};
}

export const adminUserService = new AdminUserService();
