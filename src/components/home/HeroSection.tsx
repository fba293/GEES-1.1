/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Full-Width Responsive Hero Section with Celebratory Graduation Banner & Floating Search Panel
 */

import React, { useState, useEffect, useRef } from "react";
import { UnifiedHeroSearch } from "./UnifiedHeroSearch.tsx";

interface HeroSectionProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultationModal: (counselorName?: string) => void;
}

const HERO_COUNTRIES = [
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
  "USA",
];

const HERO_BANNER_IMAGE =
  "/assets/aistudio/Celebratory_Graduation_Hero_Banner_79be5e05.png";

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenConsultationModal: _onOpenConsultationModal,
}) => {
  // Typewriter Animation State
  const [countryIndex, setCountryIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("Australia");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentWord = HERO_COUNTRIES[countryIndex];

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
        setCountryIndex((prev) => (prev + 1) % HERO_COUNTRIES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, countryIndex]);

  // Touch-swipe gestures for Featured Study Destinations Banner
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const handleNextDestination = () => {
    const nextIdx = (countryIndex + 1) % HERO_COUNTRIES.length;
    setCountryIndex(nextIdx);
    setDisplayedText(HERO_COUNTRIES[nextIdx]);
    setIsDeleting(false);
  };

  const handlePrevDestination = () => {
    const prevIdx =
      (countryIndex - 1 + HERO_COUNTRIES.length) % HERO_COUNTRIES.length;
    setCountryIndex(prevIdx);
    setDisplayedText(HERO_COUNTRIES[prevIdx]);
    setIsDeleting(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
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
    touchDeltaX.current = 0;
  };

  // Guarantee page starts at top of Hero section on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  return (
    <section className="relative w-full -mt-2 sm:mt-0 lg:-mt-4 bg-white dark:bg-[#0B1329] pb-8 sm:pb-12 lg:pb-16 transition-colors duration-300">
      {/* Full-Width Edge-to-Edge Responsive Hero Banner */}
      <div className="relative w-full overflow-hidden bg-[#efeff0] min-h-[clamp(265px,64vw,310px)] sm:min-h-[clamp(360px,46vw,430px)] lg:min-h-[clamp(480px,38.9vw,660px)]">
        {/* Uploaded Celebratory Graduation Hero Banner — Anchored Top-Right (100% 0%) so Cap & Face Never Crop */}
        <img
          src={HERO_BANNER_IMAGE}
          alt="Celebrating graduate holding graduation cap and diploma"
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-right-top dark:brightness-[0.94] transition-all duration-300"
        />

        {/* Subtle Mobile-Only Left Readability Veil (Keeps Graduate Face & Cap Completely Clear on Right) */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-y-0 left-0 w-[56%] bg-gradient-to-r from-[#efeff0]/95 via-[#efeff0]/70 to-transparent sm:hidden"
        />

        {/* Left-Aligned Hero Headline, Yellow Typewriter Box & Tagline — Aligned to Universal Header Grid */}
        <div className="relative z-20 w-full sm:w-[96%] max-w-[1600px] mx-auto px-3 xs:px-4 sm:px-6 md:px-7 lg:px-8 xl:px-10 pt-[clamp(1.5rem,4.5vw,4.5rem)] pb-[clamp(4.25rem,11vw,11.5rem)]">
          <div className="flex flex-col items-start max-w-[54%] min-[430px]:max-w-[56%] sm:max-w-[54%] md:max-w-[52%] lg:max-w-[50%]">
            <h1 className="hero-study-in text-[clamp(1.85rem,5.2vw,5.25rem)] font-black tracking-[-0.03em] text-[#0B1329] leading-[1.03] select-none text-balance">
              Study in
            </h1>

            {/* Yellow Highlight Box with Typewriter Country Cycling & Mobile Swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="region"
              aria-label="Swipeable Study Destinations Banner"
              title="Swipe horizontally on mobile to switch destinations"
              className="hero-typewriter-box mt-[clamp(0.4rem,1vw,0.95rem)] inline-flex items-center px-[clamp(0.75rem,2vw,2.25rem)] py-[clamp(0.35rem,0.9vw,0.85rem)] rounded-[clamp(0.85rem,1.8vw,1.5rem)] bg-[#fbb034] shadow-[0_8px_24px_rgba(251,176,52,0.25)] transition-transform duration-200 max-w-full touch-pan-y select-none active:scale-[0.98] cursor-grab active:cursor-grabbing min-h-[44px]"
            >
              <span className="hero-typewriter text-[clamp(1.35rem,4.6vw,4.65rem)] font-black tracking-[-0.025em] text-[#0B1329] leading-[1.08] inline-flex items-center min-h-[1.08em] max-w-full overflow-hidden whitespace-nowrap">
                <span className="truncate">{displayedText}</span>
                <span
                  aria-hidden="true"
                  className="ml-1 sm:ml-1.5 inline-block w-[2.5px] sm:w-[4.5px] h-[0.78em] bg-[#0B1329] rounded-sm animate-pulse shrink-0"
                />
              </span>
            </div>

            <p className="hero-connecting-text mt-[clamp(0.65rem,1.4vw,1.35rem)] font-bold text-[clamp(0.625rem,1vw,0.875rem)] tracking-[clamp(0.08em,0.18vw,0.22em)] uppercase text-slate-700 leading-relaxed max-w-[175px] min-[430px]:max-w-[215px] sm:max-w-none">
              CONNECTING YOU TO WORLD CLASS EDUCATION
            </p>
          </div>
        </div>
      </div>

      {/* Floating Overlapping Search Panel — Constrained to Universal Header Max Width & Padding */}
      <div className="relative z-30 w-full sm:w-[96%] max-w-[1600px] mx-auto px-3 xs:px-4 sm:px-6 md:px-7 lg:px-8 xl:px-10 -mt-10 sm:-mt-24 md:-mt-28 lg:-mt-32 xl:-mt-36">
        <UnifiedHeroSearch onNavigate={onNavigate} />
      </div>
    </section>
  );
};
