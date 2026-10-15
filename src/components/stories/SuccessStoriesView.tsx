/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Success Stories Page
 */

import React, { useState } from 'react';
import { mockTestimonials } from '../../data/mockDatabase.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';
import { TestimonialStory } from '../../types/index.ts';

interface SuccessStoriesViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (counselorName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const SuccessStoriesView: React.FC<SuccessStoriesViewProps> = ({
  onBackToHome,
  onOpenConsultation,
}) => {
  const [activeCountry, setActiveCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStory, setSelectedStory] = useState<TestimonialStory | null>(null);

  const countryTabs = [
    { label: 'All Destinations', id: 'all' },
    { label: 'United Kingdom 🇬🇧', id: 'uk' },
    { label: 'Australia 🇦🇺', id: 'australia' },
    { label: 'Malaysia 🇲🇾', id: 'malaysia' },
    { label: 'New Zealand 🇳🇿', id: 'new zealand' },
  ];

  const filteredStories = mockTestimonials.filter((story) => {
    const matchesCountry =
      activeCountry === 'all' ||
      story.country.toLowerCase() === activeCountry.toLowerCase();
    const matchesSearch =
      story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.degree.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="w-full bg-slate-50 dark:bg-[#070b19] min-h-screen pb-20">
      {/* Top Banner / Breadcrumb */}
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
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>15,000+ Verified Placements</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
              Student <span className="text-[#fbb034]">Success Stories</span> & Case Studies
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
              Explore real journeys of ambitious students who earned admission, major scholarship grants, and rapid visa approvals at top universities globally.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#fbb034]">15,000+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Students Placed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">98.4%</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Visa Approval Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#fbb034]">$12.5M+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Scholarships Secured</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">500+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Partner Universities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1 max-w-md relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by student name, university or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034]"
            />
          </div>

          <div className="w-full md:w-auto overflow-x-auto">
            <AnimatedTabs
              tabs={countryTabs}
              activeId={activeCountry}
              onChange={(id) => setActiveCountry(id)}
              size="sm"
            />
          </div>
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={story.avatarUrl}
                    alt={story.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#fbb034] shadow-sm shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-blue-600 dark:group-hover:text-[#fbb034] transition-colors">
                      {story.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {story.degree}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      <span>{story.flagEmoji}</span>
                      <span>{story.university}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Badge */}
                <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex text-amber-400 text-xs gap-0.5">
                    {'★'.repeat(Math.round(parseFloat(story.rating) || 5))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60">
                    Visa Approved
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                  "{story.quote}"
                </p>
              </div>

              {/* Bottom Details Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  Location: <strong className="text-slate-900 dark:text-white">{story.locationBadge}</strong>
                </span>
                <button
                  onClick={() => setSelectedStory(story)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#fbb034] hover:text-slate-950 text-slate-900 dark:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Read Study Case
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">folder_off</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No stories found matching your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for a different destination or keywords.</p>
          </div>
        )}

        {/* Modal for Full Case Study */}
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedStory.avatarUrl}
                  alt={selectedStory.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#fbb034]"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedStory.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{selectedStory.degree}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedStory.university} ({selectedStory.flagEmoji})</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Student Background & Destination</h4>
                  <p>Study destination: {selectedStory.locationBadge}. Applied for {selectedStory.degree} at {selectedStory.university}.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-1">GEES Guidance Highlights</h4>
                  <p>Assisted in SOP writing, fast-tracked credit transfer verification, expedited offer letter issuance, and standard visa filing with 100% document compliance.</p>
                </div>

                <p className="italic text-slate-700 dark:text-slate-200 font-medium">"{selectedStory.quote}"</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setSelectedStory(null);
                    onOpenConsultation?.(`Inquiry inspired by ${selectedStory.name}'s story`);
                  }}
                  className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide text-center cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  Start Your Journey Like {selectedStory.name.split(' ')[0]}
                </button>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pre-Footer Banner CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Ready to write your own success story?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
              Book a 1-on-1 session with our certified counselors today. 100% free eligibility assessment, application fee waivers, and visa filing support.
            </p>
          </div>
          <InteractiveHoverButton
            text="Book Free Consultation"
            onClick={() => onOpenConsultation?.()}
            className="shrink-0 font-bold"
          />
        </div>
      </div>
    </div>
  );
};
