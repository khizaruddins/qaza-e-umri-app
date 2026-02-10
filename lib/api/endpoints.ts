import apiClient from "./client";
import type {
  User,
  AuthCredentials,
  OnboardingData,
  AuthResponse,
  PrayerDebt,
  ApiDailyLog,
  StatsSummary,
  NamazId,
  TrackingMode,
  Notification,
} from "@/lib/types";

// Auth APIs
export const authAPI = {
  signup: (credentials: AuthCredentials) =>
    apiClient.post<any, AuthResponse>("/auth/signup", credentials),

  login: (credentials: Omit<AuthCredentials, "name">) =>
    apiClient.post<any, AuthResponse>("/auth/login", credentials),

  refresh: (refreshToken: string) =>
    apiClient.post<any, AuthResponse>("/auth/refresh", { refreshToken }),

  getMe: () => apiClient.get<any, User>("/auth/me"),

  logout: () => apiClient.post<any, void>("/auth/logout", {}),
};

// User APIs
export const userAPI = {
  updateProfile: (data: Partial<User>) =>
    apiClient.patch<any, User>("/users/profile", data),

  updateSettings: (data: {
    trackingMode?: TrackingMode;
    qazaGoalYears?: number;
  }) => apiClient.patch<any, User>("/users/settings", data),

  completeOnboarding: (data: OnboardingData) =>
    apiClient.post<any, User>("/users/onboarding", data),

  getSubscriptionStatus: () =>
    apiClient.get<any, { isPremium: boolean; subscriptionStatus: string }>(
      "/users/subscription-status",
    ),
};

// Qaza (Debt) APIs
export const qazaAPI = {
  getDebt: () => apiClient.get<any, PrayerDebt>("/qaza"),

  calculateDebt: (data: { years: number; calculationMethod: string }) =>
    apiClient.post<any, PrayerDebt>("/qaza/calculate", data),

  adjustDebt: (data: {
    prayer: NamazId;
    amount: number;
    operation: "add" | "subtract";
  }) => apiClient.patch<any, PrayerDebt>("/qaza/adjust", data),

  resetDebt: (data?: Partial<PrayerDebt>) =>
    apiClient.post<any, PrayerDebt>("/qaza/reset", data),
};

// Payment APIs
export const paymentAPI = {
  // Subscription
  createSubscription: (data: {
    planType: "MONTHLY" | "YEARLY";
    currency: "INR";
  }) =>
    apiClient.post<
      any,
      {
        id: string;
        razorpaySubscriptionId: string;
        gateway: string;
        status: string;
        amount: number;
      }
    >("/payment/razorpay/subscription", data),

  verifySubscription: (data: {
    razorpayPaymentId: string;
    razorpaySubscriptionId: string;
    razorpaySignature: string;
  }) =>
    apiClient.post<any, { success: boolean; user: User }>(
      "/payment/razorpay/subscription/verify",
      data,
    ),

  // Tips / Hadiya
  createTip: (data: { amount: number; currency: string; message?: string }) =>
    apiClient.post<
      any,
      { id: string; razorpayOrderId: string; amount: number; status: string }
    >("/payment/razorpay/tip", data),

  verifyTip: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    apiClient.post<any, { success: boolean }>(
      "/payment/razorpay/tip/verify",
      data,
    ),
};

// Daily Log APIs
export const dailyLogAPI = {
  getLogs: (startDate: string, endDate: string) =>
    apiClient.get<any, ApiDailyLog[]>("/daily-logs", {
      params: { startDate, endDate },
    }),

  getLogByDate: (date: string) =>
    apiClient.get<any, ApiDailyLog>(`/daily-logs/${date}`),

  togglePrayer: (
    date: string,
    data: { type: "ada" | "qaza"; prayer: NamazId; status: boolean },
  ) => apiClient.patch<any, ApiDailyLog>(`/daily-logs/${date}`, data),

  batchUpdatePrayers: (
    date: string,
    data: {
      prayers: Array<{
        type: "ada" | "qaza";
        prayer: NamazId;
        status: boolean;
      }>;
    },
  ) => apiClient.patch<any, ApiDailyLog>(`/daily-logs/${date}/batch`, data),

  getUncheckedLogs: () =>
    apiClient.get<any, ApiDailyLog[]>("/daily-logs/unchecked/all"),

  getDateWiseLogs: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<any, ApiDailyLog[]>("/daily-logs/date-wise/all", { params }),
};

// Statistics APIs
export const statsAPI = {
  getSummary: () => apiClient.get<any, StatsSummary>("/stats/summary"),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => apiClient.get<any, Notification[]>("/notifications"),
  markAsRead: (id: string) =>
    apiClient.patch<any, void>(`/notifications/${id}/read`),
};
