"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { PendingPrayerCard } from "@/components/prayer/PendingPrayerCard";
import { useAppStore } from "@/lib/store";
import { dailyLogAPI } from "@/lib/api/endpoints";
import type { NamazId } from "@/lib/types";

interface PendingPrayer {
  prayer: NamazId;
  type: "ada" | "qaza";
}

interface DateWisePending {
  date: string;
  prayers: PendingPrayer[];
}

interface ApiPrayerLog {
  prayer: NamazId;
  ada: boolean;
  qaza: boolean;
}

interface ApiDateLog {
  date: string;
  prayers: ApiPrayerLog[];
}

interface ApiDateWiseResponse {
  startDate: string;
  endDate: string;
  totalDays: number;
  data: ApiDateLog[];
}

export default function PendingDebtsPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const batchUpdatePrayers = useAppStore((state) => state.batchUpdatePrayers);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allLogs, setAllLogs] = useState<ApiDateLog[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Fetch all date-wise logs from joining date to yesterday
  useEffect(() => {
    const fetchPendingDebts = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const endDate = yesterday.toISOString().split("T")[0];

        const startDate = user.trialStartDate
          ? new Date(user.trialStartDate).toISOString().split("T")[0]
          : endDate;

        const logs = await dailyLogAPI.getDateWiseLogs({
          startDate,
          endDate,
        });

        // Handle both response formats
        const data =
          (logs as unknown as ApiDateWiseResponse)?.data ||
          (logs as unknown as ApiDateLog[]);
        setAllLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch pending debts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDebts();
  }, [user, refetchTrigger]);

  // Process logs to extract pending prayers per date
  const dateWisePending: DateWisePending[] = useMemo(() => {
    const pending: DateWisePending[] = [];

    // Ensure allLogs is an array
    if (!Array.isArray(allLogs)) {
      return pending;
    }

    allLogs.forEach((log) => {
      const prayers: PendingPrayer[] = [];

      // Process the new API format
      log.prayers.forEach((prayerLog) => {
        // If ada is false (not completed), add it as pending
        if (!prayerLog.ada) {
          prayers.push({
            prayer: prayerLog.prayer,
            type: "ada",
          });
        }
        // If qaza is false (not completed), add it as pending
        if (!prayerLog.qaza) {
          prayers.push({
            prayer: prayerLog.prayer,
            type: "qaza",
          });
        }
      });

      if (prayers.length > 0) {
        pending.push({ date: log.date, prayers });
      }
    });

    return pending;
  }, [allLogs]);

  // Current date's pending prayers
  const currentDatePending = dateWisePending[currentPage];

  // Handle prayer toggle
  const handleToggle = (
    date: string,
    prayer: NamazId,
    type: "ada" | "qaza"
  ) => {
    const key = `${date}-${prayer}-${type}`;
    setSelections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle save all changes for current date
  const handleSave = async () => {
    if (!currentDatePending) return;

    const date = currentDatePending.date;
    const changes: Array<{
      type: "ada" | "qaza";
      prayer: NamazId;
      status: boolean;
    }> = [];

    // Collect all selected prayers for this date
    currentDatePending.prayers.forEach(({ prayer, type }) => {
      const key = `${date}-${prayer}-${type}`;
      if (selections[key]) {
        changes.push({ type, prayer, status: true });
      }
    });

    if (changes.length === 0) return;

    setSaving(true);
    try {
      await batchUpdatePrayers(date, changes);

      // Clear selections for this date
      const newSelections = { ...selections };
      Object.keys(newSelections).forEach((key) => {
        if (key.startsWith(date)) {
          delete newSelections[key];
        }
      });
      setSelections(newSelections);

      // Remove this date from the list
      const updatedLogs = Array.isArray(allLogs)
        ? allLogs.map((log) => {
            if (log.date === date) {
              const updated = { ...log };
              // Update the prayers array with the new status
              updated.prayers = log.prayers.map((prayerLog) => {
                const change = changes.find(
                  (c) => c.prayer === prayerLog.prayer && c.type
                );
                if (change) {
                  return {
                    ...prayerLog,
                    [change.type]: change.status,
                  };
                }
                return prayerLog;
              });
              return updated;
            }
            return log;
          })
        : [];
      setAllLogs(updatedLogs);

      // Refetch data to get the latest state from server
      setTimeout(() => {
        setRefetchTrigger((prev) => prev + 1);
      }, 500);

      // Auto-navigate to next pending date ONLY if all prayers for this date are complete
      if (isCurrentDateComplete) {
        setTimeout(() => {
          if (currentPage < dateWisePending.length - 1) {
            setCurrentPage((prev) => prev + 1);
          } else if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
          }
        }, 300);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setSaving(false);
    }
  };

  // Navigation handlers
  const goToNextDate = () => {
    if (currentPage < dateWisePending.length - 1) {
      setCurrentPage((prev) => prev + 1);
      // Refetch data when navigating to next date
      setRefetchTrigger((prev) => prev + 1);
    }
  };

  const goToPrevDate = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      // Refetch data when navigating to previous date
      setRefetchTrigger((prev) => prev + 1);
    }
  };

  // Count selected prayers for current date
  const selectedCount = useMemo(() => {
    if (!currentDatePending) return 0;
    const date = currentDatePending.date;
    return Object.keys(selections).filter(
      (key) => key.startsWith(date) && selections[key]
    ).length;
  }, [selections, currentDatePending]);

  // Check if all prayers for current date are complete
  const isCurrentDateComplete = useMemo(() => {
    if (!currentDatePending) return false;

    // Get all pending prayers for this date
    const allPendingForDate = currentDatePending.prayers;

    // Check if all are selected
    return allPendingForDate.every((pending) => {
      const key = `${currentDatePending.date}-${pending.prayer}-${pending.type}`;
      return selections[key];
    });
  }, [currentDatePending, selections]);

  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="flex-1 bg-slate-950 min-h-screen flex flex-col font-sans text-slate-200">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col pb-24">
        {/* Header */}
        <header className="px-6 pt-8 pb-4">
          <h2 className="text-2xl font-black text-white">Pending Debts</h2>
          <p className="text-slate-500 text-xs font-bold uppercase mt-1">
            Clear your missed prayers
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
              <p className="text-slate-500 text-sm font-bold mt-4">
                Loading pending debts...
              </p>
            </div>
          ) : dateWisePending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-emerald-500/10 p-6 rounded-full mb-4">
                <CheckCircle2 className="text-emerald-500" size={40} />
              </div>
              <h3 className="text-white font-black text-xl mb-2">
                All Caught Up!
              </h3>
              <p className="text-slate-500 text-sm text-center">
                You have no pending prayers.
                <br />
                Keep up the great work!
              </p>
            </div>
          ) : (
            <>
              {/* Pagination Info */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <button
                  onClick={goToPrevDate}
                  disabled={currentPage === 0}
                  className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <p className="text-white font-black text-sm">
                    Date {currentPage + 1} of {dateWisePending.length}
                  </p>
                  <p className="text-slate-500 text-xs font-bold">
                    {dateWisePending.length} dates with pending prayers
                  </p>
                </div>
                <button
                  onClick={goToNextDate}
                  disabled={currentPage === dateWisePending.length - 1}
                  className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Current Date Card */}
              {currentDatePending && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <PendingPrayerCard
                    date={currentDatePending.date}
                    pendingPrayers={currentDatePending.prayers}
                    currentSelections={selections}
                    onToggle={handleToggle}
                  />

                  {/* Save Button */}
                  {selectedCount > 0 && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-5 rounded-[2rem] flex items-center justify-center gap-3 font-black text-base uppercase tracking-wide shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer animate-in slide-in-from-bottom-4 border-2 border-emerald-400/30"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={24} fill="white" />
                          <span>Clear {selectedCount} Debts</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Info Card */}
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl flex gap-3">
                <AlertCircle className="text-blue-400 shrink-0" size={20} />
                <div>
                  <p className="text-blue-300 text-xs font-bold">
                    Select prayers you&apos;ve completed and tap &apos;Clear
                    Debts&apos; to update your records. Once all prayers for a
                    date are selected, the page will automatically jump to the
                    next date with pending prayers.
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
