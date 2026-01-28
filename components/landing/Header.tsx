"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";

export function Header() {
  const user = useAppStore((state) => state.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-4"
          : "bg-transparent py-6",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <Clock className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Qaza-e-Umri
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Plans"].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/about"
            className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="text-white hover:text-emerald-400 px-4 py-2 font-medium flex items-center gap-2"
            >
              Hi, {user.name}
            </Link>
          ) : (
            <>
              <Link
                href="/auth?view=login"
                className="text-white hover:text-emerald-400 px-4 py-2 font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth?view=signup"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-4">
          {["Features", "How it Works", "Plans"].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-emerald-400 font-medium"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-emerald-400 font-medium"
          >
            About
          </Link>
          <hr className="border-white/10 my-2" />
          {user ? (
            <Link
              href="/dashboard"
              className="text-center w-full bg-emerald-500 text-white py-3 rounded-xl font-bold"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth?view=signup"
              className="text-center w-full bg-emerald-500 text-white py-3 rounded-xl font-bold"
            >
              Get Started
            </Link>
          )}
        </div>
      )}
    </motion.header>
  );
}
