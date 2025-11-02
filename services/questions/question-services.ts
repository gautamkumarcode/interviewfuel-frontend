import { apiEndPoint } from "@/constants/api";
import {
	AxiosResponseTypeWithoutPagination,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import {
	CommentType,
	GetAllQuestionsResponseType,
	GetSingleQuestionResponseType,
} from "@/types/interfaces/questions/getQuestion-type";
import { authenticatedInstance, unauthenticatedInstance } from "@/utils/axios";

class QuestionService {
	public getAllQuestions = async (
		category?: string
	): Promise<
		AxiosResponseTypeWithPagination<GetAllQuestionsResponseType[]>
	> => {
		const { data } = await unauthenticatedInstance.get<
			AxiosResponseTypeWithPagination<GetAllQuestionsResponseType[]>
		>(`${apiEndPoint.getAllQuestions}`, {
			params: {
				category: category,
			},
		});

		return data;
	};

	public getSingleQuestion = async (
		id: string
	): Promise<
		AxiosResponseTypeWithoutPagination<GetSingleQuestionResponseType>
	> => {
		const { data } = await unauthenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<GetSingleQuestionResponseType>
		>(`${apiEndPoint.getAllQuestions}/${id}`);
		return data;
	};

	public createQuestion = async (
		payload: any
	): Promise<AxiosResponseTypeWithoutPagination<any>> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<any>
		>(`${apiEndPoint.getAllQuestions}`, payload);
		return data;
	};

	public bookmarkQuestion = async (
		id: string
	): Promise<AxiosResponseTypeWithoutPagination<{ bookmarks: number }>> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ bookmarks: number }>
		>(`${apiEndPoint.getAllQuestions}/${id}/bookmark`);
		return data;
	};

	public likeQuestion = async (
		id: string
	): Promise<AxiosResponseTypeWithoutPagination<{ likes: number }>> => {
		const { data } = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ likes: number }>
		>(`${apiEndPoint.getAllQuestions}/${id}/like`);
		return data;
	};

	public addCommentToQuestions = async (data: {
		questionId: string;
		content: string;
		parentComment?: string | null;
	}): Promise<AxiosResponseTypeWithoutPagination<CommentType>> => {
		const response = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<CommentType>
		>(`${apiEndPoint.getAllQuestions}/${data.questionId}/comments/add`, data);
		return response.data;
	};
	public getCommentsOfQuestion = async (
		questionId: string
	): Promise<AxiosResponseTypeWithPagination<CommentType[]>> => {
		const response = await unauthenticatedInstance.get<
			AxiosResponseTypeWithPagination<CommentType[]>
		>(`${apiEndPoint.getAllQuestions}/${questionId}/comments`);
		return response.data;
	};

	public likeComment = async (
		questionId: string,
		commentId: string
	): Promise<AxiosResponseTypeWithoutPagination<{ likes: number }>> => {
		const response = await authenticatedInstance.post<
			AxiosResponseTypeWithoutPagination<{ likes: number }>
		>(
			`${apiEndPoint.getAllQuestions}/${questionId}/comments/${commentId}/like`
		);
		return response.data;
	};

	public deleteComment = async (
		questionId: string,
		commentId: string
	): Promise<AxiosResponseTypeWithoutPagination<any>> => {
		const response = await authenticatedInstance.delete<
			AxiosResponseTypeWithoutPagination<any>
		>(`${apiEndPoint.getAllQuestions}/${questionId}/comments/${commentId}`);
		return response.data;
	};

	public editComment = async (
		questionId: string,
		commentId: string,
		content: string
	): Promise<AxiosResponseTypeWithoutPagination<CommentType>> => {
		const response = await authenticatedInstance.put<
			AxiosResponseTypeWithoutPagination<CommentType>
		>(`${apiEndPoint.getAllQuestions}/${questionId}/comments/${commentId}`, {
			content,
		});
		return response.data;
	};

	public getRelatedQuestions = async (
		questionId: string,
		limit: number = 5
	): Promise<
		AxiosResponseTypeWithoutPagination<{
			results: GetAllQuestionsResponseType[];
			total: number;
		}>
	> => {
		const response = await unauthenticatedInstance.get<
			AxiosResponseTypeWithoutPagination<{
				results: GetAllQuestionsResponseType[];
				total: number;
			}>
		>(`${apiEndPoint.getAllQuestions}/${questionId}/related?limit=${limit}`);
		return response.data;
	};
}

export const questionService = new QuestionService();
