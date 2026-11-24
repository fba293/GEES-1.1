/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Abroad Explorer (/study-abroad)
 *
 * Built on the unified design language and interactive explorer architecture of
 * Find Universities Worldwide and Find Course Worldwide — enhanced with destination
 * discovery, cost & PSW filters, interactive global map, and side-by-side comparison
 * inspired by IDP Study Abroad, QS Where to Study, and IES Abroad Destinations.
 */

import React, { useMemo, useState } from 'react';
import {
  STUDY_ABROAD_HIGHLIGHTS,
  STUDY_ABROAD_INTAKES,
  STUDY_ABROAD_MAX_LIVING_USD,
  STUDY_ABROAD_MAX_TUITION_USD,
  STUDY_ABROAD_PSW_TIERS,
  STUDY_ABROAD_REGIONS,
  IntakeSeason,
  PswTier,
  StudyAbroadDestination,
  StudyHighlightFlag,
  StudyRegion,
  getStudyAbroadDestinations,
  getUniversitiesForStudyAbroad,
} from '../../data/studyAbroadData.ts';
import { mockCourses, mockUniversities } from '../../data/mockDatabase.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { GooeyIeltsSlider } from './GooeyIeltsSlider.tsx';
import { UniversityMap } from './UniversityMap.tsx';
import { NumberTicker } from '../ui/number-ticker.tsx';
import { ExplorerHeroBanner, ExplorerPageShell, SectionHeader } from './ExplorerTheme.tsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination.tsx';

interface StudyAbroadViewProps {
  onNavigate: (view: string, payload?: any) => void;
  onApply: (contextInfo?: string) => void;
  onNavigateHome?: () => void;
}

const ITEMS_PER_PAGE = 9;

const CHECKBOX_CLASS =
  'rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer accent-amber-500';
const ACTIVE_BADGE_CLASS =
  'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 max-w-[115px] truncate';
const DEFAULT_BADGE_CLASS =
  'text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500';

