import { LoginFormData } from '@/components/screens/login/components/validation/loginSchema';
import { API_URL, apiEndPoint } from '@/constants/api';
import { SignupPayloadData, SignupResponse } from '@/types/auth/signup';
import { authenticatedInstance, unauthenticatedInstance } from "@/utils/axios";
import { signOut } from "next-auth/react";

export const loginUser = async (data: LoginFormData) => {
	try {
		console.log("Login service: Attempting login for", data.email);

		const response = await unauthenticatedInstance.post(
			`${API_URL}${apiEndPoint.login}`,
			data
		);

		console.log("Login service: Response received", {
			status: response.status,
			hasData: !!response.data,
			hasUser: !!response.data?.data?.user,
			hasToken: !!response.data?.data?.token,
		});

		return response.data;
	} catch (error: any) {
		console.error("Login service error:", {
			message: error?.message,
			response: error?.response?.data,
			status: error?.response?.status,
		});
		throw error;
	}
};

export const signupUser = async (signupData: SignupPayloadData) => {
	try {
		console.log("Signup service: Attempting signup for", signupData.email);

		const response = await unauthenticatedInstance.post<SignupResponse>(
			`${API_URL}${apiEndPoint.signup}`,
			signupData
		);

		console.log("Signup service: Response received", {
			status: response.status,
			hasData: !!response.data,
		});

		return response.data;
	} catch (error: any) {
		console.error("Signup service error:", {
			message: error?.message,
			response: error?.response?.data,
			status: error?.response?.status,
		});
		throw error;
	}
};

export const sendForgotPassword = async (emailData: { email: string }) => {
	try {
		console.log(
			"Forgot password service: Sending reset email to",
			emailData.email
		);

		const response = await unauthenticatedInstance.post(
			`${API_URL}/auth/forgot-password`,
			emailData
		);

		console.log("Forgot password service: Response received", {
			status: response.status,
			hasData: !!response.data,
		});

		return response.data;
	} catch (error: any) {
		console.error("Forgot password service error:", {
			message: error?.message,
			response: error?.response?.data,
			status: error?.response?.status,
		});
		throw error;
	}
};

export const handleSignOutAPI = async () => {
	try {
		const response = await authenticatedInstance.post(
			`${API_URL}${apiEndPoint.logout}`
		);
		if (response.status === 200) {
			console.log("Sign out successful");
		} else {
			console.error("Sign out failed with status:", response.status);
		}
		await signOut({ redirect: false });
	} catch (error) {
		console.error("Error signing out:", error);
	}
};

