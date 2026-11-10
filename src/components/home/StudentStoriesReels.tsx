/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Journey with GEES" Student Video Stories & Reels Showcase
 * Features:
 * - Automated continuous 120 FPS hardware-accelerated infinite loop (right-to-left drift)
 * - Pointer drag (mouse & touch) with 1:1 gesture tracking and auto-resume
 * - Ultra-compact mobile proportions optimized for small phones (iPhone 16 / 375px-430px)
 * - Minimized fullscreen button and micro-badges to maximize video readability
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { mockReels } from '../../data/mockDatabase.ts';
import { ReelStory } from '../../types/index.ts';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

const StoryCard: React.FC<{ reel: ReelStory; onClick: () => void }> = ({ reel, onClick }) => (
  <div
    onClick={onClick}
    className="group relative w-[190px] xs:w-[220px] min-[400px]:w-[240px] sm:w-[310px] md:w-[330px] h-[300px] xs:h-[330px] sm:h-[470px] rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 select-none border border-slate-200/80 dark:border-slate-800 bg-slate-900"
  >
    <img
      src={reel.posterUrl}
      alt={reel.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
    <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-slate-950/60 to-transparent" />
    <div className="absolute bottom-0 inset-x-0 p-3.5 xs:p-4 sm:p-6 z-10 text-white">
      <span className="text-amber-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">{reel.category}</span>
      <h3 className="text-lg font-bold">{reel.name}</h3>
    </div>
  </div>
);

export const StudentStoriesReels: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'campus' | 'visa' | 'vlogs' | 'grad'>('all');
  const [isSwitching, setIsSwitching] = useState(false);
  const [activeStoryModal, setActiveStoryModal] = useState<ReelStory | null>(null);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);

  const storyTabs = [
    { label: 'All Stories', id: 'all' },
    { label: 'Campus Life', id: 'campus' },
    { label: 'Visa Arrivals', id: 'visa' },
    { label: 'Student Vlogs', id: 'vlogs' },
    { label: 'Graduation', id: 'grad' }
  ];

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

  const filteredReels = selectedFilter === 'all'
    ? mockReels
    : mockReels.filter(r => r.category === selectedFilter);

  // Triple the reels for a seamless infinite loop
  const infiniteReels = [...filteredReels, ...filteredReels, ...filteredReels];

  const scheduleResume = useCallback((delayMs: number = 1800) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, delayMs);
  }, []);

  // Continuous 120 FPS hardware-accelerated right-to-left infinite scrolling
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Set initial position to middle set
    const initTimer = setTimeout(() => {
      if (track) {
        const oneSet = track.scrollWidth / 3;
        if (oneSet > 0) {
          posRef.current = oneSet;
          track.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
        }
      }
    }, 60);

    const speed = 38; // Steady, fluid pixels per second drift

    const loop = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (track) {
        const oneSetWidth = track.scrollWidth / 3;

        // Smoothly interpolate target offsets from arrow clicks
        if (Math.abs(targetOffsetRef.current) > 0.5) {
          const step = targetOffsetRef.current * 0.12;
          posRef.current += step;
          targetOffsetRef.current -= step;
        }

        // Auto-scroll right-to-left when not paused or dragging
        if (!isPausedRef.current && !isDraggingRef.current) {
          posRef.current += speed * delta;
        }

        // Seamless boundary wrap-around
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
  }, [selectedFilter]);

  const slideBy = (direction: 'left' | 'right') => {
    isPausedRef.current = true;
    const amount = direction === 'left' ? -300 : 300;
    targetOffsetRef.current += amount;
    scheduleResume(2200);
  };

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

  const handleToggleLike = (id: string) => {
    setLikedStories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="relative w-full max-w-full overflow-hidden bg-white dark:bg-[#0B1329] py-12 min-[390px]:py-16 sm:py-24 px-4 sm:px-6 lg:px-8 select-none border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto w-full overflow-hidden">
        {/* Section Heading — Premium Visual Hierarchy */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#0A1120] dark:text-white flex items-center justify-center flex-wrap gap-2 sm:gap-3 md:gap-3.5 leading-tight text-center">
            <span>Student</span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 md:px-6 py-0.5 sm:py-1 md:py-1.5 rounded-xl sm:rounded-2xl font-black tracking-tight leading-none shadow-sm shrink-0">
              Stories
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto px-2 text-center">
            Real experiences. Real achievements. Inspiring journeys from our students around the world.
          </p>

          {/* Category Filter Pills — Compact & Professional */}
          <div className="w-full pt-6 sm:pt-8 flex justify-center">
            <AnimatedTabs
              tabs={storyTabs}
              activeId={selectedFilter}
              onChange={(id) => {
                setIsSwitching(true);
                setSelectedFilter(id as any);
                setTimeout(() => setIsSwitching(false), 240);
              }}
              size="md"
              className="bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800"
              pillClassName="bg-[#0A1120] dark:bg-white"
            />
          </div>
        </header>

        {/* Reels Carousel Horizontal Gallery */}
        <div className="relative w-full max-w-full overflow-hidden group">
          {/* Subtle Left & Right Edge Vignettes */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 z-20 bg-gradient-to-r from-white dark:from-[#0B1329] via-white/40 dark:via-[#0B1329]/40 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 z-20 bg-gradient-to-l from-white dark:from-[#0B1329] via-white/40 dark:via-[#0B1329]/40 to-transparent"
            aria-hidden="true"
          />

          {/* Navigation Arrows — Subtle & Professional */}
          <button
            onClick={() => slideBy('left')}
            aria-label="Scroll left"
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 dark:bg-[#0A1120]/90 text-[#0A1120] dark:text-white shadow-lg border border-slate-100 dark:border-slate-800 items-center justify-center hover:bg-[#fbb034] hover:text-slate-950 dark:hover:bg-[#fbb034] dark:hover:text-slate-950 transition-all cursor-pointer backdrop-blur-md opacity-0 group-hover:opacity-100 active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>

          <button
            onClick={() => slideBy('right')}
            aria-label="Scroll right"
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 dark:bg-[#0A1120]/90 text-[#0A1120] dark:text-white shadow-lg border border-slate-100 dark:border-slate-800 items-center justify-center hover:bg-[#fbb034] hover:text-slate-950 dark:hover:bg-[#fbb034] dark:hover:text-slate-950 transition-all cursor-pointer backdrop-blur-md opacity-0 group-hover:opacity-100 active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>

          {/* Horizontal Reel Track Container */}
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
            className="relative w-full overflow-hidden py-4 sm:py-6 touch-pan-y cursor-grab active:cursor-grabbing select-none"
          >
            <div
              className={`absolute inset-0 bg-white/40 dark:bg-[#0B1329]/40 backdrop-blur-[1px] z-30 transition-opacity duration-240 ease-out pointer-events-none ${
                isSwitching ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              ref={trackRef}
              className="flex gap-4 min-[430px]:gap-6 sm:gap-6 md:gap-7 w-max will-change-transform"
            >
              {infiniteReels.map((reel, index) => (
                <StoryCard
                  key={`${reel.id}-${index}`}
                  reel={reel}
                  onClick={() => {
                    if (!hasDraggedRef.current) {
                      setActiveStoryModal(reel);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA — View All Student Stories */}
        <div className="mt-10 sm:mt-16 text-center flex justify-center">
          <InteractiveHoverButton
            type="button"
            text="View All Student Stories"
            className="bg-white dark:bg-[#0B1329] text-[#0A1120] dark:text-white border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#fbb034] transition-colors h-11 sm:h-12 px-8 font-bold text-sm sm:text-base rounded-full"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/success-stories.html';
              }
            }}
          />
        </div>

        {/* Full Story Modal Player — Preserved Logic, Refined UI */}
        {activeStoryModal && (
          <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-2 min-[430px]:p-4 animate-fadeIn">
            {/* Close Modal with Comfort Target */}
            <button
              onClick={() => setActiveStoryModal(null)}
              aria-label="Close story"
              className="absolute top-4 right-4 sm:top-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-[110] border border-white/10 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Modal Container */}
            <div className="relative w-full max-w-[400px] aspect-[9/16] max-h-[88vh] bg-black rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10">
              <video
                src={activeStoryModal.videoUrl}
                poster={activeStoryModal.posterUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/40"></div>

              {/* Top Bar with Progress, Avatar, and Sound */}
              <div className="relative z-20 pt-5 px-5 space-y-4">
                <div className="flex gap-1.5">
                  <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-[#fbb034] w-2/3"></div>
                  </div>
                  <div className="h-1 flex-1 bg-white/20 rounded-full"></div>
                  <div className="h-1 flex-1 bg-white/20 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fbb034] text-[#0A1120] font-black flex items-center justify-center text-sm ring-2 ring-white/20 shadow-md">
                      {activeStoryModal.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight leading-none">
                        {activeStoryModal.name}
                      </h4>
                      <span className="text-[11px] text-white/70 flex items-center gap-1.5 font-semibold mt-1">
                        <span>{activeStoryModal.flagEmoji}</span>
                        <span>{activeStoryModal.location}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer"
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isMuted ? 'volume_off' : 'volume_up'}
                      </span>
                    </button>
                    <a
                      href={activeStoryModal.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
                      title="Watch on TikTok"
                      aria-label="Watch on TikTok"
                    >
                      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Floating Actions — 44px hit targets */}
              <div className="absolute right-4 bottom-28 sm:bottom-32 z-20 flex flex-col items-center gap-4 text-white">
                <button
                  onClick={() => handleToggleLike(activeStoryModal.id)}
                  className="flex flex-col items-center group cursor-pointer"
                  aria-label="Like story"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 active:scale-90 ${likedStories[activeStoryModal.id] ? 'text-red-500' : 'text-white'}`}>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black mt-1.5 shadow-sm">{activeStoryModal.likesCount}</span>
                </button>

                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer active:scale-90">
                    <span className="material-symbols-outlined text-xl">chat_bubble</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black mt-1.5 shadow-sm">428</span>
                </div>
              </div>

              {/* Bottom Overlay Details — Editorial Depth */}
              <div className="relative z-20 p-5 sm:p-6 pr-16 text-white bg-gradient-to-t from-black via-black/80 to-transparent">
                <span className="px-2 py-0.5 rounded bg-[#fbb034] text-[#0A1120] text-[9px] sm:text-[10px] font-black uppercase tracking-wider inline-block mb-2">
                  {activeStoryModal.categoryBadge}
                </span>
                <p className="text-sm font-bold text-[#fbb034] mb-1 leading-snug">
                  {activeStoryModal.universityAndCourse}
                </p>
                <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed italic">
                  "{activeStoryModal.quote}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentStoriesReels;
