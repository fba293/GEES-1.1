/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Tourist & Visitor Visa Assistance Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface TouristVisaViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: () => void;
  onNavigate?: (view: string, payload?: string) => void;
}

interface CountryTouristData {
  id: string;
  country: string;
  flag: string;
  visaType: string;
  validityDuration: string;
  processingTime: string;
  financialProof: string;
  keyHighlights: string[];
  requiredDocs: string[];
  graduationTip: string;
  color: string;
}

const TOURIST_COUNTRIES: CountryTouristData[] = [
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaType: 'Standard Visitor Visa (Tourism, Graduation & Family)',
    validityDuration: '6 Months (Option for 2, 5, or 10-Year Long-Term)',
    processingTime: '2 - 3 Weeks (Priority: 5 Days)',
    financialProof: '£2,000 - £3,500 in liquid bank balance (6-month statement)',
    keyHighlights: [
      'Covers university graduation ceremonies & campus visits',
      'No interview required for most applicants (Bio & Document Upload)',
      'Allows up to 6 months stay per visit for tourism or visiting family',
      'Option to extend to 2-year or 5-year multi-entry for frequent travelers'
    ],
    requiredDocs: [
      'Valid Passport with 6+ months validity & blank pages',
      '6 Months Bank Statements with consistent income flow',
      'Proof of Employment / Business Ownership / Pension Proof',
      'University Graduation Invitation Letter & Student Visa Copy',
      'Detailed Travel Itinerary & Flight/Accommodation Vouchers'
    ],
    graduationTip: 'For parents attending graduation, attach the official Registrar Invitation Letter stating the ceremony date along with the student’s CAS/BRP copy.',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'usa',
    country: 'United States',
    flag: '🇺🇸',
    visaType: 'B1/B2 Visitor Visa for Tourism & Business',
    validityDuration: 'Up to 10 Years Multiple Entry',
    processingTime: 'Appointment Slot Dependent (Expedited for Graduation)',
    financialProof: 'Proof of liquid funds covering full trip ($3,000 - $6,000 USD)',
    keyHighlights: [
      '10-Year Multiple Entry Visa granted for most approved applicants',
      'In-person consular interview required at US Embassy / Consulate',
      'Allows stay up to 6 months per entry',
      'Expedited appointment slots available for university graduation ceremonies'
    ],
    requiredDocs: [
      'DS-160 Nonimmigrant Visa Application Confirmation Page',
      'MRV Application Fee Payment Receipt ($185 USD)',
      'University Graduation Convocation Letter / Student I-20 Copy',
      'Proof of Strong Home Country Ties (Property, Career, Family)',
      'Bank Solvency Certificates & Tax Filing Records (Form 16 / IT Returns)'
    ],
    graduationTip: 'Focus your 2-minute interview on your strong ties to your home country and clear intent to return immediately after celebrating graduation.',
    color: 'from-rose-600 to-red-700'
  },
  {
    id: 'schengen',
    country: 'Schengen Europe',
    flag: '🇪🇺',
    visaType: 'Schengen Short-Stay Visitor Visa (Type C)',
    validityDuration: '90 Days within any 180-day period (Type C Short-Stay)',
    processingTime: '15 Days (VFS / TLScontact / BLS Lodgement)',
    financialProof: '€50 - €100 per day of stay (Bank statement of 3 months)',
    keyHighlights: [
      'Single visa grants seamless travel across 29 European countries',
      'Must apply to the country where you spend the longest duration',
      'Includes mandatory €30,000 travel medical insurance coverage',
      'Covers university visits, summer courses, and family tourism'
    ],
    requiredDocs: [
      'Schengen Harmonized Visa Application Form',
      'Compliant Schengen Travel Health Insurance (€30,000 policy)',
      'Roundtrip Flight Reservations & Hotel Booking Vouchers',
      'Sponsor / Student Invitation Letter & University Letterhead',
      'Cover Letter detailing daily travel itinerary & intent'
    ],
    graduationTip: 'Always apply to the Schengen Embassy of the country where the student resides or where you spend the majority of your stay.',
    color: 'from-amber-600 to-yellow-600'
  },
  {
    id: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    visaType: 'Temporary Resident Visa (TRV Visitor Visa) / eTA',
    validityDuration: 'Up to 10 Years (Matching passport validity date)',
    processingTime: '3 - 6 Weeks',
    financialProof: 'CAD $3,000 - $6,000 liquid balance + proof of income',
    keyHighlights: [
      'Issued for duration matching your passport validity (up to 10 years)',
      'Biometrics valid for 10 years across all Canadian applications',
      'Allows multiple entries for up to 6 months per stay',
      'Ideal for parents visiting students or attending convocation'
    ],
    requiredDocs: [
      'Official Invitation Letter from Student in Canada + Study Permit copy',
      'Proof of Student’s Enrolment, Housing & Transcripts',
      'Applicant’s Bank Statements & Proof of Assets/Employment',
      'Purpose of Travel Statement & Ties to Home Country',
      'Biometrics Collection Confirmation'
    ],
    graduationTip: 'In your Purpose of Travel statement, explicitly connect your visit duration to the university convocation dates to ensure fast approval.',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'australia',
    country: 'Australia',
    flag: '🇦🇺',
    visaType: 'Visitor Visa (Subclass 600 - Tourist & Family Stream)',
    validityDuration: '3, 6, or 12 Months Multiple Entry',
    processingTime: '2 - 4 Weeks (Online ImmiAccount Lodgement)',
    financialProof: 'AUD $3,000 - $5,000 liquid funds statement',
    keyHighlights: [
      '100% online ImmiAccount submission — no original passport submission',
      'Fast automated processing for sponsored family stream',
      'Option for 3-year multi-entry visa for parents of Australian citizens/PRs',
      'Allows university visits, holiday travel, and family reunions'
    ],
    requiredDocs: [
      'ImmiAccount Online Application Submission',
      'Student Invitation Letter & Australian University Enrolment Proof',
      'National ID, Passport, & Family Composition Proof',
      '6 Months Bank Balance & Income Tax Statements',
      'Job Clearance / Leave Approval Letter from Employer'
    ],
    graduationTip: 'Utilize the Family Sponsored Stream if the student or a relative in Australia can formally pledge financial sponsorship.',
    color: 'from-sky-600 to-cyan-700'
  }
];

