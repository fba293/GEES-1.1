/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * EMGS Visa Tracking Common Questions (FAQ Accordion)
 */

import React, { useState } from 'react';

export const VISA_TRACKING_FAQS = [
  {
    q: 'How do I track my EMGS application by passport number?',
    a: 'You can check your status using your Travel Document Number (Passport Number without spaces) and your nationality as printed on your passport. The tracker queries the official EMGS Application and Registration System (STARS) records to display your current stage, percentage indicator, and latest updates.'
  },
  {
    q: 'Is this EMGS tracker free? Do I need an account?',
    a: 'Yes, checking your Malaysian student visa progress is 100% free with zero sign-up, login, or membership required. Neither GEES nor EMGS charges students any fee for checking the status of their student visa application.'
  },
  {
    q: 'What does the EMGS percentage mean?',
    a: 'The EMGS percentage represents key verification milestones: 15% indicates academic and health document verification; 35% means the application has been submitted to Malaysian Immigration; ~70% signifies that your electronic Visa Approval Letter (eVAL) has been approved and issued; 85% means supporting letters have been issued to state immigration; and 100% indicates that your physical Student Pass sticker has been endorsed in your passport (or in certain instances, file closure).'
  },
  {
    q: 'What is the VAL (Visa Approval Letter)?',
    a: 'The Visa Approval Letter (VAL, also referred to as eVAL) is an official document issued by the Immigration Department of Malaysia approving your entry into Malaysia for study purposes. Once your application reaches approximately 70%, your university will release your eVAL so you can obtain your Single Entry Visa (SEV) and make travel arrangements.'
  },
  {
    q: 'What happens after I arrive in Malaysia?',
    a: 'Upon landing at Kuala Lumpur International Airport (KLIA/KLIA2) or another designated Malaysian entry port, your university representative must receive you at airport immigration. Within 7 days of arrival, you will undergo a mandatory post-arrival health screening at an EMGS-panel clinic. After passing, your passport is submitted to the State Immigration Department to stamp your official Student Pass sticker.'
  },
  {
    q: 'Is GEES part of EMGS?',
    a: 'No. Education Malaysia Global Services (EMGS) is the official government-owned agency under the Ministry of Higher Education Malaysia. Global Education Expert Services (GEES) is an independent premier international education consultancy supporting students with university selection, admission, documentation, and pre-departure guidance with zero consultancy fees.'
  }
];

export const VisaTrackingFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full max-w-4xl mx-auto my-12 px-4" data-purpose="visa-tracking-faq-section">
      <div className="text-center mb-8">
        <h2 className="text-2xl min-[390px]:text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          EMGS tracking — common questions
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Quick answers about checking your Malaysia student visa.
        </p>
      </div>

      <div className="space-y-3">
        {VISA_TRACKING_FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full min-h-[52px] px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {item.q}
                </span>
                <span
                  className={`material-symbols-outlined text-[20px] text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
