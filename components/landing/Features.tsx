"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Calendar,
  History,
  Shield,
  Smartphone,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: <Calculator className="w-6 h-6" />,
    title: "Smart Calculation",
    description:
      "Enter your age and puberty details to instantly calculate your total missed prayers.",
  },
  {
    icon: <History className="w-6 h-6" />,
    title: "Track Progress",
    description:
      "Visual progress bars and analytics to see how far you've come in your spiritual journey.",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Detailed Logs",
    description:
      "Keep a daily log of Qaza prayers offered along with your regular Salah.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Private & Secure",
    description:
      "Your spiritual data is private. We use encryption to ensure only you see your data.",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Mobile Friendly",
    description:
      "Access your tracker on any device. Perfect for updating on the go.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Community Support",
    description:
      "Join thousands of muslims working towards clearing their debts to Allah.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-900 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Designed for your{" "}
            <span className="text-emerald-400">Peace of Mind</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to systematically manage and track your
            Qaza-e-Umri obligations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-950 border border-white/5 p-8 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-950/80 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
