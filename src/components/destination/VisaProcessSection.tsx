/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 9: Student Visa & Application Process
 */

import React from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';

interface VisaProcessSectionProps {
  data: StudyDestinationData;
  onOpenConsultation: (counselor?: string) => void;
}

export const VisaProcessSection: React.FC<VisaProcessSectionProps> = ({
  data,
  onOpenConsultation
}) => {
  return (
    <section className="w-full bg-white dark:bg-[#070b19] py-12 sm:py-20 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Step-by-Step Visa & Admission Process for </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              {data.countryName}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            GEES guides you through every milestone from your first consultation to airport arrival in {data.countryName}.
          </p>
        </div>

        {/* Step Timeline Grid */}
        <div className="relative max-w-4xl mx-auto mb-10">
          <div className="space-y-6 sm:space-y-8">
            {data.visaProcess.map((step) => (
              <div
                key={step.stepNumber}
                className="relative bg-slate-50 dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start gap-5 transition-all hover:border-amber-400/50"
              >
                {/* Step Number Circle */}
                <div className="w-12 h-12 rounded-2xl bg-[#fbb034] text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                  0{step.stepNumber}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    {step.processingTime && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{step.processingTime}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visa Disclaimer & CTA */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
            * GEES compliance officers conduct a thorough 100% pre-verification on all academic marksheets, financial solvency records, and statement of purpose dossiers prior to official submission.
          </p>
          <button
            type="button"
            onClick={() => onOpenConsultation(`Visa Assessment for ${data.countryName}`)}
            className="py-3 px-8 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg active:scale-95 cursor-pointer min-h-[44px]"
          >
            Book Free Visa Assessment
          </button>
        </div>
      </div>
    </section>
  );
};

export default VisaProcessSection;
