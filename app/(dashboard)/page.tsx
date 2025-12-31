"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Navigation } from "@/components/layout/Navigation";
import { DashboardContent } from "@/components/pages/DashboardContent";

export default function HomePage() {
  const router = useRouter();
  const { user, checkAuth, isLoading } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 min-h-screen flex flex-col font-sans text-slate-200">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col pb-24 relative">
        <DashboardContent />
        <Navigation />
      </div>
    </div>
  );
}
