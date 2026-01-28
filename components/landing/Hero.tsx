"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Hero() {
  const user = useAppStore((state) => state.user);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-950">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Your spiritual companion
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Fulfill Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Qaza Prayers
            </span>
            <br /> With Peace.
          </h1>

          <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
            Track your missed Salah easily. Calculate your Qaza-e-Umri
            obligations, manage your progress, and find spiritual tranquility
            with our modern Islamic tracker.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/20 flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth?view=register"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/20 flex items-center gap-2"
                >
                  Start Calculating <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth?view=login"
                  className="px-8 py-4 rounded-full font-bold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  Login to Account
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 flex items-center gap-8 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" /> Secure
              Data
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" /> Easy to
              Use
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" /> Free Tier
              Available
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Visual Representation of the App */}
          <div className="relative z-10 bg-slate-900 border border-white/10 rounded-3xl p-4 shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="bg-slate-950 rounded-2xl p-6 aspect-[4/3] overflow-hidden flex flex-col relative">
              {/* Dummy UI Elements */}
              <div className="flex justify-between items-center mb-6">
                <div className="h-4 w-24 bg-slate-800 rounded" />
                <div className="h-8 w-8 bg-emerald-500/20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <div className="text-emerald-400 text-sm">Fajr Qaza</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    1,240
                  </div>
                </div>
                <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                  <div className="text-amber-400 text-sm">Streak</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    12 Days
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-slate-900 rounded-lg flex items-center px-4 justify-between border border-white/5"
                  >
                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded bg-slate-800" />
                      <div className="w-20 h-4 rounded bg-slate-800" />
                    </div>
                    <div className="w-8 h-4 rounded bg-slate-800" />
                  </div>
                ))}
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-8 top-20 bg-emerald-600 p-4 rounded-2xl shadow-xl z-20 hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs text-emerald-100">Daily Goal</div>
                    <div className="text-white font-bold">Completed!</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          {/* Background Blob behind card */}
          <div className="absolute inset-0 bg-emerald-500/30 blur-3xl -z-10 translate-y-10" />
        </motion.div>
      </div>
    </section>
  );
}
