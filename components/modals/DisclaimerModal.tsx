"use client";

import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/lib/store/uiStore";

export function DisclaimerModal() {
  const disclaimerModal = useUIStore((state) => state.disclaimerModal);
  const setDisclaimerModal = useUIStore((state) => state.setDisclaimerModal);
  const setPaymentModal = useUIStore((state) => state.setPaymentModal);
  const tipCurrency = useUIStore((state) => state.tipCurrency);

  const handleClose = () => {
    setDisclaimerModal({ isOpen: false, type: "subscription", amount: 0 });
  };

  const handleProceed = () => {
    // Close disclaimer modal
    handleClose();

    // Open payment modal
    setPaymentModal({
      isOpen: true,
      amount: disclaimerModal.amount,
      type: disclaimerModal.type,
    });
  };

  return (
    <Modal
      isOpen={disclaimerModal.isOpen}
      onClose={handleClose}
      title={
        disclaimerModal.type === "subscription"
          ? disclaimerModal.isRenewal
            ? "Renew Membership"
            : "Premium Access"
          : "Hadiya (Donation)"
      }
    >
      <div className="space-y-6">
        <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-3xl font-black text-emerald-400">
              {tipCurrency === "INR" ? "₹" : "$"}
              {disclaimerModal.amount}
            </div>
            <p className="text-slate-400 text-xs">
              {disclaimerModal.type === "subscription"
                ? disclaimerModal.isRenewal
                  ? "Continue your spiritual journey"
                  : "Unlock full history & features"
                : "Support the developer"}
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            {disclaimerModal.type === "subscription" ? (
              <>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <span>Unlock unlimited Qaza tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <span>Advanced Rakat calculator</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <span>Detailed calendar view</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <span>No ads, no subscriptions</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <span>
                    Your contribution helps maintain and improve the app
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <span>Support Islamic app development</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <span>Get barakah through supporting this cause</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-2xl p-4 space-y-2">
          <p className="text-yellow-200 text-[10px] font-bold uppercase tracking-wider">
            Important Notice
          </p>
          <p className="text-yellow-100/80 text-xs leading-relaxed">
            The developer is a{" "}
            <span className="font-bold text-yellow-200">Syed</span>. Please note
            that{" "}
            <span className="font-bold text-yellow-200">
              Zakat and Sadaqah are not applicable
            </span>
            . Any payment made will be considered as a{" "}
            <span className="font-bold text-yellow-200">Hadiya (Gift)</span> to
            support the development efforts.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-slate-800 text-slate-300 font-black py-4 rounded-2xl text-xs uppercase hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl text-xs uppercase hover:bg-emerald-500 transition-colors shadow-lg"
          >
            {disclaimerModal.type === "subscription"
              ? disclaimerModal.isRenewal
                ? "Renew Now"
                : "Upgrade Now"
              : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
