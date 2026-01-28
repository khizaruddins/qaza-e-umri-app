"use client";

import {
  LogOut,
  Heart,
  Trophy,
  Clock,
  Save,
  FileText,
  Shield,
  Phone,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore, useUIStore } from "@/lib/store";
import { Navigation } from "@/components/layout/Navigation";
import { CURRENCIES, SUBSCRIPTION_PRICES } from "@/lib/constants";
import { getPrettyDate } from "@/lib/utils";
import { DisclaimerModal } from "@/components/modals/DisclaimerModal";
import { PaymentModal } from "@/components/modals/PaymentModal";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const calculateInitialDebt = useAppStore(
    (state) => state.calculateInitialDebt,
  );
  const resetApp = useAppStore((state) => state.resetApp);

  const createSubscription = useAppStore((state) => state.createSubscription);
  const setPaymentModal = useUIStore((state) => state.setPaymentModal);
  const isLoading = useAppStore((state) => state.isLoading);

  const {
    tipCurrency,
    setTipCurrency,
    selectedSlab,
    setSelectedSlab,
    setDisclaimerModal,
  } = useUIStore();

  const handleLogout = () => {
    resetApp();
    router.push("/auth");
  };

  const handleCalculateDebt = () => {
    if (user) {
      calculateInitialDebt(user.qazaGoalYears, user.isPremium);
    }
  };

  const handleUpgrade = async () => {
    const price = SUBSCRIPTION_PRICES[tipCurrency];
    try {
      await createSubscription(price, tipCurrency);
      setPaymentModal({
        isOpen: true,
        amount: price,
        type: "subscription",
      });
    } catch (error) {
      console.error("Failed to create subscription", error);
    }
  };

  const triggerPaymentDisclaimer = (
    type: "subscription" | "tip",
    amount: number,
  ) => {
    setDisclaimerModal({
      isOpen: true,
      type,
      amount,
    });
  };

  return (
    <div className="flex-1 bg-slate-950 min-h-screen flex flex-col font-sans text-slate-200">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col pb-24 relative">
        <header className="px-6 pt-8 pb-4">
          <h2 className="text-2xl font-black text-white">Setup</h2>
        </header>

        <main className="flex-1 px-6 overflow-y-auto space-y-6 animate-in fade-in pb-8">
          {/* Premium Status */}
          <div
            className={`p-6 rounded-[2.5rem] border ${
              user?.isPremium
                ? "bg-indigo-600 border-indigo-500"
                : "bg-slate-900 border-slate-800"
            } shadow-xl overflow-hidden relative`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="w-full">
                <h4 className="text-white font-black text-xl mb-4">
                  {user?.isPremium ? "Premium Member" : "Trial Plan"}
                </h4>
                {user?.isPremium ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-indigo-500/30 p-3 rounded-2xl">
                        <p className="text-[9px] font-bold uppercase text-indigo-200 mb-1">
                          Joined Premium
                        </p>
                        <p className="text-xs font-black text-white">
                          {user.paymentDate
                            ? getPrettyDate(user.paymentDate)
                            : "-"}
                        </p>
                      </div>
                      <div className="bg-indigo-500/30 p-3 rounded-2xl">
                        <p className="text-[9px] font-bold uppercase text-indigo-200 mb-1">
                          Next Renewal
                        </p>
                        <p className="text-xs font-black text-white">
                          {user.nextPaymentDate
                            ? getPrettyDate(user.nextPaymentDate)
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-indigo-500/30 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-indigo-100 leading-relaxed italic">
                        "JazakAllah Khair for your support. May Allah accept
                        your efforts and grant you barakah in your time and
                        worship."
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-1">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Limited Access
                    </p>
                  </div>
                )}
              </div>
              {!user?.isPremium && (
                <Clock size={28} className="text-slate-700 absolute right-0" />
              )}
            </div>
            {!user?.isPremium && (
              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-6 shadow-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Creating Subscription..."
                  : `Upgrade — ${CURRENCIES[tipCurrency].symbol}${SUBSCRIPTION_PRICES[tipCurrency]} Hadiya`}
              </button>
            )}
          </div>

          {/* Support Developer */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Heart size={20} className="text-red-500 fill-red-500/20" />
              <h4 className="text-white font-black uppercase text-sm tracking-widest">
                Support Developer
              </h4>
            </div>

            <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                onClick={() => setTipCurrency("INR")}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                  tipCurrency === "INR"
                    ? "bg-slate-800 text-white"
                    : "text-slate-600"
                }`}
              >
                INR
              </button>
              <button
                onClick={() => setTipCurrency("USD")}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                  tipCurrency === "USD"
                    ? "bg-slate-800 text-white"
                    : "text-slate-600"
                }`}
              >
                USD
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CURRENCIES[tipCurrency].slabs.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedSlab(amt)}
                  className={`border p-3 rounded-2xl text-center transition-all ${
                    selectedSlab === amt
                      ? "bg-emerald-500 border-emerald-400"
                      : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <span
                    className={`text-[10px] font-black ${
                      selectedSlab === amt ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {CURRENCIES[tipCurrency].symbol}
                    {amt}
                  </span>
                </button>
              ))}
            </div>

            {selectedSlab && (
              <button
                onClick={() => triggerPaymentDisclaimer("tip", selectedSlab)}
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase shadow-xl animate-in fade-in slide-in-from-top-2 hover:bg-emerald-500 transition-colors"
              >
                Pay Hadiya {CURRENCIES[tipCurrency].symbol}
                {selectedSlab}
              </button>
            )}
          </div>

          {/* Tracking Mode */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] space-y-6">
            <div className="space-y-3">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-wider px-2">
                Tracking Mode
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  onClick={() => updateSettings({ trackingMode: "CHECKLIST" })}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    user?.trackingMode === "CHECKLIST"
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-slate-500"
                  }`}
                >
                  Checklist
                </button>
                <button
                  onClick={() => updateSettings({ trackingMode: "CALCULATOR" })}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    user?.trackingMode === "CALCULATOR"
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-slate-500"
                  }`}
                >
                  Calculator
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-wider px-2">
                Target Qaza Years
              </label>
              <div className="flex gap-2 items-stretch">
                <input
                  type="number"
                  value={user?.qazaGoalYears || ""}
                  onChange={(e) =>
                    updateUser({
                      qazaGoalYears: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white font-bold outline-none focus:border-emerald-500 transition-all min-w-0"
                />
                <button
                  onClick={handleCalculateDebt}
                  className="bg-slate-800 hover:bg-emerald-600 text-white px-4 rounded-2xl transition-colors shrink-0"
                >
                  <Save size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
              Profile Details
            </h4>
            <div className="space-y-3 px-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Gender</span>
                <span className="text-white text-xs font-bold uppercase">
                  {user?.gender || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Phone</span>
                <span className="text-white text-xs font-bold">
                  {user?.phone || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Address</span>
                <span className="text-white text-xs font-bold truncate ml-4 text-right">
                  {user?.address || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
              Legal & Support
            </h4>
            <div className="space-y-1">
              <Link
                href="/terms"
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <FileText
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-400"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Terms & Conditions
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-600 group-hover:text-slate-400"
                />
              </Link>
              <Link
                href="/privacy"
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <Shield
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-400"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Privacy Policy
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-600 group-hover:text-slate-400"
                />
              </Link>
              <Link
                href="/refund-policy"
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <HelpCircle
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-400"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Cancellation & Refunds
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-600 group-hover:text-slate-400"
                />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <Phone
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-400"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Contact Us
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-slate-600 group-hover:text-slate-400"
                />
              </Link>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-slate-900 border border-slate-800 text-slate-500 py-5 rounded-4xl font-black uppercase text-[11px] flex items-center justify-center gap-2 active:bg-red-500/10 transition-all"
          >
            <LogOut size={16} /> Sign Out Session
          </button>
        </main>

        <Navigation />
      </div>

      {/* Modals */}
      <DisclaimerModal />
      <PaymentModal />
    </div>
  );
}
