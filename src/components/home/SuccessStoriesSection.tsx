/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Success Stories" 3D Perspective Card Stack, Touch Swipe Gestures & Case Study Details
 */

import React, { useState, useRef } from 'react';
import { mockTestimonials } from '../../data/mockDatabase.ts';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface SuccessStoriesSectionProps {
  onNavigate?: (view: string, payload?: any) => void;
}

export const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'malaysia' | 'australia' | 'new zealand' | 'uk'>('all');
  const [currentIndex, setCurrentIndex] = useState(2); // Default to Tahmid Rahman
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any | null>(null);

  // Touch swipe gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const tabs = [
    { label: 'All Stories', id: 'all' },
    { label: 'Malaysia 🇲🇾', id: 'malaysia' },
    { label: 'Australia 🇦🇺', id: 'australia' },
    { label: 'New Zealand 🇳🇿', id: 'new zealand' },
    { label: 'United Kingdom 🇬🇧', id: 'uk' }
  ];

  const filteredStories = selectedFilter === 'all'
    ? mockTestimonials
    : mockTestimonials.filter(t => t.country === selectedFilter);

  const activeStory = filteredStories[currentIndex % filteredStories.length] || mockTestimonials[0];

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % filteredStories.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + filteredStories.length) % filteredStories.length);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev Slide
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="w-full bg-white dark:bg-[#070b19] py-14 sm:py-20 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white flex items-center justify-center flex-wrap gap-2 sm:gap-3 md:gap-3.5 leading-tight text-center">
            <span>Success</span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 md:px-6 py-0.5 sm:py-1 md:py-1.5 rounded-xl sm:rounded-2xl font-black tracking-tight leading-none shadow-sm shrink-0">
              Stories
            </span>
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto px-2 text-center">
            Real student experiences with admission, visa and arrival support.
          </p>
        </div>

        {/* Filter Segmented Tab Bar with Universal 120 FPS Sliding Indicator */}
        <div className="w-full max-w-2xl mb-8 sm:mb-10 flex justify-center">
          <AnimatedTabs
            tabs={tabs}
            activeId={selectedFilter}
            onChange={(id) => {
              setSelectedFilter(id as any);
              setCurrentIndex(0);
            }}
            size="md"
          />
        </div>

        {/* 3D Testimonial Card Container with Butter-Smooth CSS Transition & Touch Gestures */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[36px] p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-100 dark:border-slate-800 transition-[opacity,transform] duration-300 ease-out will-change-[opacity,transform] select-none"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left 3D Perspective Photo Stack */}
            <div className="md:col-span-5 lg:col-span-6 flex justify-center items-center py-2">
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[4/5] mx-auto preserve-3d">
                {filteredStories.map((story, idx) => {
                  let offset = idx - (currentIndex % filteredStories.length);
                  if (offset > filteredStories.length / 2) offset -= filteredStories.length;
                  if (offset < -filteredStories.length / 2) offset += filteredStories.length;

                  let transform = '';
                  let zIndex = 10;
                  let opacity = 0.5;

                  if (offset === 0) {
                    transform = 'translateX(0%) translateY(0px) scale(1)';
                    zIndex = 30;
                    opacity = 1;
                  } else if (offset === 1) {
                    transform = 'translateX(18%) translateY(-10px) scale(0.9)';
                    zIndex = 20;
                    opacity = 0.65;
                  } else if (offset === -1) {
                    transform = 'translateX(-18%) translateY(-10px) scale(0.9)';
                    zIndex = 20;
                    opacity = 0.65;
                  } else {
                    transform = 'translateX(30%) translateY(-20px) scale(0.8)';
                    zIndex = 5;
                    opacity = 0;
                  }

                  return (
                    <div
                      key={story.id}
                      onClick={() => setCurrentIndex(idx)}
                      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out cursor-pointer bg-slate-950"
                      style={{ transform, zIndex, opacity }}
                    >
                      <img
                        src={story.avatarUrl}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Student Details & Staggered Quote Reveal */}
            <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-between h-full py-2">
              <div>
                {/* Location Meta Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-2xs">
                    {activeStory.locationBadge}
                  </span>
                </div>

                {/* Name & Program */}
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {activeStory.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {activeStory.degree}
                </p>

                {/* Quote with opening quote symbol */}
                <div className="mt-5 mb-6 min-h-[100px] flex items-start">
                  <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    <span className="text-slate-400 text-2xl mr-1 select-none font-serif">“</span>
                    {activeStory.quote}
                    <span className="text-slate-400 text-2xl ml-1 select-none font-serif">”</span>
                  </p>
                </div>

                {/* Touch hint for mobile users */}
                <div className="sm:hidden flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
                  <span className="material-symbols-outlined text-[14px]">swipe</span>
                  <span>Swipe left or right to browse stories</span>
                </div>
              </div>

              {/* Navigation Controls + Pagination Dots */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800 mt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous testimonial"
                    className="w-11 h-11 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#fbb034] hover:text-slate-950 active:scale-95 flex items-center justify-center transition-all shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next testimonial"
                    className="w-11 h-11 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#fbb034] hover:text-slate-950 active:scale-95 flex items-center justify-center transition-all shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {filteredStories.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to story ${i + 1}`}
                      onClick={() => setCurrentIndex(i)}
                      className="p-2.5 flex items-center justify-center cursor-pointer tap-target-44"
                    >
                      <span
                        className={`h-2 rounded-full transition-all block ${
                          i === (currentIndex % filteredStories.length)
                            ? 'w-7 sm:w-8 bg-[#fbb034]'
                            : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Call-To-Action: Read Full Success Stories */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center px-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('blog');
              } else {
                setSelectedCaseStudy(activeStory);
              }
            }}
            className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-blue-600 dark:hover:bg-[#fbb034] dark:hover:text-slate-950 transition-all shadow-md cursor-pointer active:scale-95"
          >
            <span>Read Full Success Stories</span>
            <span className="material-symbols-outlined text-sm">menu_book</span>
          </button>

          {/* Google Reviews CTA */}
          <a
            href="https://globaleducationexpert.com"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
            </svg>
            <span>Read All Reviews on Google</span>
            <span className="material-symbols-outlined text-[16px] text-slate-400">arrow_forward</span>
          </a>
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedCaseStudy.avatarUrl}
                alt={selectedCaseStudy.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-md"
              />
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{selectedCaseStudy.locationBadge}</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedCaseStudy.name}</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{selectedCaseStudy.degree}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-6">
              <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{selectedCaseStudy.quote}"
              </p>
            </div>
            <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-semibold">Visa Approval Time:</span>
                <span className="font-bold text-slate-900 dark:text-white">14 Calendar Days</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-semibold">Scholarship Secured:</span>
                <span className="font-bold text-emerald-600">30% Merit Grant</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">GEES Counselor:</span>
                <span className="font-bold text-slate-900 dark:text-white">Senior Admissions Desk</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="min-h-[44px] w-full py-3 px-4 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-98 flex items-center justify-center"
            >
              Close Story
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
