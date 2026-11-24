/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES International Course & Degree Explorer with Multi-University Comparison Engine
 * Redesigned to match the exact design, typography, theme, spacing, color, and layout of universities.html
 */

import React, { useState, useMemo } from 'react';
import { Course } from '../../types/index.ts';
import { getCollaboratedCourses, getCollaboratedUniversities } from '../../utils/PartnerUniversityManager.ts';
import { SPECIFIC_QUALIFICATIONS, matchesCourseQualification } from '../../lib/qualification-config.ts';
import { matchesCourseSubject } from '../../lib/subject-config.ts';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useComparison } from '../../context/ComparisonContext.tsx';
import { WishlistToast } from './WishlistToast.tsx';
import { UniversityMap } from './UniversityMap.tsx';
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
import {
  StitchCourseFilterSidebar,
  STITCH_MAX_BUDGET,
  STITCH_IELTS_MIN,
  STITCH_IELTS_MAX,
  matchesStitchStudyMode,
  matchesApplicationFeeWaiver,
  getCountryDisplayName,
} from './StitchCourseFilterSidebar.tsx';

interface CourseExplorerViewProps {
  onApply: (courseTitleAndUni: string) => void;
  onNavigateHome?: () => void;
  onNavigateToUni?: (uniSlug: string) => void;
  onNavigateToWishlist?: () => void;
  initialQuery?: string;
  initialCountry?: string;
  initialLevel?: string;
  initialField?: string;
}

const SORT_OPTIONS = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'ielts-asc', label: 'IELTS score: Low to High' },
  { id: 'ielts-desc', label: 'IELTS score: High to Low' },
  { id: 'az', label: 'Course name: A-Z' },
  { id: 'za', label: 'Course name: Z-A' },
  { id: 'intake-next', label: 'Intake: Next starting' },
  { id: 'fee-asc', label: 'Fee: Low to High' },
  { id: 'fee-desc', label: 'Fee: High to Low' },
  { id: 'qs', label: 'QS World Ranking' },
];

const monthMap: Record<string, number> = {
  january: 0, jan: 0,
  february: 1, feb: 1,
  march: 2, mar: 2,
  april: 3, apr: 3,
  may: 4,
  june: 5, jun: 5,
  july: 6, jul: 6,
  august: 7, aug: 7,
  september: 8, sep: 8, sept: 8,
  october: 9, oct: 9,
  november: 10, nov: 10,
  december: 11, dec: 11
};

const getNextIntakeScore = (intakes?: string[]): number => {
  if (!intakes || intakes.length === 0) return 999;
  const currentMonth = new Date().getMonth();
  let minDiff = 999;
  for (const intakeStr of intakes) {
    if (!intakeStr) continue;
    const lower = intakeStr.toLowerCase();
    for (const [mName, mIdx] of Object.entries(monthMap)) {
      if (lower.includes(mName)) {
        let diff = mIdx - currentMonth;
        if (diff < 0) diff += 12;
        if (diff < minDiff) minDiff = diff;
      }
    }
  }
  return minDiff;
};

