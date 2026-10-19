/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Student Support, WhatsApp Advisory, & Referral Conversion Cards
 */

import React from 'react';
import { OFFICIAL_WHATSAPP } from '../../lib/seo-config.ts';

interface VisaSupportConversionProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultation?: () => void;
}

export const VisaSupportConversion: React.FC<VisaSupportConversionProps> = ({
  onNavigate,
  onOpenConsultation
}) => {
  const handleOpenWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${OFFICIAL_WHATSAPP}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 my-10 px-4" data-purpose="visa-conversion-sections">
      {/* 1. "Not applying through us? We can still help from here." Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Not applying through us? We can still help from here.
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Process your Single Entry Visa (SEV) application and document attestation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Book discounted student air tickets and complimentary KLIA airport pickup</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Free arrival, medical screening, and post-arrival student-pass guidance</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenWhatsApp('Hello GEES! I have my Malaysia offer/EMGS in progress and need help with SEV, flights, and arrival support.')}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Talk to us on WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('study-destination', 'study-in-malaysia')}
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            Study in Malaysia Guide
          </button>
        </div>
      </div>

      {/* 2. Refer & Earn Card (Matching Reference Screenshot) */}
      <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#fbb034] text-slate-950 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <span className="material-symbols-outlined text-[22px]">redeem</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                REFER & EARN
              </span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              Know someone who wants to study in Malaysia? Earn ৳ 10,000
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Refer a friend, relative, or classmate. When they enrol and receive their student visa, you receive ৳ 10,000 sent directly to your bKash or bank account.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenWhatsApp('Hello GEES! I want to refer a student who wants to study in Malaysia.')}
            className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">chat</span>
            <span>Refer on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* 3. Pre-FAQ Banner: "Not applied through us yet?" */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-[#070b19] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Not applied through us yet?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Free university counselling, transparent fee structures, scholarship shortlisting, and full EMGS support — you pay university tuition directly to the institution without any hidden consultancy charges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#fbb034] hover:bg-[#f59e0b] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Find your course
          </button>
          <button
            type="button"
            onClick={onOpenConsultation || (() => onNavigate('contact'))}
            className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Book Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
