import { TRIAL_DAYS_LIMIT } from "../constants";
import { getTodayISO, getDaysFromNow, addDays } from "./date";
import type { User } from "../types";

/**
 * Check if a user has access to a specific date
 * @param user User object
 * @param dateStr Date to check in ISO format
 * @returns boolean indicating access
 */
export const checkDateAccess = (
  user: User | null,
  dateStr: string
): boolean => {
  if (!user) return false;

  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate 30 days from today
  const thirtyDaysFromNow = addDays(today, TRIAL_DAYS_LIMIT);

  // Check if date is within 30 days from today
  const isWithin30DaysFuture = target >= today && target <= thirtyDaysFromNow;

  // Check if subscription is active (if premium)
  const isSubscriptionActive =
    user.isPremium &&
    (!user.nextPaymentDate || new Date(user.nextPaymentDate) > new Date());

  if (isSubscriptionActive) {
    // Premium users can access any date
    return true;
  } else {
    // Trial users: ONLY today to 30 days from today
    return isWithin30DaysFuture;
  }
};

/**
 * Get the range of accessible dates for a user
 * @param user User object
 * @returns Object with minDate and maxDate in ISO format
 */
export const getAccessibleDateRange = (
  user: User | null
): { minDate: string; maxDate: string } => {
  const today = getTodayISO();
  const maxDate = getDaysFromNow(TRIAL_DAYS_LIMIT);

  if (!user) {
    return { minDate: today, maxDate };
  }

  if (user.isPremium) {
    const qazaYears = user.qazaGoalYears || 15;
    const todayDate = new Date();
    const minPremiumDate = new Date(todayDate);
    minPremiumDate.setFullYear(todayDate.getFullYear() - qazaYears);
    return {
      minDate: minPremiumDate.toISOString().split("T")[0],
      maxDate,
    };
  }

  return { minDate: today, maxDate };
};
