/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Custom Floating Island Mobile Bottom Navigation Bar (GEES-1.1)
 *
 * Designed with Apple-level mobile design discipline:
 * - Liquid glass capsule glider indicator with spring physics
 * - 5 balanced interactive items:
 *   0: Home (Solid clean home)
 *   1: Universities & Programs (Media / Explore icon)
 *   2: Center Fast-Track / Quick Actions (Filter funnel with live count badge '13')
 *   3: Consultation & Search (Search & Advisor consultation trigger)
 *   4: Menu / Portal Profile Drawer (Avatar with status indicator badge)
 * - Safe-area inset bottom padding (`pb-[max(1rem,env(safe-area-inset-bottom))]`)
 * - Strictly restricted to mobile viewports (`md:hidden`)
 * - Non-overlapping layout with backdrop blur and fluid micro-interactions
 */

import React, { useState, useEffect, useRef } from 'react';

export interface FloatingBottomNavProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenConsultation?: (counselorNote?: string) => void;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenConsultation
}) => {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Map currentView to dock index:
  // 0: home
  // 1: universities or courses or destinations
  // 2: quick action filter / Fast-track trigger
  // 3: search / consultation
  // 4: profile / portal or drawer
  const getActiveIndex = (): number => {
    if (currentView === 'home') return 0;
    if (currentView === 'universities' || currentView === 'courses' || currentView === 'destinations') return 1;
    if (currentView === 'student-portal' || currentView === 'agent-portal' || currentView === 'crm') return 4;
    return 0;
  };

  const activeIndex = getActiveIndex();

  // Close quick actions modal if user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isQuickActionsOpen &&
        quickActionsRef.current &&
        !quickActionsRef.current.contains(e.target as Node)
      ) {
        setIsQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isQuickActionsOpen]);

  // Tab click handler
  const handleTabClick = (index: number) => {
    if (index === 0) {
      setIsQuickActionsOpen(false);
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (index === 1) {
      setIsQuickActionsOpen(false);
      onNavigate('universities');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (index === 2) {
      // Toggle Quick Actions Fast-Track menu
      setIsQuickActionsOpen((prev) => !prev);
    } else if (index === 3) {
      setIsQuickActionsOpen(false);
      onOpenSearch();
    } else if (index === 4) {
      setIsQuickActionsOpen(false);
      onOpenMobileMenu();
    }
  };

  // Capsule indicator horizontal positioning calculation
  // Each tab takes 20% (1/5) of the bar. We calculate the left percentage.
  // Using 5 tabs: tab 0 is centered at 10%, tab 1 at 30%, etc.
  const indicatorLeftPercent = activeIndex * 20;

  return (
    <>
      {/* Quick Actions Fast-Track Popup Modal (Triggered by Tab 2) */}
      {isQuickActionsOpen && (
        <div
          ref={quickActionsRef}
          role="dialog"
          aria-label="Quick Filters & Fast-Track Actions"
          className="md:hidden fixed bottom-24 inset-x-4 max-w-[390px] mx-auto p-4 rounded-3xl bg-white/95 dark:bg-[#151924]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 animate-in fade-in slide-in-from-bottom-4 duration-250 ease-out select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-slate-100 font-sans">
                Fast-Track Actions & Filters
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-[10px]">
                13
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsQuickActionsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action List */}
          <div className="space-y-1.5 pt-1">
            {/* Action 1: Explore Courses & Universities */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('universities');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-3 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 dark:bg-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Explore 167+ Universities</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">Browse →</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Filter by QS rank, budget, IELTS & intakes
                </div>
              </div>
            </button>

            {/* Action 2: Book 1-on-1 Consultation */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                if (onOpenConsultation) {
                  onOpenConsultation('Mobile Floating Island Fast-Track');
                } else {
                  onNavigate('contact');
                }
              }}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-3 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 text-[#fbb034] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Book Free Consultation</span>
                  <span className="text-[10px] text-amber-500 font-semibold group-hover:translate-x-0.5 transition-transform">Book →</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  1-on-1 visa & scholarship eligibility assessment
                </div>
              </div>
            </button>

            {/* Action 3: Course Comparison Engine */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-3 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Compare Courses & Fees</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">Compare →</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Side-by-side tuition, duration & degree tiers
                </div>
              </div>
            </button>

            {/* Action 4: Student Application Tracker / Portal */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('student-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-3 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 dark:bg-purple-500/25 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>EMGS Visa & Document Tracker</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">Track →</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Real-time VAL status & compliance clearance
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Island Navigation Dock */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-3 sm:bottom-4 inset-x-3.5 z-40 max-w-[400px] mx-auto select-none pointer-events-auto"
        data-purpose="floating-island-wrapper"
      >
        <div
          className="relative w-full h-[60px] xs:h-[64px] bg-white/90 dark:bg-[#131722]/90 backdrop-blur-2xl border border-slate-300/80 dark:border-white/15 rounded-full shadow-[0_14px_38px_rgba(0,0,0,0.18)] dark:shadow-[0_18px_48px_rgba(0,0,0,0.65)] px-1.5 py-1 flex items-center justify-between overflow-hidden"
          id="dock-pill"
        >
          {/* Liquid Glass Capsule Indicator Behind Active Item */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-full pointer-events-none bg-black/10 dark:bg-white/15 backdrop-blur-md border border-black/10 dark:border-white/20 shadow-inner dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)] will-change-transform"
            style={{
              width: 'calc(20% - 6px)',
              left: `calc(${indicatorLeftPercent}% + 3px)`
            }}
            aria-hidden="true"
          />

          {/* TAB 0: HOME */}
          <button
            type="button"
            onClick={() => handleTabClick(0)}
            aria-label="Home"
            aria-current={activeIndex === 0 ? 'page' : undefined}
            className={`dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 z-10 cursor-pointer ${
              activeIndex === 0
                ? 'text-[#fbb034] drop-shadow-[0_0_8px_rgba(251,176,52,0.45)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="w-full flex items-center justify-center pointer-events-none">
              <svg
                className={`tab-icon w-5 h-5 xs:w-[22px] xs:h-[22px] fill-current stroke-none transition-transform duration-200 ${
                  activeIndex === 0 ? 'scale-110' : ''
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2.69l8 6.4V20a1.5 1.5 0 0 1-1.5 1.5H14a1 1 0 0 1-1-1v-4.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1V20.5a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 20V9.09l8-6.4z" />
              </svg>
            </div>
            <span className="sr-only">Home</span>
          </button>

          {/* TAB 1: UNIVERSITIES / MEDIA EXPLORER */}
          <button
            type="button"
            onClick={() => handleTabClick(1)}
            aria-label="Universities & Programs"
            aria-current={activeIndex === 1 ? 'page' : undefined}
            className={`dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 z-10 cursor-pointer ${
              activeIndex === 1
                ? 'text-[#fbb034] drop-shadow-[0_0_8px_rgba(251,176,52,0.45)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="w-full flex items-center justify-center pointer-events-none">
              <svg
                className={`tab-icon w-5 h-5 xs:w-[22px] xs:h-[22px] stroke-current fill-none transition-transform duration-200 ${
                  activeIndex === 1 ? 'scale-110' : ''
                }`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect height="18" rx="5" width="18" x="3" y="3" />
                <polygon fill="currentColor" points="10 8 16 12 10 16 10 8" />
              </svg>
            </div>
            <span className="sr-only">Universities</span>
          </button>

          {/* TAB 2: CENTER ACTION / FILTER FAST-TRACK (With Red '13' Badge) */}
          <button
            type="button"
            onClick={() => handleTabClick(2)}
            aria-label="Quick Filters & Fast-Track Actions"
            aria-expanded={isQuickActionsOpen}
            className={`dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 z-10 cursor-pointer ${
              isQuickActionsOpen
                ? 'text-[#fbb034] drop-shadow-[0_0_8px_rgba(251,176,52,0.45)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative flex items-center justify-center pointer-events-none">
              <svg
                className={`tab-icon w-5 h-5 xs:w-[22px] xs:h-[22px] stroke-current fill-none transition-transform duration-200 ${
                  isQuickActionsOpen ? 'scale-110' : ''
                }`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              {/* Red Badge '13' matching design spec */}
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-4.5 px-1 rounded-full bg-red-500 text-white font-black text-[9px] flex items-center justify-center shadow-md border-2 border-white dark:border-[#131722] animate-bounce">
                13
              </span>
            </div>
            <span className="sr-only">Quick Filters</span>
          </button>

          {/* TAB 3: SEARCH & CONSULTATION */}
          <button
            type="button"
            onClick={() => handleTabClick(3)}
            aria-label="Search Programs & Universities"
            className="dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 z-10 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <div className="w-full flex items-center justify-center pointer-events-none">
              <svg
                className="tab-icon w-5 h-5 xs:w-[22px] xs:h-[22px] stroke-current fill-none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <span className="sr-only">Search</span>
          </button>

          {/* TAB 4: PROFILE / MENU DRAWER (Avatar with Red Status Badge) */}
          <button
            type="button"
            onClick={() => handleTabClick(4)}
            aria-label="Profile and Navigation Menu"
            className={`dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 z-10 cursor-pointer ${
              activeIndex === 4
                ? 'text-[#fbb034] drop-shadow-[0_0_8px_rgba(251,176,52,0.45)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative flex items-center justify-center pointer-events-none">
              <div
                className={`w-6 h-6 xs:w-7 xs:h-7 rounded-full overflow-hidden border transition-all duration-200 flex items-center justify-center ${
                  activeIndex === 4
                    ? 'border-[#fbb034] ring-2 ring-[#fbb034]/40 scale-105'
                    : 'border-slate-300 dark:border-white/20'
                } bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5`}
              >
                <div className="w-full h-full bg-white dark:bg-[#1b1c20] rounded-full flex items-center justify-center font-black text-[10px] text-slate-900 dark:text-white">
                  GE
                </div>
              </div>
              {/* Red active status notification dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-[#131722]" />
            </div>
            <span className="sr-only">Menu & Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default FloatingBottomNav;
