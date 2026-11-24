/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Education Expert Services - Global News & Visa Bulletins View
 * Built on the shared GEES Explorer Theme (ExplorerPageShell, ExplorerHeroBanner, SectionHeader).
 */

import React, { useState, useMemo } from 'react';
import { mockNews } from '../../data/mockNews.ts';
import { NewsArticle } from '../../types/index.ts';
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

interface NewsViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (topic?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

const NEWS_CATEGORIES = [
  'All',
  'Visa Update',
  'Scholarship Alert',
  'Immigration Policy',
  'GEES Announcement',
];

export const NewsView: React.FC<NewsViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticleModal, setActiveArticleModal] = useState<NewsArticle | null>(null);

  const handleGoHome = () => {
    if (onBackToHome) onBackToHome();
    else onNavigate?.('home');
  };

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockNews.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.source.toLowerCase().includes(q) ||
        (article.countryTag && article.countryTag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const urgentAlerts = useMemo(() => mockNews.filter((a) => a.isUrgent), []);
  const countryCount = useMemo(
    () => new Set(mockNews.map((a) => a.countryTag).filter(Boolean)).size,
    []
  );

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <ExplorerPageShell>
      {/* 1. Shared Dark-Navy Explorer Hero Banner & Full-Width Search */}
      <ExplorerHeroBanner
        dataPurpose="news-hero-banner"
        onNavigateHome={handleGoHome}
        breadcrumbs={[{ label: 'News & Visa Updates' }]}
        titlePrefix="Latest"
        titleHighlight="Visa Rules"
        titleSuffix="& Policy Updates"
        subtitle="Verified announcements from the UK Home Office, Australia Home Affairs, EMGS Malaysia, and partner universities"
        rightSlot={
          <ExplorerHeroMetrics
            items={[
              { value: mockNews.length, label: 'Official Bulletins' },
              { value: urgentAlerts.length, label: 'Priority Advisories' },
              { value: Math.max(countryCount, 6), suffix: '+', label: 'Regions Tracked' },
              { value: '2026', label: 'Current Cycle' },
            ]}
          />
        }
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search visa rules, scholarships, UK, Australia, Malaysia, or policy updates...',
          ariaLabel: 'Search visa rules, scholarships, and policy updates',
        }}
      />

      {/* 2. Urgent Visa Advisory Strip (Clean, Zero Pulsing Dots) */}
      {urgentAlerts.length > 0 && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-amber-300/80 dark:border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className={EXPLORER_THEME.iconTile}>
              <span className="material-symbols-outlined text-[20px] text-[#FFCC00]">
                notifications_active
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Priority Visa Advisory · {urgentAlerts[0].publishedDate}
              </div>
              <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug mt-0.5">
                {urgentAlerts[0].title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveArticleModal(urgentAlerts[0])}
            className={EXPLORER_THEME.primaryGoldButton}
          >
            <span>Read Bulletin</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* 3. Shared Section Header (Consistent mb-12 & Vertically Centered Title) */}
      <SectionHeader
        title="Official Visa Bulletins & Policy Updates"
        subtitle="Filter verified embassy notices, scholarship alerts, and university policy changes by topic."
        countLabel={`(${filteredArticles.length.toLocaleString()})`}
      />

      {/* 4. Shared Quiet Filter Bar */}
      <ExplorerFilterBar
        options={NEWS_CATEGORIES.map((cat) => ({ id: cat, label: cat }))}
        activeId={selectedCategory}
        onSelect={setSelectedCategory}
        totalCount={filteredArticles.length}
        countEntityLabel="Bulletins"
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
      />

      {/* 5. News Articles Grid or Shared Empty State */}
      {filteredArticles.length === 0 ? (
        <ExplorerEmptyState
          icon="newspaper"
          title="No policy bulletins match your search"
          description="Try broadening your search keyword or switching to another category filter above."
          onReset={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticleModal(article)}
              className={`${EXPLORER_THEME.card} overflow-hidden cursor-pointer flex flex-col justify-between group`}
            >
              <div>
                {/* Card Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/65 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-semibold text-white">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0a1120]/85 text-[#fbb034] font-bold">
                      {article.category}
                    </span>
                    {article.countryTag && (
                      <span className="px-2.5 py-0.5 rounded-md bg-white/95 text-slate-900 font-semibold">
                        {article.flagEmoji ? `${article.flagEmoji} ` : ''}
                        {article.countryTag}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className={`${EXPLORER_THEME.cardPadding} space-y-2.5`}>
                  <div className={EXPLORER_THEME.metadataRow}>
                    <span>{article.publishedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                    {article.isUrgent && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">Priority</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#fbb034] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {article.source}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-[#FFCC00] inline-flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Bulletin</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 6. Shared Dark-Navy Bottom Consultation CTA */}
      <ExplorerCtaBanner
        title="Need personalized advice on visa rules or university applications?"
        description="Book a 1-on-1 session with a certified GEES counselor for up-to-date embassy requirements, scholarship checks, and application timelines."
        primaryLabel="Book Free Consultation"
        onPrimaryClick={() => onOpenConsultation?.('Visa Rules & Policy Consultation')}
        secondaryLabel="Explore Study Destinations"
        onSecondaryClick={onNavigate ? () => onNavigate('study-abroad') : undefined}
      />

      {/* 7. Article Detail Modal Reader */}
      {activeArticleModal && (
        <div
          className={EXPLORER_THEME.modalBackdrop}
          onClick={() => setActiveArticleModal(null)}
        >
          <div
            className={`${EXPLORER_THEME.modalPanel} max-w-3xl space-y-5`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close article"
              onClick={() => setActiveArticleModal(null)}
              className="no-min-touch absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className={`${EXPLORER_THEME.metadataRow} pr-10`}>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {activeArticleModal.category}
              </span>
              {activeArticleModal.countryTag && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    {activeArticleModal.flagEmoji ? `${activeArticleModal.flagEmoji} ` : ''}
                    {activeArticleModal.countryTag}
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{activeArticleModal.publishedDate}</span>
              <span aria-hidden="true">·</span>
              <span>{activeArticleModal.readTime}</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {activeArticleModal.title}
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <span>By {activeArticleModal.author}</span>
              <span>
                Source:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {activeArticleModal.source}
                </strong>
              </span>
            </div>

            <img
              src={activeArticleModal.imageUrl}
              alt={activeArticleModal.title}
              className="w-full h-56 sm:h-72 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
            />

            {activeArticleModal.keyPoints.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Key Official Takeaways
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  {activeArticleModal.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-bold text-amber-600 dark:text-[#fbb034] tabular-nums shrink-0">
                        0{idx + 1}.
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeArticleModal.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className={`${EXPLORER_THEME.secondaryOutlineButton} w-full sm:w-auto`}
              >
                Close Bulletin
              </button>
              <button
                type="button"
                onClick={() => {
                  const title = activeArticleModal.title;
                  setActiveArticleModal(null);
                  onOpenConsultation?.(title);
                }}
                className={`${EXPLORER_THEME.primaryGoldButton} w-full sm:w-auto`}
              >
                Inquire About This Bulletin
              </button>
            </div>
          </div>
        </div>
      )}
    </ExplorerPageShell>
  );
};
