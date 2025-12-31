"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function SplashPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        router.push("/auth");
      } else {
        router.push("/dashboard");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="relative bg-emerald-500 w-24 h-24 rounded-[2.5rem] rotate-12 flex items-center justify-center shadow-2xl">
        <Clock className="text-white w-12 h-12 -rotate-12" />
      </div>
      <h1 className="text-4xl font-black text-white mt-8 tracking-tighter">
        Qaza-e-Umri
      </h1>
      <Loader2 className="animate-spin text-slate-700 mt-12" size={24} />
    </div>
  );
}
