"use client";

import { X, PlusCircle } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl scale-in-center">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-white font-black text-xl">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <PlusCircle className="rotate-45" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
      <style jsx>{`
        @keyframes scale-in-center {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .scale-in-center {
          animation: scale-in-center 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            both;
        }
      `}</style>
    </div>
  );
}
