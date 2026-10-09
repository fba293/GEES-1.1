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
  initialLevel?: string;
  initialField?: string;
}

export const CourseExplorerView: React.FC<CourseExplorerViewProps> = ({
  onApply,
  onNavigateToUni,
  initialQuery = '',
  initialCountry = 'all',
  initialLevel = 'all',
  initialField = 'all'
}) => {
  const allCourses: Course[] = useMemo(() => getCollaboratedCourses(), []);
  const allUnis = useMemo(() => getCollaboratedUniversities(), []);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [selectedField, setSelectedField] = useState<string>(initialField);
  const [selectedLevel, setSelectedLevel] = useState<string>(initialLevel);
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedUniId, setSelectedUniId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'az' | 'fee-asc' | 'fee-desc' | 'qs'>('qs');

  // Comparison drawer state
  const [comparedCourseIds, setComparedCourseIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Level items with counts
  const levelItems = useMemo(() => [
    { id: 'all', label: 'All', count: allCourses.length },
    { id: 'certificate', label: 'Certificate', count: allCourses.filter(c => c.level === 'certificate').length },
    { id: 'foundation', label: 'Foundation / A-Level', count: allCourses.filter(c => c.level === 'foundation' || c.level === 'a-level').length },
    { id: 'diploma', label: 'Diploma', count: allCourses.filter(c => c.level === 'diploma').length },
    { id: 'advanced-diploma', label: 'Advance Diploma', count: allCourses.filter(c => c.level === 'advanced-diploma').length },
    { id: 'undergraduate', label: 'Bachelor Degree', count: allCourses.filter(c => c.level === 'undergraduate').length },
    { id: 'postgraduate', label: 'Masters Degree', count: allCourses.filter(c => c.level === 'postgraduate').length },
    { id: 'doctorate', label: 'Doctorate', count: allCourses.filter(c => c.level === 'doctorate').length },
  ], [allCourses]);

  // Field Categories with counts
  const fieldCategories = useMemo(() => [
    { id: 'all', label: 'All Programs', match: '', count: allCourses.length },
    { id: 'cs', label: 'Computer Science & IT', match: 'computer', count: allCourses.filter(c => c.title.toLowerCase().includes('computer') || c.department.toLowerCase().includes('computer') || c.title.toLowerCase().includes('software') || c.title.toLowerCase().includes('it')).length },
    { id: 'business', label: 'Business & Management', match: 'business', count: allCourses.filter(c => c.title.toLowerCase().includes('business') || c.department.toLowerCase().includes('business') || c.title.toLowerCase().includes('management') || c.title.toLowerCase().includes('mba') || c.title.toLowerCase().includes('accounting')).length },
    { id: 'engineering', label: 'Engineering & Applied Sciences', match: 'engineering', count: allCourses.filter(c => c.title.toLowerCase().includes('engineering') || c.department.toLowerCase().includes('engineering')).length },
    { id: 'health', label: 'Health & Medicine', match: 'health', count: allCourses.filter(c => c.title.toLowerCase().includes('health') || c.department.toLowerCase().includes('medicine') || c.title.toLowerCase().includes('nursing') || c.title.toLowerCase().includes('biomedical')).length },
    { id: 'arts', label: 'Arts & Design', match: 'art', count: allCourses.filter(c => c.title.toLowerCase().includes('art') || c.department.toLowerCase().includes('design') || c.title.toLowerCase().includes('media')).length },
    { id: 'social', label: 'Social Sciences', match: 'social', count: allCourses.filter(c => c.title.toLowerCase().includes('social') || c.department.toLowerCase().includes('social')).length },
    { id: 'natural', label: 'Natural Sciences', match: 'science', count: allCourses.filter(c => c.title.toLowerCase().includes('science') || c.department.toLowerCase().includes('science')).length },
    { id: 'education', label: 'Education & Teaching', match: 'education', count: allCourses.filter(c => c.title.toLowerCase().includes('education') || c.department.toLowerCase().includes('education')).length },
    { id: 'hospitality', label: 'Hospitality & Tourism', match: 'hospitality', count: allCourses.filter(c => c.title.toLowerCase().includes('hospitality') || c.title.toLowerCase().includes('tourism')).length },
    { id: 'law', label: 'Law', match: 'law', count: allCourses.filter(c => c.title.toLowerCase().includes('law') || c.department.toLowerCase().includes('law')).length },
    { id: 'architecture', label: 'Architecture & Built Environment', match: 'architecture', count: allCourses.filter(c => c.title.toLowerCase().includes('architecture') || c.department.toLowerCase().includes('architecture')).length },
  ], [allCourses]);

  // Filtering & Sorting Logic
  const filteredCourses = useMemo(() => {
    const list = allCourses.filter((course) => {
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
        if (selectedLevel === 'foundation') {
          if (course.level !== 'foundation' && course.level !== 'a-level') return false;
        } else if (selectedLevel === 'diploma') {
          if (course.level !== 'diploma' && course.level !== 'advanced-diploma') return false;
        } else {
          if (course.level !== selectedLevel) return false;
        }
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

    return [...list].sort((a, b) => {
      if (sortBy === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'fee-asc') {
        return a.annualFeeUSD - b.annualFeeUSD;
      }
      if (sortBy === 'fee-desc') {
        return b.annualFeeUSD - a.annualFeeUSD;
      }
      if (sortBy === 'qs') {
        const rankA = Number(a.qsRank2027 || 9999);
        const rankB = Number(b.qsRank2027 || 9999);
        return rankA - rankB;
      }
      return 0;
    });
  }, [allCourses, searchQuery, selectedCountry, selectedField, selectedLevel, selectedMode, selectedUniId, sortBy, fieldCategories]);

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* 1. Header */}
      <div className="mb-4 sm:mb-6 text-center sm:text-left">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Courses & Programs
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Discover the right program for your academic and career goals.
        </p>
      </div>

      {/* 2. Left Sidebar & Right Content Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* LEFT SIDEBAR: Filters */}
        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-lg">tune</span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Filters & Programs
              </h3>
            </div>
            {(selectedCountry !== 'all' || selectedField !== 'all' || selectedLevel !== 'all' || selectedMode !== 'all' || selectedUniId !== 'all' || searchQuery || sortBy !== 'qs') && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Filter in Sidebar */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
              Search Programs
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Title, university or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-9 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 focus:border-[#fbb034] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Sort By Filter in Sidebar */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
              Sort Ranking & Tariff
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer appearance-none"
              >
                <option value="qs">QS Rank (Best)</option>
                <option value="az">A–Z (Alphabetical)</option>
                <option value="fee-asc">Fee ↓ (Low to High)</option>
                <option value="fee-desc">Fee ↑ (High to Low)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
                expand_more
              </span>
            </div>
          </div>

          {/* Degree Level Filter */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
              Degree Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="undergraduate">Undergraduate (Bachelor's)</option>
              <option value="postgraduate">Postgraduate (Master's / MBA)</option>
              <option value="doctorate">Doctorate (PhD)</option>
              <option value="certificate">Certificate</option>
              <option value="foundation">Foundation / A-Level</option>
              <option value="diploma">Diploma</option>
              <option value="advanced-diploma">Advanced Diploma</option>
            </select>
          </div>

          {/* Field of Study Filter */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
              Program Field
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer"
            >
              {fieldCategories.map((f) => (
                <option key={f.id} value={f.id}>{f.label} ({f.count})</option>
              ))}
            </select>
          </div>

          {/* Country List in Sidebar */}
          <div className="space-y-2.5">
            <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
              Partner Countries
            </label>
            <div className="space-y-1 max-h-[220px] overflow-y-auto sleek-scrollbar pr-1">
              <button
                type="button"
                onClick={() => setSelectedCountry('all')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCountry === 'all'
                    ? 'bg-[#fbb034] text-slate-950 font-black shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>All Countries</span>
                {selectedCountry === 'all' && <span className="material-symbols-outlined text-[14px]">check</span>}
              </button>
              {APPROVED_COUNTRY_NAMES.map((c) => {
                const isActive = selectedCountry.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCountry(c)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#fbb034] text-slate-950 font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{c}</span>
                    {isActive && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Study Mode Filter */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
              Study Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer"
            >
              <option value="all">All Modes</option>
              <option value="full-time">Full-Time (On Campus)</option>
              <option value="part-time">Part-Time</option>
              <option value="online">Online / Distance</option>
            </select>
          </div>

          {/* University Filter */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
              University
            </label>
            <select
              value={selectedUniId}
              onChange={(e) => setSelectedUniId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer truncate"
            >
              <option value="all">All Universities</option>
              {allUnis.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.country})</option>
              ))}
            </select>
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results bar header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-xs">
                {filteredCourses.length}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Accredited Degree Programs Found
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium hidden sm:block">
              Official GEES Partner Admissions
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
                      {course.totalTuitionLocal && (
                        <span className="text-[9px] text-slate-400 block truncate">
                          Total: {course.totalTuitionLocal}
                        </span>
                      )}
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Intakes</span>
                      <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {course.intakes.slice(0, 2).join(' & ')}
                      </strong>
                    </div>
                  </div>

                  {/* Accreditations Badges */}
                  {course.accreditations && course.accreditations.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {course.accreditations.map((acc, aIdx) => (
                        <span key={aIdx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/50 text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          <span>{acc}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions: 44px min-height */}
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-2">
                  {course.universityWebsite && (
                    <a
                      href={course.universityWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 py-2"
                    >
                      <span className="material-symbols-outlined text-[14px]">public</span>
                      <span>Website</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => onApply(`${course.title} at ${course.universityName}`)}
                    className="min-h-[44px] ml-auto px-5 py-2.5 rounded-full bg-[#fbb034] hover:bg-[#f59e0b] active:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Apply Now</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
        </div>
      </div>

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
                          Apply Now
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
