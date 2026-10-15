/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Admission Support Services Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';

interface AdmissionSupportViewProps {
  onBackToHome: () => void;
  onOpenConsultation: (serviceName?: string) => void;
  onNavigate: (view: string, payload?: any) => void;
}

export const AdmissionSupportView: React.FC<AdmissionSupportViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  // Eligibility & Matching State
  const [degreeLevel, setDegreeLevel] = useState<'bachelor' | 'master' | 'phd'>('master');
  const [gpaScore, setGpaScore] = useState<string>('3.2');
  const [englishScore, setEnglishScore] = useState<string>('6.5');
  const [targetIntake, setTargetIntake] = useState<string>('Fall 2026');
  const [budgetRange, setBudgetRange] = useState<string>('$15,000 - $25,000 / year');

  // Interactive Document Checklist State
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    passport: true,
    transcripts: true,
    sop: false,
    lor: false,
    cv: true,
    ielts: false
  });

  const toggleDoc = (key: string) => {
    setCheckedDocs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateDocProgress = () => {
    const total = Object.keys(checkedDocs).length;
    const completed = Object.values(checkedDocs).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-300 font-medium mb-6">
            <button onClick={onBackToHome} className="hover:underline flex items-center gap-1 cursor-pointer">
              <span>Home</span>
            </button>
            <span>/</span>
            <button onClick={() => onNavigate('services')} className="hover:underline flex items-center gap-1 cursor-pointer">
              <span>Services</span>
            </button>
            <span>/</span>
            <span className="text-white font-semibold">Admission Support</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>GEES Guaranteed University Offer Services</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                University Admission & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Application Support</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Unlock top global universities with direct institution partnerships. GEES certified counselors handle your end-to-end admission process with a <strong className="text-white font-semibold">99.4% offer letter acceptance rate</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <InteractiveHoverButton
                  text="Get Free Admission Review"
                  className="bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/40 text-sm sm:text-base font-bold py-3.5 px-7 rounded-full"
                  onClick={() => onOpenConsultation('Admission Support Services')}
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('admission-calculator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">calculate</span>
                  <span>Check Eligibility</span>
                </button>
              </div>

              {/* Stat Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">15,000+</div>
                  <div className="text-xs text-blue-200">Offers Letter Issued</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99.4%</div>
                  <div className="text-xs text-blue-200">Success Rate</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-sky-300">7 Days</div>
                  <div className="text-xs text-blue-200">Fast-Track Turnaround</div>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Banner */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
                      🎓
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Direct University Partner</h3>
                      <p className="text-xs text-slate-300">Authorized Admission Office</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                    ACTIVE INTAKES
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <div className="text-xs font-bold text-white">UK Universities</div>
                        <div className="text-[11px] text-slate-300">September 2026 & January 2027</div>
                      </div>
                    </div>
                    <span className="text-xs text-blue-300 font-semibold">Fast Offer</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇦🇺</span>
                      <div>
                        <div className="text-xs font-bold text-white">Australian Universities</div>
                        <div className="text-[11px] text-slate-300">July 2026 & February 2027</div>
                      </div>
                    </div>
                    <span className="text-xs text-blue-300 font-semibold">GTE Verified</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇲🇾</span>
                      <div>
                        <div className="text-xs font-bold text-white">Malaysian Campuses</div>
                        <div className="text-[11px] text-slate-300">Multiple Monthly Intakes</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-300 font-semibold">0% App Fee</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenConsultation('Direct Partner Application')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg text-center cursor-pointer"
                >
                  Apply Directly to 1,200+ Partner Campuses →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADMISSION LIFECYCLE STEPS */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            End-To-End Support Protocol
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            How GEES Guarantees Your University Admission
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            A structured, 6-stage application management framework designed to eliminate admission rejections and secure partial/full scholarships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Academic & Profile Audit',
              desc: 'Detailed evaluation of academic transcripts, backlogs, gaps, work experience, and research objectives to pinpoint suitable universities.',
              icon: 'analytics',
              badge: 'Stage 1'
            },
            {
              step: '02',
              title: 'SOP & LOR Refinement',
              desc: 'Professional editing of your Statement of Purpose (SOP), Personal Statement, and Letters of Recommendation tailored to specific faculty committees.',
              icon: 'edit_note',
              badge: 'Stage 2'
            },
            {
              step: '03',
              title: 'Targeted Shortlisting',
              desc: 'Curation of Dream, Reach, and Safe university options based on tuition budget, post-study work rights, and ROI expectations.',
              icon: 'checklist',
              badge: 'Stage 3'
            },
            {
              step: '04',
              title: 'Direct Application Dispatch',
              desc: 'Submitting application files directly to university international admissions portals with fee waivers for GEES partnered institutions.',
              icon: 'send',
              badge: 'Stage 4'
            },
            {
              step: '05',
              title: 'Offer Letter Processing',
              desc: 'Tracking conditional and unconditional offer letters, clearing offer conditions, and negotiating merit-based scholarship awards.',
              icon: 'verified_user',
              badge: 'Stage 5'
            },
            {
              step: '06',
              title: 'CAS / I-20 & Acceptance',
              desc: 'Assistance with tuition deposit payment, financial verification, and obtaining official Confirmation of Acceptance for Studies (CAS) / I-20.',
              icon: 'workspace_premium',
              badge: 'Stage 6'
            }
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-200 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 opacity-30 group-hover:opacity-100 transition-opacity">
                  {s.step}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {s.badge}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[26px]">{s.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ELIGIBILITY & MATCHING CALCULATOR */}
      <section id="admission-calculator" className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Instant University Matcher
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Calculate Your Admission Probability
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Select your academic profile details to view recommended university tiers, estimated offer timelines, and eligible scholarship pools.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>Instant GPA and IELTS requirement benchmark</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>Free application fee waiver eligibility check</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>Direct submission to 1,200+ global partner campuses</span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Form */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Degree Level
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="bachelor">Bachelor's Degree (Undergraduate)</option>
                    <option value="master">Master's Degree (Postgraduate)</option>
                    <option value="phd">Doctorate / PhD Program</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Current GPA / Percentage
                  </label>
                  <select
                    value={gpaScore}
                    onChange={(e) => setGpaScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="3.8">GPA 3.8 - 4.0 (85%+ Excellent)</option>
                    <option value="3.2">GPA 3.0 - 3.7 (75%+ Very Good)</option>
                    <option value="2.5">GPA 2.5 - 2.9 (65%+ Good)</option>
                    <option value="2.0">GPA 2.0 - 2.4 (Pass / Foundation Needed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    English Test Score
                  </label>
                  <select
                    value={englishScore}
                    onChange={(e) => setEnglishScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="7.5">IELTS 7.5 / PTE 76+ / TOEFL 100+</option>
                    <option value="6.5">IELTS 6.5 / PTE 62 / TOEFL 88</option>
                    <option value="6.0">IELTS 6.0 / PTE 54 / Duolingo 105</option>
                    <option value="none">No English Test Yet (MOI Eligible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Intake
                  </label>
                  <select
                    value={targetIntake}
                    onChange={(e) => setTargetIntake(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Fall 2026">September / October 2026</option>
                    <option value="Spring 2027">January / February 2027</option>
                    <option value="Summer 2026">May / June 2026</option>
                  </select>
                </div>
              </div>

              {/* Match Result Preview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Calculated Profile Rating
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-xs">
                    HIGH MATCH (98%)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  Based on <strong>GPA {gpaScore}</strong> and <strong>{englishScore === 'none' ? 'Medium of Instruction Waiver' : `English Score ${englishScore}`}</strong>, you qualify for direct admission to <strong>45+ Partner Universities</strong> in the UK, Australia, and Malaysia with potential scholarships ranging from <strong>15% to 50% tuition reduction</strong>.
                </p>
              </div>

              <button
                onClick={() => onOpenConsultation(`Admission Review for ${degreeLevel.toUpperCase()} - ${targetIntake}`)}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg text-center cursor-pointer"
              >
                Get Custom University Shortlist Report →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT CHECKLIST BUILDER */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                Interactive Preparation Tool
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
                Admission Document Checklist
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
                Check off your prepared documents to calculate your application readiness score. GEES document specialists review every file before final submission.
              </p>
            </div>

            {/* Document Items */}
            <div className="space-y-3">
              {[
                { id: 'passport', title: 'Valid Passport (Min 18 Months Validity)', desc: 'Scan of bio page and signature page' },
                { id: 'transcripts', title: 'Academic Certificates & Transcripts', desc: 'High school, Bachelor diploma, and semester marksheets' },
                { id: 'sop', title: 'Statement of Purpose (SOP / Personal Essay)', desc: '500-800 word academic motivation statement' },
                { id: 'lor', title: 'Letters of Recommendation (2 LORs)', desc: 'Academic professor or employer recommendation letters' },
                { id: 'cv', title: 'Updated Academic Resume / CV', desc: 'Including education timeline, work experience, and research' },
                { id: 'ielts', title: 'English Proficiency Score Report', desc: 'IELTS Academic, PTE, TOEFL iBT, or Duolingo certificate' }
              ].map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    checkedDocs[doc.id]
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                      checkedDocs[doc.id] ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-700 text-transparent'
                    }`}>
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{doc.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${checkedDocs[doc.id] ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {checkedDocs[doc.id] ? 'Ready' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Readiness Score</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Based on your document checklist selection</p>
                </div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {calculateDocProgress()}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${calculateDocProgress()}%` }}
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <p>
                  💡 <strong>Need help writing your SOP or securing LORs?</strong>
                </p>
                <p>
                  GEES provides professional document editing services, SOP samples tailored to your field of study, and letter templates for academic references.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onOpenConsultation('Free SOP & Document Review')}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md text-center cursor-pointer"
                >
                  Submit My Documents for Pre-Check →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE TIERS */}
      <section className="py-16 sm:py-24 bg-slate-100 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              GEES Admission Support Packages
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
              Transparent, student-first support levels crafted for various academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Partner Universities
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Direct Application</h3>
                <div className="text-3xl font-black text-slate-900 dark:text-white">FREE</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">0 counseling fee for partner university admissions</p>
                <hr className="border-slate-100 dark:border-slate-800" />
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">✓ Application Fee Waiver</li>
                  <li className="flex items-center gap-2">✓ Up to 5 Partner University Submissions</li>
                  <li className="flex items-center gap-2">✓ SOP Basic Review & Proofreading</li>
                  <li className="flex items-center gap-2">✓ Fast-Track Offer Letter Processing</li>
                  <li className="flex items-center gap-2">✓ CAS / I-20 Document Assistance</li>
                </ul>
              </div>
              <button
                onClick={() => onOpenConsultation('Free Partner Admission Package')}
                className="w-full mt-8 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer"
              >
                Apply Free Now
              </button>
            </div>

            {/* Tier 2 (Featured) */}
            <div className="bg-gradient-to-b from-blue-900 to-indigo-950 rounded-3xl p-8 border-2 border-blue-500 shadow-2xl text-white relative flex flex-col justify-between transform lg:-translate-y-2">
              <div className="absolute -top-3.5 right-6 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Top 100 Universities
                </span>
                <h3 className="text-2xl font-bold text-white">Russell Group & G8 Elite</h3>
                <div className="text-3xl font-black text-white">Full Placement</div>
                <p className="text-xs text-blue-200">Guaranteed offer processing with scholarship optimization</p>
                <hr className="border-white/10" />
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-center gap-2">✓ 8 Target University Submissions</li>
                  <li className="flex items-center gap-2">✓ Professional SOP Writing & Editing</li>
                  <li className="flex items-center gap-2">✓ LOR Customization per Faculty</li>
                  <li className="flex items-center gap-2">✓ Scholarship Essay Preparation</li>
                  <li className="flex items-center gap-2">✓ University Admission Interview Coaching</li>
                </ul>
              </div>
              <button
                onClick={() => onOpenConsultation('Elite Placement Package')}
                className="w-full mt-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm transition-colors text-center shadow-lg cursor-pointer"
              >
                Get Elite Admission Plan
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Postgraduate Research
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">PhD & Research Doctorate</h3>
                <div className="text-3xl font-black text-slate-900 dark:text-white">Research Focus</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Supervisor matching and research proposal development</p>
                <hr className="border-slate-100 dark:border-slate-800" />
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">✓ Supervisor Outreach & Email Cold Calling</li>
                  <li className="flex items-center gap-2">✓ Research Proposal Editing & Formatting</li>
                  <li className="flex items-center gap-2">✓ Research Council Scholarship Prep</li>
                  <li className="flex items-center gap-2">✓ Academic Reference Verification</li>
                  <li className="flex items-center gap-2">✓ Viva Voce Mock Interview Prep</li>
                </ul>
              </div>
              <button
                onClick={() => onOpenConsultation('PhD Research Admission Package')}
                className="w-full mt-8 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer"
              >
                Consult Research Advisor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions About Admission
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How long does it take to receive a university offer letter?',
              a: 'Conditional offer letters from GEES partner institutions are usually issued within 3 to 7 working days. For non-partner or elite institutions (e.g. UK Russell Group or Australian Group of Eight), processing takes between 2 to 4 weeks.'
            },
            {
              q: 'Can I apply for university admission before taking my IELTS/TOEFL exam?',
              a: 'Yes! Most universities issue Conditional Offer Letters based on your academic transcripts first. You can submit your official English test score report later before final acceptance.'
            },
            {
              q: 'Are there application fee waivers available through GEES?',
              a: 'Yes, because GEES is an authorized university intake representative, application fees ranging from $50 to $150 are waived for over 1,200 partnered campuses worldwide.'
            },
            {
              q: 'What if I have backlogs or study gaps in my academic record?',
              a: 'Study gaps can be explained with valid work experience letters, short course certifications, or personal statement explanations. Our admission specialists help frame your gaps positively.'
            }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{item.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CONSULTATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold">Ready to Secure Your University Offer Letter?</h2>
            <p className="text-sm sm:text-base text-blue-100">
              Book a 1-on-1 session with a GEES Certified Admission Officer today. Zero obligation. Fast-track admission processing.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <InteractiveHoverButton
              text="Book Free Admission Session"
              className="bg-white text-blue-900 hover:bg-slate-100 font-bold py-3.5 px-8 rounded-full text-sm sm:text-base shadow-xl"
              onClick={() => onOpenConsultation('Direct Admission Session')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
