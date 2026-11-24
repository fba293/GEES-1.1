import React from 'react';
import { ExplorerHeroBanner, ExplorerHeroBannerProps } from './ExplorerHeroBanner.tsx';
import { SectionHeader, SectionHeaderProps } from './SectionHeader.tsx';

/**
 * Single Source of Truth — GEES Unified Explorer Theme Tokens.
 * Editing any token or shared component here immediately updates:
 * Countries, Universities, Courses, Services, Language Centers,
 * News & Visa Bulletins, Study Abroad Blog & Guides, Education Fairs,
 * Study Abroad Resources & Tools, and Student Success Stories.
 */
export const EXPLORER_THEME = {
  pageOuterWrapper: 'py-2 max-w-[95%] mx-auto w-full',
  pageContainer: 'w-full max-w-[1600px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-2 sm:py-4',
  heroBanner:
    'bg-[#0a1120] rounded-xl sm:rounded-3xl p-4 sm:p-10 mb-5 sm:mb-6 shadow-lg sm:shadow-xl relative overflow-hidden',
  card:
    'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200',
  cardPadding: 'p-5 sm:p-6',
  iconTile:
    'w-11 h-11 rounded-xl bg-[#314158] text-white flex items-center justify-center shrink-0 shadow-xs',
  primaryGoldButton:
    'inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#FFCC00] hover:bg-[#f2c200] active:scale-[0.98] text-slate-950 font-bold text-xs sm:text-[13px] shadow-xs transition-all cursor-pointer whitespace-nowrap',
  primaryDarkButton:
    'inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#0a1120] hover:bg-slate-800 dark:bg-[#FFCC00] dark:hover:bg-[#f2c200] active:scale-[0.98] text-white dark:text-slate-950 font-bold text-xs sm:text-[13px] shadow-xs transition-all cursor-pointer whitespace-nowrap',
  secondaryOutlineButton:
    'inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-[13px] transition-all cursor-pointer whitespace-nowrap',
  filterButtonActive:
    'bg-[#0a1120] text-white dark:bg-[#FFCC00] dark:text-slate-950 border-[#0a1120] dark:border-[#FFCC00] shadow-xs',
  filterButtonIdle:
    'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white',
  searchInput:
    'rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all',
  searchInputWrapper:
    'rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all',
  filterDropdownPanel:
    'rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden',
  metadataRow: 'flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400',
  modalBackdrop:
    'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn',
  modalPanel:
    'bg-white dark:bg-[#0B1329] rounded-2xl sm:rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto',
} as const;

export interface ExplorerPageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared page shell guaranteeing identical horizontal max-width, gutters, and vertical rhythm
 * across all GEES explorer and directory views.
 */
export const ExplorerPageShell: React.FC<ExplorerPageShellProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`${EXPLORER_THEME.pageContainer} ${className}`}>
      {children}
    </div>
  );
};

export interface ExplorerMetricItem {
  value: React.ReactNode;
  label: string;
  suffix?: React.ReactNode;
}

/**
 * Shared right-hand hero metric strip (used inside ExplorerHeroBanner rightSlot).
 */
export const ExplorerHeroMetrics: React.FC<{ items: ExplorerMetricItem[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 pt-3 lg:pt-0 border-t border-white/10 lg:border-t-0 shrink-0">
      {items.map((item) => (
        <div key={item.label}>
          <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
            {item.value}
            {item.suffix && <span className="text-[#fbb034] ml-0.5">{item.suffix}</span>}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export interface ExplorerFilterOption {
  id: string;
  label: string;
}

export interface ExplorerFilterBarProps {
  options: ExplorerFilterOption[];
  activeId: string;
  onSelect: (id: string) => void;
  totalCount: number;
  countEntityLabel: string;
  rightSlot?: React.ReactNode;
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

/**
 * Shared quiet secondary controls bar beneath ExplorerHeroBanner.
 */
export const ExplorerFilterBar: React.FC<ExplorerFilterBarProps> = ({
  options,
  activeId,
  onSelect,
  totalCount,
  countEntityLabel,
  rightSlot,
  onReset,
  hasActiveFilters = false,
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 shrink-0 mr-1">
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            Total {countEntityLabel}:
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums">
            {totalCount.toLocaleString()}
          </span>
        </div>

        <span className="hidden sm:inline-block h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {options.map((opt) => {
            const isActive = opt.id === activeId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect(opt.id)}
                className={`no-min-touch h-8 px-3.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive ? EXPLORER_THEME.filterButtonActive : EXPLORER_THEME.filterButtonIdle
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="no-min-touch text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline underline-offset-2 ml-1 cursor-pointer shrink-0"
          >
            Reset
          </button>
        )}
      </div>

      {rightSlot && (
        <div className="flex items-center gap-2 shrink-0">{rightSlot}</div>
      )}
    </div>
  );
};

export interface ExplorerEmptyStateProps {
  icon: string;
  title: string;
  description: string;
  onReset?: () => void;
  resetLabel?: string;
}

/**
 * Shared empty state card matching the Universities/Courses/Services aesthetic.
 */
export const ExplorerEmptyState: React.FC<ExplorerEmptyStateProps> = ({
  icon,
  title,
  description,
  onReset,
  resetLabel = 'Reset Filters',
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 sm:p-14 text-center space-y-3 mb-12">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>
      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {onReset && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            className={EXPLORER_THEME.primaryDarkButton}
          >
            {resetLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export interface ExplorerCtaBannerProps {
  title: string;
  description: string;
  primaryLabel: string;
  onPrimaryClick: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  onSecondaryClick?: () => void;
}

/**
 * Shared dark-navy bottom consultation CTA banner matching the dark hero & gold accent theme.
 */
export const ExplorerCtaBanner: React.FC<ExplorerCtaBannerProps> = ({
  title,
  description,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  secondaryHref,
  onSecondaryClick,
}) => {
  return (
    <section className="mt-12 bg-[#0a1120] rounded-xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onPrimaryClick}
          className="px-6 py-3 rounded-full bg-[#FFCC00] hover:bg-[#f2c200] active:scale-[0.98] text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shadow-xs"
        >
          {primaryLabel}
        </button>
        {secondaryLabel && secondaryHref && (
          <a
            href={secondaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs sm:text-sm transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>{secondaryLabel}</span>
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </a>
        )}
        {secondaryLabel && !secondaryHref && onSecondaryClick && (
          <button
            type="button"
            onClick={onSecondaryClick}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </section>
  );
};

export { ExplorerHeroBanner, SectionHeader };
export type { ExplorerHeroBannerProps, SectionHeaderProps };
