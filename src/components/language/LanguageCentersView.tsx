/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Language Centers & Test Prep Page
 * Built on the shared GEES Explorer Theme (ExplorerPageShell, ExplorerHeroBanner, SectionHeader).
 */

import React, { useState, useMemo } from 'react';
import {
  EXPLORER_THEME,
  ExplorerCtaBanner,
  ExplorerEmptyState,
  ExplorerFilterBar,
  ExplorerHeroBanner,
  ExplorerHeroMetrics,
  ExplorerPageShell,
  SectionHeader,
} from '../portal/ExplorerTheme.tsx';

interface LanguageCentersViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (counselorName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

interface LanguageProgram {
  id: string;
  title: string;
  category: string;
  badge: string;
  duration: string;
  format: string;
  rating: string;
  studentsEnrolled: string;
  priceUSD: string;
  description: string;
  highlights: string[];
  icon: string;
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Programs' },
  { id: 'ielts', label: 'IELTS Academic' },
  { id: 'pte', label: 'PTE Academic' },
  { id: 'eap', label: 'EAP Pathways' },
  { id: 'online', label: 'Online Live' },
];

const COURSES_LIST: LanguageProgram[] = [
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
      'Free Official IELTS Cambridge Practice Books',
    ],
    icon: 'school',
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
      'Flexible Evening & Weekend Batches',
    ],
    icon: 'laptop_mac',
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
      'Full Academic Transcript Issued upon Completion',
    ],
    icon: 'verified',
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
      'Adaptive AI Test Taking Strategies',
    ],
    icon: 'bolt',
  },
];

const CAMPUS_LABS = [
  {
    id: 'dhaka',
    flag: '🇧🇩',
    name: 'Dhaka Language Center',
    address: 'Level 10, Green City Regency, Kakrail, Dhaka 1000.',
    facility: 'Computer Lab & Exam Center',
    icon: 'map',
  },
  {
    id: 'subang',
    flag: '🇲🇾',
    name: 'Subang Jaya Language Hub',
    address: 'USJ 19 City Mall, Level 1, Subang Jaya, Selangor 47620.',
    facility: 'EAP University Pathway Lab',
    icon: 'map',
  },
  {
    id: 'virtual',
    flag: '🌐',
    name: 'Global Virtual Live Hub',
    address: 'Interactive 1-on-1 and small group live Zoom classrooms.',
    facility: 'Available 24/7 Worldwide',
    icon: 'wifi',
  },
];

