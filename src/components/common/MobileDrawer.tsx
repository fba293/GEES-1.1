/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Mobile Navigation Drawer
 * Jitter-Inspired Vertical Unfolding Motion with Staggered Cascading Menu Items
 * Coordinated with Morphing Hamburger Icon in Header
 */

import React, { useState, useEffect } from 'react';
import { mockServices } from '../../data/mockDatabase.ts';
import { UserRole } from '../../types/index.ts';
import { HAMBURGER_ANIMATION_CONFIG } from './MorphingHamburgerIcon.tsx';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, payload?: any) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onRoleChange?: (role: UserRole) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  isDark: _isDark,
  onToggleTheme: _onToggleTheme,
  onOpenSearch: _onOpenSearch,
  onRoleChange
}) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [portalTab, setPortalTab] = useState<'signin' | 'signup'>('signin');
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [headerBottom, setHeaderBottom] = useState<number>(68);

  // Dynamic pixel-accurate positioning beneath navbar on mobile, tablet, and desktop
  useEffect(() => {
    const updateHeaderPosition = () => {
      const navbarEl = document.querySelector('.gees-main-navbar');
      if (navbarEl) {
        const rect = navbarEl.getBoundingClientRect();
        setHeaderBottom(Math.round(rect.bottom + 8));
      }
    };
    updateHeaderPosition();
    window.addEventListener('resize', updateHeaderPosition, { passive: true });
    window.addEventListener('scroll', updateHeaderPosition, { passive: true });
    return () => {
      window.removeEventListener('resize', updateHeaderPosition);
      window.removeEventListener('scroll', updateHeaderPosition);
    };
  }, [isOpen]);

  // Synchronized entrance and exit transitions
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Double rAF ensures DOM paint before transition begins
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, HAMBURGER_ANIMATION_CONFIG.durationCloseMs + 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  const handleNav = (view: string, payload?: any) => {
    onNavigate(view, payload);
    onClose();
  };

  if (!isRendered) return null;

  // Snappy stagger helper for cascading entrance without layout lag
  const getItemTransitionStyle = (index: number) => ({
    transitionProperty: 'transform, opacity',
    transitionDuration: isAnimating ? '240ms' : '180ms',
    transitionTimingFunction: HAMBURGER_ANIMATION_CONFIG.easing,
    transitionDelay: isAnimating ? `${20 + index * 16}ms` : '0ms',
    transform: isAnimating ? 'translate3d(0, 0, 0)' : 'translate3d(0, -6px, 0)',
    opacity: isAnimating ? 1 : 0,
    willChange: 'transform, opacity',
  });

  return (
    <div className="fixed inset-0 z-[75] overflow-hidden pointer-events-auto">
      {/* Dimmed backdrop with smooth opacity fade */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity ease-out will-change-[opacity] ${
          isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          transitionDuration: `${isOpen ? HAMBURGER_ANIMATION_CONFIG.durationOpenMs : HAMBURGER_ANIMATION_CONFIG.durationCloseMs}ms`,
          transitionTimingFunction: HAMBURGER_ANIMATION_CONFIG.easing,
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Vertical Unfolding Navigation Panel originating immediately beneath GEES header */}
      <div
        className="fixed left-0 right-0 z-[80] px-3 xs:px-4 sm:px-6 pointer-events-none transition-all"
        style={{
          top: `${headerBottom}px`,
          transitionDuration: `${isOpen ? HAMBURGER_ANIMATION_CONFIG.durationOpenMs : HAMBURGER_ANIMATION_CONFIG.durationCloseMs}ms`,
          transitionTimingFunction: HAMBURGER_ANIMATION_CONFIG.easing,
        }}
      >
        <div
          className="pointer-events-auto mx-auto w-full max-w-lg md:max-w-xl xl:max-w-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[min(82dvh,720px)]"
          style={{
            transformOrigin: 'top center',
            transitionProperty: 'transform, opacity',
            transitionDuration: `${isOpen ? HAMBURGER_ANIMATION_CONFIG.durationOpenMs : HAMBURGER_ANIMATION_CONFIG.durationCloseMs}ms`,
            transitionTimingFunction: HAMBURGER_ANIMATION_CONFIG.easing,
            transform: isAnimating ? 'translate3d(0, 0, 0)' : 'translate3d(0, -10px, 0)',
            opacity: isAnimating ? 1 : 0,
            willChange: 'transform, opacity',
          }}
        >
          {/* Scrollable content container with natural compact flow */}
          <div className="p-3.5 xs:p-4 sm:p-5 overflow-y-auto overscroll-contain no-scrollbar flex flex-col space-y-3.5">
            <div>
              {/* Primary Navigation List with Staggered Cascading Items */}
              <nav className="space-y-1 font-sans divide-y divide-slate-100 dark:divide-slate-800/60">
                {/* Item 0: Home */}
                <div style={getItemTransitionStyle(0)} className="pt-1.5 first:pt-0">
                  <button
                    onClick={() => handleNav('home')}
                    className="w-full text-left py-2 px-2 rounded-xl text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Home</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600">arrow_forward_ios</span>
                  </button>
                </div>

                {/* Item 2: Countries Accordion */}
                <div style={getItemTransitionStyle(2)} className="pt-1.5">
                  <button
                    onClick={() => toggleSection('countries')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                  >
                    <span>Countries</span>
                    <span
                      className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${
                        openSection === 'countries' ? 'rotate-180 text-blue-600' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openSection === 'countries' && (
                    <div className="pl-3 pr-1 pt-2 pb-2 mt-1 border-l-2 border-blue-500/40 dark:border-blue-400/30 space-y-3 max-h-[340px] overflow-y-auto no-scrollbar animate-fadeIn">
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {[
                          '🇲🇾 Malaysia',
                          '🇬🇧 United Kingdom',
                          '🇦🇺 Australia',
                          '🇳🇿 New Zealand',
                          '🇧🇪 Belgium',
                          '🇫🇮 Finland',
                          '🇬🇷 Greece',
                          '🇳🇱 Netherlands',
                          '🇨🇾 Cyprus',
                          '🇲🇺 Mauritius',
                          '🇮🇳 India'
                        ].map((c, i) => (
                          <button
                            key={i}
                            onClick={() => handleNav('destinations', c.split(' ').slice(1).join(' '))}
                            className="text-left px-2.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium active:scale-[0.98] transition-all cursor-pointer truncate"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleNav('destinations')}
                        className="w-full text-center py-2 px-3 mt-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#fbb034] hover:text-slate-950 text-slate-900 dark:text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Explore All Destinations</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Item 3: Universities */}
                <div style={getItemTransitionStyle(3)} className="pt-1.5">
                  <button
                    onClick={() => handleNav('universities')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                  >
                    <span>Universities</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600">arrow_forward_ios</span>
                  </button>
                </div>

                {/* Item 4: Courses */}
                <div style={getItemTransitionStyle(4)} className="pt-1.5">
                  <button
                    onClick={() => handleNav('courses')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                  >
                    <span>Courses</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600">arrow_forward_ios</span>
                  </button>
                </div>

                {/* Item 5: Services Accordion */}
                <div style={getItemTransitionStyle(5)} className="pt-1.5">
                  <button
                    onClick={() => toggleSection('services')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                  >
                    <span>Services</span>
                    <span
                      className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${
                        openSection === 'services' ? 'rotate-180 text-blue-600' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openSection === 'services' && (
                    <div className="pl-3 pr-1 pt-2 pb-2 mt-1 border-l-2 border-blue-500/40 dark:border-blue-400/30 space-y-4 max-h-72 overflow-y-auto no-scrollbar animate-fadeIn">
                      {[
                        {
                          category: 'Admissions',
                          icon: 'school',
                          items: mockServices.filter((s) => s.category === 'Admissions'),
                        },
                        {
                          category: 'Immigration & Visas',
                          icon: 'badge',
                          items: mockServices.filter((s) => s.category === 'Immigration'),
                        },
                        {
                          category: 'Arrival & Housing',
                          icon: 'hotel',
                          items: mockServices.filter((s) => s.category === 'Arrival'),
                        },
                        {
                          category: 'Living & Travel',
                          icon: 'luggage',
                          items: mockServices.filter((s) => s.category === 'Living'),
                        },
                        {
                          category: 'Tests & Partners',
                          icon: 'psychology',
                          items: mockServices.filter((s) => s.category === 'Tests & Partners'),
                        },
                      ].map((group) => (
                        <div key={group.category} className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                            <span className="material-symbols-outlined text-[14px] text-[#fbb034]">{group.icon}</span>
                            <span>{group.category}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-xs">
                            {group.items.map((s) => (
                              <button
                                key={s.id}
                                onClick={() =>
                                  handleNav(
                                    s.slug === 'track-visa'
                                      ? 'track-visa'
                                      : s.slug === 'admission-support' ||
                                        s.slug === 'school-admission' ||
                                        s.slug === 'b2b-partnership' ||
                                        s.slug === 'student-visa-assistance' ||
                                        s.slug === 'student-visa' ||
                                        s.slug === 'dependent-visa' ||
                                        s.slug === 'dependent' ||
                                        s.slug === 'tourist-visa' ||
                                        s.slug === 'tourist' ||
                                        s.slug === 'mm2h' ||
                                        s.slug === 'health-insurance' ||
                                        s.slug === 'insurance' ||
                                        s.slug === 'flight-ticketing' ||
                                        s.slug === 'flight'
                                      ? s.slug === 'b2b-partnership'
                                        ? 'student-referral'
                                        : s.slug === 'student-visa'
                                        ? 'student-visa-assistance'
                                        : s.slug === 'dependent'
                                        ? 'dependent-visa'
                                        : s.slug === 'tourist'
                                        ? 'tourist-visa'
                                        : s.slug === 'mm2h'
                                        ? 'mm2h'
                                        : s.slug === 'insurance'
                                        ? 'health-insurance'
                                        : s.slug === 'flight-ticketing' || s.slug === 'flight'
                                        ? 'flight-ticketing'
                                        : s.slug
                                      : 'services',
                                    s.slug
                                  )
                                }
                                className="text-left px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 font-medium active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 truncate"
                              >
                                <span className="material-symbols-outlined text-[15px] text-slate-400 shrink-0">
                                  {s.iconName || 'arrow_right'}
                                </span>
                                <span className="truncate">{s.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleNav('services')}
                        className="w-full text-center py-2 px-3 mt-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#fbb034] hover:text-slate-950 text-slate-900 dark:text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Explore All Services</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Item 6: Portal Accordion */}
                <div style={getItemTransitionStyle(6)} className="pt-1.5">
                  <button
                    onClick={() => toggleSection('portal')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                  >
                    <span>Portal</span>
                    <span
                      className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${
                        openSection === 'portal' ? 'rotate-180 text-blue-600' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openSection === 'portal' && (
                    <div className="pl-3 pr-1 pt-2 pb-2 mt-1 border-l-2 border-blue-500/40 dark:border-blue-400/30 space-y-3 animate-fadeIn">
                      {/* Segmented Pill Switcher */}
                      <div className="relative flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl shadow-inner select-none">
                        <div
                          className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm transition-transform duration-300 ease-out"
                          style={{
                            transform: portalTab === 'signin' ? 'translateX(0%)' : 'translateX(100%)',
                          }}
                        />
                        <button
                          onClick={() => setPortalTab('signin')}
                          className={`relative flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 text-center text-xs font-bold transition-all duration-200 z-10 cursor-pointer rounded-lg ${
                            portalTab === 'signin' ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                          }`}
                          type="button"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Sign In</span>
                        </button>
                        <button
                          onClick={() => setPortalTab('signup')}
                          className={`relative flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 text-center text-xs font-bold transition-all duration-200 z-10 cursor-pointer rounded-lg ${
                            portalTab === 'signup' ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                          }`}
                          type="button"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          <span>Sign Up</span>
                        </button>
                      </div>

                      {/* Sign In Options */}
                      {portalTab === 'signin' && (
                        <div className="grid grid-cols-2 gap-1.5 text-xs animate-fadeIn">
                          <button
                            onClick={() => {
                              onRoleChange?.('student');
                              handleNav('student-portal');
                            }}
                            className="text-left px-2.5 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">school</span>
                            </div>
                            <span className="font-semibold text-blue-950 dark:text-blue-100 text-xs truncate">
                              Student Login
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              onRoleChange?.('agent');
                              handleNav('agent-portal');
                            }}
                            className="text-left px-2.5 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">handshake</span>
                            </div>
                            <span className="font-semibold text-emerald-950 dark:text-emerald-100 text-xs truncate">
                              Agent Login
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              onRoleChange?.('counselor');
                              handleNav('crm');
                            }}
                            className="text-left px-2.5 py-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">badge</span>
                            </div>
                            <span className="font-semibold text-indigo-950 dark:text-indigo-100 text-xs truncate">
                              Staff Login
                            </span>
                          </button>

                          <button
                            onClick={() => handleNav('universities')}
                            className="text-left px-2.5 py-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">account_balance</span>
                            </div>
                            <span className="font-semibold text-amber-950 dark:text-amber-100 text-xs truncate">
                              University
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              onRoleChange?.('admin');
                              handleNav('analytics');
                            }}
                            className="text-left px-2.5 py-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/40 hover:bg-sky-100/80 dark:hover:bg-sky-900/40 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 col-span-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                            </div>
                            <span className="font-semibold text-sky-950 dark:text-sky-100 text-xs truncate">
                              Admin & Analytics
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Sign Up Options */}
                      {portalTab === 'signup' && (
                        <div className="grid grid-cols-2 gap-1.5 text-xs animate-fadeIn">
                          <button
                            onClick={() => handleNav('apply')}
                            className="text-left px-2.5 py-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 hover:border-blue-500 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">person_add</span>
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">
                                Student
                              </span>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Join free</p>
                            </div>
                          </button>

                          <button
                            onClick={() => handleNav('agent-portal')}
                            className="text-left px-2.5 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 hover:border-emerald-500 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">group_add</span>
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">
                                Agent
                              </span>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Partner</p>
                            </div>
                          </button>

                          <button
                            onClick={() => handleNav('crm')}
                            className="text-left px-2.5 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/40 hover:border-indigo-500 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">contact_emergency</span>
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">
                                Staff
                              </span>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Onboarding</p>
                            </div>
                          </button>

                          <button
                            onClick={() => handleNav('universities')}
                            className="text-left px-2.5 py-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 hover:border-amber-500 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[15px]">domain_add</span>
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">
                                University
                              </span>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Rep Portal</p>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Item 7: Contact Accordion */}
                <div style={getItemTransitionStyle(7)} className="pt-1.5">
                  <button
                    onClick={() => toggleSection('contact')}
                    className="w-full flex items-center justify-between py-2 px-2 rounded-xl text-[19px] sm:text-[21px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                  >
                    <span>Contact</span>
                    <span
                      className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${
                        openSection === 'contact' ? 'rotate-180 text-blue-600' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openSection === 'contact' && (
                    <div className="pl-3 pr-1 pt-2 pb-2 mt-1 border-l-2 border-blue-500/40 dark:border-blue-400/30 space-y-4 max-h-72 overflow-y-auto no-scrollbar animate-fadeIn text-xs">
                      {/* Contact & Support */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                          <span className="material-symbols-outlined text-[14px] text-[#fbb034]">contact_support</span>
                          <span>Contact & Support</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          {[
                            { icon: '📞', label: 'Contact Us', action: () => handleNav('contact') },
                            { icon: '🏫', label: 'Language Centers', action: () => handleNav('apply') },
                            {
                              icon: '🎓',
                              label: 'Application Tracker',
                              action: () => {
                                onRoleChange?.('student');
                                handleNav('student-portal');
                              },
                            },
                            { icon: '📘', label: 'Students Guide', action: () => handleNav('apply') },
                            { icon: '📚', label: 'Resources', action: () => handleNav('courses') },
                            { icon: '❓', label: 'FAQs', action: () => handleNav('faq') },
                          ].map((btn, i) => (
                            <button
                              key={i}
                              onClick={btn.action}
                              className="text-left px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 truncate"
                            >
                              <span className="text-sm leading-none shrink-0">{btn.icon}</span>
                              <span className="truncate">{btn.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* About GEES */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                          <span className="material-symbols-outlined text-[14px] text-[#fbb034]">info</span>
                          <span>About Us</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          {[
                            { icon: '🏛️', label: 'About Us', action: () => handleNav('home') },
                            { icon: '👔', label: 'Director Message', action: () => handleNav('home') },
                            {
                              icon: '⭐',
                              label: 'Success Stories',
                              action: () => {
                                handleNav('home');
                                setTimeout(() => {
                                  window.scrollTo({ top: 1800, behavior: 'smooth' });
                                }, 100);
                              },
                            },
                          ].map((btn, i) => (
                            <button
                              key={i}
                              onClick={btn.action}
                              className="text-left px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 truncate"
                            >
                              <span className="text-sm leading-none shrink-0">{btn.icon}</span>
                              <span className="truncate">{btn.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* News & Updates */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                          <span className="material-symbols-outlined text-[14px] text-[#fbb034]">newspaper</span>
                          <span>News & Updates</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          {[
                            { icon: '📅', label: 'Events & Fairs', action: () => handleNav('events') },
                            { icon: '📰', label: 'News & Press', action: () => handleNav('news') },
                            { icon: '✍️', label: 'Blog & Articles', action: () => handleNav('blog') },
                          ].map((btn, i) => (
                            <button
                              key={i}
                              onClick={btn.action}
                              className="text-left px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 truncate"
                            >
                              <span className="text-sm leading-none shrink-0">{btn.icon}</span>
                              <span className="truncate">{btn.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Item 8: Drawer Footer (FOLLOW US, Hotline, Socials, Apply Button) */}
            <div
              style={getItemTransitionStyle(8)}
              className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  FOLLOW US:
                </span>
                <a
                  href="tel:+8801805529578"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200/80 dark:border-slate-700 text-[11px] font-semibold text-slate-900 dark:text-slate-100 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="tracking-tight font-medium">+880 1805 529578</span>
                </a>
              </div>

              {/* Social Channels */}
              <div className="flex items-center justify-between gap-1 flex-nowrap">
                <a
                  href="https://www.facebook.com/globaleduexpert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all text-xs font-bold shrink-0"
                  aria-label="Facebook"
                  title="Facebook Page"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/global.eduexpert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all shrink-0"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/globaleduexpert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all shrink-0"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@globaleduexpert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all shrink-0"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/601112376224"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all shrink-0"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/groups/bsim.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all shrink-0"
                  aria-label="Facebook Group"
                  title="Facebook Group"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.34-1.63.92-2.24C9.64 13.9 9.3 13 9 13z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/messages/t/globaleduexpert/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-all shrink-0"
                  aria-label="Messenger"
                  title="Facebook Messenger"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.093.303 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.963z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@globaleduexpert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-600 transition-all shrink-0"
                  aria-label="YouTube"
                  title="YouTube Channel"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>

              {/* Primary Apply Now CTA */}
              <button
                onClick={() => handleNav('apply')}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#fbb034] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Apply / Book Free Consultation</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
