/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Tourist & Visitor Visa Assistance View
 * Authentic GEES Visual Identity: #0B1329 Deep Navy, #fbb034 Gold, Royal Blue
 * Transparent, evidence-based tourist and graduation visitor guidance
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface TouristVisaViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (serviceName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

interface DestinationTouristPolicy {
  id: string;
  country: string;
  flag: string;
  visaCategory: string;
  governingAuthority: string;
  authorityUrl: string;
  validitySummary: string;
  indicativeProcessingTime: string;
  financialExpectation: string;
  keyRequirements: string[];
  graduationTip: string;
  officialReviewDate: string;
  statusBadge: string;
}

const TOURIST_DESTINATIONS: DestinationTouristPolicy[] = [
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaCategory: 'Standard Visitor Visa (Tourism, Graduation & Family Visits)',
    governingAuthority: 'UK Visas and Immigration (UKVI) & Home Office',
    authorityUrl: 'https://www.gov.uk/standard-visitor',
    validitySummary: '6 Months standard (Options for 2-year, 5-year, or 10-year multiple entry for frequent travelers)',
    indicativeProcessingTime: 'Typically 3 to 4 weeks from biometrics appointment (Priority 5-day service available where offered)',
    financialExpectation: '6 months bank statement showing steady, traceable income flow and sufficient disposable savings (£2,500 - £4,000+ per visitor)',
    keyRequirements: [
      'Valid passport with at least 6 months validity remaining and blank pages',
      'Proof of employment (NOC letter, salary pay slips) or trade license/tax returns for business owners',
      'Bank statement & bank solvency certificate verifying legitimate funds without sudden unexplained deposits',
      'University convocation invitation letter & student’s valid BRP/Student Visa copy (for graduation visits)',
      'Custom cover letter detailing trip itinerary, accommodation address, and intent to return to Bangladesh'
    ],
    graduationTip: 'For graduation ceremonies, request the university’s official Registrar letter confirming your child’s degree completion, ceremony date, and allocated guest tickets.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Graduation & Leisure'
  },
  {
    id: 'usa',
    country: 'United States',
    flag: '🇺🇸',
    visaCategory: 'B1/B2 Nonimmigrant Visitor Visa for Tourism, Family & Business',
    governingAuthority: 'U.S. Department of State & U.S. Embassy Dhaka',
    authorityUrl: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html',
    validitySummary: 'Up to 5 or 10 years multiple entry (maximum 6 months per individual stay granted by CBP upon arrival)',
    indicativeProcessingTime: 'Subject to consular interview appointment slot availability at U.S. Embassy Dhaka (Expedited slots can be requested for urgent convocation dates)',
    financialExpectation: 'Evidence of sufficient personal liquid funds and income to support travel without unauthorized employment ($3,000 - $6,000 USD)',
    keyRequirements: [
      'Form DS-160 Online Nonimmigrant Visa Application confirmation page with barcode',
      'MRV visa fee payment receipt and scheduled interview appointment letter',
      'Strong documented ties to Bangladesh (property deeds, family ties, ongoing career/business)',
      'Student’s Form I-20, valid F-1 visa stamp, and official university graduation convocation letter',
      'Tax return acknowledgments (ITR / Form 16) and active bank statements'
    ],
    graduationTip: 'Consular interviews at the U.S. Embassy are typically brief (2–3 minutes). Speak clearly and focus on your child’s graduation milestone and your strong commitments to return to Bangladesh.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Consular Interview Stream'
  },
  {
    id: 'schengen',
    country: 'Schengen Europe',
    flag: '🇪🇺',
    visaCategory: 'Short-Stay Type C Visitor Visa (29 Schengen Member States)',
    governingAuthority: 'Respective EU Member State Embassy / Consulates (Germany, France, Italy, Spain, etc.) & VFS Global Dhaka',
    authorityUrl: 'https://home-affairs.ec.europa.eu/policies/schengen-borders-visa/visa-policy_en',
    validitySummary: 'Maximum 90 days within any rolling 180-day period across all 29 member countries',
    indicativeProcessingTime: 'Typically 15 to 25 calendar days after biometric lodgement at the authorized visa application center',
    financialExpectation: '€50 to €100 per day of stay demonstrated via 3 to 6 months bank statements with clear salary or business credits',
    keyRequirements: [
      'Harmonized Schengen visa application form signed by applicant',
      'Compliant Schengen travel medical insurance covering minimum €30,000 emergency medical and repatriation costs',
      'Verifiable roundtrip flight itinerary reservation and hotel booking vouchers (or formal host declaration / Verpflichtungserklärung)',
      'Official letter from European university (for campus open days, graduation, or academic symposiums)',
      'Employer leave approval letter (NOC) and proof of personal asset ownership in Bangladesh'
    ],
    graduationTip: 'Always lodge your application at the Embassy of the Schengen country where you will spend the longest duration or enter first.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Multi-Country Access'
  },
  {
    id: 'australia',
    country: 'Australia',
    flag: '🇦🇺',
    visaCategory: 'Visitor Visa (Subclass 600 - Tourist & Sponsored Family Stream)',
    governingAuthority: 'Department of Home Affairs (DHA), Commonwealth of Australia',
    authorityUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600',
    validitySummary: 'Typically 3, 6, or 12 months (Option for multi-year multiple entry visas for eligible parents of Australian citizens/residents)',
    indicativeProcessingTime: 'Typically 2 to 6 weeks via 100% online ImmiAccount submission',
    financialExpectation: 'AUD $3,000 to $5,000+ per applicant in liquid bank deposits, fixed deposits, and consistent tax filings',
    keyRequirements: [
      'Complete online submission via ImmiAccount with verified high-resolution document scans',
      'Student’s formal invitation letter, Confirmation of Enrolment (eCoE), and residential lease agreement',
      'Genuine Temporary Entrant (GTE) statement explaining visit purpose, planned travel activities, and home country ties',
      'Biometric collection confirmation at VFS Global Dhaka/Sylhet',
      'Health examinations if staying for longer than 6 months or over 75 years of age'
    ],
    graduationTip: 'The Australian Subclass 600 is processed entirely electronically. No original passport is retained by the embassy; keep digital scans crisp and complete.',
    officialReviewDate: 'October 2026',
    statusBadge: '100% Online Filing'
  },
  {
    id: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    visaCategory: 'Temporary Resident Visa (TRV / Visitor Visa)',
    governingAuthority: 'Immigration, Refugees and Citizenship Canada (IRCC)',
    authorityUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html',
    validitySummary: 'Up to 10 years multiple entry (or matching remaining passport validity duration, max 6 months per stay)',
    indicativeProcessingTime: 'Typically 4 to 8 weeks depending on IRCC processing office capacity and biometric recording',
    financialExpectation: 'CAD $4,000 to $7,000 in liquid bank balance plus established source of ongoing livelihood in Bangladesh',
    keyRequirements: [
      'Online application through IRCC portal with complete IMM family information schedules',
      'Official letter of invitation from student with copy of Canadian Study Permit and university enrollment status',
      'Detailed purpose of travel statement detailing dates of university convocation ceremony',
      'Biometrics collection (photo & fingerprints) valid for 10 years across all Canadian applications',
      'Proof of employment, business ownership, property evaluations, and family dependencies in Bangladesh'
    ],
    graduationTip: 'Clearly link your travel window to the exact university convocation dates to give immigration officers an unambiguous, verifiable travel purpose.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Long-Term Multiple Entry'
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    visaCategory: 'Tourist eVISA & Single / Multiple Entry Social Visit Pass',
    governingAuthority: 'Immigration Department of Malaysia (JIM) & High Commission of Malaysia, Dhaka',
    authorityUrl: 'https://malaysiavisa.imi.gov.my/',
    validitySummary: '30 Days single entry per visit (eVISA valid for 3 months from issuance date)',
    indicativeProcessingTime: 'Fast online processing (typically 3 to 7 working days from online submission)',
    financialExpectation: 'Bank statement covering stay expenses (typically BDT 1.5 - 2.5 Lakh per person)',
    keyRequirements: [
      'Valid passport with at least 6 months validity from date of entry into Malaysia',
      'Confirmed return flight tickets and confirmed hotel booking vouchers in Malaysia',
      'Studio-quality passport photo on pure white background (35mm x 45mm, adhering to JIM guidelines)',
      'Student invitation letter and current Malaysian Student Pass copy (if visiting a student child)',
      'Recent 3 months bank statement and employment/business proof'
    ],
    graduationTip: 'Malaysia is an ideal destination for campus exploration and visiting students. Ensure your return flight is confirmed within the 30-day single entry window.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Fast eVISA Processing'
  },
  {
    id: 'singapore',
    country: 'Singapore & Regional Asia',
    flag: '🇸🇬',
    visaCategory: 'Singapore Tourist e-Visa & Regional Travel Passes',
    governingAuthority: 'Immigration & Checkpoints Authority (ICA) Singapore',
    authorityUrl: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements',
    validitySummary: 'Typically 30 days entry with single or multiple entry options',
    indicativeProcessingTime: '3 to 5 working days through authorized visa partners',
    financialExpectation: 'Personal or family bank balance of BDT 1.5 - 3.0 Lakh showing consistent transaction history',
    keyRequirements: [
      'Form 14A duly completed and signed by applicant',
      'Passport with minimum 6 months validity beyond intended stay',
      'Roundtrip confirmed flight itinerary and hotel accommodation booking',
      'Letter of Introduction (LOI) from Singapore resident or authorized visa agent',
      'Clear copy of Bangladeshi National ID (NID) and employer leave letter'
    ],
    graduationTip: 'Often paired with Malaysia travel for prospective campus visits and regional leisure tours.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Regional Hub'
  }
];

