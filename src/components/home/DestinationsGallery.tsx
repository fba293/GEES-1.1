/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Choose your Destination" Section
 * Clean, Modern, Premium International Education Destination Showcase
 * Features:
 * - "YOUR NEXT CHAPTER STARTS HERE" uppercase eyebrow badge
 * - "Choose your [Destination]" heading with GEES orange badge
 * - Segmented text-only continent filter pills (All, Europe, Oceania, North America, Asia)
 * - Content toolbar: "Showing X destinations" on left, "See All Countries" and view switcher on right
 * - Clean destination cards with yellow "STUDY IN" eyebrow, bold title, starting tuition in local currency, and yellow "Explore →" button
 * - Footer caption "Cards move automatically. Hover or focus to pause, or swipe on touch screens."
 * - Continuous hardware-accelerated right-to-left 120 FPS auto-scrolling carousel in Compact View
 * - Responsive grid layout in Expand View
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { mockDestinations } from '../../data/mockDatabase.ts';
import { DestinationCountry } from '../../types/index.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { AnimatedTabs, AnimatedTabItem } from '../ui/animated-tabs.tsx';

interface DestinationsGalleryProps {
  onNavigateToCountry: (countryName: string) => void;
  onOpenConsultation: (counselor?: string) => void;
}

const getRegionKey = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('australia') || n.includes('zealand')) return 'oceania';
  if (n.includes('canada') || n.includes('usa') || n.includes('united states')) return 'north-america';
  if (n.includes('malaysia') || n.includes('india') || n.includes('korea')) return 'asia';
  return 'europe';
};

const getStartingTuition = (dest: DestinationCountry): string => {
  const raw = dest.avgTuitionText || '';
  const parts = raw.split('-');
  let startingPart = parts[0].trim();
  
  if (dest.name.toLowerCase().includes('malaysia')) {
    startingPart = startingPart.replace('$', '').replace('MYR', '').trim();
    startingPart = `RM ${startingPart}`;
  }
  
  if (!startingPart.includes('/ yr') && !startingPart.includes('/yr')) {
    startingPart += ' / yr';
  }
  return startingPart;
};

