/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Language Center Directory Explorer (/language-center-list)
 * Built on the exact design system, hero banner, clean search card, floating pill controls bar,
 * Stitch-style filter sidebar with liquid-gooey budget slider, and Cards/List/Map/Wishlist views
 * of the Universities and Courses pages.
 */

import React, { useMemo, useState } from 'react';
import {
  LANGUAGE_CENTER_MAX_FEE_USD,
  LANGUAGE_CENTER_PROGRAM_OPTIONS,
  LANGUAGE_CENTER_STUDY_MODES,
  LANGUAGE_CENTERS_LIST,
  LanguageCenterItem,
  LanguageProgramCategory,
  LanguageStudyMode,
  languageCentersToMapRecords,
} from '../../data/languageCentersData.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { UniversityMap } from './UniversityMap.tsx';
import { GooeyIeltsSlider } from './GooeyIeltsSlider.tsx';
import { ExplorerPageShell, ExplorerHeroBanner, SectionHeader } from './ExplorerTheme.tsx';

interface LanguageCenterListViewProps {
  initialSlug?: string;
  onApply: (centerInfo: string) => void;
  onAskUs?: (centerInfo: string) => void;
  onNavigateHome?: () => void;
}

const ITEMS_PER_PAGE = 10;

const CHECKBOX_CLASS =
  'rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer accent-amber-500';
const ACTIVE_BADGE_CLASS =
  'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 max-w-[115px] truncate';
const DEFAULT_BADGE_CLASS =
  'text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500';

