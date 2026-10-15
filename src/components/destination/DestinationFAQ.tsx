/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 11: Country FAQ Accordion with Schema.org JSON-LD
 */

import React, { useState, useEffect } from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';

interface DestinationFAQProps {
  data: StudyDestinationData;
  onOpenConsultation: (counselor?: string) => void;
}

export const DestinationFAQ: React.FC<DestinationFAQProps> = ({
  data,
  onOpenConsultation
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Inject Schema.org FAQPage JSON-LD Structured Data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const schemaId = `schema-faqpage-${data.slug}`;
    let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;

    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': data.faqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    scriptEl.textContent = JSON.stringify(faqSchema);

    return () => {
      const el = document.getElementById(schemaId);
      if (el) el.remove();
    };
  }, [data]);

  return (
    <section className="w-full bg-white dark:bg-[#070b19] py-12 sm:py-20 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Frequently Asked Questions: </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              {data.countryName}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Essential questions answered regarding studying in {data.countryName} from Bangladesh.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-10">
          {data.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.question}</span>
                  <span className={`material-symbols-outlined text-2xl text-amber-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}>
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed border-t border-slate-200/60 dark:border-slate-800">
                    <p className="mb-3">{faq.answer}</p>
                    {faq.keyPoints && (
                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600 dark:text-slate-400">
                        {faq.keyPoints.map((kp, kIdx) => (
                          <li key={kIdx}>{kp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ask Question Bar */}
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 text-center border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Have a specific question not listed here?
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            Our counselors are ready to answer your queries regarding admission, entry requirements, and visa filings.
          </p>
          <button
            type="button"
            onClick={() => onOpenConsultation(`FAQ Inquiry regarding ${data.countryName}`)}
            className="py-2.5 px-6 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer min-h-[44px]"
          >
            Ask a GEES Counselor
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationFAQ;
