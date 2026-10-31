import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../../types/index.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { HeaderCurrencyExchangeIcon } from '../CurrencySwitcher.tsx';
import { ThemeToggle } from '../ThemeToggle.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';

import { MorphingHamburgerIcon } from './MorphingHamburgerIcon.tsx';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isMobileMenuOpen?: boolean;
}

function useScrollHeader(compactThreshold = 50, expandThreshold = 30) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    let rafId: number | null = null;

    const updateScrollState = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const currentlyScrolled = isScrolledRef.current;

      if (!currentlyScrolled && scrollY > compactThreshold) {
        isScrolledRef.current = true;
        React.startTransition(() => {
          setIsScrolled(true);
        });
      } else if (currentlyScrolled && scrollY < expandThreshold) {
        isScrolledRef.current = false;
        React.startTransition(() => {
          setIsScrolled(false);
        });
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [compactThreshold, expandThreshold]);

  return isScrolled;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeRole,
  onRoleChange,
  onOpenMobileMenu,
  onOpenSearch,
  isDark,
  onToggleTheme,
  isMobileMenuOpen = false
}) => {
  const isScrolled = useScrollHeader(50, 30);
  const { wishlistCount } = useWishlist();
  const [portalTab, setPortalTab] = useState<'signin' | 'signup'>('signin');
  const [portalOpen, setPortalOpen] = useState(false);
  const portalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 21st.dev inspired shared hover indicator and smooth mega dropdown navigation states
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavItemEnter = (itemKey: string, hasDropdown = false) => {
    if (navCloseTimeoutRef.current) {
      clearTimeout(navCloseTimeoutRef.current);
      navCloseTimeoutRef.current = null;
    }
    setHoveredNav(itemKey);
    if (hasDropdown) {
      setActiveDropdown(itemKey);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleNavMenuLeave = () => {
    navCloseTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
      setActiveDropdown(null);
    }, 180);
  };

  const handleDropdownPanelEnter = () => {
    if (navCloseTimeoutRef.current) {
      clearTimeout(navCloseTimeoutRef.current);
      navCloseTimeoutRef.current = null;
    }
  };

  const handleMenuNavigate = (view: string, payload?: any) => {
    setHoveredNav(null);
    setActiveDropdown(null);
    onNavigate(view, payload);
  };

  const handlePortalEnter = () => {
    if (portalTimeoutRef.current) clearTimeout(portalTimeoutRef.current);
    setPortalOpen(true);
  };

  const handlePortalLeave = () => {
    portalTimeoutRef.current = setTimeout(() => {
      setPortalOpen(false);
    }, 220);
  };

  const scrolledBtnClass = isScrolled
    ? (isDark
        ? 'border-white/20 bg-white/10 text-white hover:border-[#fbb034] hover:text-[#fbb034]'
        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-100 hover:text-blue-600 shadow-xs')
    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600';

  return (
    <header className={`gees-header-wrapper ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-open !z-[85]' : ''}`}>
      {/* 1. Top Information Bar (Dreambuzz-Architecture Reference) */}
      <div className="gees-topbar-wrapper select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between text-xs font-medium text-white/90">
          {/* Left Block: Help Line & Office Hours */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/8801805529578"
              target="_blank"
              rel="noopener noreferrer"
              title="Direct WhatsApp Helpline"
              className="flex items-center gap-1.5 text-white/90 hover:text-[#fbb034] transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[15px] text-[#fbb034] group-hover:scale-110 transition-transform">
                call
              </span>
              <span className="text-white/70 hidden min-[400px]:inline">Help Line:</span>
              <strong className="text-white font-semibold tracking-wide font-mono">+880 1805-529578</strong>
            </a>
            <span className="text-white/20 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-white/70">
              <span className="material-symbols-outlined text-[14px] text-amber-400">schedule</span>
              <span>Sun – Thu: 10:00 AM – 5:00 PM</span>
            </div>
          </div>

          {/* Right Block: Email & Social Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="mailto:info@globaleducationexpert.com"
              className="hidden lg:flex items-center gap-1.5 text-white/80 hover:text-[#fbb034] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-[#fbb034]">mail</span>
              <span>info@globaleducationexpert.com</span>
            </a>

            {/* Social Icons matching Dreambuzz Top-Bar circular pill buttons */}
            <div className="flex items-center gap-1.5">
              {[
                {
                  name: 'Facebook',
                  href: 'https://www.facebook.com/globaleduexpert',
                  icon: (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.69 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                    </svg>
                  )
                },
                {
                  name: 'WhatsApp',
                  href: 'https://wa.me/8801805529578',
                  icon: (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  )
                },
                {
                  name: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/globaleduexpert',
                  icon: (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  )
                },
                {
                  name: 'YouTube',
                  href: 'https://www.youtube.com/@globaleduexpert',
                  icon: (
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  )
                }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-6 h-6 rounded-full border border-white/25 hover:border-[#fbb034] text-white/80 hover:text-[#fbb034] hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Fluid Morphing */}
      <div
        className={`gees-main-navbar ${
          isScrolled ? (isDark ? 'scrolled-dark' : 'scrolled-light') : 'expanded'
        } -mt-1 xs:-mt-1.5 sm:mt-0 px-3 xs:px-4 sm:px-6 md:px-7 lg:px-8 xl:px-10 h-[60px] sm:h-[72px] flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-6 rounded-full shadow-lg shadow-black/5 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800`}
      >
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-auto group shrink-0 focus:outline-none cursor-pointer select-none"
        >
          <span
            className={`gees-brand-text text-[28px] xs:text-[30px] sm:text-[28px] lg:text-[32px] font-extrabold tracking-tight leading-none transition-colors duration-300 ${
              isScrolled ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-900 dark:text-white'
            }`}
            style={{ fontFamily: '"ITC Benguiat", "Benguiat", serif', fontWeight: 700 }}
          >
            GEES
          </span>
          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#fbb034] shadow-xs"></span>
        </div>

        {/* Universal Desktop Navigation Bar with 21st.dev Shared Hover-Follow Indicator */}
        <nav
          className="hidden xl:flex items-center gap-1.5 lg:gap-2 text-sm font-semibold select-none"
          onMouseLeave={handleNavMenuLeave}
        >
          {/* 1. Countries Mega-Menu */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleNavItemEnter('countries', true)}
          >
            <button
              type="button"
              className={`relative px-3.5 py-2 rounded-full flex items-center gap-1 transition-colors font-semibold cursor-pointer z-10 ${
                currentView === 'destinations'
                  ? (isScrolled
                      ? (isDark ? 'text-[#fbb034] font-bold' : 'text-blue-600 font-bold')
                      : 'text-blue-600 dark:text-blue-400 font-bold')
                  : (isScrolled
                      ? (isDark ? 'text-white/90 hover:text-white' : 'text-slate-800 hover:text-slate-950')
                      : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
              }`}
            >
              <AnimatePresence>
                {hoveredNav === 'countries' && (
                  <motion.div
                    layoutId="navbar-hover-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 rounded-full -z-10 ${
                      isScrolled
                        ? (isDark ? 'bg-white/12 border border-white/20' : 'bg-slate-200/80 border border-slate-300/60 shadow-xs')
                        : (isDark ? 'bg-white/10 border border-white/15' : 'bg-slate-100/90 border border-slate-200/80 shadow-xs')
                    }`}
                    transition={{ type: 'spring', stiffness: 440, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span>Countries</span>
            </button>

            {/* Countries Mega Dropdown Panel with Smooth Animated Reveal */}
            <AnimatePresence>
              {activeDropdown === 'countries' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={handleDropdownPanelEnter}
                  onMouseLeave={handleNavMenuLeave}
                  className="absolute top-[calc(100%+2px)] -left-20 w-[680px] bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-50 pt-5 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
                >
                  <div className="grid grid-cols-3 gap-6">
                    {/* Popular */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">star</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                          Popular
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {[
                          { flag: '🇲🇾', name: 'Malaysia' },
                          { flag: '🇬🇧', name: 'United Kingdom' },
                          { flag: '🇦🇺', name: 'Australia' },
                          { flag: '🇳🇿', name: 'New Zealand' }
                        ].map((c) => (
                          <li key={c.name}>
                            <button
                              onClick={() => handleMenuNavigate('destinations', c.name)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                            >
                              <span className="text-lg leading-none">{c.flag}</span>
                              <span>{c.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Europe */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">euro_symbol</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                          Europe
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {[
                          { flag: '🇧🇪', name: 'Belgium' },
                          { flag: '🇫🇮', name: 'Finland' },
                          { flag: '🇬🇷', name: 'Greece' },
                          { flag: '🇳🇱', name: 'Netherlands' }
                        ].map((c) => (
                          <li key={c.name}>
                            <button
                              onClick={() => handleMenuNavigate('destinations', c.name)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                            >
                              <span className="text-lg leading-none">{c.flag}</span>
                              <span>{c.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Asia & More */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">travel_explore</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                          Mediterranean & Asia
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {[
                          { flag: '🇨🇾', name: 'Cyprus' },
                          { flag: '🇲🇺', name: 'Mauritius' },
                          { flag: '🇮🇳', name: 'India' }
                        ].map((c) => (
                          <li key={c.name}>
                            <button
                              onClick={() => handleMenuNavigate('destinations', c.name)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                            >
                              <span className="text-lg leading-none">{c.flag}</span>
                              <span>{c.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom footer link */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      Explore 50+ study destinations worldwide.
                    </span>
                    <button
                      onClick={() => handleMenuNavigate('destinations', 'all')}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[13px] font-bold hover:underline cursor-pointer"
                    >
                      <span>View All Countries</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Universities */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleNavItemEnter('universities', false)}
          >
            <button
              type="button"
              onClick={() => handleMenuNavigate('universities')}
              className={`relative px-3.5 py-2 rounded-full transition-colors cursor-pointer z-10 font-semibold ${
                currentView === 'universities'
                  ? (isScrolled
                      ? (isDark ? 'text-[#fbb034] font-bold' : 'text-blue-600 font-bold')
                      : 'text-blue-600 dark:text-blue-400 font-bold')
                  : (isScrolled
                      ? (isDark ? 'text-white/90 hover:text-white' : 'text-slate-800 hover:text-slate-950')
                      : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
              }`}
            >
              <AnimatePresence>
                {hoveredNav === 'universities' && (
                  <motion.div
                    layoutId="navbar-hover-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 rounded-full -z-10 ${
                      isScrolled
                        ? (isDark ? 'bg-white/12 border border-white/20' : 'bg-slate-200/80 border border-slate-300/60 shadow-xs')
                        : (isDark ? 'bg-white/10 border border-white/15' : 'bg-slate-100/90 border border-slate-200/80 shadow-xs')
                    }`}
                    transition={{ type: 'spring', stiffness: 440, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span>Universities</span>
            </button>
          </div>

          {/* 3. Courses */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleNavItemEnter('courses', false)}
          >
            <button
              type="button"
              onClick={() => handleMenuNavigate('courses')}
              className={`relative px-3.5 py-2 rounded-full transition-colors cursor-pointer z-10 font-semibold ${
                currentView === 'courses'
                  ? (isScrolled
                      ? (isDark ? 'text-[#fbb034] font-bold' : 'text-blue-600 font-bold')
                      : 'text-blue-600 dark:text-blue-400 font-bold')
                  : (isScrolled
                      ? (isDark ? 'text-white/90 hover:text-white' : 'text-slate-800 hover:text-slate-950')
                      : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
              }`}
            >
              <AnimatePresence>
                {hoveredNav === 'courses' && (
                  <motion.div
                    layoutId="navbar-hover-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 rounded-full -z-10 ${
                      isScrolled
                        ? (isDark ? 'bg-white/12 border border-white/20' : 'bg-slate-200/80 border border-slate-300/60 shadow-xs')
                        : (isDark ? 'bg-white/10 border border-white/15' : 'bg-slate-100/90 border border-slate-200/80 shadow-xs')
                    }`}
                    transition={{ type: 'spring', stiffness: 440, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span>Courses</span>
            </button>
          </div>

          {/* 4. Services Mega-Menu */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleNavItemEnter('services', true)}
          >
            <button
              type="button"
              className={`relative px-3.5 py-2 rounded-full flex items-center gap-1 transition-colors font-semibold cursor-pointer z-10 ${
                currentView === 'services'
                  ? (isScrolled
                      ? (isDark ? 'text-[#fbb034] font-bold' : 'text-blue-600 font-bold')
                      : 'text-blue-600 dark:text-blue-400 font-bold')
                  : (isScrolled
                      ? (isDark ? 'text-white/90 hover:text-white' : 'text-slate-800 hover:text-slate-950')
                      : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
              }`}
            >
              <AnimatePresence>
                {hoveredNav === 'services' && (
                  <motion.div
                    layoutId="navbar-hover-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 rounded-full -z-10 ${
                      isScrolled
                        ? (isDark ? 'bg-white/12 border border-white/20' : 'bg-slate-200/80 border border-slate-300/60 shadow-xs')
                        : (isDark ? 'bg-white/10 border border-white/15' : 'bg-slate-100/90 border border-slate-200/80 shadow-xs')
                    }`}
                    transition={{ type: 'spring', stiffness: 440, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span>Services</span>
            </button>

            {/* Services 5-Column Mega Dropdown Panel with Smooth Reveal */}
            <AnimatePresence>
              {activeDropdown === 'services' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={handleDropdownPanelEnter}
                  onMouseLeave={handleNavMenuLeave}
                  className="absolute top-[calc(100%+2px)] -left-60 w-[840px] bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-50 pt-5 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
                >
                  <div className="grid grid-cols-5 gap-5">
                    {/* Admissions */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">school</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                          Admissions
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {[
                          { icon: '🎓', label: 'Admission', slug: 'admission-support' },
                          { icon: '🏫', label: 'School Adm.', slug: 'school-admission' },
                          { icon: '🤝', label: 'Referral', slug: 'b2b-partnership' }
                        ].map((s) => (
                          <li key={s.label}>
                            <button
                              onClick={() => handleMenuNavigate(s.slug === 'admission-support' || s.slug === 'school-admission' || s.slug === 'b2b-partnership' ? (s.slug === 'b2b-partnership' ? 'student-referral' : s.slug) : 'services', s.slug)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                            >
                              <span className="text-base leading-none">{s.icon}</span>
                              <span>{s.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Immigration */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">badge</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                          Immigration
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {[
                          { icon: '🛂', label: 'Student Visa', slug: 'student-visa-assistance' },
                          { icon: '🔍', label: 'Track Visa', slug: 'track-visa' },
                          { icon: '👨‍👩‍👧', label: 'Dependent', slug: 'dependent-visa' },
                          { icon: '✈️', label: 'Tourist Visa', slug: 'tourist-visa' },
                          { icon: '🏡', label: 'MM2H', slug: 'mm2h' }
                        ].map((s) => (
                          <li key={s.label}>
                            <button
                              onClick={() => handleMenuNavigate(s.slug === 'track-visa' ? 'track-visa' : (s.slug === 'dependent-visa' ? 'dependent-visa' : (s.slug === 'tourist-visa' ? 'tourist-visa' : (s.slug === 'mm2h' ? 'mm2h' : 'student-visa-assistance'))), s.slug)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                            >
                              <span className="text-base leading-none">{s.icon}</span>
                              <span>{s.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Arrival */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">flight_takeoff</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                          Arrival
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {[
                          { icon: '🏢', label: 'Accommodation', slug: 'student-accommodation' },
                          { icon: '🏥', label: 'Insurance', slug: 'health-insurance' },
                          { icon: '🎫', label: 'Flights', slug: 'flight-ticketing' },
                          { icon: '🚕', label: 'Airport Pickup', slug: 'flight-ticketing' },
                          { icon: '🧳', label: 'Tours', slug: 'flight-ticketing' },
                          { icon: '🚗', label: 'Car Rental', slug: 'flight-ticketing' }
                        ].map((s) => (
                          <li key={s.label}>
                            <button
                              onClick={() => handleMenuNavigate(s.slug === 'health-insurance' ? 'health-insurance' : (s.slug === 'flight-ticketing' ? 'flight-ticketing' : 'services'), s.slug)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                            >
                              <span className="text-base leading-none">{s.icon}</span>
                              <span>{s.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Living */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">home_pin</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                          Living
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {[
                          { icon: '📦', label: 'Courier', slug: 'student-accommodation' },
                          { icon: '🏠', label: 'Airbnb', slug: 'student-accommodation' },
                          { icon: '💳', label: 'MoneyTransfer', slug: 'student-accommodation' }
                        ].map((s) => (
                          <li key={s.label}>
                            <button
                              onClick={() => handleMenuNavigate('services', s.slug)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                            >
                              <span className="text-base leading-none">{s.icon}</span>
                              <span>{s.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prep & B2B */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">history_edu</span>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                          Prep & B2B
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {[
                          { icon: '🎙️', label: 'IELTS', slug: 'ielts-preparation' },
                          { icon: '💻', label: 'PTE', slug: 'ielts-preparation' },
                          { icon: '📖', label: 'Linguaskill', slug: 'ielts-preparation' },
                          { icon: '🤝', label: 'B2B Partners', slug: 'b2b-partnership' }
                        ].map((s) => (
                          <li key={s.label}>
                            <button
                              onClick={() => handleMenuNavigate('services', s.slug)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                            >
                              <span className="text-base leading-none">{s.icon}</span>
                              <span>{s.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom footer link */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      From admission to arrival, all services in one place.
                    </span>
                    <button
                      onClick={() => handleMenuNavigate('services')}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[13px] font-bold hover:underline cursor-pointer"
                    >
                      <span>View All Services</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Contact Mega-Menu */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleNavItemEnter('contact', true)}
          >
            <button
              type="button"
              onClick={() => handleMenuNavigate('contact')}
              className={`relative px-3.5 py-2 rounded-full flex items-center gap-1 transition-colors font-semibold cursor-pointer z-10 ${
                currentView === 'contact' || currentView === 'about'
                  ? (isScrolled
                      ? (isDark ? 'text-[#fbb034] font-bold' : 'text-blue-600 font-bold')
                      : 'text-blue-600 dark:text-blue-400 font-bold')
                  : (isScrolled
                      ? (isDark ? 'text-white/90 hover:text-white' : 'text-slate-800 hover:text-slate-950')
                      : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
              }`}
            >
              <AnimatePresence>
                {hoveredNav === 'contact' && (
                  <motion.div
                    layoutId="navbar-hover-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 rounded-full -z-10 ${
                      isScrolled
                        ? (isDark ? 'bg-white/12 border border-white/20' : 'bg-slate-200/80 border border-slate-300/60 shadow-xs')
                        : (isDark ? 'bg-white/10 border border-white/15' : 'bg-slate-100/90 border border-slate-200/80 shadow-xs')
                    }`}
                    transition={{ type: 'spring', stiffness: 440, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span>Contact</span>
            </button>

            {/* Contact Dropdown Panel with Smooth Reveal */}
            <AnimatePresence>
              {activeDropdown === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={handleDropdownPanelEnter}
                  onMouseLeave={handleNavMenuLeave}
                  className="absolute top-[calc(100%+2px)] right-0 w-[620px] bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 grid grid-cols-3 gap-6 z-50 pt-5 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
                >
                  {/* Column 1: Contact */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">contact_support</span>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                        Contact
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {[
                        { icon: '🏢', label: 'About Us', action: () => handleMenuNavigate('about') },
                        { icon: '📞', label: 'Contact Us', action: () => handleMenuNavigate('contact') },
                        { icon: '🏫', label: 'Language Centers', action: () => handleMenuNavigate('language-centers') },
                        { icon: '🎓', label: 'Application Tracker', action: () => { onRoleChange('student'); handleMenuNavigate('student-portal'); } },
                        { icon: '🇲🇾', label: 'EMGS Visa Tracker', action: () => handleMenuNavigate('track-visa') },
                        { icon: '📘', label: 'Students Guide', action: () => handleMenuNavigate('students-guide') },
                        { icon: '📚', label: 'Resources', action: () => handleMenuNavigate('resources') },
                        { icon: '❓', label: 'FAQs', action: () => handleMenuNavigate('faq') }
                      ].map((item) => (
                        <li key={item.label}>
                          <button
                            onClick={item.action}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                          >
                            <span className="text-base leading-none">{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2: About Us */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">info</span>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                        About Us
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {[
                        { icon: '🏛️', label: 'About Us Overview', action: () => handleMenuNavigate('about') },
                        { icon: '👔', label: 'Leadership & Director', action: () => handleMenuNavigate('leadership-director') },
                        { icon: '⭐', label: 'Success Stories', action: () => handleMenuNavigate('success-stories') }
                      ].map((item) => (
                        <li key={item.label}>
                          <button
                            onClick={item.action}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                          >
                            <span className="text-base leading-none">{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: News & Updates */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">newspaper</span>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold">
                        News & Updates
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {[
                        { icon: '📅', label: 'Events & Fairs', action: () => handleMenuNavigate('events') },
                        { icon: '📰', label: 'News & Visa Bulletins', action: () => handleMenuNavigate('news') },
                        { icon: '✍️', label: 'Blog & Articles', action: () => handleMenuNavigate('blog') }
                      ].map((item) => (
                        <li key={item.label}>
                          <button
                            onClick={item.action}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium text-xs text-left cursor-pointer"
                          >
                            <span className="text-base leading-none">{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Action Controls */}
        <div id="nav-utility-container" className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 lg:gap-2.5 shrink-0">
          {/* Header Multi-Currency Switcher */}
          <div className="flex items-center">
            <HeaderCurrencyExchangeIcon variant="minimal" />
          </div>

          {/* Saved Courses Wishlist Trigger with Dynamic Counter Badge */}
          <button
            aria-label="Saved Courses Wishlist"
            onClick={() => onNavigate('wishlist')}
            title="Saved Courses Wishlist"
            className={`relative w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer ${
              currentView === 'wishlist'
                ? 'text-[#fbb034] bg-amber-500/10'
                : 'text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#fbb034] text-slate-950 font-black text-[9px] leading-none flex items-center justify-center shadow-xs border border-white dark:border-slate-900">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Search Trigger Button (Hidden on phone viewports < sm) */}
          <button
            aria-label="Search Catalog"
            onClick={onOpenSearch}
            className="hidden sm:flex w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl items-center justify-center text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
          </button>

          {/* Theme Toggle Button (Visible on all viewports) */}
          <ThemeToggle
            isDark={isDark}
            onToggle={onToggleTheme}
            variant="minimal"
          />

          {/* Portal Popover with Sliding Pill Tab Switcher */}
          <div
            className="relative hidden md:block py-2"
            onMouseEnter={handlePortalEnter}
            onMouseLeave={handlePortalLeave}
          >
            <button
              aria-label="Portal"
              onClick={() => setPortalOpen(!portalOpen)}
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
            </button>

            {/* Portal Dropdown Menu */}
            <div
              className={`absolute top-[calc(100%+6px)] right-0 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 border border-slate-100 dark:border-slate-800 p-3.5 transition-all duration-200 origin-top-right z-50 w-72 ${
                portalOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none invisible'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
                <div className="relative flex items-center p-1 bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/50 dark:from-slate-800/90 dark:via-indigo-950/40 dark:to-slate-800/90 border border-blue-200/60 dark:border-indigo-500/20 rounded-xl w-full shadow-inner select-none">
                  <div
                    className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-500/30 transition-transform duration-300 ease-out"
                    style={{
                      transform: portalTab === 'signin' ? 'translateX(0%)' : 'translateX(100%)'
                    }}
                  />
                  <button
                    onClick={() => setPortalTab('signin')}
                    className={`relative flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 text-center text-xs font-bold transition-all duration-200 z-10 cursor-pointer tracking-wide rounded-lg ${
                      portalTab === 'signin' ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                    type="button"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('signup')}
                    className={`relative flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 text-center text-xs font-bold transition-all duration-200 z-10 cursor-pointer tracking-wide rounded-lg ${
                      portalTab === 'signup' ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                    type="button"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>

              {/* Panels Container */}
              <div className="relative overflow-hidden">
                <div
                  className="flex w-[200%] transition-transform duration-300 ease-out"
                  style={{
                    transform: portalTab === 'signin' ? 'translateX(0%)' : 'translateX(-50%)'
                  }}
                >
                  {/* Panel 1: Sign In */}
                  <div className="w-1/2 shrink-0 pr-1">
                    <div className="grid gap-1.5 grid-cols-1">
                      <button
                        onClick={() => {
                          onRoleChange('student');
                          onNavigate('student-portal');
                          setPortalOpen(false);
                        }}
                        className="group relative flex items-center gap-2.5 p-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 transition-all shadow-xs text-left cursor-pointer w-full"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">school</span>
                        </div>
                        <span className="font-semibold text-blue-950 dark:text-blue-100 text-xs truncate">
                          Student Login
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          onRoleChange('agent');
                          onNavigate('agent-portal');
                          setPortalOpen(false);
                        }}
                        className="group relative flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 transition-all shadow-xs text-left cursor-pointer w-full"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">handshake</span>
                        </div>
                        <span className="font-semibold text-emerald-950 dark:text-emerald-100 text-xs truncate">
                          Agent Login
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          onRoleChange('counselor');
                          onNavigate('crm');
                          setPortalOpen(false);
                        }}
                        className="group relative flex items-center gap-2.5 p-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40 transition-all shadow-xs text-left cursor-pointer w-full"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">badge</span>
                        </div>
                        <span className="font-semibold text-indigo-950 dark:text-indigo-100 text-xs truncate">
                          Staff Login
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Panel 2: Sign Up */}
                  <div className="w-1/2 shrink-0 pl-1">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          onNavigate('apply');
                          setPortalOpen(false);
                        }}
                        className="group relative flex items-center gap-2 p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 hover:border-blue-600 transition-all text-left cursor-pointer"
                      >
                        <div className="w-6 h-6 text-blue-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">person_add</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">
                          Student
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('agent-portal');
                          setPortalOpen(false);
                        }}
                        className="group relative flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-all text-left cursor-pointer"
                      >
                        <div className="w-6 h-6 text-blue-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">group_add</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">
                          Agent
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Universal CTA: Apply */}
          <div className="hidden xl:block">
            <InteractiveHoverButton
              text="Apply"
              onClick={() => onNavigate('apply')}
              className="h-9 sm:h-10 lg:h-11 w-24 sm:w-28 rounded-full bg-[#fbb034] hover:bg-[#f59e0b] text-slate-950 border-amber-400 font-bold text-xs sm:text-sm items-center justify-center cursor-pointer select-none shadow-xs"
            />
          </div>

          {/* Responsive Morphing Hamburger Navigation Button */}
          <button
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={onOpenMobileMenu}
            title={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0 z-50"
            type="button"
          >
            <MorphingHamburgerIcon
              isOpen={isMobileMenuOpen}
              className="w-4.5 h-4.5 text-current"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;