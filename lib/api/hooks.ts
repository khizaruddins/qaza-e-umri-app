import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI, userAPI, paymentAPI, prayerAPI } from "./endpoints";
import type { AuthCredentials, OnboardingData } from "@/lib/types";

// Query Keys
export const queryKeys = {
  user: ["user"] as const,
  prayers: ["prayers"] as const,
  prayerLogs: (startDate: string, endDate: string) =>
    ["prayers", "logs", startDate, endDate] as const,
};

// Auth Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => authAPI.login(credentials),
    onSuccess: (data: any) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => authAPI.signup(credentials),
    onSuccess: (data: any) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      queryClient.clear();
    },
  });
};

// User Hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => userAPI.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<any>) => userAPI.updateProfile(data),
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

export const useCreateTip = () => {
  return useMutation({
    mutationFn: ({ amount, currency }: { amount: number; currency: string }) =>
      paymentAPI.createTip(amount, currency),
  });
};

// Prayer Hooks
export const useSyncPrayers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dailyLogs,
      rakatStats,
    }: {
      dailyLogs: Record<string, any>;
      rakatStats: Record<string, number>;
    }) => prayerAPI.syncLogs(dailyLogs, rakatStats),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prayers });
    },
  });
};

export const usePrayerLogs = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: queryKeys.prayerLogs(startDate, endDate),
    queryFn: () => prayerAPI.getLogs(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
