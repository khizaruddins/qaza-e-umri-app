"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import { useAppStore, useUIStore } from "@/lib/store";
import { calculateTotalRakats } from "@/lib/utils";
import type { NamazId } from "@/lib/types";

interface RakatCardProps {
  prayer: {
    id: string;
    name: string;
    rakat: number;
    sunnah: string;
  };
}

export function RakatCard({ prayer }: RakatCardProps) {
  const rakatStats = useAppStore((state) => state.rakatStats);
  const setAdjustModal = useUIStore((state) => state.setAdjustModal);

  const debtCount = rakatStats[prayer.id as NamazId] || 0;
  const totalRakats = calculateTotalRakats(prayer.id, debtCount);

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2.5rem] flex flex-col gap-4">
      <div className="flex justify-between items-start px-2">
        <div>
          <h4 className="font-black text-white text-lg leading-none">
            {prayer.name}
          </h4>
          <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">
            Debt: {debtCount} Qaza
          </p>
        </div>
        <div className="text-right">
          <p className="text-emerald-500 font-black text-lg">
            {totalRakats}{" "}
            <span className="text-[10px] uppercase opacity-50">Rakats</span>
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() =>
            setAdjustModal({
              isOpen: true,
              type: "clear",
              prayerId: prayer.id as NamazId,
            })
          }
          className="flex-1 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-500 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <CheckCircle size={16} />
          <span className="text-[10px] font-black uppercase">Clear Debts</span>
        </button>
        <button
          onClick={() =>
            setAdjustModal({
              isOpen: true,
              type: "add",
              prayerId: prayer.id as NamazId,
            })
          }
          className="flex-1 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-500 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <AlertCircle size={16} />
          <span className="text-[10px] font-black uppercase">Add Debts</span>
        </button>
      </div>
    </div>
  );
}
