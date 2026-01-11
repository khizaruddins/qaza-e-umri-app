"use client";

import { useState } from "react";
import { X, Plus, Minus, Loader2 } from "lucide-react";
import type { NamazId } from "@/lib/types";
import { NAMAZ_TYPES } from "@/lib/constants";

interface RakatInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayer: NamazId;
  mode: "add" | "remove";
  onSubmit: (prayer: NamazId, rakats: number) => Promise<void> | void;
}

export function RakatInputModal({
  isOpen,
  onClose,
  prayer,
  mode,
  onSubmit,
}: RakatInputModalProps) {
  const [rakats, setRakats] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const prayerInfo = NAMAZ_TYPES.find((n) => n.id === prayer);
  const maxRakats = prayerInfo?.rakat || 4;

  const handleSubmit = async () => {
    if (rakats > 0) {
      setLoading(true);
      try {
        await onSubmit(prayer, rakats);
        setRakats(0);
        onClose();
      } catch (error) {
        console.error("Failed to submit:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const increment = () => {
    setRakats((prev) => prev + 1);
  };

  const decrement = () => {
    setRakats((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-white font-black text-lg">
              {mode === "add" ? "Add" : "Remove"} Rakats
            </h3>
            <p className="text-slate-500 text-sm font-bold">
              {prayerInfo?.name} ({maxRakats} Rakats)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Rakat Counter */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={decrement}
              disabled={rakats === 0}
              className="w-14 h-14 bg-slate-800 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Minus size={24} />
            </button>

            <div className="text-center">
              <div className="text-5xl font-black text-white">{rakats}</div>
              <p className="text-slate-500 text-xs font-bold mt-2">Rakats</p>
            </div>

            <button
              onClick={increment}
              className="w-14 h-14 bg-emerald-600 rounded-2xl text-white hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Quick Select Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[maxRakats, maxRakats * 2, maxRakats * 5].map((count) => (
              <button
                key={count}
                onClick={() => setRakats(count)}
                className="py-2 px-3 bg-slate-800 rounded-xl text-white text-sm font-bold hover:bg-slate-700 transition-colors"
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-slate-800 space-y-3">
          <button
            onClick={handleSubmit}
            disabled={rakats === 0 || loading}
            className={`w-full p-4 rounded-2xl font-black text-sm uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              mode === "add"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>
                {mode === "add" ? "Add" : "Remove"} {rakats} Rakats
              </span>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full p-4 bg-slate-800 rounded-2xl text-slate-400 font-bold text-sm hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
