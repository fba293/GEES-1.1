/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Success Stories & Case Studies Page
 * Built on the shared GEES Explorer Theme (ExplorerPageShell, ExplorerHeroBanner, SectionHeader).
 */

import React, { useState, useMemo } from 'react';
import { mockTestimonials } from '../../data/mockDatabase.ts';
import { TestimonialStory } from '../../types/index.ts';
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

interface SuccessStoriesViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (counselorName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

const COUNTRY_OPTIONS = [
  { id: 'all', label: 'All Destinations' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'australia', label: 'Australia' },
  { id: 'malaysia', label: 'Malaysia' },
  { id: 'new zealand', label: 'New Zealand' },
];

export const SuccessStoriesView: React.FC<SuccessStoriesViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate,
}) => {
  const [activeCountry, setActiveCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStory, setSelectedStory] = useState<TestimonialStory | null>(null);

  const handleGoHome = () => {
    if (onBackToHome) onBackToHome();
    else onNavigate?.('home');
  };

  const filteredStories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockTestimonials.filter((story) => {
      const matchesCountry =
        activeCountry === 'all' || story.country.toLowerCase() === activeCountry.toLowerCase();
      const matchesSearch =
        !q ||
        story.name.toLowerCase().includes(q) ||
        story.university.toLowerCase().includes(q) ||
        story.degree.toLowerCase().includes(q) ||
        story.quote.toLowerCase().includes(q);
      return matchesCountry && matchesSearch;
    });
  }, [activeCountry, searchQuery]);

  const hasActiveFilters = activeCountry !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setActiveCountry('all');
    setSearchQuery('');
  };

  return (
    <ExplorerPageShell>
      {/* 1. Shared Dark-Navy Explorer Hero Banner & Full-Width Search */}
      <ExplorerHeroBanner
        dataPurpose="stories-hero-banner"
        onNavigateHome={handleGoHome}
        breadcrumbs={[{ label: 'Student Success Stories' }]}
        titlePrefix="Student"
        titleHighlight="Success Stories"
        titleSuffix="& Case Studies"
        subtitle="Real journeys of international students who secured university offers, scholarships, and visa approvals with GEES"
        rightSlot={
          <ExplorerHeroMetrics
            items={[
              { value: '15,000', suffix: '+', label: 'Students Placed' },
              { value: '98.4%', label: 'Visa Approval Rate' },
              { value: '$12.5M', suffix: '+', label: 'Scholarships Secured' },
              { value: '500', suffix: '+', label: 'Partner Universities' },
            ]}
          />
        }
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search by student name, university, degree, or destination...',
          ariaLabel: 'Search student success stories and case studies',
        }}
      />

      {/* 2. Shared Section Header (Consistent mb-12 & Vertically Centered Title) */}
      <SectionHeader
        title="Verified Student Placements & Case Studies"
        subtitle="Filter by destination country to read verified admission timelines, scholarship outcomes, and visa journeys."
        countLabel={`(${filteredStories.length.toLocaleString()})`}
      />

      {/* 3. Shared Quiet Filter Bar */}
      <ExplorerFilterBar
        options={COUNTRY_OPTIONS}
        activeId={activeCountry}
        onSelect={setActiveCountry}
        totalCount={filteredStories.length}
        countEntityLabel="Stories"
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
      />

      {/* 4. Success Stories Grid or Shared Empty State */}
      {filteredStories.length === 0 ? (
        <ExplorerEmptyState
          icon="person_search"
          title="No student stories match your filter"
          description="Try selecting another destination country or clearing your search keywords."
          onReset={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredStories.map((story) => (
            <article
              key={story.id}
              className={`${EXPLORER_THEME.card} ${EXPLORER_THEME.cardPadding} flex flex-col justify-between group`}
            >
              <div>
                {/* Student Profile Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={story.avatarUrl}
                    alt={story.name}
                    loading="lazy"
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug truncate group-hover:text-amber-600 dark:group-hover:text-[#fbb034] transition-colors">
                      {story.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {story.degree}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                      <span>{story.flagEmoji}</span>
                      <span className="truncate">{story.university}</span>
                    </div>
                  </div>
                </div>

                {/* Unboxed Metadata Row */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-amber-500 tracking-tight" aria-label={`Rated ${story.rating} out of 5`}>
                    {'★'.repeat(Math.round(parseFloat(story.rating) || 5))}
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Visa Approved
                  </span>
                </div>

                {/* Student Quote */}
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {story.locationBadge}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedStory(story)}
                  className={`${EXPLORER_THEME.secondaryOutlineButton} !px-3.5 !py-1.5 !text-xs`}
                >
                  Read Case Study
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 5. Shared Dark-Navy Bottom Consultation CTA */}
      <ExplorerCtaBanner
        title="Ready to write your own study abroad success story?"
        description="Book a 1-on-1 session with our certified counselors for free eligibility assessment, scholarship matching, and visa filing support."
        primaryLabel="Book Free Consultation"
        onPrimaryClick={() => onOpenConsultation?.('Student Success Story Inquiry')}
        secondaryLabel="Browse Universities"
        onSecondaryClick={onNavigate ? () => onNavigate('universities') : undefined}
      />

      {/* 6. Full Case Study Modal */}
      {selectedStory && (
        <div
          className={EXPLORER_THEME.modalBackdrop}
          onClick={() => setSelectedStory(null)}
        >
          <div
            className={`${EXPLORER_THEME.modalPanel} space-y-5`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close case study"
              onClick={() => setSelectedStory(null)}
              className="no-min-touch absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-4 pr-10">
              <img
                src={selectedStory.avatarUrl}
                alt={selectedStory.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedStory.name}
                </h3>
                <p className="text-xs font-semibold text-amber-600 dark:text-[#fbb034]">
                  {selectedStory.degree}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedStory.flagEmoji} {selectedStory.university} · {selectedStory.locationBadge}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  Admission &amp; Destination Summary
                </h4>
                <p>
                  Destination: {selectedStory.locationBadge}. Admitted to {selectedStory.degree} at{' '}
                  {selectedStory.university}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                  GEES Guidance Highlights
                </h4>
                <p>
                  Assisted with SOP review, academic verification, expedited university offer letter
                  issuance, and end-to-end visa filing compliance.
                </p>
              </div>

              <p className="italic text-slate-800 dark:text-slate-200 font-medium">
                &ldquo;{selectedStory.quote}&rdquo;
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const studentName = selectedStory.name;
                  setSelectedStory(null);
                  onOpenConsultation?.(`Inquiry inspired by ${studentName}'s story`);
                }}
                className={`${EXPLORER_THEME.primaryGoldButton} flex-1`}
              >
                Start Your Journey Like {selectedStory.name.split(' ')[0]}
              </button>
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
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
