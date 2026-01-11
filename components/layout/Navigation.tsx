"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  CalendarIcon,
  BookOpen,
  Settings,
  Bell,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Navigation() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const notifications = useAppStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { href: "/dashboard", icon: TrendingUp, label: "Focus" },
    ...(user?.trackingMode === "CHECKLIST"
      ? [{ href: "/pending-debts", icon: Clock, label: "Debts" }]
      : []),
    ...(user?.trackingMode === "CHECKLIST"
      ? [{ href: "/calendar", icon: CalendarIcon, label: "Calendar" }]
      : []),
    { href: "/library", icon: BookOpen, label: "Hadith" },
    { href: "/notifications", icon: Bell, label: "Alerts", badge: unreadCount },
    { href: "/settings", icon: Settings, label: "Setup" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-800 h-20 rounded-3xl flex items-center justify-around px-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 transition-all relative ${
                isActive ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              <div className="relative">
                <item.icon size={22} />
                {item.badge ? (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[9px] font-black uppercase mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