export const TouristVisaView: React.FC<TouristVisaViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  // Calculator & tab state
  const [selectedCountry, setSelectedCountry] = useState<string>('uk');
  const [visitPurpose, setVisitPurpose] = useState<string>('graduation');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const countryInfo = TOURIST_COUNTRIES.find((c) => c.id === selectedCountry) || TOURIST_COUNTRIES[0];

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
              Tourist &amp; Visitor Visa
            </span>
          </div>
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
            <span>Free Visitor Visa Audit</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-sky-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>99.1% Visitor Visa Success Rate for Families &amp; Parents</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Seamless <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">Tourist &amp; Graduation Visitor</span> Visas
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Celebrate graduation ceremonies, visit university campuses, or enjoy family vacations without visa stress. Complete cover letter drafting, university invitation verification, and 100% financial auditing.
              </p>

              {/* STATS STRIP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-sky-400">99.1%</div>
                  <div className="text-xs text-slate-400 font-medium">Visitor Approval Rate</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">18,500+</div>
                  <div className="text-xs text-slate-400 font-medium">Visas Processed</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400">Up to 10 Yrs</div>
                  <div className="text-xs text-slate-400 font-medium">Multiple Entry Options</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400">Fast-Track</div>
                  <div className="text-xs text-slate-400 font-medium">Graduation Slot Booking</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <InteractiveHoverButton
                  text="Book Free Visitor Visa Audit"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto text-sm"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('tourist-calculator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm transition-all text-center cursor-pointer"
                >
                  Check Destination Requirements
                </button>
              </div>
            </div>

            {/* HERO VISUAL CARD */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Parent Graduation Visit Package</span>
                  </span>
                  <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 text-[10px] font-bold rounded">GEES VIP SERVICE</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                        📜
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">University Invitation Letter</div>
                        <div className="text-[11px] text-slate-400">Registrar Verification Audit</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">VERIFIED</span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-bold">
                        ✍️
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Cover Letter &amp; Itinerary</div>
                        <div className="text-[11px] text-slate-400">Custom Embassy Letter Drafting</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-400">READY</span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-bold">
                        🛡️
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Bank Solvency &amp; Ties Audit</div>
                        <div className="text-[11px] text-slate-400">Eliminate Refusal Red Flags</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-400">GUARANTEED</span>
                  </div>
                </div>

                <div className="p-3 bg-sky-950/60 border border-sky-800/60 rounded-xl flex items-center gap-2.5 text-xs text-sky-200">
                  <span className="material-symbols-outlined text-[18px] text-sky-400">support_agent</span>
                  <span>Dedicated counselor assigned to manage entire family group filing.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR / MATCHING SECTION */}
      <section id="tourist-calculator" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Interactive Destination Matcher
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Select Your Target Destination
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Check visa validity, processing timeframes, financial balance requirements, and essential documents for your trip.
          </p>
        </div>

        {/* COUNTRY TAB BUTTONS */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {TOURIST_COUNTRIES.map((c) => (
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

        {/* DISPLAY CARD */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {countryInfo.flag} {countryInfo.country}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {countryInfo.visaType}
                  </h3>
                </div>
                <div className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">schedule</span>
                  <span>{countryInfo.processingTime}</span>
                </div>
              </div>

              {/* TWO STAT BOXES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">event_available</span>
                    <span>Visa Validity Duration</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {countryInfo.validityDuration}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                    <span>Required Financial Proof</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {countryInfo.financialProof}
                  </p>
                </div>
              </div>

              {/* KEY HIGHLIGHTS */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
                  Key Visitor Privileges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {countryInfo.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GRADUATION PRO-TIP */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 text-[22px] shrink-0">workspace_premium</span>
                <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Graduation Ceremony Tip:</span> {countryInfo.graduationTip}
                </div>
              </div>
            </div>

            {/* MANDATORY CHECKLIST */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">fact_check</span>
                  <span>Required Visitor Documents</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">AUDIT READY</span>
              </div>

              <div className="space-y-2.5">
                {countryInfo.requiredDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Check My Eligibility for {countryInfo.country}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARENT GRADUATION SPECIAL PACKAGE SECTION */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Specialized Service
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Parent Graduation &amp; University Convocation Package
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Watching your child walk across the graduation stage is a once-in-a-lifetime milestone. GEES takes care of every visa detail so parents and family members can travel with total peace of mind.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/80">
                  <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5">mark_email_read</span>
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">University Registrar Invitation Verification: </span>
                    We liaise with the student’s university to issue official convocation letters formatted specifically for embassy officers.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/80">
                  <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5">group_add</span>
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">Family Group Application Filing: </span>
                    Filing parents, grandparents, and siblings together in a single synchronized family group application.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/80">
                  <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5">record_voice_over</span>
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">US / Schengen Interview Prep for Senior Citizens: </span>
                    Gentle, clear mock interview sessions tailored for parents and older family members.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <InteractiveHoverButton
                  text="Book Parent Graduation Visa Service"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-700 space-y-2">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">100%</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Cover Letter Customization</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Bespoke cover letters explaining trip purpose, funding sources &amp; return commitments.</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 space-y-2">
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">Fast</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Emergency Appointment Slots</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Expedited embassy slots for urgent convocation travel dates.</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 border border-teal-100 dark:border-slate-700 space-y-2">
                <span className="text-3xl font-black text-teal-600 dark:text-teal-400">€30k</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Schengen Travel Insurance</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Instant issuance of compliant Schengen medical travel insurance policies.</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border border-amber-100 dark:border-slate-700 space-y-2">
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400">0 Risk</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Solvency Audit</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Thorough check of bank statements, property valuation, &amp; income proofs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Visitor &amp; Tourist Visa Queries
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How far in advance should I apply for a visitor visa for a graduation ceremony?',
              a: 'We recommend applying 8 to 12 weeks prior to the ceremony date. This allows ample time for university letter issuance, biometric appointments, and standard embassy processing.'
            },
            {
              q: 'Can a student sponsor their parents’ travel expenses?',
              a: 'Yes, if the student is employed or holding sufficient savings/stipend abroad. Alternatively, parents can self-fund using their personal bank statements, fixed deposits, or business accounts.'
            },
            {
              q: 'What is the most common reason for tourist visa rejections?',
              a: 'The primary reason is "Failure to demonstrate strong social/economic ties to the home country" or "Unclear purpose of visit." GEES addresses this by providing comprehensive job clearance letters, property asset valuations, and structured cover letters.'
            },
            {
              q: 'Can parents travel to multiple European countries on a Schengen Visitor Visa?',
              a: 'Yes! A single Schengen short-stay Type C visa allows entry to all 29 member nations (such as France, Germany, Italy, Netherlands, Spain, Switzerland) for up to 90 days.'
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
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 bg-white/10 text-sky-200 rounded-full text-xs font-extrabold uppercase tracking-widest border border-white/20">
              Zero Stress • 99.1% Approval
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Ready to Plan Your Visitor Visa Application?
            </h2>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Don't let visa paperwork stand between you and your family's memorable moments abroad. Contact our visitor visa specialists today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-900 hover:bg-sky-50 rounded-full font-extrabold text-sm shadow-xl transition-all cursor-pointer"
              >
                Book Free Visitor Consultation
              </button>
              <button
                onClick={onBackToHome}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-950/60 hover:bg-blue-950 border border-blue-400/30 text-white rounded-full font-bold text-sm transition-all cursor-pointer"
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

export default TouristVisaView;
