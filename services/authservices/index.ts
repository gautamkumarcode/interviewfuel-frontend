import { LoginPayloadData, LoginResponse } from '@/types/auth/login';
import { SignupPayloadData, SignupResponse } from '@/types/auth/signup';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export const loginUser = async (loginData:LoginPayloadData) => {
    console.log(BASE_URL)
  const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, loginData);
  return response.data;
};

export const signupUser = async (signupData:SignupPayloadData) => {
  const response = await axios.post<SignupResponse>(`${BASE_URL}/register`, signupData);
  return response.data;
};

export const sendForgotPassword = async (emailData: { email: string }) => {
	const response = await axios.post(`${BASE_URL}/forgot-password`, emailData);
	return response.data;
};

