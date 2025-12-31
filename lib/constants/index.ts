// Storage Keys
export const STORAGE_KEY = "qaza_pro_data_v2";

// Namaz Types Configuration
export const NAMAZ_TYPES = [
  { id: "fajr", name: "Fajr", rakat: 2, sunnah: "2 Sunnah" },
  { id: "dhuhr", name: "Dhuhr", rakat: 4, sunnah: "4+2 Sunnah" },
  { id: "asr", name: "Asr", rakat: 4, sunnah: "4 Sunnah" },
  { id: "maghrib", name: "Maghrib", rakat: 3, sunnah: "2 Sunnah" },
  { id: "isha", name: "Isha", rakat: 4, sunnah: "4 Farz" },
  { id: "witr", name: "Witr", rakat: 3, sunnah: "3 Wajib" },
] as const;

// Currency Options
export const CURRENCIES = {
  INR: { symbol: "₹", slabs: [500, 1000, 1500] },
  USD: { symbol: "$", slabs: [6.99, 13.99, 20.99] },
} as const;

// Subscription Pricing
export const SUBSCRIPTION_PRICES = {
  INR: 599,
  USD: 6.99,
};
export const SUBSCRIPTION_DURATION_DAYS = 30;

// Trial Configuration
export const TRIAL_DAYS_LIMIT = 30;
export const DEFAULT_QAZA_YEARS = 15;

// Tracking Modes
export const TRACKING_MODES = {
  DAILY: "CHECKLIST",
  RAKAT: "CALCULATOR",
} as const;

// Prayer Types
export const PRAYER_TYPES = {
  ADA: "ada",
  QAZA: "qaza",
} as const;
