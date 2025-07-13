import { apiEndPoint } from "@/constants/api";
import {
	AxiosResponseTypeWithoutPagination,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import {
	GetAllQuestionsResponseType,
	GetSingleQuestionResponseType,
} from "@/types/interfaces/questions/getQuestion-type";
import { unauthenticatedInstance } from "@/utils/axios";

class QuestionService {
	public getAllQuestions = async (category?:string): Promise<
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

	// 	 public getMyLeave = async (): Promise<
	//     AxiosResponseTypeWithoutPagination<GetLeaveListResponseType[]>
	//   > => {
	//     const { data } = await authenticatedInstance.get<
	//       AxiosResponseTypeWithoutPagination<GetLeaveListResponseType[]>
	//     >(availableApiRoutes.getMyLeaves);
	//     return data;
	//   };
	//   public getAllLeaveTypeList = async (): Promise<
	//     AxiosResponseTypeWithoutPagination<GetAllLeaveTypeListResponseType[]>
	//   > => {
	//     const { data } = await authenticatedInstance.get<
	//       AxiosResponseTypeWithoutPagination<GetAllLeaveTypeListResponseType[]>
	//     >(availableApiRoutes.getAllLeaveTypeList);
	//     return data;
	//   };

	//   public getAllLeaveTypeWithPolicy = async (): Promise<
	//     AxiosResponseTypeWithoutPagination<GetAllLeaveTypeWithPolicyResponseType[]>
	//   > => {
	//     const { data } = await authenticatedInstance.get<
	//       AxiosResponseTypeWithoutPagination<
	//         GetAllLeaveTypeWithPolicyResponseType[]
	//       >
	//     >(availableApiRoutes.getAllLeaveTypeWithPolicy);
	//     return data;
	//   };
	//   public createLeaveType = async (
	//     payload: CreateLeaveTypePayloadType,
	//   ): Promise<
	//     AxiosResponseTypeWithoutPagination<CreateLeaveTypeResponseType>
	//   > => {
	//     const { data } = await authenticatedInstance.put<
	//       AxiosResponseTypeWithoutPagination<CreateLeaveTypeResponseType>
	//     >(availableApiRoutes.createLeaveType, payload);
	//     return data;
	//   };
	//   public createLeavePolicy = async (
	//     payload: CreatePolicyPayloadType,
	//   ): Promise<AxiosResponseTypeWithoutPagination<CreatePolicyResponseType>> => {
	//     const { data } = await authenticatedInstance.put<
	//       AxiosResponseTypeWithoutPagination<CreatePolicyResponseType>
	//     >(availableApiRoutes.createPolicy, payload);
	//     return data;
	//   };
}

export const questionService = new QuestionService();
