/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 13: Related Study Destinations
 */

import React from 'react';
import { StudyDestinationData, getAllDestinationData } from '../../data/destinationDataRegistry.ts';

interface RelatedDestinationsProps {
  currentSlug: string;
  onNavigate: (view: string, payload?: any) => void;
}

export const RelatedDestinations: React.FC<RelatedDestinationsProps> = ({
  currentSlug,
  onNavigate
}) => {
  const allDestinations = getAllDestinationData();
  // Filter out current country
  const relatedList = allDestinations.filter((d) => d.slug !== currentSlug).slice(0, 4);

  return (
    <section className="w-full bg-slate-900 text-white py-12 sm:py-20 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            <span>Explore Other Popular </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              Study Destinations
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed">
            Compare higher education destinations across Europe, Asia, Australia, and North America.
          </p>
        </div>

        {/* 4 Related Country Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {relatedList.map((dest) => (
            <div
              key={dest.slug}
              className="group bg-slate-800 rounded-3xl overflow-hidden border border-slate-700/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={dest.hero.imageUrl}
                    alt={dest.countryName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="text-2xl leading-none">{dest.flagEmoji}</span>
                    <span className="text-base font-extrabold text-white">{dest.countryName}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3 font-medium">
                    {dest.hero.subtitle}
                  </p>
                  <div className="text-[11px] text-amber-400 font-bold space-y-1">
                    <p>• {dest.quickFacts[0]?.value || 'Top Universities'}</p>
                    <p>• {dest.quickFacts[2]?.value || 'Multiple Intakes'}</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onNavigate('study-destination', dest.slug)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#fbb034] hover:text-slate-950 text-white font-bold text-xs transition-all text-center cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <span>Explore Destination</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedDestinations;
