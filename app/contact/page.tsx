import React from "react";
import { Mail, Phone, User } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>

        <p className="text-lg text-slate-400">
          We are here to help. If you have any questions, feedback, or support
          requests regarding Qaza-e-Umri, please reach out to us.
        </p>

        <div className="space-y-6 mt-8">
          <div className="flex items-start space-x-4 p-6 bg-slate-900 rounded-lg border border-slate-800">
            <Mail className="w-6 h-6 text-emerald-400 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-1">Email</h3>
              <p className="text-emerald-400 break-all">
                khizaruddins@gmail.com
              </p>
              <p className="text-sm text-slate-500 mt-1">
                For general inquiries and support
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-6 bg-slate-900 rounded-lg border border-slate-800">
            <Phone className="w-6 h-6 text-emerald-400 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-1">Phone</h3>
              <p className="text-slate-300">+91 9326486363</p>
              <p className="text-sm text-slate-500 mt-1">
                Available during business hours
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-6 bg-slate-900 rounded-lg border border-slate-800">
            <User className="w-6 h-6 text-emerald-400 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-1">
                About the Developer
              </h3>
              <p className="text-slate-400">
                This application is developed and maintained by an independent
                developer dedicated to serving the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
