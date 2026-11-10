/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Why Choose GEES" Section with Single-Line H2, Parallax Tilt Feature Cards,
 * and Ripple Effect on Interactive Stats.
 */

import React, { useState, useRef, MouseEvent } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { AnimatedFeatureCard } from '../ui/feature-card-1.tsx';

interface WhyChooseSectionProps {
  onSelectCountry: (countryName: string) => void;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const WhyChooseSection: React.FC<WhyChooseSectionProps> = ({ onSelectCountry }) => {
  const [activeFeature, setActiveFeature] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalCountry, setSelectedModalCountry] = useState('Malaysia');

  // Parallax Tilt State for Feature Cards Container
  const [parallaxTilt, setParallaxTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const featureContainerRef = useRef<HTMLDivElement>(null);

  // Click Ripple State for Stats Block
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const destinations = [
    { name: 'Australia', flag: '🇦🇺', code: 'AU' },
    { name: 'Canada', flag: '🇨🇦', code: 'CA' },
    { name: 'Cyprus', flag: '🇨🇾', code: 'CY' },
    { name: 'Finland', flag: '🇫🇮', code: 'FI' },
    { name: 'France', flag: '🇫🇷', code: 'FR' },
    { name: 'Greece', flag: '🇬🇷', code: 'GR' },
    { name: 'Hungary', flag: '🇭🇺', code: 'HU' },
    { name: 'India', flag: '🇮🇳', code: 'IN' },
    { name: 'Malaysia', flag: '🇲🇾', code: 'MY' },
    { name: 'Malta', flag: '🇲🇹', code: 'MT' },
    { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
    { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
    { name: 'Sweden', flag: '🇸🇪', code: 'SE' },
    { name: 'United Kingdom', flag: '🇬🇧', code: 'UK' },
    { name: 'USA', flag: '🇺🇸', code: 'US' }
  ];

  // Mouse Move Parallax Handler
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!featureContainerRef.current) return;
    const rect = featureContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = -(y / (rect.height / 2)) * 6; // max 6 deg
    const tiltY = (x / (rect.width / 2)) * 6;   // max 6 deg

    setParallaxTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setParallaxTilt({ x: 0, y: 0 });
  };

  // Click Ripple Handler on Stats Block
  const handleStatsClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple: Ripple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const featureCards = [
    {
      index: "001",
      tag: "ZERO SERVICE CHARGE",
      title: "No Service Charge. 100% Free Transparent Mentorship & Guidance.",
      imageSrc: "/public/assets/aistudio/Glossy_Orange_Zero_with_Radiant_Accents_e2d45759.png",
      color: "orange" as const,
    },
    {
      index: "002",
      tag: "A–Z ADMISSIONS",
      title: "Direct University Placement, Fast Offer Letters & SOP Reviews.",
      imageSrc: "/public/assets/aistudio/Celebrating_the_University_Offer_Letter_ee24fec3.png",
      color: "purple" as const,
    },
    {
      index: "003",
      tag: "VISA DESK",
      title: "95% Visa Success with Mock Interviews & Embassy Preparation.",
      imageSrc: "/public/assets/aistudio/Celebrating_Student_Visa_Approval_25dff35f.png",
      color: "blue" as const,
    },
  ];

  return (
    <section id="why-choose-section" className="relative z-10 w-full max-w-full sm:max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-[390px]:py-12 sm:py-20 bg-white dark:bg-[#0B1329]">
      {/* Header with High-Impact Typography */}
      <div className="text-center mb-8 sm:mb-12 px-2 max-w-3xl mx-auto">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight flex items-center justify-center flex-wrap gap-2 sm:gap-3 md:gap-3.5 select-none text-center">
          <span>Why Choose</span>
          <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 md:px-6 py-0.5 sm:py-1 md:py-1.5 rounded-xl sm:rounded-2xl font-black tracking-tight leading-none shadow-sm shrink-0 inline-flex items-center">
            GEES
          </span>
        </h2>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto px-2 text-center">
          Trusted guidance. Transparent support. Hassle-free study abroad with 0 service charges.
        </p>
      </div>

      {/* 3 Animated Feature Cards with Spring Motion & Floating 3D Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-10 sm:mb-14">
        {featureCards.map((feature, idx) => (
          <AnimatedFeatureCard
            key={feature.index}
            index={feature.index}
            tag={feature.tag}
            title={feature.title}
            imageSrc={feature.imageSrc}
            color={feature.color}
            isActive={activeFeature === idx + 1}
            onClick={() => setActiveFeature(idx + 1)}
            className="cursor-pointer"
          />
        ))}
      </div>

      {/* Live Status & Interactive Ripple Stats - Clean Refactored Layout */}
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 flex flex-col items-center">
        {/* Live Status Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 dark:bg-slate-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 animate-fadeIn">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Admission Open for 2026/2027</span>
        </div>

        {/* Interactive Stats Block */}
        <div
          onClick={handleStatsClick}
          className="relative overflow-hidden w-full bg-white dark:bg-[#0B1329] rounded-2xl sm:rounded-3xl py-6 sm:py-8 px-4 sm:px-6 shadow-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-transform select-none"
        >
          {/* Dynamic Click Ripples */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full bg-[#fbb034]/20 pointer-events-none animate-ping"
              style={{
                left: ripple.x - 24,
                top: ripple.y - 24,
                width: 48,
                height: 48,
                transform: 'scale(3)'
              }}
            />
          ))}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-slate-200 dark:divide-slate-800 text-center items-center">
            <div className="px-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">100+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 mt-1 leading-tight">
                Students Placed
              </div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">200+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 mt-1 leading-tight">
                Partner Universities
              </div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">95%</div>
              <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 mt-1 leading-tight">
                Visa Success
              </div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">6+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 mt-1 leading-tight">
                Countries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Destinations Trigger */}
      <div className="flex justify-center mt-6 sm:mt-10">
        <InteractiveHoverButton
          type="button"
          text="Explore Destinations"
          onClick={() => setIsModalOpen(true)}
          className="min-h-[44px] w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 shadow-xs cursor-pointer"
        />
      </div>

      {/* Modal: Select a Destination */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0B1329] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              Select Study Destination
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              Select a country to view tailored admission criteria, visa rules, and partner institutions.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {destinations.map((d) => (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => setSelectedModalCountry(d.name)}
                  className={`min-h-[44px] p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer active:scale-95 ${
                    selectedModalCountry === d.name
                      ? 'border-[#F6BE48] bg-amber-50/50 dark:bg-slate-800 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{d.flag}</span>
                  <span className="text-xs sm:text-sm font-semibold">{d.name}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  onSelectCountry(selectedModalCountry);
                }}
                className="min-h-[44px] w-full py-3.5 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-98 flex items-center justify-center"
              >
                Explore {selectedModalCountry} Universities
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
