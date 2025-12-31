"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Navigation } from "@/components/layout/Navigation";
import { getPrettyDate } from "@/lib/utils";

export default function NotificationsPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const notifications = useAppStore((state) => state.notifications);
  const fetchNotifications = useAppStore((state) => state.fetchNotifications);
  const markAsRead = useAppStore((state) => state.markNotificationAsRead);
  const isLoading = useAppStore((state) => state.isLoading);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-500" />
            Notifications
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Bell className="w-12 h-12 mb-4 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-slate-900 rounded-xl p-4 border transition-all ${
                notification.isRead
                  ? "border-slate-800 opacity-75"
                  : "border-emerald-500/30 shadow-lg shadow-emerald-500/5"
              }`}
              onClick={() =>
                !notification.isRead && markAsRead(notification.id)
              }
            >
              <div className="flex gap-3">
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className={`font-medium ${
                        notification.isRead ? "text-slate-300" : "text-white"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Navigation />
    </div>
  );
}
