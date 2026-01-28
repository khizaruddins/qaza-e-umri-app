"use client";

import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Heart, Shield, Users, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative px-6 py-16 md:py-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />

          <div className="container mx-auto max-w-4xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-400 font-medium tracking-wider uppercase text-sm mb-4 block"
            >
              Our Mission
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
            >
              Helping the Ummah achieve <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Spiritual Peace
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            >
              We built Qaza-e-Umri to simplify the complex task of tracking
              missed prayers, allowing you to focus on your connection with
              Allah rather than the calculations.
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-slate-900/50 border-y border-white/5">
          <div className="container mx-auto px-6 max-w-5xl grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">The Story</h2>
              <p className="text-slate-400 leading-relaxed">
                It started with a simple realization: many of us carry the
                weight of missed prayers (Qaza) from our past years, but we
                often lack a structured way to fulfill them. The calculation is
                complex, the tracking is tedious, and the motivation can
                fluctuate.
              </p>
              <p className="text-slate-400 leading-relaxed">
                We wanted to create a solution that is not just a digital tally
                counter, but a companion that understands the sensitivity of
                this obligation. A tool that provides clarity, encouragement,
                and ease.
              </p>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center">
              {/* Placeholder for an image or illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-slate-900/80" />
              <Globe className="w-24 h-24 text-slate-700/50" />
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/80 backdrop-blur p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    Q
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      Built for everyone
                    </p>
                    <p className="text-slate-500 text-xs">
                      Accurate for all schools of thought
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-400">
              The principles that guide our work and your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Privacy First",
                description:
                  "Your spiritual journey is personal. We ensure your data is encrypted and never shared.",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Sincerity (Ikhlas)",
                description:
                  "We build with the intention to serve. No dark patterns, no invasive ads.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Community",
                description:
                  "We are all in this together. We aim to support each other in fulfilling our obligations.",
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-slate-900 p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {val.title}
                </h3>
                <p className="text-slate-400">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
