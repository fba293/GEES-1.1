/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 3: Why Study In This Country?
 */

import React from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';

interface WhyStudySectionProps {
  data: StudyDestinationData;
}

export const WhyStudySection: React.FC<WhyStudySectionProps> = ({ data }) => {
  return (
    <section className="w-full bg-white dark:bg-[#070b19] py-12 sm:py-20 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-2">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Why Study in </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              {data.countryName}?
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            {data.whyStudy.intro}
          </p>
        </div>

        {/* 6 Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {data.whyStudy.benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="group relative bg-slate-50 dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fbb034]/20 text-[#c58211] dark:text-[#fbb034] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-2xl">{benefit.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Verified Benefit</span>
                <span className="material-symbols-outlined text-sm">verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyStudySection;
