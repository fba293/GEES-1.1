/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Your Journey to Studying Abroad" - Interactive Student Journey Timeline Section
 * Synchronized airplane marker using getTotalLength() and getPointAtLength() for smooth continuous movement along SVG path.
 * Features a clean white plane silhouette matching reference specifications and high-contrast milestone node numbers.
 */

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { GEESAircraft } from '../common/GEESAircraft.tsx';

interface StepsRoadmapSectionProps {
  onOpenBooking: () => void;
}

/**
 * Fallback Bezier math helper for initial calculation or SSR rendering
 * Curve: M 90 95 Q 500 20 910 95 (viewBox 0 0 1000 140)
 */
function getBezierPointAndAngle(t: number) {
  const clampedT = Math.max(0, Math.min(1, t));
  const oneMinusT = 1 - clampedT;

  const x = oneMinusT * oneMinusT * 90 + 2 * oneMinusT * clampedT * 500 + clampedT * clampedT * 910;
  const y = oneMinusT * oneMinusT * 95 + 2 * oneMinusT * clampedT * 20 + clampedT * clampedT * 95;

  const dx = 2 * oneMinusT * 410 + 2 * clampedT * 410; // 820
  const dy = 2 * oneMinusT * (-75) + 2 * clampedT * 75; // 150 * (2t - 1)
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return { x, y, angle };
}

