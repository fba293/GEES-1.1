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

interface HeroSectionProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultationModal: (counselorName?: string) => void;
}

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
      {/* Decorative Dotted World Map & Subtle Animated Flight Paths (Low-focus ambient background) */}
      <div className="absolute top-0 left-0 right-0 h-[185px] min-[390px]:h-[205px] xs:h-[250px] sm:h-[390px] lg:h-[420px] pointer-events-none select-none z-0 overflow-hidden opacity-75 dark:opacity-70 [mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)]">
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
