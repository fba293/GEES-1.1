/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * EMGS Student Visa Status Card Component
 */

import React from 'react';
import { EMGSApplicationRecord } from '../../types/visaTracking.ts';
import { OFFICIAL_EMGS_TRACKER_URL } from '../../services/visaTrackingService.ts';

interface VisaStatusCardProps {
  record: EMGSApplicationRecord;
  onClear: () => void;
}

export const VisaStatusCard: React.FC<VisaStatusCardProps> = ({ record, onClear }) => {
  const isDemo = record.dataSource === 'educational_demo';

  // Circular progress calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (record.currentPercentage / 100) * circumference;

  const isGreen = record.currentPercentage >= 70 && !record.isClosedOrRejected;
  const ringColor = record.isClosedOrRejected
    ? 'text-red-500'
    : isGreen
    ? 'text-emerald-500'
    : 'text-amber-500';

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-4" data-purpose="visa-status-result-dashboard">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Top Decorative Header Strip */}
        <div className={`h-2.5 w-full ${record.isClosedOrRejected ? 'bg-red-500' : isGreen ? 'bg-emerald-500' : 'bg-[#fbb034]'}`} />

        <div className="p-5 sm:p-8">
          {/* Top Label & Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  YOUR EMGS STATUS
                </span>
                {isDemo && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    Educational Sample Preview
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                Dear{' '}
                <span className="font-extrabold text-slate-900 dark:text-white uppercase">
                  {record.applicantNameMasked || 'STUDENT APPLICANT'}
                </span>
                , here is your latest visa status:
              </p>
            </div>

            <button
              onClick={onClear}
              type="button"
              className="self-start sm:self-center min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
            >
              Check another
            </button>
          </div>

          {/* Large Status Banner with Circular Metric */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-8">
            {/* Circular Metric */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-700"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className={`${ringColor} transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                {record.currentPercentage}%
              </span>
            </div>

            {/* Status Information */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                {record.currentStatusTitle}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>App no. {record.applicationNumber || '101365023'}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>{isDemo ? 'Educational Reference Guide' : 'Verified from EMGS'}</span>
                </span>
                <span>•</span>
                <span>Passport: {record.passportNumberMasked}</span>
              </div>
            </div>
          </div>

          {/* Progress History Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              PROGRESS HISTORY
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Chronological Timeline
            </span>
          </div>

          {/* Timeline List */}
          <div className="space-y-4 mb-6">
            {record.stages.map((stage, idx) => {
              const isLast = idx === record.stages.length - 1;
              const isFirst = idx === 0;

              return (
                <div key={stage.id} className="relative flex items-start gap-3.5 group">
                  {/* Timeline connector line */}
                  {!isLast && (
                    <span
                      className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 -ml-[1px]"
                      aria-hidden="true"
                    />
                  )}

                  {/* Dot */}
                  <div
                    className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isFirst
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/60'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {isFirst ? (
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                    )}
                  </div>

                  {/* Content & Date */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3">
                    <div className="min-w-0 pr-2">
                      <p className={`text-sm font-bold ${isFirst ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {stage.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                    {stage.date && (
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                        {stage.date}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Links & Official Verification */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <a
              href={OFFICIAL_EMGS_TRACKER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Open on official EMGS</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </a>

            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Updated from EMGS Student Application & Registration System (STARS)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
