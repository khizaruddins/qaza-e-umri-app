'use client';
import React from 'react';
import Link from 'next/link';
import { Clock, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Clock className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Qaza-e-Umri
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Helping Muslims around the world fulfill their spiritual
              obligations with peace of mind and ease.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-emerald-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-emerald-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-emerald-400">
                  Calculator
                </Link>
              </li>
              <li>
                <Link href="/#plans" className="hover:text-emerald-400">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Socials</h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Qaza-e-Umri. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for the Ummah</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
