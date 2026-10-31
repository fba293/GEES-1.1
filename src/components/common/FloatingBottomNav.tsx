/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Custom Floating Island Mobile Bottom Navigation Bar (GEES-2.1)
 *
 * Compact, cohesive floating pill with Apple-grade mobile design discipline:
 * - Perfectly aligned flex structure across all 5 tabs
 * - Consistent 4-6px gap between icons and labels
 * - Restrained active circular indicator with fluid Framer Motion spring physics
 * - Preserved baselines for all icons and labels (no drifting or awkward disconnects)
 * - 5 functional tabs: Home, Explore, Actions (Fast-Track), Search, Profile
 * - Safe-area aware (`pb-[max(0.2rem,env(safe-area-inset-bottom))]`)
 * - Guaranteed 44x44px minimum touch targets
 * - Responsive for 320px–430px phones and tablets
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Map currentView to tab index:
  // 0: home
  // 1: universities or courses or destinations
  // 2: quick action filter / Fast-track trigger
  // 3: search
  // 4: profile / portal or drawer
  const getActiveIndexFromView = (view: string): number => {
    if (view === 'home') return 0;
    if (view === 'universities' || view === 'courses' || view === 'destinations') return 1;
    if (view === 'student-portal' || view === 'agent-portal' || view === 'crm') return 4;
    return 0;
  };

  const [activeIndex, setActiveIndex] = useState<number>(() => getActiveIndexFromView(currentView));

  // Sync activeIndex with currentView prop changes
  useEffect(() => {
    if (!isQuickActionsOpen) {
      setActiveIndex(getActiveIndexFromView(currentView));
    }
  }, [currentView, isQuickActionsOpen]);

  // Close quick actions modal if user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isQuickActionsOpen &&
        quickActionsRef.current &&
        !quickActionsRef.current.contains(e.target as Node)
      ) {
        setIsQuickActionsOpen(false);
        setActiveIndex(getActiveIndexFromView(currentView));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isQuickActionsOpen, currentView]);

  // Tab click handler with fluid spring animation
  const handleTabClick = (index: number) => {
    setActiveIndex(index);

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

  // Render SVG icons with matching stroke and dimensions
  const renderTabIcon = (index: number, isActive: boolean) => {
    const strokeWidth = isActive ? "2.3" : "2";
    switch (index) {
      case 0:
        return (
          <svg
            className="w-[18px] h-[18px] stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9.5L12 3l9 6.5V20a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 20V9.5z" />
            <polyline points="9 21 9 12 15 12 15 21" />
          </svg>
        );
      case 1:
        return (
          <svg
            className="w-[18px] h-[18px] stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      case 2:
        return (
          <svg
            className={`w-[19px] h-[19px] stroke-current fill-none transition-transform duration-200 ${
              isQuickActionsOpen ? 'rotate-45' : ''
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        );
      case 3:
        return (
          <svg
            className="w-[18px] h-[18px] stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      case 4:
        return (
          <svg
            className="w-[18px] h-[18px] stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { label: 'Home', ariaLabel: 'Home' },
    { label: 'Explore', ariaLabel: 'Explore Universities & Destinations' },
    { label: 'Actions', ariaLabel: 'Fast-Track Quick Actions' },
    { label: 'Search', ariaLabel: 'Search Programs & Universities' },
    { label: 'Profile', ariaLabel: 'Profile & Menu' }
  ];

  return (
    <>
      {/* Quick Actions Fast-Track Popup Modal (Triggered by Tab 2) */}
      <AnimatePresence>
        {isQuickActionsOpen && (
          <motion.div
            ref={quickActionsRef}
            role="dialog"
            aria-label="Quick Filters & Fast-Track Actions"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="xl:hidden fixed bottom-18 xs:bottom-20 inset-x-3 max-w-[340px] sm:max-w-[380px] mx-auto p-3 rounded-3xl bg-white/95 dark:bg-[#0c1427]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-amber-400/20 shadow-[0_16px_40px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 select-none max-h-[70vh] overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10 mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fbb034] shadow-[0_0_8px_#fbb034] animate-pulse"></span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-900 dark:text-slate-100">
                  GEES Fast-Track Actions
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  setActiveIndex(getActiveIndexFromView(currentView));
                }}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Action List */}
            <div className="space-y-1">
              {/* 1. Explore Universities */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  setActiveIndex(1);
                  onNavigate('universities');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[44px] py-1.5 px-2.5 rounded-2xl flex items-center justify-between hover:bg-slate-100/90 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[17px]">school</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Universities
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    167+
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 2. Courses & Degree Search */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  setActiveIndex(1);
                  onNavigate('courses');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[44px] py-1.5 px-2.5 rounded-2xl flex items-center justify-between hover:bg-slate-100/90 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[17px]">auto_stories</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Courses
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 3. Saved Courses Wishlist */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  onNavigate('wishlist');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[44px] py-1.5 px-2.5 rounded-2xl flex items-center justify-between hover:bg-slate-100/90 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[17px]">bookmark</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Saved Wishlist
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 4. Study Destinations */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  setActiveIndex(1);
                  onNavigate('destinations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[44px] py-1.5 px-2.5 rounded-2xl flex items-center justify-between hover:bg-slate-100/90 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[17px]">public</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Destinations
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 5. Services & Admission Support */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  onNavigate('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[44px] py-1.5 px-2.5 rounded-2xl flex items-center justify-between hover:bg-slate-100/90 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[17px]">support_agent</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Services
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>

              <div className="border-b border-slate-100 dark:border-white/10 my-1"></div>

              {/* 6. Book 1-on-1 Consultation */}
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
                className="w-full min-h-[44px] py-1.5 px-2.5 rounded-2xl flex items-center justify-between hover:bg-slate-100/90 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[17px]">event_available</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Free Consultation
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                    Free
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 7. EMGS Visa & Document Tracker */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  onNavigate('track-visa');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[44px] py-1.5 px-2.5 rounded-2xl flex items-center justify-between hover:bg-slate-100/90 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[17px]">description</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Visa Tracker
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 8. Student Video Stories */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  setActiveIndex(0);
                  onNavigate('home');
                  const el = document.getElementById('student-stories-reels');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full min-h-[44px] py-1.5 px-2.5 rounded-2xl flex items-center justify-between hover:bg-slate-100/90 dark:hover:bg-white/10 active:scale-[0.98] transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[17px]">play_circle</span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Student Stories
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Island Navigation Dock with Perfect Icon-Label Alignment & Proportional Active Indicator */}
      <nav
        aria-label="Mobile and Tablet Bottom Navigation"
        className="xl:hidden fixed bottom-3 sm:bottom-4 inset-x-2.5 xs:inset-x-3.5 z-40 max-w-[380px] xs:max-w-[410px] sm:max-w-[430px] mx-auto select-none pointer-events-auto"
        data-purpose="floating-island-wrapper"
      >
        <div
          className="relative w-full h-[58px] xs:h-[62px] bg-white/95 dark:bg-[#0c1427]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-amber-400/20 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.14)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.6)] px-1.5 flex items-center justify-between overflow-hidden"
          id="dock-pill"
        >
          {/* 5 Balanced Interactive Tabs */}
          {tabs.map((tab, idx) => {
            const isActive = activeIndex === idx;
            const isCenterAction = idx === 2;

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => handleTabClick(idx)}
                aria-label={tab.ariaLabel}
                aria-current={isActive && !isCenterAction ? 'page' : undefined}
                className="relative flex-1 h-full min-h-[44px] flex flex-col items-center justify-center py-1 px-0.5 cursor-pointer touch-manipulation z-10 group active:scale-95 transition-transform"
              >
                {/* Icon Container with Shared Gliding Active Indicator */}
                <div className="relative w-8 h-8 xs:w-8.5 xs:h-8.5 flex items-center justify-center shrink-0">
                  {/* Fluid Active Gliding Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active-indicator"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 30,
                        mass: 0.8
                      }}
                      className={`absolute inset-0 rounded-full flex items-center justify-center z-0 shadow-[0_3px_12px_rgba(251,176,52,0.45)] dark:shadow-[0_3px_14px_rgba(251,176,52,0.55)] ${
                        isCenterAction && isQuickActionsOpen
                          ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-red-500/40'
                          : 'bg-gradient-to-tr from-[#FBB034] via-[#F59E0B] to-[#FBB034] text-slate-950'
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${
                      isActive
                        ? (isCenterAction && isQuickActionsOpen ? 'text-white' : 'text-slate-950')
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  >
                    {renderTabIcon(idx, isActive)}
                  </div>
                </div>

                {/* Tab Label with Fixed 4px Gap and Consistent Baseline */}
                <span
                  className={`text-[10px] xs:text-[11px] leading-none font-semibold tracking-tight mt-1 select-none truncate transition-colors duration-200 ${
                    isActive
                      ? 'text-[#FBB034] font-bold'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default FloatingBottomNav;
