/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Study Abroad Resources Hub & Downloads
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';

interface ResourcesHubViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (counselorName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const ResourcesHubView: React.FC<ResourcesHubViewProps> = ({
  onBackToHome,
  onOpenConsultation,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const categoryTabs = [
    { label: 'All Resources 📚', id: 'all' },
    { label: 'Visa Checklists 🛂', id: 'visa' },
    { label: 'SOP & LOR Samples 📝', id: 'sop' },
    { label: 'IELTS & PTE Decks 🎓', id: 'testprep' },
    { label: 'Financial Planners 💰', id: 'finance' },
  ];

  const resourceItems = [
    {
      id: 'uk-visa-checklist-2026',
      title: 'UK Student Visa (Student Route) 100% Audit Checklist 2026',
      category: 'visa',
      fileType: 'PDF Document',
      fileSize: '1.4 MB',
      downloads: '12,400+',
      icon: 'description',
      description: 'Comprehensive line-by-line document verification list including CAS rules, TB medical clinic locations, and 28-day bank balance proof formatting.',
      previewText: 'Includes sample Bank Solvency Certificate text, IHS healthcare surcharge rate table 2026, and IOM TB test booking requirements.'
    },
    {
      id: 'australia-gs-sop-template',
      title: 'Australia Genuine Student (GS) Statement of Purpose Template',
      category: 'sop',
      fileType: 'Word Document (.docx)',
      fileSize: '850 KB',
      downloads: '9,800+',
      icon: 'edit_note',
      description: 'Annotated SOP structure designed specifically for the Australian Genuine Student (GS) requirement replacing the GTE framework.',
      previewText: 'Covers career ties to home country, economic benefit breakdown, academic gap explanations, and course choice justification.'
    },
    {
      id: 'ielts-7point5-speaking-cuecards',
      title: 'IELTS Speaking Band 8.0 Cue Card Answers & Vocabulary Deck',
      category: 'testprep',
      fileType: 'PDF & Audio Deck',
      fileSize: '4.2 MB',
      downloads: '15,600+',
      icon: 'record_voice_over',
      description: 'Top 100 recent IELTS speaking Part 1, 2, and 3 actual test questions with band 8.0 sample answers, idioms, and collocations.',
      previewText: 'Curated by British Council certified trainers. Includes high-scoring connective phrases and pronunciation emphasis guides.'
    },
    {
      id: 'malaysia-emgs-visa-flowchart',
      title: 'Malaysia EMGS Visa & VAL Approval Step-by-Step Flowchart',
      category: 'visa',
      fileType: 'PDF Infographic',
      fileSize: '2.1 MB',
      downloads: '6,100+',
      icon: 'schema',
      description: 'Visual roadmap for EMGS percentage tracking, VAL issuance, Single Entry Visa (SEV) application, and airport arrival endorsement.',
      previewText: 'Explains 15% to 100% EMGS green bar milestone meanings and university international office escalation contact details.'
    },
    {
      id: 'currency-budgeting-calculator',
      title: 'Study Abroad Monthly Living Cost & Currency Budget Excel Sheet',
      category: 'finance',
      fileType: 'Excel Spreadsheet (.xlsx)',
      fileSize: '620 KB',
      downloads: '8,300+',
      icon: 'calculate',
      description: 'Automated budget calculator comparing monthly rent, groceries, transport, and utilities across London, Sydney, Kuala Lumpur, and Auckland.',
      previewText: 'Pre-loaded with live exchange rates for USD, GBP, AUD, MYR, NZD, and BDT with part-time wage tax offset algorithms.'
    },
    {
      id: 'lor-recommendation-samples',
      title: 'Winning Academic & Professional Letters of Recommendation (LOR) Samples',
      category: 'sop',
      fileType: 'Word Document (.docx)',
      fileSize: '910 KB',
      downloads: '7,400+',
      icon: 'workspace_premium',
      description: '6 editable LOR samples for undergraduate, postgraduate, and MBA applicants written by university professors and employer managers.',
      previewText: 'Highlights project management achievements, research methodology rigor, and personal leadership traits.'
    }
  ];

  const filteredResources = resourceItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadTrigger = (title: string) => {
    setDownloadSuccessToast(`Downloading "${title}"... Check your downloads folder.`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="w-full bg-white dark:bg-[#070b19] min-h-screen pb-20">
      {/* Toast Banner */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold text-xs sm:text-sm animate-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-lg">download_done</span>
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,176,52,0.15),transparent_50%)]"></div>
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
              <span className="material-symbols-outlined text-sm">folder_open</span>
              <span>100% Free Open Access Library</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
              Study Abroad <span className="text-[#fbb034]">Resources</span> & Tools
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
              Download free visa audit checklists, SOP templates, IELTS vocabulary decks, and financial budget calculators curated by senior GEES counselors.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#fbb034]">50,000+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Resource Downloads</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Free Access</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#fbb034]">Verified</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Embassy Compliant</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">2026</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Updated Regulations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1 max-w-md relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search resources, templates, or checklists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034]"
            />
          </div>

          <div className="w-full md:w-auto overflow-x-auto">
            <AnimatedTabs
              tabs={categoryTabs}
              activeId={activeCategory}
              onChange={(id) => setActiveCategory(id)}
              size="sm"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.fileType} • {item.fileSize}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 font-display group-hover:text-blue-600 dark:group-hover:text-[#fbb034] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  {item.downloads} downloads
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedResource(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownloadTrigger(item.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">folder_off</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No resources found matching your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for SOP, Visa, IELTS or financial templates.</p>
          </div>
        )}

        {/* Resource Preview Modal */}
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                  <span className="material-symbols-outlined">{selectedResource.icon}</span>
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{selectedResource.fileType} ({selectedResource.fileSize})</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{selectedResource.title}</h3>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Resource Overview & Contents:</h4>
                <p>{selectedResource.previewText}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    handleDownloadTrigger(selectedResource.title);
                    setSelectedResource(null);
                  }}
                  className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm text-center shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Download File Now</span>
                </button>
                <button
                  onClick={() => setSelectedResource(null)}
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
              Need personalized SOP review or visa filing audit?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
              Submit your document draft for a free 1-on-1 review by senior GEES visa specialists.
            </p>
          </div>
          <InteractiveHoverButton
            text="Request Free Document Review"
            onClick={() => onOpenConsultation?.('Document Review & SOP Request')}
            className="shrink-0 font-bold"
          />
        </div>
      </div>
    </div>
  );
};
