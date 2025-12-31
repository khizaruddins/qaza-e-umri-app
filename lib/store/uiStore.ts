import { create } from "zustand";
import type {
  Toast,
  DisclaimerModal,
  PaymentModal,
  AdjustModal,
  ConfirmModal,
  Currency,
} from "@/lib/types";

interface UIState {
  // Toast
  toast: Toast | null;
  setToast: (toast: Toast | null) => void;
  showToast: (type: Toast["type"], message: string) => void;

  // Modals
  disclaimerModal: DisclaimerModal;
  setDisclaimerModal: (modal: DisclaimerModal) => void;

  paymentModal: PaymentModal;
  setPaymentModal: (modal: PaymentModal) => void;

  adjustModal: AdjustModal;
  setAdjustModal: (modal: AdjustModal) => void;

  confirmModal: ConfirmModal;
  setConfirmModal: (modal: ConfirmModal) => void;

  showUpgrade: boolean;
  setShowUpgrade: (show: boolean) => void;

  // Payment Settings
  tipCurrency: Currency;
  setTipCurrency: (currency: Currency) => void;

  selectedSlab: number | null;
  setSelectedSlab: (slab: number | null) => void;

  showCustomTipInput: boolean;
  setShowCustomTipInput: (show: boolean) => void;

  customTip: string;
  setCustomTip: (tip: string) => void;

  // Calendar
  currentCalendarMonth: Date;
  setCurrentCalendarMonth: (date: Date) => void;

  // Selected Date
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Toast
  toast: null,
  setToast: (toast) => set({ toast }),
  showToast: (type, message) => set({ toast: { type, message } }),

  // Modals
  disclaimerModal: { isOpen: false, type: "subscription", amount: 0 },
  setDisclaimerModal: (modal) => set({ disclaimerModal: modal }),

  paymentModal: { isOpen: false, amount: 0, type: "subscription" },
  setPaymentModal: (modal) => set({ paymentModal: modal }),

  adjustModal: { isOpen: false, type: "clear", prayerId: null },
  setAdjustModal: (modal) => set({ adjustModal: modal }),

  confirmModal: { isOpen: false, val: 0, prayerId: null },
  setConfirmModal: (modal) => set({ confirmModal: modal }),

  showUpgrade: false,
  setShowUpgrade: (show) => set({ showUpgrade: show }),

  // Payment Settings
  tipCurrency: "INR",
  setTipCurrency: (currency) =>
    set({
      tipCurrency: currency,
      selectedSlab: null,
      showCustomTipInput: false,
    }),

  selectedSlab: null,
  setSelectedSlab: (slab) =>
    set({ selectedSlab: slab, showCustomTipInput: false }),

  showCustomTipInput: false,
  setShowCustomTipInput: (show) =>
    set({ showCustomTipInput: show, selectedSlab: show ? null : undefined }),

  customTip: "",
  setCustomTip: (tip) => set({ customTip: tip }),

  // Calendar
  currentCalendarMonth: new Date(),
  setCurrentCalendarMonth: (date) => set({ currentCalendarMonth: date }),

  // Selected Date
  selectedDate: new Date().toISOString().split("T")[0],
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
