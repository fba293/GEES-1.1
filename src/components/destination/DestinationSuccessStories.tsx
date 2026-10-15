/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 10: Student Success Stories
 */

import React from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';
import { mockTestimonials } from '../../data/mockDatabase.ts';

interface DestinationSuccessStoriesProps {
  data: StudyDestinationData;
  onOpenConsultation: (counselor?: string) => void;
}

export const DestinationSuccessStories: React.FC<DestinationSuccessStoriesProps> = ({
  data,
  onOpenConsultation
}) => {
  // Filter mockTestimonials by country
  const countryTestimonials = mockTestimonials.filter(
    (t) => t.country?.toLowerCase() === data.countryName.toLowerCase() ||
           data.countryName.toLowerCase().includes(t.country?.toLowerCase() || '')
  );

  // Fallback to general testimonials if none matched
  const displayStories = countryTestimonials.length > 0 ? countryTestimonials : mockTestimonials.slice(0, 3);

  return (
    <section className="w-full bg-slate-50 dark:bg-[#070D1E] py-12 sm:py-20 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Student Success Stories: </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              {data.countryName}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Real experiences from Bangladeshi students enrolled in premier universities in {data.countryName}.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-8">
          {displayStories.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Rating & Flag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-xl">{story.flagEmoji || data.flagEmoji}</span>
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium italic mb-6 leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={story.avatarUrl}
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {story.name}
                  </h4>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    {story.degree}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {story.university}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => onOpenConsultation(`Success Story Consultation for ${data.countryName}`)}
            className="py-3 px-8 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer min-h-[44px]"
          >
            Start Your Own Success Story
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationSuccessStories;
