import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            1. Information We Collect
          </h2>
          <p>
            We collect minimal information necessary to provide the features of
            Qaza-e-Umri. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              User account information (if applicable, such as email for
              authentication).
            </li>
            <li>
              Prayer tracking data (records of prayers performed and pending).
            </li>
            <li>User preferences and settings within the app.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            2. How We Use Your Information
          </h2>
          <p>The information collected is used solely for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing and maintaining the Qaza-e-Umri service.</li>
            <li>Tracking your personal prayer progress.</li>
            <li>
              Improving the functionality and user experience of the
              application.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            3. Data Security
          </h2>
          <p>
            We value your trust in providing us your Personal Information, and
            we strive to use commercially acceptable means of protecting it.
            However, remember that no method of transmission over the internet
            or method of electronic storage is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            4. Third-Party Services
          </h2>
          <p>
            We may employ third-party companies and individuals due to the
            following reasons: to facilitate our Service; to provide the Service
            on our behalf; or to perform Service-related services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-emerald-400">
            5. Contact Us
          </h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy,
            do not hesitate to contact us.
          </p>
        </section>

        <div className="pt-8 text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