/** Crisp brand emblem echoing each language center's visual mark from the directory */
const LanguageCenterLogoMark: React.FC<{ center: LanguageCenterItem; size?: 'sm' | 'md' | 'lg' }> = ({
  center,
  size = 'md',
}) => {
  const { brandStyle, shortLabel, subLabel } = center;
  const dims =
    size === 'lg'
      ? 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl'
      : size === 'sm'
      ? 'w-14 h-12 rounded-xl'
      : 'w-24 h-16 sm:w-28 sm:h-16 rounded-xl';

  return (
    <div
      className={`${dims} shrink-0 flex flex-col items-center justify-center px-2 py-1.5 border select-none text-center overflow-hidden shadow-2xs`}
      style={{
        backgroundColor: brandStyle.bg,
        borderColor: brandStyle.border,
      }}
    >
      <div className="flex items-center justify-center gap-1 max-w-full">
        {brandStyle.badgeType === 'diamond' && (
          <span
            className="w-2.5 h-2.5 rotate-45 rounded-[2px] shrink-0"
            style={{ backgroundColor: brandStyle.accent }}
          />
        )}
        {brandStyle.badgeType === 'shield' && (
          <span
            className="w-2.5 h-3 rounded-b-full shrink-0 border-2"
            style={{ borderColor: brandStyle.accent }}
          />
        )}
        {brandStyle.badgeType === 'speech' && (
          <span
            className="w-2.5 h-2.5 rounded-full rounded-bl-none shrink-0"
            style={{ backgroundColor: brandStyle.accent }}
          />
        )}
        {brandStyle.badgeType === 'bars' && (
          <span className="flex flex-col gap-[2px] shrink-0">
            <span className="w-2.5 h-[2px] rounded-full" style={{ backgroundColor: brandStyle.accent }} />
            <span className="w-2 h-[2px] rounded-full" style={{ backgroundColor: brandStyle.text }} />
          </span>
        )}
        <span
          className={`font-black tracking-tight leading-none truncate ${
            size === 'lg' ? 'text-sm sm:text-base' : 'text-[12px] sm:text-[13px]'
          }`}
          style={{ color: brandStyle.text }}
        >
          {shortLabel}
        </span>
      </div>
      {subLabel && (
        <span
          className="mt-1 text-[8px] font-bold uppercase tracking-wider leading-tight truncate max-w-full opacity-80"
          style={{
            color: brandStyle.badgeType === 'dark-gold' || brandStyle.badgeType === 'pill'
              ? brandStyle.accent
              : brandStyle.text,
          }}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
};

export const LanguageCenterListView: React.FC<LanguageCenterListViewProps> = ({
  initialSlug,
  onApply,
  onAskUs,
  onNavigateHome,
}) => {
  const { formatUSD } = useCurrency();

  // View & Navigation State
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [displayMode, setDisplayMode] = useState<'list' | 'grid' | 'map' | 'wishlist'>('list');
  const [sortBy, setSortBy] = useState<'featured' | 'az' | 'za' | 'fee-asc' | 'fee-desc' | 'rating'>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showAllActiveChips, setShowAllActiveChips] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedCenterNames, setSelectedCenterNames] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<LanguageProgramCategory[]>([]);
  const [selectedModes, setSelectedModes] = useState<LanguageStudyMode[]>([]);
  const [visaOnly, setVisaOnly] = useState(false);
  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(LANGUAGE_CENTER_MAX_FEE_USD);

  // Sidebar Accordion State (all collapsed by default, matching Universities & Courses pages)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    city: false,
    center: false,
    programs: false,
    studyMode: false,
    visa: false,
    fee: false,
  });
  const [centerSearch, setCenterSearch] = useState('');
  const [applyConfirmed, setApplyConfirmed] = useState(false);

  const toggleAccordion = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasAnyExpanded = useMemo(() => Object.values(expanded).some(Boolean), [expanded]);

  const handleCollapseAll = () => {
    setExpanded({
      city: false,
      center: false,
      programs: false,
      studyMode: false,
      visa: false,
      fee: false,
    });
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCities([]);
    setSelectedCenterNames([]);
    setSelectedPrograms([]);
    setSelectedModes([]);
    setVisaOnly(false);
    setMinFee(0);
    setMaxFee(LANGUAGE_CENTER_MAX_FEE_USD);
    setCenterSearch('');
    setShowAllActiveChips(false);
    setCurrentPage(1);
  };

  const activeCenter = useMemo(
    () => (selectedSlug ? LANGUAGE_CENTERS_LIST.find((c) => c.slug === selectedSlug) || null : null),
    [selectedSlug]
  );

  // Filtered & Sorted Language Centers
  const filteredCenters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = LANGUAGE_CENTERS_LIST.filter((center) => {
      if (q) {
        const hay = `${center.name} ${center.city} ${center.country} ${center.address} ${center.programs.join(' ')} ${center.accreditations.join(' ')} ${center.tagline}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (selectedCities.length > 0 && !selectedCities.includes(center.city)) return false;
      if (selectedCenterNames.length > 0 && !selectedCenterNames.includes(center.name)) return false;
      if (
        selectedPrograms.length > 0 &&
        !selectedPrograms.some((prog) => center.programs.includes(prog))
      ) {
        return false;
      }
      if (
        selectedModes.length > 0 &&
        !selectedModes.some((mode) => center.studyModes.includes(mode))
      ) {
        return false;
      }
      if (visaOnly && !center.studentVisaSupported) return false;
      if (minFee > 0 && center.monthlyFeeUSD < minFee) return false;
      if (maxFee < LANGUAGE_CENTER_MAX_FEE_USD && center.monthlyFeeUSD > maxFee) return false;
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'az') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'za') sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'fee-asc') sorted.sort((a, b) => a.monthlyFeeUSD - b.monthlyFeeUSD);
    else if (sortBy === 'fee-desc') sorted.sort((a, b) => b.monthlyFeeUSD - a.monthlyFeeUSD);
    else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [
    searchQuery,
    selectedCities,
    selectedCenterNames,
    selectedPrograms,
    selectedModes,
    visaOnly,
    minFee,
    maxFee,
    sortBy,
  ]);

  const effectiveCenters = useMemo(() => {
    if (displayMode === 'wishlist') {
      return filteredCenters.filter((c) => savedIds.includes(c.id));
    }
    return filteredCenters;
  }, [displayMode, filteredCenters, savedIds]);

  const totalPages = Math.max(1, Math.ceil(effectiveCenters.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedCenters = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return effectiveCenters.slice(start, start + ITEMS_PER_PAGE);
  }, [effectiveCenters, safePage]);

  const mapRecords = useMemo(() => languageCentersToMapRecords(effectiveCenters), [effectiveCenters]);

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

    selectedCities.forEach((city) => {
      chips.push({
        key: `city-${city}`,
        prefix: 'City',
        value: city,
        onRemove: () => {
          setSelectedCities((prev) => prev.filter((c) => c !== city));
          setCurrentPage(1);
        },
      });
    });

    selectedCenterNames.forEach((name) => {
      chips.push({
        key: `center-${name}`,
        prefix: 'Center',
        value: name,
        onRemove: () => {
          setSelectedCenterNames((prev) => prev.filter((n) => n !== name));
          setCurrentPage(1);
        },
      });
    });

    selectedPrograms.forEach((prog) => {
      chips.push({
        key: `prog-${prog}`,
        prefix: 'Program',
        value: prog,
        onRemove: () => {
          setSelectedPrograms((prev) => prev.filter((p) => p !== prog));
          setCurrentPage(1);
        },
      });
    });

    selectedModes.forEach((mode) => {
      chips.push({
        key: `mode-${mode}`,
        prefix: 'Mode',
        value: mode,
        onRemove: () => {
          setSelectedModes((prev) => prev.filter((m) => m !== mode));
          setCurrentPage(1);
        },
      });
    });

    if (visaOnly) {
      chips.push({
        key: 'visa',
        prefix: 'Visa',
        value: 'EMGS Student Visa',
        onRemove: () => {
          setVisaOnly(false);
          setCurrentPage(1);
        },
      });
    }

    if (minFee > 0 || maxFee < LANGUAGE_CENTER_MAX_FEE_USD) {
      chips.push({
        key: 'fee',
        prefix: 'Fee',
        value: `$${minFee} – $${maxFee}/mo`,
        onRemove: () => {
          setMinFee(0);
          setMaxFee(LANGUAGE_CENTER_MAX_FEE_USD);
          setCurrentPage(1);
        },
      });
    }

    return chips;
  }, [searchQuery, selectedCities, selectedCenterNames, selectedPrograms, selectedModes, visaOnly, minFee, maxFee]);

  // Facet counts
  const cityOptions = useMemo(() => {
    const counts = new Map<string, number>();
    LANGUAGE_CENTERS_LIST.forEach((c) => counts.set(c.city, (counts.get(c.city) || 0) + 1));
    return Array.from(counts.entries()).map(([city, count]) => ({ city, count }));
  }, []);

  const filteredCenterChoices = useMemo(() => {
    const q = centerSearch.trim().toLowerCase();
    return LANGUAGE_CENTERS_LIST.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)
    );
  }, [centerSearch]);

  const isFeeActive = minFee > 0 || maxFee < LANGUAGE_CENTER_MAX_FEE_USD;

  const handleAsk = (centerName: string) => {
    if (onAskUs) {
      onAskUs(`Inquiry about ${centerName}`);
    } else {
      onApply(`Inquiry about ${centerName}`);
    }
  };

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
          <span className="text-xs sm:text-sm font-bold tracking-wider text-white">
            Filters
          </span>
          <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0 tabular-nums">
            {filteredCenters.length} results
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
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
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
              className="no-min-touch w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Accordion Filter Rows */}
      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto custom-scrollbar">
        {/* 1. City / Location */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.city}
            onClick={() => toggleAccordion('city')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="11" r="2.2" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                City / State
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedCities.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedCities.length === 0
                  ? 'All Cities'
                  : selectedCities.length === 1
                  ? selectedCities[0]
                  : `${selectedCities.length} selected`}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.city ? 'rotate-180' : ''
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
          {expanded.city && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {cityOptions.map(({ city, count }) => (
                  <label
                    key={city}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={() => {
                          setSelectedCities((prev) =>
                            prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs text-slate-700 font-medium truncate">
                        🇲🇾 {city}, Malaysia
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 tabular-nums">{count}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Language Center (Searchable) */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.center}
            onClick={() => toggleAccordion('center')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Language Center
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedCenterNames.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedCenterNames.length === 0
                  ? 'All 19'
                  : selectedCenterNames.length === 1
                  ? selectedCenterNames[0]
                  : `${selectedCenterNames.length} selected`}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.center ? 'rotate-180' : ''
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
          {expanded.center && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-2">
                <input
                  type="text"
                  data-purpose="inset-filter-input"
                  value={centerSearch}
                  onChange={(e) => setCenterSearch(e.target.value)}
                  placeholder="Search language center..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] transition-all"
                />
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                  {filteredCenterChoices.map((lc) => (
                    <label
                      key={lc.id}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCenterNames.includes(lc.name)}
                        onChange={() => {
                          setSelectedCenterNames((prev) =>
                            prev.includes(lc.name)
                              ? prev.filter((n) => n !== lc.name)
                              : [...prev, lc.name]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs text-slate-700 truncate">{lc.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Programs Offered */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.programs}
            onClick={() => toggleAccordion('programs')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V5A2.5 2.5 0 0 1 6.5 2.5H20v17H6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Programs
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedPrograms.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedPrograms.length === 0
                  ? 'All Programs'
                  : selectedPrograms.length === 1
                  ? selectedPrograms[0]
                  : `${selectedPrograms.length} selected`}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.programs ? 'rotate-180' : ''
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
          {expanded.programs && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {LANGUAGE_CENTER_PROGRAM_OPTIONS.map((prog) => {
                  const count = LANGUAGE_CENTERS_LIST.filter((c) => c.programs.includes(prog)).length;
                  return (
                    <label
                      key={prog}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedPrograms.includes(prog)}
                          onChange={() => {
                            setSelectedPrograms((prev) =>
                              prev.includes(prog) ? prev.filter((p) => p !== prog) : [...prev, prog]
                            );
                            setCurrentPage(1);
                          }}
                          className={CHECKBOX_CLASS}
                        />
                        <span className="text-xs text-slate-700 truncate">{prog}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Study Mode */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.studyMode}
            onClick={() => toggleAccordion('studyMode')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <path d="M8 20h8M12 16v4" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Study Mode
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedModes.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedModes.length === 0
                  ? 'All Modes'
                  : selectedModes.length === 1
                  ? selectedModes[0]
                  : `${selectedModes.length} selected`}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.studyMode ? 'rotate-180' : ''
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
          {expanded.studyMode && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {LANGUAGE_CENTER_STUDY_MODES.map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedModes.includes(mode)}
                      onChange={() => {
                        setSelectedModes((prev) =>
                          prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
                        );
                        setCurrentPage(1);
                      }}
                      className={CHECKBOX_CLASS}
                    />
                    <span className="text-xs text-slate-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. EMGS Student Visa Support */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.visa}
            onClick={() => toggleAccordion('visa')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Visa & Licensing
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={visaOnly ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {visaOnly ? 'EMGS Visa' : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.visa ? 'rotate-180' : ''
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
          {expanded.visa && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2">
                <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visaOnly}
                    onChange={() => {
                      setVisaOnly((prev) => !prev);
                      setCurrentPage(1);
                    }}
                    className={CHECKBOX_CLASS}
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    EMGS Student Visa Sponsorship
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 6. Monthly Fee Budget (with Liquid Gooey Slider) */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.fee}
            onClick={() => toggleAccordion('fee')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10M15 9.5a2.5 2.5 0 0 0-5 0c0 1.4 1.2 2 2.5 2.5s2.5 1.1 2.5 2.5a2.5 2.5 0 0 1-5 0" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Monthly Tuition
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={isFeeActive ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                ${minFee} – ${maxFee}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.fee ? 'rotate-180' : ''
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
          {expanded.fee && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>
                    ${minFee} — ${maxFee} / mo
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMinFee(0);
                      setMaxFee(LANGUAGE_CENTER_MAX_FEE_USD);
                      setCurrentPage(1);
                    }}
                    className="no-min-touch text-[11px] font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <GooeyIeltsSlider
                  min={0}
                  max={LANGUAGE_CENTER_MAX_FEE_USD}
                  step={20}
                  valueMin={minFee}
                  valueMax={maxFee}
                  onChange={(nextMin, nextMax) => {
                    setMinFee(nextMin);
                    setMaxFee(nextMax);
                    setCurrentPage(1);
                  }}
                  trackId="lc-fee-track-highlight"
                  minInputId="lc-fee-min-slider"
                  maxInputId="lc-fee-max-slider"
                  minAriaLabel="Minimum monthly language tuition USD"
                  maxAriaLabel="Maximum monthly language tuition USD"
                  badgeWidth={44}
                  formatBadge={(v) => `$${v}`}
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>$0</span>
                  <span>$250</span>
                  <span>$500</span>
                  <span>$750</span>
                  <span>$1000/mo</span>
                </div>
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
        dataPurpose="language-centers-hero-banner"
        onNavigateHome={onNavigateHome}
        topRightAction={
          activeCenter ? (
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="absolute top-2.5 right-2.5 sm:top-8 sm:right-8 inline-flex items-center gap-1 px-2 py-0.5 sm:px-4 sm:py-2.5 rounded-full bg-slate-800/90 text-slate-300 text-[9px] sm:text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer shadow-xs z-10"
            >
              <span className="material-symbols-outlined text-[13px] sm:text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
          ) : undefined
        }
        breadcrumbs={
          activeCenter
            ? [
                { label: 'Language Centers', onClick: () => setSelectedSlug(null) },
                { label: activeCenter.name },
              ]
            : displayMode === 'wishlist'
              ? [
                  {
                    label: 'Language Centers',
                    onClick: () => {
                      setDisplayMode('list');
                      setCurrentPage(1);
                    },
                  },
                  { label: 'Wishlist' },
                ]
              : [{ label: 'Language Centers' }]
        }
        titlePrefix="Find"
        titleHighlight="Language Centers"
        titleSuffix="in Malaysia"
        subtitle={`Browse ${LANGUAGE_CENTERS_LIST.length} MOE & EMGS-approved English and international language centers across Kuala Lumpur and Selangor`}
        search={
          !activeCenter
            ? {
                value: searchQuery,
                onChange: (val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                },
                onSubmit: () => setCurrentPage(1),
                placeholder: 'Search language centers, programs or locations',
              }
            : undefined
        }
      />

      {/* VIEW A: Single Language Center Detail Profile */}
      {activeCenter ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <LanguageCenterLogoMark center={activeCenter} size="lg" />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {activeCenter.flagEmoji} {activeCenter.city}, {activeCenter.country}
                  </span>
                  {activeCenter.studentVisaSupported && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                      EMGS Student Visa
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    ★ {activeCenter.rating.toFixed(1)}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {activeCenter.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {activeCenter.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => onApply(`Application for ${activeCenter.name} (${activeCenter.city})`)}
                className="px-6 py-2.5 rounded-xl bg-[#f5c451] hover:bg-[#fbb034] text-slate-950 font-bold text-sm border border-slate-900/15 shadow-xs transition-all cursor-pointer"
              >
                Apply Now
              </button>
              <button
                type="button"
                onClick={() => handleAsk(activeCenter.name)}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm border border-slate-900 dark:border-slate-600 transition-all cursor-pointer"
              >
                Ask Us
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Institution Overview
                </h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeCenter.overview}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Key Highlights
                </h3>
                <ul className="space-y-2.5">
                  {activeCenter.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Programs Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeCenter.programs.map((prog) => (
                    <span
                      key={prog}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-5 space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Facts
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Est. Tuition / Month</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatUSD(activeCenter.monthlyFeeUSD)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Course Duration</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeCenter.durationRange}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Intakes</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeCenter.intakes.join(', ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Study Modes</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeCenter.studyModes.join(' · ')}
                  </span>
                </div>
                {activeCenter.establishedYear && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Established</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeCenter.establishedYear}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Accreditations
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCenter.accreditations.map((acc) => (
                      <span
                        key={acc}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW B: Language Centers Faceted Directory */
        <div className="space-y-3 sm:space-y-5">
          <SectionHeader
            title={displayMode === 'wishlist' ? 'Saved Language Centers' : 'Accredited Language Centers Directory'}
            subtitle="Filter by city, accredited English program, EMGS visa support, and monthly tuition budget."
            countLabel={`(${effectiveCenters.length.toLocaleString()})`}
          />

          {/* 2. Quiet Active Filter Chips & Pagination Controls */}
          <div className="space-y-3">
            {/* Row 2: Total Language Centers + Filtered By Chips + Clear All + Pagination */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    {displayMode === 'wishlist' ? 'Saved Language Centers:' : 'Total Language Centers:'}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {effectiveCenters.length.toLocaleString()}
                  </span>
                </div>

                {activeFilterChips.length > 0 && (
                  <>
                    <span className="hidden sm:inline-block h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />
                    <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase shrink-0">
                      FILTERED BY:
                    </span>
                    {(showAllActiveChips ? activeFilterChips : activeFilterChips.slice(0, 3)).map((chip) => (
                      <span
                        key={chip.key}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <span className="text-slate-400 dark:text-slate-400">{chip.prefix}:</span>
                        <span className="font-semibold text-slate-800 dark:text-white max-w-[140px] truncate">
                          {chip.value}
                        </span>
                        <button
                          type="button"
                          onClick={chip.onRemove}
                          aria-label={`Remove ${chip.prefix}: ${chip.value}`}
                          className="no-min-touch text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer leading-none ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {activeFilterChips.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllActiveChips((prev) => !prev)}
                        className="no-min-touch px-2.5 py-1 rounded-lg bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 transition-colors cursor-pointer"
                      >
                        {showAllActiveChips ? 'Show less' : `+${activeFilterChips.length - 3} more`}
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Right Cluster: Clear All + Page X / Y */}
              <div className="flex items-center gap-3 shrink-0 ml-auto">
                {activeFilterChips.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="no-min-touch inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.9"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12Z" />
                      </svg>
                      <span>Clear all</span>
                    </button>
                    <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                  </>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="tabular-nums">
                    Page <strong className="font-bold text-slate-800 dark:text-white">{safePage}</strong> / {totalPages}
                  </span>
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                      className="no-min-touch w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      aria-label="Next page"
                      className="no-min-touch w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Relocated Floating Pill Controls Bar directly above Filters + Listings Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-[#e5eaf2] dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-500">tune</span>
              <span>Filters</span>
              {activeFilterChips.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#e3ecfc] text-[#0b47c9] text-[10px] font-bold">
                  {activeFilterChips.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap ml-auto">
              {/* View Switcher Pill Group */}
              <div
                role="tablist"
                aria-label="Display layout"
                className="inline-flex items-center p-1 rounded-full bg-[#f8fafd] dark:bg-slate-900 border border-[#e5eaf2] dark:border-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={displayMode === 'grid'}
                  onClick={() => {
                    setDisplayMode('grid');
                    setCurrentPage(1);
                  }}
                  className={`no-min-touch inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    displayMode === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-[#0b47c9] dark:text-[#60a5fa] shadow-[0_1px_4px_rgba(15,23,42,0.08)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={displayMode === 'list'}
                  onClick={() => {
                    setDisplayMode('list');
                    setCurrentPage(1);
                  }}
                  className={`no-min-touch inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    displayMode === 'list'
                      ? 'bg-white dark:bg-slate-800 text-[#0b47c9] dark:text-[#60a5fa] shadow-[0_1px_4px_rgba(15,23,42,0.08)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>List</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={displayMode === 'map'}
                  onClick={() => setDisplayMode('map')}
                  className={`no-min-touch inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    displayMode === 'map'
                      ? 'bg-white dark:bg-slate-800 text-[#0b47c9] dark:text-[#60a5fa] shadow-[0_1px_4px_rgba(15,23,42,0.08)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3Zm0 0v13m6-10v13" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Map</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={displayMode === 'wishlist'}
                  onClick={() => {
                    setDisplayMode('wishlist');
                    setCurrentPage(1);
                  }}
                  className={`no-min-touch inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    displayMode === 'wishlist'
                      ? 'bg-white dark:bg-slate-800 text-[#0b47c9] dark:text-[#60a5fa] shadow-[0_1px_4px_rgba(15,23,42,0.08)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Wishlist</span>
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#e3ecfc] dark:bg-blue-950/70 text-[#0b47c9] dark:text-[#60a5fa] text-[11px] font-bold inline-flex items-center justify-center tabular-nums">
                    {savedIds.length}
                  </span>
                </button>
              </div>

              {/* Sort Dropdown Pill */}
              <div className="relative inline-flex items-center">
                <svg
                  className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 15 4 18l-3-3M4 6v12M17 9l3-3 3 3M20 18V6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <select
                  aria-label="Sort language centers"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as typeof sortBy);
                    setCurrentPage(1);
                  }}
                  className="appearance-none h-[38px] pl-9 pr-8 rounded-full bg-white dark:bg-slate-900 border border-[#e5eaf2] dark:border-slate-700 text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="featured">Featured Order</option>
                  <option value="rating">Top Rated</option>
                  <option value="fee-asc">Fee (Low to High)</option>
                  <option value="fee-desc">Fee (High to Low)</option>
                  <option value="az">Name A–Z</option>
                  <option value="za">Name Z–A</option>
                </select>
                <svg
                  className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* 4. Main 4-Column Grid: Sidebar (1 col) + Listings (3 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
            {/* Left Sidebar (Desktop) */}
            <aside className="hidden lg:block lg:col-span-1">
              {renderFilterSidebar(false)}
            </aside>

            {/* Right Listings Area */}
            <div className="lg:col-span-3 space-y-4">
              {displayMode === 'map' ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs h-[620px]">
                  <UniversityMap
                    universities={mapRecords}
                    allCourses={[]}
                    onNavigateToUni={(slug) => setSelectedSlug(slug)}
                    onResetFilters={resetAllFilters}
                    className="w-full h-full"
                  />
                </div>
              ) : effectiveCenters.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-10 text-center space-y-3">
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {displayMode === 'wishlist'
                      ? 'No saved language centers yet'
                      : 'No language centers match your filters'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    {displayMode === 'wishlist'
                      ? 'Bookmark any language center to compare programs and fees here.'
                      : 'Try clearing a filter or broadening your search term.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (displayMode === 'wishlist') setDisplayMode('list');
                      else resetAllFilters();
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#0d1421] text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {displayMode === 'wishlist' ? 'Browse All Language Centers' : 'Reset All Filters'}
                  </button>
                </div>
              ) : displayMode === 'list' || displayMode === 'wishlist' ? (
                /* Clean Directory Row List matching the YourUni Language Center List screenshots */
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-200/80 dark:divide-slate-800 overflow-hidden shadow-2xs">
                  {paginatedCenters.map((center) => {
                    const isSaved = savedIds.includes(center.id);
                    return (
                      <article
                        key={center.id}
                        className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => setSelectedSlug(center.slug)}
                            className="cursor-pointer focus:outline-none shrink-0"
                            aria-label={`View ${center.name}`}
                          >
                            <LanguageCenterLogoMark center={center} size="md" />
                          </button>

                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => setSelectedSlug(center.slug)}
                                className="text-left text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                              >
                                {center.name}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleSave(center.id)}
                                aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                                className={`no-min-touch p-1 rounded-full transition-colors cursor-pointer ${
                                  isSaved
                                    ? 'text-amber-500'
                                    : 'text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300'
                                }`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill={isSaved ? 'currentColor' : 'none'}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
                              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 2a6 6 0 00-6 6c0 4.418 6 10 6 10s6-5.582 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>
                                {center.city}, {center.country}
                              </span>
                              <span className="text-slate-300 dark:text-slate-700">·</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                From {formatUSD(center.monthlyFeeUSD)}/mo
                              </span>
                              {center.studentVisaSupported && (
                                <>
                                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
                                  <span className="hidden sm:inline text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                    EMGS Visa Supported
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {center.programs.slice(0, 3).map((prog) => (
                                <span
                                  key={prog}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                                >
                                  {prog}
                                </span>
                              ))}
                              {center.programs.length > 3 && (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500">
                                  +{center.programs.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stacked Apply Now + Ask Us Buttons matching Screenshot */}
                        <div className="flex sm:flex-col gap-2 shrink-0 sm:w-36">
                          <button
                            type="button"
                            onClick={() => onApply(`Application for ${center.name} (${center.city})`)}
                            className="flex-1 sm:w-full py-2 px-4 rounded-xl bg-[#f5c451] hover:bg-[#fbb034] text-slate-950 font-semibold text-xs sm:text-[13px] border border-slate-900/20 shadow-2xs transition-all cursor-pointer text-center"
                          >
                            Apply Now
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAsk(center.name)}
                            className="flex-1 sm:w-full py-2 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs sm:text-[13px] border border-slate-900/80 dark:border-slate-600 transition-all cursor-pointer text-center"
                          >
                            Ask Us
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Cards Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedCenters.map((center) => {
                    const isSaved = savedIds.includes(center.id);
                    return (
                      <article
                        key={center.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-all"
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedSlug(center.slug)}
                              className="cursor-pointer focus:outline-none"
                            >
                              <LanguageCenterLogoMark center={center} size="sm" />
                            </button>
                            <div className="flex items-center gap-1.5">
                              {center.studentVisaSupported && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                  EMGS Visa
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleSave(center.id)}
                                aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                                className={`no-min-touch p-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer ${
                                  isSaved ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' : 'text-slate-400 hover:text-slate-700'
                                }`}
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill={isSaved ? 'currentColor' : 'none'}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedSlug(center.slug)}
                              className="text-left text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                            >
                              {center.name}
                            </button>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span>{center.flagEmoji}</span>
                              <span>
                                {center.city}, {center.country}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                              {center.tagline}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {center.programs.slice(0, 3).map((prog) => (
                              <span
                                key={prog}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10.5px] font-medium text-slate-600 dark:text-slate-300"
                              >
                                {prog}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Est. Monthly Tuition</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {formatUSD(center.monthlyFeeUSD)}/mo
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => onApply(`Application for ${center.name} (${center.city})`)}
                              className="py-2 px-3 rounded-xl bg-[#f5c451] hover:bg-[#fbb034] text-slate-950 font-semibold text-xs border border-slate-900/15 transition-all cursor-pointer text-center"
                            >
                              Apply Now
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAsk(center.name)}
                              className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs border border-slate-900/80 dark:border-slate-600 transition-all cursor-pointer text-center"
                            >
                              Ask Us
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Bottom Numbered Pagination Bar (matching screenshots: < 1 2 >) */}
              {displayMode !== 'map' && totalPages > 1 && (
                <div className="flex items-center justify-end gap-1.5 pt-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label="Previous page"
                    className="no-min-touch w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`no-min-touch w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pageNum === safePage
                          ? 'bg-[#f5c451] text-slate-950 border border-slate-900/20 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label="Next page"
                    className="no-min-touch w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-Over Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-[88vw] max-w-sm h-full bg-white shadow-2xl">
            {renderFilterSidebar(true)}
          </div>
        </div>
      )}
    </ExplorerPageShell>
  );
};

export default LanguageCenterListView;
