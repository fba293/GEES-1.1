/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Language Centers Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';

interface LanguageCentersViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (counselorName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const LanguageCentersView: React.FC<LanguageCentersViewProps> = ({
  onBackToHome,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCourseModal, setSelectedCourseModal] = useState<any | null>(null);

  const filterTabs = [
    { label: 'All Programs', id: 'all' },
    { label: 'IELTS Academic 🇬🇧', id: 'ielts' },
    { label: 'PTE Academic 🇦🇺', id: 'pte' },
    { label: 'EAP Pathways 🎓', id: 'eap' },
    { label: 'Online Live 🌐', id: 'online' },
  ];

  const coursesList = [
    {
      id: 'ielts-masterclass',
      title: 'IELTS Academic Masterclass (7.5+ Target)',
      category: 'ielts',
      badge: 'British Council Partner',
      duration: '8 Weeks (48 Class Hours)',
      format: 'In-Person & Online Live',
      rating: '4.9 ★',
      studentsEnrolled: '4,200+ Students',
      priceUSD: '$180',
      description:
        'Comprehensive training covering Listening, Reading, Writing (Task 1 & 2), and Speaking with 1-on-1 mock interviews by British Council certified trainers.',
      highlights: [
        '10 Full-Length Computer-Delivered Mock Exams',
        'Daily Essay Evaluation & Feedback within 24 Hrs',
        'Direct Free British Council Test Registration Service',
        'Free Official IELTS Cambridge Practice Books'
      ],
      icon: 'school'
    },
    {
      id: 'pte-express',
      title: 'PTE Academic Express Bootcamp',
      category: 'pte',
      badge: 'Pearson Accredited',
      duration: '4 Weeks Intensive (30 Hours)',
      format: 'Computer Lab & Hybrid',
      rating: '4.95 ★',
      studentsEnrolled: '2,800+ Students',
      priceUSD: '$150',
      description:
        'AI-driven PTE test strategies, template scoring hacks, microphone pronunciation calibration, and mock test scoring matching Pearson algorithms.',
      highlights: [
        'Real Exam Memory Question Bank Access',
        'Automated AI Essay & Pronunciation Scoring',
        'Guaranteed Score Improvement Strategy',
        'Flexible Evening & Weekend Batches'
      ],
      icon: 'laptop_mac'
    },
    {
      id: 'eap-pathway',
      title: 'English for Academic Purposes (EAP Pathway)',
      category: 'eap',
      badge: 'IELTS Waiver Pathway',
      duration: '12 Weeks (Direct Entry)',
      format: 'In-Person Immersion',
      rating: '5.0 ★',
      studentsEnrolled: '1,500+ Graduates',
      priceUSD: '$350',
      description:
        'Direct university language waiver pathway. Complete EAP Level 3 to fulfill English requirements for 40+ partner universities in Malaysia and the UK without taking IELTS.',
      highlights: [
        '100% Direct Admission Waiver to Partner Unis',
        'Academic Research Writing & Presentation Skills',
        'University Seminar Simulation & Group Debates',
        'Full Academic Transcript Issued upon Completion'
      ],
      icon: 'verified'
    },
    {
      id: 'duolingo-toefl-fasttrack',
      title: 'Duolingo & TOEFL iBT Fast-Track',
      category: 'online',
      badge: 'Rapid 14-Day Prep',
      duration: '2 Weeks (16 Hours)',
      format: '100% Online Live Hub',
      rating: '4.8 ★',
      studentsEnrolled: '1,900+ Students',
      priceUSD: '$120',
      description:
        'Fastest route for urgent intake deadlines. Tailored strategies for the 1-hour Duolingo English Test (DET) and TOEFL iBT home edition.',
      highlights: [
        'Instant Diagnostic Score Assessment',
        'Emergency 3-Day Crash Course Option',
        'Production & Comprehension Skill Drills',
        'Adaptive AI Test Taking Strategies'
      ],
      icon: 'bolt'
    }
  ];

  const filteredCourses = activeTab === 'all'
    ? coursesList
    : coursesList.filter(c => c.category === activeTab);

  return (
    <div className="w-full bg-white dark:bg-[#070b19] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(251,176,52,0.15),transparent_50%)]"></div>
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
              <span className="material-symbols-outlined text-sm">translate</span>
              <span>Official Test Preparation Centers</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
              GEES <span className="text-[#fbb034]">Language Centers</span> & Test Prep
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
              Master IELTS, PTE Academic, and Academic English with certified trainers, high-tech simulation computer labs, and direct university offer waivers.
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#fbb034]">99.2%</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Language Pass Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">7.5+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Average IELTS Score</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#fbb034]">10,000+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Students Trained</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">40+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">IELTS Waiver Unis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Navigation Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fbb034]">verified_user</span>
            <span>Select Your Target Language Qualification:</span>
          </div>
          <AnimatedTabs
            tabs={filterTabs}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id)}
            size="sm"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">{course.icon}</span>
                    <span>{course.badge}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    {course.rating} ({course.studentsEnrolled})
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-display">
                  {course.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Course Meta Info */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Duration:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.duration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Class Format:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.format}</strong>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-8">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Key Course Highlights</span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {course.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500 text-sm shrink-0">check_circle</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Course Fee</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{course.priceUSD}</span>
                </div>
                <button
                  onClick={() => setSelectedCourseModal(course)}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 cursor-pointer transition-transform active:scale-95"
                >
                  Enroll or Book Mock Test
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* GEES Physical Center Locations */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-500 block mb-1">Campus Network</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Visit Our State-of-the-Art Language Labs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Equipped with computerized testing consoles, quiet speaking booths, and native instructor consultation suites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-2">🇧🇩</div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Dhaka Language Center</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Level 10, Green City Regency, Kakrail, Dhaka 1000.</p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <span>Computer Lab & Exam Center</span>
                <span className="material-symbols-outlined text-sm">map</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-2">🇲🇾</div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Subang Jaya Language Hub</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">USJ 19 City Mall, Level 1, Subang Jaya, Selangor 47620.</p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <span>EAP University Pathway Lab</span>
                <span className="material-symbols-outlined text-sm">map</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-2">🌐</div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Global Virtual Live Hub</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Interactive 1-on-1 and small group live Zoom classrooms.</p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Available 24/7 Worldwide</span>
                <span className="material-symbols-outlined text-sm">wifi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Modal */}
        {selectedCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                  <span className="material-symbols-outlined">{selectedCourseModal.icon}</span>
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block">Course Registration</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{selectedCourseModal.title}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Book a free diagnostic placement assessment or register for the upcoming batch starting next Monday.
              </p>

              <div className="space-y-3 mb-6 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Batch Schedule</span>
                  <strong className="text-slate-900 dark:text-white">Morning / Evening / Weekend</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Diagnostic Test</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">100% Free Consultation</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedCourseModal(null);
                    onOpenConsultation?.(`Enrollment request for ${selectedCourseModal.title}`);
                  }}
                  className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm text-center shadow-lg cursor-pointer"
                >
                  Proceed with Free Registration
                </button>
                <button
                  onClick={() => setSelectedCourseModal(null)}
                  className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pre-Footer Banner CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Unsure which English test you need?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
              Take our 15-minute free online diagnostic English placement test or speak with an expert academic advisor.
            </p>
          </div>
          <InteractiveHoverButton
            text="Take Free Diagnostic Test"
            onClick={() => onOpenConsultation?.('Free Language Placement Test')}
            className="shrink-0 font-bold"
          />
        </div>
      </div>
    </div>
  );
};
