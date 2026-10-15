/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 2: Country Quick Facts
 */

import React from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';

interface DestinationQuickFactsProps {
  data: StudyDestinationData;
}

export const DestinationQuickFacts: React.FC<DestinationQuickFactsProps> = ({ data }) => {
  return (
    <section className="w-full bg-slate-50 dark:bg-[#070D1E] py-12 sm:py-16 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            <span>Quick Facts: Studying in </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 py-1 rounded-xl font-black shrink-0 inline-block">
              {data.countryName}
            </span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Essential estimates and key educational guidelines for prospective international applicants.
          </p>
        </div>

        {/* 6 Grid Fact Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {data.quickFacts.map((fact, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-2xl">{fact.icon}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  {fact.label}
                </span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white leading-tight mb-1">
                  {fact.value}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-snug">
                  {fact.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer Note */}
        <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          * Note: Tuition and living cost figures are official estimates based on verified averages ({data.lastVerifiedDate}). University-specific fees may vary by faculty and program.
        </p>
      </div>
    </section>
  );
};

export default DestinationQuickFacts;
