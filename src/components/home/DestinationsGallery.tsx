/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Choose your Destination" Infinite Looping Interactive Gallery
 * Features:
 * - Big, bold typographic header matching "Our Services" and "6 Steps to Your Goal"
 * - Automated continuous 120 FPS hardware-accelerated infinite loop (translate3d)
 * - Narrow, subtle edge gradient borders (reduced white overlay on both sides)
 * - Smooth desktop mouse & mobile touch drag-to-scroll with pointer capture
 * - Interactive modal with university counts, intake dates, tuition, and PR/visa rights
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { mockDestinations } from '../../data/mockDatabase.ts';
import { DestinationCountry } from '../../types/index.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';

interface DestinationsGalleryProps {
  onNavigateToCountry: (countryName: string) => void;
  onOpenConsultation: (counselor?: string) => void;
}

export const DestinationsGallery: React.FC<DestinationsGalleryProps> = ({
  onNavigateToCountry,
  onOpenConsultation
}) => {
  const { formatPriceString } = useCurrency();
  const [selectedCountry, setSelectedCountry] = useState<DestinationCountry | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
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

  // Triple destinations for seamless infinite scroll loop
  const infiniteDestinations = [...mockDestinations, ...mockDestinations, ...mockDestinations];

  const scheduleResume = useCallback((delayMs: number = 1800) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, delayMs);
  }, []);

  // Continuous 120 FPS hardware-accelerated auto-scrolling
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Set initial position to the middle set for seamless bi-directional scrolling
    const initTimer = setTimeout(() => {
      if (track) {
        const oneSet = track.scrollWidth / 3;
        if (oneSet > 0 && posRef.current === 0) {
          posRef.current = oneSet;
          track.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
        }
      }
    }, 60);

    const speed = 44; // Pixels per second for smooth, steady drift

    const loop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (track) {
        const oneSetWidth = track.scrollWidth / 3;

        // Smoothly interpolate towards targetOffset when arrow buttons are clicked
        if (Math.abs(targetOffsetRef.current) > 0.5) {
          const step = targetOffsetRef.current * 0.12;
          posRef.current += step;
          targetOffsetRef.current -= step;
        }

        // Auto-scroll when not paused or dragging
        if (!isPausedRef.current && !isDraggingRef.current) {
          posRef.current += speed * delta;
        }

        // Seamless wrap-around boundary check
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
  }, []);

  // Quick slide arrow buttons with smooth lerping
  const slideBy = (direction: 'left' | 'right') => {
    isPausedRef.current = true;
    const amount = direction === 'left' ? -360 : 360;
    targetOffsetRef.current += amount;
    scheduleResume(2400);
  };

  // Pointer drag gestures (supports mouse and touch with 1:1 fidelity)
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
    <section className="relative w-full bg-white dark:bg-[#070b19] py-16 sm:py-24 overflow-hidden border-t border-slate-100 dark:border-slate-800 select-none">
      {/* Header - Big, Bold, and Centered matching other major sections */}
      <div className="max-w-[95%] w-full mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14 text-center">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight flex items-center justify-center flex-wrap gap-2 sm:gap-3 md:gap-3.5 leading-tight text-center">
          <span>Choose your</span>
          <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 md:px-6 py-0.5 sm:py-1 md:py-1.5 rounded-xl sm:rounded-2xl font-black tracking-tight leading-none shadow-sm shrink-0">
            Destination
          </span>
        </h2>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto mb-6 px-2 text-center">
          Explore premier study destinations with top-tier universities, generous post-study work rights, and high visa approval rates.
        </p>
        
        {/* View All & Expand Section CTA Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <InteractiveHoverButton
            type="button"
            text="Explore All Destinations"
            onClick={() => onNavigateToCountry('all')}
            className="min-h-[44px] px-6 py-3 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
          />
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all duration-300 cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExpanded ? 'view_carousel' : 'grid_view'}
            </span>
            <span>{isExpanded ? 'Compact View' : 'Expand Section'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Grid View vs Compact Infinite Carousel with Smooth CSS Transitions */}
      {isExpanded ? (
        <div className="max-w-[95%] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 transition-all duration-500 ease-out animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {mockDestinations.map((dest) => (
              <div
                key={`expanded-${dest.code}`}
                onClick={() => setSelectedCountry(dest)}
                className="group relative h-[360px] sm:h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1.5 border border-slate-200/80 dark:border-slate-800 bg-slate-900"
              >
                <img
                  src={dest.bgImageUrl}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-950/60 to-transparent" />

                <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase mb-0.5">
                    {dest.code}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight leading-tight mb-2 group-hover:text-amber-300 transition-colors">
                    {dest.name}
                  </h3>
                  <div className="space-y-1 text-xs text-slate-300 border-t border-white/10 pt-2 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Intakes:</span>
                      <span className="font-semibold text-white">{dest.intakeText}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tuition:</span>
                      <span className="font-semibold text-white">{dest.avgTuitionText}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToCountry(dest.name);
                    }}
                    className="w-full min-h-[44px] py-2.5 rounded-xl bg-white/15 hover:bg-[#fbbf24] hover:text-slate-950 text-white font-bold text-xs uppercase tracking-wider transition-colors text-center flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    View Universities
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Gallery Carousel Container with Reduced White Shades, Arrows, and Drag/Touch Support */
        <div className="relative w-full overflow-hidden transition-all duration-500 ease-out">
        {/* Left White / Dark Vignette Shade Overlay — Reduced width & subtle opacity */}
        <div 
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 z-20 bg-gradient-to-r from-white/70 to-transparent dark:from-[#070b19]/70 dark:to-transparent"
          aria-hidden="true" 
        />
        {/* Right White / Dark Vignette Shade Overlay — Reduced width & subtle opacity */}
        <div 
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 z-20 bg-gradient-to-l from-white/70 to-transparent dark:from-[#070b19]/70 dark:to-transparent" 
          aria-hidden="true" 
        />

        {/* Left Navigation Arrow */}
        <button
          onClick={() => slideBy('left')}
          aria-label="Previous destination"
          data-purpose="compact-btn"
          className="hidden sm:flex absolute left-1.5 xs:left-2 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-700 items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs hover:bg-[#fbbf24] hover:text-slate-950 dark:hover:bg-[#fbbf24] dark:hover:text-slate-950"
        >
          <span className="material-symbols-outlined text-lg sm:text-2xl font-bold">chevron_left</span>
        </button>

        {/* Right Navigation Arrow */}
        <button
          onClick={() => slideBy('right')}
          aria-label="Next destination"
          data-purpose="compact-btn"
          className="hidden sm:flex absolute right-1.5 xs:right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-700 items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs hover:bg-[#fbbf24] hover:text-slate-950 dark:hover:bg-[#fbbf24] dark:hover:text-slate-950"
        >
          <span className="material-symbols-outlined text-lg sm:text-2xl font-bold">chevron_right</span>
        </button>

        {/* Scrollable Track - GPU-accelerated 120 FPS translate3d with Pointer Drag */}
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
          className="relative w-full overflow-hidden py-3 sm:py-6 px-3 sm:px-8 touch-pan-y cursor-grab active:cursor-grabbing select-none"
        >
          <div
            ref={trackRef}
            className="flex gap-3.5 sm:gap-6 w-max will-change-transform"
          >
            {infiniteDestinations.map((dest, index) => (
              <div
                key={`${dest.code}-${index}`}
                onClick={() => {
                  if (!hasDraggedRef.current) {
                    setSelectedCountry(dest);
                  }
                }}
                className="group relative w-[210px] xs:w-[240px] sm:w-[310px] md:w-[330px] h-[310px] xs:h-[340px] sm:h-[470px] rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 select-none border border-slate-200/80 dark:border-slate-800 bg-slate-900"
              >
                {/* Background City Skyline Image */}
                <img
                  src={dest.bgImageUrl}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
                  loading="lazy"
                  decoding="async"
                />

                {/* Scrim Gradients for Readable Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-slate-950/60 to-transparent" />

                {/* Bottom Info Area */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 xs:p-4 sm:p-6 z-10 flex flex-col justify-end text-white">
                  <span className="text-[9.5px] sm:text-[11px] font-black tracking-widest text-amber-400 uppercase mb-0.5 sm:mb-1">
                    STUDY IN
                  </span>
                  <h3 className="text-lg xs:text-xl sm:text-3xl font-black text-white tracking-tight mb-2 sm:mb-3">
                    {dest.name}
                  </h3>

                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/20">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-200">
                      <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-amber-400">groups</span>
                      <span className="truncate">{dest.studentsCountText}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasDraggedRef.current) {
                          setSelectedCountry(dest);
                        }
                      }}
                      data-purpose="compact-btn"
                      className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-1.5 min-h-[44px] rounded-full bg-[#fbbf24] text-slate-950 font-bold text-xs hover:brightness-105 shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Explore</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

      {/* Destination Quick Info Modal */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCountry(null)}
              className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
              <span className="text-4xl sm:text-5xl">{selectedCountry.flagEmoji}</span>
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                  Study Destination
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {selectedCountry.name}
                </h3>
              </div>
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
                className="min-h-[44px] flex-1 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-[#fbbf24] hover:text-slate-950 dark:hover:bg-[#fbbf24] dark:hover:text-slate-950 transition-all text-center cursor-pointer shadow-md active:scale-95 flex items-center justify-center"
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
