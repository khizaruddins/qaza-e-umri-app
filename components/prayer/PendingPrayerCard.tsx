"use client";

import { useMemo } from "react";
import { Check, History } from "lucide-react";
import type { NamazId } from "@/lib/types";
import { NAMAZ_TYPES } from "@/lib/constants";

interface PendingPrayer {
  prayer: NamazId;
  type: "ada" | "qaza";
}

interface PendingPrayerCardProps {
  date: string;
  pendingPrayers: PendingPrayer[];
  currentSelections: Record<string, boolean>;
  onToggle: (date: string, prayer: NamazId, type: "ada" | "qaza") => void;
}

export function PendingPrayerCard({
  date,
  pendingPrayers,
  currentSelections,
  onToggle,
}: PendingPrayerCardProps) {
  // Group prayers by prayer type
  const groupedPrayers = useMemo(() => {
    const groups: Record<NamazId, { ada: boolean; qaza: boolean }> = {
      fajr: { ada: false, qaza: false },
      dhuhr: { ada: false, qaza: false },
      asr: { ada: false, qaza: false },
      maghrib: { ada: false, qaza: false },
      isha: { ada: false, qaza: false },
      witr: { ada: false, qaza: false },
    };

    pendingPrayers.forEach(({ prayer, type }) => {
      groups[prayer][type] = true;
    });

    return groups;
  }, [pendingPrayers]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return { day, month, year, dayName };
  };

  const { day, month, year, dayName } = formatDate(date);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
      {/* Date Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
        <div>
          <h3 className="text-white font-black text-lg">
            {day} {month} {year}
          </h3>
          <p className="text-slate-500 text-xs font-bold uppercase">
            {dayName}
          </p>
        </div>
        <div className="bg-amber-500/10 px-3 py-1 rounded-xl">
          <p className="text-amber-400 text-xs font-black">
            {pendingPrayers.length} Pending
          </p>
        </div>
      </div>

      {/* Prayer List */}
      <div className="p-4 space-y-3">
        {NAMAZ_TYPES.map((prayer) => {
          const hasPending =
            groupedPrayers[prayer.id as NamazId].ada ||
            groupedPrayers[prayer.id as NamazId].qaza;

          if (!hasPending) return null;

          return (
            <div
              key={prayer.id}
              className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="font-black text-base text-white">
                  {prayer.name}
                </h4>
                <p className="text-slate-500 text-xs font-bold uppercase">
                  {prayer.sunnah}
                </p>
              </div>
              <div className="flex gap-2">
                {groupedPrayers[prayer.id as NamazId].ada && (
                  <button
                    onClick={() => onToggle(date, prayer.id as NamazId, "ada")}
                    className={`flex flex-col items-center justify-center w-11 h-12 rounded-xl transition-all border cursor-pointer ${
                      currentSelections[`${date}-${prayer.id}-ada`]
                        ? "bg-blue-600 border-blue-400 text-white shadow-lg"
                        : "bg-slate-900 border-slate-600 text-slate-500"
                    }`}
                  >
                    <Check size={16} strokeWidth={3} />
                    <span className="text-[7px] font-black uppercase mt-0.5">
                      Ada
                    </span>
                  </button>
                )}
                {groupedPrayers[prayer.id as NamazId].qaza && (
                  <button
                    onClick={() => onToggle(date, prayer.id as NamazId, "qaza")}
                    className={`flex flex-col items-center justify-center w-11 h-12 rounded-xl transition-all border cursor-pointer ${
                      currentSelections[`${date}-${prayer.id}-qaza`]
                        ? "bg-emerald-600 border-emerald-400 text-white shadow-lg"
                        : "bg-slate-900 border-slate-600 text-slate-500"
                    }`}
                  >
                    <History size={16} strokeWidth={3} />
                    <span className="text-[7px] font-black uppercase mt-0.5">
                      Qaza
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
