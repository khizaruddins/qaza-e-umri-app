import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI, userAPI, paymentAPI, dailyLogAPI } from './endpoints';
import type {
  AuthCredentials,
  OnboardingData,
  AuthResponse,
  User,
} from '@/lib/types';

interface CustomAuthResponse extends AuthResponse {
  token: string;
}
// Query Keys
export const queryKeys = {
  user: ['user'] as const,
  prayers: ['prayers'] as const,
  prayerLogs: (startDate: string, endDate: string) =>
    ['prayers', 'logs', startDate, endDate] as const,
};

// Auth Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: AuthCredentials) =>
      authAPI.login(credentials) as Promise<CustomAuthResponse>,
    onSuccess: () => {
      // Token is now stored as httpOnly cookie by the server
      // No need to manually save it to localStorage
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: AuthCredentials) =>
      authAPI.signup(credentials) as Promise<CustomAuthResponse>,
    onSuccess: () => {
      // Token is now stored as httpOnly cookie by the server
      // No need to manually save it to localStorage
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // Cookies are cleared by the server on logout
      // Just clear the query cache
      queryClient.clear();
    },
  });
};

// User Hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => authAPI.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => userAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OnboardingData) => userAPI.completeOnboarding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

// Payment Hooks
export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: ({ amount, currency }: { amount: number; currency: string }) =>
      paymentAPI.createSubscription({ amount, currency }),
  });
};

// Prayer Hooks
export const usePrayerLogs = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: queryKeys.prayerLogs(startDate, endDate),
    queryFn: () => dailyLogAPI.getLogs(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
