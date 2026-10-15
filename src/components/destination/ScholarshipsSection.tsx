/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 7: Scholarships & Funding
 */

import React from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';

interface ScholarshipsSectionProps {
  data: StudyDestinationData;
  onOpenConsultation: (counselor?: string) => void;
}

export const ScholarshipsSection: React.FC<ScholarshipsSectionProps> = ({
  data,
  onOpenConsultation
}) => {
  const scholarships = data.scholarships || [];

  return (
    <section className="w-full bg-white dark:bg-[#070b19] py-12 sm:py-20 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Scholarships & Funding for </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              {data.countryName}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Verified financial aid, tuition waivers, and merit-based grants for Bangladeshi international applicants.
          </p>
        </div>

        {/* Scholarship Cards */}
        {scholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-8">
            {scholarships.map((s, idx) => (
              <div
                key={idx}
                className="group bg-slate-50 dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Coverage Type Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                      {s.coverageType} Coverage
                    </span>
                    {s.deadline && (
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Deadline: {s.deadline}
                      </span>
                    )}
                  </div>

                  {/* Name & Provider */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                    {s.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-amber-400 mb-4">
                    {s.provider}
                  </p>

                  {/* Coverage Details */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Award Coverage
                    </span>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {s.coverageDetails}
                    </p>
                  </div>

                  {/* Eligibility */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white">Eligibility: </span>
                    {s.eligibility}
                  </p>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(`Eligibility Guidance for ${s.name} in ${data.countryName}`)}
                    className="w-full py-3 px-4 rounded-xl bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs transition-all text-center cursor-pointer min-h-[44px]"
                  >
                    Ask GEES About Eligibility
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-8">
            <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">card_membership</span>
            <p className="text-base font-bold text-slate-900 dark:text-white">Institutional Scholarship Guidance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-lg mx-auto">
              Institutional tuition fee discounts and academic waivers in {data.countryName} are evaluated directly during university course applications. Speak with our counselors to assess your profile for current funding awards.
            </p>
          </div>
        )}

        {/* Global Guidance Note */}
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-center max-w-2xl mx-auto">
          <p className="text-xs text-blue-900 dark:text-blue-300 font-medium">
            💡 GEES counselors assist students in drafting scholarship essay statements and compiling academic credentials to maximize institutional award grants.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipsSection;
