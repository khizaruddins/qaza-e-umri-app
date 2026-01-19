import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          Cancellation and Refund Policy
        </h1>

        <section className="space-y-4 p-6 bg-slate-900 rounded-xl border border-slate-800">
          <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
            Policy Statement
          </h2>
          <p className="text-lg leading-relaxed">
            Please note that this application is created and managed by an
            individual developer and not a registered business entity.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            If you have made any payments (if applicable) or have concerns
            regarding cancellations, subscriptions, or refunds,
            <strong> please contact the developer directly</strong> to resolve
            the issue.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            Contact for Refunds
          </h2>
          <p>
            You can reach out via the following channels for any financial
            queries:
          </p>
          <ul className="list-none space-y-3 mt-4">
            <li className="flex items-center space-x-2">
              <span className="text-slate-400">Email:</span>
              <span className="text-emerald-400 font-medium">
                khizaruddins@gmail.com
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-slate-400">Phone:</span>
              <span className="text-emerald-400 font-medium">
                +91 9326486363
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-slate-800 pt-8 mt-8">
          <p className="text-slate-400 text-sm">
            We aim to resolve all legitimate requests amicably and promptly.
            Please allow 24-48 hours for a response.
          </p>
        </section>
      </div>
    </div>
  );
}
