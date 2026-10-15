/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Student Visa Assistance & Immigration Guidance Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface StudentVisaAssistanceViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: () => void;
  onNavigate?: (view: string, payload?: string) => void;
}

interface VisaCountryDetail {
  id: string;
  country: string;
  flag: string;
  visaName: string;
  processingTime: string;
  financialRequirement: string;
  keyHighlights: string[];
  documents: string[];
  expertTip: string;
  color: string;
}

const VISA_COUNTRIES: VisaCountryDetail[] = [
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaName: 'Student Visa (formerly Tier 4)',
    processingTime: '3 - 4 Weeks (Priority: 5 Days)',
    financialRequirement: 'Course fees + £1,334/mo (London) or £1,023/mo (Outer London) for 9 months',
    keyHighlights: [
      'CAS (Confirmation of Acceptance for Studies) required',
      'IHS (Immigration Health Surcharge) £776/year access to NHS',
      '2-Year Post-Study Work Visa (Graduate Route)',
      'Allowed 20 hours/week part-time work during term time'
    ],
    documents: [
      'Unconditional Offer & Valid CAS Statement',
      'Passports with 6+ months validity',
      '28-Day Bank Statement / Education Loan Letter',
      'TB Health Certificate (Approved Clinic)',
      'ATAS Clearance (for specific STEM subjects)'
    ],
    expertTip: 'Ensure bank funds are held strictly for 28 consecutive days before applying. The final balance date must be within 31 days of submission.',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'usa',
    country: 'United States',
    flag: '🇺🇸',
    visaName: 'F-1 Academic Student Visa',
    processingTime: '2 - 6 Weeks (Interview Appointment Dependent)',
    financialRequirement: 'Official Form I-20 amount covering 1 full year tuition + living expenses',
    keyHighlights: [
      'Form I-20 issued by SEVP-certified University',
      'SEVIS I-901 Fee payment receipt required',
      'Strict In-Person Embassy Interview mandatory',
      '3-Year OPT extension for STEM graduates'
    ],
    documents: [
      'Signed Form I-20 from US University',
      'DS-160 Online Nonimmigrant Visa Confirmation',
      'SEVIS Fee Receipt ($350 USD)',
      'Affidavit of Support & Bank Solvency Records',
      'Academic Transcripts, Standardized Tests (SAT/GRE/TOEFL)'
    ],
    expertTip: 'Focus heavily on demonstrating strong social and economic ties to your home country during the 2-minute consular officer interview.',
    color: 'from-rose-600 to-red-700'
  },
  {
    id: 'australia',
    country: 'Australia',
    flag: '🇦🇺',
    visaName: 'Student Visa (Subclass 500)',
    processingTime: '4 - 8 Weeks',
    financialRequirement: 'Annual tuition + AUD $29,710 living cost + travel allowance',
    keyHighlights: [
      'Genuine Student (GS) criteria replacing GTE',
      'Electronic Confirmation of Enrolment (eCoE)',
      'OSHC (Overseas Student Health Cover) compulsory',
      '48-Hour fortnightly work rights during study terms'
    ],
    documents: [
      'Official eCoE from Australian University/College',
      'GS Statement demonstrating genuine study intent',
      'OSHC Health Insurance Policy Confirmation',
      'Proof of Annual Income (AUD $87,856+) or Liquid Funds',
      'English Test Results (IELTS / PTE Academic)'
    ],
    expertTip: 'Align your chosen course directly with your past academic record and immediate career progression in your home country.',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    visaName: 'Canada Study Permit (SDS / Regular)',
    processingTime: '6 - 12 Weeks (SDS: 20 Days)',
    financialRequirement: '1 Year Tuition + CAD $20,635 GIC (Guaranteed Investment Certificate)',
    keyHighlights: [
      'Provincial Attestation Letter (PAL) where applicable',
      'Student Direct Stream (SDS) for expedited processing',
      'Scotiabank / CIBC GIC of CAD $20,635',
      'Up to 3-Year PGWP (Post-Graduation Work Permit)'
    ],
    documents: [
      'DLI Official Letter of Acceptance & PAL',
      'CAD $20,635 GIC Certificate Receipt',
      'Proof of 1st Year Tuition Payment Receipt',
      'IELTS Academic overall 6.0+ (no band under 6.0)',
      'Medical Exam Confirmation & Police Clearance'
    ],
    expertTip: 'Provide a compelling Statement of Purpose (SOP) explaining why Canada and your specific institution offer unique training not available locally.',
    color: 'from-emerald-600 to-teal-700'
  }
];

