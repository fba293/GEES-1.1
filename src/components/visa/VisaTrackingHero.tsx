/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * EMGS Student Visa Tracking Hero Section
 */

import React from 'react';

export const VisaTrackingHero: React.FC = () => {
  return (
    <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 px-4" data-purpose="visa-hero-section">
      {/* Live Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4 sm:mb-6 shadow-xs select-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="tracking-wide uppercase font-bold text-[11px]">EMGS VISA TRACKING</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl min-[390px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4 text-balance">
        Track Malaysia student visas by{' '}
        <span className="inline-block bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-2xl font-black tracking-tight leading-none shadow-sm mt-1 sm:mt-0">
          passport
        </span>
      </h1>

      {/* Supporting Description */}
      <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Check your Malaysia student visa for free—no login required.
      </p>
    </div>
  );
};
