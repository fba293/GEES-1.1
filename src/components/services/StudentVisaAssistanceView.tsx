/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Student Visa Assistance & Immigration Guidance View
 * Authentic GEES Visual Identity: #0B1329 Deep Navy, #fbb034 Gold, Royal Blue
 * Compliant, honest, source-grounded visa guidance for Bangladeshi students
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface StudentVisaAssistanceViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (serviceName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

interface DestinationVisaProfile {
  id: string;
  country: string;
  flag: string;
  visaSubclass: string;
  governingAuthority: string;
  authorityUrl: string;
  estimatedProcessing: string;
  indicativeGovFee: string;
  financialRuleSummary: string;
  keyDocumentRequirements: string[];
  bangladeshSpecificNotes: string;
  dependentEligibility: string;
  workRightsSummary: string;
  officialReviewDate: string;
}

const DESTINATION_PROFILES: DestinationVisaProfile[] = [
  {
    id: 'malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    visaSubclass: 'Student Pass & Single Entry Visa (eVAL / SEV)',
    governingAuthority: 'Education Malaysia Global Services (EMGS) & Immigration Department of Malaysia (JIM)',
    authorityUrl: 'https://visa.educationmalaysia.gov.my/',
    estimatedProcessing: '14 - 30 working days for eVAL issuance',
    indicativeGovFee: 'MYR 1,060 - MYR 2,500 (EMGS processing + health screening + student pass vary by institution)',
    financialRuleSummary: 'Financial capability demonstrated during university application; sponsor solvency evidence requested by selected institutions.',
    keyDocumentRequirements: [
      'Valid passport (minimum 18 months validity remaining)',
      'Academic certificates & marksheets verified and notarized',
      'Passport-size white background photos (EMGS spec 35mm x 45mm)',
      'Pre-arrival Health Declaration Form & medical screening',
      'Electronic Visa Approval Letter (eVAL) upon approval',
      'Single Entry Visa (SEV) via Malaysian eVISA portal or High Commission Dhaka'
    ],
    bangladeshSpecificNotes: 'Bangladeshi students must obtain eVAL online first, then apply for Single Entry Visa (SEV) before traveling to Kuala Lumpur. Post-arrival medical screening must be completed within 7 days in Malaysia.',
    dependentEligibility: 'Allowed for Master’s (by research) and PhD students; not generally permitted for undergraduate degree levels.',
    workRightsSummary: 'Permitted to work up to 20 hours/week during semester breaks and holidays over 7 days in approved hospitality/retail sectors.',
    officialReviewDate: 'October 2026'
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaSubclass: 'Student Visa (Points-Based Immigration System)',
    governingAuthority: 'UK Visas and Immigration (UKVI) & Home Office',
    authorityUrl: 'https://www.gov.uk/student-visa',
    estimatedProcessing: 'Standard: 3 - 4 weeks from biometrics (Priority: ~5 working days where available)',
    indicativeGovFee: '£490 visa fee + £776/year Immigration Health Surcharge (IHS)',
    financialRuleSummary: 'Strict 28-day holding rule: 1st-year tuition balance + £1,334/month (inside London) or £1,023/month (outside London) for 9 months.',
    keyDocumentRequirements: [
      'Confirmation of Acceptance for Studies (CAS) from a UK licensed sponsor',
      'Bank statement held consecutively for at least 28 days (closing balance within 31 days of application)',
      'Tuberculosis (TB) test certificate from IOM-approved migration health center in Dhaka/Sylhet',
      'Academic transcripts, degree certificates, and English test scores listed on CAS',
      'ATAS certificate (if studying sensitive postgraduate science/engineering disciplines)',
      'Affidavit of financial sponsorship and relationship proof if using parental funds'
    ],
    bangladeshSpecificNotes: 'UKVI conducts random credibility interviews via video link. Students must be prepared to articulate reasons for choosing the university, course syllabus details, career plans in Bangladesh, and financial origins.',
    dependentEligibility: 'Restricted: Dependents only permitted for postgraduate research programmes (PhD or research master’s) or government-sponsored courses.',
    workRightsSummary: 'Up to 20 hours/week during term time for degree-level studies; full-time during official vacation periods.',
    officialReviewDate: 'October 2026'
  },
  {
    id: 'australia',
    country: 'Australia',
    flag: '🇦🇺',
    visaSubclass: 'Student Visa (Subclass 500)',
    governingAuthority: 'Department of Home Affairs (DHA), Commonwealth of Australia',
    authorityUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
    estimatedProcessing: 'Higher Education Sector: typically 4 - 8 weeks',
    indicativeGovFee: 'AUD $1,600 main applicant fee (subject to official annual review)',
    financialRuleSummary: 'Evidence of AUD $29,710/year living costs + 1st year tuition fee + AUD $2,000 return travel allowance.',
    keyDocumentRequirements: [
      'Confirmation of Enrolment (eCoE) from CRICOS-registered Australian institution',
      'Genuine Student (GS) assessment responses detailing career strategy and course relevance',
      'Overseas Student Health Cover (OSHC) policy active for the full visa duration',
      'Sufficient liquid funds in bank or sanctioned education bank loan letter',
      'English proficiency result (IELTS Academic, PTE Academic, or approved equivalent)',
      'Police Clearance Certificate from Bangladesh Police and biometric enrolment at VFS Global'
    ],
    bangladeshSpecificNotes: 'DHA places heavy emphasis on the Genuine Student (GS) criteria. Applications must demonstrate realistic career ROI in Bangladesh and cohesive progression from past academic background.',
    dependentEligibility: 'Spouses and dependent children can accompany as secondary visa holders subject to verified family ties and maintenance funds.',
    workRightsSummary: 'Capped at 48 hours per fortnight during study terms; unrestricted work hours during scheduled course vacations.',
    officialReviewDate: 'October 2026'
  },
  {
    id: 'new-zealand',
    country: 'New Zealand',
    flag: '🇳🇿',
    visaSubclass: 'Fee Paying Student Visa',
    governingAuthority: 'Immigration New Zealand (INZ)',
    authorityUrl: 'https://www.immigration.govt.nz/new-zealand-visas/visas/visa/fee-paying-student-visa',
    estimatedProcessing: '6 - 10 weeks from submission',
    indicativeGovFee: 'NZD $750 (varies based on application location & levy adjustments)',
    financialRuleSummary: 'NZD $20,000/year living maintenance + 1st-year paid tuition or Approval in Principle (AIP) route.',
    keyDocumentRequirements: [
      'Unconditional offer of place from NZQA-accredited education provider',
      'Evidence of tuition payment or AIP (Approval in Principle) document',
      'Maintenance funds of NZD $20,000 per year (bank balance & source tracing)',
      'General Medical Certificate & Chest X-ray from panel clinic in Bangladesh',
      'Police clearance certificate for applicants aged 17 and above',
      'Comprehensive travel and medical insurance policy compliant with NZ code'
    ],
    bangladeshSpecificNotes: 'Bangladeshi applicants often utilize the AIP (Approval in Principle) procedure where tuition fees are transferred only after INZ officer approves the visa file in principle.',
    dependentEligibility: 'Permitted for students pursuing eligible Level 9 (Master’s) or Level 10 (PhD) qualifications on Green List pathways.',
    workRightsSummary: 'Up to 20 hours/week during term time for degree courses; full-time during scheduled vacation periods.',
    officialReviewDate: 'October 2026'
  },
  {
    id: 'europe',
    country: 'Europe (Finland, Belgium, Greece, Cyprus, Netherlands)',
    flag: '🇪🇺',
    visaSubclass: 'National D Visa & Student Residence Permit',
    governingAuthority: 'Respective National Consular Missions & EU Migration Directorates',
    authorityUrl: 'https://home-affairs.ec.europa.eu/policies/schengen-borders-visa/visa-policy_en',
    estimatedProcessing: '6 - 12 weeks (depends on national embassy & biometrics appointments)',
    indicativeGovFee: '€80 - €350 depending on country (residence permit vs entry D-visa)',
    financialRuleSummary: 'Country-specific: Finland requires €6,720/year; Germany/Netherlands require €11,000+; Cyprus requires bank solvency letters.',
    keyDocumentRequirements: [
      'Official letter of acceptance from accredited European university',
      'Proof of tuition fee payment receipt / scholarship grant letter',
      'Bank solvency certificate or blocked account confirmation where mandated',
      'Apostilled / Ministry-attested educational certificates and transcripts from Dhaka',
      'International Schengen-compliant medical and health insurance coverage',
      'VFS / Embassy biometric appointment confirmation and interview submission'
    ],
    bangladeshSpecificNotes: 'Certain European embassies (e.g. Finland, Belgium) handle biometrics via regional hubs or VFS Global Dhaka/New Delhi. Book consular interview slots well ahead of semester start.',
    dependentEligibility: 'Generally permitted for postgraduate and doctorate level students; requires evidence of adequate family housing and income.',
    workRightsSummary: 'Varies by destination: Finland allows 30 hours/week; Netherlands allows 16 hours/week; Belgium allows up to 20 hours/week.',
    officialReviewDate: 'October 2026'
  },
  {
    id: 'india',
    country: 'India',
    flag: '🇮🇳',
    visaSubclass: 'Student Visa (Regular & S-Visa)',
    governingAuthority: 'High Commission of India, Dhaka / Indian Visa Application Centre (IVAC)',
    authorityUrl: 'https://www.ivacbd.com/',
    estimatedProcessing: '7 - 14 working days',
    indicativeGovFee: 'BDT 800 - BDT 2,500 IVAC processing and service charge',
    financialRuleSummary: 'Bonafide admission letter with fee structure; bank solvency letter showing sufficient family funds to cover course costs.',
    keyDocumentRequirements: [
      'Confirmed Bonafide Admission Letter from AICTE/UGC recognized Indian university',
      'Online visa application printout signed by applicant',
      'Passports with minimum 6 months validity & Bangladeshi NID/Birth Certificate',
      'Bank statement of student or parent with minimum solvency balance',
      'Utility bill copy (electricity/gas) as proof of residential address in Bangladesh',
      'No Objection Certificate (NOC) / Bonafide from previous institution if applicable'
    ],
    bangladeshSpecificNotes: 'Application submitted directly through IVAC centers across Bangladesh (Dhaka, Chattogram, Sylhet, Rajshahi, Khulna). Direct cross-border road and flight connectivity available.',
    dependentEligibility: 'Restricted; primary visa holder only unless special category applies.',
    workRightsSummary: 'International students in India on student visas are not legally permitted to engage in off-campus employment.',
    officialReviewDate: 'October 2026'
  }
];

export const StudentVisaAssistanceView: React.FC<StudentVisaAssistanceViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  const [activeCountryId, setActiveCountryId] = useState<string>('malaysia');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const selectedProfile = DESTINATION_PROFILES.find((p) => p.id === activeCountryId) || DESTINATION_PROFILES[0];

  const handleLaunchConsultation = (topic?: string) => {
    if (onOpenConsultation) {
      onOpenConsultation(topic || `Student Visa Assistance - ${selectedProfile.country}`);
    }
  };

  const openWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hello GEES Education Advisors! I am inquiring about student visa guidance for ${selectedProfile.country}.\n\n` +
      `Target Country: ${selectedProfile.country}\n` +
      `Visa Category: ${selectedProfile.visaSubclass}\n` +
      `I would like to understand document preparation and financial requirements for my profile.`
    );
    window.open(`https://wa.me/8801805529578?text=${text}`, '_blank');
  };

  return (
    <div className="w-full bg-white dark:bg-[#0B1329] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* 1. TOP BREADCRUMB STRIP */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <button
              onClick={onBackToHome}
              className="hover:text-blue-600 dark:hover:text-[#fbb034] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate?.('services')}
              className="hover:text-blue-600 dark:hover:text-[#fbb034] transition-colors cursor-pointer"
            >
              Services
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold truncate">
              Student Visa Assistance
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate?.('track-visa')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-blue-600">travel_explore</span>
              <span>Track Visa Status</span>
            </button>
            <button
              onClick={() => handleLaunchConsultation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fbb034] hover:bg-amber-400 text-slate-950 rounded-full font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px]">headset_mic</span>
              <span>Visa Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1329] via-[#0b132b] to-[#0B1329] text-white py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,176,52,0.12),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
                <span className="material-symbols-outlined text-[18px] text-[#fbb034]">verified_user</span>
                <span>Certified Education Counseling &amp; Visa File Compliance</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Student Visa Assistance &amp; <span className="text-[#fbb034]">Immigration Guidance</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Navigating international immigration requirements demands precision, verifiable documentation, and transparent legal awareness. GEES assists prospective Bangladeshi students through comprehensive document auditing, financial solvency structuring, and embassy interview coaching.
              </p>

              {/* Verified Value Proposition Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-left">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-[#fbb034]">100% Free</div>
                  <div className="text-[11px] text-slate-300 font-medium">No Consultancy Fees</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-white">6+ Countries</div>
                  <div className="text-[11px] text-slate-300 font-medium">Direct Partner Campuses</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-blue-400">1-on-1</div>
                  <div className="text-[11px] text-slate-300 font-medium">Mock Interview Prep</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">Official</div>
                  <div className="text-[11px] text-slate-300 font-medium">Government Sources</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => handleLaunchConsultation()}
                  className="min-h-[48px] w-full sm:w-auto px-7 py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>Book Free Visa Guidance Session</span>
                </button>
                <button
                  onClick={openWhatsAppEnquiry}
                  className="min-h-[48px] w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-400">chat</span>
                  <span>Enquire via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right Card: Critical Legal Distinction Box */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-[#fbb034] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">gavel</span>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-sm">Essential Legal Distinction</h2>
                    <p className="text-xs text-slate-400">Education Admission vs Immigration Permission</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[#fbb034] font-bold block uppercase tracking-wider text-[10px]">
                      1. University Offer Letter
                    </span>
                    <p>
                      Issued by the academic institution confirming admission eligibility based on your past scholastic records, grades, and language proficiency.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-blue-400 font-bold block uppercase tracking-wider text-[10px]">
                      2. Sovereign Immigration Permission
                    </span>
                    <p>
                      Issued solely by sovereign governments (e.g. UKVI, Australian DHA, Malaysian Immigration JIM/EMGS). Sovereign officers evaluate genuine intent, financial solvency, and security clearances.
                    </p>
                  </div>
                </div>

                {/* Statutory Disclaimer */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-[#fbb034] shrink-0 mt-0.5">info</span>
                  <span>
                    <strong>Disclaimer:</strong> University admission does not guarantee visa issuance. GEES does not issue visas, guarantee approvals, or influence consular decisions.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRACK VISA DIRECT SHORTCUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-700/50 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">travel_explore</span>
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Applying for Malaysia Higher Education?</h3>
              <p className="text-xs text-blue-200">
                Track your real-time EMGS eVAL approval progress through our integrated Malaysian visa tracker.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('track-visa')}
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-white hover:bg-blue-50 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>Open EMGS Visa Tracker</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* 4. DESTINATION-SPECIFIC VISA PATHWAYS MATCHER */}
      <section id="pathways" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#fbb034] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Verified Country Pathways
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Country-Specific Student Visa Guidelines
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Select your target study destination to view official governing bodies, financial proof rules, indicative government charges, and Bangladesh-specific considerations.
          </p>
        </div>

        {/* Destination Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {DESTINATION_PROFILES.map((dest) => {
            const isActive = activeCountryId === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => setActiveCountryId(dest.id)}
                className={`min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#0B1329] dark:bg-white text-white dark:text-slate-950 shadow-md ring-2 ring-[#fbb034]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-base">{dest.flag}</span>
                <span>{dest.country}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Destination Card */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg space-y-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{selectedProfile.flag}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#fbb034]">
                  {selectedProfile.country}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {selectedProfile.visaSubclass}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <a
                href={selectedProfile.authorityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] transition-colors"
                title="Open Official Immigration Portal"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span>Official Government Portal</span>
              </a>
              <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                Reviewed: {selectedProfile.officialReviewDate}
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Governing Authority
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {selectedProfile.governingAuthority}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Typical Processing Timeline
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {selectedProfile.estimatedProcessing}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Indicative Official Fee
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {selectedProfile.indicativeGovFee}
              </p>
            </div>
          </div>

          {/* Financial Requirement Highlight */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-slate-900 dark:text-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#fbb034]">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              <span>Financial Proof &amp; Maintenance Requirement</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {selectedProfile.financialRuleSummary}
            </p>
          </div>

          {/* Document Checklist & Bangladesh Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mandatory Documentation Checklist
              </h4>
              <div className="space-y-2">
                {selectedProfile.keyDocumentRequirements.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200"
                  >
                    <span className="material-symbols-outlined text-[#fbb034] text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 space-y-2 text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-blue-700 dark:text-blue-300">
                  <span className="material-symbols-outlined text-base">flag</span>
                  <span>Bangladesh Applicant Notes</span>
                </div>
                <p className="leading-relaxed">
                  {selectedProfile.bangladeshSpecificNotes}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-white block">Family Dependents:</strong>
                  <span className="text-slate-600 dark:text-slate-400">{selectedProfile.dependentEligibility}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white block">Part-Time Work Rights:</strong>
                  <span className="text-slate-600 dark:text-slate-400">{selectedProfile.workRightsSummary}</span>
                </div>
              </div>

              <button
                onClick={() => handleLaunchConsultation(`Checklist Audit for ${selectedProfile.country}`)}
                className="w-full min-h-[44px] py-3 rounded-xl bg-[#0B1329] dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">checklist</span>
                <span>Get Detailed Checklist for {selectedProfile.country}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 6-STEP STRUCTURED VISA PROCESS */}
      <section className="py-12 sm:py-20 bg-slate-50 dark:bg-[#0B1329] border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fbb034] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Transparent Methodology
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              The 6-Step Visa Assistance Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              From university acceptance through to biometric lodgement and pre-departure briefings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'University Offer & Admission Clearance',
                desc: 'Confirming your unconditional offer letter, paying mandatory tuition deposits, and satisfying institutional academic conditions.',
                icon: 'school'
              },
              {
                step: '02',
                title: 'Financial Solvency Dossier Audit',
                desc: 'Structuring bank solvency certificates, confirming mandatory holding durations (e.g. UKVI 28-day rule), and auditing sponsorship affidavits.',
                icon: 'account_balance'
              },
              {
                step: '03',
                title: 'Official Visa Document Issuance',
                desc: 'Procuring CAS (UK), eCoE (Australia), eVAL (Malaysia), or AIP documents directly through official university liaisons.',
                icon: 'verified'
              },
              {
                step: '04',
                title: 'Medical Clearance & Police Certificate',
                desc: 'Guiding approved clinic TB screenings (IOM Dhaka/Sylhet), pre-departure medical certificates, and official Bangladesh police clearances.',
                icon: 'health_and_safety'
              },
              {
                step: '05',
                title: 'Online Lodgement & Consular Mock Interview',
                desc: 'Accurately completing government portal applications (DS-160/UKVI/ImmiAccount/IVAC) and conducting simulated 1-on-1 consular interviews.',
                icon: 'record_voice_over'
              },
              {
                step: '06',
                title: 'Decision Notification & Departure Orientation',
                desc: 'Verifying visa vignette stamps, reviewing work conditions, arranging flight tickets, forex cards, and pre-departure accommodation.',
                icon: 'flight_takeoff'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-800">{item.step}</span>
                  <span className="material-symbols-outlined text-[#fbb034] text-[26px]">{item.icon}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHAT GEES ADVISORS HELP PREPARE */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fbb034] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Our Professional Support
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              What GEES Advisors Help You Prepare
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Visa applications succeed on truthful, meticulously structured documentation. Our counselors review each dossier with rigorous attention to government guidelines.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                <span>Genuine Temporary Entrant (GTE) / Genuine Student (GS) drafting advice</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                <span>Bank solvency auditing &amp; tax returns (ITR) correlation</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                <span>Study gap justification letters with employment corroboration</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                <span>Embassy credibility mock interviews with sample questions</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleLaunchConsultation('Document Review')}
                className="min-h-[44px] px-6 py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">fact_check</span>
                <span>Request Document Review</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span>Standard Visa Document Package</span>
              <span className="text-xs text-slate-400 font-normal">Checklist Guide</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-slate-900 dark:text-white block font-semibold">1. Academic Dossier</strong>
                <p className="text-slate-600 dark:text-slate-400">SSC/HSC/Bachelor marksheets, certificates, board verifications, and English language scores.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-slate-900 dark:text-white block font-semibold">2. Financial Solvency</strong>
                <p className="text-slate-600 dark:text-slate-400">Bank statements, solvency certificate, sponsor deeds, source of funds, and income tax documents.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-slate-900 dark:text-white block font-semibold">3. University Acceptance</strong>
                <p className="text-slate-600 dark:text-slate-400">Official Unconditional Offer Letter, CAS Statement, eCoE document, or eVAL certificate.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <strong className="text-slate-900 dark:text-white block font-semibold">4. Identity &amp; Clearance</strong>
                <p className="text-slate-600 dark:text-slate-400">Passport, national ID/birth certificate, Bangladesh Police clearance, and IOM TB medical report.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
              Note: Never submit forged or unverified financial certificates. Consulates run direct audits with issuing financial institutions in Bangladesh, and fraudulent documentation leads to multi-year entry bans.
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-20 bg-slate-50 dark:bg-[#0B1329] border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fbb034] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Student Inquiries
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions on Student Visas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Common questions answered by GEES certified education counselors.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Does getting an offer letter from a university mean my visa is guaranteed?',
                a: 'No. Academic admission by a university and visa approval by sovereign immigration authorities are two completely separate decisions. Universities assess your academic eligibility, while immigration departments evaluate genuine intent, financial capability, and security clearance. GEES helps ensure your visa file is 100% compliant with immigration rules, but final approval rests solely with the sovereign government.'
              },
              {
                q: 'What should I do if I have an academic study gap?',
                a: 'Study gaps are acceptable if you provide legitimate, verifiable documentation of what you did during that period. Acceptable evidence includes professional work experience certificates, appointment letters, pay slips, internships, freelance portfolios, or English language test preparation records. GEES counselors assist in drafting professional gap explanation letters.'
              },
              {
                q: 'Can I reapply if I experienced a previous visa refusal through another agency?',
                a: 'Yes, provided the previous refusal did not involve fraudulent documentation. We review your official refusal letter, identify the specific grounds under immigration rules, address the deficiencies with fresh verifiable evidence, and draft a structured submission letter.'
              },
              {
                q: 'How long must my financial funds be held in the bank?',
                a: 'This depends strictly on your target country. The UK requires funds held consecutively for at least 28 days prior to application submission. Australia and New Zealand require evidence of fund origin, savings history, or sanctioned bank education loans. Malaysia evaluates university-endorsed financial capacity through EMGS.'
              },
              {
                q: 'Can my spouse or children join me on my student visa?',
                a: 'Dependent regulations depend heavily on the country and study level. For the UK, dependents are restricted to postgraduate research degrees (PhD/research master’s). For Australia and New Zealand, dependent spouses may apply under specific qualification levels. For Malaysia, master’s research and PhD students can apply for dependent passes.'
              }
            ].map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-[#fbb034] text-[20px] shrink-0">
                      {isOpen ? 'remove' : 'add'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL CONSULTATION CTA BANNER */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#0B1329] via-[#0b132b] to-[#0B1329] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,176,52,0.15),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1 bg-amber-500/15 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              100% Free Advice • Transparent Guidance
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Speak With a Senior GEES Visa Counselor Today
            </h2>
            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              Have questions regarding financial solvency proof, course eligibility, or country-specific visa procedures? Schedule a free 1-on-1 consultation at our Dhaka office or connect via WhatsApp.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleLaunchConsultation()}
                className="min-h-[48px] w-full sm:w-auto px-8 py-3.5 bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-xl transition-all cursor-pointer active:scale-95"
              >
                Book 1-on-1 Visa Consultation
              </button>
              <button
                onClick={openWhatsAppEnquiry}
                className="min-h-[48px] w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-400">chat</span>
                <span>WhatsApp: +880 1805 529578</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentVisaAssistanceView;
