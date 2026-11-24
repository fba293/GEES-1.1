import React from 'react';

export interface ExplorerBreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface ExplorerHeroSearchConfig {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder: string;
  ariaLabel?: string;
}

export interface ExplorerHeroBannerProps {
  /** Semantic identifier for the banner section */
  dataPurpose?: string;
  /** Handler when clicking the Home breadcrumb */
  onNavigateHome?: () => void;
  /** Breadcrumb items following Home; the final item is styled as the active page */
  breadcrumbs: ExplorerBreadcrumbItem[];
  /** Leading white word(s) before the gold highlighted word (default: "Find") */
  titlePrefix?: string;
  /** Gold-highlighted primary subject word in the H1 */
  titleHighlight: string;
  /** Optional trailing white word(s) after the gold highlighted word */
  titleSuffix?: string;
  /** Descriptive one-line subtitle beneath the H1 */
  subtitle: React.ReactNode;
  /** Optional full-width search bar rendered inside the hero banner */
  search?: ExplorerHeroSearchConfig;
  /** Optional right-side metric strip aligned with the heading row on large screens */
  rightSlot?: React.ReactNode;
  /** Optional top-right utility action (e.g., Back button on sub-views) */
  topRightAction?: React.ReactNode;
}

/**
 * Shared dark-navy Explorer Hero Banner & full-width search theme component.
 * Used across Countries, Universities, Courses, Services, Language Centers,
 * News, Blog & Guides, Education Fairs, Resources & Tools, and Success Stories
 * so any visual or structural update applies immediately to all pages.
 */
export const ExplorerHeroBanner: React.FC<ExplorerHeroBannerProps> = ({
  dataPurpose = 'explorer-hero-banner',
  onNavigateHome,
  breadcrumbs,
  titlePrefix = 'Find',
  titleHighlight,
  titleSuffix,
  subtitle,
  search,
  rightSlot,
  topRightAction,
}) => {
  return (
    <header
      data-purpose={dataPurpose}
      className="bg-[#0a1120] rounded-xl sm:rounded-3xl p-4 sm:p-10 mb-4 sm:mb-6 shadow-lg sm:shadow-xl relative overflow-hidden"
    >
      {topRightAction}

      {/* Breadcrumb Navigation */}
      <div
        role="navigation"
        aria-label="Breadcrumb"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] sm:text-xs font-medium text-slate-400 mb-3 sm:mb-4 max-w-full"
      >
        <button
          type="button"
          onClick={() => onNavigateHome?.()}
          className="no-min-touch inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <svg
            className="w-3 h-3 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
          </svg>
          <span>Home</span>
        </button>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={`${crumb.label}-${index}`}>
              <svg
                className="w-3 h-3 text-slate-500 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              {isLast || !crumb.onClick ? (
                <span
                  className="text-amber-400 font-semibold truncate"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="no-min-touch text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Heading Row (+ Optional Right Metric Strip) */}
      <div className={rightSlot ? 'flex flex-col lg:flex-row lg:items-end justify-between gap-6' : ''}>
        <div className="min-w-0">
          <h1 className="text-xl xs:text-2xl sm:text-5xl font-black text-white tracking-tight sm:tracking-tighter leading-snug sm:leading-tight mb-2 sm:mb-4 text-balance">
            {titlePrefix && <>{titlePrefix}{' '}</>}
            <span className="bg-[#fbb034] text-[#0a1120] px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg font-black inline-block">
              {titleHighlight}
            </span>
            {titleSuffix && <>{' '}{titleSuffix}</>}
          </h1>
          <p className="text-[11px] xs:text-xs sm:text-base text-slate-300 font-medium leading-normal truncate">
            {subtitle}
          </p>
        </div>

        {rightSlot}
      </div>

      {/* Full-Width Focal Pill Search Bar Inside Hero Banner */}
      {search && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search.onSubmit?.();
          }}
          className="mt-5 sm:mt-7 w-full flex items-center gap-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 sm:p-2 pl-4 sm:pl-5 shadow-[0_10px_28px_rgba(0,0,0,0.22)] hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-2 focus-within:ring-[#fbb034]/60 dark:focus-within:ring-[#fbb034]/40 transition-all"
        >
          <svg
            className="w-5 h-5 text-slate-600 dark:text-[#FFCC00] shrink-0 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.1"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7.5" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            aria-label={search.ariaLabel || search.placeholder}
            placeholder={search.placeholder}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className="flex-1 min-w-0 h-10 sm:h-11 bg-transparent border-0 p-0 text-sm sm:text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          {search.value && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => search.onChange('')}
              className="no-min-touch p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="no-min-touch h-10 sm:h-11 px-5 sm:px-6 rounded-xl bg-[#0d1421] hover:bg-slate-800 dark:bg-[#FFCC00] dark:hover:bg-[#f2c200] active:scale-[0.98] text-white dark:text-slate-950 text-[13px] sm:text-sm font-semibold inline-flex items-center gap-2 shrink-0 shadow-xs transition-all cursor-pointer"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7.5" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span>Search</span>
          </button>
        </form>
      )}
    </header>
  );
};

export default ExplorerHeroBanner;