const MOCK_INTERVIEW_QUESTIONS = [
  {
    q: 'Why did you choose this university and this specific course?',
    a: 'Emphasize specific professors, research centers, curriculum modules, and unique industry links. Avoid generic answers like "It is a good school."'
  },
  {
    q: 'How will you fund your education and living expenses abroad?',
    a: 'State your precise funding source (Self-funded, Education Loan, Parental Savings, Corporate Sponsorship). Mention the exact bank figures clearly.'
  },
  {
    q: 'What are your plans after completing your degree?',
    a: 'Clearly state your intent to return home to join specific target industries, family businesses, or MNCs in your home country.'
  },
  {
    q: 'Why not study a similar program in your home country?',
    a: 'Highlight international faculty, specialized practical labs, exposure to global standards, and lack of similar accredited modules locally.'
  }
];

export const StudentVisaAssistanceView: React.FC<StudentVisaAssistanceViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  // Calculator state
  const [selectedCountry, setSelectedCountry] = useState<string>('uk');
  const [studyLevel, setStudyLevel] = useState<string>('undergraduate');
  const [financialSource, setFinancialSource] = useState<string>('loan_savings');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const countryInfo = VISA_COUNTRIES.find((c) => c.id === selectedCountry) || VISA_COUNTRIES[0];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen">
      {/* HEADER BREADCRUMB BAR */}
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
              Student Visa Assistance
            </span>
          </div>
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Free Visa Audit</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>99.8% Visa Approval Rate Across 15,000+ Applicants</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hassle-Free <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">Student Visa & Immigration</span> Support
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Turn complex embassy regulations into a smooth, step-by-step pathway. From CAS &amp; I-20 issuance to financial document auditing and 1-on-1 mock embassy interview coaching.
              </p>

              {/* STATS STRIP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400">99.8%</div>
                  <div className="text-xs text-slate-400 font-medium">Visa Approval Rate</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">15,000+</div>
                  <div className="text-xs text-slate-400 font-medium">Visas Issued</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-sky-400">7 Days</div>
                  <div className="text-xs text-slate-400 font-medium">Avg CAS/I-20 Turnaround</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Document Audit Guarantee</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <InteractiveHoverButton
                  text="Book Free Visa Consultation"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto text-sm"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('visa-checker');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm transition-all text-center cursor-pointer"
                >
                  Check Eligibility &amp; Documents
                </button>
              </div>
            </div>

            {/* HERO VISUAL CARD */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">GEES-VISA-PORTAL v4.2</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">UK CAS Verification</div>
                        <div className="text-xs text-slate-400">London Metropolitan University</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full">APPROVED</span>
                  </div>

                  <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold">
                        🇺🇸
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">US F-1 Form I-20</div>
                        <div className="text-xs text-slate-400">University of Illinois Chicago</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">ISSUED</span>
                  </div>

                  <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl font-bold">
                        🇨🇦
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Canada SDS PAL Permit</div>
                        <div className="text-xs text-slate-400">University of Alberta</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full">VERIFIED</span>
                  </div>

                  <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl flex items-center gap-3 text-xs text-blue-200">
                    <span className="material-symbols-outlined text-[20px] text-blue-400">security</span>
                    <span>All financial audits backed by GEES Senior Immigration Compliance Officers.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CHECKER SECTION */}
      <section id="visa-checker" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Interactive Calculator
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Country Visa &amp; Document Requirement Matcher
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Select your target study destination to view essential financial thresholds, key documents, processing timeline, and expert tips.
          </p>
        </div>

        {/* COUNTRY SELECTOR TABS */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {VISA_COUNTRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCountry(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                selectedCountry === c.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span>{c.country}</span>
            </button>
          ))}
        </div>

        {/* SELECTED COUNTRY DETAIL CARD */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {countryInfo.flag} {countryInfo.country}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {countryInfo.visaName}
                  </h3>
                </div>
                <div className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">schedule</span>
                  <span>{countryInfo.processingTime}</span>
                </div>
              </div>

              {/* FINANCIAL REQUIREMENT HIGHLIGHT */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700/60 dark:to-slate-700/40 border border-blue-100 dark:border-slate-600">
                <div className="text-xs font-extrabold uppercase text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>Financial Proof Requirement</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {countryInfo.financialRequirement}
                </p>
              </div>

              {/* KEY HIGHLIGHTS */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3">
                  Key Visa Regulations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {countryInfo.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXPERT TIP */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 text-[22px] shrink-0">lightbulb</span>
                <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                  <span className="font-bold">GEES Advisor Pro-Tip:</span> {countryInfo.expertTip}
                </div>
              </div>
            </div>

            {/* MANDATORY CHECKLIST */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span>Mandatory Documents Audit</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">5 Items</span>
              </h4>

              <div className="space-y-2.5">
                {countryInfo.documents.map((doc, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {doc}
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Request Full Document Audit for {countryInfo.country}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-STEP LIFECYCLE ROADMAP */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              End-to-End Execution
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              The GEES 6-Step Visa Approval Process
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              A structured, risk-free methodology engineered to minimize rejection risks and guarantee 100% compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Profile & Solvency Audit',
                desc: 'Thorough evaluation of your academic history, study gaps, personal background, and financial sponsor credentials.',
                icon: 'find_in_page'
              },
              {
                step: '02',
                title: 'Financial Proof Verification',
                desc: 'Guidance on required holding periods (e.g. 28-day rule), bank balance certificates, loan sanctions, and affidavit structuring.',
                icon: 'account_balance'
              },
              {
                step: '03',
                title: 'CAS / I-20 / LOA Fast-Tracking',
                desc: 'Direct liaison with university international admissions teams to secure your official visa eligibility certificate without delay.',
                icon: 'description'
              },
              {
                step: '04',
                title: 'Online Application & Fees',
                desc: 'Meticulous lodging of DS-160 / UKVI / VFS forms, IHS health surcharge payments, and biometrics appointment scheduling.',
                icon: 'task_alt'
              },
              {
                step: '05',
                title: 'Mock Embassy Interview Prep',
                desc: '1-on-1 simulated interviews with former visa officers, covering tricky questions regarding career intent and finances.',
                icon: 'record_voice_over'
              },
              {
                step: '06',
                title: 'Visa Stamping & Pre-Departure',
                desc: 'Passport collection verification, international student insurance setup, flight booking, and pre-departure orientation.',
                icon: 'flight_takeoff'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 relative group hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-sm">
                    {item.step}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors text-[24px]">
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

      {/* MOCK INTERVIEW SIMULATOR */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Embassy Interview Mastery
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Master Your US &amp; European Embassy Interview
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Consular officers make their decision in under 3 minutes. GEES conducts live 1-on-1 mock interviews to build flawless confidence and eliminate red flags.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Real consular interview question bank (2025/2026 update)</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Body language, posture, and vocal delivery coaching</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Specific guidance on handling prior visa refusal history</span>
              </div>
            </div>

            <div className="pt-4">
              <InteractiveHoverButton
                text="Schedule Mock Interview Session"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto text-sm"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
              Sample High-Probability Questions &amp; Winning Strategies
            </h3>
            {MOCK_INTERVIEW_QUESTIONS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2"
              >
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    "{item.q}"
                  </p>
                </div>
                <div className="pl-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Winning Strategy: </span>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 sm:py-16 bg-slate-100 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Student Visa Queries Answered
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What happens if I have a gap year in my study history?',
                a: 'A study gap is completely acceptable provided you demonstrate meaningful activity during that period — such as relevant work experience, internships, certifications, or language study. GEES helps draft official gap explanations and experience letters.'
              },
              {
                q: 'Can I bring my spouse or children on my student visa?',
                a: 'Dependent rules vary by country and degree level. For the UK, dependents are allowed for postgraduate research or PhD students. In Australia, Canada, and the US, spouses can apply for dependent visas (F-2, Subclass 500 dependent, or Spousal Open Work Permit).'
              },
              {
                q: 'How long must my bank balance be maintained before submitting?',
                a: 'For the UK, funds must be held for 28 consecutive days. For Australia and Canada, funds should demonstrate source and stability over 3 to 6 months. GEES conducts a full bank statement audit prior to visa filing.'
              },
              {
                q: 'Can GEES assist if I had a previous visa rejection?',
                a: 'Yes! Over 20% of our successful applicants previously experienced a visa refusal through other agencies. We obtain your embassy GCMS / SAR notes, identify the exact reason for refusal, re-structure your documents, and submit a strong fresh application.'
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
                  <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0">
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
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs font-extrabold uppercase tracking-widest border border-white/20">
              Zero Risk • 99.8% Success Rate
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Ready to Secure Your Student Visa for 2026?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Don't leave your international future to chance. Get a complimentary document assessment from our certified immigration counselors today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-900 hover:bg-blue-50 rounded-full font-extrabold text-sm shadow-xl transition-all cursor-pointer"
              >
                Book Free Visa Audit Now
              </button>
              <button
                onClick={onBackToHome}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-900/60 hover:bg-blue-900 border border-blue-400/30 text-white rounded-full font-bold text-sm transition-all cursor-pointer"
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

export default StudentVisaAssistanceView;
