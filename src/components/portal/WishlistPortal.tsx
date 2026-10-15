/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Dedicated Course Wishlist Portal
 * Displays saved degrees, allows quick removal of items, comparison,
 * and seamless booking of 1-on-1 counseling consultations.
 */

import React, { useState, useMemo } from 'react';
import { Course } from '../../types/index.ts';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { getCollaboratedCourses, getCollaboratedUniversities } from '../../utils/PartnerUniversityManager.ts';

interface WishlistPortalProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultation: (counselorNote?: string) => void;
  onNavigateToUni?: (uniSlug: string) => void;
}

export const WishlistPortal: React.FC<WishlistPortalProps> = ({
  onNavigate,
  onOpenConsultation,
  onNavigateToUni
}) => {
  const { wishlist, removeFromWishlist, clearWishlist, addToWishlist, isInWishlist } = useWishlist();
  const { formatUSD, formatPriceString } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'fee-asc' | 'fee-desc' | 'qs' | 'az'>('default');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Fallback sample courses for recommended quick-add when wishlist is empty
  const recommendedCourses = useMemo(() => {
    const all = getCollaboratedCourses();
    return all.slice(0, 3);
  }, []);

  const allUnis = useMemo(() => getCollaboratedUniversities(), []);

  const getUniSlug = (uniId: string): string => {
    const match = allUnis.find((u) => u.id === uniId);
    return match?.slug || 'universities';
  };

  const getUniBanner = (uniId: string): string => {
    const match = allUnis.find((u) => u.id === uniId);
    return match?.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80';
  };

  // Filtered & sorted wishlist items
  const filteredCourses = useMemo(() => {
    return wishlist.filter((c) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesUni = c.universityName.toLowerCase().includes(q);
        const matchesDept = c.department.toLowerCase().includes(q);
        const matchesCity = (c.city || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesUni && !matchesDept && !matchesCity) return false;
      }
      // Country filter
      if (selectedCountry !== 'all' && c.country !== selectedCountry) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && c.level !== selectedLevel) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'fee-asc') return (a.annualFeeUSD || 0) - (b.annualFeeUSD || 0);
      if (sortBy === 'fee-desc') return (b.annualFeeUSD || 0) - (a.annualFeeUSD || 0);
      if (sortBy === 'qs') {
        const qsA = Number(a.qsRank2027) || 9999;
        const qsB = Number(b.qsRank2027) || 9999;
        return qsA - qsB;
      }
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [wishlist, searchQuery, selectedCountry, selectedLevel, sortBy]);

  // Derived unique countries and levels in current wishlist
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    wishlist.forEach((c) => {
      if (c.country) set.add(c.country);
    });
    return Array.from(set);
  }, [wishlist]);

  // Summary Metrics
  const avgTuition = useMemo(() => {
    if (wishlist.length === 0) return 0;
    const sum = wishlist.reduce((acc, c) => acc + (c.annualFeeUSD || 0), 0);
    return Math.round(sum / wishlist.length);
  }, [wishlist]);

  const scholarshipCount = useMemo(() => {
    return wishlist.filter((c) => (c.scholarshipCoveragePct || 0) > 0).length;
  }, [wishlist]);

  const handleBookAll = () => {
    if (wishlist.length === 0) return;
    const summary = wishlist.map((c) => `${c.title} (${c.universityName})`).join('; ');
    onOpenConsultation(`Multi-Course Consultation Request for: ${summary}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('courses')}
            className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
          >
            Courses Explorer
          </button>
          <span>/</span>
          <span className="font-bold text-slate-900 dark:text-white">Wishlist Portal</span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('courses')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[17px]">arrow_back</span>
          <span>Back to Course Directory</span>
        </button>
      </div>

      {/* Main Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#1e1b4b] text-white p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold tracking-wide uppercase">
              <span className="material-symbols-outlined text-sm">bookmark</span>
              <span>Student Saved Courses Portal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              My Course <span className="text-[#fbb034]">Wishlist</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Review your saved international degree programs, compare annual tuition tariffs, and book free 1-on-1 academic counseling sessions with GEES senior education advisors.
            </p>
          </div>

          {/* Quick Action Buttons */}
          {wishlist.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleBookAll}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-[#fbb034] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs tracking-wide uppercase transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">event_available</span>
                <span>Book Consultation for All ({wishlist.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-red-500/20 border border-white/15 hover:border-red-400/50 text-slate-200 hover:text-red-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">delete_sweep</span>
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Stat Highlights */}
        {wishlist.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Shortlisted Programs</span>
              <strong className="text-xl sm:text-2xl font-black text-white">{wishlist.length}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Countries Represented</span>
              <strong className="text-xl sm:text-2xl font-black text-amber-300">{availableCountries.length || 1}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Avg. Annual Tuition</span>
              <strong className="text-xl sm:text-2xl font-black text-emerald-400">{formatUSD(avgTuition)}</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">With Scholarships</span>
              <strong className="text-xl sm:text-2xl font-black text-sky-400">{scholarshipCount} Programs</strong>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clear Wishlist */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clear All Saved Courses?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to remove all {wishlist.length} courses from your wishlist? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearWishlist();
                  setShowClearConfirm(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {wishlist.length === 0 ? (
        /* Empty State with Friendly Vector Illustration */
        <div className="text-center py-12 sm:py-20 px-4 xs:px-6 sm:px-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto space-y-6">
          {/* SVG Illustration Vector */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/20 via-blue-500/10 to-indigo-500/20 blur-2xl animate-pulse" />
            <svg className="w-full h-full relative z-10 text-[#fbb034]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" className="fill-amber-50 dark:fill-slate-800/80 stroke-amber-200 dark:stroke-slate-700" strokeWidth="2" strokeDasharray="6 6" />
              <rect x="65" y="45" width="70" height="110" rx="14" className="fill-white dark:fill-slate-900 stroke-amber-400" strokeWidth="3" />
              <path d="M85 45V90L100 78L115 90V45" className="fill-[#fbb034] opacity-90" />
              <rect x="75" y="105" width="50" height="6" rx="3" className="fill-slate-200 dark:fill-slate-700" />
              <rect x="75" y="118" width="35" height="6" rx="3" className="fill-slate-200 dark:fill-slate-700" />
              <circle cx="140" cy="65" r="18" className="fill-blue-600 shadow-lg" />
              <path d="M134 65L138 69L146 61" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 120C40 115 50 110 60 115" stroke="#fbb034" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="70" r="6" className="fill-amber-400 animate-ping" />
              <circle cx="155" cy="135" r="5" className="fill-indigo-400" />
            </svg>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your Course Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              You haven't saved any degrees yet. Explore our global catalog of over 450+ accredited bachelor's, master's, and doctorate degree programs to bookmark your top choices!
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#fbb034] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/25 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Browse Courses & Degrees Now</span>
          </button>

          {/* Quick Add Recommendations */}
          {recommendedCourses.length > 0 && (
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-left max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                Popular Programs You May Like:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedCourses.map((rc) => {
                  const saved = isInWishlist(rc.id);
                  return (
                    <div
                      key={rc.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between space-y-2 hover:border-amber-400/50 transition-colors"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block truncate">
                          {rc.universityName}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                          {rc.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {formatUSD(rc.annualFeeUSD)}/yr
                        </span>

                        <button
                          type="button"
                          onClick={() => addToWishlist(rc)}
                          disabled={saved}
                          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            saved
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {saved ? 'check' : 'add'}
                          </span>
                          <span>{saved ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Saved Courses Directory List & Grid */
        <div className="space-y-6">
          {/* Controls: Search, Filters & Sorting */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search within wishlist */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved courses or universities..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#fbb034] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Filter Pills and Sort */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Country selector */}
              {availableCountries.length > 1 && (
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Countries</option>
                  {availableCountries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}

              {/* Study Level selector */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Study Levels</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="doctorate">Doctorate (PhD)</option>
                <option value="diploma">Diploma</option>
              </select>

              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="default">Sort by: Default</option>
                <option value="qs">QS World Ranking</option>
                <option value="fee-asc">Tuition: Low to High</option>
                <option value="fee-desc">Tuition: High to Low</option>
                <option value="az">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results count banner */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredCourses.length}</strong> of {wishlist.length} saved {wishlist.length === 1 ? 'degree program' : 'degree programs'}
            </span>

            {(searchQuery || selectedCountry !== 'all' || selectedLevel !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('all');
                  setSelectedLevel('all');
                }}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Grid of Saved Courses */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
              <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">search_off</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No courses match your filter</h4>
              <p className="text-xs text-slate-500 mt-1">Try resetting your search query or country selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const uniSlug = getUniSlug(course.universityId);
                const bannerUrl = getUniBanner(course.universityId);

                return (
                  <article
                    key={course.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Banner */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        <img
                          src={bannerUrl}
                          alt={course.universityName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                        {/* Top row: Flag + QS / Level + Quick Remove button */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-extrabold shadow-md flex items-center gap-1">
                            <span>{course.flagEmoji}</span>
                            <span>{course.country}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            {course.qsRank2027 ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10.5px] font-black shadow-xs flex items-center gap-1">
                                <span>QS:</span>
                                <span>#{course.qsRank2027}</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                                {course.level}
                              </span>
                            )}

                            {/* Remove button right on image corner for effortless removal */}
                            <button
                              type="button"
                              onClick={() => removeFromWishlist(course.id)}
                              aria-label={`Remove ${course.title} from wishlist`}
                              title="Remove from Wishlist"
                              className="w-8 h-8 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Bottom row over banner: City & University */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] uppercase font-bold text-amber-300">
                            {course.city}{course.state ? `, ${course.state}` : ''}, {course.country}
                          </span>
                          <h3
                            onClick={() => {
                              if (onNavigateToUni && uniSlug) {
                                onNavigateToUni(uniSlug);
                              }
                            }}
                            className="text-base font-bold leading-snug line-clamp-1 hover:text-amber-300 cursor-pointer transition-colors"
                          >
                            {course.universityName}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3">
                        {/* Course Title and Department */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10.5px] font-extrabold uppercase">
                              {course.level}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold ${
                              course.studyMode === 'Online'
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {course.studyMode || 'Full-Time'}
                            </span>
                            {course.scholarshipCoveragePct && course.scholarshipCoveragePct > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                Up to {course.scholarshipCoveragePct}% Scholarship
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 pt-0.5">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {course.department}
                          </p>
                        </div>

                        {/* Program Specs */}
                        <div className="space-y-1 pt-1">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-slate-400">schedule</span>
                              <span>{course.durationYears || `${Math.round(course.durationMonths / 12)} Yrs`}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-slate-400">event</span>
                              <span>{course.intakes.slice(0, 2).join(' & ')}</span>
                            </span>
                            {course.ieltsRequirement && (
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px] text-slate-400">translate</span>
                                <span>IELTS {course.ieltsRequirement}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tuition Fee Breakdown */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 items-center">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Tuition</span>
                            <strong className="text-slate-900 dark:text-white text-sm font-black">
                              {formatUSD(course.annualFeeUSD)} / yr
                            </strong>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Local Tariff</span>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate block">
                              {formatPriceString(course.tuitionFeeLocal, course.annualFeeUSD)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row: Book Consultation (Amber/Gold) + Apply (Red) + Remove Button */}
                    <div className="p-5 pt-0 space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Book Consultation button with clear counselor icon */}
                        <button
                          type="button"
                          onClick={() => onOpenConsultation(`Admissions Consultation for ${course.title} at ${course.universityName}`)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-[#fbb034] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">support_agent</span>
                          <span>Book Consultation</span>
                        </button>

                        {/* Apply Now button */}
                        <button
                          type="button"
                          onClick={() => onOpenConsultation(`Direct Application for ${course.title} at ${course.universityName}`)}
                          className="py-2.5 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer text-center active:scale-95"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Explicit Remove Item Action */}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(course.id)}
                        className="w-full py-1.5 text-center text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 hover:underline flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                        <span>Remove from Wishlist</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
