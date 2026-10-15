/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 5: Popular Courses in Destination
 */

import React, { useState } from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';
import { getCollaboratedCourses } from '../../utils/PartnerUniversityManager.ts';
import { Course } from '../../types/index.ts';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface DestinationCoursesProps {
  data: StudyDestinationData;
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultation: (counselor?: string) => void;
}

export const DestinationCourses: React.FC<DestinationCoursesProps> = ({
  data,
  onNavigate,
  onOpenConsultation
}) => {
  const [selectedField, setSelectedField] = useState<string>('all');

  // Pull all courses and filter by this country
  const allCourses = getCollaboratedCourses();
  const countryCourses = allCourses.filter(
    (c) => c.country?.toLowerCase() === data.countryName.toLowerCase() ||
           data.countryName.toLowerCase().includes(c.country?.toLowerCase() || '')
  );

  // Field Categories Tabs
  const fieldTabs = [
    { id: 'all', label: 'All Fields' },
    { id: 'cs', label: 'Computer Science & IT' },
    { id: 'business', label: 'Business & Management' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'health', label: 'Healthcare & Medicine' },
    { id: 'arts', label: 'Arts & Design' }
  ];

  const filteredCourses = countryCourses.filter((course) => {
    if (selectedField === 'all') return true;
    const dept = (course.department || '').toLowerCase();
    const title = (course.title || '').toLowerCase();

    if (selectedField === 'cs') return dept.includes('cs') || dept.includes('computer') || title.includes('cyber') || title.includes('data');
    if (selectedField === 'business') return dept.includes('business') || dept.includes('mgmt') || title.includes('mba') || title.includes('finance');
    if (selectedField === 'engineering') return dept.includes('engineering') || title.includes('civil') || title.includes('mechanical');
    if (selectedField === 'health') return dept.includes('health') || dept.includes('pharmacy') || title.includes('nursing') || title.includes('medical');
    if (selectedField === 'arts') return dept.includes('art') || dept.includes('design') || title.includes('creative');
    return true;
  });

  return (
    <section className="w-full bg-white dark:bg-[#070b19] py-12 sm:py-20 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            <span>Popular Courses in </span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 py-1 rounded-xl sm:rounded-2xl font-black shrink-0 inline-block">
              {data.countryName}
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            High-demand degree programs offered across premier accredited faculties.
          </p>

          {/* Animated Field Filter Tabs */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <AnimatedTabs
              tabs={fieldTabs}
              activeId={selectedField}
              onChange={(id) => setSelectedField(id)}
              size="md"
            />
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-10">
            {filteredCourses.slice(0, 6).map((course) => (
              <div
                key={course.id}
                className="group bg-slate-50 dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Level Badge & Study Mode */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                      {course.level}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {course.durationYears} Years • {course.studyMode}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                    {course.title}
                  </h3>

                  {/* University */}
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-blue-600">school</span>
                    <span>{course.universityName}</span>
                  </p>

                  {/* Program Highlights */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                    {course.overview}
                  </p>

                  {/* Key Info Strip */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Est. Annual Tuition:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{course.tuitionFeeLocal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Intakes:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{course.intakes?.join(', ') || data.quickFacts[2]?.value}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('courses', { destination: data.countryName, query: course.title })}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-all text-center cursor-pointer min-h-[44px]"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(`Admissions for ${course.title} at ${course.universityName}`)}
                    className="py-2.5 px-4 rounded-xl bg-[#fbb034] hover:bg-amber-400 active:bg-amber-500 text-slate-950 font-black text-xs transition-all text-center shadow-xs cursor-pointer min-h-[44px]"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-10">
            <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">menu_book</span>
            <p className="text-base font-bold text-slate-900 dark:text-white">Courses Available Across All Fields</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Explore hundreds of degree options directly in our Course Explorer database.
            </p>
          </div>
        )}

        {/* View All Courses CTA */}
        <div className="flex justify-center">
          <InteractiveHoverButton
            type="button"
            text={`Search All Courses in ${data.countryName}`}
            onClick={() => onNavigate('courses', { destination: data.countryName })}
            className="min-h-[44px] px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-300 dark:border-slate-700 font-semibold text-sm shadow-sm cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
};

export default DestinationCourses;
