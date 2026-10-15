/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Malaysia My Second Home (MM2H) Visa Assistance Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface MM2HViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: () => void;
  onNavigate?: (view: string, payload?: string) => void;
}

interface MM2HTierData {
  id: string;
  name: string;
  badge: string;
  passDuration: string;
  fixedDeposit: string;
  depositUSD: string;
  propertyRequirement: string;
  minStay: string;
  ageRequirement: string;
  workAndBusiness: string;
  familyInclusion: string;
  prPathway: boolean;
  color: string;
  highlights: string[];
}

const MM2H_TIERS: MM2HTierData[] = [
  {
    id: 'silver',
    name: 'MM2H Silver Tier',
    badge: 'Popular for Families & Retirees',
    passDuration: '5 Years (Renewable)',
    fixedDeposit: 'USD $150,000 (approx. RM 700,000)',
    depositUSD: '$150,000',
    propertyRequirement: 'Must purchase residential property of min. RM 600,000 (held for 10 years)',
    minStay: '60 Days per year (Cumulative, between principal & dependents aged 25-49)',
    ageRequirement: '25 Years Old and above',
    workAndBusiness: 'Social Visit Pass (No active domestic local employment; passive investments allowed)',
    familyInclusion: 'Spouse, unmarried children below 21, and parents/in-laws aged 60+',
    prPathway: false,
    color: 'from-slate-600 to-slate-800',
    highlights: [
      '50% of Fixed Deposit can be withdrawn after 1 year for property purchase, healthcare, or education',
      'Free multiple entries in and out of Malaysia without restrictions',
      'Access to premier British & IB international schools for dependent children',
      'Option to renew every 5 years subject to maintaining criteria'
    ]
  },
  {
    id: 'gold',
    name: 'MM2H Gold Tier',
    badge: 'Executive & Business Choice',
    passDuration: '15 Years (Renewable)',
    fixedDeposit: 'USD $500,000 (approx. RM 2,350,000)',
    depositUSD: '$500,000',
    propertyRequirement: 'Must purchase residential property of min. RM 1,000,000 (held for 10 years)',
    minStay: '60 Days per year (Cumulative)',
    ageRequirement: '25 Years Old and above',
    workAndBusiness: 'Allowed to invest, be company directors, and engage in specific business activities',
    familyInclusion: 'Spouse, unmarried children below 34, and parents/in-laws aged 60+',
    prPathway: false,
    color: 'from-amber-500 to-amber-700',
    highlights: [
      '15-year long-term security with seamless multiple-entry social visit passes',
      'Unmarried children covered up to age 34 (extended dependent threshold)',
      'Allowed active business participation and local enterprise investments',
      '50% deposit release after year 1 for approved property, medical, or education expenses'
    ]
  },
  {
    id: 'platinum',
    name: 'MM2H Platinum Tier',
    badge: 'Ultra-High-Net-Worth / PR Pathway',
    passDuration: '20 Years (Renewable) + PR Eligible',
    fixedDeposit: 'USD $1,000,000 (approx. RM 4,700,000)',
    depositUSD: '$1,000,000',
    propertyRequirement: 'Must purchase residential property of min. RM 2,000,000 (held for 10 years)',
    minStay: '60 Days per year (Cumulative)',
    ageRequirement: '25 Years Old and above',
    workAndBusiness: 'Full rights to work, conduct business, and establish corporations in Malaysia',
    familyInclusion: 'Spouse, unmarried children below 34, parents/in-laws, and domestic helpers',
    prPathway: true,
    color: 'from-purple-600 to-indigo-900',
    highlights: [
      'Eligibility to apply for Malaysian Permanent Residency (PR status)',
      'Full unrestricted domestic work, executive, and business ownership rights',
      'Highest VIP processing priority with direct federal agency channels',
      'Inclusion of full household including domestic helper permits'
    ]
  },
  {
    id: 'sarawak',
    name: 'Sarawak S-MM2H',
    badge: 'Affordable Regional Alternative',
    passDuration: '5 Years + 5 Years Extension (10 Years Total)',
    fixedDeposit: 'RM 150,000 (Single) / RM 300,000 (Couple)',
    depositUSD: 'approx. $32,000 - $64,000',
    propertyRequirement: 'Property purchase optional (RM 600k+ in Kuching / RM 500k other areas if below 50)',
    minStay: '30 Days per year in the state of Sarawak',
    ageRequirement: '30 Years Old and above (50+ for retirees with pension/funds)',
    workAndBusiness: 'Pass holders cannot seek active employment in Sarawak without separate permit',
    familyInclusion: 'Spouse and unmarried children below 21 years old',
    prPathway: false,
    color: 'from-emerald-600 to-teal-800',
    highlights: [
      'Significantly lower fixed deposit requirement compared to Federal MM2H',
      'Property purchase is not mandatory for applicants aged 50 and above',
      'Low annual stay requirement (only 30 days per calendar year in Sarawak)',
      'Freedom to travel and stay across West Malaysia and Sabah freely'
    ]
  }
];

