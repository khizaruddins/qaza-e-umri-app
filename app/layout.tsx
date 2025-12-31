import type { Metadata } from "next";
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
    <html lang="en">
      <body className="bg-slate-950 min-h-screen antialiased">
        <Providers>
          <Toast />
          {children}
        </Providers>
      </body>
    </html>
  );
}
