/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Hero Section with Typewriter Country Cycling, Instant Fuzzy Search & Rolling Number Tickers
 */

import React, { useState, useEffect, useRef } from 'react';
import { mockDestinations, mockServices } from '../../data/mockDatabase.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

interface HeroSectionProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultationModal: (counselorName?: string) => void;
}

// Animated Number Counter & Ticker Component
interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

const StatCounter: React.FC<StatCounterProps> = ({
  value,
  suffix = '',
  label,
  duration = 1800
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      
      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasAnimated, value, duration]);

  return (
    <div 
      ref={containerRef}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 flex flex-col justify-center items-start shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden min-w-0"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-400/10 via-transparent to-transparent rounded-tr-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-baseline gap-0.5 text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-none">
        <span className="tabular-nums transition-all">
          {count}
        </span>
        <span className="text-slate-950 dark:text-white font-black text-lg sm:text-3xl ml-0.5 select-none">
          {suffix}
        </span>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 font-bold text-[11px] xs:text-xs sm:text-sm mt-2 tracking-tight group-hover:text-slate-950 dark:group-hover:text-white transition-colors truncate w-full block leading-none">
        {label}
      </p>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenConsultationModal: _onOpenConsultationModal
}) => {
  // 1. Typewriter Animation State
  const countries = [
    'Malaysia',
    'United Kingdom',
    'Australia',
    'New Zealand',
    'Cyprus',
    'Belgium',
    'Finland',
    'Greece',
    'Mauritius',
    'Netherlands',
    'India'
  ];
  const [countryIndex, setCountryIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('Malaysia');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentWord = countries[countryIndex];

    if (!isDeleting) {
      if (displayedText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        }, 85);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        }, 45);
      } else {
        setIsDeleting(false);
        setCountryIndex((prev) => (prev + 1) % countries.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, countryIndex]);

  // 2. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [fieldOfStudy, setFieldOfStudy] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus effect on the search input when user navigates into view
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus({ preventScroll: true });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Search input looping typewriter placeholder matching uploaded screen
  const typewriterServices = [
    'Health Insurance',
    'Universities',
    'Courses',
    'Admission Support',
    'Student Visa',
    'Accommodations',
    'Flight Ticketing',
    'IELTS Preparation',
    'Scholarships'
  ];

  // Instant fuzzy matches
  const q = searchQuery.trim().toLowerCase();
  const matchedCountries = q
    ? mockDestinations.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.code.toLowerCase().includes(q)
      )
    : [];

  const matchedServices = q
    ? mockServices.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.desc.toLowerCase().includes(q)
      )
    : [];

  const showDropdown = dropdownOpen && q.length > 0;

  const handleSelectResult = (type: string, name: string) => {
    setSearchQuery(name);
    setDropdownOpen(false);
    showToastNotification(`Selected: ${name}`);
    if (type === 'destination') {
      onNavigate('destinations', name);
    } else {
      onNavigate('services', name);
    }
  };

  const showToastNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleFindPrograms = () => {
    onNavigate('courses', {
      query: searchQuery,
      destination: selectedDestination,
      level: selectedLevel,
      field: fieldOfStudy
    });
  };

  return (
    <section className="relative w-full bg-white dark:bg-[#070b19] pt-1 xs:pt-4 sm:pt-12 pb-16 lg:pb-24 transition-colors duration-300">
      <div className="max-w-[95%] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start relative z-10">
        
        {/* Title + Graduate Graphic Header */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 sm:gap-10 relative">
          <div className="flex flex-col items-start flex-1 relative z-20">
            <h1 className="hero-study-in text-[32px] min-[390px]:text-[38px] xs:text-[46px] sm:text-[76px] lg:text-[96px] font-black tracking-[-0.03em] text-slate-900 dark:text-white leading-[1.02] select-none">
              Study in
            </h1>
            
            {/* Typewriter Highlight Box */}
            <div className="hero-typewriter-box mt-2 sm:mt-3 inline-block px-3.5 sm:px-8 py-1.5 sm:py-3 rounded-2xl sm:rounded-3xl shadow-sm bg-[#fbb034] transition-all duration-300 max-w-full">
              <span className="hero-typewriter text-[24px] min-[390px]:text-[28px] xs:text-[36px] sm:text-[68px] lg:text-[88px] font-black tracking-[-0.025em] text-slate-950 leading-none inline-flex items-center min-h-[1.05em] max-w-full overflow-hidden text-ellipsis">
                <span>{displayedText}</span>
                <span className="ml-1 inline-block w-[3px] sm:w-[5px] h-[0.75em] bg-slate-950 rounded-sm animate-pulse align-baseline shrink-0"></span>
              </span>
            </div>

            <p className="hero-connecting-text mt-3 sm:mt-6 font-bold text-[10px] min-[390px]:text-[11px] sm:text-[13px] tracking-[0.14em] sm:tracking-[0.22em] uppercase text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs px-2 py-1 rounded-md inline-block max-w-full truncate sm:whitespace-normal">
              CONNECTING YOU TO WORLD CLASS EDUCATION
            </p>
          </div>

          {/* Graduate Photo Card Visual */}
          <div className="hero-girl-container absolute right-0 bottom-0 w-28 xs:w-36 sm:w-auto flex flex-col items-center justify-end shrink-0 pointer-events-none z-10">
            <div className="relative flex items-end justify-center w-full max-w-sm sm:max-w-md">
              <div className="absolute top-10 sm:top-20 w-36 xs:w-48 sm:w-80 h-36 xs:h-48 sm:h-80 bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute top-12 sm:top-24 w-32 xs:w-40 sm:w-72 h-32 xs:h-40 sm:h-72 bg-[#fbb034]/20 rounded-full blur-2xl pointer-events-none -z-10"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3i8ovasBhMoQ1TCIM8b_loTMgx6vCkSvEsw2fJQwFSZyCoNLkXZxKA9EN1sJJ-A3Cwq0yfftq-b7M3savldQvGKkRNTurDSnUnFbValuSkkSZ9I02u8NfOa5w9lnDxukT6Y6TF9d-5czHZTgV_3JN8j9PWYwKKPDtBBm1BDdxTOk3_2wI_1Vk3NYvjoT_o4k9rsKNw4Qh3yZ7iBvQCZmx0L7d8WF5SIdgK6q16NhNSnClDMxmM_jUHniHU-ibe0ndZ6U"
                alt="GEES Successful Graduate Student"
                className="hero-girl-img h-40 xs:h-52 sm:h-72 lg:h-84 object-contain pointer-events-none transition-transform duration-500 drop-shadow-2xl opacity-40 xs:opacity-50 sm:opacity-95 lg:opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Search & Filter Floating Card */}
        {/* MOBILE VIEW: Uploaded Compact Search & Inset Filter Matrix (< sm) */}
        <div className="w-full relative z-20 mt-3 sm:mt-0 sm:hidden" data-purpose="mobile-compact-search-container">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e5e5ea] dark:border-slate-800 overflow-hidden shadow-xs" data-purpose="compact-search-widget">
            {/* Unified Row 1: Super Compact High-end Search Capsule with Looping Typewriter */}
            <div className="p-2.5 bg-white dark:bg-slate-900 border-b border-[#e5e5ea] dark:border-slate-800">
              <div className="relative flex items-center h-11 pl-2 pr-1 rounded-full bg-white dark:bg-slate-800/90 border border-[#e2e4ea] dark:border-slate-700 transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:border-[#cbcfd9] dark:hover:border-slate-600 focus-within:border-amber-500/60 focus-within:shadow-[0_3px_14px_-3px_rgba(245,158,11,0.18)] focus-within:ring-2 focus-within:ring-amber-500/15 overflow-hidden">
                {/* 3D Glowing Orb */}
                <div 
                  className="emerald-orb-container orb-animating"
                  id="emerald-orb"
                  onClick={() => searchInputRef.current?.focus()}
                  title="Ask GEES AI"
                  style={{ position: 'relative', width: '30px', height: '30px', flexShrink: 0, cursor: 'pointer', borderRadius: '9999px' }}
                >
                  <div 
                    className="emerald-orb-shadow"
                    style={{ position: 'absolute', inset: '-3px', borderRadius: '9999px', background: 'radial-gradient(circle at 50% 55%, rgba(245, 158, 11, 0.55) 0%, rgba(217, 119, 6, 0.3) 50%, transparent 75%)', filter: 'blur(4px)', zIndex: 1, opacity: 0.85 }}
                  />
                  <div 
                    className="emerald-orb-body"
                    style={{ position: 'absolute', inset: 0, borderRadius: '9999px', zIndex: 2, background: 'radial-gradient(circle at 35% 30%, #fef3c7 0%, #fde68a 18%, #fbbf24 38%, #f59e0b 60%, #d97706 78%, #92400e 92%, #451a03 100%)', boxShadow: 'inset 0 -3px 6px rgba(69, 26, 3, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.75), 0 3px 10px -1px rgba(245, 158, 11, 0.5), 0 1px 4px rgba(0, 0, 0, 0.15)', overflow: 'hidden' }}
                  >
                    <div 
                      className="emerald-orb-highlight"
                      style={{ position: 'absolute', top: '10%', left: '14%', width: '44%', height: '36%', borderRadius: '50% 50% 45% 45% / 60% 60% 35% 35%', background: 'radial-gradient(ellipse at 42% 38%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.75) 35%, rgba(255, 255, 255, 0) 80%)', transform: 'rotate(-26deg)', filter: 'blur(0.4px)', pointerEvents: 'none', zIndex: 3 }}
                    />
                    <div 
                      className="emerald-orb-glow-rim"
                      style={{ position: 'absolute', bottom: '6%', right: '12%', width: '48%', height: '38%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(253, 230, 138, 0.6) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 80%)', filter: 'blur(1px)', pointerEvents: 'none', zIndex: 3 }}
                    />
                    <span 
                      className="emerald-orb-sparkle"
                      style={{ position: 'absolute', top: '42%', right: '28%', width: '2.5px', height: '2.5px', background: '#ffffff', borderRadius: '50%', boxShadow: '0 0 4px #fde68a', opacity: 0.75, zIndex: 3 }}
                    />
                    <span 
                      className="emerald-orb-sparkle"
                      style={{ position: 'absolute', bottom: '32%', left: '45%', width: '1.5px', height: '1.5px', background: '#ffffff', borderRadius: '50%', boxShadow: '0 0 3px #fde68a', opacity: 0.4, zIndex: 3 }}
                    />
                  </div>
                </div>

                {/* Elegant Text Input with AnimatedTextCycle */}
                <div className="relative flex-1 h-full flex items-center min-w-0">
                  {!searchQuery && (
                    <div 
                      onClick={() => searchInputRef.current?.focus()}
                      className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-[13px] min-[380px]:text-[13.5px] min-[410px]:text-[14px] tracking-[-0.015em] text-[#1d1d1f]/75 dark:text-slate-300/80 font-normal select-none pr-1 z-20 whitespace-nowrap max-w-full"
                    >
                      <span className="mr-1 shrink-0">Search</span>
                      <AnimatedTextCycle 
                        words={typewriterServices}
                        interval={2200}
                        textClassName="text-[#1d1d1f] dark:text-white font-semibold tracking-tight"
                      />
                    </div>
                  )}
                  <input 
                    ref={searchInputRef}
                    aria-label="Search services, universities, courses" 
                    className="typewriter-input w-full h-full pl-2 pr-1 text-[13px] min-[380px]:text-[13.5px] min-[410px]:text-[14px] tracking-[-0.015em] bg-transparent border-0 text-[#1d1d1f] dark:text-white placeholder:text-transparent font-normal focus:outline-none focus:ring-0 transition-all relative z-10" 
                    id="main-course-search" 
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                  />
                </div>

                {/* Interactive Right Actions: Clear & Suggestion with 44px touch targets */}
                <div className="flex items-center shrink-0">
                  {searchQuery && (
                    <button 
                      aria-label="Clear search" 
                      className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-slate-700 active:scale-90 transition-all flex items-center justify-center cursor-pointer" 
                      id="clear-search-btn" 
                      onClick={() => setSearchQuery('')}
                      type="button"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                  <button 
                    aria-label="Quick suggestions" 
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-[#8e8e93] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-colors flex items-center justify-center cursor-pointer" 
                    onClick={() => {
                      const prompts = [
                        "United Kingdom",
                        "Computer Science",
                        "Australia",
                        "New Zealand",
                        "Health Insurance"
                      ];
                      const pick = prompts[Math.floor(Math.random() * prompts.length)];
                      setSearchQuery(pick);
                      setDropdownOpen(true);
                    }} 
                    title="Quick suggestions" 
                    type="button"
                  >
                    <svg className="w-4 h-4 text-[#86868b] dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
                      <line strokeLinecap="round" strokeLinejoin="round" x1="12" x2="12" y1="19" y2="23" />
                      <line strokeLinecap="round" strokeLinejoin="round" x1="8" x2="16" y1="23" y2="23" />
                    </svg>
                  </button>
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden rounded-b-full">
                  <div 
                    className="bottom-beam-glow h-full w-[60%] blur-[0.5px]" 
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.25) 20%, rgb(245, 158, 11) 50%, rgb(0, 102, 204) 80%, transparent 100%)', boxShadow: 'rgba(245, 158, 11, 0.65) 0px 0px 8px 1px', animation: '2.8s linear infinite beam-travel' }} 
                  />
                </div>
              </div>
            </div>

            {/* Instant Fuzzy Dropdown on Mobile */}
            {showDropdown && (
              <div className="bg-white dark:bg-slate-900 border-b border-[#e5e5ea] dark:border-slate-800 p-2 max-h-52 overflow-y-auto no-scrollbar space-y-1">
                <div className="px-2 py-0.5 flex items-center justify-between text-[10.5px] font-bold text-[#86868b] dark:text-slate-400">
                  <span>Match Suggestions</span>
                  <span className="text-[#0066cc] dark:text-sky-400 font-semibold">{matchedCountries.length + matchedServices.length} found</span>
                </div>
                {matchedCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleSelectResult('destination', c.name)}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-slate-800 text-xs transition-colors min-h-[44px]"
                  >
                    <span className="text-base">{c.flagEmoji}</span>
                    <span className="font-bold text-[#1d1d1f] dark:text-white flex-1">{c.name}</span>
                    <span className="text-[11px] text-[#0066cc] dark:text-sky-400 font-semibold">Explore →</span>
                  </button>
                ))}
                {matchedServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectResult('service', s.title)}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-slate-800 text-xs transition-colors min-h-[44px]"
                  >
                    <span className="material-symbols-outlined text-[15px] text-amber-600 dark:text-amber-400">{s.iconName}</span>
                    <span className="font-bold text-[#1d1d1f] dark:text-white flex-1">{s.title}</span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">View →</span>
                  </button>
                ))}
                {matchedCountries.length === 0 && matchedServices.length === 0 && (
                  <div className="p-3 text-center text-xs text-[#86868b] dark:text-slate-400">
                    No exact match. Click "Find Programs" below.
                  </div>
                )}
              </div>
            )}

            {/* Unified Inset Grouped Filter Matrix - 3-Column Strip with Apple-Grade Touch Target */}
            <div className="grid grid-cols-3 divide-x divide-[#e5e5ea] dark:divide-slate-800 bg-[#fafafc] dark:bg-slate-900/60 border-b border-[#e5e5ea] dark:border-slate-800" data-purpose="inset-filter-matrix">
              {/* Column 1: DESTINATION */}
              <label className="relative px-2 min-[390px]:px-2.5 py-2.5 min-[390px]:py-3 min-h-[48px] min-[390px]:min-h-[50px] flex items-center gap-1.5 xs:gap-2 min-w-0 hover:bg-[#f5f5f7] dark:hover:bg-slate-800/50 active:bg-[#ebebed] dark:active:bg-slate-800 transition-colors cursor-pointer select-none">
                <div className="w-5 h-5 rounded-[6px] bg-[#eef5fc] dark:bg-blue-950/60 text-[#0066cc] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 014 9 14 14 0 01-4 9 14 14 0 01-4-9 14 14 0 014-9z" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className={`text-[9px] min-[390px]:text-[9.5px] font-bold tracking-[0.05em] uppercase leading-none block truncate transition-all duration-300 ease-out transform ${
                    selectedDestination !== 'all'
                      ? 'text-[#f59e0b] dark:text-[#fbbf24] scale-[1.04] translate-x-0.5'
                      : 'text-[#86868b] dark:text-slate-400'
                  }`}>
                    DESTINATION {selectedDestination !== 'all' ? `• ${selectedDestination}` : ''}
                  </span>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="appearance-none -webkit-appearance-none w-full bg-transparent text-[12px] min-[390px]:text-[12.5px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight truncate border-0 p-0 m-0 mt-0.5 focus:ring-0 focus:outline-none cursor-pointer leading-tight h-[20px]"
                  >
                    <option value="all">All Destinations</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Finland">Finland</option>
                    <option value="Greece">Greece</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="India">India</option>
                  </select>
                </div>
              </label>

              {/* Column 2: LEVEL */}
              <label className="relative px-2 min-[390px]:px-2.5 py-2.5 min-[390px]:py-3 min-h-[48px] min-[390px]:min-h-[50px] flex items-center gap-1.5 xs:gap-2 min-w-0 hover:bg-[#f5f5f7] dark:hover:bg-slate-800/50 active:bg-[#ebebed] dark:active:bg-slate-800 transition-colors cursor-pointer select-none">
                <div className="w-5 h-5 rounded-[6px] bg-[#fff8eb] dark:bg-amber-950/60 text-[#d97706] dark:text-amber-400 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[9px] min-[390px]:text-[9.5px] font-bold tracking-[0.05em] uppercase text-[#86868b] dark:text-slate-400 leading-none block truncate">
                    LEVEL
                  </span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="appearance-none -webkit-appearance-none w-full bg-transparent text-[12px] min-[390px]:text-[12.5px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight truncate border-0 p-0 m-0 mt-0.5 focus:ring-0 focus:outline-none cursor-pointer leading-tight h-[20px]"
                  >
                    <option value="all">All</option>
                    <option value="undergraduate">Undergrad</option>
                    <option value="postgraduate">Postgrad</option>
                    <option value="doctorate">Doctorate</option>
                    <option value="foundation">Pathway</option>
                  </select>
                </div>
              </label>

              {/* Column 3: FIELD */}
              <label className="relative px-2 min-[390px]:px-2.5 py-2.5 min-[390px]:py-3 min-h-[48px] min-[390px]:min-h-[50px] flex items-center gap-1.5 xs:gap-2 min-w-0 hover:bg-[#f5f5f7] dark:hover:bg-slate-800/50 active:bg-[#ebebed] dark:active:bg-slate-800 transition-colors cursor-pointer select-none">
                <div className="w-5 h-5 rounded-[6px] bg-[#ecfdf5] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[9px] min-[390px]:text-[9.5px] font-bold tracking-[0.05em] uppercase text-[#86868b] dark:text-slate-400 leading-none block truncate">
                    FIELD
                  </span>
                  <input
                    type="text"
                    placeholder="Any"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="appearance-none -webkit-appearance-none w-full bg-transparent text-[12px] min-[390px]:text-[12.5px] font-semibold text-[#1d1d1f] dark:text-white placeholder:text-[#86868b] dark:placeholder:text-slate-500 tracking-tight truncate border-0 p-0 m-0 mt-0.5 focus:ring-0 focus:outline-none leading-tight h-[20px]"
                  />
                </div>
              </label>
            </div>

            {/* Bottom Actions: Find Programs Button + Quick Navigation Pills + Stats Ticker */}
            <div className="p-3 bg-white dark:bg-slate-900">
              {/* Find Programs -> GEES Amber Capsule Button with Apple-Grade Proportions */}
              <button
                id="find-programs-button"
                onClick={handleFindPrograms}
                type="button"
                data-purpose="compact-btn"
                className="w-full h-12 min-h-[44px] rounded-full bg-[#fbb034] hover:bg-[#f59e0b] active:bg-[#d97706] text-slate-950 font-black text-[15px] tracking-tight flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <span>Find Programs</span>
                <svg className="w-4 h-4 stroke-[2.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* 2x2 Clean Rounded White Pill Buttons with 44px min touch target */}
              <div className="grid grid-cols-2 gap-2 mt-2.5" data-purpose="quick-navigation-grid">
                <button
                  onClick={() => onNavigate('universities')}
                  type="button"
                  data-purpose="compact-btn"
                  className="w-full h-11 min-h-[44px] rounded-full border border-[#e5e5ea] dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-[#f5f5f7] dark:hover:bg-slate-750 active:bg-[#ebebed] text-[#1d1d1f] dark:text-white font-semibold text-[13px] tracking-tight text-center transition-all shadow-none flex items-center justify-center active:scale-[0.97] cursor-pointer"
                >
                  Universities
                </button>
                <button
                  onClick={() => onNavigate('courses')}
                  type="button"
                  data-purpose="compact-btn"
                  className="w-full h-11 min-h-[44px] rounded-full border border-[#e5e5ea] dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-[#f5f5f7] dark:hover:bg-slate-750 active:bg-[#ebebed] text-[#1d1d1f] dark:text-white font-semibold text-[13px] tracking-tight text-center transition-all shadow-none flex items-center justify-center active:scale-[0.97] cursor-pointer"
                >
                  Courses
                </button>
                <button
                  onClick={() => onNavigate('services', 'ielts-preparation')}
                  type="button"
                  data-purpose="compact-btn"
                  className="w-full h-11 min-h-[44px] rounded-full border border-[#e5e5ea] dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-[#f5f5f7] dark:hover:bg-slate-750 active:bg-[#ebebed] text-[#1d1d1f] dark:text-white font-semibold text-[13px] tracking-tight text-center transition-all shadow-none flex items-center justify-center active:scale-[0.97] cursor-pointer"
                >
                  IELTS Prep
                </button>
                <button
                  onClick={() => onNavigate('blog')}
                  type="button"
                  data-purpose="compact-btn"
                  className="w-full h-11 min-h-[44px] rounded-full border border-[#e5e5ea] dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-[#f5f5f7] dark:hover:bg-slate-750 active:bg-[#ebebed] text-[#1d1d1f] dark:text-white font-semibold text-[13px] tracking-tight text-center transition-all shadow-none flex items-center justify-center active:scale-[0.97] cursor-pointer"
                >
                  Blogs &amp; News
                </button>
              </div>

              {/* Stats Overview Row with Vertical Hairline Dividers */}
              <div className="flex items-center justify-between mt-3 pt-2.5 pb-0.5 border-t border-[#e5e5ea] dark:border-slate-800 px-1.5" data-purpose="stats-overview-grid">
                <div className="flex-1 text-center min-w-0">
                  <div className="flex items-baseline justify-center leading-none">
                    <span className="text-[15px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">100</span>
                    <span className="text-[11px] font-semibold text-[#1d1d1f] dark:text-slate-300">+</span>
                  </div>
                  <p className="text-[10px] font-normal text-[#86868b] dark:text-slate-400 mt-0.5 whitespace-nowrap truncate tracking-tight">Students</p>
                </div>
                <div className="w-[1px] h-4.5 bg-[#e5e5ea] dark:bg-slate-800 shrink-0" />
                <div className="flex-1 text-center min-w-0">
                  <div className="flex items-baseline justify-center leading-none">
                    <span className="text-[15px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">167</span>
                    <span className="text-[11px] font-semibold text-[#1d1d1f] dark:text-slate-300">+</span>
                  </div>
                  <p className="text-[10px] font-normal text-[#86868b] dark:text-slate-400 mt-0.5 whitespace-nowrap truncate tracking-tight">Partner Unis</p>
                </div>
                <div className="w-[1px] h-4.5 bg-[#e5e5ea] dark:bg-slate-800 shrink-0" />
                <div className="flex-1 text-center min-w-0">
                  <div className="flex items-baseline justify-center leading-none">
                    <span className="text-[15px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">95</span>
                    <span className="text-[11px] font-semibold text-[#1d1d1f] dark:text-slate-300">%</span>
                  </div>
                  <p className="text-[10px] font-normal text-[#86868b] dark:text-slate-400 mt-0.5 whitespace-nowrap truncate tracking-tight">Visa Rate</p>
                </div>
                <div className="w-[1px] h-4.5 bg-[#e5e5ea] dark:bg-slate-800 shrink-0" />
                <div className="flex-1 text-center min-w-0">
                  <div className="flex items-baseline justify-center leading-none">
                    <span className="text-[15px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">2</span>
                    <span className="text-[11px] font-semibold text-[#1d1d1f] dark:text-slate-300">+</span>
                  </div>
                  <p className="text-[10px] font-normal text-[#86868b] dark:text-slate-400 mt-0.5 whitespace-nowrap truncate tracking-tight">Offices</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* DESKTOP VIEW: Search & Filter Floating Card (>= sm screens) */}
        <div className="w-full relative z-20 mt-2 xs:mt-3 sm:mt-8 hidden sm:block">
          <div className="relative w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-3 sm:p-4">
            {/* Search Input Bar */}
            <div className="relative flex items-center w-full bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-200/80 dark:border-slate-700/60 focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <span className="material-symbols-outlined text-blue-600 text-[24px] mr-3 shrink-0">search</span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search universities, courses, destinations, or scholarships..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none border-0 p-0 pr-3"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Instant Fuzzy Dropdown */}
            {showDropdown && (
              <div className="absolute left-3 right-3 sm:left-4 sm:right-4 top-full mt-2 bg-white dark:bg-slate-900 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Instant Match Suggestions</span>
                  <span className="text-blue-600">{matchedCountries.length + matchedServices.length} matches</span>
                </div>
                <div className="max-h-72 overflow-y-auto p-2 space-y-2 no-scrollbar">
                  {matchedCountries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleSelectResult('destination', c.name)}
                      className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-xl">{c.flagEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">{c.name}</span>
                        <span className="text-xs text-slate-400">{c.unisCountText} • {c.avgTuitionText}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">Explore →</span>
                    </button>
                  ))}
                  {matchedServices.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectResult('service', s.title)}
                      className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/60 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">{s.iconName}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">{s.title}</span>
                        <span className="text-xs text-slate-400">{s.category}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600">View →</span>
                    </button>
                  ))}
                  {matchedCountries.length === 0 && matchedServices.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No exact match for "{searchQuery}". Click "Find Programs" to explore the full directory.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filter Row: Destination, Level, Field of Study & CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 items-center">
              {/* Destination */}
              <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">public</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block font-bold text-[9px] tracking-wider uppercase transition-all duration-300 ease-out transform ${
                    selectedDestination !== 'all'
                      ? 'text-amber-500 scale-[1.04] translate-x-0.5'
                      : 'text-slate-400'
                  }`}>
                    Destination {selectedDestination !== 'all' ? `(${selectedDestination})` : ''}
                  </span>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer rounded-xl border border-slate-200/80 dark:border-slate-700/80 px-2 py-1.5 transition-all duration-200 hover:border-amber-400/50 focus:border-[#fbb034] focus:ring-2 focus:ring-[#fbb034]/30"
                  >
                    <option value="all">All Destinations</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Finland">Finland</option>
                    <option value="Greece">Greece</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="India">India</option>
                  </select>
                </div>
              </div>

              {/* Level of Study */}
              <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-bold text-[9px] tracking-wider uppercase text-slate-400">Level of Study</span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer border-0 p-0"
                  >
                    <option value="all">All Levels</option>
                    <option value="undergraduate">Undergraduate (Bachelor's)</option>
                    <option value="postgraduate">Postgraduate (Master's / MBA)</option>
                    <option value="doctorate">Doctorate (PhD)</option>
                    <option value="certificate">Certificate</option>
                    <option value="foundation">Foundation / A-Level</option>
                    <option value="diploma">Diploma</option>
                    <option value="advanced-diploma">Advanced Diploma</option>
                  </select>
                </div>
              </div>

              {/* Field of Study */}
              <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-bold text-[9px] tracking-wider uppercase text-slate-400">Field of Study</span>
                  <select
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer border-0 p-0"
                  >
                    <option value="all">All Programs</option>
                    <option value="cs">Computer Science & IT</option>
                    <option value="business">Business & Management</option>
                    <option value="engineering">Engineering & Applied Sciences</option>
                    <option value="health">Health & Medicine</option>
                    <option value="arts">Arts & Design</option>
                    <option value="social">Social Sciences</option>
                    <option value="natural">Natural Sciences</option>
                    <option value="education">Education & Teaching</option>
                    <option value="hospitality">Hospitality & Tourism</option>
                    <option value="law">Law</option>
                    <option value="architecture">Architecture & Built Environment</option>
                  </select>
                </div>
              </div>

              {/* Find Programs CTA Button */}
              <div className="lg:col-span-3 sm:col-span-2 flex items-center justify-end">
                <InteractiveHoverButton
                  type="button"
                  text="Find Programs"
                  onClick={handleFindPrograms}
                  className="w-full h-10 px-4 rounded-xl bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-300 dark:border-slate-700 font-bold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Nav 4 Gold Action Blocks */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
            {[
              { label: 'Universities', view: 'universities' },
              { label: 'Courses', view: 'courses' },
              { label: 'IELTS Prep', view: 'services', payload: 'ielts-preparation' },
              { label: 'Blogs & News', view: 'blog' }
            ].map((btn, idx) => (
              <InteractiveHoverButton
                key={idx}
                type="button"
                text={btn.label}
                onClick={() => onNavigate(btn.view, btn.payload)}
                className="w-full py-3.5 px-4 bg-white dark:bg-slate-800/80 hover:bg-[#fbb034] text-slate-950 dark:text-white font-bold text-sm sm:text-base rounded-2xl border border-amber-300 dark:border-slate-700 shadow-xs"
              />
            ))}
          </div>

          {/* 4 Animated Counting Number Tickers */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-8 sm:mt-10">
            <StatCounter value={100} suffix="+" label="Students Placed" duration={1800} />
            <StatCounter value={167} suffix="+" label="Partner Universities" duration={1500} />
            <StatCounter value={95} suffix="%" label="Visa Success" duration={1700} />
            <StatCounter value={2} suffix="+" label="Global Offices" duration={1200} />
          </div>
        </div>
      </div>

      {/* Floating Notification Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#fbb034]"></span>
          <span>{toastMsg}</span>
        </div>
      )}
    </section>
  );
};
