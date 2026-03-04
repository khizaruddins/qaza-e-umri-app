import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  DailyLog,
  RakatStats,
  NamazId,
  ApiDailyLog,
  AuthCredentials,
  OnboardingData,
  Notification,
  TrackingMode,
} from "@/lib/types";
import { STORAGE_KEY } from "@/lib/constants";
import {
  authAPI,
  userAPI,
  qazaAPI,
  dailyLogAPI,
  paymentAPI,
  notificationAPI,
} from "@/lib/api/endpoints";

interface AppState {
  // State
  user: User | null;
  dailyLogs: Record<string, DailyLog>;
  rakatStats: RakatStats;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;

  // Auth Actions
  login: (credentials: Omit<AuthCredentials, "name">) => Promise<void>;
  signup: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Data Actions
  fetchInitialData: () => Promise<void>;
  fetchDailyLogs: (startDate: string, endDate: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;

  // User Actions
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateSettings: (settings: {
    trackingMode?: TrackingMode;
    qazaGoalYears?: number;
  }) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;

  // Payment Actions
  createSubscription: (
    planType: "MONTHLY" | "YEARLY",
    currency: "INR" | "USD",
  ) => Promise<any>;
  verifySubscription: (data: {
    razorpayPaymentId: string;
    razorpaySubscriptionId: string;
    razorpaySignature: string;
  }) => Promise<void>;

  createTipOrder: (
    amount: number,
    currency: string,
    message?: string,
  ) => Promise<any>;
  verifyTipOrder: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => Promise<void>;

  checkSubscriptionStatus: () => Promise<void>;

  // Daily Logs
  toggleDailyPrayer: (
    date: string,
    prayerId: NamazId,
    type: "ada" | "qaza",
  ) => Promise<void>;
  batchUpdatePrayers: (
    date: string,
    prayers: Array<{
      type: "ada" | "qaza";
      prayer: NamazId;
      status: boolean;
    }>,
  ) => Promise<void>;
  getDailyLog: (date: string) => DailyLog;

  // Rakat Stats
  adjustRakatDebt: (
    prayerId: NamazId,
    amount: number,
    operation: "add" | "subtract",
  ) => Promise<void>;
  calculateInitialDebt: (years: number, isPremium: boolean) => Promise<void>;
  resetDebt: () => Promise<void>;

  // Utility
  resetApp: () => void;
}

const initialRakatStats: RakatStats = {
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
  witr: 0,
};

// Helper to convert ApiDailyLog to internal DailyLog
const convertApiLogToDailyLog = (apiLog: ApiDailyLog): DailyLog => {
  return {
    ada: {
      fajr: apiLog.adaFajr,
      dhuhr: apiLog.adaDhuhr,
      asr: apiLog.adaAsr,
      maghrib: apiLog.adaMaghrib,
      isha: apiLog.adaIsha,
      witr: apiLog.adaWitr,
    },
    qaza: {
      fajr: apiLog.qazaFajr,
      dhuhr: apiLog.qazaDhuhr,
      asr: apiLog.qazaAsr,
      maghrib: apiLog.qazaMaghrib,
      isha: apiLog.qazaIsha,
      witr: apiLog.qazaWitr,
    },
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      dailyLogs: {},
      rakatStats: initialRakatStats,
      notifications: [],
      isLoading: false,
      error: null,

      // Auth Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);

          // Save tokens to localStorage
          if (response.accessToken) {
            localStorage.setItem("access_token", response.accessToken);
          }
          if (response.refreshToken) {
            localStorage.setItem("refresh_token", response.refreshToken);
          }

          // Fetch fresh user details including tracking mode from server
          await get().checkAuth();
        } catch (error: any) {
          set({ error: error.message || "Login failed", isLoading: false });
          throw error;
        }
      },

      signup: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.signup(credentials);
          console.log("Signup response:", response);

          // Save tokens to localStorage
          if (response.accessToken) {
            localStorage.setItem("access_token", response.accessToken);
          }
          if (response.refreshToken) {
            localStorage.setItem("refresh_token", response.refreshToken);
          }

