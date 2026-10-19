import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../../types/index.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { HeaderCurrencyExchangeIcon } from '../CurrencySwitcher.tsx';
import { ThemeToggle } from '../ThemeToggle.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
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
  onToggleTheme
}) => {
  const isScrolled = useScrollHeader(50, 30);
  const { wishlistCount } = useWishlist();
  const [portalTab, setPortalTab] = useState<'signin' | 'signup'>('signin');
  const [portalOpen, setPortalOpen] = useState(false);
  const portalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <header className={`gees-header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
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
          className="flex items-center gap-1.5 sm:gap-2 group shrink-0 focus:outline-none cursor-pointer select-none"
        >
          <span
            className={`gees-brand-text text-xl xs:text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-tight transition-colors duration-300 ${
              isScrolled ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-900 dark:text-white'
            }`}
            style={{ fontFamily: '"ITC Benguiat", "Benguiat", serif', fontWeight: 700 }}
          >
            GEES
          </span>
          <span className="w-1.5 xs:w-2 sm:w-2.5 h-1.5 xs:h-2 sm:h-2.5 rounded-full bg-[#fbb034] shadow-xs"></span>
        </div>

        {/* Universal Desktop Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-6 sm:gap-8 text-sm font-semibold">
          {/* 1. Countries Mega-Menu */}
          <div className="relative group cursor-pointer py-5">
            <button
              type="button"
              className={`gees-nav-link flex items-center gap-1 transition-colors font-semibold cursor-pointer ${
                isScrolled
                  ? (isDark
                      ? (currentView === 'destinations' ? 'gees-nav-link-active text-[#fbb034] font-bold' : 'text-white/90 hover:text-[#fbb034]')
                      : (currentView === 'destinations' ? 'gees-nav-link-active text-blue-600 font-bold' : 'text-slate-800 hover:text-blue-600'))
                  : (currentView === 'destinations' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
              }`}
            >
              <span>Countries</span>
              <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180">
                expand_more
              </span>
            </button>

            {/* Countries Mega Dropdown Panel */}
            <div className="absolute top-[calc(100%-6px)] -left-20 w-[680px] bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
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
                          onClick={() => onNavigate('destinations', c.name)}
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
                          onClick={() => onNavigate('destinations', c.name)}
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
                          onClick={() => onNavigate('destinations', c.name)}
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
                  onClick={() => onNavigate('destinations', 'all')}
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[13px] font-bold hover:underline cursor-pointer"
                >
                  <span>View All Countries</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Universities */}
          <button
            onClick={() => onNavigate('universities')}
            className={`gees-nav-link transition-colors cursor-pointer ${
              isScrolled
                ? (isDark
                    ? (currentView === 'universities' ? 'gees-nav-link-active text-[#fbb034] font-bold' : 'text-white/90 hover:text-[#fbb034]')
                    : (currentView === 'universities' ? 'gees-nav-link-active text-blue-600 font-bold' : 'text-slate-800 hover:text-blue-600'))
                : (currentView === 'universities' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
            }`}
          >
            Universities
          </button>

          {/* 3. Courses */}
          <button
            onClick={() => onNavigate('courses')}
            className={`gees-nav-link transition-colors cursor-pointer ${
              isScrolled
                ? (isDark
                    ? (currentView === 'courses' ? 'gees-nav-link-active text-[#fbb034] font-bold' : 'text-white/90 hover:text-[#fbb034]')
                    : (currentView === 'courses' ? 'gees-nav-link-active text-blue-600 font-bold' : 'text-slate-800 hover:text-blue-600'))
                : (currentView === 'courses' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
            }`}
          >
            Courses
          </button>

          {/* 4. Services Mega-Menu */}
          <div className="relative group cursor-pointer py-5">
            <button
              type="button"
              className={`gees-nav-link flex items-center gap-1 transition-colors font-semibold cursor-pointer ${
                isScrolled
                  ? (isDark
                      ? (currentView === 'services' ? 'gees-nav-link-active text-[#fbb034] font-bold' : 'text-white/90 hover:text-[#fbb034]')
                      : (currentView === 'services' ? 'gees-nav-link-active text-blue-600 font-bold' : 'text-slate-800 hover:text-blue-600'))
                  : (currentView === 'services' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
              }`}
            >
              <span>Services</span>
              <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180">
                expand_more
              </span>
            </button>

            {/* Services 5-Column Mega Dropdown Panel */}
            <div className="absolute top-[calc(100%-6px)] -left-60 w-[840px] bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
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
                          onClick={() => onNavigate(s.slug === 'admission-support' || s.slug === 'school-admission' || s.slug === 'b2b-partnership' ? (s.slug === 'b2b-partnership' ? 'student-referral' : s.slug) : 'services', s.slug)}
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
                          onClick={() => onNavigate(s.slug === 'track-visa' ? 'track-visa' : (s.slug === 'dependent-visa' ? 'dependent-visa' : (s.slug === 'tourist-visa' ? 'tourist-visa' : (s.slug === 'mm2h' ? 'mm2h' : 'student-visa-assistance'))), s.slug)}
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
                          onClick={() => onNavigate(s.slug === 'health-insurance' ? 'health-insurance' : (s.slug === 'flight-ticketing' ? 'flight-ticketing' : 'services'), s.slug)}
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
                          onClick={() => onNavigate('services', s.slug)}
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
                          onClick={() => onNavigate('services', s.slug)}
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
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[13px] font-bold hover:underline cursor-pointer"
                >
                  <span>View All Services</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Contact Mega-Menu */}
          <div className="relative group cursor-pointer py-5">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className={`gees-nav-link flex items-center gap-1 transition-colors font-semibold cursor-pointer ${
                isScrolled
                  ? (isDark
                      ? (currentView === 'contact' ? 'gees-nav-link-active text-[#fbb034] font-bold' : 'text-white/90 hover:text-[#fbb034]')
                      : (currentView === 'contact' ? 'gees-nav-link-active text-blue-600 font-bold' : 'text-slate-800 hover:text-blue-600'))
                  : (currentView === 'contact' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400')
              }`}
            >
              <span>Contact</span>
              <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-180">
                expand_more
              </span>
            </button>

            {/* Contact Dropdown Panel */}
            <div className="absolute top-[calc(100%-6px)] right-0 w-[620px] bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 grid grid-cols-3 gap-6 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
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
                    { icon: '🏢', label: 'About Us', action: () => onNavigate('about') },
                    { icon: '📞', label: 'Contact Us', action: () => onNavigate('contact') },
                    { icon: '🏫', label: 'Language Centers', action: () => onNavigate('language-centers') },
                    { icon: '🎓', label: 'Application Tracker', action: () => { onRoleChange('student'); onNavigate('student-portal'); } },
                    { icon: '🇲🇾', label: 'EMGS Visa Tracker', action: () => onNavigate('track-visa') },
                    { icon: '📘', label: 'Students Guide', action: () => onNavigate('students-guide') },
                    { icon: '📚', label: 'Resources', action: () => onNavigate('resources') },
                    { 
                      icon: '❓', 
                      label: 'FAQs', 
                      action: () => onNavigate('faq')
                    }
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
                    { icon: '🏛️', label: 'About Us Overview', action: () => onNavigate('about') },
                    { icon: '👔', label: 'Leadership & Director', action: () => onNavigate('leadership-director') },
                    { icon: '⭐', label: 'Success Stories', action: () => onNavigate('success-stories') }
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
                    { icon: '📅', label: 'Events & Fairs', action: () => onNavigate('events') },
                    { icon: '📰', label: 'News & Visa Bulletins', action: () => onNavigate('news') },
                    { icon: '✍️', label: 'Blog & Articles', action: () => onNavigate('blog') }
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
            </div>
          </div>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 lg:gap-3.5 shrink-0">
          {/* Header Multi-Currency Switcher */}
          <div className={`transition-all duration-300 ${isScrolled ? 'gees-header-icon-btn rounded-full' : ''}`}>
            <HeaderCurrencyExchangeIcon />
          </div>

          {/* Saved Courses Wishlist Trigger with Dynamic Counter Badge */}
          <button
            aria-label="Saved Courses Wishlist"
            onClick={() => onNavigate('wishlist')}
            title="Saved Courses Wishlist"
            className={`gees-header-icon-btn relative w-10 h-10 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full border flex items-center justify-center transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-xs ${
              currentView === 'wishlist'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-[#fbb034] text-[#fbb034] font-bold'
                : scrolledBtnClass
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] xs:text-[18px] sm:text-[20px]">bookmark</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#fbb034] text-slate-950 font-black text-[10px] leading-none flex items-center justify-center shadow-md border border-white dark:border-slate-900 animate-scaleUp">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Search Trigger Button (Hidden on phone viewports < sm) */}
          <button
            aria-label="Search Catalog"
            onClick={onOpenSearch}
            className={`gees-header-icon-btn hidden sm:flex w-10 h-10 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full border items-center justify-center transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-xs ${scrolledBtnClass}`}
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] xs:text-[18px] sm:text-[20px]">search</span>
          </button>

          {/* Theme Toggle Button (Visible on all viewports) */}
          <ThemeToggle
            isDark={isDark}
            onToggle={onToggleTheme}
            className={`flex transition-all duration-200 ${scrolledBtnClass}`}
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
              className={`gees-header-icon-btn w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${scrolledBtnClass}`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">account_circle</span>
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

          {/* Mobile Hamburger Navigation Button */}
          <button
            aria-label="Navigation Menu"
            onClick={onOpenMobileMenu}
            className={`gees-header-icon-btn xl:hidden group w-10 h-10 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full border flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform hover:scale-110 active:scale-90 shadow-xs cursor-pointer shrink-0 ${scrolledBtnClass}`}
            type="button"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-current transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform group-hover:scale-110 group-hover:rotate-90 group-active:scale-90 group-active:rotate-180 group-hover:text-[#fbb034] will-change-transform"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.3"
              viewBox="0 0 24 24"
            >
              <line className="transition-all duration-300 ease-out group-hover:translate-x-[-1px]" x1="11" x2="20.5" y1="6.5" y2="6.5"></line>
              <line className="transition-all duration-300 ease-out group-hover:translate-x-[1px]" x1="3.5" x2="20.5" y1="12" y2="12"></line>
              <line className="transition-all duration-300 ease-out group-hover:translate-x-[-1px]" x1="14.5" x2="20.5" y1="17.5" y2="17.5"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;