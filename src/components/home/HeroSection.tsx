/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Hero Section with Typewriter Country Cycling, Instant Fuzzy Search & Rolling Number Tickers
 */

import React, { useState, useEffect, useRef } from "react";
import { mockDestinations, mockServices } from "../../data/mockDatabase.ts";
import { InteractiveHoverButton } from "../ui/interactive-hover-button.tsx";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { HeroWorldMapBackground } from "./HeroWorldMapBackground.tsx";
import { UnifiedHeroSearch } from "./UnifiedHeroSearch.tsx";
import { Compass, BarChart3, ChevronDown, GraduationCap, Award, FileText, Building2 } from "lucide-react";

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
  suffix = "",
  label,
  duration = 1800,
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
      { threshold: 0.2 },
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
      className="group relative bg-white dark:bg-[#0B1329] border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 flex flex-col justify-center items-start shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden min-w-0"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-400/10 via-transparent to-transparent rounded-tr-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-baseline gap-0.5 text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-none">
        <span className="tabular-nums transition-all">{count}</span>
        <span className="text-slate-950 dark:text-white font-black text-lg sm:text-3xl ml-0.5 select-none">
          {suffix}
        </span>
      </div>

      <p
        title={label}
        className="text-slate-600 dark:text-slate-300 font-bold text-[11px] xs:text-xs sm:text-sm mt-2 tracking-tight group-hover:text-slate-950 dark:group-hover:text-white transition-colors truncate w-full block leading-none"
      >
        {label}
      </p>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenConsultationModal: _onOpenConsultationModal,
}) => {
  // 1. Typewriter Animation State
  const countries = [
    "Australia",
    "Canada",
    "Cyprus",
    "Finland",
    "France",
    "Greece",
    "Hungary",
    "India",
    "Malaysia",
    "Malta",
    "New Zealand",
    "South Korea",
    "Sweden",
    "United Kingdom",
    "USA"
  ];
  const [countryIndex, setCountryIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("Australia");
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

  // Touch-swipe gestures for Featured Study Destinations Banner
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const handleNextDestination = () => {
    const nextIdx = (countryIndex + 1) % countries.length;
    setCountryIndex(nextIdx);
    setDisplayedText(countries[nextIdx]);
    setIsDeleting(false);
  };

  const handlePrevDestination = () => {
    const prevIdx = (countryIndex - 1 + countries.length) % countries.length;
    setCountryIndex(prevIdx);
    setDisplayedText(countries[prevIdx]);
    setIsDeleting(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    const deltaX = touchDeltaX.current;
    if (Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNextDestination();
      } else {
        handlePrevDestination();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
  };


  // 2. Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [fieldOfStudy, setFieldOfStudy] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isQuickExploreOpen, setIsQuickExploreOpen] = useState(false);
  const [isGeesAtGlanceOpen, setIsGeesAtGlanceOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Guarantee page starts at top of Hero section on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  // Search input looping typewriter placeholder matching uploaded screen
  const typewriterServices = [
    "Health Insurance",
    "Universities",
    "Course Finder",
    "Admission Support",
    "Student Visa",
    "Accommodations",
    "Flight Ticketing",
    "IELTS Preparation",
    "Scholarships",
  ];

  // Instant fuzzy matches
  const q = searchQuery.trim().toLowerCase();
  const matchedCountries = q
    ? mockDestinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q),
      )
    : [];

  const matchedServices = q
    ? mockServices.filter(
        (s) =>
          s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q),
      )
    : [];

  const showDropdown = dropdownOpen && q.length > 0;

  const handleSelectResult = (type: string, name: string) => {
    setSearchQuery(name);
    setDropdownOpen(false);
    showToastNotification(`Selected: ${name}`);
    if (type === "destination") {
      onNavigate("destinations", name);
    } else {
      onNavigate("services", name);
    }
  };

  const showToastNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleFindPrograms = () => {
    onNavigate("courses", {
      query: searchQuery,
      destination: selectedDestination,
      level: selectedLevel,
      field: fieldOfStudy,
    });
  };

  return (
    <section className="relative w-full overflow-visible bg-white dark:bg-[#0B1329] pt-4 min-[390px]:pt-6 sm:pt-12 pb-10 sm:pb-16 lg:pb-24 transition-colors duration-300">
      {/* Decorative Dotted World Map & Continuous Animated Flight Paths (Compact between header and search bar) */}
      <div className="absolute top-0 left-0 right-0 h-[185px] min-[390px]:h-[205px] xs:h-[250px] sm:h-[400px] lg:h-[430px] pointer-events-none select-none z-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]">
        <HeroWorldMapBackground />
      </div>

      <div className="w-full max-w-full sm:max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start relative z-10">
        {/* Title + Graduate Graphic Header */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between gap-2.5 sm:gap-10 relative">
          <div className="flex flex-col items-start flex-1 relative z-20">
            <h1 className="hero-study-in text-[26px] min-[390px]:text-[32px] xs:text-[38px] sm:text-[76px] lg:text-[96px] font-black tracking-[-0.03em] text-slate-900 dark:text-white leading-[1.05] select-none text-balance">
              Study in
            </h1>

            {/* Typewriter Highlight Box with Horizontal Touch-Swipe Gestures */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="region"
              aria-label="Swipeable Study Destinations Banner"
              title="Swipe horizontally on mobile to switch destinations"
              className="hero-typewriter-box mt-1 sm:mt-2.5 inline-flex items-center px-3.5 min-[390px]:px-4 sm:px-8 py-1 sm:py-3 rounded-2xl sm:rounded-3xl shadow-sm bg-[#fbb034] transition-all duration-300 max-w-full touch-pan-y select-none active:scale-[0.98] cursor-grab active:cursor-grabbing group/swipe min-h-[44px]"
            >
              <span className="hero-typewriter text-[20px] min-[390px]:text-[24px] xs:text-[32px] sm:text-[68px] lg:text-[88px] font-black tracking-[-0.025em] text-slate-950 leading-none inline-flex items-center min-h-[1.05em] max-w-full overflow-hidden text-ellipsis">
                <span>{displayedText}</span>
                <span className="ml-1 inline-block w-[2px] sm:w-[5px] h-[0.75em] bg-slate-950 rounded-sm animate-pulse align-baseline shrink-0"></span>
              </span>
            </div>

            <p className="hero-connecting-text mt-2 sm:mt-3 mb-1.5 sm:mb-2 font-bold text-[10px] min-[390px]:text-[11px] sm:text-[13px] tracking-[0.05em] min-[390px]:tracking-[0.1em] sm:tracking-[0.22em] uppercase text-slate-600 dark:text-slate-300 bg-white/75 dark:bg-[#0B1329]/70 backdrop-blur-xs px-2 py-0.5 rounded-md inline-block max-w-full whitespace-normal text-balance">
              CONNECTING YOU TO WORLD CLASS EDUCATION
            </p>
          </div>

          {/* Graduate Photo Card Visual */}
          <div className="hero-girl-container absolute right-[-10px] bottom-0 w-22 xs:w-32 sm:w-auto flex flex-col items-center justify-end shrink-0 pointer-events-none z-10">
            <div className="relative flex items-end justify-center w-full max-w-sm sm:max-w-md">
              <div className="absolute top-10 sm:top-20 w-36 xs:w-48 sm:w-80 h-36 xs:h-48 sm:h-80 bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute top-12 sm:top-24 w-32 xs:w-40 sm:w-72 h-32 xs:h-40 sm:h-72 bg-[#fbb034]/20 rounded-full blur-2xl pointer-events-none -z-10"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3i8ovasBhMoQ1TCIM8b_loTMgx6vCkSvEsw2fJQwFSZyCoNLkXZxKA9EN1sJJ-A3Cwq0yfftq-b7M3savldQvGKkRNTurDSnUnFbValuSkkSZ9I02u8NfOa5w9lnDxukT6Y6TF9d-5czHZTgV_3JN8j9PWYwKKPDtBBm1BDdxTOk3_2wI_1Vk3NYvjoT_o4k9rsKNw4Qh3yZ7iBvQCZmx0L7d8WF5SIdgK6q16NhNSnClDMxmM_jUHniHU-ibe0ndZ6U"
                alt="GEES Successful Graduate Student"
                className="hero-girl-img h-34 min-[390px]:h-40 xs:h-52 sm:h-72 lg:h-84 object-contain pointer-events-none transition-transform duration-500 drop-shadow-2xl opacity-40 min-[390px]:opacity-50 sm:opacity-95 lg:opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Unified Search Component */}
        <div className="w-full relative z-20 mt-4 sm:mt-6">
          <UnifiedHeroSearch onNavigate={onNavigate} />

          {/* Ultra-compact 2-in-1 Single Line Accordion Bar matching screenshot */}
          <div className="w-full bg-white dark:bg-[#0B1329] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-3 mt-3">
            {/* Quick Explore Toggle */}
            <div className="flex-1">
              <button
                type="button"
                onClick={() => setIsQuickExploreOpen(!isQuickExploreOpen)}
                className="w-full flex items-center justify-between text-left cursor-pointer group min-h-[44px] py-1 px-1 focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-[11px] sm:text-sm tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Quick Explore
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-transform duration-300 ${isQuickExploreOpen ? "rotate-180 text-amber-500" : ""}`} />
              </button>

              {isQuickExploreOpen && (
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                  {[
                    { label: "Universities", subtitle: "200+ partner institutions", view: "universities", icon: Building2 },
                    { label: "Course Finder", subtitle: "Explore 1,000+ programs", view: "courses", icon: GraduationCap },
                    { label: "IELTS Prep", subtitle: "Language training center", view: "services", payload: "ielts-preparation", icon: Award },
                    { label: "Blogs & News", subtitle: "Study abroad insights", view: "blog", icon: FileText },
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onNavigate(item.view, item.payload)}
                        className="group/card text-left bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 hover:border-amber-400/80 rounded-lg p-2 sm:p-2.5 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[58px]"
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <IconComp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                          <span className="text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Go →
                          </span>
                        </div>
                        <div>
                          <h4 className="text-slate-900 dark:text-white font-bold text-[10.5px] sm:text-xs tracking-tight">
                            {item.label}
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 text-[9px] sm:text-[10px] truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Vertical Divider on Desktop */}
            <div className="hidden sm:block w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>

            {/* GEES at a Glance Toggle */}
            <div className="flex-1">
              <button
                type="button"
                onClick={() => setIsGeesAtGlanceOpen(!isGeesAtGlanceOpen)}
                className="w-full flex items-center justify-between text-left cursor-pointer group min-h-[44px] py-1 px-1 focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-[11px] sm:text-sm tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    GEES at a glance
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-transform duration-300 ${isGeesAtGlanceOpen ? "rotate-180 text-blue-500" : ""}`} />
              </button>

              {isGeesAtGlanceOpen && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                  <StatCounter value={100} suffix="+" label="Students Placed" duration={1800} />
                  <StatCounter value={210} suffix="+" label="Partner Unis" duration={1500} />
                  <StatCounter value={100} suffix="+" label="Campuses" duration={1600} />
                  <StatCounter value={1000} suffix="+" label="Courses" duration={1900} />
                  <StatCounter value={95} suffix="%" label="Visa Success" duration={1700} />
                  <StatCounter value={15} suffix="+" label="Destinations" duration={1200} />
                </div>
              )}
            </div>
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