export const MM2HView: React.FC<MM2HViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  // State
  const [selectedTier, setSelectedTier] = useState<string>('silver');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const currentTier = MM2H_TIERS.find((t) => t.id === selectedTier) || MM2H_TIERS[0];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen">
      {/* BREADCRUMB HEADER */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <button
              onClick={onBackToHome}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate?.('services')}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
            >
              Services
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold truncate">
              Malaysia My Second Home (MM2H)
            </span>
          </div>
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Free MM2H Assessment</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Official Licensed MM2H Liaison &amp; Immigration Advisory</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Live, Invest &amp; Retire in Malaysia with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">MM2H Residency</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Unlock 5 to 20-year renewable residency in Southeast Asia’s most liveable country. Complete guidance on the new 3-tier framework (Silver, Gold, Platinum) and Sarawak S-MM2H for families, retirees, and global investors.
              </p>

              {/* STATS STRIP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">99.5%</div>
                  <div className="text-xs text-slate-400 font-medium">Approval Track Record</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">5 - 20 Yrs</div>
                  <div className="text-xs text-slate-400 font-medium">Renewable Pass Validity</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-400">0% Tax</div>
                  <div className="text-xs text-slate-400 font-medium">Foreign Income Exemption</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400">3 Gens</div>
                  <div className="text-xs text-slate-400 font-medium">Parents, Spouse &amp; Kids</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <InteractiveHoverButton
                  text="Book Free MM2H Pre-Assessment"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto text-sm"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('mm2h-calculator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm transition-all text-center cursor-pointer"
                >
                  Compare All 3 Tiers &amp; S-MM2H
                </button>
              </div>
            </div>

            {/* HERO VISUAL CARD */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">apartment</span>
                    <span>Malaysia Lifestyle &amp; Residency Highlights</span>
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">2025/2026 GUIDELINES</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-bold">
                        🏥
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">World #1 Medical Tourism</div>
                        <div className="text-[11px] text-slate-400">JCI-accredited hospitals at 1/5th US costs</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">PREMIER</span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                        🎓
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Top British &amp; IB Schools</div>
                        <div className="text-[11px] text-slate-400">Epsom, Marlborough &amp; Alice Smith</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-400">K-12 READY</span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-bold">
                        🏡
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Freehold Property Ownership</div>
                        <div className="text-[11px] text-slate-400">Foreigners can buy land &amp; luxury condos</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">FREEHOLD</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200">
                  <span className="material-symbols-outlined text-[18px] text-emerald-400">shield_lock</span>
                  <span>End-to-end escrow banking, property conveyance &amp; pass endorsement.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIER COMPARISON & INTERACTIVE EXPLORER */}
      <section id="mm2h-calculator" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Compare Visa Categories
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Official 3-Tier MM2H &amp; Sarawak S-MM2H Framework
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Malaysia introduced a simplified, modernized tier system tailored to different investor budgets and lifestyle goals.
          </p>
        </div>

        {/* TABS */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {MM2H_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                selectedTier === tier.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tier.name}</span>
            </button>
          ))}
        </div>

        {/* SELECTED TIER DETAILS CARD */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {currentTier.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {currentTier.name}
                  </h3>
                </div>
                <div className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span>{currentTier.passDuration}</span>
                </div>
              </div>

              {/* STATS MATRIX */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                    <span>Fixed Deposit Requirement</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {currentTier.fixedDeposit}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">home_work</span>
                    <span>Property Acquisition</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {currentTier.propertyRequirement}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="text-xs font-extrabold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">timer</span>
                    <span>Annual Stay Obligation</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {currentTier.minStay}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="text-xs font-extrabold uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">badge</span>
                    <span>Work &amp; Business Rights</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {currentTier.workAndBusiness}
                  </p>
                </div>
              </div>

              {/* FAMILY INCLUSION */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-700/60 dark:to-slate-700/40 border border-emerald-100 dark:border-slate-600 space-y-1">
                <div className="text-xs font-extrabold uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">family_restroom</span>
                  <span>Family &amp; Dependent Coverage</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {currentTier.familyInclusion}
                </p>
              </div>

              {/* HIGHLIGHTS */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
                  Key Advantages of this Tier
                </h4>
                <div className="space-y-2">
                  {currentTier.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MANDATORY DOCUMENTS CARD */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                  <span>Required Applicant Documents</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">AUDIT CHECKLIST</span>
              </div>

              <div className="space-y-2.5">
                {[
                  'Certified Copy of Full Passport (All pages with 1+ year validity)',
                  'Letter of Good Conduct / Police Clearance Certificate (Apostilled)',
                  'Resume / Curriculum Vitae highlighting career background',
                  'Proof of Liquid Financial Assets & Bank Statements (Last 3 Months)',
                  'Marriage Certificate & Children Birth Certificates (For family inclusion)',
                  'Medical Examination Report & Health Insurance Policy (Upon Approval)'
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Evaluate My Profile for {currentTier.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-STEP MM2H LIFECYCLE ROADMAP */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              End-to-End Execution
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              The GEES 6-Step MM2H Process
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              From initial eligibility pre-screening and police clearance attestation to arrival in Kuala Lumpur and final pass stamping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Eligibility & Background Audit',
                desc: 'Comprehensive pre-screening of finances, police clearance feasibility, and tier alignment before application submission.',
                icon: 'fact_check'
              },
              {
                step: '02',
                title: 'Document Legalization & Filing',
                desc: 'Translating, notarizing, and submitting your full dossier to the Ministry of Tourism, Arts and Culture (MOTAC) & Immigration.',
                icon: 'folder_open'
              },
              {
                step: '03',
                title: 'Conditional Approval Letter (LOCA)',
                desc: 'Securing the official Letter of Conditional Approval issued by the Immigration Department of Malaysia.',
                icon: 'mark_email_read'
              },
              {
                step: '04',
                title: 'Fixed Deposit Account Placement',
                desc: 'Opening a Malaysian bank account (Maybank, CIMB, HSBC, Standard Chartered) and placing the required USD/MYR fixed deposit.',
                icon: 'account_balance'
              },
              {
                step: '05',
                title: 'Medical Examination & Health Cover',
                desc: 'Undergoing a routine medical check-up at a licensed Malaysian clinic and securing local medical insurance coverage.',
                icon: 'health_and_safety'
              },
              {
                step: '06',
                title: 'Passport Endorsement & Pass Issuance',
                desc: 'Personal escort to the Immigration Department headquarters in Putrajaya for biometric capture, visa payment, and pass stamping.',
                icon: 'verified'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 relative group hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-sm">
                    {item.step}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 transition-colors text-[24px]">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY MALAYSIA LIFESTYLE BENEFITS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Why Choose Malaysia?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Asia’s Most Welcoming, Cost-Effective &amp; Multicultural Haven
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Malaysia blends modern metropolitan infrastructure with rich cultural heritage, tropical beaches, English fluency, and an extraordinarily high standard of living.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0 mt-0.5">currency_exchange</span>
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">Tax Efficiency: </span>
                  No inheritance tax, no capital gains tax on overseas securities, and zero taxation on remitted foreign-sourced income.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0 mt-0.5">school</span>
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">Over 170 International Schools: </span>
                  British (A-Levels/GCSE), American AP, Canadian, and International Baccalaureate (IB) curricula at competitive tuition rates.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0 mt-0.5">medical_services</span>
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">World-Class Healthcare: </span>
                  Gleneagles, Pantai, Sunway, and Prince Court medical centers offering English-speaking physicians trained in the UK and Australia.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <InteractiveHoverButton
                text="Schedule 1-on-1 MM2H Consultation"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto text-sm"
              />
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 border border-emerald-100 dark:border-slate-700 space-y-2">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">#1</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Best Country to Retire in Asia</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Consistently ranked in Global Retirement Index top 5 for living comfort.</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-700 space-y-2">
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">100%</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">English Widely Spoken</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">English is the primary language of commerce, education &amp; healthcare.</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border border-amber-100 dark:border-slate-700 space-y-2">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400">50%</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Deposit Release</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Withdraw up to half of fixed deposit after year one for home or medical needs.</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 border border-purple-100 dark:border-slate-700 space-y-2">
              <span className="text-3xl font-black text-purple-600 dark:text-purple-400">VIP</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Putrajaya Fast-Track</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Direct VIP government processing desk through licensed agent channels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 sm:py-16 bg-slate-100 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              MM2H Program Details Answered
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What is the main difference between Federal MM2H and Sarawak S-MM2H?',
                a: 'Federal MM2H is a 3-tier system (Silver, Gold, Platinum) with fixed deposits starting at USD $150,000 and requires buying a residential property. Sarawak S-MM2H is a regional program with a much lower fixed deposit (RM 150,000 - RM 300,000) and does not require property purchase for applicants 50 and above. Both allow freedom of movement across Malaysia.'
              },
              {
                q: 'Can I withdraw my fixed deposit after putting it into a Malaysian bank?',
                a: 'Yes! Under all tiers, you can withdraw up to 50% of the principal deposit after the first year to finance residential property purchases, healthcare expenses, or your children’s education in Malaysia.'
              },
              {
                q: 'Can my children attend school and university on my MM2H visa?',
                a: 'Yes. Unmarried children can enroll in any private, international, or tertiary institution in Malaysia under your MM2H dependent pass without needing a separate Student Visa.'
              },
              {
                q: 'Can I purchase property in Malaysia under MM2H?',
                a: 'Yes. Under the new Federal MM2H rules, purchasing a residential property is required (Silver: RM 600k+, Gold: RM 1M+, Platinum: RM 2M+), and foreigners can own freehold titles in approved zones.'
              },
              {
                q: 'Is my foreign income taxed in Malaysia under MM2H?',
                a: 'No. Malaysia adopts a territorial tax system. Foreign-sourced income remitted into Malaysia by qualifying MM2H residents is exempt from Malaysian personal income tax.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0">
                    {activeFaq === idx ? 'remove' : 'add'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 bg-white/10 text-emerald-200 rounded-full text-xs font-extrabold uppercase tracking-widest border border-white/20">
              Trusted Immigration Advisory
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Start Your Malaysia Residency Journey with GEES
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Let our senior consultants assess your eligibility, handle MOTAC document approvals, and organize your fixed deposit placement in Malaysia.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-full font-extrabold text-sm shadow-xl transition-all cursor-pointer"
              >
                Book Free MM2H Assessment
              </button>
              <button
                onClick={onBackToHome}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-400/30 text-white rounded-full font-bold text-sm transition-all cursor-pointer"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MM2HView;
