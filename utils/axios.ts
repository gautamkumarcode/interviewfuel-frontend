import { API_URL } from "@/constants/api";
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";

// Create axios instances
const unauthenticatedInstance: AxiosInstance = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	withCredentials: true,
});

const authenticatedInstance: AxiosInstance = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	withCredentials: true,
});

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to handle token refresh
const refreshAccessToken = async (): Promise<string> => {
	try {
		const response = await unauthenticatedInstance.post("/auth/refresh-token");

		if (!response.data?.token) {
			throw new Error("Invalid refresh token response");
		}

		// Update session with new token
		await updateSession({
			accessToken: response.data.token,
			refreshToken: response.data.refreshToken,
		});

		return response.data.token;
	} catch (error) {
		console.error("Refresh token error:", error);
		throw error;
	}
};

// Request interceptor
authenticatedInstance.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		// Skip adding token for refresh endpoint
		if (config.url?.includes("/auth/refresh-token")) {
			return config;
		}

		const session = await getSession();
		if (session?.accessToken) {
			config.headers.Authorization = `Bearer ${session.accessToken}`;
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

// Response interceptor
authenticatedInstance.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// Skip refresh logic for auth endpoints and non-401 errors
		if (
			originalRequest.url?.includes("/auth/") ||
			error.response?.status !== 401 ||
			originalRequest._retry
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		if (!isRefreshing) {
			isRefreshing = true;

			try {
				const newToken = await refreshAccessToken();

				// Retry all queued requests with new token
				refreshSubscribers.forEach((cb) => cb(newToken));
				refreshSubscribers = [];

				// Update original request with new token
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return authenticatedInstance(originalRequest);
			} catch (refreshError) {
				// Clear session and redirect on refresh failure
				if (typeof window !== "undefined") {
					await signOut({ redirect: false });
					window.location.href = "/login?error=session_expired";
				}
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// If already refreshing, add to queue
		return new Promise((resolve, reject) => {
			refreshSubscribers.push((token: string) => {
				originalRequest.headers.Authorization = `Bearer ${token}`;
				resolve(authenticatedInstance(originalRequest));
			});
		});
	}
);

// Session update function
async function updateSession(newTokens: {
	accessToken: string;
	refreshToken?: string;
}) {
	try {
		const response = await fetch("/api/auth/session", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newTokens),
		});

		if (!response.ok) {
			throw new Error("Session update failed");
		}
	} catch (error) {
		console.error("Session update error:", error);
		throw error;
	}
}

export { authenticatedInstance, unauthenticatedInstance };
