"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding, checkAuth, isLoading } = useAppStore();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [trackingMode, setTrackingMode] = useState<"CHECKLIST" | "CALCULATOR">(
    "CHECKLIST"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  const handleStepOne = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get data from step 1 form (stored in state or refs if needed, but here we need to capture it)
    // Since we split the form, we need to store step 1 data in state.
    // Let's refactor to store form data in state.

    // For now, assuming we have the data.
    // Wait, the previous implementation didn't store step 1 data!
    // We need to fix that.
  };

  // ... refactoring below ...
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitOnboarding = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding({
        gender,
        location: formData.address,
        phone: formData.phone,
        trackingMode,
      });
      router.push("/");
    } catch (error) {
      console.error("Onboarding failed", error);
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-sm space-y-8 animate-in slide-in-from-right duration-500">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white">
            {step === 1 ? "Complete Profile" : "Choose Your Path"}
          </h2>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStepOne} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Full Name
              </label>
              <input
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Gender
              </label>
              <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setGender("MALE")}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    gender === "MALE"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender("FEMALE")}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    gender === "FEMALE"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Phone Number
              </label>
              <input
                name="phone"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Address
              </label>
              <input
                name="address"
                required
                placeholder="Address (City, Country)"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-xs mt-4"
            >
              Next Step
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setTrackingMode("CHECKLIST")}
              className={`w-full p-6 rounded-3xl border-2 text-left mb-4 ${
                trackingMode === "CHECKLIST"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-800"
              }`}
            >
              <h4 className="text-white font-black text-sm uppercase mb-1">
                Day-to-Day
              </h4>
              <p className="text-slate-500 text-[10px]">
                Track specific dates on a checklist.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setTrackingMode("CALCULATOR")}
              className={`w-full p-6 rounded-3xl border-2 text-left ${
                trackingMode === "CALCULATOR"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-800"
              }`}
            >
              <h4 className="text-white font-black text-sm uppercase mb-1">
                Rakat Calculator
              </h4>
              <p className="text-slate-500 text-[10px]">
                Clear bulk prayer counts directly.
              </p>
            </button>
            <button
              onClick={submitOnboarding}
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-xs mt-6 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Setting up...
                </>
              ) : (
                "Complete Setup"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
