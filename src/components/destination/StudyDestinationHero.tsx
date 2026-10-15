/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 1: Premium Country Hero
 */

import React from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface StudyDestinationHeroProps {
  data: StudyDestinationData;
  onOpenConsultation: (counselor?: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const StudyDestinationHero: React.FC<StudyDestinationHeroProps> = ({
  data,
  onOpenConsultation,
  onScrollToSection
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white pt-24 pb-16 lg:pt-32 lg:pb-24 transition-colors">
      {/* Background Image with Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={data.hero.imageUrl}
          alt={`Study in ${data.countryName} campus banner`}
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,176,52,0.15),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow Flag Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 mb-6 shadow-lg">
            <span className="text-xl leading-none">{data.flagEmoji}</span>
            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-amber-300">
              GEES Official Destination Guide
            </span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] text-white text-balance mb-6">
            {data.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-400 max-w-3xl mx-auto mb-4 leading-snug">
            {data.hero.subtitle}
          </p>

          {/* Persuasive Intro Tailored for Bangladeshi Students */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
            {data.hero.intro}
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full sm:w-auto">
            <InteractiveHoverButton
              type="button"
              text="Get Free Counselling"
              onClick={() => onOpenConsultation(`Study in ${data.countryName} Advisor`)}
              className="min-h-[48px] w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-base shadow-xl active:scale-95 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => onScrollToSection('universities-section')}
              className="min-h-[48px] w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-base backdrop-blur-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Universities</span>
              <span className="material-symbols-outlined text-lg">arrow_downward</span>
            </button>
          </div>

          {/* Key Metric Strip */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-black text-amber-400">{data.quickFacts[0]?.value || '100%'}</span>
              <span className="text-xs text-slate-300 font-medium">Estimated Tuition</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-black text-amber-400">{data.quickFacts[2]?.value || '3 Intakes'}</span>
              <span className="text-xs text-slate-300 font-medium">Major Intakes</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-black text-amber-400">{data.quickFacts[3]?.value || '100% English'}</span>
              <span className="text-xs text-slate-300 font-medium">Teaching Language</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-black text-amber-400">{data.quickFacts[5]?.value || 'Scholarships'}</span>
              <span className="text-xs text-slate-300 font-medium">Financial Aid</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyDestinationHero;
