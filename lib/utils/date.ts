/**
 * Format date to pretty display format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "25 Dec 2024")
 */
export const getPrettyDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format date with ordinal suffix (e.g., "1st Jan 2026")
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const getOrdinalDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Add days to a date
 * @param date Base date
 * @param days Number of days to add
 * @returns New date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get date N days from now
 * @param days Number of days
 * @returns ISO date string
 */
export const getDaysFromNow = (days: number): string => {
  return addDays(new Date(), days).toISOString().split("T")[0];
};

/**
 * Get date N days ago
 * @param days Number of days
 * @returns ISO date string
 */
export const getDaysAgo = (days: number): string => {
  return addDays(new Date(), -days).toISOString().split("T")[0];
};

/**
 * Check if a date is in the past
 * @param dateString ISO date string
 * @returns boolean
 */
export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Check if a date is today
 * @param dateString ISO date string
 * @returns boolean
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayISO();
};

/**
 * Get number of days between two dates
 * @param startDate Start date
 * @param endDate End date
 * @returns Number of days
 */
export const daysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
