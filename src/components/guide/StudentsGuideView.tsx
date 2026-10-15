/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone International Students Guide Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';

interface StudentsGuideViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (counselorName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const StudentsGuideView: React.FC<StudentsGuideViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState<string>('process');
  
  // Interactive checklist state
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    item1: true,
    item2: true,
    item3: false,
    item4: false,
    item5: false,
    item6: false,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPct = Math.round((completedCount / Object.keys(checkedItems).length) * 100);

  const guideTabs = [
    { label: '1. Admission Process 🎓', id: 'process' },
    { label: '2. Visa & Financials 🛂', id: 'visa' },
    { label: '3. Pre-Departure Checklist ✈️', id: 'checklist' },
    { label: '4. Destination Guide 🌍', id: 'countries' },
  ];

  const destinationCards = [
    {
      country: 'United Kingdom 🇬🇧',
      tuition: '£12,000 – £25,000 / Year',
      living: '£800 – £1,300 / Month',
      psw: '2 – 3 Years Graduate Visa',
      workRights: '20 Hours/Week during term',
      intakes: 'September / January / May',
      badge: 'Fast-Track 1-Year Master'
    },
    {
      country: 'Australia 🇦🇺',
      tuition: 'AU$ 22,000 – 42,000 / Year',
      living: 'AU$ 1,400 – 2,200 / Month',
      psw: '2 – 5 Years Post-Study Work',
      workRights: '48 Hours/Fortnight',
      intakes: 'February / July / November',
      badge: 'High Regional PR Pathway'
    },
    {
      country: 'Malaysia 🇲🇾',
      tuition: 'US$ 3,500 – 9,000 / Year',
      living: 'US$ 350 – 600 / Month',
      psw: 'EMGS Employment Pass Options',
      workRights: '20 Hours/Week (Vacation)',
      intakes: 'Feb / April / July / October',
      badge: 'UK/US Branch Campuses'
    },
    {
      country: 'New Zealand 🇳🇿',
      tuition: 'NZ$ 22,000 – 35,000 / Year',
      living: 'NZ$ 1,200 – 1,800 / Month',
      psw: 'Up to 3 Years PSW Visa',
      workRights: '20 Hours/Week',
      intakes: 'February / July',
      badge: 'Spouse Work Rights'
    }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-[#070b19] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,176,52,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-300 hover:text-amber-400 mb-6 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Home</span>
          </button>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">menu_book</span>
              <span>Official Student Handbook 2026</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
              International <span className="text-[#fbb034]">Students Guide</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
              Your step-by-step compass for university admission, student visa documentation, financial proof, pre-departure packing, and smooth arrival abroad.
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">STEP 1</span>
              <strong className="text-white text-sm block">University Selection</strong>
              <span className="text-slate-300">Matching goals & budgets</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">STEP 2</span>
              <strong className="text-white text-sm block">Offer & Scholarship</strong>
              <span className="text-slate-300">Free document review</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">STEP 3</span>
              <span className="text-white text-sm font-bold block">Visa Submission</span>
              <span className="text-slate-300">98.4% approval rate</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-amber-400 font-bold block mb-1">STEP 4</span>
              <span className="text-white text-sm font-bold block">Arrival & Housing</span>
              <span className="text-slate-300">Airport pickup & dorms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Section Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fbb034]">auto_stories</span>
            <span>Guide Chapter:</span>
          </span>
          <AnimatedTabs
            tabs={guideTabs}
            activeId={activeSection}
            onChange={(id) => setActiveSection(id)}
            size="sm"
          />
        </div>

        {/* SECTION 1: ADMISSION PROCESS */}
        {activeSection === 'process' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-4 flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xl font-bold">01</span>
                <span>The 6-Step Admission Journey</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                GEES simplifies university admissions into a structured, hassle-free roadmap. From initial consultation to receiving your unconditional offer letter.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    step: '01',
                    title: 'Free Profile Assessment',
                    desc: 'Our counselor evaluates your academic GPA, IELTS/PTE score, budget, and career goals to curate a shortlist of top 5 matching universities.'
                  },
                  {
                    step: '02',
                    title: 'Document Preparation',
                    desc: 'Guidance on editing your Statement of Purpose (SOP), Letters of Recommendation (LOR), CV, and transcript translations.'
                  },
                  {
                    step: '03',
                    title: 'Application Submission',
                    desc: 'Direct submission to official partner university admissions portals with application fee waivers.'
                  },
                  {
                    step: '04',
                    title: 'Offer Letter & Scholarship',
                    desc: 'Receive conditional/unconditional offer letters within 5-14 working days, along with scholarship award evaluations.'
                  },
                  {
                    step: '05',
                    title: 'Tuition Deposit & CAS/VAL',
                    desc: 'Pay required initial deposit directly to the university account to issue CAS (UK) or VAL (Malaysia).'
                  },
                  {
                    step: '06',
                    title: 'Visa Filing & Enrolment',
                    desc: 'Comprehensive embassy visa filing with 100% document audit prior to flight booking.'
                  }
                ].map((s) => (
                  <div key={s.step} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-black text-[#fbb034] block mb-1">PHASE {s.step}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: VISA & FINANCIALS */}
        {activeSection === 'visa' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-4 flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xl font-bold">02</span>
                <span>Student Visa & Financial Compliance</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Meeting embassy financial requirements is the most critical component of a student visa application. Here is what you need to prepare:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">account_balance</span>
                    <span>Bank Statement & Fund Holding Period</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>UK Visa:</strong> Bank balance covering 1 year tuition + 9 months living cost held consecutively for 28 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>Australia Visa:</strong> Financial proof for 1 year tuition + AU$24,505 living expenses + travel funds.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>Malaysia Visa (EMGS):</strong> Simple bank verification statement showing sufficient personal balance.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">verified_user</span>
                    <span>Mandatory Health & Medical Checks</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>TB Medical Test:</strong> Required at IOM approved panel clinics for UK and South Korea visas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>EMGS Pre-Arrival Medical:</strong> Required for Malaysia student visa approval.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>Overseas Student Health Cover (OSHC):</strong> Mandatory medical insurance for Australia.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: PRE-DEPARTURE CHECKLIST */}
        {activeSection === 'checklist' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xl font-bold">03</span>
                    <span>Pre-Departure Interactive Checklist</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Track your readiness before flying to your university campus.</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full sm:w-48 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Readiness</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{progressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'item1', title: 'Passport & Visa Stamp Copy', cat: 'Documents' },
                  { id: 'item2', title: 'Unconditional Offer Letter & CAS / VAL', cat: 'Documents' },
                  { id: 'item3', title: 'University Accommodation Booking Confirmation', cat: 'Housing' },
                  { id: 'item4', title: 'International Student Forex Card & Cash', cat: 'Finance' },
                  { id: 'item5', title: 'University Airport Pickup Form Submitted', cat: 'Travel' },
                  { id: 'item6', title: 'Vaccination Certificates & Prescription Meds', cat: 'Health' },
                ].map((chk) => (
                  <div
                    key={chk.id}
                    onClick={() => toggleCheck(chk.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      checkedItems[chk.id]
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        checkedItems[chk.id] ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}>
                        {checkedItems[chk.id] && '✓'}
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block">{chk.cat}</span>
                        <span className={`text-xs sm:text-sm font-bold ${checkedItems[chk.id] ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {chk.title}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: DESTINATIONS */}
        {activeSection === 'countries' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinationCards.map((d, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{d.country}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60">
                      {d.badge}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-medium">Tuition Fees:</span>
                      <strong className="text-slate-900 dark:text-white">{d.tuition}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-medium">Estimated Living Cost:</span>
                      <strong className="text-slate-900 dark:text-white">{d.living}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-medium">Post-Study Work (PSW):</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-bold">{d.psw}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-medium">Student Work Rights:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{d.workRights}</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400 font-medium">Main Intakes:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{d.intakes}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pre-Footer Banner CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Have specific questions for your destination?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
              Schedule a personalized 1-on-1 counseling session to discuss course selection, scholarship options, and visa preparation.
            </p>
          </div>
          <InteractiveHoverButton
            text="Book Free 1-on-1 Counseling"
            onClick={() => onOpenConsultation?.('Inquiry from Students Guide')}
            className="shrink-0 font-bold"
          />
        </div>
      </div>
    </div>
  );
};
