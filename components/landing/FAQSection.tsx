'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  description?: string;
}

export function FAQSection({ items, title, description }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            {description && (
              <p className="text-slate-400 text-lg">{description}</p>
            )}
          </motion.div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-slate-700 rounded-lg overflow-hidden hover:border-emerald-500/50 transition-colors"
            >
              <button
                onClick={() => toggleOpen(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <h3 className="text-left text-white font-semibold">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-emerald-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-slate-900/50 text-slate-300 leading-relaxed border-t border-slate-700">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
