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
          className="md:hidden fixed bottom-24 inset-x-4 max-w-[390px] mx-auto p-3.5 sm:p-4 rounded-3xl bg-white/95 dark:bg-[#151924]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 animate-in fade-in slide-in-from-bottom-4 duration-250 ease-out select-none max-h-[78vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/10 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-slate-100 font-sans">
                Quick Actions & Navigation
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

          {/* Action List - Screenshot Styled Menu Items */}
          <div className="space-y-1">
            {/* 1. Explore Universities */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('universities');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">school</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  Universities & Partner Colleges
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  167+
                </span>
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            {/* 2. Courses & Degree Search */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">auto_stories</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  Courses & Degree Search
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            {/* 3. Study Destinations */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">public</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  Study Destinations
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            {/* 4. Services & Admission Support */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">support_agent</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  Services & Admission Support
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            <div className="border-b border-slate-100 dark:border-white/10 my-1"></div>

            {/* 5. Book 1-on-1 Consultation */}
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
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">event_available</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  Free Counselor Consultation
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                  Free
                </span>
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            {/* 6. EMGS Visa & Document Tracker */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('student-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">description</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  Visa & Document Tracker
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            {/* 7. Student Video Stories */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                onNavigate('home');
                const el = document.getElementById('student-stories-reels');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">play_circle</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  Student Video Stories & Reels
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            {/* 8. Blogs & Latest News */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                if (typeof window !== 'undefined') window.location.href = '/blog.html';
              }}
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">newspaper</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  Blogs & News Updates
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            {/* 9. FAQ & Knowledge Center */}
            <button
              type="button"
              onClick={() => {
                setIsQuickActionsOpen(false);
                if (typeof window !== 'undefined') window.location.href = '/faq.html';
              }}
              className="w-full py-2.5 px-3 rounded-2xl flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">help_outline</span>
                </div>
                <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  FAQ & Knowledge Center
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* Floating Island Navigation Dock */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-3 sm:bottom-4 inset-x-2 xs:inset-x-3.5 z-40 max-w-[440px] xs:max-w-[480px] mx-auto select-none pointer-events-auto"
        data-purpose="floating-island-wrapper"
      >
        <div
          className="relative w-full h-[62px] xs:h-[68px] bg-white/92 dark:bg-[#131722]/92 backdrop-blur-2xl border border-slate-300/80 dark:border-white/15 rounded-full shadow-[0_14px_38px_rgba(0,0,0,0.18)] dark:shadow-[0_18px_48px_rgba(0,0,0,0.65)] px-2 py-1 flex items-center justify-between overflow-visible"
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
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <svg
                className={`tab-icon w-4 h-4 xs:w-[18px] xs:h-[18px] stroke-current fill-none transition-transform duration-200 ${
                  activeIndex === 0 ? 'scale-110' : ''
                }`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="text-[10px] xs:text-[11px] font-semibold mt-0.5 tracking-tight">Home</span>
            </div>
          </button>

          {/* TAB 1: EXPLORE */}
          <button
            type="button"
            onClick={() => handleTabClick(1)}
            aria-label="Explore"
            aria-current={activeIndex === 1 ? 'page' : undefined}
            className={`dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 z-10 cursor-pointer ${
              activeIndex === 1
                ? 'text-[#fbb034] drop-shadow-[0_0_8px_rgba(251,176,52,0.45)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <svg
                className={`tab-icon w-4 h-4 xs:w-[18px] xs:h-[18px] stroke-current fill-none transition-transform duration-200 ${
                  activeIndex === 1 ? 'scale-110' : ''
                }`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span className="text-[10px] xs:text-[11px] font-semibold mt-0.5 tracking-tight">Explore</span>
            </div>
          </button>

          {/* TAB 2: CENTER THEME PLUS BUTTON (Triggers Fast-Track Actions Modal) */}
          <button
            type="button"
            onClick={() => handleTabClick(2)}
            aria-label="Quick Fast-Track Actions"
            aria-expanded={isQuickActionsOpen}
            className="dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-95 transition-transform duration-200 z-20 cursor-pointer group -mt-3.5 xs:-mt-4"
          >
            <div className="relative flex flex-col items-center pointer-events-none">
              {/* Theme-matching circular Plus button */}
              <div
                className={`w-11 h-11 xs:w-12 xs:h-12 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 dark:from-[#fbb034] dark:to-[#ff9300] text-slate-950 flex items-center justify-center shadow-[0_6px_20px_rgba(251,176,52,0.55)] dark:shadow-[0_8px_25px_rgba(251,176,52,0.65)] ring-4 ring-white/90 dark:ring-[#131722]/90 transition-all duration-300 ${
                  isQuickActionsOpen
                    ? 'rotate-45 scale-105 !bg-red-500 !from-red-500 !to-rose-600 text-white !shadow-red-500/50'
                    : 'group-hover:scale-105'
                }`}
              >
                <svg
                  className="w-6 h-6 stroke-[2.8] stroke-current fill-none transition-transform duration-300"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>

              <span
                className={`text-[10px] xs:text-[11px] font-bold mt-1 tracking-tight transition-colors ${
                  isQuickActionsOpen ? 'text-[#fbb034]' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Actions
              </span>
            </div>
          </button>

          {/* TAB 3: SEARCH */}
          <button
            type="button"
            onClick={() => handleTabClick(3)}
            aria-label="Search"
            className="dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 z-10 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <svg
                className="tab-icon w-4 h-4 xs:w-[18px] xs:h-[18px] stroke-current fill-none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="text-[10px] xs:text-[11px] font-semibold mt-0.5 tracking-tight">Search</span>
            </div>
          </button>

          {/* TAB 4: PROFILE */}
          <button
            type="button"
            onClick={() => handleTabClick(4)}
            aria-label="Profile"
            className={`dock-tab relative flex-1 h-full flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 z-10 cursor-pointer ${
              activeIndex === 4
                ? 'text-[#fbb034] drop-shadow-[0_0_8px_rgba(251,176,52,0.45)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <svg
                className="tab-icon w-4 h-4 xs:w-[18px] xs:h-[18px] stroke-current fill-none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="text-[10px] xs:text-[11px] font-semibold mt-0.5 tracking-tight">Profile</span>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
};

export default FloatingBottomNav;
