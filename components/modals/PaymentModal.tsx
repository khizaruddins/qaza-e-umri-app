"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/lib/store/uiStore";
import { useAppStore } from "@/lib/store/appStore";
import { Copy, ExternalLink } from "lucide-react";

export function PaymentModal() {
  const paymentModal = useUIStore((state) => state.paymentModal);
  const setPaymentModal = useUIStore((state) => state.setPaymentModal);
  const submitPaymentProof = useAppStore((state) => state.submitPaymentProof);
  const checkSubscriptionStatus = useAppStore(
    (state) => state.checkSubscriptionStatus
  );
  const isLoading = useAppStore((state) => state.isLoading);
  const showToast = useUIStore((state) => state.showToast);
  const tipCurrency = useUIStore((state) => state.tipCurrency);
  const [transactionId, setTransactionId] = useState("");

  const handleClose = () => {
    setPaymentModal({ isOpen: false, amount: 0, type: "subscription" });
    setTransactionId("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("success", "Copied to clipboard!");
  };

  const handlePaymentComplete = async () => {
    if (!transactionId.trim()) {
      showToast("error", "Please enter the Transaction ID");
      return;
    }

    try {
      await submitPaymentProof(transactionId);
      showToast("success", "Payment proof submitted successfully!");
      handleClose();
      // Optionally check status immediately, though it might not be approved yet
      checkSubscriptionStatus();
    } catch (error) {
      showToast("error", "Failed to submit payment proof. Please try again.");
    }
  };

  const upiId = "developer@upi"; // Replace with actual UPI ID
  const upiLink = `upi://pay?pa=${upiId}&pn=Qaza-e-Umri&am=${paymentModal.amount}&cu=${tipCurrency}`;

  return (
    <Modal
      isOpen={paymentModal.isOpen}
      onClose={handleClose}
      title="Complete Payment"
    >
      <div className="space-y-6">
        {/* Amount Display */}
        <div className="bg-linear-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-center space-y-2">
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">
            Amount to Pay
          </p>
          <div className="text-4xl font-black text-white">
            {tipCurrency === "INR" ? "₹" : "$"}
            {paymentModal.amount}
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
          {/* UPI Payment */}
          <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black uppercase text-sm tracking-wider">
                Scan to Pay
              </h3>
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
            </div>

            <div className="flex justify-center bg-white p-4 rounded-xl">
              <Image
                src="/PhonePE_QR.png"
                alt="PhonePe QR Code"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>

            <div className="space-y-3">
              <div className="bg-slate-900 rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="flex-1 overflow-hidden">
                  <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">
                    UPI ID
                  </p>
                  <p className="text-white text-sm font-mono truncate">
                    {upiId}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(upiId)}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              <a
                href={upiLink}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl text-xs uppercase transition-colors"
              >
                Pay with UPI App
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card Payment Info */}
          <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black uppercase text-sm tracking-wider">
                Card Payment
              </h3>
              <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-xs">
                Card payment integration coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Transaction ID Input */}
        <div className="space-y-2">
          <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider ml-1">
            Transaction ID / UTR
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter Transaction ID (e.g. T230...)"
            className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-600/30 rounded-2xl p-4 space-y-2">
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-wider">
            Payment Instructions
          </p>
          <ol className="text-blue-100/80 text-xs leading-relaxed space-y-1.5 list-decimal list-inside">
            <li>Click "Pay with UPI App" or copy the UPI ID</li>
            <li>Complete the payment in your UPI app</li>
            <li>Return here and click "I've Completed Payment"</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-slate-800 text-slate-300 font-black py-4 rounded-2xl text-xs uppercase hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentComplete}
            disabled={isLoading}
            className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl text-xs uppercase hover:bg-emerald-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "I've Completed Payment"}
          </button>
        </div>

        {/* Note */}
        <p className="text-slate-500 text-[10px] text-center leading-relaxed">
          Note: In production, payment verification would be automatic. This is
          a demo implementation.
        </p>
      </div>
    </Modal>
  );
}
