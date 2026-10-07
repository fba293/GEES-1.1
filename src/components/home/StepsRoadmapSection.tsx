/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "6 Steps to Your Goal" Interactive Roadmap Section
 * Enhanced with Framer Motion scroll-triggered reveal and staggered fade-ins for cards & icons.
 */

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface StepsRoadmapSectionProps {
  onOpenBooking: () => void;
}

export const StepsRoadmapSection: React.FC<StepsRoadmapSectionProps> = ({ onOpenBooking }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null); // None open by default until student clicks
  const [deepDiveStep, setDeepDiveStep] = useState<number | null>(null);

  const stepsData = [
    {
      num: '01',
      icon: 'support_agent',
      title: 'Free Consultation',
      summary: 'Review your academic profile, destination goals, study plans, and budget with a dedicated senior GEES counsellor.',
      docs: ['Academic marksheets & transcripts', 'English proficiency test scores (or test targets)', 'Budget & preferred intake term'],
      advisorDelivers: ['Eligibility assessment across 500+ universities', 'Cost comparison (tuition + living + part-time work)', 'Personalized master timeline']
    },
    {
      num: '02',
      icon: 'school',
      title: 'University Shortlisting',
      summary: 'Receive tailored university and course recommendations curated across Ambitious, Target, and Safe tiers.',
      docs: ['Detailed course module preferences', 'Regional location & post-study visa priorities', 'Financial funding capacity'],
      advisorDelivers: ['Curated 5-8 university match list', 'Scholarship odds assessment', 'Direct liaison with university recruitment officers']
    },
    {
      num: '03',
      icon: 'edit_document',
      title: 'Application Preparation',
      summary: 'Prepare documents, academic records, Statement of Purpose (SOP), and submission packets with expert GEES editorial assistance.',
      docs: ['Statement of Purpose (SOP) draft notes', 'Letters of Recommendation (LORs)', 'Updated academic CV & passport copies'],
      advisorDelivers: ['Structural SOP polishing and plagiarism checking', 'Document notarization and credential attestation support', 'Direct portal submission without agency fees']
    },
    {
      num: '04',
      icon: 'mail',
      title: 'Offer Letter Support',
      summary: 'Evaluate received offers, negotiate university funding and scholarships, and ensure swift CAS or I-20 issuance.',
      docs: ['Conditional & unconditional offer letters', 'Deposit payment confirmation receipts', 'Meeting academic condition certificates'],
      advisorDelivers: ['Offer evaluation & scholarship grant maximization', 'Expedited CAS (UK) or I-20 (USA) document issuance', 'Tuition deposit wire guidance']
    },
    {
      num: '05',
      icon: 'verified_user',
      title: 'Visa Processing',
      summary: 'Complete documents, submission preparation, financial auditing, and simulated visa mock interviews with our 98% success track record.',
      docs: ['Confirmed CAS / I-20 / CoE document', 'Bank solvency certificates & fund source records', 'Medical assessment slips and police clearance'],
      advisorDelivers: ['100% compliant visa dossier checking', '1-on-1 mock interview training sessions', 'Embassy biometric appointment booking']
    },
    {
      num: '06',
      icon: 'flight_takeoff',
      title: 'Pre-Departure Support',
      summary: 'Prepare for travel, accommodation, flight booking, forex cards, and your new student journey with confidence.',
      docs: ['Approved student visa sticker', 'Flight itinerary & baggage allowance details', 'Accommodation lease agreement'],
      advisorDelivers: ['Verified on-campus & off-campus student accommodation', 'Zero-markup student Forex multi-currency travel cards', 'Pre-departure briefing with alumni network']
    }
  ];

  // Motion variants for scroll-triggered staggered reveal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { scale: 0.6, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <section id="steps-roadmap-section" className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-[#0B1329] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-2">
          <h2 className="text-base xs:text-xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center flex-nowrap sm:flex-wrap whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal gap-1.5 sm:gap-3 mb-2">
            <span>6 Steps to</span>
            <span className="bg-[#fbbf24] text-slate-950 px-2 sm:px-6 py-0.5 sm:py-1 rounded-lg sm:rounded-2xl font-black tracking-tight leading-none shadow-sm">
              Your Goal
            </span>
          </h2>
          <p className="text-xs sm:text-lg text-slate-600 dark:text-slate-400 font-medium truncate sm:whitespace-normal">
            From your first conversation to confident departure.
          </p>
        </header>

        {/* Process Grid: Left Visual Card & Right Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
          {/* Left Column: Counselor session photo with trust pill */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmxWeNh7tryz5Ui6SbdMmMasVp5_mcakVeZkNW8gNg_1gZe6pLxsfqJ-cVa6DhoMo8dyDswM0Bvk51sqpt2_dcePWC8WkmRxGM5ZWvkNM7IV8x0PJ9tG2E7DOIwirLxoErAea2uVmX_N0pFBSj31KKXgVwt499uf26nRiNZ1jC400Vj9ndQVmAJRbyCDHQWWqyxAnb0Mh7atoeoHJSHyN0jFPwKJ2pZJUpg_fP79mwsGDDS0HDlBR_dLXXCz5y-sELihI"
                alt="GEES Counselor advising family"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
              {/* Floating Trust Pill */}
              <div className="absolute bottom-3 xs:bottom-5 inset-x-2 xs:inset-x-4 flex justify-center z-10">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 xs:px-4 py-1.5 sm:py-2.5 rounded-full shadow-lg border border-white/60 dark:border-slate-800 flex items-center justify-center gap-1.5 xs:gap-2 text-[10px] xs:text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  <span>No service charge</span>
                  <span className="text-slate-300 dark:text-slate-600 font-light select-none">|</span>
                  <span>No hidden fees</span>
                  <span className="text-slate-300 dark:text-slate-600 font-light select-none">|</span>
                  <span>No surprises</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 text-center">
              <span className="w-5 h-[2px] bg-[#fbbf24] rounded-full inline-block"></span>
              <span>Guidance for students and families, at every step.</span>
              <span className="w-5 h-[2px] bg-[#fbbf24] rounded-full inline-block"></span>
            </div>
          </div>

          {/* Right Column: 6 Steps Accordion with Scroll-Triggered Reveal Animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:col-span-7 flex flex-col justify-center space-y-3"
          >
            {stepsData.map((step, idx) => {
              const stepNumber = idx + 1;
              const isActive = activeStep === stepNumber;
              return (
                <motion.div
                  key={step.num}
                  variants={cardVariants}
                  onClick={() => setActiveStep(isActive ? null : stepNumber)}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive
                      ? 'border-[#f59e0b] bg-amber-50/50 dark:bg-slate-800 shadow-md ring-1 ring-amber-400/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="w-full flex items-center justify-between py-3.5 px-4 sm:px-5">
                    <div className="flex items-center gap-3.5">
                      {/* Step Number Badge */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 font-black text-xs sm:text-sm flex items-center justify-center rounded-full transition-all shrink-0 ${
                          isActive
                            ? 'bg-[#f59e0b] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {step.num}
                      </div>

                      {/* Staggered Fade-In Step Icon */}
                      <motion.div
                        variants={iconVariants}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                          isActive
                            ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[19px]">{step.icon}</span>
                      </motion.div>

                      <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        {step.title}
                      </span>
                    </div>
                    <span className={`material-symbols-outlined text-xl text-slate-400 transition-transform duration-300 shrink-0 ${isActive ? 'rotate-180 text-amber-600' : ''}`}>
                      keyboard_arrow_down
                    </span>
                  </div>

                  {/* Expandable Content */}
                  {isActive && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-amber-200/50 dark:border-slate-700/60 space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {step.summary}
                      </p>
                      <div className="pt-1 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeepDiveStep(stepNumber);
                          }}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Explore Step Checklist & Deliverables</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-4">
          <InteractiveHoverButton
            type="button"
            text="Start with a Free Consultation"
            onClick={onOpenBooking}
            className="px-8 py-3.5 rounded-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-bold text-sm sm:text-base shadow-xs cursor-pointer"
          />
        </div>
      </div>

      {/* Deep Dive Step Modal */}
      {deepDiveStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <button
              onClick={() => setDeepDiveStep(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-sm">
                {stepsData[deepDiveStep - 1].num}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
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
                      <span className="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
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
                className="flex-1 py-3 rounded-full bg-[#f59e0b] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Book Step Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
