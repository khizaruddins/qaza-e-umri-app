'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { FAQSection } from '@/components/landing/FAQSection';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const generalFAQ = [
  {
    id: 'what-is-qaza',
    question: 'What is Qaza-e-Umri?',
    answer:
      'Qaza-e-Umri is a digital platform designed to help Muslims track and manage their missed prayers (Qaza). The application simplifies the calculation and tracking process, allowing you to keep a record of your religious obligations and plan your makeup prayers with ease.',
  },
  {
    id: 'who-needs-this',
    question: 'Who should use Qaza-e-Umri?',
    answer:
      "Anyone who has missed prayers due to illness, travel, or other valid reasons can benefit from this app. Whether you're just starting your spiritual journey or returning to regular prayer practice, Qaza-e-Umri helps you organize and fulfill your obligations.",
  },
  {
    id: 'is-it-free',
    question: 'Is Qaza-e-Umri free to use?',
    answer:
      'We offer both free and premium plans. The free plan includes basic prayer tracking and calculations. Premium plans unlock additional features like advanced analytics, prayer reminders, and personalized recommendations.',
  },
  {
    id: 'how-accurate',
    question: 'How accurate are the prayer calculations?',
    answer:
      'Our calculations are based on Islamic jurisprudence principles and are reviewed by Islamic scholars. However, for specific religious guidance, we recommend consulting with a qualified Islamic scholar or imam who can consider your personal circumstances.',
  },
];

const usageFAQ = [
  {
    id: 'how-to-start',
    question: 'How do I get started with Qaza-e-Umri?',
    answer:
      "Simply sign up with your email, complete the onboarding process, and you'll be guided through setting up your prayer profile. You can then start tracking your missed prayers and receive personalized recommendations.",
  },
  {
    id: 'how-to-add-missed',
    question: 'How do I add missed prayers to my account?',
    answer:
      "After signing up and completing your profile, navigate to the dashboard and click 'Add Missed Prayer'. You can enter the date, time, and reason for each missed prayer. The app will help you calculate the total number of each prayer type you need to make up.",
  },
  {
    id: 'can-i-edit',
    question: 'Can I edit or delete missed prayer entries?',
    answer:
      'Yes, you can edit or delete any entry from your dashboard. Simply click on the prayer card, make your changes, and save. This flexibility allows you to maintain accurate records of your spiritual journey.',
  },
  {
    id: 'how-reminders-work',
    question: 'How do prayer reminders work?',
    answer:
      'If you enable notifications in your settings, Qaza-e-Umri will send you reminders based on your preferences. These can be daily, weekly, or custom reminders to help you stay on track with making up your missed prayers.',
  },
  {
    id: 'export-data',
    question: 'Can I export my prayer data?',
    answer:
      'Yes, premium members can export their prayer records in various formats including PDF and CSV. This is useful for sharing with scholars, keeping personal records, or transferring your data.',
  },
];

const technicalFAQ = [
  {
    id: 'what-devices',
    question: 'What devices can I use Qaza-e-Umri on?',
    answer:
      'Qaza-e-Umri is a web application that works on any device with a modern web browser, including smartphones, tablets, and desktop computers. We recommend using the latest versions of Chrome, Firefox, Safari, or Edge for the best experience.',
  },
  {
    id: 'is-it-secure',
    question: 'Is my data secure and private?',
    answer:
      'Yes, we take security and privacy very seriously. Your data is encrypted and stored securely. We comply with international data protection regulations and never share your personal information with third parties without your consent. Please review our privacy policy for more details.',
  },
  {
    id: 'offline-access',
    question: 'Can I use Qaza-e-Umri offline?',
    answer:
      "While core features require an internet connection, we're working on offline capability. For now, ensure you have a stable internet connection for the best experience.",
  },
  {
    id: 'sync-devices',
    question: 'How does my data sync across devices?',
    answer:
      'Once you log in with your account, your data automatically syncs across all your devices in real-time. Any changes you make on one device are instantly reflected on all others.',
  },
  {
    id: 'forgot-password',
    question: 'What should I do if I forgot my password?',
    answer:
      "Click 'Forgot Password' on the login page and follow the recovery steps. You'll receive an email with instructions to reset your password. Make sure to check your spam folder if you don't see the email.",
  },
];

const religiousFAQ = [
  {
    id: 'qaza-rules',
    question: 'What are the basic rules of Qaza?',
    answer:
      'According to Islamic jurisprudence, if you miss a prayer due to a valid reason (illness, sleep, travel, etc.), you have an obligation to make it up as soon as possible. The timing and method can vary based on which school of Islamic law you follow. We recommend consulting with your local imam or scholar for guidance specific to your situation.',
  },
  {
    id: 'estimate-missed',
    question: "How can I estimate how many prayers I've missed?",
    answer:
      "The calculator feature in Qaza-e-Umri can help you estimate based on the time period and frequency. However, for an accurate count, it's best to work with an Islamic scholar who can review your specific circumstances and life situation.",
  },
  {
    id: 'multiple-schools',
    question: 'Does the app account for different Islamic schools of thought?',
    answer:
      'Our app provides general guidance based on widely accepted Islamic principles. However, Islamic jurisprudence can vary between different schools of thought (Madhabs). We recommend consulting with a scholar from your specific tradition for personalized guidance.',
  },
  {
    id: 'combine-prayers',
    question: 'Can I combine missed prayers?',
    answer:
      'This depends on your circumstances and the Islamic school of thought you follow. Generally, combining prayers is permitted during travel or due to valid reasons. For specific guidance on your situation, consult with a qualified Islamic scholar.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative px-6 py-16 md:py-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />

          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6"
            >
              <HelpCircle className="w-8 h-8 text-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Frequently Asked <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Questions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            >
              Find answers to common questions about Qaza-e-Umri, how it works,
              and how it can help you manage your spiritual journey.
            </motion.p>
          </div>
        </section>

        {/* General FAQ */}
        <FAQSection
          title="General Questions"
          description="Learn more about Qaza-e-Umri and what we offer"
          items={generalFAQ}
        />

        {/* Usage FAQ */}
        <FAQSection
          title="Using the App"
          description="Get help with features and how to use Qaza-e-Umri"
          items={usageFAQ}
        />

        {/* Religious FAQ */}
        <FAQSection
          title="Religious Guidance"
          description="Understanding Qaza and Islamic principles"
          items={religiousFAQ}
        />

        {/* Technical FAQ */}
        <FAQSection
          title="Technical Support"
          description="Device compatibility, security, and technical questions"
          items={technicalFAQ}
        />

        {/* Still Have Questions Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="text-slate-400 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Please reach
                out to our support team or contact us through social media.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg font-semibold transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
