/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Study Abroad Resources Hub & Downloads
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

interface ResourcesHubViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (counselorName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  fileType: string;
  fileSize: string;
  downloads: string;
  icon: string;
  description: string;
  previewText: string;
}

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Resources' },
  { id: 'visa', label: 'Visa Checklists' },
  { id: 'sop', label: 'SOP & LOR Samples' },
  { id: 'testprep', label: 'IELTS & PTE Decks' },
  { id: 'finance', label: 'Financial Planners' },
];

const RESOURCE_ITEMS: ResourceItem[] = [
  {
    id: 'uk-visa-checklist-2026',
    title: 'UK Student Visa (Student Route) 100% Audit Checklist 2026',
    category: 'visa',
    fileType: 'PDF Document',
    fileSize: '1.4 MB',
    downloads: '12,400+',
    icon: 'description',
    description:
      'Comprehensive line-by-line document verification list including CAS rules, TB medical clinic locations, and 28-day bank balance proof formatting.',
    previewText:
      'Includes sample Bank Solvency Certificate text, IHS healthcare surcharge rate table 2026, and IOM TB test booking requirements.',
  },
  {
    id: 'australia-gs-sop-template',
    title: 'Australia Genuine Student (GS) Statement of Purpose Template',
    category: 'sop',
    fileType: 'Word Document (.docx)',
    fileSize: '850 KB',
    downloads: '9,800+',
    icon: 'edit_note',
    description:
      'Annotated SOP structure designed specifically for the Australian Genuine Student (GS) requirement replacing the GTE framework.',
    previewText:
      'Covers career ties to home country, economic benefit breakdown, academic gap explanations, and course choice justification.',
  },
  {
    id: 'ielts-7point5-speaking-cuecards',
    title: 'IELTS Speaking Band 8.0 Cue Card Answers & Vocabulary Deck',
    category: 'testprep',
    fileType: 'PDF & Audio Deck',
    fileSize: '4.2 MB',
    downloads: '15,600+',
    icon: 'record_voice_over',
    description:
      'Top 100 recent IELTS speaking Part 1, 2, and 3 actual test questions with band 8.0 sample answers, idioms, and collocations.',
    previewText:
      'Curated by British Council certified trainers. Includes high-scoring connective phrases and pronunciation emphasis guides.',
  },
  {
    id: 'malaysia-emgs-visa-flowchart',
    title: 'Malaysia EMGS Visa & VAL Approval Step-by-Step Flowchart',
    category: 'visa',
    fileType: 'PDF Infographic',
    fileSize: '2.1 MB',
    downloads: '6,100+',
    icon: 'schema',
    description:
      'Visual roadmap for EMGS percentage tracking, VAL issuance, Single Entry Visa (SEV) application, and airport arrival endorsement.',
    previewText:
      'Explains 15% to 100% EMGS green bar milestone meanings and university international office escalation contact details.',
  },
  {
    id: 'currency-budgeting-calculator',
    title: 'Study Abroad Monthly Living Cost & Currency Budget Excel Sheet',
    category: 'finance',
    fileType: 'Excel Spreadsheet (.xlsx)',
    fileSize: '620 KB',
    downloads: '8,300+',
    icon: 'calculate',
    description:
      'Automated budget calculator comparing monthly rent, groceries, transport, and utilities across London, Sydney, Kuala Lumpur, and Auckland.',
    previewText:
      'Pre-loaded with live exchange rates for USD, GBP, AUD, MYR, NZD, and BDT with part-time wage tax offset algorithms.',
  },
  {
    id: 'lor-recommendation-samples',
    title: 'Winning Academic & Professional Letters of Recommendation (LOR) Samples',
    category: 'sop',
    fileType: 'Word Document (.docx)',
    fileSize: '910 KB',
    downloads: '7,400+',
    icon: 'workspace_premium',
    description:
      '6 editable LOR samples for undergraduate, postgraduate, and MBA applicants written by university professors and employer managers.',
    previewText:
      'Highlights project management achievements, research methodology rigor, and personal leadership traits.',
  },
];

