/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 8: Intakes & Application Deadlines
 */

import React from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';

interface IntakeTimelineProps {
  data: StudyDestinationData;
  onOpenConsultation: (counselor?: string) => void;
}

export const IntakeTimeline: React.FC<IntakeTimelineProps> = ({
  data,
  onOpenConsultation
}) => {
  return (
    <section className="w-full bg-slate-50 dark:bg-[#070D1E] py-12 sm:py-20 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Intakes & Application Deadlines for </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              {data.countryName}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Plan your preparation timeline carefully to ensure adequate time for document verification and student visa lodging.
          </p>
        </div>

        {/* Intakes Table / Cards Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-slate-100 dark:bg-slate-800/80 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
            <div className="col-span-3">Intake Session</div>
            <div className="col-span-2">Starting Month</div>
            <div className="col-span-2">Application Deadline</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Guidance Notes</div>
          </div>

          {/* Intake Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.intakes.map((intake, idx) => (
              <div
                key={idx}
                className="p-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Intake Name */}
                <div className="md:col-span-3">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Intake Session</span>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {intake.name}
                  </p>
                </div>

                {/* Starting Month */}
                <div className="md:col-span-2">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Start Month</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-amber-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">event</span>
                    <span>{intake.startMonth}</span>
                  </span>
                </div>

                {/* Deadline */}
                <div className="md:col-span-2">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Recommended Deadline</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {intake.deadline}
                  </span>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Status</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                    intake.status === 'Open'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    <span>{intake.status} Now</span>
                  </span>
                </div>

                {/* Notes & Action */}
                <div className="md:col-span-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {intake.notes}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(`Apply for ${intake.name} in ${data.countryName}`)}
                    className="self-start md:self-auto py-2 px-3 rounded-lg bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer min-h-[36px]"
                  >
                    Start Entry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Early Application Guidance Banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500 text-2xl shrink-0">info</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Early Application Advantage
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Applying 3 to 4 months prior to intake start ensures prime university accommodation choices and sufficient time for visa lodging.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenConsultation(`Timeline Planning for ${data.countryName}`)}
            className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shrink-0 cursor-pointer min-h-[44px]"
          >
            Plan My Timeline
          </button>
        </div>
      </div>
    </section>
  );
};

export default IntakeTimeline;