export const CourseExplorerView: React.FC<CourseExplorerViewProps> = ({
  onApply,
  onNavigateHome,
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

  // Filter states (supporting single or multi-value initial props)
  const parseInitialFilter = (val?: string | string[]): string[] => {
    if (!val || val === 'all' || val === 'All Levels') return [];
    if (Array.isArray(val)) return val.filter(v => v && v !== 'all' && v !== 'All Levels');
    if (typeof val === 'string') {
      return (val.includes(',') ? val.split(',').map(s => s.trim()) : [val.trim()])
        .filter(v => Boolean(v) && v !== 'all' && v !== 'All Levels');
    }
    return [];
  };

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(() => parseInitialFilter(initialCountry));
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(() => parseInitialFilter(initialLevel));
  const [selectedFields, setSelectedFields] = useState<string[]>(() => parseInitialFilter(initialField));
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedRankTiers, setSelectedRankTiers] = useState<string[]>([]);
  const [selectedTuitions, setSelectedTuitions] = useState<string[]>([]);
  const [selectedIelts, setSelectedIelts] = useState<string[]>([]);
  const [ieltsMin, setIeltsMin] = useState<number>(STITCH_IELTS_MIN);
  const [ieltsMax, setIeltsMax] = useState<number>(STITCH_IELTS_MAX);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedIntakes, setSelectedIntakes] = useState<string[]>([]);
  const [scholarshipOnly, setScholarshipOnly] = useState<boolean>(false);
  const [feeWaiverOnly, setFeeWaiverOnly] = useState<boolean>(false);
  const [minFee, setMinFee] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(STITCH_MAX_BUDGET);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showAllActiveChips, setShowAllActiveChips] = useState<boolean>(false);

  // Sorting and Pagination
  const [sortBy, setSortBy] = useState<'popularity' | 'ielts-asc' | 'ielts-desc' | 'az' | 'za' | 'intake-next' | 'fee-asc' | 'fee-desc' | 'qs'>('qs');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  // Global Comparison Engine (slide-up bottom dock + dedicated side-by-side portal)
  const { comparedCourseIds, toggleCompareCourse } = useComparison();

  // Interactive Global Map display state
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list' | 'map' | 'wishlist'>('grid');
  const [selectedProgramme, setSelectedProgramme] = useState<Course | null>(null);

  // Legacy short field category mapping (for compatibility with incoming initialField IDs)
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

  // Toggle Handlers
  const toggleCountry = (country: string) => {
    if (country === 'all') {
      setSelectedCountries([]);
    } else {
      setSelectedCountries((prev) => {
        if (prev.includes(country)) return prev.filter((c) => c !== country);
        if (prev.length >= 5) return prev;
        return [...prev, country];
      });
    }
    setCurrentPage(1);
  };

  const toggleCity = (city: string) => {
    setSelectedCities((prev) => {
      if (prev.includes(city)) return prev.filter((c) => c !== city);
      if (prev.length >= 5) return prev;
      return [...prev, city];
    });
    setCurrentPage(1);
  };

  const toggleInstitution = (inst: string) => {
    setSelectedInstitutions((prev) => {
      if (prev.includes(inst)) return prev.filter((i) => i !== inst);
      if (prev.length >= 5) return prev;
      return [...prev, inst];
    });
    setCurrentPage(1);
  };

  const toggleLevel = (lvl: string) => {
    if (lvl === 'All Levels') {
      setSelectedLevels([]);
    } else {
      setSelectedLevels((prev) => {
        const cleaned = prev.filter((x) => x !== 'All Levels');
        return cleaned.includes(lvl) ? cleaned.filter((x) => x !== lvl) : [...cleaned, lvl];
      });
    }
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
    setSelectedCities([]);
    setSelectedInstitutions([]);
    setSelectedLevels([]);
    setSelectedFields([]);
    setSelectedModes([]);
    setSelectedRankTiers([]);
    setSelectedTuitions([]);
    setSelectedIelts([]);
    setIeltsMin(STITCH_IELTS_MIN);
    setIeltsMax(STITCH_IELTS_MAX);
    setSelectedDurations([]);
    setSelectedTypes([]);
    setSelectedIntakes([]);
    setScholarshipOnly(false);
    setFeeWaiverOnly(false);
    setMinFee(0);
    setMaxFee(STITCH_MAX_BUDGET);
    setShowAllActiveChips(false);
    setSortBy('qs');
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCountries.length > 0) count += selectedCountries.length;
    if (selectedCities.length > 0) count += selectedCities.length;
    if (selectedInstitutions.length > 0) count += selectedInstitutions.length;
    if (selectedLevels.length > 0) count += selectedLevels.length;
    if (selectedFields.length > 0) count += selectedFields.length;
    if (selectedModes.length > 0) count += selectedModes.length;
    if (selectedRankTiers.length > 0) count += selectedRankTiers.length;
    if (selectedTuitions.length > 0) count += selectedTuitions.length;
    if (selectedIelts.length > 0) count += selectedIelts.length;
    if (ieltsMin > STITCH_IELTS_MIN || ieltsMax < STITCH_IELTS_MAX) count += 1;
    if (selectedDurations.length > 0) count += selectedDurations.length;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (selectedIntakes.length > 0) count += selectedIntakes.length;
    if (scholarshipOnly) count += 1;
    if (feeWaiverOnly) count += 1;
    if (minFee !== 0 || maxFee !== STITCH_MAX_BUDGET) count += 1;
    if (searchQuery.trim()) count += 1;
    return count;
  }, [
    selectedCountries,
    selectedCities,
    selectedInstitutions,
    selectedLevels,
    selectedFields,
    selectedModes,
    selectedRankTiers,
    selectedTuitions,
    selectedIelts,
    ieltsMin,
    ieltsMax,
    selectedDurations,
    selectedTypes,
    selectedIntakes,
    scholarshipOnly,
    feeWaiverOnly,
    minFee,
    maxFee,
    searchQuery,
  ]);

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ id: string; category: string; value: string; onRemove: () => void }> = [];

    if (searchQuery.trim()) {
      chips.push({
        id: 'search',
        category: 'Search',
        value: searchQuery.trim(),
        onRemove: () => {
          setSearchQuery('');
          setCurrentPage(1);
        },
      });
    }
    selectedCountries.forEach((c) => {
      chips.push({
        id: `country-${c}`,
        category: 'Country',
        value: getCountryDisplayName(c),
        onRemove: () => toggleCountry(c),
      });
    });
    selectedCities.forEach((city) => {
      chips.push({
        id: `city-${city}`,
        category: 'City',
        value: city,
        onRemove: () => toggleCity(city),
      });
    });
    selectedInstitutions.forEach((inst) => {
      chips.push({
        id: `inst-${inst}`,
        category: 'Institution',
        value: inst,
        onRemove: () => toggleInstitution(inst),
      });
    });
    selectedLevels
      .filter((l) => l !== 'All Levels')
      .forEach((lvl) => {
        chips.push({
          id: `level-${lvl}`,
          category: 'Level',
          value: lvl,
          onRemove: () => toggleLevel(lvl),
        });
      });
    selectedFields.forEach((fId) => {
      const label = fieldCategories.find((c) => c.id === fId)?.label || fId;
      chips.push({
        id: `field-${fId}`,
        category: 'Subject',
        value: label,
        onRemove: () => toggleField(fId),
      });
    });
    selectedIelts.forEach((val) => {
      chips.push({
        id: `ielts-${val}`,
        category: 'IELTS',
        value: val === 'waiver' ? 'Waiver' : val,
        onRemove: () => toggleIelts(val),
      });
    });
    if (ieltsMin > STITCH_IELTS_MIN || ieltsMax < STITCH_IELTS_MAX) {
      chips.push({
        id: 'ielts-range',
        category: 'IELTS',
        value: `${ieltsMin.toFixed(1)}–${ieltsMax.toFixed(1)}`,
        onRemove: () => {
          setIeltsMin(STITCH_IELTS_MIN);
          setIeltsMax(STITCH_IELTS_MAX);
          setCurrentPage(1);
        },
      });
    }
    selectedModes.forEach((mode) => {
      chips.push({
        id: `mode-${mode}`,
        category: 'Mode',
        value: mode,
        onRemove: () => toggleMode(mode),
      });
    });
    selectedIntakes.forEach((month) => {
      chips.push({
        id: `intake-${month}`,
        category: 'Intake',
        value: month,
        onRemove: () => toggleIntake(month),
      });
    });
    selectedDurations.forEach((dur) => {
      chips.push({
        id: `dur-${dur}`,
        category: 'Duration',
        value: dur,
        onRemove: () => toggleDuration(dur),
      });
    });
    selectedTuitions.forEach((t) => {
      chips.push({
        id: `tuition-${t}`,
        category: 'Fee',
        value: t,
        onRemove: () => toggleTuition(t),
      });
    });
    if (minFee > 0 || maxFee < STITCH_MAX_BUDGET) {
      chips.push({
        id: 'budget',
        category: 'Budget',
        value: `$${Math.round(minFee / 1000)}k–$${Math.round(maxFee / 1000)}k`,
        onRemove: () => {
          setMinFee(0);
          setMaxFee(STITCH_MAX_BUDGET);
          setCurrentPage(1);
        },
      });
    }
    selectedTypes.forEach((t) => {
      chips.push({
        id: `type-${t}`,
        category: 'Type',
        value: t === 'research' ? 'Research & Technical' : t.charAt(0).toUpperCase() + t.slice(1),
        onRemove: () => toggleType(t),
      });
    });
    selectedRankTiers.forEach((tier) => {
      chips.push({
        id: `rank-${tier}`,
        category: 'Rank',
        value: `${tier.replace('top', 'Top ')} QS`,
        onRemove: () => toggleRankTier(tier),
      });
    });
    if (scholarshipOnly) {
      chips.push({
        id: 'scholarship',
        category: 'Grant',
        value: 'Scholarships',
        onRemove: () => {
          setScholarshipOnly(false);
          setCurrentPage(1);
        },
      });
    }
    if (feeWaiverOnly) {
      chips.push({
        id: 'fee-waiver',
        category: 'Fee',
        value: 'Waiver',
        onRemove: () => {
          setFeeWaiverOnly(false);
          setCurrentPage(1);
        },
      });
    }

    return chips;
  }, [
    searchQuery,
    selectedCountries,
    selectedCities,
    selectedInstitutions,
    selectedLevels,
    selectedFields,
    fieldCategories,
    selectedIelts,
    ieltsMin,
    ieltsMax,
    selectedModes,
    selectedIntakes,
    selectedDurations,
    selectedTuitions,
    minFee,
    maxFee,
    selectedTypes,
    selectedRankTiers,
    scholarshipOnly,
    feeWaiverOnly,
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

      // 2b. Cities (multi-select)
      if (selectedCities.length > 0) {
        const matchesCity = selectedCities.some(
          (city) => city.toLowerCase() === (course.city || '').toLowerCase()
        );
        if (!matchesCity) return false;
      }

      // 2c. Institutions (multi-select)
      if (selectedInstitutions.length > 0) {
        const matchesInst = selectedInstitutions.some(
          (inst) => inst.toLowerCase() === (course.universityName || '').toLowerCase()
        );
        if (!matchesInst) return false;
      }

      // 3. Degree Level / Qualification
      const activeSpecificLevels = selectedLevels.filter((l) => l !== 'All Levels');
      if (activeSpecificLevels.length > 0) {
        const hasLevel = activeSpecificLevels.some((lvl) => matchesCourseQualification(course, lvl));
        if (!hasLevel) return false;
      }

      // 4. Fields / Disciplines (supports both sidebar category IDs and full IDP/GEES subject names)
      if (selectedFields.length > 0) {
        const matchesField = selectedFields.some((fId) => {
          const cat = fieldCategories.find((c) => c.id === fId);
          if (cat) {
            const inTitle = course.title.toLowerCase().includes(cat.match);
            const inDept = course.department.toLowerCase().includes(cat.match);
            return inTitle || inDept;
          }
          return matchesCourseSubject(course, fId);
        });
        if (!matchesField) return false;
      }

      // 5. Study Mode
      if (selectedModes.length > 0) {
        const matchesMode = selectedModes.some((m) => matchesStitchStudyMode(course, m));
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

      // 8. Budget / Fee Range Slider (treat maxFee === STITCH_MAX_BUDGET as uncapped upper bound)
      if (course.annualFeeUSD < minFee) {
        return false;
      }
      if (maxFee < STITCH_MAX_BUDGET && course.annualFeeUSD > maxFee) {
        return false;
      }

      // 9. IELTS Score (checkbox tiers + dual range slider)
      const req = course.ieltsRequirement || 6.0;
      if (selectedIelts.length > 0) {
        const matchesIelts = selectedIelts.some((tier) => {
          if (tier === '5.5') return req <= 5.5;
          if (tier === '6.0') return req === 6.0;
          if (tier === '6.5') return req === 6.5;
          if (tier === '7.0') return req >= 7.0;
          if (tier === 'waiver')
            return (
              req <= 5.5 ||
              course.country === 'Malaysia' ||
              course.country === 'Cyprus' ||
              course.country === 'India'
            );
          return false;
        });
        if (!matchesIelts) return false;
      }
      if (ieltsMin > STITCH_IELTS_MIN || ieltsMax < STITCH_IELTS_MAX) {
        if (req < ieltsMin || req > ieltsMax) return false;
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
        const durMonths =
          course.durationMonths ||
          (typeof course.durationYears === 'number'
            ? course.durationYears * 12
            : parseFloat(String(course.durationYears))
            ? parseFloat(String(course.durationYears)) * 12
            : 36);
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
          if (typeKey === 'research')
            return t.includes('research') || t.includes('uas') || t.includes('technology');
          return false;
        });
        if (!matchesType) return false;
      }

      // 13. Scholarship & Fee Waiver
      if (scholarshipOnly) {
        if (!course.scholarshipCoveragePct || course.scholarshipCoveragePct <= 0) {
          return false;
        }
      }
      if (feeWaiverOnly) {
        if (!matchesApplicationFeeWaiver(course)) {
          return false;
        }
      }

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'popularity') {
        const popA = (a.qsRank2027 ? 1 : 0) + (a.scholarshipCoveragePct ? 1 : 0);
        const popB = (b.qsRank2027 ? 1 : 0) + (b.scholarshipCoveragePct ? 1 : 0);
        return popB - popA;
      }
      if (sortBy === 'ielts-asc') {
        return (a.ieltsRequirement || 6.0) - (b.ieltsRequirement || 6.0);
      }
      if (sortBy === 'ielts-desc') {
        return (b.ieltsRequirement || 6.0) - (a.ieltsRequirement || 6.0);
      }
      if (sortBy === 'az') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'za') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'intake-next') {
        const scoreA = getNextIntakeScore(a.intakes);
        const scoreB = getNextIntakeScore(b.intakes);
        return scoreA - scoreB;
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
    selectedCities,
    selectedInstitutions,
    selectedLevels,
    selectedFields,
    selectedModes,
    selectedRankTiers,
    selectedTuitions,
    selectedIelts,
    ieltsMin,
    ieltsMax,
    selectedDurations,
    selectedTypes,
    selectedIntakes,
    scholarshipOnly,
    feeWaiverOnly,
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

  // Effective courses based on display mode (normal filter vs wishlist filter)
  const effectiveCourses = useMemo(() => {
    if (displayMode === 'wishlist') {
      return allCourses.filter((c) => isInWishlist(c.id));
    }
    return filteredCourses;
  }, [displayMode, allCourses, filteredCourses, wishlist, isInWishlist]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(effectiveCourses.length / ITEMS_PER_PAGE));
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return effectiveCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [effectiveCourses, currentPage]);

  const startIndex = effectiveCourses.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, effectiveCourses.length);

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

  // Comparison toggle handler (max 4 programmes — opens global bottom comparison dock)
  const toggleCompare = (courseId: string) => {
    toggleCompareCourse(courseId);
  };

  return (
    <ExplorerPageShell>
      {/* 1. Shared Explorer Hero Banner & Full-Width Search Theme */}
      <ExplorerHeroBanner
        dataPurpose="courses-hero-banner"
        onNavigateHome={onNavigateHome}
        breadcrumbs={
          displayMode === 'wishlist'
            ? [
                {
                  label: 'Courses',
                  onClick: () => {
                    setDisplayMode('grid');
                    setCurrentPage(1);
                  },
                },
                { label: 'Wishlist' },
              ]
            : [{ label: 'Courses' }]
        }
        titleHighlight="Course"
        subtitle={`Browse ${allCourses.length}+ degree programs across ${allUnis.length}+ partner universities worldwide`}
        search={{
          value: searchQuery,
          onChange: (val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          },
          onSubmit: () => setCurrentPage(1),
          placeholder: 'Search courses, universities or destinations',
        }}
      />

      <SectionHeader
        title={displayMode === 'wishlist' ? 'Saved Degree Courses' : 'Degree Courses Directory'}
        subtitle="Filter degree programs by study level, field of study, destination country, tuition fee, and IELTS score."
        countLabel={`(${(displayMode === 'wishlist' ? effectiveCourses.length : filteredCourses.length).toLocaleString()})`}
      />

      {/* Directory Controls & Results */}
      <div className="space-y-3 sm:space-y-6">
        <div className="space-y-3">
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
                {activeFiltersCount > 0 && (
                  <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-[#FFCC00] text-slate-950 text-[10px] font-bold inline-flex items-center justify-center tabular-nums">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-xs font-normal text-slate-400 dark:text-slate-400">
                  {displayMode === 'wishlist' ? 'Saved Courses:' : 'Total Courses:'}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                  {(displayMode === 'wishlist' ? effectiveCourses.length : filteredCourses.length).toLocaleString()}
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
                      key={chip.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-[11.5px] max-w-[200px]"
                    >
                      <span className="text-slate-400 font-normal shrink-0">
                        {chip.category}:
                      </span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium truncate">
                        {chip.value}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${chip.category} ${chip.value}`}
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
                    {currentPage}
                  </strong>{' '}
                  / <span className="tabular-nums">{totalPages}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
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
                    disabled={currentPage === totalPages}
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

              {/* Compact Icon-Only Segmented Pill Switcher: Cards, List, Map, Wishlist */}
              <div className="inline-flex items-center p-0.5 rounded-full bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shrink-0 gap-0.5">
                <button
                  type="button"
                  title="Cards view"
                  aria-label="Cards view"
                  aria-pressed={displayMode === 'grid'}
                  onClick={() => setDisplayMode('grid')}
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
                  onClick={() => setDisplayMode('list')}
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
                    setIsMapExpanded(true);
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
                  title="Saved wishlist"
                  aria-label="Saved wishlist"
                  aria-pressed={displayMode === 'wishlist'}
                  onClick={() =>
                    setDisplayMode(displayMode === 'wishlist' ? 'grid' : 'wishlist')
                  }
                  className={`no-min-touch h-7 rounded-full inline-flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                    wishlist.length > 0 ? 'px-2' : 'w-7'
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
                  {wishlist.length > 0 && (
                    <span
                      className={`text-[10.5px] font-semibold tabular-nums leading-none ${
                        displayMode === 'wishlist'
                          ? 'text-[#FFCC00]'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Uniform Minimalistic Sort Dropdown */}
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
                  aria-label="Sort courses"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full h-[34px] pl-8 pr-7.5 rounded-xl bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer truncate"
                >
                  <option value="qs">QS Ranking</option>
                  <option value="popularity">Popularity</option>
                  <option value="fee-asc">Fee (Low)</option>
                  <option value="fee-desc">Fee (High)</option>
                  <option value="az">Name A–Z</option>
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
            </div>
          </div>
        </div>

        {/* Main Grid: Left Filter Sidebar + Right Cards Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-8 items-start">
          {/* DESKTOP FILTER SIDEBAR (Approved Google Stitch Implementation) */}
          <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">
            <StitchCourseFilterSidebar
              allCourses={allCourses}
              allUnis={allUnis}
              totalResults={filteredCourses.length}
              selectedCountries={selectedCountries}
              selectedCities={selectedCities}
              selectedInstitutions={selectedInstitutions}
              selectedLevels={selectedLevels}
              selectedFields={selectedFields}
              selectedIelts={selectedIelts}
              ieltsMin={ieltsMin}
              ieltsMax={ieltsMax}
              selectedModes={selectedModes}
              selectedIntakes={selectedIntakes}
              selectedDurations={selectedDurations}
              minFee={minFee}
              maxFee={maxFee}
              selectedTypes={selectedTypes}
              selectedRankTiers={selectedRankTiers}
              scholarshipOnly={scholarshipOnly}
              feeWaiverOnly={feeWaiverOnly}
              onToggleCountry={toggleCountry}
              onClearCountries={() => {
                setSelectedCountries([]);
                setCurrentPage(1);
              }}
              onToggleCity={toggleCity}
              onClearCities={() => {
                setSelectedCities([]);
                setCurrentPage(1);
              }}
              onToggleInstitution={toggleInstitution}
              onClearInstitutions={() => {
                setSelectedInstitutions([]);
                setCurrentPage(1);
              }}
              onToggleLevel={toggleLevel}
              onSelectAllLevels={() => {
                setSelectedLevels([...SPECIFIC_QUALIFICATIONS]);
                setCurrentPage(1);
              }}
              onClearLevels={() => {
                setSelectedLevels([]);
                setCurrentPage(1);
              }}
              onToggleField={toggleField}
              onClearFields={() => {
                setSelectedFields([]);
                setCurrentPage(1);
              }}
              onToggleIelts={toggleIelts}
              onChangeIeltsRange={(minV, maxV) => {
                setIeltsMin(minV);
                setIeltsMax(maxV);
                setCurrentPage(1);
              }}
              onResetIelts={() => {
                setSelectedIelts([]);
                setIeltsMin(STITCH_IELTS_MIN);
                setIeltsMax(STITCH_IELTS_MAX);
                setCurrentPage(1);
              }}
              onToggleMode={toggleMode}
              onToggleIntake={toggleIntake}
              onToggleDuration={toggleDuration}
              onChangeFeeRange={(minV, maxV) => {
                setMinFee(minV);
                setMaxFee(maxV);
                setCurrentPage(1);
              }}
              onResetFeeRange={() => {
                setMinFee(0);
                setMaxFee(STITCH_MAX_BUDGET);
                setCurrentPage(1);
              }}
              onToggleType={toggleType}
              onClearTypes={() => {
                setSelectedTypes([]);
                setCurrentPage(1);
              }}
              onToggleRankTier={toggleRankTier}
              onToggleScholarship={() => {
                setScholarshipOnly((prev) => !prev);
                setCurrentPage(1);
              }}
              onToggleFeeWaiver={() => {
                setFeeWaiverOnly((prev) => !prev);
                setCurrentPage(1);
              }}
              onResetAll={resetAllFilters}
              onApplyFilters={() => {
                setCurrentPage(1);
                window.scrollTo({ top: 260, behavior: "smooth" });
              }}
            />
          </aside>

          {/* RIGHT CONTENT AREA: Grid & Pagination */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-6">

            {/* INTERACTIVE GLOBAL PARTNER UNIVERSITY MAP */}
            {displayMode === 'map' && (
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

            {/* Courses Listing - List or Grid View */}
            {effectiveCourses.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                  {displayMode === 'wishlist' ? 'bookmark_border' : 'menu_book'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {displayMode === 'wishlist' ? 'Your Wishlist is Empty' : 'No degree programs found'}
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  {displayMode === 'wishlist'
                    ? 'You have not added any degree courses to your wishlist yet. Tap the bookmark icon on any course card or list item to save it here.'
                    : 'No courses found matching your active filter criteria. Try searching with another term or reset your filters.'}
                </p>
                {displayMode === 'wishlist' ? (
                  <button
                    type="button"
                    onClick={() => setDisplayMode('grid')}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                    <span>Browse All Programmes</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                {displayMode === 'list' ? (
                  <div className="space-y-4">
                    {paginatedCourses.map((course) => {
                      const uniSlug = getUniSlug(course.universityId);
                      const bannerUrl = getUniBanner(course.universityId);
                      const isCompared = comparedCourseIds.includes(course.id);
                      const isSaved = isInWishlist(course.id);
                      const isBouncing = bouncingCourseId === course.id;

                      return (
                        <article
                          key={`list-${course.id}`}
                          className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-stretch group ${
                            isCompared
                              ? 'border-[#fbb034] ring-2 ring-[#fbb034]/40 bg-amber-50/10'
                              : 'border-slate-200/90 dark:border-slate-800'
                          }`}
                        >
                          {/* Banner / Image Thumbnail */}
                          <div className="relative w-full md:w-64 lg:w-72 h-44 md:h-auto shrink-0 overflow-hidden bg-slate-900">
                            <img
                              src={bannerUrl}
                              alt={course.universityName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/85 via-slate-950/30 to-transparent"></div>

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-extrabold shadow-md flex items-center gap-1">
                                <span>{course.flagEmoji}</span>
                                <span>{course.country}</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                {course.qsRank2027 ? (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs flex items-center gap-1">
                                    <span>QS:</span>
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

                            {/* University Name Over Image */}
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <span className="text-[10px] uppercase font-bold text-amber-300">
                                {course.city}{course.state ? `, ${course.state}` : ''}
                              </span>
                              <h4
                                onClick={() => {
                                  if (onNavigateToUni && uniSlug) {
                                    onNavigateToUni(uniSlug);
                                  }
                                }}
                                className="text-xs sm:text-sm font-bold line-clamp-1 hover:text-amber-300 cursor-pointer transition-colors"
                              >
                                {course.universityName}
                              </h4>
                            </div>
                          </div>

                          {/* Center Details */}
                          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                            <div className="space-y-1.5">
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

                              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                {course.title}
                              </h3>
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {course.department}
                              </p>
                            </div>

                            {/* Program Spec Chips */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                                <span>{course.durationYears || `${Math.round(course.durationMonths / 12)} Yrs`}</span>
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-slate-400">event</span>
                                <span>Intakes: {course.intakes.slice(0, 3).join(', ')}</span>
                              </span>
                              {course.ieltsRequirement && (
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px] text-slate-400">translate</span>
                                  <span>IELTS {course.ieltsRequirement}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right Side: Fee & Actions */}
                          <div className="w-full md:w-[296px] lg:w-[312px] p-4 sm:p-5 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between shrink-0 space-y-4">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                ANNUAL TUITION FEE
                              </span>
                              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                {formatPriceString(course.tuitionFeeLocal, course.annualFeeUSD)}
                              </div>
                            </div>

                            <div className="space-y-3.5">
                              {/* Clean Inline Utility Actions: Shortlist & Compare */}
                              <div className="flex items-center justify-end gap-5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(course);
                                  }}
                                  aria-label={isSaved ? 'Remove from shortlist' : 'Add to shortlist'}
                                  title={isSaved ? 'Shortlisted' : 'Shortlist'}
                                  className={`no-min-touch inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                                    isSaved
                                      ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                                  }`}
                                >
                                  <svg
                                    className="w-[17px] h-[17px] shrink-0"
                                    viewBox="0 0 24 24"
                                    fill={isSaved ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                  </svg>
                                  <span>{isSaved ? 'Shortlisted' : 'Shortlist'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleCompare(course.id)}
                                  title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                                  className={`no-min-touch inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                                    isCompared
                                      ? 'text-amber-600 dark:text-[#fbb034] font-semibold'
                                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                                  }`}
                                >
                                  <svg
                                    className="w-[17px] h-[17px] shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <rect x="4" y="7" width="13" height="13" rx="2" />
                                    <path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                    {isCompared ? (
                                      <path d="M8 13.5l2 2 3.5-3.5" />
                                    ) : (
                                      <>
                                        <path d="M10.5 10.5v6" />
                                        <path d="M7.5 13.5h6" />
                                      </>
                                    )}
                                  </svg>
                                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                                </button>
                              </div>

                              {/* Clean Equal-Width Rectangular CTAs: View Programme & View University */}
                              <div className="grid grid-cols-2 gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedProgramme(course)}
                                  className="w-full h-10 px-2.5 rounded-lg bg-[#FFCC00] hover:bg-[#f2c200] active:scale-[0.98] text-slate-950 font-semibold text-[12.5px] sm:text-[13px] tracking-[-0.01em] transition-all cursor-pointer flex items-center justify-center whitespace-nowrap"
                                >
                                  View Programme
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onNavigateToUni && uniSlug) {
                                      onNavigateToUni(uniSlug);
                                    } else {
                                      onApply(`${course.title} at ${course.universityName}`);
                                    }
                                  }}
                                  className="w-full h-10 px-2.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] border border-slate-800 dark:border-slate-300 text-slate-900 dark:text-white font-semibold text-[12.5px] sm:text-[13px] tracking-[-0.01em] transition-all cursor-pointer flex items-center justify-center whitespace-nowrap"
                                >
                                  View University
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
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

                            {/* Tuition Fee Breakdown - Matching Screenshot */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                ANNUAL TUITION FEE
                              </span>
                              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                                {formatPriceString(course.tuitionFeeLocal, course.annualFeeUSD)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Row - Matching clean list-view design */}
                        <div className="p-5 pt-0 space-y-3.5">
                          {/* Clean Inline Utility Actions: Shortlist & Compare */}
                          <div className="flex items-center justify-end gap-5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(course);
                              }}
                              aria-label={isSaved ? 'Remove from shortlist' : 'Add to shortlist'}
                              title={isSaved ? 'Shortlisted' : 'Shortlist'}
                              className={`no-min-touch inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                                isSaved
                                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                              }`}
                            >
                              <svg
                                className="w-[17px] h-[17px] shrink-0"
                                viewBox="0 0 24 24"
                                fill={isSaved ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                              </svg>
                              <span>{isSaved ? 'Shortlisted' : 'Shortlist'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleCompare(course.id)}
                              title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                              className={`no-min-touch inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                                isCompared
                                  ? 'text-amber-600 dark:text-[#fbb034] font-semibold'
                                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
                              }`}
                            >
                              <svg
                                className="w-[17px] h-[17px] shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <rect x="4" y="7" width="13" height="13" rx="2" />
                                <path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                {isCompared ? (
                                  <path d="M8 13.5l2 2 3.5-3.5" />
                                ) : (
                                  <>
                                    <path d="M10.5 10.5v6" />
                                    <path d="M7.5 13.5h6" />
                                  </>
                                )}
                              </svg>
                              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                            </button>
                          </div>

                          {/* Clean Equal-Width Rectangular CTAs: View Programme & View University */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setSelectedProgramme(course)}
                              className="w-full h-10 px-2 rounded-lg bg-[#FFCC00] hover:bg-[#f2c200] active:scale-[0.98] text-slate-950 font-semibold text-[12px] sm:text-[12.5px] tracking-[-0.01em] transition-all cursor-pointer flex items-center justify-center whitespace-nowrap"
                            >
                              View Programme
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (onNavigateToUni && uniSlug) {
                                  onNavigateToUni(uniSlug);
                                } else {
                                  onApply(`${course.title} at ${course.universityName}`);
                                }
                              }}
                              className="w-full h-10 px-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] border border-slate-800 dark:border-slate-300 text-slate-900 dark:text-white font-semibold text-[12px] sm:text-[12.5px] tracking-[-0.01em] transition-all cursor-pointer flex items-center justify-center whitespace-nowrap"
                            >
                              View University
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

                {/* Numbered Pagination Bar (shadcn disabled-state pattern, themed to match explorer cards) */}
                {effectiveCourses.length > ITEMS_PER_PAGE && (
                  <div className="mt-8 space-y-3 text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block tabular-nums">
                      Showing <strong className="text-slate-900 dark:text-white font-semibold">{startIndex}–{endIndex}</strong> of{' '}
                      <strong className="text-slate-900 dark:text-white font-semibold">{effectiveCourses.length}</strong> programmes
                    </span>
                    <Pagination
                      aria-label="Course Directory Pagination"
                      className="w-fit max-w-full rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
                    >
                      <PaginationContent>
                        {/* Previous Button — faded and removed from tab order when on page 1 */}
                        <PaginationItem>
                          <PaginationPrevious
                            aria-disabled={currentPage === 1}
                            disabled={currentPage === 1}
                            tabIndex={currentPage === 1 ? -1 : undefined}
                            onClick={() => {
                              setCurrentPage((p) => Math.max(1, p - 1));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          />
                        </PaginationItem>

                        {/* Dynamic Page Numbers & Ellipsis */}
                        {getPaginationPages().map((pageItem, idx) => {
                          if (pageItem === '...') {
                            return (
                              <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          const pageNum = Number(pageItem);
                          const isActive = currentPage === pageNum;

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

                        {/* Next Button — faded and removed from tab order when on last page */}
                        <PaginationItem>
                          <PaginationNext
                            aria-disabled={currentPage === totalPages}
                            disabled={currentPage === totalPages}
                            tabIndex={currentPage === totalPages ? -1 : undefined}
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
              </>
            )}
          </div>
        </div>
      </div>

        {/* MOBILE FILTER MODAL DRAWER (Approved Google Stitch Implementation) */}
        {isMobileFilterOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsMobileFilterOpen(false);
            }}
          >
            <div className="w-full sm:max-w-[420px]">
              <StitchCourseFilterSidebar
                allCourses={allCourses}
                allUnis={allUnis}
                totalResults={filteredCourses.length}
                selectedCountries={selectedCountries}
                selectedCities={selectedCities}
                selectedInstitutions={selectedInstitutions}
                selectedLevels={selectedLevels}
                selectedFields={selectedFields}
                selectedIelts={selectedIelts}
                ieltsMin={ieltsMin}
                ieltsMax={ieltsMax}
                selectedModes={selectedModes}
                selectedIntakes={selectedIntakes}
                selectedDurations={selectedDurations}
                minFee={minFee}
                maxFee={maxFee}
                selectedTypes={selectedTypes}
                selectedRankTiers={selectedRankTiers}
                scholarshipOnly={scholarshipOnly}
                feeWaiverOnly={feeWaiverOnly}
                onToggleCountry={toggleCountry}
                onClearCountries={() => {
                  setSelectedCountries([]);
                  setCurrentPage(1);
                }}
                onToggleCity={toggleCity}
                onClearCities={() => {
                  setSelectedCities([]);
                  setCurrentPage(1);
                }}
                onToggleInstitution={toggleInstitution}
                onClearInstitutions={() => {
                  setSelectedInstitutions([]);
                  setCurrentPage(1);
                }}
                onToggleLevel={toggleLevel}
                onSelectAllLevels={() => {
                  setSelectedLevels([...SPECIFIC_QUALIFICATIONS]);
                  setCurrentPage(1);
                }}
                onClearLevels={() => {
                  setSelectedLevels([]);
                  setCurrentPage(1);
                }}
                onToggleField={toggleField}
                onClearFields={() => {
                  setSelectedFields([]);
                  setCurrentPage(1);
                }}
                onToggleIelts={toggleIelts}
                onChangeIeltsRange={(minV, maxV) => {
                  setIeltsMin(minV);
                  setIeltsMax(maxV);
                  setCurrentPage(1);
                }}
                onResetIelts={() => {
                  setSelectedIelts([]);
                  setIeltsMin(STITCH_IELTS_MIN);
                  setIeltsMax(STITCH_IELTS_MAX);
                  setCurrentPage(1);
                }}
                onToggleMode={toggleMode}
                onToggleIntake={toggleIntake}
                onToggleDuration={toggleDuration}
                onChangeFeeRange={(minV, maxV) => {
                  setMinFee(minV);
                  setMaxFee(maxV);
                  setCurrentPage(1);
                }}
                onResetFeeRange={() => {
                  setMinFee(0);
                  setMaxFee(STITCH_MAX_BUDGET);
                  setCurrentPage(1);
                }}
                onToggleType={toggleType}
                onClearTypes={() => {
                  setSelectedTypes([]);
                  setCurrentPage(1);
                }}
                onToggleRankTier={toggleRankTier}
                onToggleScholarship={() => {
                  setScholarshipOnly((prev) => !prev);
                  setCurrentPage(1);
                }}
                onToggleFeeWaiver={() => {
                  setFeeWaiverOnly((prev) => !prev);
                  setCurrentPage(1);
                }}
                onResetAll={resetAllFilters}
                onApplyFilters={() => {
                  setCurrentPage(1);
                }}
                isMobile
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

      {/* Programme Overview Modal (Opened via View Programme) */}
      {selectedProgramme && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/65 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
          onClick={() => setSelectedProgramme(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-xl bg-white dark:bg-[#0F172A] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[88vh] flex flex-col"
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10.5px] font-bold uppercase">
                    {selectedProgramme.level}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedProgramme.flagEmoji} {selectedProgramme.universityName}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedProgramme.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgramme(null)}
                aria-label="Close programme details"
                className="no-min-touch w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Annual Tuition
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                    {formatPriceString(selectedProgramme.tuitionFeeLocal, selectedProgramme.annualFeeUSD)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Duration
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {selectedProgramme.durationYears || `${Math.round(selectedProgramme.durationMonths / 12)} Yrs`}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Intakes
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedProgramme.intakes.join(', ')}
                  </span>
                </div>
              </div>

              {selectedProgramme.overview && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Programme Overview
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedProgramme.overview}
                  </p>
                </div>
              )}

              {selectedProgramme.entryRequirements && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Entry Requirements
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedProgramme.entryRequirements}
                  </p>
                </div>
              )}

              {selectedProgramme.careerProspects?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Career Prospects
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgramme.careerProspects.map((role) => (
                      <span
                        key={role}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const info = `${selectedProgramme.title} at ${selectedProgramme.universityName}`;
                  setSelectedProgramme(null);
                  onApply(info);
                }}
                className="w-full h-10 px-3 rounded-lg bg-[#FFCC00] hover:bg-[#f2c200] text-slate-950 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Apply Now
              </button>
              <button
                type="button"
                onClick={() => {
                  const slug = getUniSlug(selectedProgramme.universityId);
                  setSelectedProgramme(null);
                  if (onNavigateToUni && slug) {
                    onNavigateToUni(slug);
                  }
                }}
                className="w-full h-10 px-3 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-800 dark:border-slate-300 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                View University
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temporary Feedback Toast for Saved Courses */}
      <WishlistToast onNavigateToWishlist={onNavigateToWishlist} />
    </ExplorerPageShell>
  );
};

export default CourseExplorerView;