export const LanguageCentersView: React.FC<LanguageCentersViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourseModal, setSelectedCourseModal] = useState<LanguageProgram | null>(null);

  const handleGoHome = () => {
    if (onBackToHome) onBackToHome();
    else onNavigate?.('home');
  };

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return COURSES_LIST.filter((course) => {
      const matchesTab = activeTab === 'all' || course.category === activeTab;
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.badge.toLowerCase().includes(q) ||
        course.highlights.some((h) => h.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const hasActiveFilters = activeTab !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
  };

  return (
    <ExplorerPageShell>
      {/* 1. Shared Dark-Navy Explorer Hero Banner & Full-Width Search */}
      <ExplorerHeroBanner
        dataPurpose="language-testprep-hero-banner"
        onNavigateHome={handleGoHome}
        breadcrumbs={[{ label: 'Language Centers & Test Prep' }]}
        titlePrefix="GEES"
        titleHighlight="Language Centers"
        titleSuffix="& Test Prep"
        subtitle="Master IELTS, PTE Academic, and EAP university pathways with certified trainers and simulation labs"
        rightSlot={
          <ExplorerHeroMetrics
            items={[
              { value: '99.2%', label: 'Language Pass Rate' },
              { value: '7.5', suffix: '+', label: 'Average IELTS Score' },
              { value: '10,000', suffix: '+', label: 'Students Trained' },
              { value: '40', suffix: '+', label: 'IELTS Waiver Unis' },
            ]}
          />
        }
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search IELTS, PTE Academic, EAP waiver pathways, or Duolingo fast-track...',
          ariaLabel: 'Search language centers and test prep programs',
        }}
      />

      {/* 2. Shared Section Header (Consistent mb-12 & Vertically Centered Title) */}
      <SectionHeader
        title="Test Preparation & Academic English Programs"
        subtitle="Choose your target English qualification or university language waiver pathway."
        countLabel={`(${filteredCourses.length.toLocaleString()})`}
      />

      {/* 3. Shared Quiet Filter Bar */}
      <ExplorerFilterBar
        options={FILTER_OPTIONS}
        activeId={activeTab}
        onSelect={setActiveTab}
        totalCount={filteredCourses.length}
        countEntityLabel="Programs"
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
      />

      {/* 4. Courses Grid or Shared Empty State */}
      {filteredCourses.length === 0 ? (
        <ExplorerEmptyState
          icon="translate"
          title="No test prep programs match your search"
          description="Try searching for IELTS, PTE, EAP, or Duolingo, or reset the active category filter."
          onReset={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className={`${EXPLORER_THEME.card} p-6 sm:p-7 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={EXPLORER_THEME.iconTile}>
                      <span className="material-symbols-outlined text-[22px]">{course.icon}</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-[#fbb034]">
                        {course.badge}
                      </div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {course.rating} · {course.studentsEnrolled}
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-[#fbb034] transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  {course.description}
                </p>

                {/* Program Metadata Block */}
                <div className="grid grid-cols-2 gap-3 mb-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Duration</span>
                    <strong className="text-slate-900 dark:text-slate-100">{course.duration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Class Format</span>
                    <strong className="text-slate-900 dark:text-slate-100">{course.format}</strong>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Key Course Highlights
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {course.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[15px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Course Fee
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                    {course.priceUSD}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourseModal(course)}
                  className={EXPLORER_THEME.primaryGoldButton}
                >
                  Enroll or Book Mock Test
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 5. Physical Campus Network Section with Shared SectionHeader (mb-12) */}
      <section className="mt-4">
        <SectionHeader
          title="Visit Our Language Labs & Testing Hubs"
          subtitle="Equipped with computerized testing consoles, speaking booths, and certified instructor consultation suites."
          countLabel={`(${CAMPUS_LABS.length})`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {CAMPUS_LABS.map((lab) => (
            <div
              key={lab.id}
              className={`${EXPLORER_THEME.card} ${EXPLORER_THEME.cardPadding} flex flex-col justify-between`}
            >
              <div>
                <div className="text-2xl mb-3">{lab.flag}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {lab.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {lab.address}
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{lab.facility}</span>
                <span className="material-symbols-outlined text-[16px] text-amber-600 dark:text-[#fbb034]">
                  {lab.icon}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Shared Dark-Navy Bottom Consultation CTA */}
      <ExplorerCtaBanner
        title="Unsure which English test or pathway you need?"
        description="Take our 15-minute free online diagnostic placement test or speak with an academic advisor to check IELTS waiver eligibility."
        primaryLabel="Take Free Diagnostic Test"
        onPrimaryClick={() => onOpenConsultation?.('Free Language Placement Test')}
        secondaryLabel="Browse Malaysia Language Centers"
        onSecondaryClick={onNavigate ? () => onNavigate('language-centers') : undefined}
      />

      {/* 7. Enrollment Modal */}
      {selectedCourseModal && (
        <div
          className={EXPLORER_THEME.modalBackdrop}
          onClick={() => setSelectedCourseModal(null)}
        >
          <div
            className={`${EXPLORER_THEME.modalPanel} max-w-xl space-y-5`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close registration modal"
              onClick={() => setSelectedCourseModal(null)}
              className="no-min-touch absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-start gap-3.5 pr-10">
              <div className={EXPLORER_THEME.iconTile}>
                <span className="material-symbols-outlined text-[22px]">
                  {selectedCourseModal.icon}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-amber-600 dark:text-[#fbb034] tracking-wider block">
                  Course Registration
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedCourseModal.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Book a free diagnostic placement assessment or register for the upcoming batch
              starting next Monday.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Batch Schedule
                </span>
                <strong className="text-slate-900 dark:text-white">
                  Morning / Evening / Weekend
                </strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Diagnostic Test
                </span>
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                  100% Free Consultation
                </strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const title = selectedCourseModal.title;
                  setSelectedCourseModal(null);
                  onOpenConsultation?.(`Enrollment request for ${title}`);
                }}
                className={`${EXPLORER_THEME.primaryGoldButton} flex-1`}
              >
                Proceed with Free Registration
              </button>
              <button
                type="button"
                onClick={() => setSelectedCourseModal(null)}
                className={EXPLORER_THEME.secondaryOutlineButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ExplorerPageShell>
  );
};
