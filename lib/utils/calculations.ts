import type { RakatStats, User } from "../types";
import { NAMAZ_TYPES } from "../constants";

/**
 * Calculate total remaining qaza prayers
 * @param rakatStats Rakat statistics
 * @returns Total count
 */
export const getTotalRemainingCount = (rakatStats: RakatStats): number => {
  if (!rakatStats) return 0;
  // Ensure we only sum numbers, filtering out any non-numeric values like IDs or dates
  return Object.values(rakatStats)
    .filter((val): val is number => typeof val === "number")
    .reduce((sum, count) => sum + count, 0);
};

/**
 * Calculate progress percentage
 * @param rakatStats Current rakat stats
 * @param initialDebt Initial total debt
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (
  rakatStats: RakatStats,
  initialDebt: number
): number => {
  if (initialDebt === 0) return 0;

  const current = getTotalRemainingCount(rakatStats);
  const cleared = initialDebt - current;

  return Math.max(0, Math.min(100, (cleared / initialDebt) * 100));
};

/**
 * Calculate total rakats for a specific prayer
 * @param prayerId Prayer ID
 * @param count Number of prayers
 * @returns Total rakats
 */
export const calculateTotalRakats = (
  prayerId: string,
  count: number
): number => {
  const prayer = NAMAZ_TYPES.find((p) => p.id === prayerId);
  return prayer ? prayer.rakat * count : 0;
};

/**
 * Calculate initial debt based on years
 * @param years Number of years
 * @param isPremium Whether user is premium
 * @returns Object with days and total debt count
 */
export const calculateInitialDebt = (
  years: number,
  isPremium: boolean
): { days: number; totalDebt: number } => {
  let days = Math.floor(years * 365);

  // Trial users limited to 30 days
  if (!isPremium && days > 30) {
    days = 30;
  }

  const totalDebt = days * NAMAZ_TYPES.length;

  return { days, totalDebt };
};