/** Resilient destination cover photo with automatic gradient + emblem fallback */
const DestinationCoverImage: React.FC<{
  destination: StudyAbroadDestination;
  heightClass?: string;
}> = ({ destination, heightClass = 'h-44 sm:h-48' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden bg-[#0a1120] shrink-0`}
    >
      {!imgFailed && destination.bgImageUrl ? (
        <img
          src={destination.bgImageUrl}
          alt={`Study abroad in ${destination.countryName}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center p-6 text-white"
          style={{
            background: `linear-gradient(135deg, #0a1120 0%, ${destination.accentColor} 100%)`,
          }}
        >
          <span className="text-4xl mb-1" aria-hidden="true">
            {destination.flagEmoji}
          </span>
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">
            {destination.code} · {destination.region}
          </span>
        </div>
      )}

      {/* Measured contrast scrim for crisp WCAG AA overlay legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/90 via-[#0a1120]/30 to-black/15 pointer-events-none" />

      {/* Bottom title lockup */}
      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2 pointer-events-none">
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-slate-200/90 flex items-center gap-1.5">
            <span>{destination.region}</span>
            <span aria-hidden="true">·</span>
            <span>{destination.internationalStudentsText}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug truncate flex items-center gap-2 mt-0.5">
            <span aria-hidden="true">{destination.flagEmoji}</span>
            <span className="truncate">{destination.countryName}</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export const StudyAbroadView: React.FC<StudyAbroadViewProps> = ({
  onNavigate,
  onApply,
  onNavigateHome,
}) => {
  const { formatUSD } = useCurrency();

  const allDestinations = useMemo(() => getStudyAbroadDestinations(), []);

  // View, Sort, Pagination, Saved & Compare State
  const [displayMode, setDisplayMode] = useState<'grid' | 'list' | 'map' | 'compare' | 'wishlist'>('grid');
  const [sortBy, setSortBy] = useState<
    'featured' | 'unis-desc' | 'courses-desc' | 'tuition-asc' | 'living-asc' | 'psw-desc' | 'az'
  >('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>(['sa-my', 'sa-uk', 'sa-au']);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showAllActiveChips, setShowAllActiveChips] = useState(false);
  const [applyConfirmed, setApplyConfirmed] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<StudyRegion[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedPswTiers, setSelectedPswTiers] = useState<PswTier[]>([]);
  const [selectedIntakes, setSelectedIntakes] = useState<IntakeSeason[]>([]);
  const [selectedHighlights, setSelectedHighlights] = useState<StudyHighlightFlag[]>([]);
  const [minTuition, setMinTuition] = useState(0);
  const [maxTuition, setMaxTuition] = useState(STUDY_ABROAD_MAX_TUITION_USD);
  const [minLiving, setMinLiving] = useState(0);
  const [maxLiving, setMaxLiving] = useState(STUDY_ABROAD_MAX_LIVING_USD);
  const [countrySearch, setCountrySearch] = useState('');

  // Stitch-style Collapsible Filter Drawers (all collapsed by default, matching Universities & Courses)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    region: false,
    country: false,
    tuition: false,
    living: false,
    psw: false,
    intakes: false,
    highlights: false,
  });

  const toggleAccordion = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasAnyExpanded = useMemo(() => Object.values(expanded).some(Boolean), [expanded]);

  const handleCollapseAll = () => {
    setExpanded({
      region: false,
      country: false,
      tuition: false,
      living: false,
      psw: false,
      intakes: false,
      highlights: false,
    });
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 4) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedPswTiers([]);
    setSelectedIntakes([]);
    setSelectedHighlights([]);
    setMinTuition(0);
    setMaxTuition(STUDY_ABROAD_MAX_TUITION_USD);
    setMinLiving(0);
    setMaxLiving(STUDY_ABROAD_MAX_LIVING_USD);
    setCountrySearch('');
    setShowAllActiveChips(false);
    setCurrentPage(1);
  };

  // Filtered & Sorted Destinations
  const filteredDestinations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allDestinations.filter((dest) => {
      if (q) {
        const hay = [
          dest.countryName,
          dest.region,
          dest.tagline,
          dest.overview,
          dest.pswLabel,
          dest.bestFor,
          dest.intakeText,
          dest.topCities.join(' '),
          dest.popularFields.join(' '),
          dest.scholarshipHighlights.join(' '),
          dest.highlightFlags.join(' '),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (selectedRegions.length > 0 && !selectedRegions.includes(dest.region)) return false;
      if (selectedCountries.length > 0 && !selectedCountries.includes(dest.countryName)) return false;
      if (selectedPswTiers.length > 0 && !selectedPswTiers.includes(dest.pswTier)) return false;
      if (
        selectedIntakes.length > 0 &&
        !selectedIntakes.some((intake) => dest.intakeSeasons.includes(intake))
      ) {
        return false;
      }
      if (
        selectedHighlights.length > 0 &&
        !selectedHighlights.every((flag) => dest.highlightFlags.includes(flag))
      ) {
        return false;
      }

      if (minTuition > 0 && dest.tuitionMaxUSD < minTuition) return false;
      if (maxTuition < STUDY_ABROAD_MAX_TUITION_USD && dest.tuitionMinUSD > maxTuition) return false;

      if (minLiving > 0 && dest.livingMonthlyMaxUSD < minLiving) return false;
      if (maxLiving < STUDY_ABROAD_MAX_LIVING_USD && dest.livingMonthlyMinUSD > maxLiving) {
        return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === 'unis-desc') sorted.sort((a, b) => b.universityCount - a.universityCount);
    else if (sortBy === 'courses-desc') sorted.sort((a, b) => b.courseCount - a.courseCount);
    else if (sortBy === 'tuition-asc') sorted.sort((a, b) => a.tuitionMinUSD - b.tuitionMinUSD);
    else if (sortBy === 'living-asc') sorted.sort((a, b) => a.livingMonthlyMinUSD - b.livingMonthlyMinUSD);
    else if (sortBy === 'psw-desc') sorted.sort((a, b) => b.pswYears - a.pswYears || a.featuredRank - b.featuredRank);
    else if (sortBy === 'az') sorted.sort((a, b) => a.countryName.localeCompare(b.countryName));
    else sorted.sort((a, b) => a.featuredRank - b.featuredRank);

    return sorted;
  }, [
    allDestinations,
    searchQuery,
    selectedRegions,
    selectedCountries,
    selectedPswTiers,
    selectedIntakes,
    selectedHighlights,
    minTuition,
    maxTuition,
    minLiving,
    maxLiving,
    sortBy,
  ]);

  const effectiveDestinations = useMemo(() => {
    if (displayMode === 'wishlist') {
      return filteredDestinations.filter((d) => savedIds.includes(d.id));
    }
    return filteredDestinations;
  }, [displayMode, filteredDestinations, savedIds]);

  const comparedDestinations = useMemo(
    () =>
      compareIds
        .map((id) => allDestinations.find((d) => d.id === id))
        .filter((d): d is StudyAbroadDestination => Boolean(d)),
    [allDestinations, compareIds]
  );

  const totalPages = Math.max(1, Math.ceil(effectiveDestinations.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = effectiveDestinations.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(safePage * ITEMS_PER_PAGE, effectiveDestinations.length);

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const paginatedDestinations = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return effectiveDestinations.slice(start, start + ITEMS_PER_PAGE);
  }, [effectiveDestinations, safePage]);

  const mapUniversities = useMemo(
    () => getUniversitiesForStudyAbroad(effectiveDestinations),
    [effectiveDestinations]
  );

  // Live Active Filter Chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; prefix: string; value: string; onRemove: () => void }[] = [];

    if (searchQuery.trim()) {
      chips.push({
        key: 'search',
        prefix: 'Search',
        value: searchQuery.trim(),
        onRemove: () => {
          setSearchQuery('');
          setCurrentPage(1);
        },
      });
    }

    selectedRegions.forEach((region) => {
      chips.push({
        key: `region-${region}`,
        prefix: 'Region',
        value: region,
        onRemove: () => {
          setSelectedRegions((prev) => prev.filter((r) => r !== region));
          setCurrentPage(1);
        },
      });
    });

    selectedCountries.forEach((country) => {
      chips.push({
        key: `country-${country}`,
        prefix: 'Destination',
        value: country,
        onRemove: () => {
          setSelectedCountries((prev) => prev.filter((c) => c !== country));
          setCurrentPage(1);
        },
      });
    });

    selectedPswTiers.forEach((psw) => {
      chips.push({
        key: `psw-${psw}`,
        prefix: 'PSW',
        value: psw,
        onRemove: () => {
          setSelectedPswTiers((prev) => prev.filter((p) => p !== psw));
          setCurrentPage(1);
        },
      });
    });

    selectedIntakes.forEach((intake) => {
      chips.push({
        key: `intake-${intake}`,
        prefix: 'Intake',
        value: intake,
        onRemove: () => {
          setSelectedIntakes((prev) => prev.filter((i) => i !== intake));
          setCurrentPage(1);
        },
      });
    });

    selectedHighlights.forEach((flag) => {
      chips.push({
        key: `flag-${flag}`,
        prefix: 'Feature',
        value: flag,
        onRemove: () => {
          setSelectedHighlights((prev) => prev.filter((f) => f !== flag));
          setCurrentPage(1);
        },
      });
    });

    if (minTuition > 0 || maxTuition < STUDY_ABROAD_MAX_TUITION_USD) {
      chips.push({
        key: 'tuition',
        prefix: 'Tuition',
        value: `$${minTuition.toLocaleString()} – $${maxTuition.toLocaleString()}/yr`,
        onRemove: () => {
          setMinTuition(0);
          setMaxTuition(STUDY_ABROAD_MAX_TUITION_USD);
          setCurrentPage(1);
        },
      });
    }

    if (minLiving > 0 || maxLiving < STUDY_ABROAD_MAX_LIVING_USD) {
      chips.push({
        key: 'living',
        prefix: 'Living',
        value: `$${minLiving.toLocaleString()} – $${maxLiving.toLocaleString()}/mo`,
        onRemove: () => {
          setMinLiving(0);
          setMaxLiving(STUDY_ABROAD_MAX_LIVING_USD);
          setCurrentPage(1);
        },
      });
    }

    return chips;
  }, [
    searchQuery,
    selectedRegions,
    selectedCountries,
    selectedPswTiers,
    selectedIntakes,
    selectedHighlights,
    minTuition,
    maxTuition,
    minLiving,
    maxLiving,
  ]);

  const regionCounts = useMemo(() => {
    const map = new Map<StudyRegion, number>();
    STUDY_ABROAD_REGIONS.forEach((r) => map.set(r, 0));
    allDestinations.forEach((d) => map.set(d.region, (map.get(d.region) || 0) + 1));
    return map;
  }, [allDestinations]);

  const filteredCountryOptions = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    return allDestinations.filter(
      (d) =>
        !q ||
        d.countryName.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.topCities.some((c) => c.toLowerCase().includes(q))
    );
  }, [allDestinations, countrySearch]);

  const isTuitionActive = minTuition > 0 || maxTuition < STUDY_ABROAD_MAX_TUITION_USD;
  const isLivingActive = minLiving > 0 || maxLiving < STUDY_ABROAD_MAX_LIVING_USD;

  // Reusable Stitch-style Filter Sidebar (Desktop + Mobile Drawer)
  const renderFilterSidebar = (isMobile = false) => (
    <div
      className={`stitch-filter-card bg-white border border-slate-200/90 shadow-lg flex flex-col overflow-hidden ${
        isMobile ? 'h-full rounded-none border-0' : 'rounded-2xl sticky top-24 max-h-[calc(100vh-7rem)]'
      }`}
    >
      {/* Dark Navy Filter Header */}
      <div className="bg-[#0d1629] px-4 py-3.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" opacity="0.3" />
              <circle cx="8" cy="6" fill="#f59e0b" r="2.5" stroke="none" />
              <line x1="4" x2="5.5" y1="6" y2="6" />
              <line x1="10.5" x2="20" y1="6" y2="6" />
              <circle cx="16" cy="12" fill="#f59e0b" r="2.5" stroke="none" />
              <line x1="4" x2="13.5" y1="12" y2="12" />
              <line x1="18.5" x2="20" y1="12" y2="12" />
              <circle cx="9" cy="18" fill="#f59e0b" r="2.5" stroke="none" />
              <line x1="4" x2="6.5" y1="18" y2="18" />
              <line x1="11.5" x2="20" y1="18" y2="18" />
            </svg>
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-wider text-white">Filters</span>
          <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0 tabular-nums">
            {filteredDestinations.length} results
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Collapse all filter sections"
            className={`no-min-touch w-7 h-7 rounded-lg flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-amber-400/70 cursor-pointer ${
              hasAnyExpanded
                ? 'bg-white/10 text-amber-400 hover:bg-amber-400/20 hover:text-amber-300'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
            title="Collapse all"
            type="button"
            onClick={handleCollapseAll}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.1"
              viewBox="0 0 24 24"
            >
              <path d="m7 4 5 5 5-5" />
              <path d="m7 20 5-5 5 5" />
            </svg>
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              aria-label="Close filters"
              className="no-min-touch w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Filter Sections */}
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1 custom-scrollbar">
        {/* 1. Region */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.region}
            onClick={() => toggleAccordion('region')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 0 0 18M12 3a14.5 14.5 0 0 1 0 18" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                World Region
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedRegions.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedRegions.length > 0 ? `${selectedRegions.length} selected` : 'All Regions'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.region ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.region && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {STUDY_ABROAD_REGIONS.map((region) => {
                  const checked = selectedRegions.includes(region);
                  return (
                    <label
                      key={region}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedRegions((prev) =>
                              prev.includes(region)
                                ? prev.filter((r) => r !== region)
                                : [...prev, region]
                            );
                            setCurrentPage(1);
                          }}
                          className={CHECKBOX_CLASS}
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">{region}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                        {regionCounts.get(region) || 0}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Destination Country */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.country}
            onClick={() => toggleAccordion('country')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 21s7-4.5 7-10.5a7 7 0 1 0-14 0C5 16.5 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="10.5" r="2.2" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Destination
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedCountries.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedCountries.length > 0 ? `${selectedCountries.length} selected` : 'All 15'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.country ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.country && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100 space-y-2">
              <input
                type="text"
                data-purpose="inset-filter-input"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search country or city..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] transition-all"
              />
              <div className="bg-white rounded-xl border border-slate-200 p-2 max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                {filteredCountryOptions.map((dest) => {
                  const checked = selectedCountries.includes(dest.countryName);
                  return (
                    <label
                      key={dest.id}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedCountries((prev) =>
                              prev.includes(dest.countryName)
                                ? prev.filter((c) => c !== dest.countryName)
                                : [...prev, dest.countryName]
                            );
                            setCurrentPage(1);
                          }}
                          className={CHECKBOX_CLASS}
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">
                          {dest.flagEmoji} {dest.countryName}
                        </span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums shrink-0">
                        {dest.universityCount} unis
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Annual Tuition Budget (Liquid Gooey Slider) */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.tuition}
            onClick={() => toggleAccordion('tuition')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10M15 9.5a2.5 2.5 0 0 0-5 0c0 1.4 1.2 2 2.5 2.5s2.5 1.1 2.5 2.5a2.5 2.5 0 0 1-5 0" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Annual Tuition
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={isTuitionActive ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {isTuitionActive
                  ? `$${Math.round(minTuition / 1000)}k–$${Math.round(maxTuition / 1000)}k`
                  : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.tuition ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.tuition && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 tabular-nums">
                  <span>
                    ${minTuition.toLocaleString()} — ${maxTuition.toLocaleString()} / yr
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMinTuition(0);
                      setMaxTuition(STUDY_ABROAD_MAX_TUITION_USD);
                      setCurrentPage(1);
                    }}
                    className="no-min-touch text-[11px] font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <GooeyIeltsSlider
                  min={0}
                  max={STUDY_ABROAD_MAX_TUITION_USD}
                  step={1000}
                  valueMin={minTuition}
                  valueMax={maxTuition}
                  onChange={(nextMin, nextMax) => {
                    setMinTuition(nextMin);
                    setMaxTuition(nextMax);
                    setCurrentPage(1);
                  }}
                  trackId="sa-tuition-track"
                  minInputId="sa-tuition-min"
                  maxInputId="sa-tuition-max"
                  minAriaLabel="Minimum annual tuition USD"
                  maxAriaLabel="Maximum annual tuition USD"
                  badgeWidth={46}
                  formatBadge={(v) => (v === 0 ? '$0' : `$${Math.round(v / 1000)}k`)}
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-medium tabular-nums">
                  <span>$0</span>
                  <span>$15k</span>
                  <span>$30k</span>
                  <span>$45k</span>
                  <span>$55k/yr</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Monthly Living Cost (Liquid Gooey Slider) */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.living}
            onClick={() => toggleAccordion('living')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Monthly Living
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={isLivingActive ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {isLivingActive ? `$${minLiving}–$${maxLiving}` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.living ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.living && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 tabular-nums">
                  <span>
                    ${minLiving.toLocaleString()} — ${maxLiving.toLocaleString()} / mo
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMinLiving(0);
                      setMaxLiving(STUDY_ABROAD_MAX_LIVING_USD);
                      setCurrentPage(1);
                    }}
                    className="no-min-touch text-[11px] font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <GooeyIeltsSlider
                  min={0}
                  max={STUDY_ABROAD_MAX_LIVING_USD}
                  step={50}
                  valueMin={minLiving}
                  valueMax={maxLiving}
                  onChange={(nextMin, nextMax) => {
                    setMinLiving(nextMin);
                    setMaxLiving(nextMax);
                    setCurrentPage(1);
                  }}
                  trackId="sa-living-track"
                  minInputId="sa-living-min"
                  maxInputId="sa-living-max"
                  minAriaLabel="Minimum monthly living cost USD"
                  maxAriaLabel="Maximum monthly living cost USD"
                  badgeWidth={48}
                  formatBadge={(v) => `$${v}`}
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-medium tabular-nums">
                  <span>$0</span>
                  <span>$750</span>
                  <span>$1.5k</span>
                  <span>$2.5k/mo</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Post-Study Work Visa (PSW) */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.psw}
            onClick={() => toggleAccordion('psw')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Post-Study Work
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedPswTiers.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedPswTiers.length > 0 ? `${selectedPswTiers.length} selected` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.psw ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.psw && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {STUDY_ABROAD_PSW_TIERS.map((tier) => {
                  const checked = selectedPswTiers.includes(tier);
                  return (
                    <label
                      key={tier}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedPswTiers((prev) =>
                            prev.includes(tier) ? prev.filter((p) => p !== tier) : [...prev, tier]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs font-medium text-slate-700">{tier}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 6. Intake Seasons */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.intakes}
            onClick={() => toggleAccordion('intakes')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Intake Term
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedIntakes.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedIntakes.length > 0 ? `${selectedIntakes.length} selected` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.intakes ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.intakes && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {STUDY_ABROAD_INTAKES.map((intake) => {
                  const checked = selectedIntakes.includes(intake);
                  return (
                    <label
                      key={intake}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedIntakes((prev) =>
                            prev.includes(intake)
                              ? prev.filter((i) => i !== intake)
                              : [...prev, intake]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs font-medium text-slate-700">{intake}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 7. Pathways & Scholarships */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.highlights}
            onClick={() => toggleAccordion('highlights')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Pathways & Aid
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedHighlights.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedHighlights.length > 0 ? `${selectedHighlights.length} active` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.highlights ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.highlights && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {STUDY_ABROAD_HIGHLIGHTS.map((flag) => {
                  const checked = selectedHighlights.includes(flag);
                  return (
                    <label
                      key={flag}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedHighlights((prev) =>
                            prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs font-medium text-slate-700">{flag}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="px-4 py-3 bg-white border-t border-slate-200/90 flex items-center justify-between gap-3 shrink-0 select-none">
        <button
          type="button"
          onClick={resetAllFilters}
          className="px-2.5 py-2.5 rounded-lg text-[13px] font-medium text-slate-900 hover:text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all focus:outline-none cursor-pointer whitespace-nowrap"
        >
          Reset Filters
        </button>
        <button
          type="button"
          onClick={() => {
            setApplyConfirmed(true);
            window.setTimeout(() => {
              setApplyConfirmed(false);
              if (isMobile) setIsMobileFilterOpen(false);
            }, 600);
          }}
          className={`px-5 py-2.5 rounded-lg bg-[#FBC500] hover:bg-[#ebb700] active:scale-[0.98] text-slate-950 font-medium text-[13px] transition-all duration-150 flex items-center justify-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 cursor-pointer ${
            applyConfirmed ? 'ring-2 ring-amber-400' : ''
          }`}
        >
          {applyConfirmed ? 'Filters Applied ✓' : 'Apply Filters'}
        </button>
      </div>
    </div>
  );

  return (
    <ExplorerPageShell>
      {/* 1. Shared Explorer Hero Banner & Full-Width Search Theme */}
      <ExplorerHeroBanner
        dataPurpose="countries-hero-banner"
        onNavigateHome={onNavigateHome}
        breadcrumbs={
          displayMode === 'compare' || displayMode === 'wishlist'
            ? [
                {
                  label: 'Study Abroad',
                  onClick: () => {
                    setDisplayMode('grid');
                    setCurrentPage(1);
                  },
                },
                { label: displayMode === 'compare' ? 'Compare Destinations' : 'Saved Destinations' },
              ]
            : [{ label: 'Study Abroad' }]
        }
        titleHighlight="Countries"
        subtitle="Compare 15+ destinations by tuition, living cost and work visas"
        rightSlot={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 pt-3 lg:pt-0 border-t border-white/10 lg:border-t-0 shrink-0">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                <NumberTicker value={allDestinations.length} className="!text-white !tracking-tight" />
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Study Destinations</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                <NumberTicker value={mockUniversities.length} delay={0.08} className="!text-white !tracking-tight" />
                <span className="text-[#fbb034]">+</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Partner Universities</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                <NumberTicker value={mockCourses.length} delay={0.16} className="!text-white !tracking-tight" />
                <span className="text-[#fbb034]">+</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Degree Courses</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                <NumberTicker value={4} delay={0.24} className="!text-white !tracking-tight" />
                <span className="text-[#fbb034] text-sm font-extrabold ml-0.5">Yrs</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Max Post-Study Work</div>
            </div>
          </div>
        }
        search={{
          value: searchQuery,
          onChange: (val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          },
          onSubmit: () => setCurrentPage(1),
          placeholder: 'Search countries, student cities, work visas, or scholarships',
        }}
      />

      <SectionHeader
        title={
          displayMode === 'wishlist'
            ? 'Saved Study Destinations'
            : displayMode === 'compare'
            ? 'Compare Study Destinations'
            : 'Global Study Destinations Directory'
        }
        subtitle="Compare annual tuition, monthly living costs, intake timelines, and post-study work rights."
        countLabel={`(${effectiveDestinations.length.toLocaleString()})`}
      />

      {/* 2. Directory Controls Bar */}
      <div className="mb-3 sm:mb-6 space-y-3">
        {/* Row 2: Subtle Secondary Metadata & Compact Controls */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap px-1">
          {/* Left Cluster: Mobile Filter Trigger, Result Count & Active Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden no-min-touch h-8 px-3 rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 text-[11.5px] font-medium inline-flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[15px] text-slate-500 dark:text-slate-400">tune</span>
              <span>Filters</span>
              {activeFilterChips.length > 0 && (
                <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-[#FFCC00] text-slate-950 text-[10px] font-bold inline-flex items-center justify-center tabular-nums">
                  {activeFilterChips.length}
                </span>
              )}
            </button>

            <div className="flex items-baseline gap-1 shrink-0">
              <span className="text-xs font-normal text-slate-400 dark:text-slate-400">
                {displayMode === 'wishlist' ? 'Saved Destinations:' : 'Total Destinations:'}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                {effectiveDestinations.length.toLocaleString()}
              </span>
            </div>

            {activeFilterChips.length > 0 && (
              <>
                <span className="hidden sm:inline-block h-3.5 w-px bg-slate-200/80 dark:bg-slate-800 mx-0.5 shrink-0" />

                {(showAllActiveChips
                  ? activeFilterChips
                  : activeFilterChips.slice(0, 3)
                ).map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-[11.5px] max-w-[200px]"
                  >
                    <span className="text-slate-400 font-normal shrink-0">
                      {chip.prefix}:
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium truncate">
                      {chip.value}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${chip.prefix} ${chip.value}`}
                      onClick={chip.onRemove}
                      className="no-min-touch text-slate-400 hover:text-slate-700 dark:hover:text-white ml-0.5 inline-flex items-center justify-center cursor-pointer shrink-0"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}

                {activeFilterChips.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllActiveChips((prev) => !prev)}
                    className="no-min-touch inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11.5px] font-medium hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
                  >
                    {showAllActiveChips
                      ? 'Show less'
                      : `+${activeFilterChips.length - 3} more`}
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="no-min-touch inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0 ml-0.5"
                >
                  <span>Clear all</span>
                </button>
              </>
            )}
          </div>

          {/* Right Cluster: Subtle Page Indicator + Chevrons | Compact Icon Switcher | Quiet Sort Dropdown */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap ml-auto shrink-0">
            {/* Page Counter & Circular Chevrons */}
            <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400 dark:text-slate-400">
              <span className="whitespace-nowrap">
                Page{' '}
                <strong className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                  {safePage}
                </strong>{' '}
                / <span className="tabular-nums">{totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  aria-label="Previous Page"
                  className="no-min-touch w-7 h-7 flex items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  aria-label="Next Page"
                  className="no-min-touch w-7 h-7 flex items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <span className="hidden sm:inline-block h-4 w-px bg-slate-200/80 dark:bg-slate-800 mx-0.5 shrink-0" />

            {/* Compact Icon-Only Segmented Pill Switcher: Cards, List, Map, Compare, Wishlist */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shrink-0 gap-0.5">
              <button
                type="button"
                title="Cards view"
                aria-label="Cards view"
                aria-pressed={displayMode === 'grid'}
                onClick={() => {
                  setDisplayMode('grid');
                  setCurrentPage(1);
                }}
                className={`no-min-touch w-7 h-7 rounded-full inline-flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  displayMode === 'grid'
                    ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.9"
                  viewBox="0 0 24 24"
                >
                  <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
                  <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
                  <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
                  <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
                </svg>
              </button>

              <button
                type="button"
                title="List view"
                aria-label="List view"
                aria-pressed={displayMode === 'list'}
                onClick={() => {
                  setDisplayMode('list');
                  setCurrentPage(1);
                }}
                className={`no-min-touch w-7 h-7 rounded-full inline-flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  displayMode === 'list'
                    ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.9"
                  viewBox="0 0 24 24"
                >
                  <line x1="9" y1="6.5" x2="20" y2="6.5" />
                  <line x1="9" y1="12" x2="20" y2="12" />
                  <line x1="9" y1="17.5" x2="20" y2="17.5" />
                  <circle cx="4.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
                  <circle cx="4.5" cy="17.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </button>

              <button
                type="button"
                title="Map view"
                aria-label="Map view"
                aria-pressed={displayMode === 'map'}
                onClick={() => {
                  setDisplayMode('map');
                  setCurrentPage(1);
                }}
                className={`no-min-touch w-7 h-7 rounded-full inline-flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  displayMode === 'map'
                    ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.85"
                  viewBox="0 0 24 24"
                >
                  <polygon points="3 6 9 3.5 15 6 21 3.5 21 18 15 20.5 9 18 3 20.5 3 6" />
                  <line x1="9" y1="3.5" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="20.5" />
                </svg>
              </button>

              <button
                type="button"
                title="Compare destinations"
                aria-label="Compare destinations"
                aria-pressed={displayMode === 'compare'}
                onClick={() => {
                  setDisplayMode('compare');
                  setCurrentPage(1);
                }}
                className={`no-min-touch h-7 rounded-full inline-flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                  comparedDestinations.length > 0 ? 'px-2' : 'w-7'
                } ${
                  displayMode === 'compare'
                    ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.9"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 7H20m0 0-3.5-3.5M20 7l-3.5 3.5" />
                  <path d="M16 17H4m0 0 3.5-3.5M4 17l3.5 3.5" />
                </svg>
                {comparedDestinations.length > 0 && (
                  <span
                    className={`text-[10.5px] font-semibold tabular-nums leading-none ${
                      displayMode === 'compare'
                        ? 'text-[#FFCC00]'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {comparedDestinations.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                title="Saved wishlist"
                aria-label="Saved wishlist"
                aria-pressed={displayMode === 'wishlist'}
                onClick={() => {
                  setDisplayMode(displayMode === 'wishlist' ? 'grid' : 'wishlist');
                  setCurrentPage(1);
                }}
                className={`no-min-touch h-7 rounded-full inline-flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                  savedIds.length > 0 ? 'px-2' : 'w-7'
                } ${
                  displayMode === 'wishlist'
                    ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill={displayMode === 'wishlist' ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.85"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-3.5-6 3.5v-16Z" />
                </svg>
                {savedIds.length > 0 && (
                  <span
                    className={`text-[10.5px] font-semibold tabular-nums leading-none ${
                      displayMode === 'wishlist'
                        ? 'text-[#FFCC00]'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {savedIds.length}
                  </span>
                )}
              </button>
            </div>

            {/* Uniform Minimalistic Sort Dropdown */}
            {displayMode !== 'compare' && (
              <div className="relative inline-flex items-center w-[168px] rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.9"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 18V6m0 0-3 3m3-3 3 3" />
                  <path d="M16 6v12m0 0-3-3m3 3 3-3" />
                </svg>
                <select
                  aria-label="Sort destinations"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-[34px] pl-8 pr-7.5 rounded-xl bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer truncate"
                >
                  <option value="featured">Recommended</option>
                  <option value="unis-desc">Most Universities</option>
                  <option value="courses-desc">Most Courses</option>
                  <option value="tuition-asc">Tuition (Low)</option>
                  <option value="living-asc">Living Cost (Low)</option>
                  <option value="psw-desc">Work Visa (Long)</option>
                  <option value="az">Country A–Z</option>
                </select>
                <svg
                  className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Main Explorer Grid: Left Collapsible Sidebar + Right Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">{renderFilterSidebar(false)}</aside>

        {/* Right Results Workspace */}
        <div className="lg:col-span-9 min-w-0">
          {/* MODE A: COMPARE MATRIX */}
          {displayMode === 'compare' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Side-by-Side Destination Comparison
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Select up to 4 study destinations to compare tuition, living expenses, work rights, and scholarships.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    aria-label="Add destination to comparison"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) toggleCompare(e.target.value);
                    }}
                    className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] text-xs font-semibold text-slate-800 dark:text-white cursor-pointer transition-all"
                  >
                    <option value="">+ Add destination to compare...</option>
                    {allDestinations
                      .filter((d) => !compareIds.includes(d.id))
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.flagEmoji} {d.countryName} ({d.region})
                        </option>
                      ))}
                  </select>
                  {comparedDestinations.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCompareIds([])}
                      className="no-min-touch px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {comparedDestinations.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No destinations selected for comparison yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCompareIds(['sa-my', 'sa-uk', 'sa-au'])}
                    className="px-4 py-2 rounded-xl bg-[#0a1120] text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Load Popular Comparison (Malaysia · UK · Australia)
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[680px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                        <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 w-44 align-top">
                          Comparison Metric
                        </th>
                        {comparedDestinations.map((dest) => (
                          <th key={dest.id} className="p-4 align-top min-w-[200px]">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{dest.flagEmoji}</span>
                                  <span>{dest.countryName}</span>
                                </div>
                                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                  {dest.region} · {dest.currency}
                                </div>
                              </div>
                              <button
                                type="button"
                                aria-label={`Remove ${dest.countryName} from comparison`}
                                onClick={() => toggleCompare(dest.id)}
                                className="no-min-touch text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-[13px]">
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Annual Tuition</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 tabular-nums">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {formatUSD(d.tuitionMinUSD)} – {formatUSD(d.tuitionMaxUSD)}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{d.tuitionDisplayLocal}</div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Monthly Living</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 tabular-nums">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {formatUSD(d.livingMonthlyMinUSD)} – {formatUSD(d.livingMonthlyMaxUSD)}/mo
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{d.livingDisplayLocal}</div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Post-Study Work</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 text-slate-800 dark:text-slate-200 font-semibold">
                            {d.pswLabel}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Part-Time Rights</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 text-slate-700 dark:text-slate-300">
                            {d.partTimeWork}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">English / IELTS</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 text-slate-700 dark:text-slate-300">
                            {d.ieltsLabel}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Primary Intakes</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 text-slate-700 dark:text-slate-300">
                            {d.intakeText}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Visa Processing</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 text-slate-700 dark:text-slate-300">
                            {d.visaProcessingTime}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Partner Network</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 tabular-nums">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {d.universityCount} Universities · {d.courseCount} Courses
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Key Scholarships</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 text-slate-700 dark:text-slate-300">
                            {d.scholarshipHighlights.join(' · ')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Top Student Cities</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4 text-slate-700 dark:text-slate-300">
                            {d.topCities.slice(0, 4).join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Next Steps</td>
                        {comparedDestinations.map((d) => (
                          <td key={d.id} className="p-4">
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => onNavigate('study-destination', d.slug)}
                                className="w-full py-2 px-3 rounded-xl bg-[#0a1120] hover:bg-slate-800 dark:bg-[#fbb034] dark:text-slate-950 text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Full Country Guide
                              </button>
                              <button
                                type="button"
                                onClick={() => onApply(`Study Abroad Counseling for ${d.countryName}`)}
                                className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Book Free Counseling
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : displayMode === 'map' ? (
            /* MODE B: INTERACTIVE GLOBAL LEAFLET MAP */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Global Partner Campuses across {effectiveDestinations.length} Study Destinations (
                  <span className="tabular-nums">{mapUniversities.length}</span> pinned universities)
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Click any campus marker to inspect programs & entry criteria
                </span>
              </div>
              <div className="h-[560px] w-full">
                <UniversityMap
                  universities={mapUniversities}
                  allCourses={mockCourses}
                  onNavigateToUni={(uniSlug) => onNavigate('universities', uniSlug)}
                  onResetFilters={resetAllFilters}
                />
              </div>
            </div>
          ) : effectiveDestinations.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {displayMode === 'wishlist'
                  ? 'No saved study destinations yet'
                  : 'No destinations match your current filters'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {displayMode === 'wishlist'
                  ? 'Tap the heart button on any country card to shortlist destinations for your study abroad plan.'
                  : 'Try broadening your tuition budget, monthly living range, or selected intake seasons.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (displayMode === 'wishlist') setDisplayMode('grid');
                  else resetAllFilters();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0a1120] text-white dark:bg-[#fbb034] dark:text-slate-950 text-xs font-bold cursor-pointer"
              >
                {displayMode === 'wishlist' ? 'Browse All Destinations' : 'Reset All Filters'}
              </button>
            </div>
          ) : displayMode === 'list' ? (
            /* MODE C: COMPACT DIRECTORY LIST VIEW */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
              {paginatedDestinations.map((dest) => {
                const isSaved = savedIds.includes(dest.id);
                const isCompared = compareIds.includes(dest.id);
                return (
                  <div
                    key={dest.id}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onNavigate('study-destination', dest.slug)}
                        className="w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden shrink-0 cursor-pointer group border border-slate-200 dark:border-slate-700"
                      >
                        <DestinationCoverImage destination={dest} heightClass="h-full" />
                      </button>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onNavigate('study-destination', dest.slug)}
                            className="no-min-touch text-base sm:text-lg font-black text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left cursor-pointer"
                          >
                            {dest.flagEmoji} Study in {dest.countryName}
                          </button>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {dest.region} · {dest.intakeText}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                          {dest.tagline}. {dest.bestFor}.
                        </p>

                        {/* Clean Unboxed Metadata Row */}
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            Tuition: {formatUSD(dest.tuitionMinUSD)}–{formatUSD(dest.tuitionMaxUSD)}/yr
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Living: {formatUSD(dest.livingMonthlyMinUSD)}–{formatUSD(dest.livingMonthlyMaxUSD)}/mo</span>
                          <span aria-hidden="true">·</span>
                          <span>{dest.pswTier} PSW</span>
                          <span aria-hidden="true">·</span>
                          <span>{dest.universityCount} Unis</span>
                          <span aria-hidden="true">·</span>
                          <span>{dest.courseCount} Courses</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Cluster */}
                    <div className="flex md:flex-col items-center md:items-stretch gap-2 shrink-0 md:w-40">
                      <button
                        type="button"
                        onClick={() => onNavigate('study-destination', dest.slug)}
                        className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs text-center transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Explore Guide
                      </button>
                      <button
                        type="button"
                        onClick={() => onApply(`Study Abroad Counseling — ${dest.countryName}`)}
                        className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white text-slate-800 dark:text-slate-100 font-bold text-xs text-center transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Free Counseling
                      </button>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleCompare(dest.id)}
                          className={`no-min-touch px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                            isCompared
                              ? 'bg-[#0a1120] text-white border-[#0a1120] dark:bg-white dark:text-slate-950'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500'
                          }`}
                        >
                          {isCompared ? 'Comparing ✓' : '+ Compare'}
                        </button>
                        <button
                          type="button"
                          aria-label={isSaved ? `Remove ${dest.countryName} from saved` : `Save ${dest.countryName}`}
                          onClick={() => toggleSave(dest.id)}
                          className={`no-min-touch w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                            isSaved
                              ? 'border-amber-400 bg-amber-50 text-amber-600'
                              : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isSaved ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* MODE D: CARDS GRID VIEW (DEFAULT) */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedDestinations.map((dest) => {
                const isSaved = savedIds.includes(dest.id);
                const isCompared = compareIds.includes(dest.id);
                return (
                  <article
                    key={dest.id}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Cover Photo + Floating Save & Compare Controls */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => onNavigate('study-destination', dest.slug)}
                        className="block w-full text-left cursor-pointer"
                        aria-label={`Open full Study in ${dest.countryName} guide`}
                      >
                        <DestinationCoverImage destination={dest} />
                      </button>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <button
                          type="button"
                          onClick={() => toggleCompare(dest.id)}
                          className={`no-min-touch px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md transition-all cursor-pointer ${
                            isCompared
                              ? 'bg-[#fbb034] text-slate-950 shadow-xs'
                              : 'bg-[#0a1120]/70 text-white hover:bg-[#0a1120]/90'
                          }`}
                        >
                          {isCompared ? 'Comparing ✓' : '+ Compare'}
                        </button>
                        <button
                          type="button"
                          aria-label={isSaved ? `Remove ${dest.countryName} from saved` : `Save ${dest.countryName}`}
                          onClick={() => toggleSave(dest.id)}
                          className={`no-min-touch w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-[#0a1120]/70 text-white hover:bg-[#0a1120]/90'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isSaved ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {dest.tagline}
                        </p>

                        {/* Clean 2x2 Key Financial & Visa Facts */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <div>
                            <div className="text-[11px] text-slate-400 font-medium">Annual Tuition</div>
                            <div className="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5 truncate">
                              {formatUSD(dest.tuitionMinUSD)} – {formatUSD(dest.tuitionMaxUSD)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-400 font-medium">Monthly Living</div>
                            <div className="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5 truncate">
                              {formatUSD(dest.livingMonthlyMinUSD)} – {formatUSD(dest.livingMonthlyMaxUSD)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-400 font-medium">Post-Study Work</div>
                            <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                              {dest.pswTier}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-slate-400 font-medium">Main Intakes</div>
                            <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                              {dest.intakeText}
                            </div>
                          </div>
                        </div>

                        {/* Unboxed Metadata Line for Cities & Popular Fields */}
                        <div className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Top cities:{' '}
                          </span>
                          {dest.topCities.slice(0, 3).join(' · ')}
                        </div>
                      </div>

                      {/* Footer Action Links & Primary CTA */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => onNavigate('universities', dest.countryName)}
                            className="no-min-touch text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:underline cursor-pointer tabular-nums"
                          >
                            {dest.universityCount} Universities →
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('courses', { destination: dest.countryName })}
                            className="no-min-touch text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:underline cursor-pointer tabular-nums"
                          >
                            {dest.courseCount} Courses →
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigate('study-destination', dest.slug)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0a1120] hover:bg-slate-800 dark:bg-[#fbb034] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs text-center transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Explore Country Guide
                          </button>
                          <button
                            type="button"
                            onClick={() => onApply(`Study in ${dest.countryName} Consultation`)}
                            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Ask Us
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls (shadcn disabled-state pattern, themed for Study Abroad / View All Countries) */}
          {displayMode !== 'map' && displayMode !== 'compare' && totalPages > 1 && (
            <div className="mt-8 space-y-3 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block tabular-nums">
                Showing <strong className="text-slate-900 dark:text-white font-semibold">{startIndex}–{endIndex}</strong> of{' '}
                <strong className="text-slate-900 dark:text-white font-semibold">{effectiveDestinations.length}</strong> destinations
              </span>
              <Pagination
                aria-label="Destinations Directory Pagination"
                className="w-fit max-w-full rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
              >
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={safePage <= 1}
                      disabled={safePage <= 1}
                      tabIndex={safePage <= 1 ? -1 : undefined}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </PaginationItem>

                  {getPaginationPages().map((pageItem, idx) => {
                    if (pageItem === '...') {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    const pageNum = Number(pageItem);
                    const isActive = safePage === pageNum;

                    return (
                      <PaginationItem key={`page-${pageNum}`}>
                        <PaginationLink
                          isActive={isActive}
                          onClick={() => {
                            if (!isActive) {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={safePage >= totalPages}
                      disabled={safePage >= totalPages}
                      tabIndex={safePage >= totalPages ? -1 : undefined}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* 5. Study Abroad Step-by-Step Guide (IDP & IES Abroad Inspired) */}
          <section
            aria-labelledby="sa-roadmap-heading"
            className="mt-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2
                  id="sa-roadmap-heading"
                  className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight text-balance"
                >
                  How Your Study Abroad Journey Works
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  From choosing the right country and scholarship track to visa filing and campus arrival — every step supported end-to-end.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onApply('Study Abroad Planning Session')}
                className="px-4 py-2.5 rounded-xl bg-[#0a1120] hover:bg-slate-800 dark:bg-[#fbb034] dark:text-slate-950 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Book Free Counseling
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 pt-6">
              {[
                {
                  step: '01.',
                  title: 'Shortlist Country',
                  desc: 'Compare tuition, living cost, and post-study work permits across 15 destinations.',
                  actionLabel: 'Compare Countries',
                  onClick: () => setDisplayMode('compare'),
                },
                {
                  step: '02.',
                  title: 'Match Programs',
                  desc: 'Filter degree courses and partner universities by IELTS band, intake, and budget.',
                  actionLabel: 'Find Courses',
                  onClick: () => onNavigate('courses'),
                },
                {
                  step: '03.',
                  title: 'English & Prep',
                  desc: 'Meet language entry criteria through MOE/EMGS-approved intensive English pathways.',
                  actionLabel: 'Language Centers',
                  onClick: () => onNavigate('language-center-list'),
                },
                {
                  step: '04.',
                  title: 'Offer & Visa',
                  desc: 'Submit verified applications, scholarship essays, and track your student visa live.',
                  actionLabel: 'Track EMGS Visa',
                  onClick: () => onNavigate('track-visa'),
                },
                {
                  step: '05.',
                  title: 'Fly & Settle In',
                  desc: 'Arrange student flights, health insurance, airport pickup, and safe accommodation.',
                  actionLabel: 'Student Services',
                  onClick: () => onNavigate('services'),
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {item.step}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="no-min-touch self-start text-xs font-bold text-[#0066cc] dark:text-[#2997ff] hover:underline cursor-pointer"
                  >
                    {item.actionLabel} →
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating Compare Tray (when 1+ countries selected and not on Compare tab) */}
      {displayMode !== 'compare' && comparedDestinations.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
          <div className="bg-[#0a1120] text-white border border-white/15 rounded-full shadow-2xl px-3.5 sm:px-5 py-2 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto no-scrollbar">
              <span className="text-slate-400 hidden sm:inline">Compare:</span>
              {comparedDestinations.map((d) => (
                <span
                  key={d.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] whitespace-nowrap"
                >
                  <span>{d.flagEmoji}</span>
                  <span className="hidden xs:inline">{d.code}</span>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDisplayMode('compare')}
              className="no-min-touch px-3.5 py-1.5 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              Compare ({comparedDestinations.length})
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filter Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-sm h-full bg-white z-10 shadow-2xl">
            {renderFilterSidebar(true)}
          </div>
        </div>
      )}
    </ExplorerPageShell>
  );
};
