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
import { APPROVED_COUNTRY_NAMES } from '../../lib/country-config.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import Slider06 from '../ui/slider-06';

interface UniversityExplorerViewProps {
  initialSlug?: string;
  onApply: (uniName: string) => void;
}

export const UniversityExplorerView: React.FC<UniversityExplorerViewProps> = ({
  initialSlug,
  onApply
}) => {
  const { formatUSD, formatPriceString } = useCurrency();
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRankTiers, setSelectedRankTiers] = useState<string[]>([]);
  const [selectedTuitions, setSelectedTuitions] = useState<string[]>([]);
  const [selectedIelts, setSelectedIelts] = useState<string[]>([]);
  const [selectedIntakes, setSelectedIntakes] = useState<string[]>([]);
  const [scholarshipOnly, setScholarshipOnly] = useState<boolean>(false);
  const [feeWaiverOnly, setFeeWaiverOnly] = useState<boolean>(false);
  const [minFee, setMinFee] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(214000);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    destinations: true,
    studyLevel: true,
    ielts: true,
    intake: true,
    institutionType: true,
    duration: true,
    feeRange: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniSlug, setSelectedUniSlug] = useState<string | null>(initialSlug || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'campuses' | 'admissions' | 'accommodation' | 'articles'>('overview');
  const [selectedArticleModal, setSelectedArticleModal] = useState<any | null>(null);
  const [isLoading] = useState<boolean>(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<'az' | 'fee-asc' | 'fee-desc' | 'qs'>('qs');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  // Dynamically populated from PartnerUniversityManager template
  const countryTabs: AnimatedTabItem[] = useMemo(() => {
    return getPartnerCountryTabs();
  }, []);

  // Filter Facet Counts calculation from mockUniversities
  const facetCounts = useMemo(() => {
    const countryMap: Record<string, number> = {};
    let undergradCount = 0;
    let postgradCount = 0;
    let doctorateCount = 0;
    let diplomaCount = 0;

    let publicCount = 0;
    let privateCount = 0;
    let researchCount = 0;

    let qsTop100 = 0;
    let qsTop300 = 0;
    let qsTop500 = 0;
    let qsTop1000 = 0;

    let under5k = 0;
    let fee5k10k = 0;
    let fee10k20k = 0;
    let above20k = 0;

    let ielts55 = 0;
    let ielts60 = 0;
    let ielts65 = 0;
    let ielts70 = 0;
    let ieltsWaiver = 0;

    let scholarshipCount = 0;

    mockUniversities.forEach((u) => {
      // Country count
      countryMap[u.country] = (countryMap[u.country] || 0) + 1;

      // Degree Level counts based on popular programs or defaults
      const programsText = u.popularPrograms.join(' ').toLowerCase();
      if (programsText.includes('bachelor') || programsText.includes('btech') || programsText.includes('bsc') || programsText.includes('ba ') || u.type?.toLowerCase().includes('university')) {
        undergradCount++;
      }
      if (programsText.includes('master') || programsText.includes('mba') || programsText.includes('msc') || programsText.includes('postgraduate') || u.type?.toLowerCase().includes('university')) {
        postgradCount++;
      }
      if (programsText.includes('phd') || programsText.includes('doctor') || programsText.includes('research') || u.type?.toLowerCase().includes('research')) {
        doctorateCount++;
      }
      if (programsText.includes('diploma') || programsText.includes('foundation') || u.type?.toLowerCase().includes('college')) {
        diplomaCount++;
      }

      // Type counts
      const t = (u.type || '').toLowerCase();
      if (t.includes('public')) publicCount++;
      if (t.includes('private')) privateCount++;
      if (t.includes('research') || t.includes('uas') || t.includes('technology')) researchCount++;

      // QS Tiers
      const rank = Number(u.qsRank2027);
      if (rank > 0) {
        if (rank <= 100) qsTop100++;
        if (rank <= 300) qsTop300++;
        if (rank <= 500) qsTop500++;
        if (rank <= 1000) qsTop1000++;
      }

      // Tuition ranges
      const fee = u.avgTuitionAnnualUSD;
      if (fee < 5000) under5k++;
      else if (fee <= 10000) fee5k10k++;
      else if (fee <= 20000) fee10k20k++;
      else above20k++;

      // IELTS Requirements
      const iScore = u.minIeltsScore || 6.0;
      if (iScore <= 5.5) ielts55++;
      if (iScore <= 6.0) ielts60++;
      if (iScore <= 6.5) ielts65++;
      if (iScore >= 7.0 || (rank > 0 && rank <= 150)) ielts70++;
      if (u.country === 'Malaysia' || u.country === 'Cyprus' || u.country === 'India' || t.includes('college') || iScore <= 5.5) {
        ieltsWaiver++;
      }

      // Scholarships
      if (u.scholarshipsAvailable) scholarshipCount++;
    });

    return {
      countryMap,
      undergradCount,
      postgradCount,
      doctorateCount,
      diplomaCount,
      publicCount,
      privateCount,
      researchCount,
      qsTop100,
      qsTop300,
      qsTop500,
      qsTop1000,
      under5k,
      fee5k10k,
      fee10k20k,
      above20k,
      ielts55,
      ielts60,
      ielts65,
      ielts70,
      ieltsWaiver,
      scholarshipCount,
    };
  }, []);

  // Toggle helpers
  const toggleCountry = (country: string) => {
    if (country === 'all') {
      setSelectedCountries([]);
      setSelectedCountry('all');
    } else {
      setSelectedCountries((prev) => {
        if (prev.includes(country)) {
          const next = prev.filter((c) => c !== country);
          if (next.length === 1) setSelectedCountry(next[0]);
          else if (next.length === 0) setSelectedCountry('all');
          return next;
        } else {
          setSelectedCountry(country);
          return [...prev, country];
        }
      });
    }
    setCurrentPage(1);
  };

  const toggleLevel = (lvl: string) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((x) => x !== lvl) : [...prev, lvl]
    );
    setCurrentPage(1);
  };

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
    setCurrentPage(1);
  };

  const toggleRankTier = (tier: string) => {
    setSelectedRankTiers((prev) =>
      prev.includes(tier) ? prev.filter((x) => x !== tier) : [...prev, tier]
    );
    setCurrentPage(1);
  };

  const toggleTuition = (range: string) => {
    setSelectedTuitions((prev) =>
      prev.includes(range) ? prev.filter((x) => x !== range) : [...prev, range]
    );
    setCurrentPage(1);
  };

  const toggleIelts = (tier: string) => {
    setSelectedIelts((prev) =>
      prev.includes(tier) ? prev.filter((x) => x !== tier) : [...prev, tier]
    );
    setCurrentPage(1);
  };

  const toggleIntake = (month: string) => {
    setSelectedIntakes((prev) =>
      prev.includes(month) ? prev.filter((x) => x !== month) : [...prev, month]
    );
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCountries([]);
    setSelectedCountry('all');
    setSelectedLevels([]);
    setSelectedTypes([]);
    setSelectedRankTiers([]);
    setSelectedTuitions([]);
    setSelectedIelts([]);
    setSelectedIntakes([]);
    setScholarshipOnly(false);
    setFeeWaiverOnly(false);
    setSortBy('qs');
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCountries.length > 0) count += selectedCountries.length;
    if (selectedLevels.length > 0) count += selectedLevels.length;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (selectedRankTiers.length > 0) count += selectedRankTiers.length;
    if (selectedTuitions.length > 0) count += selectedTuitions.length;
    if (selectedIelts.length > 0) count += selectedIelts.length;
    if (selectedIntakes.length > 0) count += selectedIntakes.length;
    if (scholarshipOnly) count += 1;
    if (searchQuery.trim()) count += 1;
    return count;
  }, [
    selectedCountries,
    selectedLevels,
    selectedTypes,
    selectedRankTiers,
    selectedTuitions,
    selectedIelts,
    scholarshipOnly,
    searchQuery,
  ]);

  const filteredUnis = useMemo(() => {
    const list = mockUniversities.filter((u) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesCity = u.city.toLowerCase().includes(q);
        const matchesCountry = u.country.toLowerCase().includes(q);
        const matchesProg = u.popularPrograms.some((p) => p.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesCountry && !matchesProg) return false;
      }

      // 2. Countries (multi-select)
      if (selectedCountries.length > 0) {
        const matchesCountry = selectedCountries.some(
          (c) => c.toLowerCase() === u.country.toLowerCase()
        );
        if (!matchesCountry) return false;
      }

      // 3. Degree Level
      if (selectedLevels.length > 0) {
        const progStr = u.popularPrograms.join(' ').toLowerCase();
        const hasLevel = selectedLevels.some((lvl) => {
          if (lvl === 'undergrad') {
            return progStr.includes('bachelor') || progStr.includes('btech') || progStr.includes('bsc') || progStr.includes('ba ') || u.type?.toLowerCase().includes('university');
          }
          if (lvl === 'postgrad') {
            return progStr.includes('master') || progStr.includes('mba') || progStr.includes('msc') || progStr.includes('postgraduate') || u.type?.toLowerCase().includes('university');
          }
          if (lvl === 'doctorate') {
            return progStr.includes('phd') || progStr.includes('doctor') || u.type?.toLowerCase().includes('research');
          }
          if (lvl === 'diploma') {
            return progStr.includes('diploma') || progStr.includes('foundation') || u.type?.toLowerCase().includes('college');
          }
          return false;
        });
        if (!hasLevel) return false;
      }

      // 4. Institution Type
      if (selectedTypes.length > 0) {
        const t = (u.type || '').toLowerCase();
        const matchesType = selectedTypes.some((selectedT) => {
          if (selectedT === 'public') return t.includes('public');
          if (selectedT === 'private') return t.includes('private');
          if (selectedT === 'research') return t.includes('research') || t.includes('uas') || t.includes('technology');
          return false;
        });
        if (!matchesType) return false;
      }

      // 5. QS Ranking Tiers
      if (selectedRankTiers.length > 0) {
        const rank = Number(u.qsRank2027);
        const matchesRank = selectedRankTiers.some((tier) => {
          if (tier === 'top100') return rank > 0 && rank <= 100;
          if (tier === 'top300') return rank > 0 && rank <= 300;
          if (tier === 'top500') return rank > 0 && rank <= 500;
          if (tier === 'top1000') return rank > 0 && rank <= 1000;
          return false;
        });
        if (!matchesRank) return false;
      }

      // 6. Tuition Fee
      if (selectedTuitions.length > 0) {
        const fee = u.avgTuitionAnnualUSD;
        const matchesTuition = selectedTuitions.some((rng) => {
          if (rng === 'under5k') return fee < 5000;
          if (rng === '5k-10k') return fee >= 5000 && fee <= 10000;
          if (rng === '10k-20k') return fee > 10000 && fee <= 20000;
          if (rng === 'above20k') return fee > 20000;
          return false;
        });
        if (!matchesTuition) return false;
      }

      // 7. IELTS Score
      if (selectedIelts.length > 0) {
        const score = u.minIeltsScore || 6.0;
        const rank = Number(u.qsRank2027);
        const t = (u.type || '').toLowerCase();
        const matchesIelts = selectedIelts.some((val) => {
          if (val === '5.5') return score <= 5.5;
          if (val === '6.0') return score <= 6.0;
          if (val === '6.5') return score <= 6.5;
          if (val === '7.0') return score >= 7.0 || (rank > 0 && rank <= 150);
          if (val === 'waiver') return u.country === 'Malaysia' || u.country === 'Cyprus' || u.country === 'India' || t.includes('college') || score <= 5.5;
          return false;
        });
        if (!matchesIelts) return false;
      }

      // 8. Scholarship
      if (scholarshipOnly && !u.scholarshipsAvailable) {
        return false;
      }
      // 9. Intake
      if (selectedIntakes.length > 0) {
        const matchesIntake = selectedIntakes.some((month) =>
          u.intakes.map((i) => i.toLowerCase()).includes(month.toLowerCase())
        );
        if (!matchesIntake) return false;
      }
      // 10. Fee Range
      if (u.avgTuitionAnnualUSD < minFee || u.avgTuitionAnnualUSD > maxFee) {
        return false;
      }

      return true;
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
  }, [
    searchQuery,
    selectedCountries,
    selectedLevels,
    selectedTypes,
    selectedRankTiers,
    selectedTuitions,
    selectedIntakes,
    scholarshipOnly,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredUnis.length / ITEMS_PER_PAGE));
  const paginatedUnis = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUnis.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUnis, currentPage]);

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const activeUniversity = selectedUniSlug
    ? mockUniversities.find(u => u.slug === selectedUniSlug)
    : null;

  const universityCourses = activeUniversity
    ? mockCourses.filter(c => c.universityId === activeUniversity.id)
    : [];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="bg-[#0a1120] rounded-3xl p-8 sm:p-12 mb-8 shadow-2xl relative">
        {selectedUniSlug && (
          <button
            onClick={() => setSelectedUniSlug(null)}
            className="absolute top-8 right-8 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to All</span>
          </button>
        )}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          WORLD-CLASS EDUCATION
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight mb-6">
          Top <span className="bg-[#fbb034] text-slate-950 px-3 py-1 rounded-lg">Universities</span> Worldwide
        </h1>
        <p className="text-lg text-slate-300 max-w-xl leading-relaxed whitespace-nowrap">
          Browse 167+ partner universities across 6+ countries
        </p>
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
                      {formatUSD(activeUniversity.avgTuitionAnnualUSD)} / yr
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
                            {formatPriceString(c.tuitionFeeLocal, c.annualFeeUSD)}
                          </span>
                          {c.totalTuitionLocal && (
                            <span className="text-[11px] font-semibold text-slate-400 block">
                              Total Est: {formatPriceString(c.totalTuitionLocal, c.annualFeeUSD * (Number(c.durationYears) || 3))}
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
                              <span className="text-base font-black text-emerald-600">{formatPriceString(acc.monthlyRentMYR)}</span>
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
        /* VIEW B: Universities Faceted Directory with Filter Tick Options & Top Search */
        <div className="space-y-6">
          {/* Top Search Bar & Sort Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Bar (h-12 / 48px height, medium font weight) */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search university by name, city, country, or course..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-12 pl-11 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Mobile Filter Button + Sort Dropdown */}
            <div className="flex items-center gap-3 justify-between md:justify-end shrink-0">
              {/* Mobile Filter Trigger Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-600">tune</span>
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort By Dropdown */}
              <div className="relative w-full md:w-[280px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                  sort
                </span>
                <select
                  value={sortBy}
                  onChange={(e: any) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-12 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs transition-all appearance-none cursor-pointer"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="qs">Sort: QS World Ranking</option>
                  <option value="acceptance-high-low">Sort: Acceptance Rate (High to Low)</option>
                  <option value="fee-asc">Sort: Tuition (Low to High)</option>
                  <option value="fee-desc">Sort: Tuition (High to Low)</option>
                  <option value="established">Sort: Established Year</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Main Grid: Left Filter Sidebar + Right Cards Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* DESKTOP FILTER SIDEBAR */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6 lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs max-h-[calc(100vh-120px)] overflow-y-auto sleek-scrollbar">
              {/* Sidebar Header: Refine Search + Reset */}
              <div className="flex items-center justify-between p-4 bg-[#111827] rounded-t-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#fbb034] text-xl">tune</span>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    REFINE SEARCH
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
              {/* 1. DESTINATIONS & COUNTRIES (Tick Options) */}
              <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('destinations')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-xs">public</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Destinations
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCountries.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); toggleCountry('all'); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); toggleCountry('all'); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.destinations ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.destinations && (
                  <div className="space-y-3">
                    {/* Country Quick Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filter countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034]/40 focus:border-[#fbb034]"
                      />
                      {countrySearch && (
                        <button
                          type="button"
                          onClick={() => setCountrySearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 max-h-[200px] overflow-y-auto sleek-scrollbar pr-1">
                      {/* "All Countries" Tick Option */}
                      <button
                        type="button"
                        onClick={() => toggleCountry('all')}
                        className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                              selectedCountries.length === 0
                                ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                            }`}
                          >
                            {selectedCountries.length === 0 && (
                              <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs leading-snug break-words flex-1 text-left ${selectedCountries.length === 0 ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                            All Destinations
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                          ({mockUniversities.length})
                        </span>
                      </button>

                      {/* List of Countries with Yellow Tick Options */}
                      {APPROVED_COUNTRY_NAMES.filter((c) =>
                        c.toLowerCase().includes(countrySearch.toLowerCase())
                      ).map((c) => {
                        const isSelected = selectedCountries.includes(c);
                        const count = facetCounts.countryMap[c] || 0;
                        if (count === 0 && !isSelected) return null;

                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleCountry(c)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                                {c}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. DEGREE LEVEL / PROGRAMS (Tick Options - Full Text Visible) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('studyLevel')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">school</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Study Level
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedLevels.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedLevels([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedLevels([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.studyLevel ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.studyLevel && (
                  <div className="space-y-1">
                    {[
                      { id: 'undergrad', label: "Undergraduate (Bachelor's)", count: facetCounts.undergradCount },
                      { id: 'postgrad', label: "Postgraduate (Master's / MBA)", count: facetCounts.postgradCount },
                      { id: 'doctorate', label: "Doctorate (PhD / Research)", count: facetCounts.doctorateCount },
                      { id: 'diploma', label: 'Diploma & Foundation', count: facetCounts.diplomaCount },
                    ].map((item) => {
                      const isSelected = selectedLevels.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleLevel(item.id)}
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                            ({item.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. IELTS SCORE (Tick Options - Full Implementation) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('ielts')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">quiz</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      IELTS Score
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedIelts.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedIelts([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedIelts([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.ielts ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.ielts && (
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      { id: '5.5', label: 'IELTS 5.5 (Foundation & Diploma)', count: facetCounts.ielts55 },
                      { id: '6.0', label: 'IELTS 6.0 (Undergraduate)', count: facetCounts.ielts60 },
                      { id: '6.5', label: 'IELTS 6.5 (Postgraduate)', count: facetCounts.ielts65 },
                      { id: '7.0', label: 'IELTS 7.0 & Above (Top Tier)', count: facetCounts.ielts70 },
                      { id: 'waiver', label: 'IELTS Waiver / English Medium', count: facetCounts.ieltsWaiver },
                    ].map((item) => {
                      const isSelected = selectedIelts.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleIelts(item.id)}
                          className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl border transition-all group cursor-pointer ${
                            isSelected
                              ? 'border-[#fbb034] bg-amber-50/50 dark:bg-amber-950/20'
                              : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                            ({item.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3.1. INTAKE MONTHS (Tick Options) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('intake')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">date_range</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Intake
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedIntakes.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedIntakes([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedIntakes([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.intake ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.intake && (
                  <div className="space-y-1">
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((month) => {
                      const isSelected = selectedIntakes.includes(month);
                      return (
                        <button
                          key={month}
                          type="button"
                          onClick={() => toggleIntake(month)}
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                              {month}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* 3.2. DURATION (Tick Options) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('duration')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">hourglass_empty</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Duration
                    </label>
                  </div>
                  <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.duration ? '' : '-rotate-90'}`}>expand_more</span>
                </button>
                {openSections.duration && (
                  <div className="grid grid-cols-2 gap-2">
                    {['Less than 1 year', '1 - 2 years', '2 - 3 years', '3 - 4 years', '4 - 5 years', 'More than 5 years'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          className="py-2 px-1 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-transparent hover:border-amber-300"
                        >
                          {d}
                        </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3.3. FEE RANGE (Slider) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('feeRange')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">account_balance_wallet</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Fee range
                    </label>
                  </div>
                  <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.feeRange ? '' : '-rotate-90'}`}>expand_more</span>
                </button>
                {openSections.feeRange && (
                  <div className="pt-2">
                    <Slider06 
                      min={0} 
                      max={214000} 
                      step={100} 
                      initialRange={[minFee, maxFee]} 
                      onRangeChange={(r) => { setMinFee(r[0]); setMaxFee(r[1]); }} 
                    />
                  </div>
                )}
              </div>

              {/* 4. INSTITUTION TYPE (Tick Options) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('institutionType')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">account_balance</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Institution Type
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTypes.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedTypes([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedTypes([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.institutionType ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.institutionType && (
                  <div className="space-y-1">
                    {[
                      { id: 'public', label: 'Public Universities', count: facetCounts.publicCount },
                      { id: 'private', label: 'Private Universities', count: facetCounts.privateCount },
                      { id: 'research', label: 'Research & Technical', count: facetCounts.researchCount },
                    ].map((item) => {
                      const isSelected = selectedTypes.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleType(item.id)}
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                            ({item.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. QS WORLD RANKING (Tick Options) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('qsRanking')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">leaderboard</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      QS World Ranking
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedRankTiers.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedRankTiers([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedRankTiers([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.qsRanking ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.qsRanking && (
                  <div className="space-y-1">
                    {[
                      { id: 'top100', label: 'Top 100 QS Rank', count: facetCounts.qsTop100, badge: 'Elite' },
                      { id: 'top300', label: 'Top 300 QS Rank', count: facetCounts.qsTop300 },
                      { id: 'top500', label: 'Top 500 QS Rank', count: facetCounts.qsTop500 },
                      { id: 'top1000', label: 'Top 1,000 QS Rank', count: facetCounts.qsTop1000 },
                    ].map((item) => {
                      const isSelected = selectedRankTiers.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleRankTier(item.id)}
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#fbb034] text-slate-950 font-black shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                            ({item.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 6. ANNUAL TUITION RANGE (Tick Options) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('tuition')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">payments</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Tuition Fee (Annual)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTuitions.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedTuitions([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedTuitions([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.tuition ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.tuition && (
                  <div className="space-y-1">
                    {[
                      { id: 'under5k', label: 'Under $5,000 / yr', count: facetCounts.under5k },
                      { id: '5k-10k', label: '$5,000 – $10,000 / yr', count: facetCounts.fee5k10k },
                      { id: '10k-20k', label: '$10,000 – $20,000 / yr', count: facetCounts.fee10k20k },
                      { id: 'above20k', label: 'Above $20,000 / yr', count: facetCounts.above20k },
                    ].map((item) => {
                      const isSelected = selectedTuitions.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleTuition(item.id)}
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                            ({item.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 7. SCHOLARSHIP & PERKS (Tick Option) */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('scholarship')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">emoji_events</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Benefits
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {scholarshipOnly && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setScholarshipOnly(false); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setScholarshipOnly(false); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.scholarship ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.scholarship && (
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setScholarshipOnly((prev) => !prev);
                        setCurrentPage(1);
                      }}
                      className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                            scholarshipOnly
                              ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                          }`}
                        >
                          {scholarshipOnly && (
                            <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                              <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs leading-snug break-words flex-1 text-left ${scholarshipOnly ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                          Scholarships Available
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFeeWaiverOnly((prev) => !prev);
                        setCurrentPage(1);
                      }}
                      className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                            feeWaiverOnly
                              ? 'bg-[#fbb034] border-[#fbb034] text-white shadow-xs'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#fbb034]'
                          }`}
                        >
                          {feeWaiverOnly && (
                            <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                              <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs leading-snug break-words flex-1 text-left ${feeWaiverOnly ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                          Application Fee Waiver
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              </div>
            </aside>

            {/* RIGHT CONTENT AREA: Results Bar, Grid & Pagination */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results bar header */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      173 Universities Found
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-3 justify-between sm:justify-end">
                    <span>Page {currentPage} of {totalPages}</span>
                  </div>
                </div>

                {/* Active Filter Chips / Removable Pills */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1">Active:</span>

                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                        <span>Search: "{searchQuery}"</span>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    {selectedCountries.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[11px] font-medium"
                      >
                        <span>{c}</span>
                        <button
                          type="button"
                          onClick={() => toggleCountry(c)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    {selectedLevels.map((lvl) => (
                      <span
                        key={lvl}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[11px] font-medium"
                      >
                        <span className="capitalize">{lvl}</span>
                        <button
                          type="button"
                          onClick={() => toggleLevel(lvl)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    {selectedTypes.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium"
                      >
                        <span className="capitalize">{t}</span>
                        <button
                          type="button"
                          onClick={() => toggleType(t)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    {selectedRankTiers.map((tier) => (
                      <span
                        key={tier}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[11px] font-medium"
                      >
                        <span>{tier.replace('top', 'Top ')} QS</span>
                        <button
                          type="button"
                          onClick={() => toggleRankTier(tier)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    {selectedTuitions.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 text-[11px] font-medium"
                      >
                        <span>Fee: {t}</span>
                        <button
                          type="button"
                          onClick={() => toggleTuition(t)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    {selectedIelts.map((val) => (
                      <span
                        key={val}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[11px] font-medium"
                      >
                        <span>IELTS: {val === 'waiver' ? 'Waiver' : val}</span>
                        <button
                          type="button"
                          onClick={() => toggleIelts(val)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    {scholarshipOnly && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/70 text-green-700 dark:text-green-300 text-[11px] font-medium">
                        <span>Scholarships Only</span>
                        <button
                          type="button"
                          onClick={() => setScholarshipOnly(false)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer ml-auto"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Universities Grid with Skeleton Screens */}
              {isLoading ? (
                <SkeletonLoader type="university" count={6} />
              ) : filteredUnis.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
                  <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">school</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No partner universities found</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                    No collaborated universities found matching your active filter criteria. Try searching with another term or reset your filters.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedUnis.map((uni) => (
                      <article
                        key={uni.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
                      >
                        <div onClick={() => setSelectedUniSlug(uni.slug)} className="cursor-pointer">
                          {/* Card Banner */}
                          <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                            <img
                              src={uni.bannerUrl}
                              alt={uni.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
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
                              <h3 className="text-base font-bold leading-snug line-clamp-1">{uni.name}</h3>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 space-y-3">
                            {/* Meta: Type & Established Year */}
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-blue-600">account_balance</span>
                                <span className="truncate max-w-[150px]">{uni.type || 'University'}</span>
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
                            <div className="grid grid-cols-1 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 items-center">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Tuition</span>
                                <strong className="text-slate-900 dark:text-white">{formatUSD(uni.avgTuitionAnnualUSD)} / yr</strong>
                              </div>

                            </div>
                          </div>
                        </div>
                        <div className="p-5 pt-0 flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onApply(uni.name);
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Apply Now
                          </button>
                          <div className="flex items-center text-red-600 font-bold text-xs cursor-pointer hover:underline group-hover:text-red-700">
                            <span>View Details</span>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Numbered Pagination Bar */}
                  {filteredUnis.length > ITEMS_PER_PAGE && (
                    <nav
                      aria-label="University Directory Pagination"
                      className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2 select-none flex-wrap"
                    >
                      {/* Previous Button */}
                      <button
                        type="button"
                        aria-label="Previous Page"
                        disabled={currentPage === 1}
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="min-w-[44px] min-h-[44px] px-3.5 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer active:scale-95 text-xs font-bold gap-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        <span className="hidden sm:inline">Prev</span>
                      </button>

                      {/* Dynamic Page Buttons */}
                      {getPaginationPages().map((pageItem, idx) => {
                        if (pageItem === '...') {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              className="w-10 h-11 flex items-center justify-center text-slate-400 font-bold text-sm tracking-wider"
                            >
                              ...
                            </span>
                          );
                        }

                        const pageNum = Number(pageItem);
                        const isActive = currentPage === pageNum;

                        return (
                          <button
                            key={`page-${pageNum}`}
                            type="button"
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`min-w-[44px] min-h-[44px] px-3.5 flex items-center justify-center rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-95 ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50'
                                : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        type="button"
                        aria-label="Next Page"
                        disabled={currentPage === totalPages}
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="min-w-[44px] min-h-[44px] px-3.5 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-35 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer active:scale-95 text-xs font-bold gap-1"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>

          {/* MOBILE FILTER MODAL DRAWER */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
              <div className="relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#fbb034] text-xl font-bold">tune</span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white uppercase tracking-wider">
                      Refine Search
                    </h3>
                    {activeFiltersCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#fbb034] text-slate-950 text-xs font-black">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className={`text-xs font-bold transition-colors cursor-pointer ${
                        activeFiltersCount > 0
                          ? 'text-[#fbb034] hover:text-amber-600 dark:text-[#fbb034] dark:hover:text-amber-300 underline'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                </div>

                {/* Scrollable Filter List */}
                <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1 sleek-scrollbar">
                  {/* Destinations */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                        Destinations
                      </label>
                      {selectedCountries.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleCountry('all')}
                          className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-1 max-h-[160px] overflow-y-auto sleek-scrollbar">
                      <button
                        type="button"
                        onClick={() => toggleCountry('all')}
                        className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                              selectedCountries.length === 0 ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {selectedCountries.length === 0 && (
                              <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs leading-snug break-words flex-1 text-left ${selectedCountries.length === 0 ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                            All Destinations
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">({mockUniversities.length})</span>
                      </button>

                      {APPROVED_COUNTRY_NAMES.map((c) => {
                        const isSelected = selectedCountries.includes(c);
                        const count = facetCounts.countryMap[c] || 0;
                        if (count === 0 && !isSelected) return null;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleCountry(c)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                                {c}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Study Level - Full Text Visible */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                        Study Level
                      </label>
                      {selectedLevels.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedLevels([])}
                          className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {[
                        { id: 'undergrad', label: "Undergraduate (Bachelor's)", count: facetCounts.undergradCount },
                        { id: 'postgrad', label: "Postgraduate (Master's / MBA)", count: facetCounts.postgradCount },
                        { id: 'doctorate', label: "Doctorate (PhD / Research)", count: facetCounts.doctorateCount },
                        { id: 'diploma', label: 'Diploma & Foundation', count: facetCounts.diplomaCount },
                      ].map((item) => {
                        const isSelected = selectedLevels.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleLevel(item.id)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                                {item.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">({item.count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* IELTS Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                        IELTS Score
                      </label>
                      {selectedIelts.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedIelts([])}
                          className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {[
                        { id: '5.5', label: 'IELTS 5.5 (Foundation & Diploma)', count: facetCounts.ielts55 },
                        { id: '6.0', label: 'IELTS 6.0 (Undergraduate)', count: facetCounts.ielts60 },
                        { id: '6.5', label: 'IELTS 6.5 (Postgraduate)', count: facetCounts.ielts65 },
                        { id: '7.0', label: 'IELTS 7.0 & Above (Top Tier)', count: facetCounts.ielts70 },
                        { id: 'waiver', label: 'IELTS Waiver / English Medium', count: facetCounts.ieltsWaiver },
                      ].map((item) => {
                        const isSelected = selectedIelts.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleIelts(item.id)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                                {item.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">({item.count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* QS Ranking */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                        QS World Ranking
                      </label>
                      {selectedRankTiers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedRankTiers([])}
                          className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {[
                        { id: 'top100', label: 'Top 100 QS Rank', count: facetCounts.qsTop100 },
                        { id: 'top300', label: 'Top 300 QS Rank', count: facetCounts.qsTop300 },
                        { id: 'top500', label: 'Top 500 QS Rank', count: facetCounts.qsTop500 },
                        { id: 'top1000', label: 'Top 1,000 QS Rank', count: facetCounts.qsTop1000 },
                      ].map((item) => {
                        const isSelected = selectedRankTiers.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleRankTier(item.id)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                                {item.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">({item.count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tuition Fee */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                        Tuition Fee (Annual)
                      </label>
                      {selectedTuitions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedTuitions([])}
                          className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {[
                        { id: 'under5k', label: 'Under $5,000 / yr', count: facetCounts.under5k },
                        { id: '5k-10k', label: '$5,000 – $10,000 / yr', count: facetCounts.fee5k10k },
                        { id: '10k-20k', label: '$10,000 – $20,000 / yr', count: facetCounts.fee10k20k },
                        { id: 'above20k', label: 'Above $20,000 / yr', count: facetCounts.above20k },
                      ].map((item) => {
                        const isSelected = selectedTuitions.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleTuition(item.id)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div
                                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-xs leading-snug break-words flex-1 text-left ${isSelected ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                                {item.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">({item.count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scholarships */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setScholarshipOnly((prev) => !prev)}
                      className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                            scholarshipOnly ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {scholarshipOnly && (
                            <svg className="w-2.5 h-2.5 stroke-current stroke-[3.5]" viewBox="0 0 16 16" fill="none">
                              <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs leading-snug break-words flex-1 text-left ${scholarshipOnly ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                          Scholarships Available
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">({facetCounts.scholarshipCount})</span>
                    </button>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Reset All
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-2 py-3 rounded-xl bg-[#fbb034] hover:bg-amber-500 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-400/25 active:scale-95 transition-all"
                  >
                    Show {filteredUnis.length} Universities
                  </button>
                </div>
              </div>
            </div>
          )}
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
