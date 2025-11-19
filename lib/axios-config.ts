import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
	withCredentials: true,
});

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle 401 errors (invalid/expired token)
		if (error.response?.status === 401) {
			const message = error.response?.data?.message || "";

			// If token is invalid or expired, clear auth and redirect to login
			if (
				message.includes("Invalid token") ||
				message.includes("Token expired") ||
				message.includes("Authentication failed")
			) {
				// Clear any stored auth data
				if (typeof window !== "undefined") {
					localStorage.removeItem("token");
					localStorage.removeItem("user");

					// Redirect to login if not already there
					if (!window.location.pathname.includes("/auth")) {
						window.location.href = "/auth/login";
					}
				}
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
