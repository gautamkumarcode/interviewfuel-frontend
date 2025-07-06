// utils/axios.ts
import { API_URL } from "@/constants/api";
import axios, { AxiosInstance } from "axios";

console.log(API_URL);

// Utility to get token from cookies (or localStorage if needed)
const getToken = (): string | undefined => {
	if (typeof window === "undefined") return undefined;

	// Prefer cookies, fallback to localStorage if needed
	const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
	return match?.[2] || localStorage.getItem("token") || undefined;
};

// Axios Instances
const unauthenticatedInstance: AxiosInstance = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	withCredentials: true, // enables cookies to be sent in cross-site requests
});

const authenticatedInstance: AxiosInstance = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	withCredentials: true,
});

// Attach token in Authorization header
authenticatedInstance.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Optional: Global error handler (like token expired)
authenticatedInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// optionally redirect to login or refresh token
			console.warn("Unauthorized - maybe redirect to login?");
		}
		return Promise.reject(error);
	}
);

export { authenticatedInstance, unauthenticatedInstance };
