"use client";

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
  const toggleDailyPrayer = useAppStore((state) => state.toggleDailyPrayer);

  const dayLog = getDailyLog(selectedDate);

  const handleToggle = (type: "ada" | "qaza") => {
    if (!checkDateAccess(user, selectedDate)) {
      setShowUpgrade(true);
      return;
    }
    toggleDailyPrayer(selectedDate, prayer.id as NamazId, type);
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
            dayLog.ada?.[prayer.id as NamazId]
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
            dayLog.qaza?.[prayer.id as NamazId]
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
