"use client";

import { useEffect } from "react";
import { CheckCircle, Info, X } from "lucide-react";
import { useUIStore } from "@/lib/store";

export function Toast() {
  const { toast, setToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-sm animate-in fade-in slide-in-from-bottom-4">
      <div
        className={`flex items-center justify-between p-4 rounded-2xl border shadow-2xl ${
          toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30"
            : "bg-indigo-500/10 border-indigo-500/30"
        }`}
      >
        <div className="flex items-center gap-3">
          {toast.type === "success" ? (
            <CheckCircle className="text-emerald-500" size={18} />
          ) : (
            <Info className="text-indigo-500" size={18} />
          )}
          <p className="text-white text-[11px] font-bold tracking-tight">
            {toast.message}
          </p>
        </div>
        <button onClick={() => setToast(null)} className="text-slate-500">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
