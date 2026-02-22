import apiClient from './client';
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
} from '@/lib/types';

// Auth APIs
export const authAPI = {
  signup: (credentials: AuthCredentials) =>
    apiClient.post<AuthCredentials, AuthResponse>('/auth/signup', credentials),

  login: (credentials: Omit<AuthCredentials, 'name'>) =>
    apiClient.post<Omit<AuthCredentials, 'name'>, AuthResponse>(
      '/auth/login',
      credentials,
    ),

  refresh: (refreshToken: string) =>
    apiClient.post<{ refreshToken: string }, AuthResponse>('/auth/refresh', {
      refreshToken,
    }),

  getMe: () => apiClient.get<void, User>('/auth/me'),

  logout: () => apiClient.post<Record<string, never>, void>('/auth/logout', {}),
};

// User APIs
export const userAPI = {
  updateProfile: (data: Partial<User>) =>
    apiClient.patch<Partial<User>, User>('/users/profile', data),

  updateSettings: (data: {
    trackingMode?: TrackingMode;
    qazaGoalYears?: number;
  }) =>
    apiClient.patch<
      { trackingMode?: TrackingMode; qazaGoalYears?: number },
      User
    >('/users/settings', data),

  completeOnboarding: (data: OnboardingData) =>
    apiClient.post<OnboardingData, User>('/users/onboarding', data),

  getSubscriptionStatus: () =>
    apiClient.get<void, { isPremium: boolean; subscriptionStatus: string }>(
      '/users/subscription-status',
    ),
};

// Qaza (Debt) APIs
export const qazaAPI = {
  getDebt: () => apiClient.get<void, PrayerDebt>('/qaza'),

  calculateDebt: (data: { years: number; calculationMethod: string }) =>
    apiClient.post<{ years: number; calculationMethod: string }, PrayerDebt>(
      '/qaza/calculate',
      data,
    ),

  adjustDebt: (data: {
    prayer: NamazId;
    amount: number;
    operation: 'add' | 'subtract';
  }) =>
    apiClient.patch<
      { prayer: NamazId; amount: number; operation: 'add' | 'subtract' },
      PrayerDebt
    >('/qaza/adjust', data),

  resetDebt: (data?: Partial<PrayerDebt>) =>
    apiClient.post<Partial<PrayerDebt> | undefined, PrayerDebt>(
      '/qaza/reset',
      data,
    ),
};

// Payment APIs
export const paymentAPI = {
  createSubscription: (data: { amount: number; currency: string }) =>
    apiClient.post<
      { amount: number; currency: string },
      { subscriptionId: string }
    >('/payment/subscription', data),

  submitProof: (data: { transactionId: string; subscriptionId?: string }) =>
    apiClient.post<
      { transactionId: string; subscriptionId?: string },
      { success: boolean }
    >('/payment/submit-proof', data),

  approve: (data: { transactionId: string; amount: number; type: string }) =>
    apiClient.post<
      { transactionId: string; amount: number; type: string },
      { success: boolean; user: User }
    >('/payment/approve', data),
};

// Daily Log APIs
export const dailyLogAPI = {
  getLogs: (startDate: string, endDate: string) =>
    apiClient.get<{ startDate: string; endDate: string }, ApiDailyLog[]>(
      '/daily-logs',
      {
        params: { startDate, endDate },
      },
    ),

  getLogByDate: (date: string) =>
    apiClient.get<void, ApiDailyLog>(`/daily-logs/${date}`),

  togglePrayer: (
    date: string,
    data: { type: 'ada' | 'qaza'; prayer: NamazId; status: boolean },
  ) =>
    apiClient.patch<
      { type: 'ada' | 'qaza'; prayer: NamazId; status: boolean },
      ApiDailyLog
    >(`/daily-logs/${date}`, data),

  batchUpdatePrayers: (
    date: string,
    data: {
      prayers: Array<{
        type: 'ada' | 'qaza';
        prayer: NamazId;
        status: boolean;
      }>;
    },
  ) =>
    apiClient.patch<
      {
        prayers: Array<{
          type: 'ada' | 'qaza';
          prayer: NamazId;
          status: boolean;
        }>;
      },
      ApiDailyLog
    >(`/daily-logs/${date}/batch`, data),

  getUncheckedLogs: () =>
    apiClient.get<void, ApiDailyLog[]>('/daily-logs/unchecked/all'),

  getDateWiseLogs: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<
      { startDate?: string; endDate?: string } | undefined,
      ApiDailyLog[]
    >('/daily-logs/date-wise/all', { params }),
};

// Statistics APIs
export const statsAPI = {
  getSummary: () => apiClient.get<void, StatsSummary>('/stats/summary'),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => apiClient.get<void, Notification[]>('/notifications'),
  markAsRead: (id: string) =>
    apiClient.patch<Record<string, never>, void>(`/notifications/${id}/read`),
};