export const StepsRoadmapSection: React.FC<StepsRoadmapSectionProps> = ({ onOpenBooking }) => {
  // Step 1 active by default
  const [activeStep, setActiveStep] = useState<number>(1);
  const [deepDiveStep, setDeepDiveStep] = useState<number | null>(null);

  // SVG Path Reference for DOM measurement via getTotalLength() & getPointAtLength()
  const pathRef = useRef<SVGPathElement | null>(null);

  // Measured Plane Position & Tangent Flight Angle State
  const [planePos, setPlanePos] = useState<{ x: number; y: number; angle: number }>(() =>
    getBezierPointAndAngle(0)
  );

  const stepsData = [
    {
      stepIndex: 1,
      num: '01',
      shortLabel: 'Consultation',
      title: 'Free Consultation',
      icon: 'support_agent',
      summary: 'Discuss your academic goals, destination preferences, study plans, and budget 1-on-1 with a dedicated senior GEES counsellor.',
      docs: ['Academic marksheets & transcripts', 'English proficiency test scores (or test targets)', 'Budget & preferred intake term'],
      advisorDelivers: ['Eligibility assessment across 500+ universities', 'Cost comparison (tuition + living + part-time work)', 'Personalized master timeline']
    },
    {
      stepIndex: 2,
      num: '02',
      shortLabel: 'Shortlist',
      title: 'University Shortlisting',
      icon: 'school',
      summary: 'Receive tailored university and course recommendations curated across Ambitious, Target, and Safe tiers with fee breakdowns.',
      docs: ['Detailed course module preferences', 'Regional location & post-study visa priorities', 'Financial funding capacity'],
      advisorDelivers: ['Curated 5-8 university match list', 'Scholarship odds assessment', 'Direct liaison with university recruitment officers']
    },
    {
      stepIndex: 3,
      num: '03',
      shortLabel: 'Application',
      title: 'Application Preparation',
      icon: 'edit_document',
      summary: 'Prepare documents, academic records, Statement of Purpose (SOP), and submission packets with expert GEES editorial assistance.',
      docs: ['Statement of Purpose (SOP) draft notes', 'Letters of Recommendation (LORs)', 'Updated academic CV & passport copies'],
      advisorDelivers: ['Structural SOP polishing and plagiarism checking', 'Document notarization and credential attestation support', 'Direct portal submission without agency fees']
    },
    {
      stepIndex: 4,
      num: '04',
      shortLabel: 'Offer',
      title: 'Offer Letter Support',
      icon: 'mail',
      summary: 'Evaluate received offers, negotiate university funding and scholarships, and ensure swift CAS or I-20 issuance.',
      docs: ['Conditional & unconditional offer letters', 'Deposit payment confirmation receipts', 'Meeting academic condition certificates'],
      advisorDelivers: ['Offer evaluation & scholarship grant maximization', 'Expedited CAS (UK) or I-20 (USA) document issuance', 'Tuition deposit wire guidance']
    },
    {
      stepIndex: 5,
      num: '05',
      shortLabel: 'Visa',
      title: 'Visa Processing',
      icon: 'verified_user',
      summary: 'Complete documents, submission preparation, financial auditing, and simulated visa mock interviews with our 98% success track record.',
      docs: ['Confirmed CAS / I-20 / CoE document', 'Bank solvency certificates & fund source records', 'Medical assessment slips and police clearance'],
      advisorDelivers: ['100% compliant visa dossier checking', '1-on-1 mock interview training sessions', 'Embassy biometric appointment booking']
    },
    {
      stepIndex: 6,
      num: '06',
      shortLabel: 'Departure',
      title: 'Pre-Departure Support',
      icon: 'flight_takeoff',
      summary: 'Prepare for travel, accommodation, flight booking, forex cards, and your new student journey with total confidence.',
      docs: ['Approved student visa sticker', 'Flight itinerary & baggage allowance details', 'Accommodation lease agreement'],
      advisorDelivers: ['Verified on-campus & off-campus student accommodation', 'Zero-markup student Forex multi-currency travel cards', 'Pre-departure briefing with alumni network']
    }
  ];

  // Exact milestone node coordinates mapped from Bezier math formula
  const timelineNodes = stepsData.map((step) => {
    const t = (step.stepIndex - 1) / 5;
    const { x, y } = getBezierPointAndAngle(t);
    return {
      stepIndex: step.stepIndex,
      x,
      y,
      xPercent: (x / 1000) * 100,
      yPercent: (y / 140) * 100
    };
  });

  // Calculate precise plane position & tangent angle along DOM path using getTotalLength() and getPointAtLength()
  const updatePlanePosition = () => {
    const targetT = (activeStep - 1) / 5;
    if (pathRef.current && typeof pathRef.current.getTotalLength === 'function') {
      try {
        const totalLength = pathRef.current.getTotalLength();
        const targetDistance = totalLength * targetT;

        // Current point on path
        const p = pathRef.current.getPointAtLength(targetDistance);

        // Small delta for calculating exact tangent flight slope
        const delta = 1.5;
        const p1 = pathRef.current.getPointAtLength(Math.max(0, targetDistance - delta));
        const p2 = pathRef.current.getPointAtLength(Math.min(totalLength, targetDistance + delta));
        const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

        setPlanePos({ x: p.x, y: p.y, angle });
        return;
      } catch (e) {
        // Fall back to bezier math helper if SVG DOM method is unavailable
      }
    }
    setPlanePos(getBezierPointAndAngle(targetT));
  };

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    updatePlanePosition();
  }, [activeStep]);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
      updatePlanePosition();
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeStep]);

  const activeData = stepsData.find((s) => s.stepIndex === activeStep) || stepsData[0];
  const activeT = (activeStep - 1) / 5;

  return (
    <section
      id="steps-roadmap-section"
      className="relative w-full py-10 min-[390px]:py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0B1329] text-slate-900 dark:text-white transition-colors duration-300 border-t border-slate-200/80 dark:border-slate-800/80 overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-16 px-2">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white flex items-center justify-center flex-wrap gap-2 text-center leading-tight">
            <span>Your Journey to</span>
            <span className="text-[#fbb034]">Studying Abroad</span>
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto text-center px-2">
            Six clear steps. Expert guidance from your first consultation to departure.
          </p>
        </header>

        {/* --- CURVED TIMELINE PATH & REAL AIRCRAFT (Prominent Mobile & Desktop Layout) --- */}
        <div className="relative w-full max-w-5xl mx-auto mb-6 sm:mb-12 pt-1 sm:pt-6">
          <div className="relative w-full h-24 xs:h-28 sm:h-36">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1000 140"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Metallic 3D Fuselage Gradient */}
                <linearGradient id="planeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* GEES Gold Wing Shading Gradient */}
                <linearGradient id="planeWingShade" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbb034" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Cockpit Glass Reflection Gradient */}
                <linearGradient id="planeGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* 1. Inactive Base Dotted Curve */}
              <path
                ref={pathRef}
                d="M 90 95 Q 500 20 910 95"
                fill="none"
                className="stroke-slate-300 dark:stroke-slate-700/80"
                strokeWidth="2.5"
                strokeDasharray="5 7"
              />

              {/* 2. Active Golden Highlight Path (Draws smoothly up to active step) */}
              <motion.path
                d="M 90 95 Q 500 20 910 95"
                fill="none"
                stroke="#fbb034"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: activeT }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(251, 176, 52, 0.4))' }}
              />

              {/* 3. Milestone Nodes Layer */}
              {timelineNodes.map((node) => {
                const step = stepsData[node.stepIndex - 1];
                const isActive = activeStep === node.stepIndex;

                return (
                  <g
                    key={node.stepIndex}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => setActiveStep(node.stepIndex)}
                  >
                    {/* Invisible expanded touch hit target for mobile */}
                    <circle r="28" fill="transparent" pointerEvents="all" />
                    {/* Circle Node Button: GEES Gold Outline & Neutral Navy Fill */}
                    <circle
                      r={isMobile ? 20 : 20}
                      fill="#0B1329"
                      stroke="#fbb034"
                      strokeWidth={isMobile ? 2.5 : 2.5}
                      className="transition-transform duration-300 group-hover:scale-110"
                      style={{ filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))' }}
                    />

                    {/* Number Label inside Node: Centered, legible */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fbb034"
                      fontSize={isMobile ? '16' : '14'}
                      fontWeight="900"
                      fontFamily="sans-serif"
                    >
                      {node.stepIndex}
                    </text>

                    {/* Step Label Underneath - Hidden on mobile screens to match image_dd169a77.png */}
                    <text
                      y="38"
                      textAnchor="middle"
                      fill={isActive ? '#fbb034' : '#94a3b8'}
                      fontSize="12"
                      fontWeight={isActive ? '800' : '600'}
                      fontFamily="sans-serif"
                      className="hidden sm:block transition-colors duration-300"
                    >
                      {step.shortLabel}
                    </text>
                  </g>
                );
              })}

              {/* 4. Top Layer Real Aircraft Marker (GEESAircraft Component with Light/Dark Theme Support) */}
              <motion.g
                initial={false}
                animate={{
                  transform: `translate(${planePos.x}px, ${planePos.y - (isMobile ? 30 : 30)}px) rotate(${planePos.angle}deg)`
                }}
                transition={{
                  type: 'spring',
                  stiffness: 110,
                  damping: 16,
                  mass: 0.75
                }}
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 10px rgba(251, 176, 52, 0.35))'
                }}
              >
                <g transform={`translate(${isMobile ? -38 : -40}, ${isMobile ? -19 : -20})`}>
                  <GEESAircraft width={isMobile ? 76 : 80} height={isMobile ? 38 : 40} />
                </g>
              </motion.g>
            </svg>
          </div>
        </div>

        {/* --- INTERACTIVE ACTIVE STEP DETAIL CARD (Proportional mobile & desktop layout) --- */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative w-full min-h-[135px] sm:min-h-[176px] flex items-center bg-white dark:bg-[#0B1329]/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-8 border border-slate-200/90 dark:border-slate-800/90 shadow-xl dark:shadow-2xl overflow-hidden text-slate-900 dark:text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full flex items-center justify-between gap-3 sm:gap-6"
              >
                <div className="flex items-start gap-3 sm:gap-6 max-w-2xl">
                  {/* Step Icon Badge */}
                  <div className="w-11 h-11 min-w-[44px] min-h-[44px] sm:w-16 sm:h-16 rounded-full bg-[#0B1329] dark:bg-white text-[#fbb034] dark:text-slate-950 flex items-center justify-center shadow-md shrink-0 mt-0.5 sm:mt-0">
                    <span className="material-symbols-outlined text-xl sm:text-3xl">
                      {activeData.icon}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {activeData.title}
                    </h3>

                    <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {activeData.summary}
                    </p>
                  </div>
                </div>

                {/* Big Step Number Watermark (01, 02, 03, 04, 05, 06) */}
                <div className="pointer-events-none select-none text-5xl sm:text-7xl md:text-8xl font-black text-slate-900/10 dark:text-white/10 font-mono tracking-tighter shrink-0 ml-1">
                  {activeData.num}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Pre-Footer CTA */}
        <div className="flex justify-center pt-8 sm:pt-12">
          <InteractiveHoverButton
            type="button"
            text="Start Your Free Journey"
            onClick={onOpenBooking}
            className="min-h-[44px] w-full sm:w-auto px-8 py-3.5 rounded-full border-slate-300 dark:border-slate-700 text-sm sm:text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 shadow-xs cursor-pointer"
          />
        </div>
      </div>

      {/* --- DEEP DIVE STEP CHECKLIST & ADVISOR DELIVERABLES MODAL --- */}
      {deepDiveStep !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0B1329] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn text-slate-900 dark:text-white">
            <button
              onClick={() => setDeepDiveStep(null)}
              className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <span className="w-10 h-10 rounded-full bg-[#fbb034] text-slate-950 font-black text-sm flex items-center justify-center shadow-md shrink-0">
                {stepsData[deepDiveStep - 1].num}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-[#fbb034]">
                  Step Breakdown
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {stepsData[deepDiveStep - 1].title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {stepsData[deepDiveStep - 1].summary}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Documents You Need to Prepare:
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {stepsData[deepDiveStep - 1].docs.map((d, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fbb034]" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  What Your GEES Advisor Delivers:
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {stepsData[deepDiveStep - 1].advisorDelivers.map((d, i) => (
                    <li key={i} className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-emerald-500">
                        check_circle
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeepDiveStep(null);
                  onOpenBooking();
                }}
                className="min-h-[44px] flex-1 py-3 px-4 rounded-full bg-[#fbb034] hover:bg-[#f59e0b] text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Book Step Consultation</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StepsRoadmapSection;
