/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * EMGS Visa Stages Educational Guide & Percentage Breakdown
 */

import React, { useState } from 'react';

export const VisaProgressTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stages' | 'percentages'>('stages');

  const macroStages = [
    {
      num: 1,
      title: 'Application & documents',
      desc: 'We prepare and verify your academic transcripts, photos, and passport copies, then submit them to the university and EMGS.'
    },
    {
      num: 2,
      title: 'Offer letter',
      desc: 'The university issues an official offer letter. You accept and pay any required tuition or visa deposit directly to the university.'
    },
    {
      num: 3,
      title: 'EMGS submission & processing',
      desc: 'EMGS verifies documents, processing fees, and health declarations before forwarding your file to Malaysian Immigration.'
    },
    {
      num: 4,
      title: 'VAL issued (~70%)',
      desc: 'Your electronic Visa Approval Letter (eVAL) is officially issued. You can now arrange your Single Entry Visa (SEV) and flights.'
    },
    {
      num: 5,
      title: 'Arrival & medical screening',
      desc: 'After arriving in Malaysia, complete your mandatory post-arrival clinic screening within 7 days; EMGS then requests your passport.'
    },
    {
      num: 6,
      title: 'Student pass issued',
      desc: 'Malaysian State Immigration endorses the student pass sticker in your physical passport. You are fully cleared to study.'
    }
  ];

  const percentageMilestones = [
    {
      percent: '5%',
      title: 'Application Received & Fee Paid',
      meaning: 'Your university has submitted your STARS application and the mandatory EMGS processing fee has been received.',
      color: 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20',
      badge: 'Normal Progress',
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60'
    },
    {
      percent: '15%',
      title: 'Document Verification by EMGS',
      meaning: 'Officers are vetting your passport biodata, certificates, offer letter, and pre-arrival health declaration.',
      color: 'border-blue-200 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/20',
      badge: 'Review Stage',
      badgeColor: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60'
    },
    {
      percent: '35%',
      title: 'Submitted to Malaysian Immigration',
      meaning: 'EMGS has cleared all initial paperwork and forwarded your security clearance request to the Immigration Department.',
      color: 'border-amber-200 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20',
      badge: 'Immigration Review',
      badgeColor: 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60'
    },
    {
      percent: '70%',
      title: 'eVAL Approved & Issued!',
      meaning: 'Your Electronic Visa Approval Letter has been generated. You are approved to apply for your Single Entry Visa (SEV) and travel.',
      color: 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30',
      badge: 'Major Milestone',
      badgeColor: 'text-emerald-800 dark:text-emerald-200 bg-emerald-200 dark:bg-emerald-800 font-bold'
    },
    {
      percent: '80%',
      title: 'SEV & Pre-Arrival Preparation',
      meaning: 'You are applying for SEV at your local Malaysian High Commission / Embassy and booking flight tickets.',
      color: 'border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/20',
      badge: 'Travel Prep',
      badgeColor: 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60'
    },
    {
      percent: '85%',
      title: 'Post-Arrival Clinic Screening Passed',
      meaning: 'You have entered Malaysia and completed your mandatory medical test at an EMGS panel clinic with a clean report.',
      color: 'border-teal-200 dark:border-teal-800/80 bg-teal-50/50 dark:bg-teal-950/20',
      badge: 'Clinic Cleared',
      badgeColor: 'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60'
    },
    {
      percent: '100%',
      title: 'Student Pass Sticker Endorsed',
      meaning: 'State Immigration has stamped the multi-entry Student Pass sticker into your physical passport. Process complete!',
      color: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/30',
      badge: 'Final Completion',
      badgeColor: 'text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/70 font-bold'
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto my-12 px-4" data-purpose="visa-stages-educational-guide">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl min-[390px]:text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          EMGS visa stages & percentage guide
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
          Understand every milestone from university offer letter to physical student pass endorsement in clear words.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 mt-5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('stages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stages'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            6 Macro Journey Steps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('percentages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'percentages'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Percentage Milestones (5% – 100%)
          </button>
        </div>
      </div>

      {/* View 1: 6 Macro Stages */}
      {activeTab === 'stages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-fadeIn">
          {macroStages.map((st) => (
            <div
              key={st.num}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    {st.num}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {st.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Detailed Percentage Breakdown */}
      {activeTab === 'percentages' && (
        <div className="space-y-3 animate-fadeIn">
          {percentageMilestones.map((m) => (
            <div
              key={m.percent}
              className={`p-4 rounded-2xl border ${m.color} transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <span className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {m.percent}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {m.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {m.meaning}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Color Signals Clarification Guide */}
      <div className="mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          What do the EMGS Status Color Signals Mean?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Green Status</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Standard positive progress. Documents and approvals are processing within normal turnarounds.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Yellow Status</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Action required. A document was queried, blurred, missing, or awaiting institution response.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60">
            <div className="flex items-center gap-1.5 font-bold text-red-800 dark:text-red-300 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Red Status</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Application closed, rejected by Immigration, cancelled, or withdrawn by the university.
            </p>
          </div>
        </div>
      </div>

      {/* Crucial Educational Disclaimer Banner */}
      <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          <strong className="text-slate-700 dark:text-slate-300">Important Note:</strong> EMGS displays 100% both when an application is successfully finished and when it is formally closed. Always inspect the verified status title and color indicator, never the raw numeric percentage alone.
        </p>
      </div>
    </section>
  );
};

