/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone International Student Health Insurance & Medical Cover Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface HealthInsuranceViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: () => void;
  onNavigate?: (view: string, payload?: string) => void;
}

interface SchemeData {
  id: string;
  country: string;
  flag: string;
  schemeName: string;
  schemeTag: string;
  isMandatory: boolean;
  visaRuleName: string;
  estimatedAnnualCost: string;
  costInLocalCurrency: string;
  officialProviders: string[];
  keyHighlights: string[];
  inpatientCoverage: string;
  outpatientCoverage: string;
  ambulanceAndEvac: string;
  prescriptionCover: string;
  waitingPeriodNote: string;
  summary: string;
}

const SCHEMES: SchemeData[] = [
  {
    id: 'australia',
    country: 'Australia',
    flag: '🇦🇺',
    schemeName: 'Overseas Student Health Cover (OSHC)',
    schemeTag: 'Mandatory Visa Condition 8501',
    isMandatory: true,
    visaRuleName: 'Subclass 500 Visa Condition 8501',
    estimatedAnnualCost: '$580 – $680 AUD / yr (Single)',
    costInLocalCurrency: 'AUD $580 – $680 / yr',
    officialProviders: ['Allianz Care Australia', 'Medibank Private', 'Bupa Australia', 'nib Health Funds', 'ahm OSHC'],
    keyHighlights: [
      'Strict legal requirement before Confirmation of Enrolment (CoE) and visa grant',
      '100% MBS (Medicare Benefits Schedule) fee for general practitioner (GP) doctor visits',
      'Public hospital shared room accommodation & surgery doctor fees covered',
      '100% emergency ambulance transport with no distance cap'
    ],
    inpatientCoverage: 'Full public hospital shared room accommodation, theater fees, and intensive care',
    outpatientCoverage: '100% of the Medicare Benefits Schedule (MBS) fee for GP doctor visits & 85% for specialists',
    ambulanceAndEvac: '100% cover for emergency road ambulance transport provided by state ambulance services',
    prescriptionCover: 'Up to $50 AUD per prescribed PBS item (annual limit: $300 single / $600 couple or family)',
    waitingPeriodNote: '12-month waiting period applies for pregnancy/birth and pre-existing medical conditions; 2 months for psychiatric conditions.',
    summary: 'All international students on a Subclass 500 visa must hold continuous OSHC from their date of arrival in Australia until visa expiry. Dual or family OSHC is compulsory if traveling with spouses or children.'
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    schemeName: 'Immigration Health Surcharge (IHS)',
    schemeTag: 'Compulsory Visa Surcharge (NHS Access)',
    isMandatory: true,
    visaRuleName: 'UKVI Student Route (Tier 4) Compliance',
    estimatedAnnualCost: '£776 GBP / year of visa granted',
    costInLocalCurrency: 'GBP £776 / year',
    officialProviders: ['UK National Health Service (NHS)', 'Official UK Home Office Settlement'],
    keyHighlights: [
      'Paid directly during the online student visa application process',
      'Gives full access to the UK National Health Service (NHS) on the exact same basis as UK citizens',
      'Free consultations with local General Practitioners (GPs) and walk-in NHS medical centers',
      'Free hospital treatment, emergency accident departments (A&E), and standard ambulance transport'
    ],
    inpatientCoverage: '100% free treatment at NHS hospitals, clinical specialist wards, and emergency departments',
    outpatientCoverage: '100% free consultations with registered NHS General Practitioners (GPs) and nurses',
    ambulanceAndEvac: '100% free NHS emergency ambulance call-outs and hospital paramedic transport',
    prescriptionCover: 'Prescription medicine charged at flat NHS rate in England (£9.90/item); free in Wales & Scotland',
    waitingPeriodNote: 'Zero waiting periods. Active immediately upon passport arrival and BRP/eVisa validation in the United Kingdom.',
    summary: 'The UK Immigration Health Surcharge guarantees comprehensive healthcare through the NHS throughout your degree. It covers regular doctor appointments, accident care, and mental health counseling without hospital bills.'
  },
  {
    id: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    schemeName: 'Provincial Health & UHIP / guard.me',
    schemeTag: 'Provincial & University Mandatory Plan',
    isMandatory: true,
    visaRuleName: 'IRCC Study Permit Compliance',
    estimatedAnnualCost: '$750 – $960 CAD / yr',
    costInLocalCurrency: 'CAD $750 – $960 / yr',
    officialProviders: ['UHIP (Ontario Universities)', 'BC MSP (British Columbia)', 'guard.me International', 'Sun Life', 'Cowan'],
    keyHighlights: [
      'British Columbia: International students register for BC MSP ($75/month) plus bridging cover',
      'Ontario: University Health Insurance Plan (UHIP) is automatically enrolled upon tuition payment',
      'Alberta: AHCIP provides provincial health insurance for study permits of 12+ months duration',
      'Covers doctor clinic visits, hospital emergency ward stays, intensive surgical treatment, and diagnostics'
    ],
    inpatientCoverage: '100% hospital ward accommodation, intensive care treatment, surgical operating rooms, and physician fees',
    outpatientCoverage: '100% clinic fees for medical doctor appointments, diagnostic blood tests, and medical radiology X-rays',
    ambulanceAndEvac: 'Emergency hospital transfer coverage and international medical repatriation up to $50,000 CAD',
    prescriptionCover: 'University supplementary plans cover 70% – 80% of eligible prescription medications',
    waitingPeriodNote: 'Bridging travel health insurance (guard.me) is required for the initial 60–90 day waiting period in British Columbia.',
    summary: 'Healthcare in Canada is organized at the provincial level. International students are safeguarded either through provincial plans like BC MSP and Alberta AHCIP or university plans like Ontario UHIP and guard.me.'
  },
  {
    id: 'usa',
    country: 'United States',
    flag: '🇺🇸',
    schemeName: 'ACA-Comparable Medical Plans & University Waivers',
    schemeTag: 'University Mandated & F-1 Compliant',
    isMandatory: true,
    visaRuleName: 'US F-1 / J-1 Federal & Campus Mandate',
    estimatedAnnualCost: '$850 – $1,800 USD / yr',
    costInLocalCurrency: 'USD $850 – $1,800 / yr',
    officialProviders: ['ISO Student Health Insurance', 'PSI International Health', 'Student Medicover (UnitedHealthcare network)', 'IMG Global'],
    keyHighlights: [
      'Allows students to waive costly $3,000–$4,500/year university-sponsored insurance packages',
      'Meets US campus health waiver standards ($500k+ benefits, $50k evacuation, $25k repatriation)',
      'Extensive national Preferred Provider Organization (PPO) networks (UnitedHealthcare / Aetna / Cigna)',
      'Cashless in-network billing at thousands of campus clinics, urgent care centers, and hospitals'
    ],
    inpatientCoverage: 'Inpatient hospital stays, intensive surgery rooms, and anesthesiologist fees covered at 80% to 100% in-network',
    outpatientCoverage: 'Doctor consultations, urgent care visits, physical therapy, and student counseling ($20–$30 copay)',
    ambulanceAndEvac: 'Emergency medical evacuation up to $50,000 and return of mortal remains up to $25,000 (US federal J-1/F-1 compliance)',
    prescriptionCover: 'Covered with tiered pharmacy copays ($10 generic / $30 brand / $60 specialty in-network)',
    waitingPeriodNote: 'Pre-existing conditions usually covered after 6 to 12 months, or immediately under select ACA-compliant gold tiers.',
    summary: 'American universities require proof of insurance before semester class registration. GEES helps students compare compliant alternative plans that save up to 60% compared to mandatory university-billed insurance.'
  },
  {
    id: 'schengen',
    country: 'Germany & Schengen Europe',
    flag: '🇩🇪',
    schemeName: 'Statutory Health (TK / Barmer) & Schengen Cover',
    schemeTag: 'Statutory Student Health & 30k Visa Cover',
    isMandatory: true,
    visaRuleName: 'Schengen Visa Code & German Statutory Law',
    estimatedAnnualCost: '€130 / mo (German Public TK) | €35 / mo (Expat Private)',
    costInLocalCurrency: 'EUR €125 – €135 / month',
    officialProviders: ['Techniker Krankenkasse (TK)', 'Barmer GEK', 'DAK Gesundheit', 'Dr. Walter (ProVisit)', 'Mawista Student'],
    keyHighlights: [
      'Germany: Official Statutory Health (GKV) is mandatory for degree students under 30 for university enrollment',
      'Electronic health card (eGK) gives 100% cashless treatment at all registered German clinics and hospitals',
      'Schengen Europe Visas: Minimum €30,000 emergency medical cover with repatriation across all 29 member states',
      'Includes European Health Insurance Card (EHIC) coverage for holidays across the European Union'
    ],
    inpatientCoverage: '100% hospital bed care, surgeries, diagnostic MRIs, and physician charges with zero deductible in public hospitals',
    outpatientCoverage: '100% cashless visits to family doctors (Hausarzt), medical specialists, and psychologist therapies',
    ambulanceAndEvac: 'Full emergency ambulance dispatch by rescue services and cross-border repatriation to home country',
    prescriptionCover: 'Prescription medications standard co-payment of only €5 to €10 per item at any pharmacy (Apotheke)',
    waitingPeriodNote: 'Statutory public insurance (TK/Barmer) has no waiting periods. Pre-existing conditions are fully included by German law.',
    summary: 'German statutory health insurance like Techniker Krankenkasse (TK) is renowned globally for its zero-out-of-pocket medical protection. For language school and foundation students, compliant private plans like Mawista are arranged.'
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    schemeName: 'EMGS International Student Insurance',
    schemeTag: 'Education Malaysia Global Services Mandate',
    isMandatory: true,
    visaRuleName: 'Malaysian Immigration Student Pass VAL Rule',
    estimatedAnnualCost: 'RM 550 – RM 850 MYR / yr',
    costInLocalCurrency: 'MYR RM 550 – RM 850 / yr',
    officialProviders: ['Great Eastern Takaful', 'AIA General Berhad', 'Etiqa Insurance & Takaful'],
    keyHighlights: [
      'Compulsory element of the Visa Approval Letter (eVAL) process administered by EMGS',
      'Cashless hospital admission guarantee letter (GL) across 120+ private panel hospitals nationwide',
      'Covers annual medical screening at EMGS-approved clinics upon arrival in Malaysia',
      'Accidental death and permanent disablement coverage included automatically'
    ],
    inpatientCoverage: 'Inpatient room and board, surgery, ICU, and physician rounds up to RM 50,000 – RM 75,000 annual limit',
    outpatientCoverage: 'Outpatient clinic consultations covered via panel clinics or emergency accidental outpatient clinics',
    ambulanceAndEvac: 'Emergency ambulance transfer to panel hospital and international medical repatriation up to RM 20,000',
    prescriptionCover: 'Medicines dispensed during inpatient hospital care and emergency room treatment included',
    waitingPeriodNote: 'Pre-existing conditions not covered for the first 12 months; acute new emergency sickness covered immediately.',
    summary: 'Every international student studying in Malaysia is insured through the official EMGS insurance framework with underwriters like Great Eastern and AIA, ensuring seamless cashless admissions across top Malaysian hospitals.'
  }
];

