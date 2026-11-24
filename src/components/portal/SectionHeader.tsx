import React from 'react';

export interface SectionHeaderProps {
  /** Primary section heading */
  title: React.ReactNode;
  /** Optional concise supporting description */
  subtitle?: React.ReactNode;
  /** Optional quiet inline count or metadata rendered alongside the title */
  countLabel?: React.ReactNode;
  /** Optional right-aligned controls, sort, or action buttons */
  rightSlot?: React.ReactNode;
  /** Optional extra className for layout overrides while preserving mb-12 */
  className?: string;
}

/**
 * Shared SectionHeader component across all GEES Explorer & Directory pages.
 * Enforces a consistent `mb-12` bottom margin and vertically centered title alignment
 * matching the Universities, Courses, Countries, and Services design language.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  countLabel,
  rightSlot,
  className = '',
}) => {
  return (
    <div
      data-purpose="section-header"
      className={`section-header mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800 ${className}`}
    >
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h2>
          {countLabel && (
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
              {countLabel}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {rightSlot && (
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0">
          {rightSlot}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
