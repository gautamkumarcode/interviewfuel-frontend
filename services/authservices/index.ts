import { LoginFormData } from '@/components/screens/login/components/validation/loginSchema';
import { API_URL, apiEndPoint } from '@/constants/api';
import { SignupPayloadData, SignupResponse } from '@/types/auth/signup';
import { authenticatedInstance, unauthenticatedInstance } from "@/utils/axios";
import axios from "axios";
import { signOut } from "next-auth/react";

export const loginUser = async (data: LoginFormData) => {
	const response = await unauthenticatedInstance.post(
		`${API_URL}${apiEndPoint.login}`,
		data
	);
	return response.data;
};

export const signupUser = async (signupData: SignupPayloadData) => {
	const response = await axios.post<SignupResponse>(
		`${API_URL}${apiEndPoint.signup}`,
		signupData
	);

	return response.data;
};

export const sendForgotPassword = async (emailData: { email: string }) => {
	const response = await axios.post(`${API_URL}/forgot-password`, emailData);
	return response.data;
};

export const handleSignOutAPI = async () => {
	try {
		const response = await authenticatedInstance.post(
			`${API_URL}${apiEndPoint.logout}`
		);
		await signOut({ redirect: false });
	} catch (error) {
		console.error("Error signing out:", error);
	}
};

