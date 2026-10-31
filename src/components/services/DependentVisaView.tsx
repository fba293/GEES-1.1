/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Student Dependent Visa & Family Relocation Guidance View
 * Authentic GEES Visual Identity: #070b19 Deep Navy, #fbb034 Gold, Royal Blue
 * Evidence-based, policy-grounded guidance for families of international students
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface DependentVisaViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (serviceName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

interface DestinationDependentPolicy {
  id: string;
  country: string;
  flag: string;
  visaCategory: string;
  governingAuthority: string;
  authorityUrl: string;
  courseEligibilityTier: string;
  isEligibleForUndergrad: boolean;
  spouseWorkRights: string;
  childrenSchooling: string;
  financialRequirement: string;
  eligibleFamilyMembers: string[];
  keyDocumentRequirements: string[];
  practicalAdvisory: string;
  officialReviewDate: string;
  statusBadge: string;
}

const DESTINATION_POLICIES: DestinationDependentPolicy[] = [
  {
    id: 'malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    visaCategory: 'Dependent Pass & Long-Term Social Visit Pass',
    governingAuthority: 'Education Malaysia Global Services (EMGS) & Immigration Department of Malaysia (JIM)',
    authorityUrl: 'https://visa.educationmalaysia.gov.my/',
    courseEligibilityTier: 'Master’s (by Research or Coursework) & PhD / Doctoral students only',
    isEligibleForUndergrad: false,
    spouseWorkRights: 'Employment not permitted on standard Dependent Pass. Spouse must secure independent employment pass or formal JIM work endorsement.',
    childrenSchooling: 'Children can enroll in registered private or international schools in Malaysia upon securing student passes or endorsed dependent passes.',
    financialRequirement: 'Institutional financial guarantee letter and liquid sponsor bank solvency proof covering living expenses in Malaysia.',
    eligibleFamilyMembers: [
      'Legal spouse (civilly registered marriage)',
      'Unmarried dependent children under 21 years of age',
      'Parents of enrolled Master’s and PhD scholars (under university sponsorship & JIM guidelines)'
    ],
    keyDocumentRequirements: [
      'Original Marriage Certificate attested by Ministry of Foreign Affairs (MoFA) Dhaka',
      'Children’s original birth certificates with certified English translations',
      'Student’s valid Student Pass, eVAL, and university enrollment confirmation',
      'Passport copies of all applicants (minimum 18 months validity remaining)',
      'Proof of family residential accommodation in Malaysia'
    ],
    practicalAdvisory: 'Malaysia is one of the very few destinations that permits parents of postgraduate researchers to apply for long-term social visit passes. Undergraduate degree holders cannot sponsor dependents.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Postgraduate & Parents Eligible'
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaCategory: 'Student Dependent Visa (Partner & Children)',
    governingAuthority: 'UK Visas and Immigration (UKVI) & Home Office',
    authorityUrl: 'https://www.gov.uk/student-visa/family-members',
    courseEligibilityTier: 'Postgraduate research programmes only (PhD, doctoral qualifications, or research master’s) or government-sponsored courses',
    isEligibleForUndergrad: false,
    spouseWorkRights: 'Unrestricted full-time employment permitted (with standard exceptions: no professional sportsperson or doctor in training).',
    childrenSchooling: 'Free state-funded school education for dependent children aged 5 to 16 residing with student parent.',
    financialRequirement: '£845/month (outside London) or £1,015/month (inside London) per dependent held for 28 consecutive days, plus £776/yr IHS healthcare surcharge per person.',
    eligibleFamilyMembers: [
      'Legal husband, wife, or civil partner',
      'Unmarried partner living together in a relationship akin to marriage for 2+ years',
      'Dependent children under 18 at time of application'
    ],
    keyDocumentRequirements: [
      'Confirmation of Acceptance for Studies (CAS) confirming course is a postgraduate research program',
      'Official marriage certificate or continuous 2-year cohabitation documentation (joint leases, bills)',
      'Bank statement meeting strict 28-day holding rule for each family member',
      'Tuberculosis (TB) clearance certificate from IOM Dhaka/Sylhet for each family member',
      'Proof of suitable private accommodation arrangement in the UK'
    ],
    practicalAdvisory: 'Under UKVI rules enacted in January 2024, international students on 1-year taught master’s courses can NO LONGER bring dependents. Only PhD and research master’s programs qualify.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Research & PhD Only'
  },
  {
    id: 'australia',
    country: 'Australia',
    flag: '🇦🇺',
    visaCategory: 'Student Visa (Subclass 500) Secondary Applicant / Subsequent Entry',
    governingAuthority: 'Department of Home Affairs (DHA), Australian Government',
    authorityUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
    courseEligibilityTier: 'Available across higher education streams; work rights vary significantly by degree level',
    isEligibleForUndergrad: true,
    spouseWorkRights: 'Master’s (coursework/research) & PhD spouses enjoy full, unrestricted work rights once course commences. Bachelor’s student spouses are restricted to 48 hours/fortnight.',
    childrenSchooling: 'School-age dependents (5–18) must be enrolled in school. Public school tuition fees vary by state (some states waive fees for PhD students, while others charge standard fees).',
    financialRequirement: 'Additional AUD $10,394/year for spouse + AUD $4,449/year per child + return travel + Family Overseas Student Health Cover (OSHC).',
    eligibleFamilyMembers: [
      'Legally married spouse',
      'De facto partner (minimum 12 months continuous cohabitation or state relationship registration)',
      'Unmarried dependent children under 18 years of age'
    ],
    keyDocumentRequirements: [
      'Marriage certificate or registered relationship certificate with substantial cohabitation proofs',
      'Family Overseas Student Health Cover (OSHC) policy covering entire visa length',
      'School placement confirmation or enrollment evidence for school-age children',
      'Form 919 (Student visa dependent declaration) and main student’s eCoE',
      'Biometrics enrollment and panel clinic medical examinations'
    ],
    practicalAdvisory: 'All dependents MUST be declared in the student’s initial visa application, even if they plan to join later. Omitting a family member can lead to immediate refusal of subsequent entry applications.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Higher Ed & PhD Stream'
  },
  {
    id: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    visaCategory: 'Spousal Open Work Permit (SOWP) & Minor Child Study Permit',
    governingAuthority: 'Immigration, Refugees and Citizenship Canada (IRCC)',
    authorityUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-spouse-common-law-partner.html',
    courseEligibilityTier: 'Master’s degree, Doctoral (PhD), or designated professional degree programs only',
    isEligibleForUndergrad: false,
    spouseWorkRights: 'Unrestricted Spousal Open Work Permit (SOWP) allowing employment with any eligible Canadian employer for the duration of student’s permit.',
    childrenSchooling: 'Minor children can attend public elementary and secondary schools without paying international tuition fees in most provinces.',
    financialRequirement: 'Additional liquid bank balance demonstrating family maintenance (approx. CAD $5,000 to $7,000 per accompanying family member).',
    eligibleFamilyMembers: [
      'Legally married spouse',
      'Common-law partner (cohabiting in a conjugal relationship for at least 1 continuous year)',
      'Dependent children under 22 years of age (unmarried)'
    ],
    keyDocumentRequirements: [
      'Valid Study Permit and official letter from DLI confirming enrollment in Master’s or PhD program',
      'Civil marriage certificate or IMM 5409 Statutory Declaration of Common-Law Union',
      'Extensive genuine relationship evidence (joint finances, rental agreements, photographs)',
      'Immigration medical exam by IRCC-approved panel physician in Bangladesh',
      'Police clearance certificates from Bangladesh Police'
    ],
    practicalAdvisory: 'Under policy updates implemented in 2024, spouses of undergraduate and diploma college students are no longer eligible for open work permits. Applications must show enrollment in qualifying Master’s/Doctoral studies.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Master’s & PhD Stream'
  },
  {
    id: 'new-zealand',
    country: 'New Zealand',
    flag: '🇳🇿',
    visaCategory: 'Partner of a Student Work Visa & Child Student Visa',
    governingAuthority: 'Immigration New Zealand (INZ)',
    authorityUrl: 'https://www.immigration.govt.nz/new-zealand-visas/visas/visa/partner-of-a-student-work-visa',
    courseEligibilityTier: 'Level 9 (Master’s), Level 10 (PhD), or Level 7/8 qualifications specified on the official Green List',
    isEligibleForUndergrad: false,
    spouseWorkRights: 'Open work visa with unrestricted working hours for any accredited New Zealand employer.',
    childrenSchooling: 'Dependent children are treated as domestic students for fee purposes, enabling access to subsidized primary and secondary state schooling.',
    financialRequirement: 'Demonstrated maintenance funds (minimum NZD $4,200+ per dependent or signed sponsorship form).',
    eligibleFamilyMembers: [
      'Spouse or partner in a genuine, stable relationship living together',
      'Dependent single children aged 19 and under'
    ],
    keyDocumentRequirements: [
      'Student’s valid visa and evidence of enrollment in Level 9/10 or Green List qualification',
      'Partnership evidence proving living together in a genuine and stable relationship',
      'Medical and chest X-ray certificates from panel clinic in Bangladesh',
      'Police clearance certificate for applicants aged 17 and older'
    ],
    practicalAdvisory: 'Immigration New Zealand evaluates partnership based on "living together in a genuine and stable relationship." A marriage certificate alone is insufficient without evidence of shared residential life.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Postgraduate & Green List'
  },
  {
    id: 'europe',
    country: 'Europe (Germany, Finland, Sweden)',
    flag: '🇪🇺',
    visaCategory: 'National D Visa & Family Reunification Residence Permit',
    governingAuthority: 'Respective National Foreigners Authorities (Ausländerbehörde / Migri / Migrationsverket)',
    authorityUrl: 'https://home-affairs.ec.europa.eu/policies/schengen-borders-visa/visa-policy_en',
    courseEligibilityTier: 'Master’s degree and PhD researchers with proven self-sufficient living accommodation and funds',
    isEligibleForUndergrad: false,
    spouseWorkRights: 'Work rights granted upon issuance of dependent residence permit in most European destinations (e.g. Germany Section 30 AufenthG, Finland type A/B permit).',
    childrenSchooling: 'Free access to public primary and secondary education in the local official language.',
    financialRequirement: 'Proof of secure family subsistence without recourse to public funds (blocked account or verified scholarship living stipend covering family size).',
    eligibleFamilyMembers: [
      'Civilly registered spouse',
      'Minor unmarried dependent children under 18'
    ],
    keyDocumentRequirements: [
      'Apostilled marriage and birth certificates with certified German/official language translation',
      'Rental lease agreement for self-contained apartment meeting minimum square-meter family living requirements',
      'Comprehensive family health insurance policy covering European territory',
      'Basic official language proficiency (e.g. German A1 for spouse) where applicable'
    ],
    practicalAdvisory: 'In Germany and the EU, proving adequate rental apartment size (typically 12 sqm per person over 6) and verified family income is a prerequisite before family reunification permits can be issued.',
    officialReviewDate: 'October 2026',
    statusBadge: 'Master’s & Research'
  }
];

export const DependentVisaView: React.FC<DependentVisaViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('malaysia');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [checklistFilter, setChecklistFilter] = useState<'all' | 'marital' | 'financial' | 'children' | 'medical'>('all');

  // Self-evaluation checklist states
  const [readinessStep1, setReadinessStep1] = useState<string>('');
  const [readinessStep2, setReadinessStep2] = useState<string>('');
  const [readinessStep3, setReadinessStep3] = useState<string>('');

  const currentPolicy =
    DESTINATION_POLICIES.find((d) => d.id === selectedDestinationId) || DESTINATION_POLICIES[0];

  const handleWhatsAppInquiry = (customText?: string) => {
    const text =
      customText ||
      `Hello GEES, I am an international student/prospective student and would like guidance on dependent visa eligibility for my spouse/child for ${currentPolicy.country}.`;
    window.open(`https://wa.me/8801805529578?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleConsultationTrigger = () => {
    if (onOpenConsultation) {
      onOpenConsultation(`Dependent Visa - ${currentPolicy.country}`);
    } else {
      handleWhatsAppInquiry();
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-slate-100 min-h-screen">
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
              Dependent Visa Guidance
            </span>
          </div>
          <button
            onClick={handleConsultationTrigger}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fbb034] hover:bg-[#e5a02e] text-[#070b19] rounded-full font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">family_restroom</span>
            <span className="hidden min-[420px]:inline">Consultation</span>
            <span className="min-[420px]:hidden">Advisor</span>
          </button>
        </div>
      </nav>

      {/* 2. STATUTORY ADVISORY & IMMIGRATION BOUNDARY BANNER */}
      <aside aria-label="Regulatory Notice" className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-4 py-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg shrink-0 mt-0.5">
            verified_user
          </span>
          <div className="space-y-0.5">
            <p className="font-bold tracking-tight">
              Official Regulatory Notice: Educational Counseling &amp; Visa Document Guidance
            </p>
            <p className="text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
              GEES operates as an educational consultancy advising on university placement and visa document readiness. All dependent visa decisions, work permit authorizations, and entry rights remain the sovereign authority of destination immigration departments (EMGS, UKVI, DHA, IRCC, INZ). GEES does not guarantee visa approvals or issue official travel permits.
            </p>
          </div>
        </div>
      </aside>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#070b19] via-[#0c1229] to-[#0f1738] text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Policy tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="material-symbols-outlined text-[18px] text-[#fbb034]">shield_with_heart</span>
                <span>Evidence-Based Family Relocation Guidance</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Student Dependent Visa &amp; <span className="bg-gradient-to-r from-[#fbb034] via-amber-200 to-sky-300 bg-clip-text text-transparent">Family Accompaniment</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Planning to bring your spouse or children while pursuing higher education abroad? Dependent eligibility is strictly governed by destination immigration laws, course qualification level, and verified financial capacity.
              </p>

              {/* KEY GROUND RULES STRIP */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-xs uppercase font-bold text-[#fbb034] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Course Level</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    Strictly depends on degree tier (Master&apos;s/PhD vs Bachelor&apos;s).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-xs uppercase font-bold text-sky-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">family_restroom</span>
                    <span>Eligible Members</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    Legal spouse and dependent minor children under 18/21.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
                  <div className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Verified Rules</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    Policy checked against latest official government decrees.
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
                <InteractiveHoverButton
                  text="Book Family Visa Consultation"
                  onClick={handleConsultationTrigger}
                  className="w-full sm:w-auto text-sm"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('destination-policies');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                  <span>Explore Destination Policies</span>
                </button>
              </div>
            </div>

            {/* HERO HIGHLIGHT SUMMARY CARD */}
            <div className="lg:col-span-5">
              <div className="bg-[#0c1229]/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs font-bold text-[#fbb034] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">policy</span>
                    <span>Realistic Immigration Principles</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[11px] font-bold rounded-full">
                    GEES ADVISORY
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-[#070b19] rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Spouse &amp; Minor Children</h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                        Qualified if student meets degree level, financial maintenance, and legal relationship criteria.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#070b19] rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Parents, Siblings &amp; In-Laws</h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                        Generally ineligible under UK, Canada, Australia &amp; NZ student dependent visas (separate tourist/visitor rules apply).
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#070b19] rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Subsequent Entry Strategy</h4>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                        Students frequently arrive first to secure accommodation and settle before filing for family members.
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

      {/* 4. WHO QUALIFIES VS WHO DOES NOT (REALISTIC CATEGORIES) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
            Clarity &amp; Realistic Expectations
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Who Qualifies as a Student Dependent?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Immigration departments define family members under very precise legal classifications. Below is the verified international standard for student visa sponsorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* WHO MAY QUALIFY */}
          <div className="bg-white dark:bg-[#0c1229] border border-emerald-200 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">how_to_reg</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Potentially Eligible Family Members
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Subject to country laws &amp; student degree tier
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Legal Spouse</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Civilly registered marriage with government attestation and authenticated translations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Civil or De Facto Partner</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Recognized in destinations like Australia and Canada with documented proof of at least 12 months continuous cohabitation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">check_circle</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Dependent Minor Children</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Unmarried biological or legally adopted children under 18 years of age (or under 21 in Malaysia).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">info</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Parents of Students (Malaysia Only)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Malaysia allows parents of enrolled Master’s and PhD students to obtain Long-Term Social Visit Passes under institutional sponsorship.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* WHO GENERALLY DOES NOT QUALIFY */}
          <div className="bg-white dark:bg-[#0c1229] border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">person_off</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Ineligible Family Categories
                </h3>
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Cannot be sponsored on standard student dependent visas
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <span className="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">cancel</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Parents &amp; In-Laws (Western Countries)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    UK, Australia, Canada, and New Zealand do not allow parents of adult students as dependents. Parents must apply for standard tourist/visitor visas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <span className="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">cancel</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Brothers, Sisters &amp; Cousins</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Siblings and collateral relatives cannot be sponsored as dependents. They must qualify for their own independent student visas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <span className="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">cancel</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Adult Children (Aged 18 / 21+)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Children who have reached the age of majority cannot be added to a parent’s student visa, except under rare, documented medical dependency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <span className="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">cancel</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Fiancés / Unregistered Engagements</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Betrothals, religious ceremonies without civil registration, or plans to marry in the future do not satisfy dependent visa requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DESTINATION-SPECIFIC POLICIES & COMPARISON */}
      <section id="destination-policies" className="py-12 sm:py-16 bg-white dark:bg-[#0c1229]/60 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
              Destination Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Official Dependent Rules by Country
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Select a study destination to view verified degree requirements, spousal work authorizations, schooling rights, and governing authorities.
            </p>
          </div>

          {/* TAB BUTTONS (TOUCH TARGET 44PX+ ON MOBILE) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
            {DESTINATION_POLICIES.map((policy) => {
              const isSelected = policy.id === selectedDestinationId;
              return (
                <button
                  key={policy.id}
                  onClick={() => setSelectedDestinationId(policy.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-base">{policy.flag}</span>
                  <span>{policy.country}</span>
                </button>
              );
            })}
          </div>

          {/* POLICY DETAIL CARD */}
          <div className="bg-slate-50 dark:bg-[#070b19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl">{currentPolicy.flag}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {currentPolicy.country} &mdash; {currentPolicy.visaCategory}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>Governing Body:</span>
                  <a
                    href={currentPolicy.authorityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-[#fbb034] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>{currentPolicy.governingAuthority}</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
                  {currentPolicy.statusBadge}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Verified: {currentPolicy.officialReviewDate}
                </span>
              </div>
            </div>

            {/* KEY PARAMETERS 3-COLUMN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. DEGREE ELIGIBILITY */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-extrabold uppercase text-blue-600 dark:text-[#fbb034] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  <span>Degree Level Requirement</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentPolicy.courseEligibilityTier}
                </p>
                <div className="pt-1">
                  {currentPolicy.isEligibleForUndergrad ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Undergraduate students can sponsor</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      <span>Not permitted for standard Bachelors/Diplomas</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 2. SPOUSE WORK RIGHTS */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">work</span>
                  <span>Spouse Work Authorization</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentPolicy.spouseWorkRights}
                </p>
              </div>

              {/* 3. CHILDREN SCHOOLING */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">local_library</span>
                  <span>Children Schooling Access</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentPolicy.childrenSchooling}
                </p>
              </div>
            </div>

            {/* FINANCIAL & PRACTICAL ADVISORY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
                <div className="text-xs font-extrabold uppercase text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span>Financial Maintenance Requirement</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {currentPolicy.financialRequirement}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-2">
                <div className="text-xs font-extrabold uppercase text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  <span>Official Policy Advisory</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {currentPolicy.practicalAdvisory}
                </p>
              </div>
            </div>

            {/* MANDATORY DOCUMENTS & CONSULTATION HANDOFF */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="w-full lg:w-2/3 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Mandatory Submission Package for {currentPolicy.country}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {currentPolicy.keyDocumentRequirements.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-blue-600 dark:text-[#fbb034] text-[16px] shrink-0 mt-0.5">
                        task_alt
                      </span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full lg:w-1/3 flex flex-col gap-2.5 shrink-0">
                <button
                  onClick={handleConsultationTrigger}
                  className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                  <span>Audit Family Documents for {currentPolicy.country}</span>
                </button>
                <button
                  onClick={() => handleWhatsAppInquiry(`Inquiry regarding ${currentPolicy.country} student dependent visa requirements and documents.`)}
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

      {/* 6. COMBINED APPLICATION VS SUBSEQUENT ENTRY (STRATEGY GUIDE) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
            Strategic Timing
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Applying Together vs. Subsequent Entry
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            One of the most consequential decisions for student families is whether to lodge the visa application simultaneously or follow a staggered arrival strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* PATH A: COMBINED LODGEMENT */}
          <div className="bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Option 01
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                Simultaneous Travel
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Combined Lodgement (Apply Together)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Main applicant and dependents file their visa petitions simultaneously under one consolidated application.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">add_circle</span>
                <span><strong>Pros:</strong> Entire family travels together on day one; no period of separation between spouses.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">remove_circle</span>
                <span><strong>Cons:</strong> Extreme financial load upfront (family health surcharge + tuition + massive 28-day maintenance bank balance).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">warning</span>
                <span><strong>Risk:</strong> Rental housing difficulty &mdash; universities seldom offer student dorms to families, making immediate arrival with children challenging without prior tenancy.</span>
              </div>
            </div>
          </div>

          {/* PATH B: SUBSEQUENT ENTRY */}
          <div className="bg-white dark:bg-[#0c1229] border border-blue-300 dark:border-blue-900/60 rounded-3xl p-6 sm:p-8 space-y-5 relative shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-600 dark:text-[#fbb034] uppercase tracking-wider">
                Option 02 &mdash; Highly Recommended
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                Pragmatic &amp; Proven
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Subsequent Entry (Staggered Arrival)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Main student arrives first to commence studies, inspect residential neighborhoods, lease a family apartment, and subsequently lodge the family dependent visa.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">add_circle</span>
                <span><strong>Pros:</strong> Student establishes enrollment, opens local bank accounts, and provides an actual lease agreement to immigration.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">add_circle</span>
                <span><strong>Lower Stress:</strong> Eliminates the acute risk of arriving at an international airport with infants without permanent shelter.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">info</span>
                <span><strong>Notice:</strong> For Australia, all dependents must still be formally declared in the initial visa application to be eligible for subsequent entry later.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MANDATORY RELATIONSHIP & DOCUMENT CHECKLIST (WITH INTERACTIVE FILTER) */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0c1229]/60 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
              Preparation Checklist
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Genuine Relationship &amp; Document Evidence
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Immigration case officers subject spousal applications to high evidential standards. Documents must establish a genuine, continuous, and subsistence-viable partnership.
            </p>
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {[
              { id: 'all', label: 'All Requirements' },
              { id: 'marital', label: 'Marriage & Civil Proof' },
              { id: 'financial', label: 'Financial & Solvency' },
              { id: 'children', label: 'Child Welfare & Schooling' },
              { id: 'medical', label: 'Medical & Police Clearances' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setChecklistFilter(f.id as any)}
                className={`px-4 py-2 min-h-[44px] rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  checklistFilter === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: 'marital',
                icon: 'verified_user',
                title: 'Civil Marriage Authentication',
                items: [
                  'Government-issued marriage certificate (Nikahnama in Bangladesh)',
                  'Ministry of Foreign Affairs (MoFA) seal and apostille verification',
                  'Certified English translation by registered government notary',
                  'National ID cards (NID) of both spouses with updated marital status'
                ]
              },
              {
                category: 'marital',
                icon: 'photo_library',
                title: 'Relationship History & Proof',
                items: [
                  'Chronological photo album (engagement, wedding ceremony, family gatherings, travel over time)',
                  'Evidence of cohabitation (joint tenancy lease, utility bills, joint bank statements)',
                  'Communication history during physical separation (chat logs, call records, money transfers)',
                  'Written affidavits of support from immediate family members'
                ]
              },
              {
                category: 'financial',
                icon: 'account_balance',
                title: 'Maintenance Funds & Banking',
                items: [
                  'Strict 28-day holding verification for UKVI (£845/£1,015 per dependent/month)',
                  'Audited tax clearance certificates and income source tracing',
                  'Solvency letter from licensed commercial bank with live verification contacts',
                  'Prepaid healthcare surcharges (UK IHS, Australian Family OSHC)'
                ]
              },
              {
                category: 'children',
                icon: 'child_care',
                title: 'Minor Child Records',
                items: [
                  'Unabridged birth certificate indicating biological parents’ names',
                  'Hospital immunization and pediatric vaccination certificates',
                  'School transfer certificate and prior academic progress reports',
                  'Notarized custody deed or non-accompanying parent consent affidavit (if traveling with one parent)'
                ]
              },
              {
                category: 'medical',
                icon: 'health_and_safety',
                title: 'Health Screening & Panel Tests',
                items: [
                  'IOM Migration Health Assessment Tuberculosis (TB) clearance (UK, Canada, Australia)',
                  'General medical examination and chest X-ray by designated panel physician',
                  'Pre-existing condition disclosures and international health insurance policy'
                ]
              },
              {
                category: 'medical',
                icon: 'local_police',
                title: 'Character & Police Clearances',
                items: [
                  'Police Clearance Certificate (PCC) issued by Bangladesh Police for all adult applicants',
                  'PCC from any foreign country where applicant resided for 12+ months in past 10 years',
                  'Clean biometric submission and background security checks'
                ]
              }
            ]
              .filter((c) => checklistFilter === 'all' || c.category === checklistFilter)
              .map((card, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-[#070b19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-[#fbb034] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-[15px] shrink-0 mt-0.5">
                          check
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE FAMILY READINESS SELF-CHECK */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#0c1229] via-[#0f1738] to-[#070b19] border border-slate-700/80 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-[#fbb034]/20 border border-[#fbb034]/40 text-[#fbb034] text-xs font-bold uppercase tracking-wider">
              Self-Evaluation Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Check Your Family&apos;s Dependent Readiness
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Answer 3 preliminary questions to see honest guidance on your eligibility and next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* QUESTION 1: DEGREE LEVEL */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wide">
                1. Student Degree Level
              </label>
              <select
                value={readinessStep1}
                onChange={(e) => setReadinessStep1(e.target.value)}
                className="w-full p-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#fbb034]"
              >
                <option value="">-- Select Degree --</option>
                <option value="phd">PhD / Doctoral Research</option>
                <option value="masters">Master’s Degree (Research/Coursework)</option>
                <option value="bachelor">Bachelor’s Degree (Undergraduate)</option>
                <option value="diploma">Diploma / Certificate Course</option>
              </select>
              <p className="text-[11px] text-slate-400">
                UK &amp; Canada require Master&apos;s/PhD for spousal work rights.
              </p>
            </div>

            {/* QUESTION 2: FAMILY COMPOSITION */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wide">
                2. Accompanying Family
              </label>
              <select
                value={readinessStep2}
                onChange={(e) => setReadinessStep2(e.target.value)}
                className="w-full p-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#fbb034]"
              >
                <option value="">-- Select Family --</option>
                <option value="spouse_only">Spouse only</option>
                <option value="spouse_children">Spouse + Dependent Children</option>
                <option value="children_only">Children only</option>
                <option value="parents">Parents / In-Laws</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Parents are generally ineligible except under specific Malaysia routes.
              </p>
            </div>

            {/* QUESTION 3: FINANCIAL READINESS */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-blue-300 uppercase tracking-wide">
                3. Financial Maintenance
              </label>
              <select
                value={readinessStep3}
                onChange={(e) => setReadinessStep3(e.target.value)}
                className="w-full p-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#fbb034]"
              >
                <option value="">-- Liquid Bank Status --</option>
                <option value="ready">Funds ready &amp; can hold for 28+ days</option>
                <option value="planning">Currently consolidating funds</option>
                <option value="not_ready">Unclear on bank balance requirements</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Living expenses per dependent must be proven independently.
              </p>
            </div>
          </div>

          {/* DYNAMIC FEEDBACK BOX */}
          {(readinessStep1 || readinessStep2 || readinessStep3) && (
            <div className="p-5 rounded-2xl bg-white/10 border border-white/20 text-xs sm:text-sm space-y-2">
              <h4 className="font-bold text-[#fbb034] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                <span>Immediate Assessment Summary</span>
              </h4>

              {readinessStep1 === 'bachelor' && (
                <p className="text-amber-200">
                  ⚠️ <strong>Undergraduate Note:</strong> Spousal dependent visas are severely restricted for Bachelor&apos;s degree students in the UK and Canada. Australia permits accompaniment, but spouse work rights are capped at 48 hours per fortnight. Malaysia does not permit dependent passes for undergraduates.
                </p>
              )}

              {readinessStep1 === 'phd' && (
                <p className="text-emerald-200">
                  ✅ <strong>Doctoral Advantage:</strong> PhD students enjoy the highest dependent privileges across Malaysia, UK, Australia, New Zealand, and Canada, including full spousal work rights and access to schooling.
                </p>
              )}

              {readinessStep2 === 'parents' && (
                <p className="text-rose-200">
                  ⛔ <strong>Parent Sponsorship Alert:</strong> Parents cannot be sponsored as student dependents in the UK, Australia, Canada, or NZ. Only Malaysia offers a Long-Term Social Visit Pass for parents of enrolled postgraduate researchers.
                </p>
              )}

              {readinessStep3 === 'ready' && (
                <p className="text-sky-200">
                  💼 <strong>Financial Solvency:</strong> Having verifiable, traceable liquid bank accounts ready is the single biggest factor in avoiding processing delays.
                </p>
              )}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={handleConsultationTrigger}
              className="px-6 py-3.5 bg-[#fbb034] hover:bg-[#e5a02e] text-[#070b19] font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">forum</span>
              <span>Discuss Your Family Profile with a Senior GEES Advisor</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. PRACTICAL FAMILY CONSIDERATIONS & PITFALLS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-[#fbb034]">
            Ground Realities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Practical Family Settlement Considerations
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Securing a visa is only step one. Families must prepare for critical post-landing logistics in destination cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">apartment</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Private Rental Accommodation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              University dormitories rarely accommodate families. Students must navigate competitive private rental markets where landlords require credit checks, rent advances, or local guarantors.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">school</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Child School Placement
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              School enrollment is tied to your residential catchment area. You must establish a permanent residential tenancy before local education councils can allocate a state school seat.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">medical_services</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Healthcare Surcharges
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every dependent must have health insurance for the entire visa duration. The UK requires £776/year IHS per person; Australia requires comprehensive family OSHC policies.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1229] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">child_friendly</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Under-5 Childcare Costs
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Nursery or daycare for children under 5 is rarely fully subsidized for international students and can cost upwards of £1,000 / AUD $1,500 monthly if both parents work.
            </p>
          </div>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
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
              Direct, honest answers to the most common questions raised by student families.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Can my spouse work full-time while I study abroad as an international student?',
                a: 'Spousal work permissions depend entirely on the country and course level. In Australia and Canada, spouses of Master’s and PhD students generally receive unrestricted open work rights. In the UK, spouses of postgraduate research students (PhD and research Master’s) can work full-time. In Malaysia, dependent pass holders cannot work without securing an independent employment permit or formal Immigration Department approval.'
              },
              {
                q: 'Can I bring my elderly parents on my student dependent visa?',
                a: 'In Western study destinations—including the UK, Australia, Canada, and New Zealand—parents cannot be sponsored as student dependents. They can only visit on short-term standard tourist visas. The notable exception is Malaysia, where the Immigration Department allows parents of enrolled Master’s and PhD students to obtain Long-Term Social Visit Passes under university sponsorship.'
              },
              {
                q: 'What changed in the UK dependent visa policy in January 2024?',
                a: 'As of January 1, 2024, international students enrolled in 1-year taught master’s degree programs in the UK are no longer permitted to bring dependent family members. Only students enrolled in postgraduate research programs (such as PhDs or research master’s) or courses supported by government scholarships are eligible to sponsor partners and children.'
              },
              {
                q: 'Is it safer to apply for the dependent visa together or via subsequent entry?',
                a: 'Many experienced advisors recommend subsequent entry (staggered arrival). This allows the primary student to travel first, register at the university, open local bank accounts, and secure a permanent family apartment before filing for the spouse and child. In Australia, however, all dependents must be explicitly named in the initial visa application, even if they plan to join later.'
              },
              {
                q: 'Are our dependent children entitled to free public education?',
                a: 'In the UK and Canada, school-age dependent children of eligible international students can attend state/public primary and secondary schools without paying international tuition fees. In Australia, public school fees vary by State and Territory; some states waive tuition for children of PhD scholars, while others charge standard international dependent fees.'
              },
              {
                q: 'What if our marriage took place recently before the visa application?',
                a: 'Recent marriages (under 6 to 12 months) receive heightened scrutiny from immigration case officers to verify authenticity. In such cases, applicants must provide extensive secondary evidence, including joint tenancy agreements, joint banking, historical photographs spanning courtship, wedding celebration records, and communication histories.'
              },
              {
                q: 'Can our dependents stay abroad after the student finishes their degree?',
                a: 'Dependents’ visas are intrinsically linked to the primary student’s visa validity. If the student transitions to a post-study work visa (such as the UK Graduate Route, Australian Subclass 485, or Canadian PGWP), eligible dependents can generally transition onto the post-study dependent stream, retaining their work rights.'
              },
              {
                q: 'What happens if a student dependent visa application is refused?',
                a: 'If a dependent visa is refused, the official decision letter will specify the exact grounds (typically insufficient financial maintenance, failure to satisfy genuine relationship criteria, or ineligible course tier). Refusals must be declared on all future visa applications worldwide. GEES reviews refusal grounds and assists in addressing evidential deficiencies prior to re-lodgement.'
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-[#070b19] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
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

      {/* 11. TRANSPARENT CALL TO ACTION & CONSULTATION SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#070b19] via-[#0c1229] to-[#0f1738] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-700">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 bg-white/10 text-[#fbb034] rounded-full text-xs font-extrabold uppercase tracking-widest border border-white/20">
              Personalized Guidance
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white">
              Speak with a GEES Family Visa Specialist
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every student family’s financial posture, course qualification, and destination laws are unique. Receive an honest, objective pre-assessment before committing your family’s resources.
            </p>

            <div className="p-3.5 bg-blue-950/60 border border-blue-800/60 rounded-2xl text-xs text-blue-200 max-w-xl mx-auto">
              <span>🔒 Transparent Communication: We do not store private passport scans or financial data on web servers. Your inquiry connects directly with an authorized GEES advisor via WhatsApp or in-person consultation.</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleConsultationTrigger}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#fbb034] hover:bg-[#e5a02e] text-[#070b19] rounded-full font-extrabold text-sm shadow-xl transition-all cursor-pointer min-h-[44px]"
              >
                Schedule Family Consultation
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

            {/* RELATED GEES SERVICE LINKS */}
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
                onClick={() => onNavigate?.('study-destination', 'malaysia')}
                className="text-blue-400 hover:text-white underline cursor-pointer"
              >
                Study in Malaysia
              </button>
              <span>&bull;</span>
              <button
                onClick={() => onNavigate?.('study-destination', 'united-kingdom')}
                className="text-blue-400 hover:text-white underline cursor-pointer"
              >
                Study in UK
              </button>
              <span>&bull;</span>
              <button
                onClick={() => onNavigate?.('study-destination', 'australia')}
                className="text-blue-400 hover:text-white underline cursor-pointer"
              >
                Study in Australia
              </button>
              <span>&bull;</span>
              <button
                onClick={() => onNavigate?.('admission-support')}
                className="text-blue-400 hover:text-white underline cursor-pointer"
              >
                Admission Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DependentVisaView;
