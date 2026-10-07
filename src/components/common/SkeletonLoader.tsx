/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Reusable Skeleton Loader Screens with pulse animations designed to prevent layout shift on mobile devices.
 */

import React from 'react';

export type SkeletonType = 'blog' | 'university';

interface SkeletonLoaderProps {
  type: SkeletonType;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 3 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'blog') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 flex flex-col items-stretch gap-4 animate-pulse"
          >
            {/* Image Banner Area Placeholder */}
            <div className="h-44 sm:h-48 bg-slate-200 dark:bg-slate-800/70 rounded-2xl w-full" />
            
            {/* Meta Row Placeholder */}
            <div className="flex items-center gap-3">
              <div className="h-5 bg-slate-100 dark:bg-slate-800/50 rounded-full w-20" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded-md w-24" />
            </div>

            {/* Title Placeholder */}
            <div className="h-6 bg-slate-200 dark:bg-slate-800/60 rounded-md w-11/12" />

            {/* Excerpt Placeholders */}
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded-md w-full" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded-md w-5/6" />
            </div>

            {/* Footer Row Placeholder */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded-md w-16" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800/50" />
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // University Explorer Skeleton Card Matching Exact Box Dimensions to Prevent Layout Shift
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between h-[392px] animate-pulse"
        >
          <div>
            {/* Banner Area Placeholder matching exact h-44 layout */}
            <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-800/70">
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/50" />
              <div className="absolute top-3 right-3 w-16 h-5 rounded-full bg-slate-100 dark:bg-slate-800/50" />
              <div className="absolute bottom-3 left-3 w-32 h-4 rounded bg-slate-100 dark:bg-slate-800/40" />
              <div className="absolute bottom-8 left-3 w-48 h-6 rounded bg-slate-100 dark:bg-slate-800/50" />
            </div>

            {/* Content Area Placeholder */}
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded w-full" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded w-5/6" />
              </div>

              {/* Bottom Spec Grid Placeholder */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <div className="space-y-1.5">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/30 rounded w-16" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-24" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/30 rounded w-16" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Apply Button Placeholder */}
          <div className="p-5 pt-0">
            <div className="h-10 bg-slate-200 dark:bg-slate-800/60 rounded-xl w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
