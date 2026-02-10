"use client";

import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/lib/store/uiStore";
import { useAppStore } from "@/lib/store/appStore";

export function PaymentModal() {
  const paymentModal = useUIStore((state) => state.paymentModal);
  const setPaymentModal = useUIStore((state) => state.setPaymentModal);
  const createTipOrder = useAppStore((state) => state.createTipOrder);
  const createSubscription = useAppStore((state) => state.createSubscription);
  const verifyTipOrder = useAppStore((state) => state.verifyTipOrder);
  const verifySubscription = useAppStore((state) => state.verifySubscription);
  const isLoading = useAppStore((state) => state.isLoading);
  const showToast = useUIStore((state) => state.showToast);
  const tipCurrency = useUIStore((state) => state.tipCurrency);
  const user = useAppStore((state) => state.user);

  const handleClose = () => {
    setPaymentModal({ isOpen: false, amount: 0, type: "subscription" });
  };

  const handlePayment = async () => {
    try {
      if (paymentModal.type === "subscription") {
        const response = await createSubscription(
          "MONTHLY",
          tipCurrency || "INR",
        );

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id: response.razorpaySubscriptionId,
          name: "Qaza-e-Umri",
          description: "Premium Subscription",
          handler: async (paymentResponse: any) => {
            try {
              await verifySubscription(paymentResponse);
              showToast(
                "success",
                "Subscription activated successfully! JazakAllah Khair.",
              );
              handleClose();
            } catch (err: any) {
              showToast(
                "error",
                err.message || "Subscription verification failed.",
              );
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: "#10b981",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      const response = await createTipOrder(
        paymentModal.amount,
        tipCurrency || "INR",
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.amount,
        currency: "INR",
        name: "Qaza-e-Umri",
        description: "Hadiya / Tip",
        order_id: response.razorpayOrderId,
        handler: async (paymentResponse: any) => {
          try {
            await verifyTipOrder(paymentResponse);
            showToast("success", "Payment successful! JazakAllah Khair.");
            handleClose();
          } catch (err: any) {
            showToast("error", err.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      showToast("error", e.message || "Payment failed to initialize");
    }
  };

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

        {/* Info */}
        <div className="bg-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-400 text-sm">
            Proceed to pay securely via Razorpay. Your contribution helps us
            maintain this service.
          </p>
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
            onClick={handlePayment}
            disabled={isLoading}
            className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl text-xs uppercase hover:bg-emerald-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        {/* Note */}
        <div className="flex justify-center items-center gap-2 text-slate-500">
          <span className="text-xs">Secured by Razorpay</span>
        </div>
      </div>
    </Modal>
  );
}
