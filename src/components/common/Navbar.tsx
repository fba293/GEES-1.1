import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../../types/index.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { HeaderCurrencyExchangeIcon } from '../CurrencySwitcher.tsx';
import { ThemeToggle } from '../ThemeToggle.tsx';
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
  const [portalTab, setPortalTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'student' | 'agent' | 'counselor'>('student');
  const [selectedSignupRole, setSelectedSignupRole] = useState<'student' | 'agent'>('student');
  const [portalOpen, setPortalOpen] = useState(false);
  const portalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile menu accordion expand states matching video & user screenshots
  const [openMobileSection, setOpenMobileSection] = useState<string | null>('countries');
  const [mobilePortalTab, setMobilePortalTab] = useState<'signin' | 'signup'>('signin');
  const [mobilePortalRole, setMobilePortalRole] = useState<'student' | 'agent' | 'counselor'>('student');
  const [mobileSignupRole, setMobileSignupRole] = useState<'student' | 'agent'>('student');

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
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://wa.me/8801805529577"
              target="_blank"
              rel="noopener noreferrer"
              title="Direct WhatsApp Helpline BD"
              className="flex items-center gap-1 text-white/90 hover:text-[#fbb034] transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[15px] text-[#fbb034] group-hover:scale-110 transition-transform">
                call
              </span>
              <span className="text-white/70 hidden min-[380px]:inline">BD:</span>
              <strong className="text-white font-semibold tracking-wide font-mono text-[11px] sm:text-xs">+880 1805 529577</strong>
            </a>
            <span className="text-white/30">|</span>
            <a
              href="https://wa.me/8801805529578"
              target="_blank"
              rel="noopener noreferrer"
              title="Direct WhatsApp Helpline BD 2"
              className="hidden md:flex items-center gap-1 text-white/90 hover:text-[#fbb034] transition-colors cursor-pointer font-mono text-[11px] sm:text-xs"
            >
              <span>+880 1805 529578</span>
            </a>
            <span className="text-white/30 hidden lg:inline">|</span>
            <div className="hidden xl:flex items-center gap-1.5 text-white/70">
              <span className="material-symbols-outlined text-[14px] text-amber-400">schedule</span>
              <span>Sun – Thu: 11AM – 5PM</span>
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
          isMobileMenuOpen ? 'mobile-menu-open' : ''
        } ${
          isScrolled ? (isDark ? 'scrolled-dark' : 'scrolled-light') : 'expanded'
        } -mt-1 xs:-mt-1.5 sm:mt-0 flex flex-col rounded-full shadow-lg shadow-black/5 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800`}
      >
        {/* Top Row: Brand Logo, Desktop Nav, Right Utility Controls */}
        <div className="w-full h-[60px] sm:h-[72px] shrink-0 flex items-center justify-between px-3 xs:px-4 sm:px-6 md:px-7 lg:px-8 xl:px-10 gap-1.5 xs:gap-2 sm:gap-6">
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
              className={`relative px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors font-semibold cursor-pointer z-10 ${
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
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
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
                  className="absolute top-[calc(100%+2px)] -left-20 w-[680px] bg-white dark:bg-[#0B1329] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-50 pt-5 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
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
              className={`relative px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer z-10 font-semibold ${
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
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
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
              className={`relative px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer z-10 font-semibold ${
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
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          </div>

          {/* 4. Services Mega-Menu */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleNavItemEnter('services', true)}
          >
            <button
              type="button"
              className={`relative px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors font-semibold cursor-pointer z-10 ${
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
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
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
                  className="absolute top-[calc(100%+2px)] -left-60 w-[840px] bg-white dark:bg-[#0B1329] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-50 pt-5 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
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
              className={`relative px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors font-semibold cursor-pointer z-10 ${
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
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
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
                  className="absolute top-[calc(100%+2px)] right-0 w-[620px] bg-white dark:bg-[#0B1329] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 grid grid-cols-3 gap-6 z-50 pt-5 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
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

          {/* Search Trigger Button (Hidden on phone viewports < sm) */}
          <button
            aria-label="Search Catalog"
            onClick={onOpenSearch}
            className="hidden sm:flex w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
            </button>

            {/* Portal Dropdown Menu: GEES Brand-Consistent Authentication Panel */}
            <div
              className={`absolute top-[calc(100%+8px)] right-0 bg-white dark:bg-[#0A1120] rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 border border-slate-200/90 dark:border-slate-800 p-4 transition-all duration-200 origin-top-right z-50 w-80 sm:w-[340px] ${
                portalOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none invisible'
              }`}
            >
              {/* 3. SIGN IN / SIGN UP SELECTOR: Compact Segmented Control */}
              <div className="relative flex items-center p-1 bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl select-none mb-3">
                <div
                  className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-[#0A1120] dark:bg-slate-800 rounded-lg shadow-xs transition-transform duration-200 ease-out"
                  style={{
                    transform: portalTab === 'signin' ? 'translateX(0%)' : 'translateX(100%)'
                  }}
                />
                <button
                  onClick={() => setPortalTab('signin')}
                  className={`relative flex-1 py-1.5 px-3 flex items-center justify-center text-center text-xs font-semibold tracking-wide transition-colors duration-150 z-10 cursor-pointer rounded-lg ${
                    portalTab === 'signin' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-[#0A1120] dark:hover:text-white'
                  }`}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setPortalTab('signup')}
                  className={`relative flex-1 py-1.5 px-3 flex items-center justify-center text-center text-xs font-semibold tracking-wide transition-colors duration-150 z-10 cursor-pointer rounded-lg ${
                    portalTab === 'signup' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-[#0A1120] dark:hover:text-white'
                  }`}
                  type="button"
                >
                  Sign Up
                </button>
              </div>

              {/* 4. ACCOUNT TYPE SELECTION */}
              {portalTab === 'signin' ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-0.5">
                    Account Type
                  </div>

                  {/* Student Login */}
                  {/* Student Login */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      selectedRole === 'student'
                        ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        selectedRole === 'student'
                          ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                          : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">school</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-xs font-bold leading-tight ${
                          selectedRole === 'student'
                            ? 'text-[#0A1120] dark:text-white'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        Student Login
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                        Access degrees & applications
                      </span>
                    </div>
                    <div className="shrink-0 ml-1.5">
                      {selectedRole === 'student' ? (
                        <div className="w-4 h-4 rounded-full bg-[#fbb034] flex items-center justify-center shadow-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
                      )}
                    </div>
                  </button>

                  {/* Agent Login */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('agent')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      selectedRole === 'agent'
                        ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        selectedRole === 'agent'
                          ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                          : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">handshake</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-xs font-bold leading-tight ${
                          selectedRole === 'agent'
                            ? 'text-[#0A1120] dark:text-white'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        Agent Login
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                        Manage recruited students
                      </span>
                    </div>
                    <div className="shrink-0 ml-1.5">
                      {selectedRole === 'agent' ? (
                        <div className="w-4 h-4 rounded-full bg-[#fbb034] flex items-center justify-center shadow-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
                      )}
                    </div>
                  </button>

                  {/* Staff Login */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('counselor')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      selectedRole === 'counselor'
                        ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        selectedRole === 'counselor'
                          ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                          : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">badge</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-xs font-bold leading-tight ${
                          selectedRole === 'counselor'
                            ? 'text-[#0A1120] dark:text-white'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        Staff Login
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                        Admissions & counselor CRM
                      </span>
                    </div>
                    <div className="shrink-0 ml-1.5">
                      {selectedRole === 'counselor' ? (
                        <div className="w-4 h-4 rounded-full bg-[#fbb034] flex items-center justify-center shadow-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
                      )}
                    </div>
                  </button>

                  {/* Primary Action: Clear Continue button in GEES amber */}
                  <button
                    type="button"
                    onClick={() => {
                      onRoleChange(selectedRole);
                      if (selectedRole === 'student') onNavigate('student-portal');
                      else if (selectedRole === 'agent') onNavigate('agent-portal');
                      else if (selectedRole === 'counselor') onNavigate('crm');
                      setPortalOpen(false);
                    }}
                    className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#fbb034] hover:bg-[#f59e0b] active:scale-[0.98] text-[#0A1120] font-bold text-xs tracking-wide shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      Continue to {selectedRole === 'student' ? 'Student Portal' : selectedRole === 'agent' ? 'Agent Portal' : 'Staff CRM'}
                    </span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              ) : (
                /* Sign Up Tab */
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-0.5">
                    Registration Type
                  </div>

                  {/* Student Registration */}
                  <button
                    type="button"
                    onClick={() => setSelectedSignupRole('student')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      selectedSignupRole === 'student'
                        ? 'bg-amber-500/[0.08] dark:bg-amber-500/[0.12] border-[#fbb034] ring-1 ring-[#fbb034]/60'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        selectedSignupRole === 'student'
                          ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                          : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">school</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-xs font-bold leading-tight ${
                          selectedSignupRole === 'student'
                            ? 'text-[#0A1120] dark:text-white'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        Student Registration
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                        Apply to global partner universities
                      </span>
                    </div>
                    <div className="shrink-0 ml-1.5">
                      {selectedSignupRole === 'student' ? (
                        <div className="w-4 h-4 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                          <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700"></div>
                      )}
                    </div>
                  </button>

                  {/* Agent Partner Registration */}
                  <button
                    type="button"
                    onClick={() => setSelectedSignupRole('agent')}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      selectedSignupRole === 'agent'
                        ? 'bg-amber-500/[0.08] dark:bg-amber-500/[0.12] border-[#fbb034] ring-1 ring-[#fbb034]/60'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        selectedSignupRole === 'agent'
                          ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                          : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">handshake</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-xs font-bold leading-tight ${
                          selectedSignupRole === 'agent'
                            ? 'text-[#0A1120] dark:text-white'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        Agent Registration
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                        Join GEES global recruitment network
                      </span>
                    </div>
                    <div className="shrink-0 ml-1.5">
                      {selectedSignupRole === 'agent' ? (
                        <div className="w-4 h-4 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                          <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700"></div>
                      )}
                    </div>
                  </button>

                  {/* Primary Action: Clear Continue button in GEES amber */}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedSignupRole === 'student') {
                        onNavigate('apply');
                      } else {
                        onNavigate('agent-portal');
                      }
                      setPortalOpen(false);
                    }}
                    className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#fbb034] hover:bg-[#f59e0b] active:scale-[0.98] text-[#0A1120] font-bold text-xs tracking-wide shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {selectedSignupRole === 'student' ? 'Start Student Application' : 'Register as Partner Agent'}
                    </span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              )}

              {/* Helper Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('contact');
                    setPortalOpen(false);
                  }}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-[#0A1120] dark:hover:text-[#fbb034] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">help</span>
                  <span>Need admissions help? Contact Desk</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Apply Now Button matching reference video */}
          <div className="xl:hidden flex items-center">
            <button
              type="button"
              onClick={() => {
                onNavigate('apply');
                if (isMobileMenuOpen) onOpenMobileMenu();
              }}
              className="px-3 py-1.5 xs:px-3.5 xs:py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer select-none"
            >
              <span>Apply now</span>
              <div className="w-5 h-5 rounded-full bg-[#0A1120] dark:bg-amber-400 text-white dark:text-[#0A1120] flex items-center justify-center">
                <span className="material-symbols-outlined text-[13px] font-bold">arrow_forward</span>
              </div>
            </button>
          </div>

          {/* Primary Universal CTA: Apply on Desktop */}
          <div className="hidden xl:block">
            <InteractiveHoverButton
              text="Apply"
              onClick={() => onNavigate('apply')}
              className="h-9 sm:h-10 lg:h-11 w-24 sm:w-28 rounded-full border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 shadow-xs cursor-pointer"
            />
          </div>

          {/* Responsive Morphing Hamburger Navigation Button */}
          <button
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={onOpenMobileMenu}
            title={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 z-50 ${
              isMobileMenuOpen
                ? 'bg-[#0A1120] dark:bg-slate-800 text-white shadow-md'
                : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            type="button"
          >
            <MorphingHamburgerIcon
              isOpen={isMobileMenuOpen}
              className="w-4.5 h-4.5 text-current"
            />
          </button>
        </div>
      </div>

        {/* Unfolded Mobile Menu Body matching all 5 user screenshots */}
        <div
          className={`xl:hidden flex flex-col w-full border-t border-slate-100 dark:border-slate-800/80 overflow-y-auto overscroll-contain transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100 px-4 py-3 sm:px-6 sm:py-4 pointer-events-auto' : 'opacity-0 pointer-events-none h-0 py-0'
          }`}
          style={{
            maxHeight: isMobileMenuOpen ? 'calc(min(92vh, 840px) - 76px)' : '0px'
          }}
        >
          <nav className="flex flex-col font-sans divide-y divide-slate-100/90 dark:divide-slate-800/60">
            {/* 1. Home */}
            <div className="py-1 first:pt-0">
              <button
                type="button"
                onClick={() => {
                  onNavigate('home');
                  onOpenMobileMenu();
                }}
                className="w-full text-left py-2 px-1 text-[20px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Home</span>
                <span className="material-symbols-outlined text-[20px] text-slate-300 dark:text-slate-600">chevron_right</span>
              </button>
            </div>

            {/* 2. Countries (Screenshot 1) */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => setOpenMobileSection(openMobileSection === 'countries' ? null : 'countries')}
                className="w-full text-left py-2 px-1 text-[20px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Countries</span>
                <span className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${openMobileSection === 'countries' ? 'text-blue-600 rotate-180' : 'text-slate-400'}`}>
                  expand_more
                </span>
              </button>
              {openMobileSection === 'countries' && (
                <div className="pl-3.5 mt-1 mb-2 border-l-2 border-blue-500 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs sm:text-sm">
                    {[
                      { name: 'Malaysia', flag: '🇲🇾' },
                      { name: 'United Kingdom', flag: '🇬🇧' },
                      { name: 'Australia', flag: '🇦🇺' },
                      { name: 'New Zealand', flag: '🇳🇿' },
                      { name: 'Belgium', flag: '🇧🇪' },
                      { name: 'Finland', flag: '🇫🇮' },
                      { name: 'Greece', flag: '🇬🇷' },
                      { name: 'Netherlands', flag: '🇳🇱' },
                      { name: 'Cyprus', flag: '🇨🇾' },
                      { name: 'Mauritius', flag: '🇲🇺' },
                      { name: 'India', flag: '🇮🇳' },
                    ].map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          onNavigate('destinations', c.name);
                          onOpenMobileMenu();
                        }}
                        className="text-left py-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors cursor-pointer flex items-center gap-2 truncate"
                      >
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('destinations', 'all');
                      onOpenMobileMenu();
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Explore All Destinations</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Universities (Screenshot 1) */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  onNavigate('universities');
                  onOpenMobileMenu();
                }}
                className="w-full text-left py-2 px-1 text-[20px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Universities</span>
                <span className="material-symbols-outlined text-[20px] text-slate-300 dark:text-slate-600">chevron_right</span>
              </button>
            </div>

            {/* 4. Courses (Screenshot 1) */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  onNavigate('courses');
                  onOpenMobileMenu();
                }}
                className="w-full text-left py-2 px-1 text-[20px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Courses</span>
                <span className="material-symbols-outlined text-[20px] text-slate-300 dark:text-slate-600">chevron_right</span>
              </button>
            </div>

            {/* 5. Services (Screenshot 2) */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => setOpenMobileSection(openMobileSection === 'services' ? null : 'services')}
                className="w-full text-left py-2 px-1 text-[20px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Services</span>
                <span className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${openMobileSection === 'services' ? 'text-blue-600 rotate-180' : 'text-slate-400'}`}>
                  expand_more
                </span>
              </button>
              {openMobileSection === 'services' && (
                <div className="pl-3.5 mt-1 mb-2 border-l-2 border-blue-500 space-y-4 animate-fadeIn">
                  {/* ADMISSIONS */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined text-[15px] text-[#fbb034]">school</span>
                      <span>Admissions</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm">
                      {[
                        { name: 'Admission Support', slug: 'admission-support', icon: 'school' },
                        { name: 'School Admission', slug: 'school-admission', icon: 'apartment' },
                        { name: 'Student Referral', slug: 'student-referral', icon: 'handshake' },
                      ].map((s) => (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            onNavigate(s.slug);
                            onOpenMobileMenu();
                          }}
                          className="text-left py-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors cursor-pointer flex items-center gap-2 truncate"
                        >
                          <span className="material-symbols-outlined text-[17px] text-slate-400">{s.icon}</span>
                          <span className="truncate">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* IMMIGRATION & VISAS */}
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined text-[15px] text-[#fbb034]">badge</span>
                      <span>Immigration & Visas</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm">
                      {[
                        { name: 'Student Visa Assistance', slug: 'student-visa-assistance', icon: 'assignment_ind' },
                        { name: 'EMGS Visa Tracking', slug: 'track-visa', icon: 'travel_explore' },
                        { name: 'Dependent Visa', slug: 'dependent-visa', icon: 'group' },
                        { name: 'Tourist Visa', slug: 'tourist-visa', icon: 'flight' },
                        { name: 'MM2H Program', slug: 'mm2h', icon: 'home_work' },
                      ].map((s) => (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            onNavigate(s.slug);
                            onOpenMobileMenu();
                          }}
                          className="text-left py-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors cursor-pointer flex items-center gap-2 truncate"
                        >
                          <span className="material-symbols-outlined text-[17px] text-slate-400">{s.icon}</span>
                          <span className="truncate">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ARRIVAL & LIVING */}
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined text-[15px] text-[#fbb034]">flight_takeoff</span>
                      <span>Arrival & Living</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm">
                      {[
                        { name: 'Accommodation', slug: 'student-accommodation', icon: 'home' },
                        { name: 'Health Insurance', slug: 'health-insurance', icon: 'health_and_safety' },
                        { name: 'Flight Ticketing', slug: 'flight-ticketing', icon: 'airplane_ticket' },
                      ].map((s) => (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            onNavigate(s.slug);
                            onOpenMobileMenu();
                          }}
                          className="text-left py-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors cursor-pointer flex items-center gap-2 truncate"
                        >
                          <span className="material-symbols-outlined text-[17px] text-slate-400">{s.icon}</span>
                          <span className="truncate">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Portal (Screenshot 3 & Screenshot 4) */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => setOpenMobileSection(openMobileSection === 'portal' ? null : 'portal')}
                className="w-full text-left py-2 px-1 text-[20px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Portal</span>
                <span className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${openMobileSection === 'portal' ? 'text-blue-600 rotate-180' : 'text-slate-400'}`}>
                  expand_more
                </span>
              </button>
              {openMobileSection === 'portal' && (
                <div className="pl-3.5 mt-1 mb-2 border-l-2 border-blue-500 space-y-3 animate-fadeIn">
                  {/* Segmented Control */}
                  <div className="relative flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl select-none">
                    <button
                      type="button"
                      onClick={() => setMobilePortalTab('signin')}
                      className={`flex-1 py-1.5 px-3 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        mobilePortalTab === 'signin' ? 'bg-[#0A1120] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobilePortalTab('signup')}
                      className={`flex-1 py-1.5 px-3 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        mobilePortalTab === 'signup' ? 'bg-[#0A1120] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {mobilePortalTab === 'signin' ? (
                    <div className="space-y-2">
                      {/* Student Login */}
                      <button
                        type="button"
                        onClick={() => setMobilePortalRole('student')}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          mobilePortalRole === 'student'
                            ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[19px]">school</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">Student Login</span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">Access degrees & applications</span>
                        </div>
                        <div className="shrink-0">
                          {mobilePortalRole === 'student' ? (
                            <div className="w-5 h-5 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700"></div>
                          )}
                        </div>
                      </button>

                      {/* Agent Login */}
                      <button
                        type="button"
                        onClick={() => setMobilePortalRole('agent')}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          mobilePortalRole === 'agent'
                            ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[19px]">handshake</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">Agent Login</span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">Manage recruited students</span>
                        </div>
                        <div className="shrink-0">
                          {mobilePortalRole === 'agent' ? (
                            <div className="w-5 h-5 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700"></div>
                          )}
                        </div>
                      </button>

                      {/* Staff Login */}
                      <button
                        type="button"
                        onClick={() => setMobilePortalRole('counselor')}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          mobilePortalRole === 'counselor'
                            ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[19px]">badge</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">Staff Login</span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">Admissions & counselor CRM</span>
                        </div>
                        <div className="shrink-0">
                          {mobilePortalRole === 'counselor' ? (
                            <div className="w-5 h-5 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700"></div>
                          )}
                        </div>
                      </button>

                      {/* Amber Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          onRoleChange(mobilePortalRole);
                          if (mobilePortalRole === 'student') onNavigate('student-portal');
                          else if (mobilePortalRole === 'agent') onNavigate('agent-portal');
                          else if (mobilePortalRole === 'counselor') onNavigate('crm');
                          onOpenMobileMenu();
                        }}
                        className="w-full py-3 rounded-xl bg-[#fbb034] hover:bg-[#f59e0b] text-[#0A1120] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
                      >
                        <span>Continue as {mobilePortalRole === 'student' ? 'Student' : mobilePortalRole === 'agent' ? 'Agent' : 'Staff'}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Student Registration */}
                      <button
                        type="button"
                        onClick={() => setMobileSignupRole('student')}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          mobileSignupRole === 'student'
                            ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[19px]">school</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">Student Registration</span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">Apply to global partner universities</span>
                        </div>
                        <div className="shrink-0">
                          {mobileSignupRole === 'student' ? (
                            <div className="w-5 h-5 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700"></div>
                          )}
                        </div>
                      </button>

                      {/* Agent Registration */}
                      <button
                        type="button"
                        onClick={() => setMobileSignupRole('agent')}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          mobileSignupRole === 'agent'
                            ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[19px]">handshake</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">Agent Registration</span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">Join GEES recruitment network</span>
                        </div>
                        <div className="shrink-0">
                          {mobileSignupRole === 'agent' ? (
                            <div className="w-5 h-5 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                              <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700"></div>
                          )}
                        </div>
                      </button>

                      {/* Amber Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (mobileSignupRole === 'student') onNavigate('apply');
                          else onNavigate('agent-portal');
                          onOpenMobileMenu();
                        }}
                        className="w-full py-3 rounded-xl bg-[#fbb034] hover:bg-[#f59e0b] text-[#0A1120] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
                      >
                        <span>{mobileSignupRole === 'student' ? 'Start Student Application' : 'Register as Partner Agent'}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 7. Contact (Screenshot 5) */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => setOpenMobileSection(openMobileSection === 'contact' ? null : 'contact')}
                className="w-full text-left py-2 px-1 text-[20px] font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Contact</span>
                <span className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${openMobileSection === 'contact' ? 'text-blue-600 rotate-180' : 'text-slate-400'}`}>
                  expand_more
                </span>
              </button>
              {openMobileSection === 'contact' && (
                <div className="pl-3.5 mt-1 mb-2 border-l-2 border-blue-500 space-y-4 animate-fadeIn">
                  {/* Quick Tools */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm">
                    {[
                      { name: 'Application Tracker', icon: 'school', action: () => { onRoleChange('student'); onNavigate('student-portal'); } },
                      { name: 'Students Guide', icon: 'menu_book', action: () => onNavigate('students-guide') },
                      { name: 'Resources', icon: 'folder', action: () => onNavigate('resources') },
                      { name: 'FAQs', icon: 'help', action: () => onNavigate('faq') },
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          item.action();
                          onOpenMobileMenu();
                        }}
                        className="text-left py-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors cursor-pointer flex items-center gap-2 truncate"
                      >
                        <span className="material-symbols-outlined text-[17px] text-slate-400">{item.icon}</span>
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* ABOUT US */}
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined text-[15px] text-[#fbb034]">info</span>
                      <span>About Us</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm">
                      {[
                        { name: 'About Us', action: () => onNavigate('about'), icon: 'apartment' },
                        { name: 'Director Message', action: () => onNavigate('leadership-director'), icon: 'person' },
                        { name: 'Success Stories', action: () => onNavigate('success-stories'), icon: 'star' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            item.action();
                            onOpenMobileMenu();
                          }}
                          className="text-left py-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors cursor-pointer flex items-center gap-2 truncate"
                        >
                          <span className="material-symbols-outlined text-[17px] text-slate-400">{item.icon}</span>
                          <span className="truncate">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* NEWS & UPDATES */}
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined text-[15px] text-[#fbb034]">newspaper</span>
                      <span>News & Updates</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm">
                      {[
                        { name: 'Events & Fairs', action: () => onNavigate('events'), icon: 'event' },
                        { name: 'News & Press', action: () => onNavigate('news'), icon: 'article' },
                        { name: 'Blog & Articles', action: () => onNavigate('blog'), icon: 'edit_note' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            item.action();
                            onOpenMobileMenu();
                          }}
                          className="text-left py-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors cursor-pointer flex items-center gap-2 truncate"
                        >
                          <span className="material-symbols-outlined text-[17px] text-slate-400">{item.icon}</span>
                          <span className="truncate">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Follow Us & Bottom Action CTA Section matching Screenshot 5 */}
          <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {/* Header Currency, Theme, & WhatsApp Support */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Follow Us:
              </span>
              <a
                href="https://wa.me/8801805529578"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-[11px]">+880 1805 529578</span>
              </a>
            </div>

            {/* Social Icons row matching Screenshot 5 */}
            <div className="flex items-center justify-between gap-1 pt-0.5">
              {[
                {
                  name: 'Facebook',
                  href: 'https://www.facebook.com/globaleduexpert',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.69 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                    </svg>
                  )
                },
                {
                  name: 'Instagram',
                  href: 'https://www.instagram.com/globaleduexpert',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )
                },
                {
                  name: 'LinkedIn',
                  href: 'https://www.linkedin.com/company/globaleduexpert',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  )
                },
                {
                  name: 'TikTok',
                  href: 'https://www.tiktok.com/@globaleduexpert',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  )
                },
                {
                  name: 'WhatsApp',
                  href: 'https://wa.me/8801805529578',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  )
                },
                {
                  name: 'Messenger',
                  href: 'https://m.me/globaleduexpert',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.093.303 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.963z" />
                    </svg>
                  )
                },
                {
                  name: 'YouTube',
                  href: 'https://www.youtube.com/@globaleduexpert',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  )
                }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs"
                  title={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            {/* Big Amber CTA Button matching Screenshot 5 */}
            <button
              type="button"
              onClick={() => {
                onNavigate('apply');
                onOpenMobileMenu();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#fbb034] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-slate-950 font-extrabold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <span>Apply / Book Free Consultation</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;