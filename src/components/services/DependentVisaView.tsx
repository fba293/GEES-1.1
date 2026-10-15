/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Student Dependent Visa & Family Relocation Guidance Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface DependentVisaViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: () => void;
  onNavigate?: (view: string, payload?: string) => void;
}

interface CountryDependentData {
  id: string;
  country: string;
  flag: string;
  visaType: string;
  spouseWorkRights: string;
  childrenSchooling: string;
  financialRequirement: string;
  eligibleStudentDegree: string;
  relationshipProof: string[];
  keyHighlights: string[];
  color: string;
}

const DEPENDENT_COUNTRIES: CountryDependentData[] = [
  {
    id: 'uk',
    country: 'United Kingdom',
    flag: '🇬🇧',
    visaType: 'Student Dependent Visa (Partner & Children)',
    spouseWorkRights: 'Full-time work allowed (no restricted hours, except doctor/dentist in training)',
    childrenSchooling: 'Free state school education for children aged 5-16',
    financialRequirement: '£845/month (Outer London) or £1,015/month (Inner London) per dependent for up to 9 months',
    eligibleStudentDegree: 'PhD / Doctorate, Masters by Research, or Government-sponsored students',
    relationshipProof: [
      'Official Registered Marriage Certificate (Apostilled/Translated)',
      'Proof of 2+ years cohabitation for unmarried partners (Joint leases, utility bills)',
      'Joint Bank Account Statements & Shared Tax Filings',
      'Birth Certificates for dependent children showing parentage'
    ],
    keyHighlights: [
      'IHS Healthcare Surcharge (£776/yr) grants full access to NHS care',
      'Dependents can transition onto Graduate Route Visa upon main applicant graduation',
      'Can apply together with main applicant or join later via Subsequent Entry'
    ],
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    visaType: 'Spousal Open Work Permit (SOWP) & Minor Study Permit',
    spouseWorkRights: 'Unrestricted Open Work Permit (work for any Canadian employer)',
    childrenSchooling: 'Free public primary and secondary education for accompanying minor children',
    financialRequirement: 'Additional CAD $5,000 - $7,000 per dependent in liquid bank proof or GIC',
    eligibleStudentDegree: 'Master’s degree, Doctoral (PhD), or specific professional degree programs',
    relationshipProof: [
      'IMM 5409 Statutory Declaration of Common-Law Union (if unmarried)',
      'Civil Marriage License & Official Registration',
      'Photos over time, travel records, & joint financial responsibility evidence',
      'Children custody documents & unabridged birth certificates'
    ],
    keyHighlights: [
      'Spouse can work full-time while main applicant studies full-time',
      'Dependent work experience counts towards Canadian Express Entry Permanent Residency',
      'Children do not require separate PAL (Provincial Attestation Letter)'
    ],
    color: 'from-red-600 to-rose-700'
  },
  {
    id: 'australia',
    country: 'Australia',
    flag: '🇦🇺',
    visaType: 'Subclass 500 Subsequent Entry Dependent Visa',
    spouseWorkRights: 'Uncapped full-time work rights (if student enrolled in Master’s or PhD)',
    childrenSchooling: 'Subsidized or free public schooling depending on Australian State/Territory',
    financialRequirement: 'Additional AUD $10,394/yr for spouse + AUD $4,449/yr per child + travel allowance',
    eligibleStudentDegree: 'All Higher Education streams (Undergraduate, Postgraduate, PhD)',
    relationshipProof: [
      'Official Marriage Certificate or Registered De Facto Relationship',
      '12 months cohabitation evidence for de facto partners',
      'Family OSHC (Overseas Student Health Cover) Policy',
      'Joint asset ownership, shared household expenses, & communication logs'
    ],
    keyHighlights: [
      'Family OSHC health insurance policy covers emergency medical & hospitalization',
      'Can be declared during initial visa filing or added later via Subsequent Entry',
      'Work rights automatically scale up if student progresses to Master’s degree'
    ],
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'usa',
    country: 'United States',
    flag: '🇺🇸',
    visaType: 'F-2 Nonimmigrant Dependent Visa',
    spouseWorkRights: 'Employment strictly NOT permitted under F-2 status',
    childrenSchooling: 'Full-time attendance at elementary and secondary schools (K-12)',
    financialRequirement: 'Full cost of living for spouse ($5,000 - $8,000/yr) & children ($3,000 - $5,000/yr) on Form I-20',
    eligibleStudentDegree: 'All degree-seeking F-1 full-time academic students',
    relationshipProof: [
      'Original Form I-20 issued specifically for F-2 Dependents by SEVIS DSO',
      'Original Marriage Certificate & Civil Registration',
      'Marriage photographs, wedding invitations, and joint affidavit',
      'F-1 Student’s valid I-20, passport, visa stamp & I-94 arrival record'
    ],
    keyHighlights: [
      'Spouse can engage in part-time recreational/vocational study',
      'Children can attend US elementary and high schools freely',
      'Can transition to independent F-1 student status or H-1B work visa if sponsored'
    ],
    color: 'from-purple-600 to-indigo-800'
  }
];

