/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Dynamic University & Course Explorer with /universities/[slug] details
 */

import React, { useState, useMemo } from 'react';
import { mockUniversities, mockCourses } from '../../data/mockDatabase.ts';
import { SkeletonLoader } from '../common/SkeletonLoader.tsx';
import { AnimatedTabs, AnimatedTabItem } from '../ui/animated-tabs.tsx';
import { getPartnerCountryTabs, getTotalPartnerCount } from '../../utils/PartnerUniversityManager.ts';

interface UniversityExplorerViewProps {
  initialSlug?: string;
  onApply: (uniName: string) => void;
}

export const UniversityExplorerView: React.FC<UniversityExplorerViewProps> = ({
  initialSlug,
  onApply
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniSlug, setSelectedUniSlug] = useState<string | null>(initialSlug || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'campuses' | 'admissions' | 'accommodation' | 'articles'>('overview');
  const [selectedArticleModal, setSelectedArticleModal] = useState<any | null>(null);
  const [isLoading] = useState<boolean>(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<'az' | 'fee-asc' | 'fee-desc' | 'qs'>('qs');

  // Dynamically populated from PartnerUniversityManager template
  const countryTabs: AnimatedTabItem[] = useMemo(() => {
    return getPartnerCountryTabs();
  }, []);

  const handleCountryChange = (c: string) => {
    setSelectedCountry(c);
  };

  const filteredUnis = useMemo(() => {
    const list = mockUniversities.filter(u => {
      const matchesCountry = selectedCountry === 'all' || u.country.toLowerCase() === selectedCountry.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.popularPrograms.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCountry && matchesSearch;
    });

    // Sorting logic
    return [...list].sort((a, b) => {
      if (sortBy === 'az') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'fee-asc') {
        return a.avgTuitionAnnualUSD - b.avgTuitionAnnualUSD;
      }
      if (sortBy === 'fee-desc') {
        return b.avgTuitionAnnualUSD - a.avgTuitionAnnualUSD;
      }
      if (sortBy === 'qs') {
        const rankA = Number(a.qsRank2027 || 9999);
        const rankB = Number(b.qsRank2027 || 9999);
        return rankA - rankB;
      }
      return 0;
    });
  }, [selectedCountry, searchQuery, sortBy]);

  const activeUniversity = selectedUniSlug
    ? mockUniversities.find(u => u.slug === selectedUniSlug)
    : null;

  const universityCourses = activeUniversity
    ? mockCourses.filter(c => c.universityId === activeUniversity.id)
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Global Database & Partner Directory
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Explore Partner Universities & Campuses
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Browse verified entry requirements, tuition fees, and scholarship criteria with direct application representation.
          </p>
        </div>
        {selectedUniSlug && (
          <button
            onClick={() => setSelectedUniSlug(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer self-start md:self-auto shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to All Universities</span>
          </button>
        )}
      </div>

      {/* VIEW A: Single University Profile [slug] */}
      {activeUniversity ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-fadeIn">
          {/* Banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
            <img
              src={activeUniversity.bannerUrl}
              alt={activeUniversity.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute bottom-6 inset-x-6 sm:inset-x-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-2xl">{activeUniversity.flagEmoji}</span>
                  {activeUniversity.qsRank2027 && (
                    <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-sm flex items-center gap-1">
                      <span>QS 2027:</span>
                      <span>#{activeUniversity.qsRank2027}</span>
                    </span>
                  )}
                  <span className="px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs">
                    {activeUniversity.type || 'University'}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-amber-400/90 text-slate-950 font-bold text-xs">
                    {activeUniversity.country}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {activeUniversity.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                  <span>{activeUniversity.city}{activeUniversity.state ? `, ${activeUniversity.state}` : ''}, {activeUniversity.country}</span>
                  {activeUniversity.established && <span>• Est. {activeUniversity.established}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {activeUniversity.websiteUrl && (
                  <a
                    href={activeUniversity.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <span>Visit Website</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                )}
                <button
                  onClick={() => onApply(activeUniversity.name)}
                  className="px-6 py-2.5 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-transform active:scale-95 shrink-0 cursor-pointer"
                >
                  Apply Now →
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-4 sm:px-8 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center overflow-x-auto no-scrollbar">
            <AnimatedTabs
              tabs={[
                { id: 'overview', label: 'Overview & Highlights' },
                { id: 'programs', label: `Available Programs (${universityCourses.length})` },
                { id: 'campuses', label: `Campuses (${activeUniversity.campuses.length})` },
                { id: 'admissions', label: 'Entry Requirements & Fees' },
                { id: 'accommodation', label: `Accommodation (${(activeUniversity.accommodations?.length) || 2})` },
                { id: 'articles', label: `Articles & Guides (${(activeUniversity.articles?.length) || 2})` }
              ]}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as any)}
              size="sm"
            />
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-4xl">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {activeUniversity.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Avg Tuition</span>
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      ${activeUniversity.avgTuitionAnnualUSD.toLocaleString()} / yr
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Institution Type</span>
                    <span className="text-sm sm:text-base font-black text-blue-600 truncate block">
                      {activeUniversity.type || 'University'}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Establishment</span>
                    <span className="text-base sm:text-lg font-black text-emerald-600">
                      {activeUniversity.established ? `Est. ${activeUniversity.established}` : 'Established'}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Intakes</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {activeUniversity.intakes.join(' & ')}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Popular Faculties & Disciplines</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeUniversity.popularPrograms.map((prog, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {universityCourses.length} Accredited Degree Programs Available
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                    Official GEES Partner Admissions
                  </span>
                </div>
                {universityCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 transition-all shadow-xs"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[10px] font-black uppercase text-blue-700 dark:text-blue-300">
                            {c.level}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {c.durationYears || `${c.durationMonths} Months`}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                            {c.studyMode || 'Full-Time'}
                          </span>
                          {c.campusName && (
                            <span className="text-xs text-slate-400">
                              • {c.campusName}
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                          {c.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                          {c.overview}
                        </p>

                        {/* Accreditations Badges from en.your-uni.com */}
                        {c.accreditations && c.accreditations.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {c.accreditations.map((acc, aIdx) => (
                              <span key={aIdx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/50 text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                <span>{acc}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Intakes & Requirements */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                          {c.intakes && c.intakes.length > 0 && (
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-slate-400">event</span>
                              <span>Intakes: <strong>{c.intakes.join(', ')}</strong></span>
                            </span>
                          )}
                          {c.entryRequirements && (
                            <span className="flex items-center gap-1 truncate max-w-md">
                              <span className="material-symbols-outlined text-sm text-slate-400">school</span>
                              <span className="truncate">{c.entryRequirements}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right column: Tuitions & CTA */}
                      <div className="lg:text-right shrink-0 pt-2 lg:pt-0 flex flex-row lg:flex-col justify-between items-end lg:items-end gap-3 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
                            {c.tuitionFeeLocal}
                          </span>
                          {c.totalTuitionLocal && (
                            <span className="text-[11px] font-semibold text-slate-400 block">
                              Total Est: {c.totalTuitionLocal} ({c.totalTuitionUSD || `$${(c.annualFeeUSD * 3).toLocaleString()}`})
                            </span>
                          )}
                          <span className="text-xs text-emerald-600 font-semibold block mt-0.5">
                            Min English: IELTS {c.ieltsRequirement || 5.5}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onApply(`${activeUniversity.name} - ${c.title}`)}
                            className="px-5 py-2 rounded-xl bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
                          >
                            Apply for Course
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'campuses' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeUniversity.campuses.map((campus) => (
                  <div key={campus.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="material-symbols-outlined text-blue-600 text-2xl mb-1">location_city</span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{campus.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{campus.city}, {campus.stateOrProvince ? `${campus.stateOrProvince}, ` : ''}{campus.country}</p>
                    {campus.isMainCampus && (
                      <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Main Flagship Campus
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'admissions' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-1">Scholarship Consideration</h4>
                  <p>International applicants through GEES are automatically considered for merit entrance scholarships ranging up to 25% to 50% tuition remission.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <strong className="text-slate-900 dark:text-white block">Undergraduate Requirements:</strong>
                  <p>HSC / Cambridge A-Levels / High School Diploma with minimum passing marks in core subjects. English proficiency IELTS 5.5 - 6.0 or recognized English medium waiver.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <strong className="text-slate-900 dark:text-white block">Postgraduate Requirements:</strong>
                  <p>Recognized Bachelor’s degree with minimum CGPA 2.50 or equivalent work experience for MBA programs.</p>
                </div>
              </div>
            )}

            {/* ACCOMMODATION TAB (Inspired by en.your-uni.com/university/mmu-university/accommodation) */}
            {activeTab === 'accommodation' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                      Verified Student Residences in {activeUniversity.city}
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                      GEES provides direct placement support for on-campus hostels and verified student apartments.
                    </p>
                  </div>
                  <button
                    onClick={() => onApply(`${activeUniversity.name} - Accommodation Placement Assistance`)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    Request Housing Booking
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {((activeUniversity.accommodations && activeUniversity.accommodations.length > 0)
                    ? activeUniversity.accommodations
                    : [
                        {
                          id: 'acc-default-1',
                          name: `${activeUniversity.name} On-Campus Student Residence`,
                          type: 'On-Campus Hostel' as const,
                          distanceToCampus: '0 km (Inside Campus)',
                          monthlyRentMYR: 'MYR 400 - 600 / month',
                          monthlyRentUSD: '$90 - $135 / month',
                          roomTypes: ['Single Room (Air-Conditioned)', 'Twin Sharing Room'],
                          amenities: ['24/7 Security & Keycard Access', 'High-Speed Wi-Fi', 'Dining Hall', 'Laundry', 'Study Hall'],
                          imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop',
                          description: 'Safe and convenient on-campus student residence footsteps from classrooms and faculty libraries.'
                        },
                        {
                          id: 'acc-default-2',
                          name: `Metro Student Apartments (${activeUniversity.city})`,
                          type: 'Condominium' as const,
                          distanceToCampus: '600m (Campus Shuttle Available)',
                          monthlyRentMYR: 'MYR 500 - 850 / month',
                          monthlyRentUSD: '$115 - $190 / month',
                          roomTypes: ['Master Bedroom', 'Medium AC Room', 'Single Studio'],
                          amenities: ['Swimming Pool & Gym', 'Air Conditioning', 'Full Kitchen', 'High-Speed Internet', '24/7 Security'],
                          imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop',
                          description: 'Modern condominium living with resort facilities, surrounding supermarkets and transit connections.'
                        }
                      ]
                  ).map((acc) => (
                    <div key={acc.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col">
                      <div className="h-44 w-full relative overflow-hidden bg-slate-800">
                        <img
                          src={acc.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop'}
                          alt={acc.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold">
                          {acc.type}
                        </span>
                        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                          {acc.distanceToCampus}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">{acc.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{acc.description}</p>
                          
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Rent</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-black text-emerald-600">{acc.monthlyRentMYR}</span>
                              <span className="text-xs text-slate-400">({acc.monthlyRentUSD})</span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {acc.amenities.slice(0, 4).map((am, amIdx) => (
                              <span key={amIdx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => onApply(`${activeUniversity.name} - ${acc.name} Housing Inquiry`)}
                          className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#fbb034] text-slate-800 hover:text-slate-950 font-bold text-xs transition-colors cursor-pointer mt-2"
                        >
                          Inquire for Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ARTICLES & GUIDES TAB (Inspired by en.your-uni.com/university/mmu-university/articles) */}
            {activeTab === 'articles' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {((activeUniversity.articles && activeUniversity.articles.length > 0)
                    ? activeUniversity.articles
                    : [
                        {
                          id: 'art-default-1',
                          title: `Complete Student Visa & Immigration Guide for ${activeUniversity.country}`,
                          summary: `Everything you need to know about student visas, offer letters, health insurance, and arrival processing.`,
                          category: 'Visa & EMGS' as const,
                          readTime: '5 min read',
                          date: 'Oct 2026',
                          imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop'
                        },
                        {
                          id: 'art-default-2',
                          title: `Cost of Living & Part-Time Work in ${activeUniversity.city}`,
                          summary: `Real budgeting insights on accommodation, food, transportation, and part-time work privileges.`,
                          category: 'Campus Life' as const,
                          readTime: '4 min read',
                          date: 'Oct 2026',
                          imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3ab695d3f?q=80&w=600&auto=format&fit=crop'
                        }
                      ]
                  ).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticleModal(art)}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:border-blue-500 transition-all cursor-pointer group flex flex-col"
                    >
                      <div className="h-44 w-full relative overflow-hidden bg-slate-800">
                        <img
                          src={art.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop'}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          {art.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                            <span>{art.date}</span>
                            <span>•</span>
                            <span>{art.readTime}</span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {art.summary}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 mt-2">
                          <span>Read Full Guide</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VIEW B: Universities Faceted Directory with Left-Side Filter Sidebar */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* LEFT SIDEBAR: Filters */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-lg">tune</span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Filters & Destinations
                </h3>
              </div>
              {(selectedCountry !== 'all' || searchQuery || sortBy !== 'qs') && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedCountry('all'); setSortBy('qs'); }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Search Filter in Sidebar */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                Search University
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Name, city or program..."
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
                Sort Ranking & Tuition
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 cursor-pointer appearance-none"
                >
                  <option value="qs">QS Rank (Best)</option>
                  <option value="az">A–Z (Alphabetical)</option>
                  <option value="fee-asc">Tuition: Low to High</option>
                  <option value="fee-desc">Tuition: High to Low</option>
                </select>
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
                  expand_more
                </span>
              </div>
            </div>

            {/* Country List in Sidebar */}
            <div className="space-y-2.5 pt-2">
              <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                Partner Countries ({countryTabs.length})
              </label>
              <div className="space-y-1 max-h-[360px] overflow-y-auto sleek-scrollbar pr-1">
                {countryTabs.map((tab) => {
                  const isActive = selectedCountry === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleCountryChange(tab.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#fbb034] text-slate-950 font-black shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{tab.label}</span>
                      {isActive && (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results bar header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-xs">
                  {filteredUnis.length}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Verified Partner Universities Found
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Showing official GEES represented campuses
              </div>
            </div>

            {/* Universities Grid with Skeleton Screens */}
            {isLoading ? (
              <SkeletonLoader type="university" count={6} />
            ) : filteredUnis.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">school</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No partner universities found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  No collaborated universities found matching your criteria. Try searching with a different term or view all partner countries.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedCountry('all'); setSortBy('qs'); }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUnis.map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => setSelectedUniSlug(uni.slug)}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Banner */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        <img src={uni.bannerUrl} alt={uni.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent"></div>
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-2xl drop-shadow">{uni.flagEmoji}</span>
                          {uni.qsRank2027 ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10.5px] font-black shadow-xs flex items-center gap-1">
                              <span>QS 2027:</span>
                              <span>#{uni.qsRank2027}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                              {uni.type || 'University'}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] uppercase font-bold text-amber-300">
                            {uni.city}{uni.state ? `, ${uni.state}` : ''}, {uni.country}
                          </span>
                          <h3 className="text-lg font-bold leading-snug line-clamp-1">{uni.name}</h3>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3">
                        {/* Meta: Type & Established Year */}
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-blue-600">account_balance</span>
                            <span>{uni.type || 'University'}</span>
                          </span>
                          {uni.established && (
                            <span className="font-medium text-slate-500">Est. {uni.established}</span>
                          )}
                        </div>

                        {/* Available Programs Chips */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                            Available Programs:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {uni.popularPrograms.slice(0, 3).map((prog, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[210px]"
                              >
                                {prog}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Tuition & Website Action */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 items-center">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Tuition</span>
                            <strong className="text-slate-900 dark:text-white">${uni.avgTuitionAnnualUSD.toLocaleString()} / yr</strong>
                          </div>
                          <div className="text-right">
                            {uni.websiteUrl && (
                              <a
                                href={uni.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                <span>Website</span>
                                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-blue-600">
                      <span>View Details & Programs</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Article Detail Reader Modal (Inspired by en.your-uni.com articles) */}
      {selectedArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticleModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider inline-block mb-3">
              {selectedArticleModal.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              {selectedArticleModal.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
              <span>{selectedArticleModal.date}</span>
              <span>•</span>
              <span>{selectedArticleModal.readTime}</span>
              <span>•</span>
              <span>Verified GEES Academic Guide</span>
            </div>

            {selectedArticleModal.imageUrl && (
              <div className="rounded-2xl overflow-hidden mb-6 h-56 w-full">
                <img
                  src={selectedArticleModal.imageUrl}
                  alt={selectedArticleModal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-base text-slate-900 dark:text-white">
                {selectedArticleModal.summary}
              </p>
              <p>
                As part of GEES educational consultancy partnerships, students applying to partner universities benefit from prioritized Visa Approval Letter (VAL) processing through Education Malaysia Global Services (EMGS), transparent tuition fee schedules, and guaranteed on-campus or condominium accommodation allocations.
              </p>
              <p>
                Our registered counselors guide students through document verification, English proficiency waivers (where applicable), and direct credit exemptions for professional qualifications including ACCA, CIMA, and CMI.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-slate-500">Need specific advice for this program?</span>
              <button
                onClick={() => {
                  const title = selectedArticleModal.title;
                  setSelectedArticleModal(null);
                  onApply(`Counseling Inquiry regarding ${title}`);
                }}
                className="px-6 py-2.5 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                Consult Counselor for Free →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
