"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppStore, useUIStore } from "@/lib/store";
import { Navigation } from "@/components/layout/Navigation";
import { DashboardContent } from "@/components/pages/DashboardContent";
import { DisclaimerModal } from "@/components/modals/DisclaimerModal";
import { PaymentModal } from "@/components/modals/PaymentModal";
import { RakatInputModal } from "@/components/modals/RakatInputModal";
import type { NamazId } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const adjustModal = useUIStore((state) => state.adjustModal);
  const setAdjustModal = useUIStore((state) => state.setAdjustModal);
  const adjustRakatDebt = useAppStore((state) => state.adjustRakatDebt);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRakatSubmit = async (prayer: NamazId, rakats: number) => {
    if (!adjustModal.prayerId) return;

    setIsProcessing(true);
    try {
      const operation = adjustModal.type === "clear" ? "subtract" : "add";
      await adjustRakatDebt(prayer, rakats, operation);

      // Close modal
      setAdjustModal({ isOpen: false, type: "clear", prayerId: null });
    } catch (error) {
      console.error("Failed to adjust rakat debt:", error);
      alert("Failed to update debt. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setAdjustModal({ isOpen: false, type: "clear", prayerId: null });
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

  if (!user) {
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

      {/* Modals */}
      <DisclaimerModal />
      <PaymentModal />
      <RakatInputModal
        isOpen={adjustModal.isOpen}
        onClose={handleCloseModal}
        prayer={adjustModal.prayerId || "fajr"}
        mode={adjustModal.type === "clear" ? "remove" : "add"}
        onSubmit={handleRakatSubmit}
      />
    </div>
  );
}