export const ResourcesHubView: React.FC<ResourcesHubViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handleGoHome = () => {
    if (onBackToHome) onBackToHome();
    else onNavigate?.('home');
  };

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return RESOURCE_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.fileType.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const hasActiveFilters = activeCategory !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  const handleDownloadTrigger = (title: string) => {
    setDownloadSuccessToast(`Downloading "${title}"... Check your downloads folder.`);
    window.setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  };

  return (
    <ExplorerPageShell>
      {/* Download Confirmation Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a1120] border border-[#fbb034]/40 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold text-xs sm:text-sm animate-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-[18px] text-[#FFCC00]">
            download_done
          </span>
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* 1. Shared Dark-Navy Explorer Hero Banner & Full-Width Search */}
      <ExplorerHeroBanner
        dataPurpose="resources-hero-banner"
        onNavigateHome={handleGoHome}
        breadcrumbs={[{ label: 'Resources & Tools' }]}
        titlePrefix="Study Abroad"
        titleHighlight="Resources"
        titleSuffix="& Tools"
        subtitle="Download free visa audit checklists, SOP templates, IELTS decks, and financial planners curated by GEES counselors"
        rightSlot={
          <ExplorerHeroMetrics
            items={[
              { value: '50,000', suffix: '+', label: 'Resource Downloads' },
              { value: '100%', label: 'Free Open Access' },
              { value: RESOURCE_ITEMS.length, label: 'Verified Toolkits' },
              { value: '2026', label: 'Updated Rules' },
            ]}
          />
        }
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search visa checklists, SOP templates, IELTS decks, or budget sheets...',
          ariaLabel: 'Search study abroad resources and tools',
        }}
      />

      {/* 2. Shared Section Header (Consistent mb-12 & Vertically Centered Title) */}
      <SectionHeader
        title="Downloadable Checklists, Templates & Study Tools"
        subtitle="Preview contents or download embassy-compliant checklists and editable templates at no cost."
        countLabel={`(${filteredResources.length.toLocaleString()})`}
      />

      {/* 3. Shared Quiet Filter Bar */}
      <ExplorerFilterBar
        options={CATEGORY_OPTIONS}
        activeId={activeCategory}
        onSelect={setActiveCategory}
        totalCount={filteredResources.length}
        countEntityLabel="Resources"
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
      />

      {/* 4. Resources Grid or Shared Empty State */}
      {filteredResources.length === 0 ? (
        <ExplorerEmptyState
          icon="folder_off"
          title="No resources match your search"
          description="Try searching for SOP, Visa, IELTS, EMGS, or financial templates, or reset filters."
          onReset={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredResources.map((item) => (
            <article
              key={item.id}
              className={`${EXPLORER_THEME.card} ${EXPLORER_THEME.cardPadding} flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={EXPLORER_THEME.iconTile}>
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <div className="text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <div>{item.fileType}</div>
                    <div className="tabular-nums text-slate-400 dark:text-slate-500">
                      {item.fileSize}
                    </div>
                  </div>
                </div>

                <h3 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-[#fbb034] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                  {item.downloads} downloads
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedResource(item)}
                    className={`${EXPLORER_THEME.secondaryOutlineButton} !px-3 !py-1.5 !text-xs`}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadTrigger(item.title)}
                    className={`${EXPLORER_THEME.primaryDarkButton} !px-3.5 !py-1.5 !text-xs`}
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 5. Shared Dark-Navy Bottom Consultation CTA */}
      <ExplorerCtaBanner
        title="Need a personalized SOP review or visa filing audit?"
        description="Submit your Statement of Purpose or financial checklist for a free 1-on-1 review by senior GEES admissions and visa specialists."
        primaryLabel="Request Free Document Review"
        onPrimaryClick={() => onOpenConsultation?.('Document Review & SOP Request')}
        secondaryLabel="Explore All Services"
        onSecondaryClick={onNavigate ? () => onNavigate('services') : undefined}
      />

      {/* 6. Resource Preview Modal */}
      {selectedResource && (
        <div
          className={EXPLORER_THEME.modalBackdrop}
          onClick={() => setSelectedResource(null)}
        >
          <div
            className={`${EXPLORER_THEME.modalPanel} max-w-xl space-y-5`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close preview"
              onClick={() => setSelectedResource(null)}
              className="no-min-touch absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-start gap-3.5 pr-10">
              <div className={EXPLORER_THEME.iconTile}>
                <span className="material-symbols-outlined text-[22px]">
                  {selectedResource.icon}
                </span>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {selectedResource.fileType} · {selectedResource.fileSize} ·{' '}
                  {selectedResource.downloads} downloads
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mt-0.5">
                  {selectedResource.title}
                </h3>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Resource Overview &amp; Contents
              </h4>
              <p>{selectedResource.previewText}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleDownloadTrigger(selectedResource.title);
                  setSelectedResource(null);
                }}
                className={`${EXPLORER_THEME.primaryGoldButton} flex-1`}
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download File Now</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
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
