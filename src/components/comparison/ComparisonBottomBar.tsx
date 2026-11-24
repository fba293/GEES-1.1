/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Persistent Bottom Comparison Bar (TopUniversities-inspired Dock)
 * Slides smoothly up from the bottom when a user clicks Compare on any University or Programme.
 * Displays 3 cleanly divided sections: Compare Universities (X/4), Compare Programmes (X/4), and Shortlisted (X).
 */

import React, { useState, useEffect, useRef } from 'react';
import { useComparison, MAX_COMPARE_ITEMS } from '../../context/ComparisonContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';

interface ComparisonBottomBarProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
}

const COMPARE_DOCK_VIEWS = new Set([
  'universities',
  'courses',
  'compare-universities',
  'compare-programs',
]);

export const ComparisonBottomBar: React.FC<ComparisonBottomBarProps> = ({
  currentView,
  onNavigate,
}) => {
  const {
    comparedUniversities,
    comparedCourses,
    savedUniversities,
    isDockVisible,
    hideDock,
    feedbackMessage,
    dismissFeedback,
    toggleCompareUniversity,
    toggleCompareCourse,
    toggleSaveUniversity,
  } = useComparison();

  const { wishlist, removeFromWishlist } = useWishlist();

  const [isShortlistTrayOpen, setIsShortlistTrayOpen] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);

  const isOnComparePage =
    currentView === 'compare-universities' || currentView === 'compare-programs';
  const isOnAllowedView = COMPARE_DOCK_VIEWS.has(currentView);
  const hasComparedItems =
    comparedUniversities.length > 0 || comparedCourses.length > 0;

  // Only show on comparison pages, or on Universities/Courses pages when actively comparing
  const shouldShow =
    isOnComparePage || (isOnAllowedView && isDockVisible && hasComparedItems);

  const totalShortlisted = wishlist.length + savedUniversities.length;

  // Close shortlist tray on navigation and hide dock whenever leaving comparison-relevant pages
  useEffect(() => {
    setIsShortlistTrayOpen(false);
    if (!COMPARE_DOCK_VIEWS.has(currentView)) {
      hideDock();
    }
  }, [currentView, hideDock]);

  useEffect(() => {
    if (!isShortlistTrayOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setIsShortlistTrayOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isShortlistTrayOpen]);

  if (!shouldShow) return null;

  return (
    <div
      ref={trayRef}
      className="fixed bottom-[64px] xl:bottom-0 inset-x-0 z-[39] xl:z-[48] pointer-events-none"
      role="region"
      aria-label="Comparison and Shortlist Dock"
    >
      {/* Inline Feedback Toast (e.g., max 4 reached) */}
      {feedbackMessage && (
        <div className="pointer-events-auto max-w-xl mx-auto mb-2.5 px-3 animate-fadeIn">
          <div className="bg-[#182026] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl border border-white/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-[#fbb034] shrink-0">
                info
              </span>
              <span className="truncate">{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={dismissFeedback}
              aria-label="Dismiss notification"
              className="no-min-touch p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Upward Quick Shortlisted Tray */}
      {isShortlistTrayOpen && (
        <div className="pointer-events-auto max-w-4xl mx-auto px-3 sm:px-4 mb-2 animate-slideUp">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[52vh] xl:max-h-[60vh] flex flex-col">
            <div className="px-4 sm:px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-rose-500">
                  favorite
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Shortlisted Items ({totalShortlisted})
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsShortlistTrayOpen(false);
                    onNavigate('wishlist');
                  }}
                  className="no-min-touch text-xs font-semibold text-[#0066cc] dark:text-[#60a5fa] hover:underline cursor-pointer px-2 py-1"
                >
                  Open Wishlist Portal
                </button>
                <button
                  type="button"
                  onClick={() => setIsShortlistTrayOpen(false)}
                  aria-label="Close shortlisted tray"
                  className="no-min-touch w-7 h-7 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              {totalShortlisted === 0 ? (
                <div className="py-6 text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
                    favorite_border
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    No shortlisted universities or programmes yet
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Click Shortlist or Save on any university or programme card to bookmark it here for quick comparison.
                  </p>
                </div>
              ) : (
                <>
                  {savedUniversities.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Universities ({savedUniversities.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {savedUniversities.map((uni) => {
                          const inCompare = comparedUniversities.some((u) => u.id === uni.id);
                          return (
                            <div
                              key={uni.id}
                              className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {uni.name}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                  {uni.city}, {uni.country}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => toggleCompareUniversity(uni.id)}
                                  className={`no-min-touch px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                                    inCompare
                                      ? 'bg-[#fbb034] text-slate-950'
                                      : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800'
                                  }`}
                                >
                                  {inCompare ? 'Comparing ✓' : '+ Compare'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleSaveUniversity(uni.id)}
                                  aria-label={`Remove ${uni.name} from shortlist`}
                                  className="no-min-touch p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[15px]">close</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {wishlist.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Programmes ({wishlist.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {wishlist.map((course) => {
                          const inCompare = comparedCourses.some((c) => c.id === course.id);
                          return (
                            <div
                              key={course.id}
                              className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {course.title}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                  {course.universityName}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => toggleCompareCourse(course.id)}
                                  className={`no-min-touch px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                                    inCompare
                                      ? 'bg-[#fbb034] text-slate-950'
                                      : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800'
                                  }`}
                                >
                                  {inCompare ? 'Comparing ✓' : '+ Compare'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFromWishlist(course.id)}
                                  aria-label={`Remove ${course.title} from shortlist`}
                                  className="no-min-touch p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[15px]">close</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-Width Dark Charcoal Comparison Bottom Bar (Matching Uploaded Screenshot Exactly) */}
      <div className="pointer-events-auto w-full bg-[#232B32] text-white border-t border-white/10 shadow-[0_-6px_28px_rgba(0,0,0,0.28)] animate-slideUp">
        <div className="max-w-5xl mx-auto px-1.5 sm:px-6 flex items-stretch justify-center relative">
          {/* Tab 1: Compare Universities */}
          <button
            type="button"
            onClick={() => {
              setIsShortlistTrayOpen(false);
              onNavigate('compare-universities');
            }}
            className={`relative flex-1 sm:flex-initial min-h-[46px] sm:min-h-[56px] px-1.5 sm:px-7 md:px-10 flex items-center justify-center gap-1 sm:gap-2.5 transition-colors cursor-pointer whitespace-nowrap group ${
              currentView === 'compare-universities'
                ? 'bg-white/[0.08] text-white'
                : 'text-slate-200 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            {currentView === 'compare-universities' && (
              <span className="absolute top-0 inset-x-0 h-[2.5px] bg-[#fbb034]" aria-hidden="true" />
            )}
            <span className="material-symbols-outlined text-[17px] sm:text-[21px] text-slate-300 group-hover:text-white transition-colors shrink-0">
              account_balance
            </span>
            <span className="text-[11px] sm:text-[14.5px] font-medium tracking-[-0.01em] truncate">
              <span className="hidden xs:inline">Compare </span>Universities
            </span>
            <span className="inline-flex items-center justify-center min-w-[28px] sm:min-w-[34px] h-[19px] sm:h-[22px] px-1.5 sm:px-2 rounded-full bg-white text-[#1E242B] text-[10.5px] sm:text-[12px] font-bold tabular-nums leading-none shrink-0">
              {comparedUniversities.length}/{MAX_COMPARE_ITEMS}
            </span>
          </button>

          {/* Vertical Hairline Divider */}
          <div className="w-px self-stretch bg-white/15 my-2.5 shrink-0" aria-hidden="true" />

          {/* Tab 2: Compare Programmes */}
          <button
            type="button"
            onClick={() => {
              setIsShortlistTrayOpen(false);
              onNavigate('compare-programs');
            }}
            className={`relative flex-1 sm:flex-initial min-h-[46px] sm:min-h-[56px] px-1.5 sm:px-7 md:px-10 flex items-center justify-center gap-1 sm:gap-2.5 transition-colors cursor-pointer whitespace-nowrap group ${
              currentView === 'compare-programs'
                ? 'bg-white/[0.08] text-white'
                : 'text-slate-200 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            {currentView === 'compare-programs' && (
              <span className="absolute top-0 inset-x-0 h-[2.5px] bg-[#fbb034]" aria-hidden="true" />
            )}
            <span className="material-symbols-outlined text-[17px] sm:text-[21px] text-slate-300 group-hover:text-white transition-colors shrink-0">
              school
            </span>
            <span className="text-[11px] sm:text-[14.5px] font-medium tracking-[-0.01em] truncate">
              <span className="hidden xs:inline">Compare </span>Programmes
            </span>
            <span className="inline-flex items-center justify-center min-w-[28px] sm:min-w-[34px] h-[19px] sm:h-[22px] px-1.5 sm:px-2 rounded-full bg-white text-[#1E242B] text-[10.5px] sm:text-[12px] font-bold tabular-nums leading-none shrink-0">
              {comparedCourses.length}/{MAX_COMPARE_ITEMS}
            </span>
          </button>

          {/* Vertical Hairline Divider */}
          <div className="w-px self-stretch bg-white/15 my-2.5 shrink-0" aria-hidden="true" />

          {/* Tab 3: Shortlisted */}
          <button
            type="button"
            onClick={() => setIsShortlistTrayOpen((prev) => !prev)}
            className={`relative flex-1 sm:flex-initial min-h-[46px] sm:min-h-[56px] px-1.5 sm:px-7 md:px-10 flex items-center justify-center gap-1 sm:gap-2.5 transition-colors cursor-pointer whitespace-nowrap group ${
              isShortlistTrayOpen || currentView === 'wishlist'
                ? 'bg-white/[0.08] text-white'
                : 'text-slate-200 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            {(isShortlistTrayOpen || currentView === 'wishlist') && (
              <span className="absolute top-0 inset-x-0 h-[2.5px] bg-[#fbb034]" aria-hidden="true" />
            )}
            <span className="material-symbols-outlined text-[17px] sm:text-[21px] text-slate-300 group-hover:text-white transition-colors shrink-0">
              {totalShortlisted > 0 ? 'favorite' : 'favorite_border'}
            </span>
            <span className="text-[11px] sm:text-[14.5px] font-medium tracking-[-0.01em] truncate">
              Shortlisted
            </span>
            <span className="inline-flex items-center justify-center min-w-[20px] sm:min-w-[24px] h-[19px] sm:h-[22px] px-1.5 rounded-full bg-white text-[#1E242B] text-[10.5px] sm:text-[12px] font-bold tabular-nums leading-none shrink-0">
              {totalShortlisted}
            </span>
          </button>

          {/* Subtle Hide Bar Button when browsing outside compare pages */}
          {!isOnComparePage && (
            <>
              <div className="w-px self-stretch bg-white/15 my-2.5 shrink-0" aria-hidden="true" />
              <button
                type="button"
                onClick={() => {
                  setIsShortlistTrayOpen(false);
                  hideDock();
                }}
                title="Minimize comparison bar"
                aria-label="Minimize comparison bar"
                className="no-min-touch px-2 sm:px-3.5 min-h-[46px] sm:min-h-[56px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[19px]">keyboard_arrow_down</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonBottomBar;