          set({ user: response.user, isLoading: false });
          await get().fetchInitialData();
        } catch (error: any) {
          set({ error: error.message || "Signup failed", isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Clear tokens from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }

        // Call API to clear server-side session
        try {
          authAPI.logout();
        } catch (error) {
          console.error("Failed to logout on server", error);
        }

        set({ user: null, dailyLogs: {}, rakatStats: initialRakatStats });

        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
      },

      checkAuth: async () => {
        // Only check auth if we have a token
        const hasToken =
          typeof window !== "undefined" && localStorage.getItem("access_token");

        if (!hasToken) {
          set({ user: null, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authAPI.getMe();
          set({ user, isLoading: false });
          await get().fetchInitialData();
        } catch (error) {
          console.error("Failed to check auth", error);
          set({ user: null, isLoading: false });

          // Clear invalid tokens
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        }
      },

      // Data Actions
      fetchInitialData: async () => {
        set({ isLoading: true });
        try {
          const [debt] = await Promise.all([
            qazaAPI.getDebt(),
            get().checkSubscriptionStatus(),
            get().fetchNotifications(),
          ]);
          set({ rakatStats: debt, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch data",
            isLoading: false,
          });
        }
      },

      fetchNotifications: async () => {
        try {
          const notifications = await notificationAPI.getAll();
          set({ notifications });
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        }
      },

      markNotificationAsRead: async (id) => {
        try {
          await notificationAPI.markAsRead(id);
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n,
            ),
          }));
        } catch (error) {
          console.error("Failed to mark notification as read", error);
        }
      },

      fetchDailyLogs: async (startDate, endDate) => {
        try {
          const logs = await dailyLogAPI.getLogs(startDate, endDate);
          const logsMap: Record<string, DailyLog> = {};
          logs.forEach((log) => {
            logsMap[log.date] = convertApiLogToDailyLog(log);
          });
          set((state) => ({
            dailyLogs: { ...state.dailyLogs, ...logsMap },
          }));
        } catch (error) {
          console.error("Failed to fetch logs", error);
        }
      },

      // User Actions
      updateUser: async (updates) => {
        try {
          const updatedUser = await userAPI.updateProfile(updates);
          set({ user: updatedUser });
        } catch (error) {
          console.error("Failed to update profile", error);
          throw error;
        }
      },

      updateSettings: async (settings) => {
        try {
          const updatedUser = await userAPI.updateSettings(settings);
          set({ user: updatedUser });
          // Refresh data based on new settings (e.g. if tracking mode changes)
          await get().checkAuth();
        } catch (error) {
          console.error("Failed to update settings", error);
          throw error;
        }
      },

      completeOnboarding: async (data) => {
        try {
          const updatedUser = await userAPI.completeOnboarding(data);
          set({ user: updatedUser });
        } catch (error) {
          console.error("Failed to complete onboarding", error);
          throw error;
        }
      },

      createSubscription: async (planType, currency) => {
        set({ isLoading: true, error: null });
        try {
          const response = await paymentAPI.createSubscription({
            planType,
            currency,
          });
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            error: error.message || "Failed to create subscription",
            isLoading: false,
          });
          throw error;
        }
      },

      verifySubscription: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await paymentAPI.verifySubscription(data);
          if (response.success && response.user) {
            set({ user: response.user, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to verify subscription",
            isLoading: false,
          });
          throw error;
        }
      },

      createTipOrder: async (amount, currency, message) => {
        set({ isLoading: true, error: null });
        try {
          const response = await paymentAPI.createTip({
            amount,
            currency,
            message,
          });
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            error: error.message || "Failed to create tip order",
            isLoading: false,
          });
          throw error;
        }
      },

      verifyTipOrder: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await paymentAPI.verifyTip(data);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to verify tip",
            isLoading: false,
          });
          throw error;
        }
      },

      checkSubscriptionStatus: async () => {
        try {
          const status = await userAPI.getSubscriptionStatus();
          if (status.isPremium) {
            // Update user state if premium status changed
            const currentUser = get().user;
            if (currentUser && !currentUser.isPremium) {
              set({ user: { ...currentUser, isPremium: true } });
            }
          }
        } catch (error) {
          console.error("Failed to check subscription status", error);
        }
      },

      // Daily Prayer Actions
      toggleDailyPrayer: async (date, prayerId, type) => {
        const state = get();
        const dayLog = state.dailyLogs[date] || { ada: {}, qaza: {} };
        const currentVal = !!dayLog[type]?.[prayerId];
        const newVal = !currentVal;

        // Optimistic Update
        const updatedLog: DailyLog = {
          ...dayLog,
          [type]: { ...dayLog[type], [prayerId]: newVal },
        };

        const newRakatStats = { ...state.rakatStats };
        if (type === "qaza") {
          const change = newVal ? -1 : 1;
          newRakatStats[prayerId] = Math.max(
            0,
            (state.rakatStats[prayerId] || 0) + change,
          );
        }

        set({
          dailyLogs: { ...state.dailyLogs, [date]: updatedLog },
          rakatStats: newRakatStats,
        });

        try {
          await dailyLogAPI.togglePrayer(date, {
            type,
            prayer: prayerId,
            status: newVal,
          });
        } catch (error) {
          // Revert on failure
          console.error("Failed to toggle prayer", error);
          set({
            dailyLogs: { ...state.dailyLogs, [date]: dayLog },
            rakatStats: state.rakatStats,
          });
        }
      },

      batchUpdatePrayers: async (date, prayers) => {
        const state = get();
        const dayLog = state.dailyLogs[date] || { ada: {}, qaza: {} };
        const originalLog = { ...dayLog };
        const originalStats = { ...state.rakatStats };

        // Optimistic Update
        const updatedLog: DailyLog = {
          ada: { ...dayLog.ada },
          qaza: { ...dayLog.qaza },
        };
        const newRakatStats = { ...state.rakatStats };

        prayers.forEach(({ type, prayer, status }) => {
          updatedLog[type] = { ...updatedLog[type], [prayer]: status };

          // Update rakat stats for qaza prayers
          if (type === "qaza") {
            const oldVal = dayLog.qaza?.[prayer] || false;
            if (status !== oldVal) {
              const change = status ? -1 : 1;
              newRakatStats[prayer] = Math.max(
                0,
                (newRakatStats[prayer] || 0) + change,
              );
            }
          }
        });

        set({
          dailyLogs: { ...state.dailyLogs, [date]: updatedLog },
          rakatStats: newRakatStats,
        });

        try {
          await dailyLogAPI.batchUpdatePrayers(date, { prayers });
        } catch (error) {
          // Revert on failure
          console.error("Failed to batch update prayers", error);
          set({
            dailyLogs: { ...state.dailyLogs, [date]: originalLog },
            rakatStats: originalStats,
          });
          throw error;
        }
      },

      getDailyLog: (date) => {
        const state = get();
        return state.dailyLogs[date] || { ada: {}, qaza: {} };
      },

      // Rakat Stats Actions
      adjustRakatDebt: async (prayerId, amount, operation) => {
        const state = get();
        const currentVal = state.rakatStats[prayerId] || 0;
        const newVal =
          operation === "add"
            ? currentVal + amount
            : Math.max(0, currentVal - amount);

        // Optimistic update
        set({
          rakatStats: { ...state.rakatStats, [prayerId]: newVal },
        });

        try {
          await qazaAPI.adjustDebt({ prayer: prayerId, amount, operation });
        } catch (error) {
          // Revert
          set({ rakatStats: state.rakatStats });
          console.error("Failed to adjust debt", error);
        }
      },

      calculateInitialDebt: async (years, isPremium) => {
        try {
          const debt = await qazaAPI.calculateDebt({
            years,
            calculationMethod: "standard",
          });
          set({ rakatStats: debt });
          // Also update user locally if needed, but API should handle it
          const user = await authAPI.getMe();
          set({ user });
        } catch (error) {
          console.error("Failed to calculate debt", error);
          throw error;
        }
      },

      resetDebt: async () => {
        try {
          const debt = await qazaAPI.resetDebt();
          set({ rakatStats: debt });
        } catch (error) {
          console.error("Failed to reset debt", error);
        }
      },

      // Utility
      resetApp: () => {
        // Clear all tokens
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("auth_token");
        }

        set({
          user: null,
          dailyLogs: {},
          rakatStats: initialRakatStats,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        // Only persist user and maybe stats for offline viewing
        user: state.user,
        rakatStats: state.rakatStats,
      }),
    },
  ),
);
