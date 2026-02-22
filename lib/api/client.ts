import axios from 'axios';
import { STORAGE_KEY } from '@/lib/constants';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for httpOnly cookies - automatically includes cookies in requests
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // With httpOnly cookies, the browser automatically includes them in requests
    // No need to manually attach tokens
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token Expired)
    // Don't retry if we are already on the auth endpoints (login/signup/refresh)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/signup') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token via refresh endpoint
        // The refresh token is stored in httpOnly cookie and sent automatically
        await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          },
        );

        // Tokens are now stored as httpOnly cookies by the server
        // No need to manually save them

        // Retry the original request with new token (in cookie)
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear app state and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);

          // Only redirect if not already on the auth page to avoid loops
          if (!window.location.pathname.includes('/auth')) {
            window.location.href = '/auth';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
