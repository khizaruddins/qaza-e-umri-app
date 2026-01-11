"use client";

import { useMemo } from "react";
import { Check, History } from "lucide-react";
import { useAppStore, useUIStore } from "@/lib/store";
import { checkDateAccess } from "@/lib/utils";
import type { NamazId } from "@/lib/types";

interface PrayerCardProps {
  prayer: {
    id: string;
    name: string;
    rakat: number;
    sunnah: string;
  };
}

export function PrayerCard({ prayer }: PrayerCardProps) {
  const user = useAppStore((state) => state.user);
  const selectedDate = useUIStore((state) => state.selectedDate);
  const setShowUpgrade = useUIStore((state) => state.setShowUpgrade);
  const getDailyLog = useAppStore((state) => state.getDailyLog);
  const addPendingChange = useUIStore((state) => state.addPendingChange);
  const allPendingChanges = useUIStore((state) => state.pendingChanges);

  // Memoize pending changes to prevent infinite loop
  const pendingChanges = useMemo(
    () => allPendingChanges[selectedDate] || [],
    [allPendingChanges, selectedDate]
  );

  const dayLog = getDailyLog(selectedDate);

  // Check if there's a pending change for this prayer
  const getPrayerStatus = (type: "ada" | "qaza") => {
    const pending = pendingChanges.find(
      (c) => c.prayer === prayer.id && c.type === type
    );
    if (pending) return pending.status;
    return dayLog[type]?.[prayer.id as NamazId] || false;
  };

  const handleToggle = (type: "ada" | "qaza") => {
    if (!checkDateAccess(user, selectedDate)) {
      setShowUpgrade(true);
      return;
    }
    const currentStatus = getPrayerStatus(type);
    addPendingChange(selectedDate, {
      type,
      prayer: prayer.id as NamazId,
      status: !currentStatus,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-black text-lg text-white">{prayer.name}</h4>
        <p className="text-slate-500 text-[10px] font-bold uppercase">
          {prayer.sunnah}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => handleToggle("ada")}
          className={`flex flex-col items-center justify-center w-12 h-14 rounded-2xl transition-all border cursor-pointer ${
            getPrayerStatus("ada")
              ? "bg-blue-600 border-blue-400 text-white shadow-lg"
              : "bg-slate-800 border-slate-700 text-slate-500"
          }`}
        >
          <Check size={18} strokeWidth={3} />
          <span className="text-[8px] font-black uppercase mt-1">Ada</span>
        </button>
        <button
          onClick={() => handleToggle("qaza")}
          className={`flex flex-col items-center justify-center w-12 h-14 rounded-2xl transition-all border cursor-pointer ${
            getPrayerStatus("qaza")
              ? "bg-emerald-600 border-emerald-400 text-white shadow-lg"
              : "bg-slate-800 border-slate-700 text-slate-500"
          }`}
        >
          <History size={18} strokeWidth={3} />
          <span className="text-[8px] font-black uppercase mt-1">Qaza</span>
        </button>
      </div>
    </div>
  );
}
