import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          Terms and Conditions
        </h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            1. Introduction
          </h2>
          <p>
            Welcome to Qaza-e-Umri. By accessing or using our application, you
            agree to be bound by these Terms and Conditions. If you disagree
            with any part of these terms, you may not access the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            2. Usage of the App
          </h2>
          <p>
            Qaza-e-Umri is a prayer tracking application designed to help users
            manage their Qaza prayers. You agree to use this application only
            for its intended personal and non-commercial purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            3. User Data
          </h2>
          <p>
            We respect your privacy. All data entered into the application
            regarding your prayers is stored locally or securely associated with
            your account. However, responsible usage and data backup are
            encouraged.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            4. Disclaimer
          </h2>
          <p>
            The calculations and information provided by this application are
            for reference purposes. Users are encouraged to consult with
            qualified scholars for specific religious rulings pertinent to their
            situation. The developers are not liable for any inaccuracies in
            calculation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            5. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify or replace these Terms at any time.
            Your continued use of the application after any such changes
            constitutes your acceptance of the new Terms.
          </p>
        </section>

        <div className="pt-8 text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
