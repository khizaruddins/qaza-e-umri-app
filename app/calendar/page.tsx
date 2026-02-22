"use client";

import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { useAppStore, useUIStore } from "@/lib/store";
import { checkDateAccess } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const {
    currentCalendarMonth,
    setCurrentCalendarMonth,
    selectedDate,
    setSelectedDate,
  } = useUIStore();

  const handlePrevMonth = () => {
    const newDate = new Date(currentCalendarMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentCalendarMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentCalendarMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentCalendarMonth(newDate);
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    router.push("/dashboard");
  };

  const daysInMonth = new Date(
    currentCalendarMonth.getFullYear(),
    currentCalendarMonth.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentCalendarMonth.getFullYear(),
    currentCalendarMonth.getMonth(),
    1,
  ).getDay();

  return (
    <div className="flex-1 bg-slate-950 min-h-screen flex flex-col font-sans text-slate-200">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col pb-24 relative">
        <main className="flex-1 px-6 pt-8 overflow-y-auto space-y-6 animate-in fade-in pb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-white">Calendar</h2>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 text-slate-500 hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[10px] font-black uppercase text-white min-w-[80px] text-center">
                {currentCalendarMonth.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1.5 text-slate-500 hover:text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-xl">
            <div className="grid grid-cols-7 gap-2 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-[9px] font-black text-slate-600 uppercase mb-2"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${currentCalendarMonth.getFullYear()}-${String(
                  currentCalendarMonth.getMonth() + 1,
                ).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const hasAccess = checkDateAccess(user, dateStr);

                return (
                  <button
                    key={dateStr}
                    disabled={!hasAccess}
                    onClick={() => handleDateClick(dateStr)}
                    className={`aspect-square rounded-2xl text-[11px] font-black flex items-center cursor-pointer justify-center relative transition-all ${
                      selectedDate === dateStr
                        ? "bg-emerald-600 text-white"
                        : "hover:bg-slate-800 text-slate-400"
                    } ${!hasAccess ? "opacity-20 cursor-not-allowed" : ""}`}
                  >
                    {dayNum}
                    {!hasAccess && (
                      <Lock size={8} className="absolute bottom-1 opacity-60" />
                    )}
                  </button>
                );
              })}
            </div>

            {!user?.isPremium && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                  Calendar enables dates from{" "}
                  <span className="text-emerald-500 font-black">Today</span>{" "}
                  till{" "}
                  <span className="text-emerald-500 font-black">
                    30 Days after
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        </main>

        <Navigation />
      </div>
    </div>
  );
}
