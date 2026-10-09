/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES International Course & Degree Explorer with Multi-University Comparison Engine
 * Mobile, Tablet & Desktop Optimized
 */

import React, { useState, useMemo } from 'react';
import { Course } from '../../types/index.ts';
import { getCollaboratedCourses, getCollaboratedUniversities } from '../../utils/PartnerUniversityManager.ts';
import { APPROVED_COUNTRY_NAMES } from '../../lib/country-config.ts';

interface CourseExplorerViewProps {
  onApply: (courseTitleAndUni: string) => void;
  onNavigateToUni?: (uniSlug: string) => void;
  initialQuery?: string;
  initialCountry?: string;
}

export const CourseExplorerView: React.FC<CourseExplorerViewProps> = ({
  onApply,
  onNavigateToUni,
  initialQuery = '',
  initialCountry = 'all'
}) => {
  const allCourses: Course[] = useMemo(() => getCollaboratedCourses(), []);
  const allUnis = useMemo(() => getCollaboratedUniversities(), []);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedUniId, setSelectedUniId] = useState<string>('all');

  // Comparison drawer state
  const [comparedCourseIds, setComparedCourseIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Field Categories
  const fieldCategories = [
    { id: 'all', label: 'All Fields' },
    { id: 'cs', label: 'Computer Science & AI', match: 'computer' },
    { id: 'business', label: 'Business & Management', match: 'business' },
    { id: 'engineering', label: 'Engineering & Tech', match: 'engineering' },
    { id: 'health', label: 'Medicine & Health', match: 'health' },
    { id: 'law', label: 'Law & Legal Studies', match: 'law' },
    { id: 'data', label: 'Data Science & Marketing', match: 'data' },
    { id: 'arts', label: 'Arts & Design', match: 'art' }
  ];

  // Filtering Logic
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesUni = course.universityName.toLowerCase().includes(q);
        const matchesDept = course.department.toLowerCase().includes(q);
        const matchesCity = (course.city || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesUni && !matchesDept && !matchesCity) return false;
      }

      // 2. Country
      if (selectedCountry !== 'all') {
        if ((course.country || '').toLowerCase() !== selectedCountry.toLowerCase()) return false;
      }

      // 3. Field / Category
      if (selectedField !== 'all') {
        const cat = fieldCategories.find((c) => c.id === selectedField);
        if (cat && cat.match) {
          const inTitle = course.title.toLowerCase().includes(cat.match);
          const inDept = course.department.toLowerCase().includes(cat.match);
          if (!inTitle && !inDept) return false;
        }
      }

      // 4. Study Level
      if (selectedLevel !== 'all') {
        if (course.level !== selectedLevel) return false;
      }

      // 5. Study Mode
      if (selectedMode !== 'all') {
        const mode = (course.studyMode || '').toLowerCase();
        if (!mode.includes(selectedMode.toLowerCase())) return false;
      }

      // 6. University
      if (selectedUniId !== 'all') {
        if (course.universityId !== selectedUniId) return false;
      }

      return true;
    });
  }, [allCourses, searchQuery, selectedCountry, selectedField, selectedLevel, selectedMode, selectedUniId]);

  // Comparison toggle handler (max 4 courses)
  const toggleCompare = (courseId: string) => {
    setComparedCourseIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 programs simultaneously. Please unselect one to add another.');
        return prev;
      }
      return [...prev, courseId];
    });
  };

  const comparedCourses = useMemo(() => {
    return allCourses.filter((c) => comparedCourseIds.includes(c.id));
  }, [allCourses, comparedCourseIds]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedField('all');
    setSelectedLevel('all');
    setSelectedMode('all');
    setSelectedUniId('all');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Header with Golden Pill Badge */}
      <div className="mb-6 sm:mb-10 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
          <span className="w-2 h-2 rounded-full bg-[#fbb034] animate-pulse"></span>
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Academic Degree Explorer & Comparison Tool
          </span>
        </div>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Explore Degree Programs Across Partner Universities
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Filter programs by study duration in years, study mode (full-time, part-time, online), intake dates, tuition fees per year, and compare institutions side-by-side with 100% free GEES admission mentorship.
        </p>
      </div>

      {/* 2. Unified Search & Filter Control Station */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-6 mb-8 space-y-4">
        {/* Row 1: Search Input + Active Results Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search programs by title (e.g., Computer Science, MBA), university, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-10 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 focus:border-[#fbb034] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">{filteredCourses.length}</span> programs found
            </div>
            {(selectedCountry !== 'all' || selectedField !== 'all' || selectedLevel !== 'all' || selectedMode !== 'all' || selectedUniId !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Field Category Quick Chips (Touch pan & scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 touch-pan-x">
          {fieldCategories.map((f) => {
            const isActive = selectedField === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedField(f.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer select-none flex items-center gap-1 ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Multi-Select Filter Matrix (Country, Level, Mode, University) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* 1. Country Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
              Destination Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer"
            >
              <option value="all">All Countries (11)</option>
              {APPROVED_COUNTRY_NAMES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 2. Study Level Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
              Degree Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer"
            >
              <option value="all">All Degree Levels</option>
              <option value="undergraduate">Undergraduate (Bachelor's)</option>
              <option value="postgraduate">Postgraduate (Master's / MBA)</option>
              <option value="doctorate">Doctorate (PhD)</option>
              <option value="foundation">Pathway / Foundation</option>
              <option value="diploma">Executive Diploma</option>
            </select>
          </div>

          {/* 3. Study Mode Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
              Study Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer"
            >
              <option value="all">All Study Modes</option>
              <option value="full-time">Full-Time (On Campus)</option>
              <option value="part-time">Part-Time (Working Students)</option>
              <option value="online">Online / Distance Learning</option>
            </select>
          </div>

          {/* 4. University / College Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
              Partner University
            </label>
            <select
              value={selectedUniId}
              onChange={(e) => setSelectedUniId(e.target.value)}
              className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer truncate"
            >
              <option value="all">All Collaborated Universities</option>
              {allUnis.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.country})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Program Cards Grid (1-col mobile, 2-col tablet, 3-col desktop) */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
          <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">
            menu_book
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No degree programs match your filter criteria
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6">
            Try choosing a different country, switching study mode, or resetting filters to browse all partner qualifications.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#fbb034] text-slate-950 font-bold text-sm shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Show All Degree Programs</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredCourses.map((course) => {
            const isCompared = comparedCourseIds.includes(course.id);
            return (
              <article
                key={course.id}
                className={`group relative bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                  isCompared
                    ? 'border-[#fbb034] ring-2 ring-[#fbb034]/40 bg-amber-50/20 dark:bg-slate-900'
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Header: Level Badge, Mode Badge & Compare Checkbox */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-extrabold text-[10.5px] uppercase">
                        {course.level}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10.5px] ${
                        course.studyMode === 'Online'
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {course.studyMode || 'Full-Time'}
                      </span>
                    </div>

                    {/* Compare Button */}
                    <button
                      type="button"
                      onClick={() => toggleCompare(course.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none active:scale-95 ${
                        isCompared
                          ? 'bg-[#fbb034] text-slate-950 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title="Add to compare options between universities"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isCompared ? 'check_circle' : 'compare_arrows'}
                      </span>
                      <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                    </button>
                  </div>

                  {/* Course Title */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-[#fbb034] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {course.department}
                    </p>
                  </div>

                  {/* University & Location Row */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base shrink-0">{course.flagEmoji}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {course.universityName}
                        </h4>
                      </div>
                      {course.qsRank2027 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/90 text-slate-950 text-[10px] font-black shrink-0">
                          QS #{course.qsRank2027}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                      <span className="truncate">{course.city}, {course.country}</span>
                      {course.universityType && <span>• {course.universityType}</span>}
                    </div>
                  </div>

                  {/* Program Detail Specs: Duration, Tuition, Intakes */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Duration</span>
                      <strong className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block">
                        {course.durationYears || `${Math.round(course.durationMonths / 12)} Yrs`}
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Tuition / Yr</span>
                      <strong className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block truncate">
                        {course.tuitionFeeLocal}
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Intakes</span>
                      <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {course.intakes.slice(0, 2).join(' & ')}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions: 44px min-height */}
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-2">
                  {course.universityWebsite && (
                    <a
                      href={course.universityWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 py-2"
                    >
                      <span>Uni Web</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => onApply(`${course.title} at ${course.universityName}`)}
                    className="min-h-[44px] ml-auto px-5 py-2.5 rounded-full bg-[#fbb034] hover:bg-[#f59e0b] active:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Apply via GEES</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 4. Docked Floating Comparison Trigger Bar (Shows whenever >= 1 courses selected) */}
      {comparedCourses.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-40 bg-slate-950/95 text-white backdrop-blur-md rounded-2xl sm:rounded-full p-3 sm:px-6 shadow-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slideUp">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="w-8 h-8 rounded-full bg-[#fbb034] text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
              {comparedCourses.length}
            </span>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm leading-tight text-white truncate">
                Comparing {comparedCourses.length} Degree Program{comparedCourses.length > 1 ? 's' : ''}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                Compare duration, tuition per year, study mode & location
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setComparedCourseIds([])}
              className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer active:scale-95"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="min-h-[44px] px-5 py-2 rounded-full bg-[#fbb034] text-slate-950 font-black text-xs sm:text-sm hover:brightness-105 transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Compare Options</span>
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Comprehensive Comparison Matrix Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900">
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">compare</span>
                  <span>Side-by-Side Degree Comparison</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Analyze duration, study mode, annual tuition, and university location to choose your best fit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Comparison Scrollable Table */}
            <div className="overflow-x-auto p-4 sm:p-6 no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-400 w-44">
                      Specification
                    </th>
                    {comparedCourses.map((c) => (
                      <th key={c.id} className="p-3 pb-4 align-top w-64 min-w-[200px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xl">{c.flagEmoji}</span>
                            <button
                              type="button"
                              onClick={() => toggleCompare(c.id)}
                              className="text-[11px] text-rose-500 font-bold hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                            {c.title}
                          </h4>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {c.universityName}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  {/* Row: Location */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                      Location
                    </td>
                    {comparedCourses.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {c.city}, {c.country}
                      </td>
                    ))}
                  </tr>

                  {/* Row: QS 2027 Rank */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                      Official QS 2027 Rank
                    </td>
                    {comparedCourses.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.qsRank2027 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                            #{c.qsRank2027}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">Unranked in Global Top QS</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Duration */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                      Course Duration
                    </td>
                    {comparedCourses.map((c) => (
                      <td key={c.id} className="p-3 font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                        {c.durationYears || `${Math.round(c.durationMonths / 12)} Years`}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Study Mode */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                      Study Mode
                    </td>
                    {comparedCourses.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          c.studyMode === 'Online'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        }`}>
                          {c.studyMode || 'Full-Time'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Tuition per Year */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                      Annual Tuition
                    </td>
                    {comparedCourses.map((c) => (
                      <td key={c.id} className="p-3">
                        <strong className="text-base font-black text-slate-900 dark:text-white block">
                          {c.tuitionFeeLocal}
                        </strong>
                        <span className="text-xs text-slate-500">
                          Approx ${c.annualFeeUSD.toLocaleString()} USD / yr
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Intakes */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                      Intakes
                    </td>
                    {comparedCourses.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {c.intakes.join(' & ')}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Institution Type */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                      Institution Type
                    </td>
                    {comparedCourses.map((c) => (
                      <td key={c.id} className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {c.universityType || 'Accredited University'}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Direct Apply Action */}
                  <tr>
                    <td className="p-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                      Next Step
                    </td>
                    {comparedCourses.map((c) => (
                      <td key={c.id} className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            onApply(`${c.title} at ${c.universityName}`);
                          }}
                          className="min-h-[44px] w-full px-4 py-2 rounded-full bg-[#fbb034] text-slate-950 font-black text-xs shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer text-center"
                        >
                          Apply with GEES (Free)
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                100% Free counseling & visa assistance provided for all partner universities.
              </span>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseExplorerView;