export const DependentVisaView: React.FC<DependentVisaViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  // Calculator state
  const [selectedCountry, setSelectedCountry] = useState<string>('uk');
  const [degreeLevel, setDegreeLevel] = useState<string>('masters');
  const [familyComposition, setFamilyComposition] = useState<string>('spouse_one_child');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const countryInfo = DEPENDENT_COUNTRIES.find((c) => c.id === selectedCountry) || DEPENDENT_COUNTRIES[0];

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
              Dependent Visa
            </span>
          </div>
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">family_restroom</span>
            <span>Family Visa Audit</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                <span>98.6% Success Rate in Student Family Relocation</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Bring Your <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">Family Abroad</span> While You Study
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Study with peace of mind. GEES specializes in securing Spousal Open Work Permits (SOWP), child study permits, family health insurance, and relationship proof documentation for top destinations worldwide.
              </p>

              {/* STATS STRIP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-400">98.6%</div>
                  <div className="text-xs text-slate-400 font-medium">Dependent Approval</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">4,200+</div>
                  <div className="text-xs text-slate-400 font-medium">Families Relocated</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-sky-400">Full Work</div>
                  <div className="text-xs text-slate-400 font-medium">Spouse Open Work Rights</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-400">Free K-12</div>
                  <div className="text-xs text-slate-400 font-medium">Child Public Schooling</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <InteractiveHoverButton
                  text="Book Free Family Visa Audit"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto text-sm"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('dependent-calculator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm transition-all text-center cursor-pointer"
                >
                  Check Work Rights &amp; Eligibility
                </button>
              </div>
            </div>

            {/* HERO VISUAL CARD */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Family Relocation Breakdown</span>
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded">GEES IMMIGRATION</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                        💼
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Spouse Open Work Permit</div>
                        <div className="text-[11px] text-slate-400">Full-time employment eligibility</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">GRANTED</span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-bold">
                        🏫
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Minor Children Education</div>
                        <div className="text-[11px] text-slate-400">Free K-12 State School Entry</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-400">ELIGIBLE</span>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-bold">
                        🏥
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Family Health Coverage</div>
                        <div className="text-[11px] text-slate-400">NHS / OSHC Family Policy</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-400">COVERED</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl flex items-center gap-2.5 text-xs text-indigo-200">
                  <span className="material-symbols-outlined text-[18px] text-indigo-400">shield</span>
                  <span>100% Genuine Relationship Document Audit Included.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR / MATCHING SECTION */}
      <section id="dependent-calculator" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Interactive Eligibility Tool
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Explore Dependent Rights &amp; Requirements
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Select your desired study location to inspect spousal work permit rules, child education rights, required extra bank balances, and mandatory relationship proof.
          </p>
        </div>

        {/* COUNTRY TAB BUTTONS */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {DEPENDENT_COUNTRIES.map((c) => (
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

        {/* COUNTRY DETAIL DISPLAY CARD */}
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
                <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-bold">
                  {countryInfo.eligibleStudentDegree}
                </div>
              </div>

              {/* TWO COLUMN SUMMARY BOXES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">work</span>
                    <span>Spouse Work Rights</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {countryInfo.spouseWorkRights}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Children Schooling</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {countryInfo.childrenSchooling}
                  </p>
                </div>
              </div>

              {/* FINANCIAL PROOF HIGHLIGHT */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <div className="text-xs font-extrabold uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>Financial Proof Requirement per Dependent</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {countryInfo.financialRequirement}
                </p>
              </div>

              {/* KEY HIGHLIGHTS */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
                  Key Relocation Advantages
                </h4>
                <div className="space-y-2">
                  {countryInfo.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0 mt-0.5">verified</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MANDATORY RELATIONSHIP PROOF CARD */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">folder_shared</span>
                  <span>Genuine Relationship Proof</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">MANDATORY AUDIT</span>
              </div>

              <div className="space-y-2.5">
                {countryInfo.relationshipProof.map((proof, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{proof}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                  <span>Review My Dependent Documents for {countryInfo.country}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-STEP RELOCATION ROADMAP */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Structured Guidance
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              The GEES Family Relocation Roadmap
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              From marriage document authentication to dependent visa lodging and pre-arrival school registration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Eligibility & Degree Audit',
                desc: 'Verifying that main applicant’s study program grants full dependent work and schooling rights.',
                icon: 'verified_user'
              },
              {
                step: '02',
                title: 'Relationship Document Verification',
                desc: 'Auditing civil marriage licenses, apostilles, joint financial proof, and cohabitation evidence.',
                icon: 'volunteer_activism'
              },
              {
                step: '03',
                title: 'University / CAS / I-20 Updates',
                desc: 'Requesting updated university statements, dependent Form I-20s, or eCoE inclusions.',
                icon: 'edit_document'
              },
              {
                step: '04',
                title: 'Financial & Health Cover Setup',
                desc: 'Organizing family OSHC / IHS medical coverage and maintaining required liquid bank deposits.',
                icon: 'health_and_safety'
              },
              {
                step: '05',
                title: 'Embassy Lodgement & Biometrics',
                desc: 'Filing dependent visa applications together with student or via Subsequent Entry.',
                icon: 'assignment_turned_in'
              },
              {
                step: '06',
                title: 'Post-Arrival Settlement & Schooling',
                desc: 'Assisting with spousal job hunting, local school enrollments for kids, and family housing.',
                icon: 'home'
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

      {/* FAQ SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Common Dependent Visa Concerns
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Can my spouse apply for a visa after I have already arrived abroad?',
              a: 'Yes! This is known as "Subsequent Entry." Your spouse and children can lodge their dependent visa applications at any point during your valid study permit duration once you provide your enrollment letter and housing proof.'
            },
            {
              q: 'Is a formal registered marriage required, or can common-law partners apply?',
              a: 'Countries like Canada and Australia recognize common-law or de facto partners if you provide proof of at least 12 consecutive months of living together (joint lease, shared bank accounts, utility bills).'
            },
            {
              q: 'Are my children eligible for free public education while I study?',
              a: 'In Canada, minor children of international student parents are eligible for free public schooling. In Australia and the UK, free or heavily subsidized public education is granted depending on your degree level and specific state rules.'
            },
            {
              q: 'Can my spouse work full-time on a dependent visa?',
              a: 'In Canada (SOWP) and Australia (Subclass 500 for Master’s/PhD students), spouses enjoy full, unrestricted work rights. In the UK, spouses of eligible PhD/Master’s research students can work full-time.'
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
        <div className="bg-gradient-to-r from-indigo-700 via-blue-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 bg-white/10 text-indigo-200 rounded-full text-xs font-extrabold uppercase tracking-widest border border-white/20">
              Seamless Family Transition
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Plan Your Family's Overseas Move Today
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Don't study miles away from your loved ones. Get a personalized dependent visa strategy from our senior immigration team.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-full font-extrabold text-sm shadow-xl transition-all cursor-pointer"
              >
                Book Free Dependent Consultation
              </button>
              <button
                onClick={onBackToHome}
                className="w-full sm:w-auto px-6 py-3.5 bg-indigo-950/60 hover:bg-indigo-950 border border-indigo-400/30 text-white rounded-full font-bold text-sm transition-all cursor-pointer"
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

export default DependentVisaView;
