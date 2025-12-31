import { NAMAZ_TYPES, TRACKING_MODES, CURRENCIES } from "../constants";

// Namaz Type IDs
export type NamazId = (typeof NAMAZ_TYPES)[number]["id"];

// Tracking Mode Type
export type TrackingMode = (typeof TRACKING_MODES)[keyof typeof TRACKING_MODES];

// Currency Type
export type Currency = keyof typeof CURRENCIES;

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  gender: "MALE" | "FEMALE";
  isPremium: boolean;
  trialStartDate?: string;
  qazaGoalYears: number;
  trackingMode: TrackingMode;
  initialTotalDebt: number;
  paymentDate?: string;
  nextPaymentDate?: string;
}

// Notification Interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}

// API Daily Log Entry
export interface ApiDailyLog {
  date: string;
  adaFajr: boolean;
  adaDhuhr: boolean;
  adaAsr: boolean;
  adaMaghrib: boolean;
  adaIsha: boolean;
  adaWitr: boolean;
  qazaFajr: boolean;
  qazaDhuhr: boolean;
  qazaAsr: boolean;
  qazaMaghrib: boolean;
  qazaIsha: boolean;
  qazaWitr: boolean;
}

// Frontend Daily Log Entry (keeping for compatibility if needed, or we can migrate)
export interface DailyLog {
  ada: Partial<Record<NamazId, boolean>>;
  qaza: Partial<Record<NamazId, boolean>>;
}

// Rakat Statistics / Prayer Debt
export interface PrayerDebt {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  witr: number;
}

export type RakatStats = PrayerDebt;

// App Data Structure
export interface AppData {
  user: User | null;
  dailyLogs: Record<string, DailyLog>;
  rakatStats: RakatStats;
}

// Toast Notification
export interface Toast {
  type: "success" | "info" | "error";
  message: string;
}

// Modal States
export interface DisclaimerModal {
  isOpen: boolean;
  type: "subscription" | "tip";
  amount: number;
  isRenewal?: boolean;
}

export interface PaymentModal {
  isOpen: boolean;
  amount: number;
  type: "subscription" | "tip";
}

export interface AdjustModal {
  isOpen: boolean;
  type: "clear" | "add";
  prayerId: NamazId | null;
}

export interface ConfirmModal {
  isOpen: boolean;
  val: number;
  prayerId: NamazId | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean; // Optional as per new API might not have it wrapped
  data?: T; // Some APIs return data directly
  error?: string;
  // Auth specific
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

// Onboarding Data
export interface OnboardingData {
  gender: "MALE" | "FEMALE";
  location: string;
  phone?: string;
  trackingMode?: TrackingMode;
}

// Auth Credentials
export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface StatsSummary {
  totalPrayersOfferedThisMonth: number;
  totalDebt: number;
  estimatedCompletionDate: string;
}
