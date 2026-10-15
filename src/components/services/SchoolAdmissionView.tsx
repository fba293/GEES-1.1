/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone K-12 School & Boarding Admission Services Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface SchoolAdmissionViewProps {
  onBackToHome: () => void;
  onOpenConsultation: (serviceName?: string) => void;
  onNavigate: (view: string, payload?: any) => void;
}

export const SchoolAdmissionView: React.FC<SchoolAdmissionViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  // Grade & Age Placement Calculator State
  const [studentAge, setStudentAge] = useState<string>('12');
  const [targetCurriculum, setTargetCurriculum] = useState<string>('British (IGCSE / A-Levels)');
  const [preferredCountry, setPreferredCountry] = useState<string>('Malaysia');
  const [boardingPreference, setBoardingPreference] = useState<string>('Day School with Parent');

  // School Tier Filter
  const [activeCurriculumFilter, setActiveCurriculumFilter] = useState<string>('all');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-indigo-300 font-medium mb-6">
            <button onClick={onBackToHome} className="hover:underline flex items-center gap-1 cursor-pointer">
              <span>Home</span>
            </button>
            <span>/</span>
            <button onClick={() => onNavigate('services')} className="hover:underline flex items-center gap-1 cursor-pointer">
              <span>Services</span>
            </button>
            <span>/</span>
            <span className="text-white font-semibold">School Admission</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>K-12 Primary, Secondary & Boarding Placement</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                International School & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-sky-300">Boarding Admissions</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Give your child a world-class educational foundation. GEES assists families with admissions to top British, IB World, and American international schools, boarding facilities, and guardian visa arrangements.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <InteractiveHoverButton
                  text="Book Parent Consultation"
                  className="bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-900/40 text-sm sm:text-base font-bold py-3.5 px-7 rounded-full"
                  onClick={() => onOpenConsultation('International School Placement')}
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('grade-calculator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">child_care</span>
                  <span>Age & Grade Matcher</span>
                </button>
              </div>

              {/* Stat Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">120+</div>
                  <div className="text-xs text-indigo-200">Partner K-12 Schools</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
                  <div className="text-xs text-indigo-200">Guardian Visa Rate</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-sky-300">Ages 5-18</div>
                  <div className="text-xs text-indigo-200">Full K-12 Spectrum</div>
                </div>
              </div>
            </div>

            {/* Right Banner / Image Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                      🏫
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">International Curricula</h3>
                      <p className="text-xs text-slate-300">Global Recognition & Direct University Entry</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <div className="text-xs font-bold text-white">British Curriculum (IGCSE & A-Levels)</div>
                        <div className="text-[11px] text-slate-300">Years 1 - 13 | Edexcel & Cambridge</div>
                      </div>
                    </div>
                    <span className="text-xs text-amber-300 font-semibold font-mono">UK Standard</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <div className="text-xs font-bold text-white">IB World Schools (PYP, MYP, IBDP)</div>
                        <div className="text-[11px] text-slate-300">International Baccalaureate Diploma</div>
                      </div>
                    </div>
                    <span className="text-xs text-sky-300 font-semibold font-mono">Holistic</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏰</span>
                      <div>
                        <div className="text-xs font-bold text-white">Elite Boarding Facilities</div>
                        <div className="text-[11px] text-slate-300">Full Pastoral Care, Meals & 24/7 Security</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-300 font-semibold font-mono">Full Care</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenConsultation('School Campus Tour & Admission')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg text-center cursor-pointer"
                >
                  Schedule Private School Campus Visit →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* K-12 PATHWAY SPECTRUM */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Education Stages
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            Tailored School Placement for Every Age Group
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            GEES guides families through entry requirements, entrance tests (CAT4/CEM), English assessments, and guardian visa compliance across four key academic stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              stage: 'Primary School',
              age: 'Ages 5 - 10',
              years: 'Years 1 - 6 (Grade 1 - 5)',
              desc: 'Early learning environment fostering inquiry, literacy, and fundamental STEM skills. Guardian visa support for accompanying mother or father.',
              icon: 'child_friendly',
              color: 'from-pink-500 to-rose-600'
            },
            {
              stage: 'Middle School',
              age: 'Ages 11 - 13',
              years: 'Years 7 - 9 (Grade 6 - 8)',
              desc: 'Transition to subject-specialist teaching, languages, art, and competitive sports. Preparation for lower secondary examinations.',
              icon: 'school',
              color: 'from-blue-500 to-indigo-600'
            },
            {
              stage: 'IGCSE & High School',
              age: 'Ages 14 - 16',
              years: 'Years 10 - 11 (Grade 9 - 10)',
              desc: 'Rigorous 2-year IGCSE/GCSE curriculum with 7-9 examination subjects. Sets baseline credentials for top global university entry.',
              icon: 'history_edu',
              color: 'from-amber-500 to-orange-600'
            },
            {
              stage: 'A-Levels & IB Diploma',
              age: 'Ages 16 - 18',
              years: 'Years 12 - 13 (Grade 11 - 12)',
              desc: 'Pre-university sixth form qualification. Advanced subject specialization required for Oxford, Cambridge, Ivy League, and medicine degrees.',
              icon: 'workspace_premium',
              color: 'from-emerald-500 to-teal-600'
            }
          ].map((item) => (
            <div
              key={item.stage}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.age}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.stage}</h3>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{item.years}</div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{item.desc}</p>
              </div>

              <button
                onClick={() => onOpenConsultation(`School Placement - ${item.stage}`)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-900 dark:text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
              >
                Inquire for {item.stage} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AGE & GRADE PLACEMENT CALCULATOR */}
      <section id="grade-calculator" className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Smart Age Matcher
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Determine Your Child's Ideal School Year
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                International school entry cut-off dates differ across British, American, and IB curriculum calendars. Input your child's current age to verify academic placement.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>August / September vs. January academic intake matching</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>CAT4 / Cognitive Ability Entrance Exam benchmark</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>Parent Guardian Visa eligibility calculation</span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Box */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Child's Age (Years)
                  </label>
                  <select
                    value={studentAge}
                    onChange={(e) => setStudentAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="6">6 Years Old (Primary Entry)</option>
                    <option value="8">8 Years Old (Junior Primary)</option>
                    <option value="12">12 Years Old (Middle School Entry)</option>
                    <option value="14">14 Years Old (IGCSE / High School)</option>
                    <option value="16">16 Years Old (A-Level / IBDP Sixth Form)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Curriculum
                  </label>
                  <select
                    value={targetCurriculum}
                    onChange={(e) => setTargetCurriculum(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="British (IGCSE / A-Levels)">British Curriculum (National Curriculum for England)</option>
                    <option value="IB World School">International Baccalaureate (IB PYP / MYP / IBDP)</option>
                    <option value="American AP Curriculum">American Curriculum (High School Diploma + APs)</option>
                    <option value="Australian Curriculum">Australian Curriculum (SACE / HSC Pathways)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Destination
                  </label>
                  <select
                    value={preferredCountry}
                    onChange={(e) => setPreferredCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Malaysia">Malaysia (Kuala Lumpur & Johor Top Schools)</option>
                    <option value="United Kingdom">United Kingdom (British Boarding & Day Schools)</option>
                    <option value="Singapore">Singapore (International Campuses)</option>
                    <option value="Australia">Australia (Sydney & Melbourne Private Schools)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Accommodation Style
                  </label>
                  <select
                    value={boardingPreference}
                    onChange={(e) => setBoardingPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Day School with Parent">Day Student (Living with Parent / Guardian)</option>
                    <option value="Full Boarding">Full Boarding (Living on School Campus 24/7)</option>
                    <option value="Weekly Boarding">Weekly Boarding (Home on Weekends)</option>
                  </select>
                </div>
              </div>

              {/* Match Result Output */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Calculated Placement Result
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-xs">
                    AGE ELIGIBLE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  A <strong>{studentAge}-year-old student</strong> placing in <strong>{preferredCountry}</strong> under the <strong>{targetCurriculum}</strong> is matched to <strong>Year {Number(studentAge) - 5} / Grade {Number(studentAge) - 6}</strong>. Eligible for <strong>{boardingPreference}</strong> with guardian visa coverage.
                </p>
              </div>

              <button
                onClick={() => onOpenConsultation(`School Placement Inquiry for ${studentAge}yo in ${preferredCountry}`)}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg text-center cursor-pointer"
              >
                Get Custom School Fee & Prospectus Guide →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PARENT & GUARDIAN WELFARE SERVICES */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Comprehensive Parent & Student Support
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            GEES ensures young learners and their families feel completely safe, integrated, and supported from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">family_restroom</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Parent Guardian Visa</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Assistance with official Dependent and Guardian Visa applications allowing mothers or fathers to accompany students under 18 during their international schooling.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">apartment</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Campus Guided Tours</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We organize private VIP campus tours, meetings with school principals and admissions directors, and walkthroughs of boarding houses and athletic centers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">psychology</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">CAT4 & Assessment Prep</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Practice CAT4 cognitive testing materials, English placement assessments, and interview prep for students entering competitive top-tier international schools.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL PARENT CONSULTATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold">Invest in Your Child's International Future</h2>
            <p className="text-sm sm:text-base text-indigo-200">
              Speak with a GEES K-12 School Admissions Specialist today. Receive customized school prospectuses, tuition fee breakdowns, and enrollment deadlines.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <InteractiveHoverButton
              text="Request School Admissions Pack"
              className="bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold py-3.5 px-8 rounded-full text-sm sm:text-base shadow-xl"
              onClick={() => onOpenConsultation('Full K-12 School Admissions Pack')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
