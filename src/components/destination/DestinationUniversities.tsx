/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 4: Top Partner Universities
 */

import React, { useState } from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';
import { getPartnerUniversitiesByCountry } from '../../utils/PartnerUniversityManager.ts';
import { University } from '../../types/index.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface DestinationUniversitiesProps {
  data: StudyDestinationData;
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultation: (counselor?: string) => void;
}

export const DestinationUniversities: React.FC<DestinationUniversitiesProps> = ({
  data,
  onNavigate,
  onOpenConsultation
}) => {
  const [selectedUniDetail, setSelectedUniDetail] = useState<University | null>(null);
  
  // Pull verified partner universities for this destination
  const universities = getPartnerUniversitiesByCountry(data.countryName);

  return (
    <section id="universities-section" className="w-full bg-slate-50 dark:bg-[#070D1E] py-12 sm:py-20 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Top Partner Universities in </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              {data.countryName}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Direct GEES representation across {universities.length} accredited higher education institutions in {data.countryName}.
          </p>
        </div>

        {/* University Cards Grid */}
        {universities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-10 sm:mb-12">
            {universities.slice(0, 9).map((uni) => (
              <article
                key={uni.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image & Overlay Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    <img
                      src={uni.bannerUrl || data.hero.imageUrl}
                      alt={uni.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Verified QS Rank Badge if available */}
                    {uni.qsRank2027 && (
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-sm text-amber-400">emoji_events</span>
                        <span>QS 2027: #{uni.qsRank2027}</span>
                      </div>
                    )}

                    {/* City Badge */}
                    <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-amber-400">location_on</span>
                      <span>{uni.city}, {data.countryName}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                        {uni.name}
                      </h3>
                      {uni.logoUrl && (
                        <img
                          src={uni.logoUrl}
                          alt={`${uni.name} Logo`}
                          className="w-10 h-10 object-contain rounded-lg border border-slate-100 dark:border-slate-800 shrink-0 bg-white p-1"
                          loading="lazy"
                        />
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4 line-clamp-2">
                      {uni.tagline || uni.description}
                    </p>

                    {/* Popular Programs / Info Strip */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Established:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{uni.established || 'Established Partner'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Est. Tuition:</span>
                        <span className="font-bold text-slate-900 dark:text-white">${uni.avgTuitionAnnualUSD?.toLocaleString()} / yr</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">IELTS Target:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{uni.minIeltsScore || 6.0} Overall</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('universities', uni.slug)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all text-center cursor-pointer min-h-[44px]"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('courses', { destination: data.countryName, query: uni.name })}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all text-center cursor-pointer min-h-[44px]"
                    >
                      Explore Courses
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(`Application Representative for ${uni.name}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#fbb034] hover:bg-amber-400 active:bg-amber-500 text-slate-950 font-black text-xs transition-all text-center shadow-xs cursor-pointer min-h-[44px]"
                  >
                    Apply Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-10">
            <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">school</span>
            <p className="text-base font-bold text-slate-900 dark:text-white">Expanding Partner Network</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
              GEES is actively expanding direct partner institution ties in {data.countryName}. Contact our counseling desk for custom university shortlists.
            </p>
          </div>
        )}

        {/* View All Universities CTA */}
        <div className="flex justify-center">
          <InteractiveHoverButton
            type="button"
            text={`View All Universities in ${data.countryName}`}
            onClick={() => onNavigate('universities', data.countryName)}
            className="min-h-[44px] px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-300 dark:border-slate-700 font-semibold text-sm shadow-sm cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
};

export default DestinationUniversities;
