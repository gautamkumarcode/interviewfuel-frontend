export interface AxiosResponseTypeWithoutPagination<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface AxiosResponseTypeWithPagination<T> {
	success: boolean;
	data: {
		results: T;
		page: number;
		limit: number;
		totalResults: number;
		totalPages: number;
	};
}

export interface AxiosErrorResponseType {
	success: boolean;
	message: string;
	code: number;
}
