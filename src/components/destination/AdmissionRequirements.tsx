/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 6: Admission Requirements & Cost Breakdown
 */

import React from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';

interface AdmissionRequirementsProps {
  data: StudyDestinationData;
}

export const AdmissionRequirements: React.FC<AdmissionRequirementsProps> = ({ data }) => {
  return (
    <section className="w-full bg-slate-50 dark:bg-[#070D1E] py-12 sm:py-20 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Admission Requirements & </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              Costs in {data.countryName}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Essential entry criteria and estimated financial planning guide for Bangladeshi applicants.
          </p>
        </div>

        {/* 2-Column Split: Academic Requirements (Left) & Cost Breakdown (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left Column: Academic & IELTS Criteria */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Academic Qualifications</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">General guidance for entry levels</p>
                </div>
              </div>

              {/* Undergraduate Requirements */}
              <div className="mb-6">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Bachelor’s / Undergraduate Entry</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {data.admissionRequirements.undergraduate.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Postgraduate Requirements */}
              <div className="mb-6">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Master’s / Postgraduate Entry</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {data.admissionRequirements.postgraduate.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* English Proficiency */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-amber-500">translate</span>
                  <span>English Language Requirements</span>
                </h4>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  IELTS Target: <span className="text-amber-600 dark:text-amber-400">{data.admissionRequirements.englishProficiency.ielts}</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                  {data.admissionRequirements.englishProficiency.notes}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Accepted Alternatives:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.admissionRequirements.englishProficiency.alternatives.map((alt, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-slate-600 dark:text-slate-400 italic">
              * Note: Precise academic thresholds vary by specific university and faculty department.
            </p>
          </div>

          {/* Right Column: Cost Breakdown & Expenses */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Estimated Cost Breakdown</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Annual tuition & monthly living budgets</p>
                </div>
              </div>

              {/* Tuition Overview Box */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block mb-0.5">
                  Annual Tuition Range
                </span>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {data.costOfStudy.tuitionRangeAnnual}
                </p>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Average monthly living budget: {data.costOfStudy.livingCostMonthly}
                </span>
              </div>

              {/* Living Cost Category Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Monthly Living Cost Items ({data.costOfStudy.currency})
                </h4>
                {data.costOfStudy.breakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                      <span>{item.category}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{item.monthlyCost}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-normal">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-[11px] text-slate-600 dark:text-slate-400 italic">
              * Note: Figures represent average monthly estimates in {data.costOfStudy.currency}. Personal lifestyle choices may affect actual spending.
            </p>
          </div>
        </div>

        {/* Required Documents Checklist Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-amber-500 text-2xl">folder_zip</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Required Documents Checklist for Bangladeshi Applicants
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {data.admissionRequirements.requiredDocuments.map((doc, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="material-symbols-outlined text-emerald-500 text-base shrink-0">check_box</span>
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionRequirements;
