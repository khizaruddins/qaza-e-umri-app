"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAppStore, useUIStore } from "@/lib/store";
import { NAMAZ_TYPES, SUBSCRIPTION_PRICES } from "@/lib/constants";
import { PrayerCard } from "../prayer/PrayerCard";
import { RakatCard } from "../prayer/RakatCard";
import {
  calculateProgress,
  getTotalRemainingCount,
  getOrdinalDate,
  checkDateAccess,
} from "@/lib/utils";
import { useHijriDate } from "@/lib/hooks/useHijriDate";

export function DashboardContent() {
  const user = useAppStore((state) => state.user);
  const rakatStats = useAppStore((state) => state.rakatStats);
  const dailyLogs = useAppStore((state) => state.dailyLogs);
  const selectedDate = useUIStore((state) => state.selectedDate);
  const hijriDate = useHijriDate(selectedDate);
  const setSelectedDate = useUIStore((state) => state.setSelectedDate);
  const setDisclaimerModal = useUIStore((state) => state.setDisclaimerModal);
  const setPaymentModal = useUIStore((state) => state.setPaymentModal);
  const fetchDailyLogs = useAppStore((state) => state.fetchDailyLogs);
  const createSubscription = useAppStore((state) => state.createSubscription);
  const batchUpdatePrayers = useAppStore((state) => state.batchUpdatePrayers);
  const isLoading = useAppStore((state) => state.isLoading);
  const tipCurrency = useUIStore((state) => state.tipCurrency);
  const allPendingChanges = useUIStore((state) => state.pendingChanges);
  const clearPendingChanges = useUIStore((state) => state.clearPendingChanges);
  const hasPendingChanges = useUIStore((state) => state.hasPendingChanges);

  // Memoize pending changes to prevent infinite loop
  const pendingChanges = useMemo(
    () => allPendingChanges[selectedDate] || [],
    [allPendingChanges, selectedDate],
  );

  const [isSaving, setIsSaving] = useState(false);

  // Fetch logs when date changes
  useEffect(() => {
    if (selectedDate) {
      // Fetch for the specific date (or could be month)
      fetchDailyLogs(selectedDate, selectedDate);
    }
  }, [selectedDate, fetchDailyLogs]);

  const progressPercent = calculateProgress(
    rakatStats,
    user?.initialTotalDebt || 0,
  );
  const totalRemainingCount = getTotalRemainingCount(rakatStats);

  // Calculate Daily Stats
  const dailyLog = dailyLogs[selectedDate] || { ada: {}, qaza: {} };
  const adaCount = Object.values(dailyLog.ada || {}).filter(Boolean).length;
  const qazaCount = Object.values(dailyLog.qaza || {}).filter(Boolean).length;

  const isSubscriptionActive =
    user?.isPremium &&
    (!user?.nextPaymentDate || new Date(user.nextPaymentDate) > new Date());

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    const newDateStr = date.toISOString().split("T")[0];

    if (!checkDateAccess(user, newDateStr)) {
      // Check if user is premium but expired
      const isExpired =
        user?.isPremium &&
        user?.nextPaymentDate &&
        new Date(user.nextPaymentDate) < new Date();

      const price = SUBSCRIPTION_PRICES[tipCurrency];
      setDisclaimerModal({
        isOpen: true,
        type: "subscription",
        amount: price,
        isRenewal: !!isExpired,
      });
      return;
    }

    setSelectedDate(newDateStr);
  };

  const handleUpgrade = (isRenewal = false) => {
    const price = SUBSCRIPTION_PRICES[tipCurrency];
    setDisclaimerModal({
      isOpen: true,
      type: "subscription",
      amount: price,
      isRenewal: isRenewal,
    });
  };

  const handleSaveChanges = async () => {
    if (!hasPendingChanges(selectedDate)) return;

    setIsSaving(true);
    try {
      await batchUpdatePrayers(selectedDate, pendingChanges);
      clearPendingChanges(selectedDate);
      // Show success feedback (optional)
    } catch (error) {
      console.error("Failed to save changes", error);
      // Could show error toast here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="px-6 pt-8 pb-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-black text-white truncate">
              Salaam, {user?.name || "Brother"}
            </h2>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1">
              {user?.trackingMode === "CHECKLIST"
                ? "Day-to-Day Checklist"
                : "Rakat Calculator"}
            </p>
          </div>
        </div>

        {!user?.isPremium && (
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-4 rounded-3xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-2 rounded-xl text-white shadow-lg">
                <Zap size={16} fill="white" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-black">Free Trial</p>
                <p className="text-indigo-200/60 text-[9px] uppercase font-bold truncate">
                  Upgrade for history range
                </p>
              </div>
            </div>
            <button
              onClick={() => handleUpgrade()}
              disabled={isLoading}
              className="bg-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase ml-2 flex-shrink-0 cursor-pointer hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "..." : "Upgrade"}
            </button>
          </div>
        )}

        {user?.isPremium && !isSubscriptionActive && (
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-4 rounded-3xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-xl text-white shadow-lg">
                <Zap size={16} fill="white" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-black">
                  Membership Expired
                </p>
                <p className="text-amber-200/60 text-[9px] uppercase font-bold truncate">
                  Continue your membership
                </p>
              </div>
            </div>
            <button
              onClick={() => handleUpgrade(true)}
              disabled={isLoading}
              className="bg-amber-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase ml-2 flex-shrink-0 cursor-pointer hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "..." : "Renew"}
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 px-6 overflow-y-auto space-y-6">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Progress Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Lifetime Progress */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-900/30 p-6 rounded-[2.5rem] relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    Lifetime Progress
                  </p>
                  <h3 className="text-4xl font-black text-white">
                    {progressPercent.toFixed(1)}%
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    Remaining
                  </p>
                  <h3 className="text-xl font-black text-emerald-400">
                    {totalRemainingCount.toLocaleString()}
                  </h3>
                </div>
              </div>
              <div className="bg-slate-800/50 h-2 rounded-full mt-6 overflow-hidden backdrop-blur-sm">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mt-3">
                {(user?.initialTotalDebt || 0) > 0
                  ? `Total Debt: ${(
                      user?.initialTotalDebt || 0
                    ).toLocaleString()} Qaza`
                  : "Calculate debt to start"}
              </p>
            </div>

            {/* Daily Progress */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-blue-900/30 p-6 rounded-[2.5rem] relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      Daily Progress
                    </p>
                    <h3 className="text-2xl font-black text-white">
                      Total Namaz
                    </h3>
                  </div>
                  <div className="bg-blue-500/10 p-2 rounded-xl">
                    <Zap size={20} className="text-blue-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-3 rounded-2xl border border-blue-500/10">
                    <p className="text-slate-400 text-[9px] font-black uppercase mb-1">
                      Ada Completed
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-black text-blue-400">
                        {adaCount}
                      </span>
                      <span className="text-xs font-bold text-slate-600 mb-1">
                        / 6
                      </span>
                    </div>
                    <div className="bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-500"
                        style={{ width: `${(adaCount / 6) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded-2xl border border-blue-500/10">
                    <p className="text-slate-400 text-[9px] font-black uppercase mb-1">
                      Qaza Marked
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-black text-indigo-400">
                        {qazaCount}
                      </span>
                      <span className="text-xs font-bold text-slate-600 mb-1">
                        / 6
                      </span>
                    </div>
                    <div className="bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full transition-all duration-500"
                        style={{ width: `${(qazaCount / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prayer List Based on Tracking Mode */}
          {user?.trackingMode === "CHECKLIST" ? (
            <div className="space-y-4 pb-8">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex items-center justify-between">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <h4 className="text-white font-black">
                    {getOrdinalDate(selectedDate)}
                  </h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase">
                    {hijriDate || "Loading..."}
                  </p>
                </div>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {NAMAZ_TYPES.map((prayer) => (
                  <PrayerCard key={prayer.id} prayer={prayer} />
                ))}
              </div>

              {/* Save Button - Appears when there are pending changes */}
              {hasPendingChanges(selectedDate) && (
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-5 rounded-[2rem] flex items-center justify-center gap-3 font-black text-base uppercase tracking-wide shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer animate-in slide-in-from-bottom-4 border-2 border-emerald-400/30"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={24} fill="white" />
                      <span>Clear Namaz Debt</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 pb-8">
              <div className="space-y-3">
                {NAMAZ_TYPES.map((prayer) => (
                  <RakatCard key={prayer.id} prayer={prayer} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
