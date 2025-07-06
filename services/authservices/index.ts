import { LoginFormData } from '@/components/screens/login/components/validation/loginSchema';
import { API_URL } from '@/constants/api';
import { SignupPayloadData, SignupResponse } from '@/types/auth/signup';
import { unauthenticatedInstance } from '@/utils/axios';
import axios from 'axios';



export const loginUser = async (data: LoginFormData) => {
  const response = await unauthenticatedInstance.post("/auth/login", data);
  return response.data;
};
export const signupUser = async (signupData:SignupPayloadData) => {
  const response = await axios.post<SignupResponse>(`${API_URL}/register`, signupData);
  return response.data;
};

export const sendForgotPassword = async (emailData: { email: string }) => {
	const response = await axios.post(`${API_URL}/forgot-password`, emailData);
	return response.data;
};

