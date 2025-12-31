import axios from "axios";
import { STORAGE_KEY } from "@/lib/constants";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for Cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // No need to manually attach token if using HTTP-only cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token Expired)
    // Don't retry if we are already on the auth endpoints (login/signup)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/signup")
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        // We use axios directly to avoid infinite loops if the interceptor is attached
        await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          // Clear local storage to remove stale user data
          localStorage.removeItem(STORAGE_KEY);

          // Only redirect if not already on the auth page to avoid loops
          if (!window.location.pathname.includes("/auth")) {
            window.location.href = "/auth";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