export const TouristVisaView: React.FC<TouristVisaViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('uk');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [travelPurposeFilter, setTravelPurposeFilter] = useState<'all' | 'graduation' | 'campus' | 'holiday'>('all');

  // Interactive travel pre-assessment state
  const [purposeSelect, setPurposeSelect] = useState<string>('');
  const [destinationSelect, setDestinationSelect] = useState<string>('');
  const [bankBalanceStatus, setBankBalanceStatus] = useState<string>('');

  const currentDestination =
    TOURIST_DESTINATIONS.find((d) => d.id === selectedDestinationId) || TOURIST_DESTINATIONS[0];

  const handleWhatsAppInquiry = (customText?: string) => {
    const text =
      customText ||
      `Hello GEES, I would like guidance on applying for a visitor/tourist visa for ${currentDestination.country}. Please advise on document readiness and appointment steps.`;
    window.open(`https://wa.me/8801805529578?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleConsultationTrigger = () => {
    if (onOpenConsultation) {
      onOpenConsultation(`Tourist & Visitor Visa - ${currentDestination.country}`);
    } else {
      handleWhatsAppInquiry();
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0B1329] text-slate-900 dark:text-slate-100 min-h-screen">
      {/* 1. BREADCRUMB & CONTEXT STRIP */}
      <nav aria-label="Breadcrumb" className="bg-white dark:bg-[#0c1229] border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 overflow-hidden">
            <button
              onClick={onBackToHome}
              className="hover:text-blue-600 dark:hover:text-[#fbb034] font-medium transition-colors cursor-pointer shrink-0"
            >
              Home
            </button>
            <span className="text-slate-400">/</span>
            <button
              onClick={() => onNavigate?.('services')}
              className="hover:text-blue-600 dark:hover:text-[#fbb034] font-medium transition-colors cursor-pointer shrink-0"
            >
              Services
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 dark:text-white font-semibold truncate">
              Tourist &amp; Visitor Visa
            </span>
          </div>
          <button
            onClick={handleConsultationTrigger}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fbb034] hover:bg-[#e5a02e] text-[#0B1329] rounded-full font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
            <span className="hidden min-[420px]:inline">Visitor Consultation</span>
            <span className="min-[420px]:hidden">Advisor</span>
          </button>
        </div>
      </nav>

      {/* 2. STATUTORY CONSULAR ADVISORY BANNER */}
      <aside aria-label="Consular Notice" className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-4 py-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg shrink-0 mt-0.5">
            verified_user
          </span>
          <div className="space-y-0.5">
            <p className="font-bold tracking-tight">
              Official Consular Notice: Documentation Advisory &amp; Application Compilation
            </p>
            <p className="text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
              GEES provides visa documentation compilation, custom cover letter drafting, financial solvency audits, and consular appointment booking guidance. All visa granting decisions, validity durations, and processing timelines remain the exclusive sovereign discretion of the respective embassy, high commission, or immigration authority (UKVI, US Department of State, Australian DHA, IRCC, Schengen Consulates). GEES does not claim special consular influence or guarantee visa approvals.
            </p>
          </div>
        </div>
      </aside>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1329] via-[#0c1229] to-[#0f1738] text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Service badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="material-symbols-outlined text-[18px] text-[#fbb034]">card_travel</span>
                <span>Dedicated Visitor &amp; Travel Assistance</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Tourist, Family &amp; <span className="bg-gradient-to-r from-[#fbb034] via-amber-200 to-sky-300 bg-clip-text text-transparent">Graduation Visitor</span> Visas
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Celebrate your child’s university graduation, inspect prospective international campuses, or enjoy memorable family holidays abroad. GEES provides meticulous file preparation, financial solvency auditing, and consular guidance.
              </p>

              {/* THREE CORE GROUND RULES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-xs uppercase font-bold text-[#fbb034] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Graduation Visits</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    Registrar convocation letter verification &amp; family filing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-xs uppercase font-bold text-sky-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">home_pin</span>
                    <span>Home Ties Proof</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    Demonstrating solid social, employment, &amp; economic roots.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                    <span>Solvency Auditing</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    Transparent bank statements with clear income origin.
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
                <InteractiveHoverButton
                  text="Book Visitor Visa Consultation"
                  onClick={handleConsultationTrigger}
                  className="w-full sm:w-auto text-sm"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('supported-destinations');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                  <span>Explore Destination Guidelines</span>
                </button>
              </div>
            </div>

            {/* HERO VISUAL CARD */}
            <div className="lg:col-span-5">
              <div className="bg-[#0c1229]/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs font-bold text-[#fbb034] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Parent Convocation &amp; Travel Care</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[11px] font-bold rounded-full">
                    GEES SERVICE
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-[#0B1329] rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">description</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Custom Cover Letter Drafting</h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                        Clearly stating trip itinerary, accommodation bookings, financial responsibility, and clear return intent.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#0B1329] rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">school</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">University Registrar Liaison</h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                        Guiding students on obtaining official graduation convocation letters formatted specifically for visa officers.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#0B1329] rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">shield</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Financial &amp; Asset Auditing</h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                        Rigorous review of bank statements, tax records, and asset ownership to eliminate common refusal triggers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="https://wa.me/8801805529578"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Chat on WhatsApp (+880 1805-529578)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRIMARY TRAVEL STREAMS WE ASSIST */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
            Specialized Categories
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Visitor Visa Categories We Support
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Visitor visa applications require a precise, substantiated narrative. We structure your documentation around your actual travel purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-[#fbb034] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">school</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              University Convocation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Assisting parents and immediate family members traveling to attend student graduation ceremonies with official university verification.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">domain</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Campus Open Days &amp; Tours
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Guiding students and parents visiting prospective universities, inspecting campus facilities, and meeting admissions teams before enrollment.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">beach_access</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Family Holidays &amp; Leisure
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Structuring verifiable tourist itineraries, hotel reservations, and roundtrip flight vouchers for family vacations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">diversity_3</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Family Reunion Visits
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Helping parents and siblings visit family members residing, working, or studying abroad with formal host invitations.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SUPPORTED DESTINATIONS & CONSULAR GUIDELINES */}
      <section id="supported-destinations" className="py-12 sm:py-16 bg-white dark:bg-[#0c1229]/60 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
              Destination Directory
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Supported Destinations &amp; Consular Criteria
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Select a target destination to view verified visa categories, governing consular authorities, financial solvency benchmarks, and key documents.
            </p>
          </div>

          {/* TAB BUTTONS (TOUCH TARGET 44PX+ ON MOBILE) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
            {TOURIST_DESTINATIONS.map((dest) => {
              const isSelected = dest.id === selectedDestinationId;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestinationId(dest.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-base">{dest.flag}</span>
                  <span>{dest.country}</span>
                </button>
              );
            })}
          </div>

          {/* DESTINATION DETAIL DISPLAY CARD */}
          <div className="bg-slate-50 dark:bg-[#0B1329] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl">{currentDestination.flag}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {currentDestination.country} &mdash; {currentDestination.visaCategory}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>Governing Consular Authority:</span>
                  <a
                    href={currentDestination.authorityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-[#fbb034] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>{currentDestination.governingAuthority}</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
                  {currentDestination.statusBadge}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Verified: {currentDestination.officialReviewDate}
                </span>
              </div>
            </div>

            {/* THREE KEY SUMMARY TILES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-extrabold uppercase text-blue-600 dark:text-[#fbb034] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>Validity &amp; Duration</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentDestination.validitySummary}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>Indicative Processing Time</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentDestination.indicativeProcessingTime}
                </p>
                <p className="text-[11px] text-slate-400">
                  Varies by embassy seasonal workload &amp; appointment availability.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                  <span>Financial Solvency Benchmark</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentDestination.financialExpectation}
                </p>
              </div>
            </div>

            {/* GRADUATION / CONVOCATION PRO-TIP */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[22px] shrink-0 mt-0.5">
                school
              </span>
              <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-bold">Graduation Ceremony Advisory: </span>
                {currentDestination.graduationTip}
              </div>
            </div>

            {/* MANDATORY CHECKLIST & ACTION ROW */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="w-full lg:w-2/3 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Key Application Documentation for {currentDestination.country}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {currentDestination.keyRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-blue-600 dark:text-[#fbb034] text-[16px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full lg:w-1/3 flex flex-col gap-2.5 shrink-0">
                <button
                  onClick={handleConsultationTrigger}
                  className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Audit Documents for {currentDestination.country}</span>
                </button>
                <button
                  onClick={() => handleWhatsAppInquiry(`Inquiry regarding tourist/visitor visa requirements for ${currentDestination.country}.`)}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-500">chat</span>
                  <span>Ask a Question on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SIX-STEP APPLICATION ROADMAP */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
            Methodical Preparation
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            The GEES Visitor Visa Roadmap
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            From initial invitation verification to biometrics scheduling and pre-departure briefings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Purpose & Travel Assessment',
              desc: 'Evaluating travel reason (graduation, campus tour, family reunion, holiday) and verifying basic eligibility.',
              icon: 'fact_check'
            },
            {
              step: '02',
              title: 'Solvency & Ties Audit',
              desc: 'Reviewing 6 months bank transactions, income tax certificates, property proofs, and employer NOCs.',
              icon: 'account_balance'
            },
            {
              step: '03',
              title: 'Cover Letter & Itinerary Drafting',
              desc: 'Crafting tailored cover letters explaining the precise purpose, lodging, day-to-day plan, and return intent.',
              icon: 'edit_note'
            },
            {
              step: '04',
              title: 'Portal Lodgement & Fee Payment',
              desc: 'Accurately completing government application portals (DS-160, ImmiAccount, IRCC, or UKVI) and paying official fees.',
              icon: 'send'
            },
            {
              step: '05',
              title: 'Biometrics & Interview Coaching',
              desc: 'Scheduling VFS/embassy appointments and conducting calm mock interview sessions for senior citizens & parents.',
              icon: 'record_voice_over'
            },
            {
              step: '06',
              title: 'Passport Return & Travel Advisory',
              desc: 'Tracking passport dispatch, inspecting visa sticker/e-Visa details, and providing airport immigration arrival tips.',
              icon: 'flight_takeoff'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative group hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-[#fbb034] flex items-center justify-center font-extrabold text-sm">
                  {item.step}
                </span>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#fbb034] transition-colors text-[24px]">
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
      </section>

      {/* 7. "TIES TO HOME COUNTRY" FRAMEWORK */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0c1229]/60 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
              Core Immigration Principle
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Understanding &quot;Ties to Home Country&quot;
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Under international immigration law, every visitor visa applicant is presumed to be an intending immigrant until they satisfy the consular officer that they possess compelling social, economic, and familial reasons to return home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0B1329] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-[#fbb034] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">badge</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Professional Ties
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Permanent employment letters, employer No Objection Certificates (NOC), proof of active commercial trade licenses, and official incorporation deeds.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0B1329] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Economic Solvency
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Consistent, gradual bank deposits over 6 months, audited tax returns (ITR), fixed deposit certificates, and authentic valuation of landed property.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0B1329] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">family_restroom</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Family &amp; Social Roots
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Spouse, minor children, or elderly dependent parents residing in Bangladesh who are not accompanying the traveler on this specific visit.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0B1329] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">history_edu</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Compliant Travel History
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Prior history of compliant overseas travel and timely returns to Bangladesh serves as credible evidence of genuine visitor intent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE TRAVEL READINESS PRE-ASSESSMENT */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#0c1229] via-[#0f1738] to-[#0B1329] border border-slate-700/80 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-[#fbb034]/20 border border-[#fbb034]/40 text-[#fbb034] text-xs font-bold uppercase tracking-wider">
              Self-Evaluation Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Check Your Visitor Visa Readiness
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Answer 3 preliminary questions to see honest guidance on required documentation and next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* QUESTION 1: PURPOSE */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wide">
                1. Travel Purpose
              </label>
              <select
                value={purposeSelect}
                onChange={(e) => setPurposeSelect(e.target.value)}
                className="w-full p-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#fbb034]"
              >
                <option value="">-- Select Purpose --</option>
                <option value="graduation">University Graduation / Convocation</option>
                <option value="campus_tour">Campus Visit / University Open Day</option>
                <option value="holiday">Holiday / Leisure Vacation</option>
                <option value="family_visit">Visiting Relatives / Family</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Determines necessary invitation letters &amp; itinerary details.
              </p>
            </div>

            {/* QUESTION 2: DESTINATION */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wide">
                2. Target Destination
              </label>
              <select
                value={destinationSelect}
                onChange={(e) => setDestinationSelect(e.target.value)}
                className="w-full p-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#fbb034]"
              >
                <option value="">-- Select Destination --</option>
                <option value="uk">United Kingdom (UKVI)</option>
                <option value="usa">United States (B1/B2)</option>
                <option value="australia">Australia (Subclass 600)</option>
                <option value="canada">Canada (TRV)</option>
                <option value="schengen">Schengen Europe</option>
                <option value="malaysia">Malaysia</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Each country enforces distinct consular portals and rules.
              </p>
            </div>

            {/* QUESTION 3: FINANCIAL STATUS */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wide">
                3. Financial Maintenance
              </label>
              <select
                value={bankBalanceStatus}
                onChange={(e) => setBankBalanceStatus(e.target.value)}
                className="w-full p-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#fbb034]"
              >
                <option value="">-- Bank Statements --</option>
                <option value="ready">6-month statement with regular income</option>
                <option value="building">Currently consolidating balance</option>
                <option value="unclear">Need guidance on required balance</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Sudden unverified bulk cash deposits are a primary refusal trigger.
              </p>
            </div>
          </div>

          {/* DYNAMIC FEEDBACK BOX */}
          {(purposeSelect || destinationSelect || bankBalanceStatus) && (
            <div className="p-5 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm space-y-2">
              <h4 className="font-bold text-[#fbb034] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                <span>Immediate Application Feedback</span>
              </h4>

              {purposeSelect === 'graduation' && (
                <p className="text-emerald-200">
                  🎓 <strong>Convocation Priority:</strong> Graduation visits carry strong credibility with consular officers when backed by an official university letter stating the exact ceremony date and student status.
                </p>
              )}

              {destinationSelect === 'usa' && (
                <p className="text-sky-200">
                  🇺🇸 <strong>US B1/B2 Interview Alert:</strong> The US requires an in-person interview in Dhaka. GEES offers calm, structured mock interview practice to help you clearly articulate your travel purpose and ties to Bangladesh.
                </p>
              )}

              {destinationSelect === 'schengen' && (
                <p className="text-amber-200">
                  🇪🇺 <strong>Schengen Insurance Requirement:</strong> You must hold a valid €30,000 medical travel insurance policy covering all 29 member states before your VFS biometric appointment.
                </p>
              )}

              {bankBalanceStatus === 'building' && (
                <p className="text-rose-200">
                  ⚠️ <strong>Financial Warning:</strong> Never deposit large lump sums into your bank account immediately prior to filing. Case officers verify historical cash flow consistency over 6 months.
                </p>
              )}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={handleConsultationTrigger}
              className="px-6 py-3.5 bg-[#fbb034] hover:bg-[#e5a02e] text-[#0B1329] font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px]">forum</span>
              <span>Review Your Profile with a Senior GEES Advisor</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0c1229]/60 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Direct, truthful answers regarding tourist and visitor visa processing for Bangladeshi citizens.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Can GEES guarantee my tourist or visitor visa approval?',
                a: 'No agency can legally or ethically guarantee a visa approval. Sovereign immigration officers and consular authorities make all final visa decisions based on their national immigration acts. GEES guarantees that your file will be compiled rigorously, with full evidential compliance, professional cover letter drafting, and complete scrutiny to eliminate administrative errors.'
              },
              {
                q: 'When should parents apply for a visa to attend their child’s graduation ceremony?',
                a: 'We strongly advise initiating your application 8 to 12 weeks prior to the scheduled ceremony. This ensures adequate time for the university registrar to issue the official convocation letter, allows you to secure biometric appointment slots, and absorbs standard embassy processing windows without travel disruption.'
              },
              {
                q: 'How much bank balance is required for a tourist visa?',
                a: 'Required bank balances depend on destination, duration, and planned activities. Generally, a liquid balance of £2,500 - £4,000 for the UK, $3,000 - $6,000 for the US/Canada/Australia, or BDT 1.5 - 2.5 Lakh for Malaysia is expected. Crucially, officers look for consistent income and transactional history rather than sudden unexplained lump-sum deposits.'
              },
              {
                q: 'What is the most frequent reason for tourist visa refusals?',
                a: 'The most common refusal ground is "Failure to demonstrate strong social, economic, or employment ties to the home country" or "Unclear source of funds." Officers must be convinced that the applicant has compelling reasons to return to Bangladesh upon conclusion of the visit.'
              },
              {
                q: 'Can an international student child sponsor their parents’ visit?',
                a: 'Yes. An enrolled student child can provide a formal invitation letter, their valid passport and student visa copy, and proof of university enrollment. Parents can either self-fund using their personal bank statements or use combined sponsorship with the student if the student has verifiable income.'
              },
              {
                q: 'Is medical travel insurance mandatory for visitor visas?',
                a: 'For Schengen Europe, travel medical insurance with a minimum coverage of €30,000 is legally mandatory. For other destinations like the UK, US, Australia, and Canada, while not always mandatory at the time of visa filing, comprehensive travel insurance is strongly recommended to protect against exorbitant medical bills while abroad.'
              },
              {
                q: 'What happens during a U.S. B1/B2 consular visa interview?',
                a: 'The interview at the U.S. Embassy in Dhaka is typically 2 to 3 minutes long. Consular officers assess your credibility, travel purpose, and ties to Bangladesh. GEES conducts clear, calm mock interview coaching sessions tailored specifically for senior citizens and parents to prepare them with confidence.'
              },
              {
                q: 'Can I convert a tourist visa into a student or work visa inside the destination country?',
                a: 'In most developed destinations (including the UK, Australia, and Canada), immigration rules strictly prohibit switching from a tourist/visitor visa to a full student visa or work permit from within the country. Applicants must generally return to Bangladesh to lodge long-term student or work visa petitions.'
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-[#0B1329] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer min-h-[44px]"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-blue-600 dark:text-[#fbb034] text-[20px] shrink-0">
                      {isOpen ? 'remove' : 'add'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. TRANSPARENT CALL TO ACTION & CONSULTATION SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#0B1329] via-[#0c1229] to-[#0f1738] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-700">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 bg-white/10 text-[#fbb034] rounded-full text-xs font-extrabold uppercase tracking-widest border border-white/20">
              Personalized Document Assessment
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white">
              Speak with a GEES Visitor Visa Counselor
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every traveler’s documentation requirements, financial posture, and destination protocols differ. Get a transparent, personalized evaluation before submitting your visa file.
            </p>

            <div className="p-3.5 bg-blue-950/60 border border-blue-800/60 rounded-2xl text-xs text-blue-200 max-w-xl mx-auto">
              <span>🔒 Transparent Communication: GEES does not collect or store private passport scans or financial records on web servers. Your consultation is conducted directly with an authorized counselor via encrypted WhatsApp or in-person.</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleConsultationTrigger}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#fbb034] hover:bg-[#e5a02e] text-[#0B1329] rounded-full font-extrabold text-sm shadow-xl transition-all cursor-pointer min-h-[44px]"
              >
                Schedule Visitor Consultation
              </button>
              <a
                href="https://wa.me/8801805529578"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Direct WhatsApp (+880 1805-529578)</span>
              </a>
            </div>

            {/* RELATED PATHWAY LINKS */}
            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span>Related Pathways:</span>
              <button
                onClick={() => onNavigate?.('student-visa-assistance')}
                className="text-blue-400 hover:text-white underline cursor-pointer"
              >
                Student Visa Assistance
              </button>
              <span>&bull;</span>
              <button
                onClick={() => onNavigate?.('dependent-visa')}
                className="text-blue-400 hover:text-white underline cursor-pointer"
              >
                Dependent Visa Guidance
              </button>
              <span>&bull;</span>
              <button
                onClick={() => onNavigate?.('flight-ticketing')}
                className="text-blue-400 hover:text-white underline cursor-pointer"
              >
                Flight &amp; Travel Reservations
              </button>
              <span>&bull;</span>
              <button
                onClick={() => onNavigate?.('contact')}
                className="text-blue-400 hover:text-white underline cursor-pointer"
              >
                Contact Our Dhaka Office
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TouristVisaView;
