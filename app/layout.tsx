import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Toast } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Qaza-e-Umri - Prayer Tracker",
  description: "Track and manage your Qaza prayers with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-slate-950 min-h-screen antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <Toast />
          {children}
        </Providers>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