export const DestinationsGallery: React.FC<DestinationsGalleryProps> = ({
  onNavigateToCountry,
  onOpenConsultation
}) => {
  const { formatPriceString } = useCurrency();
  const [selectedCountry, setSelectedCountry] = useState<DestinationCountry | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [mobileSlideIndex, setMobileSlideIndex] = useState<number>(0);
  const slideTouchStartX = useRef<number | null>(null);

  const handlePrevSlide = () => {
    setMobileSlideIndex((prev) => (prev - 1 + filteredDestinations.length) % filteredDestinations.length);
  };
  const handleNextSlide = () => {
    setMobileSlideIndex((prev) => (prev + 1) % filteredDestinations.length);
  };
  const handleSlideTouchStart = (e: React.TouchEvent) => {
    slideTouchStartX.current = e.touches[0].clientX;
  };
  const handleSlideTouchEnd = (e: React.TouchEvent) => {
    if (slideTouchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - slideTouchStartX.current;
    if (Math.abs(diff) > 35) {
      if (diff > 0) handlePrevSlide();
      else handleNextSlide();
    }
    slideTouchStartX.current = null;
  };
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<number>(0);
  const targetOffsetRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartPosRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Text-only continent filter labels strictly matching prototype specification
  const regionTabs: AnimatedTabItem[] = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'europe', label: 'Europe' },
    { id: 'oceania', label: 'Oceania' },
    { id: 'north-america', label: 'North America' },
    { id: 'asia', label: 'Asia' }
  ], []);

  // Filter destination dataset based on selected continent
  const filteredDestinations = useMemo(() => {
    if (activeRegion === 'all') return mockDestinations;
    return mockDestinations.filter(d => getRegionKey(d.name) === activeRegion);
  }, [activeRegion]);

  const repeatCount = filteredDestinations.length <= 2 ? 6 : (filteredDestinations.length < 4 ? 4 : 3);

  // Multi-set filtered dataset for seamless 120 FPS infinite right-to-left scroll loop
  const infiniteDestinations = useMemo(() => {
    if (filteredDestinations.length === 0) return [];
    let arr = [];
    for (let i = 0; i < repeatCount; i++) {
      arr.push(...filteredDestinations);
    }
    return arr;
  }, [filteredDestinations, repeatCount]);

  const scheduleResume = useCallback((delayMs: number = 1800) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, delayMs);
  }, []);

  // Continuous 120 FPS hardware-accelerated right-to-left auto-scrolling
  useEffect(() => {
    if (isExpanded) return;

    const track = trackRef.current;
    if (!track) return;

    const initTimer = setTimeout(() => {
      if (track) {
        const oneSet = track.scrollWidth / repeatCount;
        if (oneSet > 0 && posRef.current === 0) {
          posRef.current = oneSet;
          track.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
        }
      }
    }, 60);

    const speed = filteredDestinations.length <= 2 ? 24 : (filteredDestinations.length < 4 ? 32 : 44); // Adaptive smooth speed based on item count

    const loop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (track) {
        const oneSetWidth = track.scrollWidth / repeatCount;

        if (Math.abs(targetOffsetRef.current) > 0.5) {
          const step = targetOffsetRef.current * 0.12;
          posRef.current += step;
          targetOffsetRef.current -= step;
        }

        if (!isPausedRef.current && !isDraggingRef.current) {
          posRef.current += speed * delta;
        }

        if (oneSetWidth > 0) {
          if (posRef.current >= oneSetWidth * 2) {
            posRef.current -= oneSetWidth;
          } else if (posRef.current <= 0) {
            posRef.current += oneSetWidth;
          }
        }

        track.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      clearTimeout(initTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [isExpanded, filteredDestinations]);

  // Arrow button click handler with smooth lerp
  const slideBy = (direction: 'left' | 'right') => {
    isPausedRef.current = true;
    const amount = direction === 'left' ? -360 : 360;
    targetOffsetRef.current += amount;
    scheduleResume(2400);
  };

  // Pointer drag gesture handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    isPausedRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - dragStartXRef.current;
    if (Math.abs(diff) > 5) {
      hasDraggedRef.current = true;
    }
    posRef.current = dragStartPosRef.current - diff;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      scheduleResume(1800);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);
    }
  };

  return (
    <section className="relative w-full bg-slate-50/50 dark:bg-[#0B1329] py-10 min-[390px]:py-12 sm:py-16 md:py-20 pb-28 sm:pb-24 overflow-hidden border-t border-slate-100 dark:border-slate-800 select-none">
      {/* Header Container */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        {/* Eyebrow Subtitle */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-8 sm:w-12 bg-slate-300 dark:bg-slate-700"></span>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            YOUR NEXT CHAPTER STARTS HERE
          </span>
          <span className="h-px w-8 sm:w-12 bg-slate-300 dark:bg-slate-700"></span>
        </div>

        {/* Section Heading with GEES Orange Badge */}
        <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 leading-none text-center mb-4">
          <span>Choose your</span>
          <span className="bg-[#ffb52e] text-slate-950 px-4 sm:px-6 py-1.5 sm:py-2 rounded-2xl font-black tracking-tight leading-none shadow-xs shrink-0 inline-block">
            Destination
          </span>
        </h2>
        
        {/* Short introductory copy */}
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl mx-auto mb-8 px-2 text-center">
          Explore study destinations, discover new opportunities and find the right place to begin your international education journey.
        </p>

        {/* Continent Filter Segmented Pills (Horizontally scrollable on mobile) */}
        <div className="w-full flex justify-start sm:justify-center overflow-x-auto whitespace-nowrap scrollbar-none pb-2 sm:pb-0 px-2 sm:px-0 max-w-full mb-6">
          <AnimatedTabs
            tabs={regionTabs}
            activeId={activeRegion}
            onChange={(id) => {
              setActiveRegion(id);
              posRef.current = 0;
            }}
            size="md"
            className="bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800"
            pillClassName="bg-[#0A1120] dark:bg-white"
          />
        </div>
      </div>

      {/* Content Toolbar: Reorganized for mobile & tablet responsiveness matching mockup */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col items-center gap-4">
        {/* Row 1: Showing X destinations on left, Show All Destinations (15) → on right */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm">
          <div className="text-slate-500 dark:text-slate-400 font-medium">
            Showing <strong className="font-extrabold text-slate-900 dark:text-white">{filteredDestinations.length}</strong> destinations
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveRegion('all');
              onNavigateToCountry('all');
            }}
            className="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer py-1 px-1"
          >
            <span>See all countries</span>
            <span className="transition-transform duration-200 hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Row 2: Compact / Expand Pill Segmented Control Centered */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700 rounded-full shadow-2xs">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              !isExpanded
                ? 'bg-[#0A1120] dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5" cy="8" r="1.5" fill="currentColor"/>
              <line x1="11" y1="8" x2="19" y2="8"/>
              <circle cx="5" cy="16" r="1.5" fill="currentColor"/>
              <line x1="11" y1="16" x2="19" y2="16"/>
            </svg>
            <span>Compact</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isExpanded
                ? 'bg-[#0A1120] dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3.5" y="3.5" width="7" height="7" rx="2"/>
              <rect x="13.5" y="3.5" width="7" height="7" rx="2"/>
              <rect x="13.5" y="13.5" width="7" height="7" rx="2"/>
              <rect x="3.5" y="13.5" width="7" height="7" rx="2"/>
            </svg>
            <span>Expand</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isExpanded ? (
        /* EXPAND VIEW: Grid layout (2x2 grid on mobile/tablet matching Screenshot 2) */
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 transition-all duration-500 ease-out animate-fadeIn">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
              No destinations found for this filter.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={`expanded-${dest.code}`}
                  onClick={() => setSelectedCountry(dest)}
                  className="group relative h-[320px] xs:h-[360px] sm:h-[420px] rounded-[23px] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1.5 border border-slate-200/80 dark:border-slate-800 bg-[#253149]"
                >
                  {/* Backdrop Photo */}
                  <img
                    src={dest.bgImageUrl}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950/90" />

                  {/* Card Bottom Area */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-7 z-10 flex flex-col justify-end text-white">
                    <span className="text-[9px] sm:text-xs font-black tracking-wide text-[#ffb52e] mb-0.5 sm:mb-1 block">
                      Study in
                    </span>
                    <h3 className="text-lg xs:text-xl sm:text-3xl font-extrabold font-display text-white tracking-tight mb-1.5 sm:mb-2 group-hover:text-[#ffd27c] transition-colors truncate">
                      {dest.name}
                    </h3>
                    
                    {/* Divider Line & Tuition on left, Explore on right */}
                    <div className="border-t border-white/25 pt-2 sm:pt-3 flex items-center justify-between mt-1">
                      <div>
                        <div className="text-[7px] sm:text-[9px] font-medium text-slate-300/80 tracking-wide uppercase">Tuition from</div>
                        <div className="text-[10px] xs:text-xs sm:text-sm font-extrabold text-white">{getStartingTuition(dest)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToCountry(dest.name);
                        }}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-[#ffb52e] hover:text-amber-200 transition-all cursor-pointer"
                      >
                        <span>Explore</span>
                        <span className="text-sm leading-none transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* COMPACT VIEW */
        <>
          {/* Mobile Slideshow View (<= 430px / sm breakpoint) matching Screenshot 1 */}
          <div 
            className="block sm:hidden relative w-full px-4 py-2 touch-pan-y"
            style={{ touchAction: 'pan-y' }}
            onTouchStart={handleSlideTouchStart}
            onTouchEnd={handleSlideTouchEnd}
          >
            {filteredDestinations.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">No destinations found.</div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Active Card with Left/Right Buttons in the middle */}
                <div className="relative w-full max-w-[340px] h-[480px] rounded-[26px] overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 bg-[#253149]">
                  {/* Background Image */}
                  <img
                    src={filteredDestinations[mobileSlideIndex % filteredDestinations.length].bgImageUrl}
                    alt={filteredDestinations[mobileSlideIndex % filteredDestinations.length].name}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950/90" />

                  {/* Left Arrow Button in the middle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevSlide();
                    }}
                    aria-label="Previous destination"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl font-bold">chevron_left</span>
                  </button>

                  {/* Right Arrow Button in the middle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextSlide();
                    }}
                    aria-label="Next destination"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl font-bold">chevron_right</span>
                  </button>

                  {/* Card Bottom Area */}
                  <div 
                    onClick={() => setSelectedCountry(filteredDestinations[mobileSlideIndex % filteredDestinations.length])}
                    className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end text-white cursor-pointer"
                  >
                    <span className="text-xs font-black tracking-wide text-[#ffb52e] mb-1 block">
                      Study in
                    </span>
                    <h3 className="text-3xl font-extrabold font-display text-white tracking-tight mb-3">
                      {filteredDestinations[mobileSlideIndex % filteredDestinations.length].name}
                    </h3>

                    <div className="border-t border-white/25 pt-3 flex items-center justify-between mt-1">
                      <div>
                        <div className="text-[9px] font-medium text-slate-300/80 tracking-wide uppercase">Tuition from</div>
                        <div className="text-sm font-extrabold text-white">
                          {getStartingTuition(filteredDestinations[mobileSlideIndex % filteredDestinations.length])}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-black text-[#ffb52e]">
                        <span>Explore</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pagination Dots at Bottom */}
                <div className="flex items-center gap-2 mt-5">
                  {filteredDestinations.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMobileSlideIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`rounded-full transition-all cursor-pointer ${
                        (mobileSlideIndex % filteredDestinations.length) === i
                          ? 'w-6 h-2 bg-[#ffb52e]'
                          : 'w-2 h-2 bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Marquee Carousel View (> sm breakpoint) */}
          <div className="hidden sm:block relative w-full overflow-hidden transition-all duration-500 ease-out">
            {/* Edge Vignette Fades */}
            <div 
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-20 bg-gradient-to-r from-slate-50/90 to-transparent dark:from-[#0B1329]/90 dark:to-transparent"
              aria-hidden="true" 
            />
            <div 
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-20 bg-gradient-to-l from-slate-50/90 to-transparent dark:from-[#0B1329]/90 dark:to-transparent" 
              aria-hidden="true" 
            />

            {/* Carousel Arrow Left */}
            <button
              onClick={() => slideBy('left')}
              aria-label="Previous destination"
              className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-700 items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs hover:bg-[#ffb52e] hover:text-slate-950 dark:hover:bg-[#ffb52e] dark:hover:text-slate-950"
            >
              <span className="material-symbols-outlined text-xl font-bold">chevron_left</span>
            </button>

            {/* Carousel Arrow Right */}
            <button
              onClick={() => slideBy('right')}
              aria-label="Next destination"
              className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-700 items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs hover:bg-[#ffb52e] hover:text-slate-950 dark:hover:bg-[#ffb52e] dark:hover:text-slate-950"
            >
              <span className="material-symbols-outlined text-xl font-bold">chevron_right</span>
            </button>

            {/* Continuous Scroll Track */}
            <div
              ref={containerRef}
              onMouseEnter={() => {
                isPausedRef.current = true;
              }}
              onMouseLeave={() => {
                if (!isDraggingRef.current) {
                  isPausedRef.current = false;
                }
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-full overflow-hidden py-3 sm:py-5 px-3 sm:px-6 touch-pan-y cursor-grab active:cursor-grabbing select-none"
            >
              {infiniteDestinations.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
                  No destinations found for this filter.
                </div>
              ) : (
                <div
                  ref={trackRef}
                  className="flex gap-4 sm:gap-6 w-max will-change-transform"
                >
                  {infiniteDestinations.map((dest, index) => (
                    <div
                      key={`${dest.code}-${index}`}
                      onClick={() => {
                        if (!hasDraggedRef.current) {
                          setSelectedCountry(dest);
                        }
                      }}
                      className="group relative w-[86vw] max-w-[380px] sm:w-[330px] h-[460px] sm:h-[430px] rounded-[23px] overflow-hidden shrink-0 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/80 dark:border-slate-800 bg-[#253149]"
                    >
                      {/* Background City Image */}
                      <img
                        src={dest.bgImageUrl}
                        alt={dest.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950/90" />

                      {/* Bottom Card Content */}
                      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 z-10 flex flex-col justify-end text-white">
                        <span className="text-[10px] sm:text-xs font-black tracking-wide text-[#ffb52e] mb-1 block">
                          Study in
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight mb-2 group-hover:text-[#ffd27c] transition-colors">
                          {dest.name}
                        </h3>

                        {/* Divider Line & Tuition on left, Explore on right */}
                        <div className="border-t border-white/25 pt-3 flex items-center justify-between mt-1">
                          <div>
                            <div className="text-[8px] sm:text-[9px] font-medium text-slate-300/80 tracking-wide">Tuition from</div>
                            <div className="text-xs sm:text-sm font-extrabold text-white">{getStartingTuition(dest)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!hasDraggedRef.current) {
                                setSelectedCountry(dest);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#ffb52e] hover:text-amber-200 transition-all opacity-0 group-hover:opacity-100 duration-300 cursor-pointer shrink-0"
                          >
                            <span>Explore</span>
                            <span className="text-base leading-none transition-transform duration-200 group-hover:translate-x-1">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Destination Quick Info Modal */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0B1329] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCountry(null)}
              className="absolute top-4 right-4 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Modal Header */}
            <div className="mb-5 sm:mb-6">
              <span className="text-xs font-bold text-[#ffb52e] uppercase tracking-widest block mb-1">
                Study Destination
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {selectedCountry.name}
              </h3>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block mb-1">
                  Partner Universities
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {selectedCountry.unisCountText}
                </span>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block mb-1">
                  Average Tuition
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {formatPriceString(selectedCountry.avgTuitionText)}
                </span>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block mb-1">
                  Major Intakes
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {selectedCountry.intakeText}
                </span>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block mb-1">
                  Post-Study Work
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {selectedCountry.pswText}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col xs:flex-row gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  const country = selectedCountry.name;
                  setSelectedCountry(null);
                  onNavigateToCountry(country);
                }}
                className="min-h-[44px] flex-1 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-[#ffb52e] hover:text-slate-950 dark:hover:bg-[#ffb52e] dark:hover:text-slate-950 transition-all text-center cursor-pointer shadow-md active:scale-95 flex items-center justify-center"
              >
                View Universities in {selectedCountry.name}
              </button>
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  onOpenConsultation();
                }}
                className="min-h-[44px] py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              >
                Free Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DestinationsGallery;
