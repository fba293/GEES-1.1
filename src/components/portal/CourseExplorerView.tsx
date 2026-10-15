/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES International Course & Degree Explorer with Multi-University Comparison Engine
 * Redesigned to match the exact design, typography, theme, spacing, color, and layout of universities.html
 */

import React, { useState, useMemo } from 'react';
import { Course } from '../../types/index.ts';
import { getCollaboratedCourses, getCollaboratedUniversities } from '../../utils/PartnerUniversityManager.ts';
import { APPROVED_COUNTRY_NAMES } from '../../lib/country-config.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { WishlistToast } from './WishlistToast.tsx';
import Slider06 from '../ui/slider-06';
import { UniversityMap } from './UniversityMap.tsx';

interface CourseExplorerViewProps {
  onApply: (courseTitleAndUni: string) => void;
  onNavigateToUni?: (uniSlug: string) => void;
  onNavigateToWishlist?: () => void;
  initialQuery?: string;
  initialCountry?: string;
  initialLevel?: string;
  initialField?: string;
}

export const CourseExplorerView: React.FC<CourseExplorerViewProps> = ({
  onApply,
  onNavigateToUni,
  onNavigateToWishlist,
  initialQuery = '',
  initialCountry = 'all',
  initialLevel = 'all',
  initialField = 'all'
}) => {
  const { formatPriceString, formatUSD } = useCurrency();
  const { wishlist, isInWishlist, toggleWishlist, removeFromWishlist, bouncingCourseId } = useWishlist();
  const [isWishlistSectionCollapsed, setIsWishlistSectionCollapsed] = useState(false);
  const allCourses: Course[] = useMemo(() => getCollaboratedCourses(), []);
  const allUnis = useMemo(() => getCollaboratedUniversities(), []);

  // Filter states (matching UniversityExplorerView conventions)
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialCountry !== 'all' && initialCountry ? [initialCountry] : []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    initialLevel !== 'all' && initialLevel ? [initialLevel] : []
  );
  const [selectedFields, setSelectedFields] = useState<string[]>(
    initialField !== 'all' && initialField ? [initialField] : []
  );
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedRankTiers, setSelectedRankTiers] = useState<string[]>([]);
  const [selectedTuitions, setSelectedTuitions] = useState<string[]>([]);
  const [selectedIelts, setSelectedIelts] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedIntakes, setSelectedIntakes] = useState<string[]>([]);
  const [scholarshipOnly, setScholarshipOnly] = useState<boolean>(false);
  const [minFee, setMinFee] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(214000);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    destinations: true,
    studyLevel: true,
    fields: true,
    ielts: true,
    intake: true,
    duration: true,
    feeRange: true,
    institutionType: true,
    qsRanking: true,
    tuition: true,
    studyMode: true,
    benefits: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Sorting and Pagination
  const [sortBy, setSortBy] = useState<'az' | 'fee-asc' | 'fee-desc' | 'qs'>('qs');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  // Comparison drawer state
  const [comparedCourseIds, setComparedCourseIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Interactive Global Map display state
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<'grid' | 'map' | 'both'>('both');

  // Field Categories
  const fieldCategories = useMemo(() => [
    { id: 'cs', label: 'Computer Science & IT', match: 'computer' },
    { id: 'business', label: 'Business & Management', match: 'business' },
    { id: 'engineering', label: 'Engineering & Technology', match: 'engineering' },
    { id: 'health', label: 'Health & Medicine', match: 'health' },
    { id: 'arts', label: 'Arts & Creative Design', match: 'art' },
    { id: 'social', label: 'Social Sciences & Humanities', match: 'social' },
    { id: 'natural', label: 'Natural & Applied Sciences', match: 'science' },
    { id: 'hospitality', label: 'Hospitality & Tourism', match: 'hospitality' },
    { id: 'law', label: 'Law & Legal Studies', match: 'law' },
  ], []);

  // Facet counts computed across allCourses
  const facetCounts = useMemo(() => {
    const countryMap: Record<string, number> = {};
    let undergradCount = 0;
    let postgradCount = 0;
    let doctorateCount = 0;
    let diplomaCount = 0;

    let fullTimeCount = 0;
    let onlineCount = 0;
    let partTimeCount = 0;

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

    let publicCount = 0;
    let privateCount = 0;
    let researchCount = 0;

    const durationCounts: Record<string, number> = {
      'Less than 1 year': 0,
      '1 - 2 years': 0,
      '2 - 3 years': 0,
      '3 - 4 years': 0,
      '4 - 5 years': 0,
      'More than 5 years': 0,
    };

    let scholarshipCount = 0;

    const fieldMap: Record<string, number> = {};

    allCourses.forEach((c) => {
      // Country
      if (c.country) {
        countryMap[c.country] = (countryMap[c.country] || 0) + 1;
      }

      // Levels
      if (c.level === 'undergraduate') undergradCount++;
      else if (c.level === 'postgraduate') postgradCount++;
      else if (c.level === 'doctorate') doctorateCount++;
      else diplomaCount++;

      // Modes
      const m = (c.studyMode || '').toLowerCase();
      if (m.includes('online')) onlineCount++;
      else if (m.includes('part-time')) partTimeCount++;
      else fullTimeCount++;

      // QS Rank
      const rank = Number(c.qsRank2027);
      if (rank > 0) {
        if (rank <= 100) qsTop100++;
        if (rank <= 300) qsTop300++;
        if (rank <= 500) qsTop500++;
        if (rank <= 1000) qsTop1000++;
      }

      // Tuition ranges
      const fee = c.annualFeeUSD;
      if (fee < 5000) under5k++;
      else if (fee <= 10000) fee5k10k++;
      else if (fee <= 20000) fee10k20k++;
      else above20k++;

      // IELTS
      const ielts = c.ieltsRequirement || 6.0;
      if (ielts <= 5.5) ielts55++;
      else if (ielts <= 6.0) ielts60++;
      else if (ielts <= 6.5) ielts65++;
      else ielts70++;
      ieltsWaiver++;

      // Institution Type
      const t = (c.universityType || '').toLowerCase();
      if (t.includes('public')) publicCount++;
      if (t.includes('private')) privateCount++;
      if (t.includes('research') || t.includes('uas') || t.includes('technology')) researchCount++;

      // Program Duration
      const durMonths = c.durationMonths || 
        (typeof c.durationYears === 'number' ? c.durationYears * 12 : 
         parseFloat(String(c.durationYears)) ? parseFloat(String(c.durationYears)) * 12 : 36);
      if (durMonths < 12) durationCounts['Less than 1 year']++;
      else if (durMonths <= 24) durationCounts['1 - 2 years']++;
      else if (durMonths <= 36) durationCounts['2 - 3 years']++;
      else if (durMonths <= 48) durationCounts['3 - 4 years']++;
      else if (durMonths <= 60) durationCounts['4 - 5 years']++;
      else durationCounts['More than 5 years']++;

      // Scholarship
      if (c.scholarshipCoveragePct && c.scholarshipCoveragePct > 0) {
        scholarshipCount++;
      }

      // Fields
      fieldCategories.forEach((fc) => {
        const inTitle = c.title.toLowerCase().includes(fc.match);
        const inDept = c.department.toLowerCase().includes(fc.match);
        if (inTitle || inDept) {
          fieldMap[fc.id] = (fieldMap[fc.id] || 0) + 1;
        }
      });
    });

    return {
      countryMap,
      undergradCount,
      postgradCount,
      doctorateCount,
      diplomaCount,
      fullTimeCount,
      onlineCount,
      partTimeCount,
      publicCount,
      privateCount,
      researchCount,
      durationCounts,
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
      fieldMap,
    };
  }, [allCourses, fieldCategories]);

  // Toggle Handlers
  const toggleCountry = (country: string) => {
    if (country === 'all') {
      setSelectedCountries([]);
    } else {
      setSelectedCountries((prev) =>
        prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
      );
    }
    setCurrentPage(1);
  };

  const toggleLevel = (lvl: string) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((x) => x !== lvl) : [...prev, lvl]
    );
    setCurrentPage(1);
  };

  const toggleField = (fId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fId) ? prev.filter((x) => x !== fId) : [...prev, fId]
    );
    setCurrentPage(1);
  };

  const toggleMode = (m: string) => {
    setSelectedModes((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
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

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
    setCurrentPage(1);
  };

  const toggleDuration = (d: string) => {
    setSelectedDurations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
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
    setSelectedLevels([]);
    setSelectedFields([]);
    setSelectedModes([]);
    setSelectedRankTiers([]);
    setSelectedTuitions([]);
    setSelectedIelts([]);
    setSelectedDurations([]);
    setSelectedTypes([]);
    setSelectedIntakes([]);
    setScholarshipOnly(false);
    setMinFee(0);
    setMaxFee(214000);
    setSortBy('qs');
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCountries.length > 0) count += selectedCountries.length;
    if (selectedLevels.length > 0) count += selectedLevels.length;
    if (selectedFields.length > 0) count += selectedFields.length;
    if (selectedModes.length > 0) count += selectedModes.length;
    if (selectedRankTiers.length > 0) count += selectedRankTiers.length;
    if (selectedTuitions.length > 0) count += selectedTuitions.length;
    if (selectedIelts.length > 0) count += selectedIelts.length;
    if (selectedDurations.length > 0) count += selectedDurations.length;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (selectedIntakes.length > 0) count += selectedIntakes.length;
    if (scholarshipOnly) count += 1;
    if (minFee !== 0 || maxFee !== 214000) count += 1;
    if (searchQuery.trim()) count += 1;
    return count;
  }, [
    selectedCountries,
    selectedLevels,
    selectedFields,
    selectedModes,
    selectedRankTiers,
    selectedTuitions,
    selectedIelts,
    selectedDurations,
    selectedTypes,
    selectedIntakes,
    scholarshipOnly,
    minFee,
    maxFee,
    searchQuery,
  ]);

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
        const matchesCountry = (course.country || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesUni && !matchesDept && !matchesCity && !matchesCountry) return false;
      }

      // 2. Countries (multi-select)
      if (selectedCountries.length > 0) {
        const matchesCountry = selectedCountries.some(
          (c) => c.toLowerCase() === (course.country || '').toLowerCase()
        );
        if (!matchesCountry) return false;
      }

      // 3. Degree Level
      if (selectedLevels.length > 0) {
        const hasLevel = selectedLevels.some((lvl) => {
          if (lvl === 'undergrad') return course.level === 'undergraduate';
          if (lvl === 'postgrad') return course.level === 'postgraduate';
          if (lvl === 'doctorate') return course.level === 'doctorate';
          if (lvl === 'diploma') {
            return (
              course.level === 'diploma' ||
              course.level === 'foundation' ||
              course.level === 'certificate' ||
              course.level === 'a-level' ||
              course.level === 'advanced-diploma'
            );
          }
          return false;
        });
        if (!hasLevel) return false;
      }

      // 4. Fields / Disciplines
      if (selectedFields.length > 0) {
        const matchesField = selectedFields.some((fId) => {
          const cat = fieldCategories.find((c) => c.id === fId);
          if (!cat) return false;
          const inTitle = course.title.toLowerCase().includes(cat.match);
          const inDept = course.department.toLowerCase().includes(cat.match);
          return inTitle || inDept;
        });
        if (!matchesField) return false;
      }

      // 5. Study Mode
      if (selectedModes.length > 0) {
        const mode = (course.studyMode || '').toLowerCase();
        const matchesMode = selectedModes.some((m) => {
          if (m === 'full-time') return mode.includes('full-time');
          if (m === 'online') return mode.includes('online');
          if (m === 'part-time') return mode.includes('part-time');
          return false;
        });
        if (!matchesMode) return false;
      }

      // 6. QS Ranking Tiers
      if (selectedRankTiers.length > 0) {
        const rank = Number(course.qsRank2027);
        const matchesRank = selectedRankTiers.some((tier) => {
          if (tier === 'top100') return rank > 0 && rank <= 100;
          if (tier === 'top300') return rank > 0 && rank <= 300;
          if (tier === 'top500') return rank > 0 && rank <= 500;
          if (tier === 'top1000') return rank > 0 && rank <= 1000;
          return false;
        });
        if (!matchesRank) return false;
      }

      // 7. Tuition Fee Buckets
      if (selectedTuitions.length > 0) {
        const fee = course.annualFeeUSD;
        const matchesTuition = selectedTuitions.some((t) => {
          if (t === 'under5k') return fee < 5000;
          if (t === '5k-10k') return fee >= 5000 && fee <= 10000;
          if (t === '10k-20k') return fee > 10000 && fee <= 20000;
          if (t === 'above20k') return fee > 20000;
          return false;
        });
        if (!matchesTuition) return false;
      }

      // 8. Fee Range Slider
      if (course.annualFeeUSD < minFee || course.annualFeeUSD > maxFee) {
        return false;
      }

      // 9. IELTS Score
      if (selectedIelts.length > 0) {
        const req = course.ieltsRequirement || 6.0;
        const matchesIelts = selectedIelts.some((tier) => {
          if (tier === '5.5') return req <= 5.5;
          if (tier === '6.0') return req === 6.0;
          if (tier === '6.5') return req === 6.5;
          if (tier === '7.0') return req >= 7.0;
          if (tier === 'waiver') return req <= 5.5 || course.country === 'Malaysia' || course.country === 'Cyprus' || course.country === 'India';
          return false;
        });
        if (!matchesIelts) return false;
      }

      // 10. Intake Months
      if (selectedIntakes.length > 0) {
        const hasIntake = course.intakes.some((m) =>
          selectedIntakes.some((sel) => m.toLowerCase().includes(sel.toLowerCase()))
        );
        if (!hasIntake) return false;
      }

      // 11. Program Duration
      if (selectedDurations.length > 0) {
        const durMonths = course.durationMonths || 
          (typeof course.durationYears === 'number' ? course.durationYears * 12 : 
           parseFloat(String(course.durationYears)) ? parseFloat(String(course.durationYears)) * 12 : 36);
        const matchesDur = selectedDurations.some((d) => {
          if (d === 'Less than 1 year') return durMonths < 12;
          if (d === '1 - 2 years') return durMonths >= 12 && durMonths <= 24;
          if (d === '2 - 3 years') return durMonths >= 24 && durMonths <= 36;
          if (d === '3 - 4 years') return durMonths >= 36 && durMonths <= 48;
          if (d === '4 - 5 years') return durMonths >= 48 && durMonths <= 60;
          if (d === 'More than 5 years') return durMonths > 60;
          return false;
        });
        if (!matchesDur) return false;
      }

      // 12. Institution Type
      if (selectedTypes.length > 0) {
        const t = (course.universityType || '').toLowerCase();
        const matchesType = selectedTypes.some((typeKey) => {
          if (typeKey === 'public') return t.includes('public');
          if (typeKey === 'private') return t.includes('private');
          if (typeKey === 'research') return t.includes('research') || t.includes('uas') || t.includes('technology');
          return false;
        });
        if (!matchesType) return false;
      }

      // 13. Scholarship only
      if (scholarshipOnly) {
        if (!course.scholarshipCoveragePct || course.scholarshipCoveragePct <= 0) {
          return false;
        }
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
  }, [
    allCourses,
    searchQuery,
    selectedCountries,
    selectedLevels,
    selectedFields,
    selectedModes,
    selectedRankTiers,
    selectedTuitions,
    selectedIelts,
    selectedIntakes,
    scholarshipOnly,
    minFee,
    maxFee,
    sortBy,
    fieldCategories,
  ]);

  // Synchronized partner universities matching filtered courses
  const filteredUniversities = useMemo(() => {
    const uniIds = new Set(filteredCourses.map((c) => c.universityId));
    const uniNames = new Set(filteredCourses.map((c) => c.universityName));
    return allUnis.filter((uni) => uniIds.has(uni.id) || uniNames.has(uni.name));
  }, [filteredCourses, allUnis]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

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

  // Helper to retrieve university banner from mock database
  const getUniBanner = (uniId: string) => {
    const u = allUnis.find((item) => item.id === uniId);
    return u?.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop';
  };

  const getUniSlug = (uniId: string) => {
    const u = allUnis.find((item) => item.id === uniId);
    return u?.slug || '';
  };

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

  return (
    <div className="w-full max-w-[1600px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-2 sm:py-10">
      {/* 1. Header Banner - Matching Universities Page Exactly */}
      <div className="bg-[#0a1120] rounded-xl sm:rounded-3xl p-3.5 xs:p-4 sm:p-12 mb-3 sm:mb-8 shadow-lg sm:shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[8.5px] xs:text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          WORLD-CLASS EDUCATION
        </div>
        <h1 className="text-lg xs:text-xl sm:text-6xl font-black text-white tracking-tight sm:tracking-tighter leading-snug sm:leading-tight mb-1.5 sm:mb-6">
          Explore <span className="bg-[#fbb034] text-slate-950 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg">Degree Programs</span> & Courses
        </h1>
        <p className="text-[10px] xs:text-[11px] sm:text-lg text-slate-300 font-medium max-w-full sm:max-w-xl leading-tight sm:leading-relaxed whitespace-nowrap truncate">
          Browse 500+ accredited degree programs across 167+ partner universities worldwide
        </p>
      </div>

      {/* Directory with Filter Tick Options & Top Search */}
      <div className="space-y-3 sm:space-y-6">
        {/* Top Search Bar & Sort Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 xs:p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-4">
          {/* Search Input Bar */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] sm:text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search course title, faculty, university, city, or country..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 sm:h-12 pl-9 sm:pl-11 pr-9 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] sm:text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Button + Sort Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 justify-between md:justify-end shrink-0">
            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden h-10 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-blue-600">tune</span>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort By Dropdown */}
            <div className="relative flex-1 md:flex-none w-full md:w-[280px]">
              <span className="material-symbols-outlined absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] sm:text-[18px] pointer-events-none">
                sort
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 sm:h-12 pl-8 sm:pl-10 pr-8 sm:pr-10 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs transition-all appearance-none cursor-pointer"
              >
                <option value="qs">Sort: QS World Ranking</option>
                <option value="az">Sort: Alphabetical (A to Z)</option>
                <option value="fee-asc">Sort: Tuition (Low to High)</option>
                <option value="fee-desc">Sort: Tuition (High to Low)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] sm:text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* PROMINENT HORIZONTALLY SCROLLABLE CHIP-BASED FILTER BAR */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-sm text-[#fbb034]">auto_awesome</span>
              <span>Popular Course Categories</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Quick access to top fields
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar sm:sleek-scrollbar scroll-smooth">
            {[
              { id: 'all', label: 'All Fields', icon: 'apps', matchId: null },
              { id: 'cs', label: 'STEM', icon: 'terminal', matchId: 'cs' },
              { id: 'engineering', label: 'Engineering', icon: 'precision_manufacturing', matchId: 'engineering' },
              { id: 'business', label: 'MBA & Business', icon: 'business_center', matchId: 'business' },
              { id: 'arts', label: 'Art & Design', icon: 'palette', matchId: 'arts' },
              { id: 'health', label: 'Medicine & Health', icon: 'medical_services', matchId: 'health' },
              { id: 'law', label: 'Law & Legal', icon: 'gavel', matchId: 'law' },
              { id: 'hospitality', label: 'Hospitality', icon: 'hotel', matchId: 'hospitality' },
              { id: 'social', label: 'Social Sciences', icon: 'groups', matchId: 'social' },
            ].map((chip) => {
              const isAll = chip.id === 'all';
              const isSelected = isAll ? selectedFields.length === 0 : selectedFields.includes(chip.matchId!);

              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    if (isAll) {
                      setSelectedFields([]);
                    } else if (chip.matchId) {
                      setSelectedFields([chip.matchId]);
                    }
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border active:scale-95 shadow-xs ${
                    isSelected
                      ? 'bg-[#fbb034] border-[#fbb034] text-slate-950 font-black shadow-md shadow-amber-400/20 scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-[#fbb034]/50 hover:text-amber-800 dark:hover:text-amber-300'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] ${isSelected ? 'text-slate-950 font-black' : 'text-[#fbb034]'}`}>
                    {chip.icon}
                  </span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Left Filter Sidebar + Right Cards Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-8 items-start">
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
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-[#fbb034] hover:underline cursor-pointer"
                >
                  Reset ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* 1. DESTINATIONS & COUNTRIES */}
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
                          ({allCourses.length})
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

              {/* 2. STUDY LEVEL */}
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

              {/* 3. PROGRAM FIELD / DISCIPLINE */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('fields')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">category</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Discipline & Field
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedFields.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedFields([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedFields([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.fields ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.fields && (
                  <div className="space-y-1 max-h-[220px] overflow-y-auto sleek-scrollbar pr-1">
                    {fieldCategories.map((fc) => {
                      const isSelected = selectedFields.includes(fc.id);
                      const count = facetCounts.fieldMap[fc.id] || 0;
                      return (
                        <button
                          key={fc.id}
                          type="button"
                          onClick={() => toggleField(fc.id)}
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
                              {fc.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. IELTS REQUIREMENT */}
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

              {/* 5. INTAKE MONTHS */}
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

              {/* 6. DURATION (Tick Options) */}
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
                  <div className="flex items-center gap-2">
                    {selectedDurations.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedDurations([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedDurations([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.duration ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.duration && (
                  <div className="grid grid-cols-2 gap-2">
                    {['Less than 1 year', '1 - 2 years', '2 - 3 years', '3 - 4 years', '4 - 5 years', 'More than 5 years'].map((d) => {
                      const isSelected = selectedDurations.includes(d);
                      const count = facetCounts.durationCounts[d] || 0;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleDuration(d)}
                          className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? 'bg-[#fbb034] text-slate-950 font-bold border-[#fbb034] shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:border-amber-300'
                          }`}
                        >
                          <span>{d}</span>
                          <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-900/80' : 'text-slate-400'}`}>({count})</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 7. FEE RANGE (Interactive Slider) */}
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
                      onRangeChange={(r) => { setMinFee(r[0]); setMaxFee(r[1]); setCurrentPage(1); }}
                    />
                  </div>
                )}
              </div>

              {/* 8. INSTITUTION TYPE */}
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

              {/* 9. QS WORLD RANKING */}
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

              {/* 10. ANNUAL TUITION TIER */}
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

              {/* 11. STUDY MODE */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('studyMode')}
                  className="flex items-center justify-between w-full group py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#fbb034] text-[10px]">laptop_mac</span>
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 group-hover:text-[#fbb034]">
                      Study Mode
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedModes.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedModes([]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSelectedModes([]); } }}
                        className="text-[11px] font-bold text-[#fbb034] hover:text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </span>
                    )}
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.studyMode ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.studyMode && (
                  <div className="space-y-1">
                    {[
                      { id: 'full-time', label: 'Full-Time (On Campus)', count: facetCounts.fullTimeCount },
                      { id: 'online', label: 'Online / Distance', count: facetCounts.onlineCount },
                      { id: 'part-time', label: 'Part-Time / Hybrid', count: facetCounts.partTimeCount },
                    ].map((item) => {
                      const isSelected = selectedModes.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleMode(item.id)}
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

              {/* 12. BENEFITS & SCHOLARSHIPS */}
              <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection('benefits')}
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
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${openSections.benefits ? '' : '-rotate-90'}`}>expand_more</span>
                  </div>
                </button>
                {openSections.benefits && (
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
                      <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                        ({facetCounts.scholarshipCount})
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT AREA: Results Bar, Grid & Pagination */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-6">
            {/* Results bar header */}
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 xs:p-4 space-y-2.5 sm:space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {filteredCourses.length} Degree Programs Found
                  </span>
                  {wishlist.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateToWishlist) {
                          onNavigateToWishlist();
                        } else {
                          setIsWishlistSectionCollapsed(false);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-[#fbb034]/50 text-amber-900 dark:text-amber-300 text-[11px] font-bold hover:bg-amber-100 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm text-[#fbb034]">bookmark</span>
                      <span>Wishlist ({wishlist.length})</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle Switcher */}
                  <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setDisplayMode('both')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        displayMode === 'both'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      Both View
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisplayMode('map')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        displayMode === 'map'
                          ? 'bg-[#fbb034] text-slate-950 font-black shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">map</span>
                      <span>Map ({filteredUniversities.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisplayMode('grid')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        displayMode === 'grid'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      Cards
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 font-medium hidden sm:block">
                    Page {currentPage} of {totalPages}
                  </div>
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

                  {selectedFields.map((fId) => {
                    const label = fieldCategories.find((c) => c.id === fId)?.label || fId;
                    return (
                      <span
                        key={fId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[11px] font-medium"
                      >
                        <span>{label}</span>
                        <button
                          type="button"
                          onClick={() => toggleField(fId)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}

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

                  {selectedDurations.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium"
                    >
                      <span>Duration: {d}</span>
                      <button
                        type="button"
                        onClick={() => toggleDuration(d)}
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
                      <span className="capitalize">{t === 'research' ? 'Research & Technical' : `${t} University`}</span>
                      <button
                        type="button"
                        onClick={() => toggleType(t)}
                        className="hover:text-red-500 cursor-pointer ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}

                  {selectedIntakes.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-[11px] font-medium"
                    >
                      <span>Intake: {m}</span>
                      <button
                        type="button"
                        onClick={() => toggleIntake(m)}
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

                  {(minFee > 0 || maxFee < 214000) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                      <span>Fee: ${minFee.toLocaleString()} – ${maxFee.toLocaleString()}</span>
                      <button
                        type="button"
                        onClick={() => { setMinFee(0); setMaxFee(214000); }}
                        className="hover:text-red-500 cursor-pointer ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedModes.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium"
                    >
                      <span className="capitalize">{m}</span>
                      <button
                        type="button"
                        onClick={() => toggleMode(m)}
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

            {/* INTERACTIVE GLOBAL PARTNER UNIVERSITY MAP */}
            {displayMode !== 'grid' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">map</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                          Interactive Global Partner Map
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">
                          {filteredUniversities.length} Partner Universities
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                        Explore verified partner campus locations automatically updated with your search & filter criteria.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMapExpanded(!isMapExpanded)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-sm transition-transform ${isMapExpanded ? '' : '-rotate-90'}`}>
                        expand_more
                      </span>
                      <span>{isMapExpanded ? 'Collapse Map' : 'Expand Map'}</span>
                    </button>
                  </div>
                </div>

                {isMapExpanded && (
                  <div className="pt-1">
                    <UniversityMap
                      universities={filteredUniversities}
                      allCourses={allCourses}
                      onNavigateToUni={onNavigateToUni}
                      onResetFilters={resetAllFilters}
                    />
                  </div>
                )}
              </div>
            )}

            {/* DEDICATED SECTION: SAVED COURSES WISHLIST */}
            {wishlist.length > 0 && (
              <section
                aria-label="Saved Courses Wishlist"
                className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-blue-500/10 border-2 border-[#fbb034]/40 p-4 sm:p-5 shadow-xs dark:bg-slate-900/90 relative overflow-hidden transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-300/30 dark:border-amber-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#fbb034] to-amber-300 text-slate-950 flex items-center justify-center shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-[22px]">bookmark</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          Your Saved Courses ({wishlist.length})
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#fbb034] text-slate-950 text-[10px] font-black uppercase">
                          Wishlist
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Compare shortlisted degree programs, book 1-on-1 counseling consultations, or manage in your Wishlist Portal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {onNavigateToWishlist && (
                      <button
                        type="button"
                        onClick={onNavigateToWishlist}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        <span>Open Wishlist Portal</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsWishlistSectionCollapsed(!isWishlistSectionCollapsed)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-sm transition-transform ${isWishlistSectionCollapsed ? '-rotate-90' : 'rotate-0'}`}>
                        expand_more
                      </span>
                      <span>{isWishlistSectionCollapsed ? 'Show Details' : 'Collapse'}</span>
                    </button>
                  </div>
                </div>

                {!isWishlistSectionCollapsed && (
                  <div className="pt-3">
                    {/* Horizontal scrollable track of saved courses */}
                    <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
                      {wishlist.map((sc) => (
                        <div
                          key={`saved-strip-${sc.id}`}
                          className="min-w-[270px] sm:min-w-[300px] max-w-[320px] bg-white dark:bg-slate-900 rounded-xl border border-amber-300/40 dark:border-amber-900/40 p-3.5 shadow-xs flex flex-col justify-between shrink-0 space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block truncate">
                                {sc.flagEmoji} {sc.universityName}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                                {sc.title}
                              </h4>
                              <span className="text-[11px] text-slate-500 line-clamp-1">
                                {sc.department}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromWishlist(sc.id)}
                              title="Remove from saved courses"
                              aria-label={`Remove ${sc.title} from saved courses`}
                              className="w-6 h-6 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div>
                              <span className="text-[9px] text-slate-400 uppercase font-bold block">Annual Tuition</span>
                              <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                                {formatUSD(sc.annualFeeUSD)}/yr
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onApply(`${sc.title} at ${sc.universityName}`)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors cursor-pointer active:scale-95 shadow-xs"
                            >
                              Book Counseling
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Courses Grid - Formatted identically to UniversityExplorerView cards */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">menu_book</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No degree programs found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  No courses found matching your active filter criteria. Try searching with another term or reset your filters.
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
                  {paginatedCourses.map((course) => {
                    const uniSlug = getUniSlug(course.universityId);
                    const bannerUrl = getUniBanner(course.universityId);
                    const isCompared = comparedCourseIds.includes(course.id);
                    const isSaved = isInWishlist(course.id);
                    const isBouncing = bouncingCourseId === course.id;

                    return (
                      <article
                        key={course.id}
                        className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group ${
                          isCompared
                            ? 'border-[#fbb034] ring-2 ring-[#fbb034]/40 bg-amber-50/10'
                            : 'border-slate-200/90 dark:border-slate-800'
                        }`}
                      >
                        <div>
                          {/* Card Banner (Identical to University Card Banner with location & QS badge) */}
                          <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                            <img
                              src={bannerUrl}
                              alt={course.universityName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

                            {/* Top row: Country & QS/Level Badge & Wishlist Quick Save */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-extrabold shadow-md flex items-center gap-1">
                                <span>{course.flagEmoji}</span>
                                <span>{course.country}</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                {course.qsRank2027 ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10.5px] font-black shadow-xs flex items-center gap-1">
                                    <span>QS 2027:</span>
                                    <span>#{course.qsRank2027}</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                                    {course.level}
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(course);
                                  }}
                                  aria-label={isSaved ? `Remove ${course.title} from wishlist` : `Save ${course.title} to wishlist`}
                                  title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md ${
                                    isSaved
                                      ? 'bg-[#fbb034] text-slate-950 ring-2 ring-white/60'
                                      : 'bg-slate-950/60 hover:bg-slate-950/90 text-white hover:text-[#fbb034] border border-white/25'
                                  } ${isBouncing ? 'animate-wishlist-bounce' : 'active:scale-90 hover:scale-105'}`}
                                >
                                  <span className="material-symbols-outlined text-[15px]">
                                    {isSaved ? 'bookmark' : 'bookmark_border'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Bottom row over banner: City & University Name */}
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

                            {/* Duration & Intakes Meta Chips */}
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                                Program Specifications:
                              </span>
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

                        {/* Bottom Action Row: Apply Now (Red) + Save to Wishlist + Compare Toggle */}
                        <div className="p-5 pt-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onApply(`${course.title} at ${course.universityName}`)}
                              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer text-center active:scale-95 shadow-xs"
                            >
                              Apply Now
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleCompare(course.id)}
                              title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isCompared
                                  ? 'bg-[#fbb034] text-slate-950 shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                {isCompared ? 'check_circle' : 'compare_arrows'}
                              </span>
                              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                            </button>
                          </div>

                          {/* Save to Wishlist button with subtle scaling bounce animation */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(course);
                            }}
                            aria-label={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
                            title={isSaved ? "Course saved in your wishlist" : "Save course to wishlist"}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
                              isSaved
                                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-[#fbb034]/60 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 border border-transparent hover:border-amber-200 dark:hover:border-amber-800/40'
                            } ${isBouncing ? 'animate-wishlist-bounce' : 'hover:scale-[1.01] active:scale-95'}`}
                          >
                            <span className={`material-symbols-outlined text-[16px] transition-transform ${isSaved ? 'text-[#fbb034]' : 'text-slate-400 group-hover:text-amber-500'}`}>
                              {isSaved ? 'bookmark_added' : 'bookmark_add'}
                            </span>
                            <span>{isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Numbered Pagination Bar (Matching universities.html 100%) */}
                {filteredCourses.length > ITEMS_PER_PAGE && (
                  <nav
                    aria-label="Course Directory Pagination"
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

        {/* MOBILE FILTER MODAL DRAWER (Matching Universities.html Drawer Exactly) */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
            <div className="relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-3xl p-3.5 xs:p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="material-symbols-outlined text-[#fbb034] text-lg sm:text-xl font-bold">tune</span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
                    Refine Search
                  </h3>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#fbb034] text-slate-950 text-[10px] sm:text-xs font-black">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
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
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm sm:text-base">close</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Filter List */}
              <div className="flex-1 overflow-y-auto space-y-3.5 sm:space-y-5 py-3 sm:py-4 pr-1 sleek-scrollbar">
                {/* Destinations */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] sm:text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
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
                      <span className="text-[11px] text-slate-400">({allCourses.length})</span>
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

                {/* Study Level */}
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

                {/* Disciplines */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                      Discipline & Field
                    </label>
                    {selectedFields.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedFields([])}
                        className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-[160px] overflow-y-auto sleek-scrollbar">
                    {fieldCategories.map((fc) => {
                      const isSelected = selectedFields.includes(fc.id);
                      const count = facetCounts.fieldMap[fc.id] || 0;
                      return (
                        <button
                          key={fc.id}
                          type="button"
                          onClick={() => toggleField(fc.id)}
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
                              {fc.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">({count})</span>
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
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 cursor-pointer"
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

                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                      Duration
                    </label>
                    {selectedDurations.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedDurations([])}
                        className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Less than 1 year', '1 - 2 years', '2 - 3 years', '3 - 4 years', '4 - 5 years', 'More than 5 years'].map((d) => {
                      const isSelected = selectedDurations.includes(d);
                      const count = facetCounts.durationCounts[d] || 0;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleDuration(d)}
                          className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? 'bg-[#fbb034] text-slate-950 font-bold border-[#fbb034] shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:border-amber-300'
                          }`}
                        >
                          <span>{d}</span>
                          <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-900/80' : 'text-slate-400'}`}>({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Institution Type */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                      Institution Type
                    </label>
                    {selectedTypes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTypes([])}
                        className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
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
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 cursor-pointer"
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

                {/* Study Mode */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400 block">
                      Study Mode
                    </label>
                    {selectedModes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedModes([])}
                        className="text-[11px] font-bold text-[#fbb034] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'full-time', label: 'Full-Time (On Campus)', count: facetCounts.fullTimeCount },
                      { id: 'online', label: 'Online / Distance', count: facetCounts.onlineCount },
                      { id: 'part-time', label: 'Part-Time / Hybrid', count: facetCounts.partTimeCount },
                    ].map((item) => {
                      const isSelected = selectedModes.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleMode(item.id)}
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
                  Show {filteredCourses.length} Programs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Docked Floating Comparison Trigger Bar */}
      {comparedCourses.length > 0 && (
        <div className="fixed bottom-4 inset-x-3 xs:inset-x-4 max-w-4xl mx-auto z-40 bg-slate-950/95 text-white backdrop-blur-md rounded-2xl sm:rounded-full p-3 sm:px-6 shadow-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slideUp">
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

      {/* Comprehensive Comparison Matrix Modal */}
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
                          {formatPriceString(c.tuitionFeeLocal, c.annualFeeUSD)}
                        </strong>
                        <span className="text-xs text-slate-500">
                          Approx {formatUSD(c.annualFeeUSD)} / yr
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
                          className="min-h-[44px] w-full px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer text-center"
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

      {/* Temporary Feedback Toast for Saved Courses */}
      <WishlistToast onNavigateToWishlist={onNavigateToWishlist} />
    </div>
  );
};

export default CourseExplorerView;