export const HealthInsuranceView: React.FC<HealthInsuranceViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<string>('australia');
  const [calculatorCountry, setCalculatorCountry] = useState<string>('australia');
  const [calculatorType, setCalculatorType] = useState<'single' | 'couple' | 'family'>('single');
  const [calculatorDuration, setCalculatorDuration] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quote Request Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    destination: 'Australia',
    courseDuration: '1 Year',
    coverType: 'Single Student',
    universityName: '',
    targetStartDate: ''
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Current active scheme
  const currentScheme = SCHEMES.find((s) => s.id === activeTab) || SCHEMES[0];

  // Dynamic estimate calculator logic
  const calculateEstimate = () => {
    let baseAnnual = 600;
    let currencySymbol = '$';
    let currencyCode = 'AUD';

    if (calculatorCountry === 'australia') {
      baseAnnual = 620;
      currencySymbol = '$';
      currencyCode = 'AUD';
    } else if (calculatorCountry === 'uk') {
      baseAnnual = 776;
      currencySymbol = '£';
      currencyCode = 'GBP';
    } else if (calculatorCountry === 'canada') {
      baseAnnual = 820;
      currencySymbol = '$';
      currencyCode = 'CAD';
    } else if (calculatorCountry === 'usa') {
      baseAnnual = 1100;
      currencySymbol = '$';
      currencyCode = 'USD';
    } else if (calculatorCountry === 'schengen') {
      baseAnnual = 1560; // 130 * 12
      currencySymbol = '€';
      currencyCode = 'EUR';
    } else if (calculatorCountry === 'malaysia') {
      baseAnnual = 680;
      currencySymbol = 'RM ';
      currencyCode = 'MYR';
    }

    let multiplier = 1;
    if (calculatorType === 'couple') multiplier = 3.2; // OSHC dual rate factor
    if (calculatorType === 'family') multiplier = 5.8; // OSHC family rate factor

    const totalEstimate = Math.round(baseAnnual * multiplier * calculatorDuration);

    return {
      formatted: `${currencySymbol}${totalEstimate.toLocaleString()} ${currencyCode}`,
      perYearFormatted: `${currencySymbol}${Math.round(baseAnnual * multiplier).toLocaleString()} ${currencyCode} / yr`,
      currencyCode
    };
  };

  const calculatedResult = calculateEstimate();

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setIsQuoteModalOpen(false);
      setQuoteFormData({
        fullName: '',
        email: '',
        phone: '',
        destination: 'Australia',
        courseDuration: '1 Year',
        coverType: 'Single Student',
        universityName: '',
        targetStartDate: ''
      });
    }, 2800);
  };

  const faqs = [
    {
      q: 'Is health insurance compulsory before lodging my student visa application?',
      a: 'Yes, in the vast majority of destination countries! For Australia (Subclass 500), having approved OSHC for your entire visa validity is mandatory under Visa Condition 8501 before the department can grant your visa. In the UK, the Immigration Health Surcharge (IHS) must be paid during the online visa submission. In Germany, university enrollment and visa issuance both require official proof of statutory health insurance (TK/Barmer).'
    },
    {
      q: 'Can I get a 100% full refund if my student visa is refused or delayed?',
      a: 'Yes, absolutely! GEES partners exclusively with authorized government-approved insurers who provide a 100% full refund guarantee. If your student visa is refused or if you decide not to travel, simply provide the official embassy refusal letter or proof of enrollment cancellation, and your entire policy premium is refunded back to your account without cancellation penalties.'
    },
    {
      q: 'What is the difference between Single, Dual, and Family student health cover?',
      a: 'Single cover protects only the primary international student. Dual/Couple cover protects the primary student plus their legal spouse or de facto partner residing together abroad. Multi-Family cover protects the primary student, their spouse, and all dependent children under 18 years old. For Australia and UK visas, all accompanying family dependents must be covered under compliant family health policies.'
    },
    {
      q: 'How does cashless hospital admission work when I need medical care abroad?',
      a: 'When visiting a partner network hospital (e.g. Medibank or Bupa panel hospitals in Australia, NHS hospitals in the UK, or EMGS panel centers in Malaysia), you present your digital insurance membership card and passport. The hospital directly bills the insurance underwriter via a Guarantee of Letter (GL). You pay zero upfront costs for covered hospital admissions.'
    },
    {
      q: 'Are pre-existing medical conditions and routine dental or optical covered?',
      a: 'Standard student health schemes cover emergency care, doctor visits, hospitalizations, diagnostics, and mental health. However, pre-existing illnesses often carry a 6 to 12-month waiting period before non-emergency treatment can be claimed. Routine dental and optical care are generally excluded from basic visa health policies, but optional affordable "Extras" add-ons can be bundled if desired.'
    },
    {
      q: 'How quickly can GEES issue my official insurance certificate for visa lodgement?',
      a: 'GEES provides instant policy arrangement. Once your personal details and target course dates are verified, policy certificates for Australia OSHC, UK IHS, Canada guard.me, and German TK health confirmations are generated within 2 to 24 hours and delivered directly to your student portal for visa lodging.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Header Breadcrumbs & Section Title */}
      <section className="bg-white dark:bg-[#0B1329] border-b border-slate-200/80 dark:border-slate-800/80 pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
            <button
              onClick={() => onBackToHome ? onBackToHome() : onNavigate?.('home')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate?.('services')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
            >
              Services
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">Health Insurance & Medical Cover</span>
          </nav>

          {/* Hero Banner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-tight shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>100% Embassy & University Visa Compliant</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.1] font-display">
                International Student Health Insurance & Medical Cover
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Compare approved medical insurance schemes for Australia (OSHC), the UK (IHS), Canada (UHIP / guard.me), the USA, and Schengen Europe. Get instant policy certificates for visa submission with 100% refund guarantee.
              </p>

              {/* Action Buttons with 44px touch targets */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <InteractiveHoverButton
                  type="button"
                  text="Get Insurance Quote"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="min-h-[44px] px-7 py-3 rounded-full bg-[#fbb034] text-slate-950 font-bold text-sm shadow-md hover:bg-amber-400 cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => onOpenConsultation ? onOpenConsultation() : onNavigate?.('contact')}
                  className="min-h-[44px] px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">medical_services</span>
                  <span>Speak with Advisor</span>
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">18,500+</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Policies Issued</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Visa Acceptance</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">&lt; 24h</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Policy Certificate</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#fbb034]">$0 Extra</div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">GEES Advisory Fee</div>
                </div>
              </div>
            </div>

            {/* Right Graphic / Photo Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80"
                  alt="Doctor consulting international student"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

                {/* Overlaid Floating Verification Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 dark:border-slate-700 shadow-md flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Direct Underwriter Issuance</span>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-5 z-20 text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                      Zero Out-Of-Pocket Stress
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight">
                    Comprehensive Health & Emergency Coverage Worldwide
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Direct billing at thousands of accredited panel clinics, public hospitals, and universities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Destination Country Schemes Comparison Tabs */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-950 dark:text-white">
            Compare Mandatory Country Schemes
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Select your study destination to view official health requirements, approved underwriters, and coverage scope.
          </p>

          {/* Country Tabs Row */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pt-6 pb-2 px-1">
            {SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setActiveTab(scheme.id)}
                type="button"
                className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer select-none active:scale-95 ${
                  activeTab === scheme.id
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md ring-2 ring-slate-900 dark:ring-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <span className="text-base">{scheme.flag}</span>
                <span>{scheme.country}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Country Deep-Dive Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-3xl">{currentScheme.flag}</span>
                <span className="text-xs uppercase tracking-widest font-black text-amber-500 dark:text-amber-400">
                  {currentScheme.schemeTag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                  {currentScheme.visaRuleName}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentScheme.schemeName}
              </h3>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/80 text-left md:text-right shrink-0">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Estimated Premium</span>
              <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white block">{currentScheme.estimatedAnnualCost}</span>
            </div>
          </div>

          <p className="py-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentScheme.summary}
          </p>

          {/* 4 Pillars Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                <h4 className="text-xs font-black uppercase tracking-wider">Inpatient & Hospital</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentScheme.inpatientCoverage}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <span className="material-symbols-outlined text-[20px]">stethoscope</span>
                <h4 className="text-xs font-black uppercase tracking-wider">Doctor & Outpatient</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentScheme.outpatientCoverage}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                <span className="material-symbols-outlined text-[20px]">emergency</span>
                <h4 className="text-xs font-black uppercase tracking-wider">Ambulance & Evac</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentScheme.ambulanceAndEvac}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                <span className="material-symbols-outlined text-[20px]">medication</span>
                <h4 className="text-xs font-black uppercase tracking-wider">Prescriptions</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentScheme.prescriptionCover}
              </p>
            </div>
          </div>

          {/* Approved Providers Pill Grid */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Accredited Underwriter Providers:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentScheme.officialProviders.map((provider) => (
                  <span
                    key={provider}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px] text-emerald-500">verified</span>
                    <span>{provider}</span>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setQuoteFormData((prev) => ({ ...prev, destination: currentScheme.country }));
                setIsQuoteModalOpen(true);
              }}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 shrink-0 self-start sm:self-center"
            >
              Get {currentScheme.country} Policy Quote
            </button>
          </div>
        </div>
      </section>

      {/* 3. Interactive Health Insurance Cost & Visa Duration Calculator */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-[#0B1329] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#fbb034] block mb-1">
              Interactive Tool
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-950 dark:text-white">
              Health Insurance Cost & Visa Duration Calculator
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Estimate your mandatory health premium based on your destination country, accompanying family members, and duration of study.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Destination */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  1. Study Destination
                </label>
                <select
                  value={calculatorCountry}
                  onChange={(e) => setCalculatorCountry(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                >
                  <option value="australia">🇦🇺 Australia (OSHC)</option>
                  <option value="uk">🇬🇧 United Kingdom (IHS NHS)</option>
                  <option value="canada">🇨🇦 Canada (UHIP / BC MSP)</option>
                  <option value="usa">🇺🇸 United States (ISO / Waiver)</option>
                  <option value="schengen">🇩🇪 Germany & Europe (TK / Schengen)</option>
                  <option value="malaysia">🇲🇾 Malaysia (EMGS Medical)</option>
                </select>
              </div>

              {/* Option 2: Cover Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  2. Cover Status
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setCalculatorType('single')}
                    className={`min-h-[40px] py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      calculatorType === 'single'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Single
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalculatorType('couple')}
                    className={`min-h-[40px] py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      calculatorType === 'couple'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Couple
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalculatorType('family')}
                    className={`min-h-[40px] py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      calculatorType === 'family'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Family
                  </button>
                </div>
              </div>

              {/* Option 3: Course Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  3. Program Duration
                </label>
                <select
                  value={calculatorDuration}
                  onChange={(e) => setCalculatorDuration(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                >
                  <option value={0.5}>6 Months (Foundation / Pathway)</option>
                  <option value={1}>1 Year (Master's / Postgrad)</option>
                  <option value={2}>2 Years (Master's / Associate)</option>
                  <option value={3}>3 Years (Bachelor's Degree)</option>
                  <option value={4}>4 Years (Undergraduate Honours / PhD)</option>
                </select>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Estimated Total Health Cover Premium
                </span>
                <div className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white font-sans tracking-tight">
                  {calculatedResult.formatted}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Calculated at approximately {calculatedResult.perYearFormatted}. Policy certificates issued in official embassy-lodgement format.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setQuoteFormData((prev) => ({
                      ...prev,
                      courseDuration: `${calculatorDuration} Year(s)`,
                      coverType: calculatorType === 'single' ? 'Single Student' : (calculatorType === 'couple' ? 'Couple / Spouse' : 'Family')
                    }));
                    setIsQuoteModalOpen(true);
                  }}
                  className="min-h-[44px] w-full sm:w-auto px-6 py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer active:scale-95 text-center"
                >
                  Lock In Exact Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What Is Covered vs. Excluded Comparison Matrix */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-950 dark:text-white">
            What's Covered vs. Exclusions
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Clear, transparent overview of your medical entitlements so you never face surprise hospital bills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Covered Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 pb-2 border-b border-emerald-100 dark:border-emerald-950">
              <span className="material-symbols-outlined text-[24px]">check_circle</span>
              <h3 className="text-lg font-bold">What Is Typically Covered</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Inpatient Hospital Stay:</strong> 100% room charges, operating theater, intensive care, and surgeon fees.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>General Practitioner (GP) Visits:</strong> Standard doctor clinic appointments for sudden illnesses, infections, or flu.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Emergency Ambulance:</strong> Road paramedic emergency transport to the nearest hospital facility.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Pathology & Diagnostic Radiology:</strong> Blood tests, X-rays, Ultrasounds, and CT scans ordered by a doctor.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Medical Repatriation:</strong> Repatriation back to home country in the event of serious terminal medical emergency.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Prescription Medicine Benefits:</strong> Subsidized pharmaceutical drugs up to government or policy item caps.</span>
              </li>
            </ul>
          </div>

          {/* Excluded Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-[24px]">cancel</span>
              <h3 className="text-lg font-bold">Common Exclusions & Waiting Periods</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span><strong>Routine Dental & Optical:</strong> Tooth fillings, braces, dental checkups, and eyeglasses require optional "Extras" add-ons.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span><strong>Pre-Existing Conditions (Waiting Period):</strong> Conditions diagnosed prior to travel carry a 12-month waiting period in Australia OSHC.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span><strong>Elective Cosmetic Surgery:</strong> Non-essential cosmetic procedures and elective aesthetic treatments.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span><strong>Assisted Reproductive Services:</strong> In-vitro fertilization (IVF) and elective reproductive therapies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                <span><strong>Over-The-Counter Medications:</strong> Non-prescription pharmacy vitamins, painkillers, and cosmetic remedies.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. 6-Step Insurance Procurement & Visa Lodgement Workflow */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0B1329] border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-950 dark:text-white">
              6-Step Health Cover & Visa Lifecycle
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              How GEES manages your medical insurance from policy selection to cashless medical treatment abroad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: 'verified_user',
                title: 'Visa Rule & Country Audit',
                desc: 'We review your target country, course dates, and visa conditions (e.g. Condition 8501, UK IHS, BC MSP) to ensure policy dates match university requirements.'
              },
              {
                step: '02',
                icon: 'price_check',
                title: 'Multi-Provider Rate Compare',
                desc: 'Compare official quotes across Medibank, Allianz, Bupa, nib, ISO, and guard.me to secure the most affordable compliant policy with maximum benefits.'
              },
              {
                step: '03',
                icon: 'contact_page',
                title: 'Instant Policy Certificate',
                desc: 'Upon confirmation, your official insurance policy certificate is issued within 24 hours in the exact format required for your Confirmation of Enrolment (CoE) and visa lodge.'
              },
              {
                step: '04',
                icon: 'assignment_turned_in',
                title: 'Embassy Lodgement Verification',
                desc: 'Our visa advisors attach policy certificates to your formal visa application file, eliminating refusal risks stemming from healthcare compliance discrepancies.'
              },
              {
                step: '05',
                icon: 'phone_iphone',
                title: 'Digital Card & Panel Clinics App',
                desc: 'Download your insurer’s mobile app to access your digital membership card, find nearby English-speaking panel doctors, and locate 24/7 urgent care centers.'
              },
              {
                step: '06',
                icon: 'support_agent',
                title: '24/7 Claims & Medical Assistance',
                desc: 'GEES provides ongoing student support during your studies. We assist with hospital Guarantee Letters (GL) and fast-track digital expense reimbursement.'
              }
            ].map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[#fbb034] text-slate-950 font-black text-sm flex items-center justify-center">
                    {s.step}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-2xl">{s.icon}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Refund Guarantee Callout Banner */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-6 sm:p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-800/40">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>100% Risk-Free Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Full Policy Refund in Case of Visa Refusal
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              If your student visa is not granted or your study plans change prior to departing, our policy guarantee ensures 100% of your insurance payment is returned to you.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsQuoteModalOpen(true)}
            className="min-h-[44px] px-7 py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shrink-0 cursor-pointer active:scale-95"
          >
            Request Instant Quote
          </button>
        </div>
      </section>

      {/* 7. Interactive Frequently Asked Questions */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-950 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Answers to common questions regarding student healthcare coverage, waiting periods, and claims.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 min-h-[52px] flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className={`material-symbols-outlined text-xl text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-amber-500' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Instant Quote Request Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close button with 44px hit target */}
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {quoteSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Quote Request Received!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  Our health insurance desk is preparing your tailored policy quote and will email your comparison within 4 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                    Zero Obligation • Fast 24h Certificate
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Request Health Insurance Quote
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Get comparative rates across authorized underwriters tailored to your study permit dates.
                  </p>
                </div>

                <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name (as on Passport) *
                    </label>
                    <input
                      type="text"
                      required
                      value={quoteFormData.fullName}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, fullName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#fbb034]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={quoteFormData.email}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#fbb034]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={quoteFormData.phone}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                        placeholder="+61 400 000 000"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#fbb034]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Study Destination *
                      </label>
                      <select
                        value={quoteFormData.destination}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, destination: e.target.value })}
                        className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                      >
                        <option value="Australia">Australia (OSHC)</option>
                        <option value="United Kingdom">United Kingdom (IHS)</option>
                        <option value="Canada">Canada (UHIP / guard.me)</option>
                        <option value="United States">United States (F-1 / ISO)</option>
                        <option value="Germany / Schengen">Germany & Europe (TK)</option>
                        <option value="Malaysia">Malaysia (EMGS)</option>
                        <option value="New Zealand">New Zealand</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Cover Type *
                      </label>
                      <select
                        value={quoteFormData.coverType}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, coverType: e.target.value })}
                        className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                      >
                        <option value="Single Student">Single Student</option>
                        <option value="Couple / Spouse">Couple / Student + Spouse</option>
                        <option value="Family">Family / Multi-Dependent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Duration *
                      </label>
                      <select
                        value={quoteFormData.courseDuration}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, courseDuration: e.target.value })}
                        className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fbb034] cursor-pointer"
                      >
                        <option value="6 Months">6 Months</option>
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="3 Years">3 Years</option>
                        <option value="4 Years">4 Years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Target Course Start Date
                      </label>
                      <input
                        type="date"
                        value={quoteFormData.targetStartDate}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, targetStartDate: e.target.value })}
                        className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#fbb034]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] mt-4 py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>Send Me Quote Comparison</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
