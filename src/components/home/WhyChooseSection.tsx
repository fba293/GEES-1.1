/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Why Choose GEES" Section with Single-Line H2, Parallax Tilt Feature Cards,
 * and Ripple Effect on Interactive Stats.
 */

import React, { useState, useRef, MouseEvent } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

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
  const [selectedModalCountry, setSelectedModalCountry] = useState('Europe');

  // Parallax Tilt State for Feature Cards Container
  const [parallaxTilt, setParallaxTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const featureContainerRef = useRef<HTMLDivElement>(null);

  // Click Ripple State for Stats Block
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const destinations = [
    { name: 'USA', flag: '🇺🇸', code: 'USA' },
    { name: 'UK', flag: '🇬🇧', code: 'UK' },
    { name: 'Ireland', flag: '🇮🇪', code: 'Ireland' },
    { name: 'Australia', flag: '🇦🇺', code: 'Australia' },
    { name: 'Canada', flag: '🇨🇦', code: 'Canada' },
    { name: 'Malaysia', flag: '🇲🇾', code: 'Malaysia' },
    { name: 'New Zealand', flag: '🇳🇿', code: 'New Zealand' },
    { name: 'Europe', flag: '🇪🇺', code: 'Europe' }
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

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-3.5 sm:px-6 lg:px-8 py-10 xs:py-12 sm:py-20 bg-white dark:bg-[#070b19]">
      {/* High-Impact Strictly Single-Line Single-Row H2 Heading */}
      <div className="text-center mb-6 sm:mb-14 px-1 max-w-full overflow-hidden">
        <h2 className="text-base xs:text-xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1.5 sm:gap-3 select-none">
          <span>Why Choose</span>
          <span className="text-[#fbb034] bg-[#fbb034]/15 px-2.5 sm:px-5 py-0.5 sm:py-1 rounded-lg sm:rounded-2xl border border-[#fbb034]/30 shadow-xs inline-flex items-center shrink-0">
            GEES Global
          </span>
          <span>for Your Future</span>
        </h2>
        <p className="mt-2 sm:mt-3 text-slate-500 dark:text-slate-400 text-xs sm:text-base font-medium max-w-2xl mx-auto truncate">
          Trusted guidance. Transparent support. Hassle-free study abroad with 0 service charges.
        </p>
      </div>

      {/* Grid: 3 Features on Left & Counselor Visual with Stats on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center">
        {/* Left Column: Interactive Features with Subtle Mouse-Move Parallax Tilt */}
        <div
          ref={featureContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${parallaxTilt.x}deg) rotateY(${parallaxTilt.y}deg)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="lg:col-span-5 flex flex-col space-y-2.5 sm:space-y-3 will-change-transform"
        >
          {/* Feature 01 */}
          <div
            onClick={() => setActiveFeature(1)}
            className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-l-4 transform hover:scale-[1.01] duration-300 ${
              activeFeature === 1
                ? 'border-[#F6BE48] bg-slate-50 dark:bg-slate-800/90 shadow-md ring-1 ring-amber-400/20'
                : 'border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-start gap-3.5 sm:gap-5">
              <span className={`text-2xl sm:text-4xl font-black select-none shrink-0 ${activeFeature === 1 ? 'text-[#fbb034]' : 'text-slate-400'}`}>
                01
              </span>
              <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  No Service Charge. No Hidden Fees.
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
                  Clear guidance and complete mentorship support without surprise consultancy charges or fees.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 02 */}
          <div
            onClick={() => setActiveFeature(2)}
            className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-l-4 transform hover:scale-[1.01] duration-300 ${
              activeFeature === 2
                ? 'border-[#F6BE48] bg-slate-50 dark:bg-slate-800/90 shadow-md ring-1 ring-amber-400/20'
                : 'border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-start gap-3.5 sm:gap-5">
              <span className={`text-2xl sm:text-4xl font-black select-none shrink-0 ${activeFeature === 2 ? 'text-[#fbb034]' : 'text-slate-400'}`}>
                02
              </span>
              <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  A–Z Guidelines & Admissions
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
                  Support from course shortlisting and SOP reviews to applications, scholarships, and preparation.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 03 */}
          <div
            onClick={() => setActiveFeature(3)}
            className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-l-4 transform hover:scale-[1.01] duration-300 ${
              activeFeature === 3
                ? 'border-[#F6BE48] bg-slate-50 dark:bg-slate-800/90 shadow-md ring-1 ring-amber-400/20'
                : 'border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-start gap-3.5 sm:gap-5">
              <span className={`text-2xl sm:text-4xl font-black select-none shrink-0 ${activeFeature === 3 ? 'text-[#fbb034]' : 'text-slate-400'}`}>
                03
              </span>
              <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  Hassle-Free Visa Processing
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
                  Precision document checklists, mock visa interview training, and structured embassy support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual with Admission Badge and Click Ripple Effect on Stats */}
        <div className="lg:col-span-7 relative">
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800 h-[280px] xs:h-[340px] sm:h-[480px] border border-white dark:border-slate-700">
            {/* Live Status Pill in Header */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/80 shadow-md text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Admission Open for 2026/2027</span>
              </div>
            </div> 

            {/* Photo */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFUG3LimCmQdFr1k1-wNK5zT18LimOcioRecatV_qZg4szgdi5Ix8xIvlJ4Q7J8YmCDAvemCEjGNIDpGh2KWrFc7XFraLsXflSPATEL6Al2PwyPU5x1RkoLaoKeE2T8_uF1xN7vXihk-zpG_tJwt6W-zYs6xlGwaXZXEgT6lZwp-f8tCo5vNklh45dzRpmetB0jwHwbqh2lkMwOfurbWkTsgixGDUJzk1KOJ5hRIqEZaAc6bEXXq3BPyZ5wXzkn8D2lV_yNf2dKtJWWmE"
              alt="GEES Educational Counselor advising students"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            {/* Gradient shadow for card */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none"></div>

            {/* Floating Interactive Stats Element with Click Ripple Effect */}
            <div className="absolute bottom-3 inset-x-2.5 sm:bottom-5 sm:inset-x-6 z-20">
              <div
                onClick={handleStatsClick}
                className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-2 sm:px-4 shadow-xl border border-white/80 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-transform select-none"
              >
                {/* Dynamic Click Ripples */}
                {ripples.map((ripple) => (
                  <span
                    key={ripple.id}
                    className="absolute rounded-full bg-[#fbb034]/30 pointer-events-none animate-ping"
                    style={{
                      left: ripple.x - 24,
                      top: ripple.y - 24,
                      width: 48,
                      height: 48,
                      transform: 'scale(2.5)'
                    }}
                  />
                ))}

                <div className="grid grid-cols-4 divide-x divide-slate-200 dark:divide-slate-800 text-center items-center">
                  <div className="px-1 sm:px-2">
                    <div className="text-base xs:text-xl sm:text-2xl font-black text-slate-900 dark:text-white">100+</div>
                    <div className="text-[8px] xs:text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">Students Placed</div>
                  </div>
                  <div className="px-1 sm:px-2">
                    <div className="text-base xs:text-xl sm:text-2xl font-black text-slate-900 dark:text-white">20+</div>
                    <div className="text-[8px] xs:text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">Partner Unis</div>
                  </div>
                  <div className="px-1 sm:px-2">
                    <div className="text-base xs:text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">95%</div>
                    <div className="text-[8px] xs:text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">Visa Success</div>
                  </div>
                  <div className="px-1 sm:px-2">
                    <div className="text-base xs:text-xl sm:text-2xl font-black text-[#fbb034]">2+</div>
                    <div className="text-[8px] xs:text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">Global Offices</div>
                  </div>
                </div>
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
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 shadow-xs cursor-pointer"
        />
      </div>

      {/* Modal: Select a Destination */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
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
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
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
                className="w-full py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
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
