"use client";

import { BookOpen } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";

export default function LibraryPage() {
  return (
    <div className="flex-1 bg-slate-950 min-h-screen flex flex-col font-sans text-slate-200">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col pb-24 relative">
        <main className="flex-1 px-6 pt-8 overflow-y-auto space-y-6 animate-in fade-in pb-8">
          <h2 className="text-2xl font-black text-white">Hadith Library</h2>

          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-900 p-8 rounded-full mb-6">
              <BookOpen size={48} className="text-slate-700" />
            </div>
            <h3 className="text-white font-black text-xl mb-2">Coming Soon</h3>
            <p className="text-slate-500 text-sm text-center max-w-xs">
              Hadith and Islamic resources will be available here in the next
              update.
            </p>
          </div>
        </main>

        <Navigation />
      </div>
    </div>
  );
}
