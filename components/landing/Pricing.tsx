"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/store/appStore";
import { useUIStore } from "@/lib/store/uiStore";

const plans = [
  {
    name: "Trial",
    price: "Free",
    period: "/30 days",
    description: "Experience the peace of mind",
    features: [
      "Auto Qaza Calculation",
      "Full Progress Tracking",
      "Manual Entry",
      "30 Day Access",
    ],
    highlight: false,
  },
  {
    name: "Monthly",
    price: "₹599",
    period: "/month",
    description: "Commit to your spiritual debts",
    features: [
      "Everything in Trial",
      "Unlimited Access",
      "Detailed Analytics",
      "Export Data",
      "Priority Support",
    ],
    highlight: false,
  },
  {
    name: "Yearly",
    price: "₹5999",
    period: "/year",
    description: "Best value for long-term consistency",
    features: [
      "All Monthly Features",
      "Save ₹1189 per year",
      "Cloud Backup",
      "Multi-device Sync",
      "Exclusive Content",
    ],
    highlight: true,
    tag: "Best Value",
  },
];

export function Pricing() {
  const createSubscription = useAppStore((state) => state.createSubscription);
  const verifySubscription = useAppStore((state) => state.verifySubscription);
  const showToast = useUIStore((state) => state.showToast);
  const user = useAppStore((state) => state.user);

  const handleSubscribe = async (planName: string) => {
    if (planName === "Trial") {
      // Redirect to signup or dashboard if trial logic is improved
      window.location.href = "/auth";
      return;
    }

    if (!user) {
      showToast("error", "Please login to subscribe");
      window.location.href = "/auth";
      return;
    }

    const planType = planName.toUpperCase() as "MONTHLY" | "YEARLY";

    try {
      const response = await createSubscription(planType, "INR");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: response.razorpaySubscriptionId,
        name: "Qaza-e-Umri",
        description: `${planName} Subscription`,
        handler: async (paymentResponse: any) => {
          try {
            await verifySubscription(paymentResponse);
            showToast("success", "Subscription activated successfully!");
          } catch (err: any) {
            showToast(
              "error",
              err.message || "Subscription verification failed.",
            );
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      showToast("error", error.message || "Failed to start subscription");
    }
  };

  return (
    <section id="plans" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-emerald-500/5 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400">
            Choose the plan that fits your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className={cn(
                "relative p-8 rounded-3xl border transition-all duration-300",
                plan.highlight
                  ? "bg-slate-900 border-emerald-500 shadow-2xl shadow-emerald-900/20 scale-105 z-10"
                  : "bg-slate-950/50 border-white/10 hover:border-emerald-500/30",
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {plan.tag}
                </div>
              )}
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-slate-500 text-sm">{plan.period}</span>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-8">{plan.description}</p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                className={cn(
                  "w-full py-3 rounded-xl font-bold transition-all",
                  plan.highlight
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-white",
                )}
              >
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
