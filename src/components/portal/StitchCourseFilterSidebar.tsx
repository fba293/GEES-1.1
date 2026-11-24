/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Approved Google Stitch Course Filter Sidebar
 * Exact faithful implementation of the approved Google Stitch design connected to live GEES data.
 */

import React, { useMemo, useState } from 'react';
import { Course, University } from '../../types/index.ts';
import {
  APPROVED_COUNTRY_NAMES,
  COUNTRY_METADATA_REGISTRY,
} from '../../lib/country-config.ts';
import {
  SPECIFIC_QUALIFICATIONS,
  matchesCourseQualification,
  matchesUniversityQualification,
} from '../../lib/qualification-config.ts';
import {
  IDP_SUBJECT_CATEGORIES,
  matchesCourseSubject,
} from '../../lib/subject-config.ts';
import { GooeyIeltsSlider } from './GooeyIeltsSlider.tsx';

export const STITCH_MAX_BUDGET = 150000;
export const STITCH_IELTS_MIN = 3.5;
export const STITCH_IELTS_MAX = 9.0;

export const STITCH_STUDY_MODES = [
  'Off Campus',
  'On Campus',
  'On Campus With Online Start',
  'Online',
  'Overseas Campus',
] as const;

export const STITCH_INTAKE_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const STITCH_DURATIONS = [
  { value: 'Less than 1 year', shortLabel: '< 1 yr', label: 'Less than 1 year' },
  { value: '1 - 2 years', shortLabel: '1-2 yrs', label: '1 - 2 years' },
  { value: '2 - 3 years', shortLabel: '2-3 yrs', label: '2 - 3 years' },
  { value: '3 - 4 years', shortLabel: '3-4 yrs', label: '3 - 4 years' },
  { value: '4 - 5 years', shortLabel: '4-5 yrs', label: '4 - 5 years' },
  { value: 'More than 5 years', shortLabel: '5+ yrs', label: 'More than 5 years' },
] as const;

export const STITCH_IELTS_OPTIONS = [
  { value: '7.0', badgeLabel: '7.0 - 9.0', label: 'IELTS 7.0 - 9.0', fullWidth: false },
  { value: '6.5', badgeLabel: '6.5', label: 'IELTS 6.5', fullWidth: false },
  { value: '6.0', badgeLabel: '6.0', label: 'IELTS 6.0', fullWidth: false },
  { value: '5.5', badgeLabel: '5.5', label: 'IELTS 5.5', fullWidth: false },
  { value: 'waiver', badgeLabel: 'Waiver', label: 'English waiver', fullWidth: true },
] as const;

const OVERSEAS_BRANCH_KEYWORDS = [
  'monash university malaysia',
  'heriot-watt university malaysia',
  'nottingham',
  'southampton',
  'reading',
  'xiamen university malaysia',
  'curtin',
  'swinburne',
  'uow malaysia',
  'newcastle',
  'um-wales',
  'overseas',
  'branch',
];

/**
 * Shared study-mode matcher between sidebar counts and CourseExplorerView filtering.
 */
export function matchesStitchStudyMode(course: Course, modeLabel: string): boolean {
  const m = (course.studyMode || '').toLowerCase();
  const uni = (course.universityName || '').toLowerCase();
  const campus = (course.campusName || '').toLowerCase();
  const normalized = modeLabel.toLowerCase();

  if (normalized === 'on campus' || normalized === 'full-time') {
    return m.includes('full-time') || m === '' || (!m.includes('online') && !m.includes('part-time'));
  }
  if (normalized === 'online') {
    return m.includes('online');
  }
  if (normalized === 'on campus with online start') {
    return m.includes('hybrid') || m.includes('part-time') || m.includes('online');
  }
  if (normalized === 'off campus' || normalized === 'part-time') {
    return m.includes('part-time') || m.includes('online') || m.includes('distance');
  }
  if (normalized === 'overseas campus') {
    return (
      OVERSEAS_BRANCH_KEYWORDS.some((kw) => uni.includes(kw) || campus.includes(kw)) ||
      campus.includes('international')
    );
  }
  return false;
}

/**
 * Shared application fee waiver matcher between sidebar counts and CourseExplorerView filtering.
 */
export function matchesApplicationFeeWaiver(course: Course): boolean {
  const c = (course.country || '').toLowerCase();
  const hasPartnerWaiverCountry =
    c === 'united kingdom' ||
    c === 'malaysia' ||
    c === 'cyprus' ||
    c === 'malta' ||
    c === 'india' ||
    c === 'hungary';
  return hasPartnerWaiverCountry || Boolean(course.scholarshipCoveragePct && course.scholarshipCoveragePct >= 20);
}

/**
 * Shared helper for displaying canonical country names matching the Stitch UI.
 */
export function getCountryDisplayName(country: string): string {
  return country === 'USA' ? 'United States' : country;
}

/**
 * Shared course duration bucket matcher.
 */
export function matchesCourseDuration(course: Course, durationLabel: string): boolean {
  const durMonths =
    course.durationMonths ||
    (typeof course.durationYears === 'number'
      ? course.durationYears * 12
      : parseFloat(String(course.durationYears))
      ? parseFloat(String(course.durationYears)) * 12
      : 36);

  if (durationLabel === 'Less than 1 year') return durMonths < 12;
  if (durationLabel === '1 - 2 years') return durMonths >= 12 && durMonths <= 24;
  if (durationLabel === '2 - 3 years') return durMonths >= 24 && durMonths <= 36;
  if (durationLabel === '3 - 4 years') return durMonths >= 36 && durMonths <= 48;
  if (durationLabel === '4 - 5 years') return durMonths >= 48 && durMonths <= 60;
  if (durationLabel === 'More than 5 years') return durMonths > 60;
  return false;
}

/**
 * Indexes courses by university ID and normalized university name for O(1) lookups.
 */
export function buildCoursesByUniversityMap(allCourses: Course[]): Map<string, Course[]> {
  const map = new Map<string, Course[]>();
  allCourses.forEach((course) => {
    if (course.universityId) {
      const idKey = `id:${course.universityId}`;
      const existing = map.get(idKey);
      if (existing) existing.push(course);
      else map.set(idKey, [course]);
    }
    if (course.universityName) {
      const nameKey = `name:${course.universityName.trim().toLowerCase()}`;
      const existing = map.get(nameKey);
      if (existing) existing.push(course);
      else map.set(nameKey, [course]);
    }
  });
  return map;
}

export function getCoursesForUniversity(
  uni: University,
  coursesMap: Map<string, Course[]>
): Course[] {
  const byId = coursesMap.get(`id:${uni.id}`) || [];
  const byName = coursesMap.get(`name:${(uni.name || '').trim().toLowerCase()}`) || [];
  if (byId.length === 0) return byName;
  if (byName.length === 0) return byId;
  const seen = new Set<string>();
  const merged: Course[] = [];
  for (const c of [...byId, ...byName]) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      merged.push(c);
    }
  }
  return merged;
}

/**
 * Shared university qualification/study-level matcher.
 */
export function matchesUniversityLevel(
  uni: University,
  uniCourses: Course[],
  level: string
): boolean {
  if (matchesUniversityQualification(uni, level)) return true;
  return uniCourses.some((c) => matchesCourseQualification(c, level));
}

/**
 * Shared university course-subject matcher using linked courses + university popularPrograms/description.
 */
export function matchesUniversitySubject(
  uni: University,
  uniCourses: Course[],
  subjectName: string
): boolean {
  if (uniCourses.some((c) => matchesCourseSubject(c, subjectName))) {
    return true;
  }
  // Evaluate university metadata (popularPrograms, tagline, description) through the same IDP matcher
  const syntheticCourse = {
    id: `uni-meta-${uni.id}`,
    title: (uni.popularPrograms || []).join(' '),
    department: `${uni.tagline || ''} ${(uni.popularPrograms || []).join(' ')}`,
    overview: `${uni.description || ''} ${uni.name || ''}`,
  } as Course;
  return matchesCourseSubject(syntheticCourse, subjectName);
}

/**
 * Shared university study-mode matcher.
 */
export function matchesUniversityStudyMode(
  uni: University,
  uniCourses: Course[],
  modeLabel: string
): boolean {
  if (uniCourses.length > 0) {
    return uniCourses.some((c) => matchesStitchStudyMode(c, modeLabel));
  }
  const normalized = modeLabel.toLowerCase();
  const uniName = (uni.name || '').toLowerCase();
  const campusText = (uni.campuses || [])
    .map((cp) => `${cp.name || ''} ${cp.city || ''} ${cp.country || ''}`)
    .join(' ')
    .toLowerCase();
  const combined = `${uniName} ${(uni.tagline || '').toLowerCase()} ${(uni.description || '').toLowerCase()} ${campusText}`;

  if (normalized === 'on campus' || normalized === 'full-time') {
    return !uniName.includes('online only');
  }
  if (normalized === 'overseas campus') {
    return (
      OVERSEAS_BRANCH_KEYWORDS.some((kw) => uniName.includes(kw) || campusText.includes(kw)) ||
      campusText.includes('international')
    );
  }
  if (normalized === 'online') {
    return (
      combined.includes('online') ||
      combined.includes('distance') ||
      combined.includes('asia e university') ||
      combined.includes('suol')
    );
  }
  if (normalized === 'on campus with online start') {
    return (
      combined.includes('hybrid') ||
      combined.includes('online') ||
      combined.includes('flexible') ||
      combined.includes('blended')
    );
  }
  if (normalized === 'off campus' || normalized === 'part-time') {
    return (
      combined.includes('part-time') ||
      combined.includes('online') ||
      combined.includes('distance') ||
      combined.includes('open')
    );
  }
  return false;
}

/**
 * Shared university program-duration matcher.
 */
export function matchesUniversityDuration(
  uni: University,
  uniCourses: Course[],
  durationLabel: string
): boolean {
  if (uniCourses.length > 0) {
    return uniCourses.some((c) => matchesCourseDuration(c, durationLabel));
  }
  const combined = `${(uni.popularPrograms || []).join(' ')} ${uni.type || ''} ${uni.description || ''}`.toLowerCase();
  if (durationLabel === 'Less than 1 year') {
    return (
      combined.includes('foundation') ||
      combined.includes('certificate') ||
      combined.includes('pathway') ||
      combined.includes('english')
    );
  }
  if (durationLabel === '1 - 2 years') {
    return (
      combined.includes('master') ||
      combined.includes('mba') ||
      combined.includes('postgraduate') ||
      combined.includes('diploma') ||
      combined.includes('university')
    );
  }
  if (durationLabel === '2 - 3 years') {
    return (
      combined.includes('bachelor') ||
      combined.includes('diploma') ||
      combined.includes('university') ||
      combined.includes('college')
    );
  }
  if (durationLabel === '3 - 4 years') {
    return (
      combined.includes('bachelor') ||
      combined.includes('undergraduate') ||
      combined.includes('university')
    );
  }
  if (durationLabel === '4 - 5 years') {
    return (
      combined.includes('engineering') ||
      combined.includes('architecture') ||
      combined.includes('medicine') ||
      combined.includes('pharmacy') ||
      combined.includes('phd') ||
      combined.includes('research')
    );
  }
  if (durationLabel === 'More than 5 years') {
    return (
      combined.includes('medicine') ||
      combined.includes('mbbs') ||
      combined.includes('surgery') ||
      combined.includes('dentistry') ||
      combined.includes('veterinary') ||
      combined.includes('phd')
    );
  }
  return false;
}

/**
 * Shared university IELTS tier matcher.
 */
export function matchesUniversityIeltsTier(uni: University, tier: string): boolean {
  const score = uni.minIeltsScore || 6.0;
  const rank = Number(uni.qsRank2027);
  const t = (uni.type || '').toLowerCase();
  if (tier === '5.5') return score <= 5.5;
  if (tier === '6.0') return score <= 6.0;
  if (tier === '6.5') return score <= 6.5;
  if (tier === '7.0') return score >= 7.0 || (rank > 0 && rank <= 150);
  if (tier === 'waiver') {
    return (
      uni.country === 'Malaysia' ||
      uni.country === 'Cyprus' ||
      uni.country === 'India' ||
      t.includes('college') ||
      score <= 5.5
    );
  }
  return false;
}

/**
 * Shared university application fee waiver matcher.
 */
export function matchesUniversityFeeWaiver(uni: University): boolean {
  const c = (uni.country || '').toLowerCase();
  const hasPartnerWaiverCountry =
    c === 'united kingdom' ||
    c === 'malaysia' ||
    c === 'cyprus' ||
    c === 'malta' ||
    c === 'india' ||
    c === 'hungary';
  return hasPartnerWaiverCountry || Boolean(uni.scholarshipsAvailable);
}

export interface StitchCourseFilterSidebarProps {
  mode?: 'courses' | 'universities';
  allCourses: Course[];
  allUnis: University[];
  totalResults: number;

  // Selected filter states
  selectedCountries: string[];
  selectedCities: string[];
  selectedInstitutions: string[];
  selectedLevels: string[];
  selectedFields: string[];
  selectedIelts: string[];
  ieltsMin: number;
  ieltsMax: number;
  selectedModes: string[];
  selectedIntakes: string[];
  selectedDurations: string[];
  minFee: number;
  maxFee: number;
  selectedTypes: string[];
  selectedRankTiers: string[];
  scholarshipOnly: boolean;
  feeWaiverOnly: boolean;

  // Callbacks
  onToggleCountry: (country: string) => void;
  onClearCountries: () => void;
  onToggleCity: (city: string) => void;
  onClearCities: () => void;
  onToggleInstitution: (institution: string) => void;
  onClearInstitutions: () => void;
  onToggleLevel: (level: string) => void;
  onSelectAllLevels: () => void;
  onClearLevels: () => void;
  onToggleField: (field: string) => void;
  onClearFields: () => void;
  onToggleIelts: (tier: string) => void;
  onChangeIeltsRange: (minVal: number, maxVal: number) => void;
  onResetIelts: () => void;
  onToggleMode: (mode: string) => void;
  onToggleIntake: (month: string) => void;
  onToggleDuration: (duration: string) => void;
  onChangeFeeRange: (minVal: number, maxVal: number) => void;
  onResetFeeRange: () => void;
  onToggleType: (typeKey: string) => void;
  onClearTypes: () => void;
  onToggleRankTier: (tier: string) => void;
  onToggleScholarship: () => void;
  onToggleFeeWaiver: () => void;
  onResetAll: () => void;
  onApplyFilters?: () => void;

  // Optional mobile drawer props
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const DEFAULT_BADGE_CLASS =
  'text-[11px] font-normal text-slate-400 bg-slate-100/80 border border-slate-200 px-2 py-0.5 rounded-md max-w-[125px] truncate';
const ACTIVE_BADGE_CLASS =
  'text-[11px] font-semibold text-white bg-[#121927] px-2 py-0.5 rounded-md max-w-[125px] truncate';

const CHECKBOX_CLASS =
  'w-3.5 h-3.5 accent-amber-500 text-amber-500 rounded border-slate-300 focus:ring-amber-400 focus:ring-offset-0 cursor-pointer shrink-0';

export const StitchCourseFilterSidebar: React.FC<StitchCourseFilterSidebarProps> = ({
  mode = 'courses',
  allCourses,
  allUnis,
  totalResults,
  selectedCountries,
  selectedCities,
  selectedInstitutions,
  selectedLevels,
  selectedFields,
  selectedIelts,
  ieltsMin,
  ieltsMax,
  selectedModes,
  selectedIntakes,
  selectedDurations,
  minFee,
  maxFee,
  selectedTypes,
  selectedRankTiers,
  scholarshipOnly,
  feeWaiverOnly,
  onToggleCountry,
  onClearCountries,
  onToggleCity,
  onClearCities,
  onToggleInstitution,
  onClearInstitutions,
  onToggleLevel,
  onSelectAllLevels,
  onClearLevels,
  onToggleField,
  onClearFields,
  onToggleIelts,
  onChangeIeltsRange,
  onResetIelts,
  onToggleMode,
  onToggleIntake,
  onToggleDuration,
  onChangeFeeRange,
  onResetFeeRange,
  onToggleType,
  onClearTypes,
  onToggleRankTier,
  onToggleScholarship,
  onToggleFeeWaiver,
  onResetAll,
  onApplyFilters,
  isMobile = false,
  onCloseMobile,
}) => {
  // All filter accordion sections start collapsed by default and toggle on click
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    destinations: false,
    city: false,
    institution: false,
    studyLevel: false,
    courses: false,
    ielts: false,
    studyMode: false,
    intake: false,
    duration: false,
    fee: false,
    institutionType: false,
    qsRanking: false,
    scholarship: false,
  });

  // Inline search queries
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

  // Inline limit warnings (no window.alert)
  const [limitNotice, setLimitNotice] = useState<'country' | 'city' | 'institution' | null>(null);
  const [applyConfirmed, setApplyConfirmed] = useState(false);

  const toggleAccordion = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasAnyExpanded = useMemo(
    () => Object.values(expanded).some(Boolean),
    [expanded]
  );

  const handleCollapseAll = () => {
    setExpanded((prev) => {
      const next: Record<string, boolean> = {};
      for (const key of Object.keys(prev)) {
        next[key] = false;
      }
      return next;
    });
  };

  const triggerLimitNotice = (section: 'country' | 'city' | 'institution') => {
    setLimitNotice(section);
    window.setTimeout(() => {
      setLimitNotice((cur) => (cur === section ? null : cur));
    }, 2400);
  };

  const isUniMode = mode === 'universities';
  const totalEntityCount = isUniMode ? allUnis.length : allCourses.length;

  const coursesByUniMap = useMemo(
    () => (isUniMode ? buildCoursesByUniversityMap(allCourses) : new Map<string, Course[]>()),
    [isUniMode, allCourses]
  );

  // --- Computed real data facets from GEES dataset ---
  const countryOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    if (isUniMode) {
      allUnis.forEach((u) => {
        if (u.country) {
          counts[u.country] = (counts[u.country] || 0) + 1;
        }
      });
    } else {
      allCourses.forEach((c) => {
        if (c.country) {
          counts[c.country] = (counts[c.country] || 0) + 1;
        }
      });
    }
    return APPROVED_COUNTRY_NAMES.map((country) => ({
      value: country,
      displayName: getCountryDisplayName(country),
      flagEmoji: COUNTRY_METADATA_REGISTRY[country]?.flagEmoji || '🌍',
      count: counts[country] || 0,
    }));
  }, [isUniMode, allUnis, allCourses]);

  const filteredCountryOptions = useMemo(() => {
    const q = countrySearch.toLowerCase().trim();
    if (!q) return countryOptions;
    return countryOptions.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) ||
        c.value.toLowerCase().includes(q)
    );
  }, [countryOptions, countrySearch]);

  // Dynamic city list derived from GEES universities or courses (respects selected destinations!)
  const cityOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    if (isUniMode) {
      const scopedUnis =
        selectedCountries.length > 0
          ? allUnis.filter((u) =>
              selectedCountries.some(
                (sc) => sc.toLowerCase() === (u.country || '').toLowerCase()
              )
            )
          : allUnis;

      scopedUnis.forEach((u) => {
        const city = (u.city || '').trim();
        if (city) {
          counts[city] = (counts[city] || 0) + 1;
        }
      });
    } else {
      const scopedCourses =
        selectedCountries.length > 0
          ? allCourses.filter((c) =>
              selectedCountries.some(
                (sc) => sc.toLowerCase() === (c.country || '').toLowerCase()
              )
            )
          : allCourses;

      scopedCourses.forEach((c) => {
        const city = (c.city || '').trim();
        if (city) {
          counts[city] = (counts[city] || 0) + 1;
        }
      });
    }

    // Keep any already-selected cities visible so users can uncheck them cleanly
    selectedCities.forEach((sc) => {
      if (!(sc in counts)) counts[sc] = 0;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }, [isUniMode, allUnis, allCourses, selectedCountries, selectedCities]);

  const filteredCityOptions = useMemo(() => {
    const q = citySearch.toLowerCase().trim();
    if (!q) return cityOptions;
    return cityOptions.filter((c) => c.name.toLowerCase().includes(q));
  }, [cityOptions, citySearch]);

  // Dynamic institution list derived from GEES universities/courses (respects selected countries & cities)
  const institutionOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    if (isUniMode) {
      allUnis.forEach((u) => {
        const matchesCountry =
          selectedCountries.length === 0 ||
          selectedCountries.some(
            (sc) => sc.toLowerCase() === (u.country || '').toLowerCase()
          );
        const matchesCity =
          selectedCities.length === 0 ||
          selectedCities.some(
            (sc) => sc.toLowerCase() === (u.city || '').toLowerCase()
          );
        if (matchesCountry && matchesCity && u.name) {
          counts[u.name.trim()] = 0;
        }
      });
    } else {
      const scopedCourses = allCourses.filter((c) => {
        if (
          selectedCountries.length > 0 &&
          !selectedCountries.some(
            (sc) => sc.toLowerCase() === (c.country || '').toLowerCase()
          )
        ) {
          return false;
        }
        if (
          selectedCities.length > 0 &&
          !selectedCities.some(
            (sc) => sc.toLowerCase() === (c.city || '').toLowerCase()
          )
        ) {
          return false;
        }
        return true;
      });

      scopedCourses.forEach((c) => {
        const uniName = (c.universityName || '').trim();
        if (uniName) {
          counts[uniName] = (counts[uniName] || 0) + 1;
        }
      });

      // Include partner universities from registry matching scope even if 0 courses directly matched
      allUnis.forEach((u) => {
        const matchesCountry =
          selectedCountries.length === 0 ||
          selectedCountries.some(
            (sc) => sc.toLowerCase() === (u.country || '').toLowerCase()
          );
        const matchesCity =
          selectedCities.length === 0 ||
          selectedCities.some(
            (sc) => sc.toLowerCase() === (u.city || '').toLowerCase()
          );
        if (matchesCountry && matchesCity && u.name && !(u.name in counts)) {
          counts[u.name] = 0;
        }
      });
    }

    selectedInstitutions.forEach((si) => {
      if (!(si in counts)) counts[si] = 0;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }, [isUniMode, allCourses, allUnis, selectedCountries, selectedCities, selectedInstitutions]);

  const filteredInstitutionOptions = useMemo(() => {
    const q = institutionSearch.toLowerCase().trim();
    if (!q) return institutionOptions;
    return institutionOptions.filter((inst) => inst.name.toLowerCase().includes(q));
  }, [institutionOptions, institutionSearch]);

  // Study level counts
  const studyLevelOptions = useMemo(() => {
    return SPECIFIC_QUALIFICATIONS.map((level) => {
      let count = 0;
      if (isUniMode) {
        allUnis.forEach((u) => {
          const uniCourses = getCoursesForUniversity(u, coursesByUniMap);
          if (matchesUniversityLevel(u, uniCourses, level)) count++;
        });
      } else {
        allCourses.forEach((c) => {
          if (matchesCourseQualification(c, level)) count++;
        });
      }
      return { value: level, label: level, count };
    });
  }, [isUniMode, allUnis, allCourses, coursesByUniMap]);

  // Alphabetical A-Z grouped Course Subjects (matching exact Stitch HTML list + IDP categories)
  const groupedSubjectSections = useMemo(() => {
    const groupsMap = new Map<
      string,
      Array<{ name: string; subSubjects: string[]; count: number }>
    >();

    // Build exact A-Z groups from IDP_SUBJECT_CATEGORIES, ensuring Physics under P is included as in Stitch HTML
    const categoryEntries: Array<{ letter: string; name: string; subSubjects: string[] }> = [];
    IDP_SUBJECT_CATEGORIES.forEach((item) => {
      categoryEntries.push({
        letter: item.letter,
        name: item.category,
        subSubjects: item.subSubjects,
      });
      if (item.category === 'Physical Sciences') {
        categoryEntries.push({
          letter: 'P',
          name: 'Physics',
          subSubjects: ['Theoretical Physics', 'Applied Physics', 'Astrophysics'],
        });
      }
    });

    categoryEntries.forEach((entry) => {
      let count = 0;
      if (isUniMode) {
        allUnis.forEach((u) => {
          const uniCourses = getCoursesForUniversity(u, coursesByUniMap);
          if (matchesUniversitySubject(u, uniCourses, entry.name)) {
            count++;
          }
        });
      } else {
        allCourses.forEach((course) => {
          if (matchesCourseSubject(course, entry.name)) {
            count++;
          }
        });
      }
      if (!groupsMap.has(entry.letter)) {
        groupsMap.set(entry.letter, []);
      }
      groupsMap.get(entry.letter)!.push({
        name: entry.name,
        subSubjects: entry.subSubjects,
        count,
      });
    });

    return Array.from(groupsMap.entries()).map(([letter, items]) => ({
      letter,
      items,
    }));
  }, [isUniMode, allUnis, allCourses, coursesByUniMap]);

  const filteredSubjectSections = useMemo(() => {
    const q = subjectSearch.toLowerCase().trim();
    if (!q) return groupedSubjectSections;
    return groupedSubjectSections
      .map((sec) => ({
        letter: sec.letter,
        items: sec.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.subSubjects.some((sub) => sub.toLowerCase().includes(q))
        ),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [groupedSubjectSections, subjectSearch]);

  // Study mode counts
  const studyModeCounts = useMemo(() => {
    const map: Record<string, number> = {};
    STITCH_STUDY_MODES.forEach((modeLabel) => {
      let count = 0;
      if (isUniMode) {
        allUnis.forEach((u) => {
          const uniCourses = getCoursesForUniversity(u, coursesByUniMap);
          if (matchesUniversityStudyMode(u, uniCourses, modeLabel)) count++;
        });
      } else {
        allCourses.forEach((c) => {
          if (matchesStitchStudyMode(c, modeLabel)) count++;
        });
      }
      map[modeLabel] = count;
    });
    return map;
  }, [isUniMode, allUnis, allCourses, coursesByUniMap]);

  // Institution type, QS ranking, Scholarship & Fee Waiver counts
  const miscCounts = useMemo(() => {
    let publicCount = 0;
    let privateCount = 0;
    let researchCount = 0;
    let top100 = 0;
    let top300 = 0;
    let top500 = 0;
    let top1000 = 0;
    let scholarships = 0;
    let feeWaivers = 0;

    if (isUniMode) {
      allUnis.forEach((u) => {
        const t = (u.type || '').toLowerCase();
        if (t.includes('public')) publicCount++;
        if (t.includes('private')) privateCount++;
        if (t.includes('research') || t.includes('uas') || t.includes('technology')) researchCount++;

        const rank = Number(u.qsRank2027);
        if (rank > 0) {
          if (rank <= 100) top100++;
          if (rank <= 300) top300++;
          if (rank <= 500) top500++;
          if (rank <= 1000) top1000++;
        }

        if (u.scholarshipsAvailable) scholarships++;
        if (matchesUniversityFeeWaiver(u)) feeWaivers++;
      });
    } else {
      allCourses.forEach((c) => {
        const t = (c.universityType || '').toLowerCase();
        if (t.includes('public')) publicCount++;
        if (t.includes('private')) privateCount++;
        if (t.includes('research') || t.includes('uas') || t.includes('technology')) researchCount++;

        const rank = Number(c.qsRank2027);
        if (rank > 0) {
          if (rank <= 100) top100++;
          if (rank <= 300) top300++;
          if (rank <= 500) top500++;
          if (rank <= 1000) top1000++;
        }

        if (c.scholarshipCoveragePct && c.scholarshipCoveragePct > 0) scholarships++;
        if (matchesApplicationFeeWaiver(c)) feeWaivers++;
      });
    }

    return {
      publicCount,
      privateCount,
      researchCount,
      top100,
      top300,
      top500,
      top1000,
      scholarships,
      feeWaivers,
    };
  }, [isUniMode, allUnis, allCourses]);

  // --- Badge Text & Style Helpers (exact Stitch behaviour) ---
  const destinationsBadge = useMemo(() => {
    if (selectedCountries.length === 0) return { text: 'All', active: false };
    if (selectedCountries.length === 1)
      return { text: getCountryDisplayName(selectedCountries[0]), active: true };
    return { text: `${selectedCountries.length} selected`, active: true };
  }, [selectedCountries]);

  const cityBadge = useMemo(() => {
    if (selectedCities.length === 0) return { text: 'All', active: false };
    if (selectedCities.length === 1) return { text: selectedCities[0], active: true };
    return { text: `${selectedCities.length} selected`, active: true };
  }, [selectedCities]);

  const institutionBadge = useMemo(() => {
    if (selectedInstitutions.length === 0)
      return { text: 'All Universities', active: false };
    if (selectedInstitutions.length === 1)
      return { text: selectedInstitutions[0], active: true };
    return { text: `${selectedInstitutions.length} selected`, active: true };
  }, [selectedInstitutions]);

  const activeSpecificLevels = selectedLevels.filter((l) => l !== 'All Levels');
  const studyLevelBadge = useMemo(() => {
    if (activeSpecificLevels.length === 0) return { text: 'All Levels', active: false };
    if (activeSpecificLevels.length === 1)
      return { text: activeSpecificLevels[0], active: true };
    return { text: `${activeSpecificLevels.length} selected`, active: true };
  }, [activeSpecificLevels]);

  const subjectBadge = useMemo(() => {
    if (selectedFields.length === 0) return { text: 'All Fields', active: false };
    if (selectedFields.length === 1) return { text: selectedFields[0], active: true };
    return { text: `${selectedFields.length} selected`, active: true };
  }, [selectedFields]);

  const isIeltsRangeActive = ieltsMin > STITCH_IELTS_MIN || ieltsMax < STITCH_IELTS_MAX;
  const ieltsBadge = useMemo(() => {
    if (selectedIelts.length === 0 && !isIeltsRangeActive) {
      return { text: 'Any', active: false };
    }
    if (selectedIelts.length === 1 && !isIeltsRangeActive) {
      const opt = STITCH_IELTS_OPTIONS.find((o) => o.value === selectedIelts[0]);
      return { text: opt ? opt.badgeLabel : selectedIelts[0], active: true };
    }
    if (selectedIelts.length > 1 && !isIeltsRangeActive) {
      return { text: `${selectedIelts.length} selected`, active: true };
    }
    if (isIeltsRangeActive && selectedIelts.length === 0) {
      return { text: `${ieltsMin.toFixed(1)} - ${ieltsMax.toFixed(1)}`, active: true };
    }
    return { text: `${selectedIelts.length + 1} selected`, active: true };
  }, [selectedIelts, isIeltsRangeActive, ieltsMin, ieltsMax]);

  const studyModeBadge = useMemo(() => {
    if (selectedModes.length === 0) return { text: 'All Modes', active: false };
    if (selectedModes.length === 1) return { text: selectedModes[0], active: true };
    return { text: `${selectedModes.length} selected`, active: true };
  }, [selectedModes]);

  const intakeBadge = useMemo(() => {
    if (selectedIntakes.length === 0) return { text: 'Any Month', active: false };
    if (selectedIntakes.length <= 2)
      return { text: selectedIntakes.join(', '), active: true };
    return { text: `${selectedIntakes.length} months`, active: true };
  }, [selectedIntakes]);

  const durationBadge = useMemo(() => {
    if (selectedDurations.length === 0) return { text: 'Any', active: false };
    if (selectedDurations.length === 1) {
      const match = STITCH_DURATIONS.find((d) => d.value === selectedDurations[0]);
      return { text: match ? match.shortLabel : selectedDurations[0], active: true };
    }
    return { text: `${selectedDurations.length} selected`, active: true };
  }, [selectedDurations]);

  const isBudgetActive = minFee > 0 || maxFee < STITCH_MAX_BUDGET;
  const budgetBadge = useMemo(() => {
    const minK = Math.round(minFee / 1000);
    const maxK = Math.round(maxFee / 1000);
    return {
      text: `$${minK === 0 ? '0' : `${minK}k`} – $${maxK}k USD`,
      active: isBudgetActive,
    };
  }, [minFee, maxFee, isBudgetActive]);

  const institutionTypeBadge = useMemo(() => {
    if (selectedTypes.length === 0) return { text: 'All Types', active: false };
    if (selectedTypes.length === 1) {
      const labels: Record<string, string> = {
        public: 'Public',
        private: 'Private',
        research: 'Research',
      };
      return { text: labels[selectedTypes[0]] || selectedTypes[0], active: true };
    }
    return { text: `${selectedTypes.length} selected`, active: true };
  }, [selectedTypes]);

  const qsBadge = useMemo(() => {
    if (selectedRankTiers.length === 0) return { text: 'All Ranks', active: false };
    if (selectedRankTiers.length === 1) {
      const labels: Record<string, string> = {
        top100: 'Top 100',
        top300: 'Top 300',
        top500: 'Top 500',
        top1000: 'Top 1000',
      };
      return {
        text: labels[selectedRankTiers[0]] || selectedRankTiers[0],
        active: true,
      };
    }
    return { text: `${selectedRankTiers.length} selected`, active: true };
  }, [selectedRankTiers]);

  const scholarshipBadge = useMemo(() => {
    const count = (scholarshipOnly ? 1 : 0) + (feeWaiverOnly ? 1 : 0);
    if (count === 0) return { text: 'Any', active: false };
    if (count === 1) {
      return {
        text: scholarshipOnly ? 'Scholarships' : 'Waiver',
        active: true,
      };
    }
    return { text: '2 selected', active: true };
  }, [scholarshipOnly, feeWaiverOnly]);

  // --- Selection Handlers enforcing max-5 limits ---
  const handleCountryToggle = (countryVal: string) => {
    const isChecked = selectedCountries.includes(countryVal);
    if (!isChecked && selectedCountries.length >= 5) {
      triggerLimitNotice('country');
      return;
    }
    onToggleCountry(countryVal);
  };

  const handleCityToggle = (cityName: string) => {
    const isChecked = selectedCities.includes(cityName);
    if (!isChecked && selectedCities.length >= 5) {
      triggerLimitNotice('city');
      return;
    }
    onToggleCity(cityName);
  };

  const handleInstitutionToggle = (instName: string) => {
    const isChecked = selectedInstitutions.includes(instName);
    if (!isChecked && selectedInstitutions.length >= 5) {
      triggerLimitNotice('institution');
      return;
    }
    onToggleInstitution(instName);
  };

  const handleApplyClick = () => {
    setApplyConfirmed(true);
    if (onApplyFilters) onApplyFilters();
    window.setTimeout(() => {
      setApplyConfirmed(false);
      if (isMobile && onCloseMobile) {
        onCloseMobile();
      }
    }, isMobile ? 350 : 1200);
  };

  const handleResetAllClick = () => {
    setCountrySearch('');
    setCitySearch('');
    setInstitutionSearch('');
    setSubjectSearch('');
    setLimitNotice(null);
    onResetAll();
  };

  return (
    <div
      className={`w-full bg-white ${
        isMobile
          ? 'rounded-t-2xl sm:rounded-2xl max-h-[88vh]'
          : 'rounded-2xl shadow-xl shadow-slate-200/90 dark:shadow-slate-950/60 max-h-[calc(100vh-112px)]'
      } border border-[#e2e8f0] flex flex-col relative overflow-hidden transition-all duration-200 text-[#0f172a]`}
      data-purpose="refine-search-card"
    >
      {/* BEGIN: HeaderSection */}
      <div
        className="bg-[#121927] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between select-none shrink-0"
        data-purpose="filter-header"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Exact Stitch Filter Sliders Icon */}
          <span className="text-amber-400 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
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
          <span
            className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0 tabular-nums"
            id="filter-total-count"
          >
            {totalResults.toLocaleString()} results
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            aria-label="Collapse all filter sections"
            className={`no-min-touch w-7 h-7 rounded-lg flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-amber-400/70 cursor-pointer ${
              hasAnyExpanded
                ? 'bg-white/10 text-amber-400 hover:bg-amber-400/20 hover:text-amber-300'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
            data-purpose="collapse-all-button"
            id="reset-all-btn"
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
          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
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
      {/* END: HeaderSection */}

      {/* BEGIN: Filter Rows Master Container */}
      <div
        className="divide-y divide-slate-100 flex-1 overflow-y-auto custom-scrollbar"
        id="filter-rows-list"
      >
        {/* 1. STUDY DESTINATION ROW */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-destinations">
          <button
            aria-expanded={expanded.destinations}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('destinations')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9.5" />
                <path d="M8.5 4.5c1.8.8 2.2 2.8 1.2 4.2-1 1.4-2.8 1.6-1.8 3.5 1 2 2.8 1.8 1.5 4.5-.6 1.2-1.8 1.8-2.2 1.8" />
                <path d="M15.5 13.5c.8-1 2.2-.6 2.5.4s-.4 2.6-1.5 2.6c-.8 0-1.5-1.5-1-3z" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Study destination
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={destinationsBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="destinations-badge"
              >
                {destinationsBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.destinations ? 'rotate-180' : ''
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

          {expanded.destinations && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-destinations">
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all">
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  </svg>
                  <input
                    autoComplete="off"
                    data-purpose="inset-filter-input"
                    className="w-full text-xs font-normal bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder-slate-400 text-slate-700"
                    id="country-search-input"
                    placeholder="Search destinations"
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                  />
                </div>

                <div
                  className="max-h-56 overflow-y-auto custom-scrollbar border border-slate-100 rounded-lg divide-y divide-slate-100 bg-white select-none"
                  id="destinations-list"
                >
                  {!countrySearch.trim() && (
                    <label className="country-item flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors group/item">
                      <div className="flex items-center gap-2.5">
                        <input
                          checked={selectedCountries.length === 0}
                          onChange={() => onClearCountries()}
                          className={CHECKBOX_CLASS}
                          id="all-destinations-cb"
                          type="checkbox"
                        />
                        <span className="country-name font-semibold text-slate-900 group-hover/item:text-amber-600">
                          All Destinations
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({countryOptions.length})
                      </span>
                    </label>
                  )}

                  {filteredCountryOptions.map((c) => {
                    const isChecked = selectedCountries.includes(c.value);
                    return (
                      <label
                        key={c.value}
                        className="country-item flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            checked={isChecked}
                            onChange={() => handleCountryToggle(c.value)}
                            className={`country-cb ${CHECKBOX_CLASS}`}
                            type="checkbox"
                            value={c.value}
                          />
                          <span className="text-base leading-none mr-0.5 shrink-0">{c.flagEmoji}</span>
                          <span className="country-name font-medium text-slate-700 group-hover/item:text-slate-900 truncate">
                            {c.displayName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                          ({c.count})
                        </span>
                      </label>
                    );
                  })}

                  {filteredCountryOptions.length === 0 && (
                    <div className="px-3.5 py-4 text-center text-xs text-slate-400">
                      No destinations found
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-1 text-slate-400">
                  <p
                    className={`text-xs font-medium ${
                      limitNotice === 'country' ? 'text-amber-600 font-semibold' : ''
                    }`}
                  >
                    {limitNotice === 'country'
                      ? 'Maximum 5 destinations allowed'
                      : selectedCountries.length > 0
                      ? `${selectedCountries.length} of 5 selected`
                      : 'You can select up to 5'}
                  </p>
                  <button
                    className="no-min-touch text-[11px] text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                    id="clear-destinations-btn"
                    type="button"
                    onClick={() => {
                      setCountrySearch('');
                      onClearCountries();
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. CITY ROW */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-city">
          <button
            aria-expanded={expanded.city}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('city')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                City
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cityBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="city-badge"
              >
                {cityBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
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
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-city">
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all">
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  </svg>
                  <input
                    autoComplete="off"
                    data-purpose="inset-filter-input"
                    className="w-full text-xs font-normal bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder-slate-400 text-slate-700"
                    id="city-search-input"
                    placeholder="Search cities"
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                  />
                </div>

                <div
                  className="max-h-56 overflow-y-auto custom-scrollbar border border-slate-100 rounded-lg divide-y divide-slate-100 bg-white select-none"
                  id="city-dropdown-list"
                >
                  {filteredCityOptions.map((city) => {
                    const isChecked = selectedCities.includes(city.name);
                    return (
                      <label
                        key={city.name}
                        className="city-item flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            checked={isChecked}
                            onChange={() => handleCityToggle(city.name)}
                            className={`city-cb ${CHECKBOX_CLASS}`}
                            type="checkbox"
                            value={city.name}
                          />
                          <span className="city-label font-medium text-slate-700 group-hover/item:text-slate-900 truncate">
                            {city.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                          ({city.count})
                        </span>
                      </label>
                    );
                  })}

                  {filteredCityOptions.length === 0 && (
                    <div className="px-3.5 py-4 text-center text-xs text-slate-400">
                      No cities found
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-1 text-slate-400">
                  <p
                    className={`text-xs font-medium ${
                      limitNotice === 'city' ? 'text-amber-600 font-semibold' : ''
                    }`}
                    id="city-selection-count-msg"
                  >
                    {limitNotice === 'city'
                      ? 'You can select up to 5 cities'
                      : selectedCities.length > 0
                      ? `${selectedCities.length} of 5 selected`
                      : 'You can select up to 5'}
                  </p>
                  <button
                    className="no-min-touch text-[11px] text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                    id="clear-cities-btn"
                    type="button"
                    onClick={() => {
                      setCitySearch('');
                      onClearCities();
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. INSTITUTION ROW */}
        <div
          className="filter-item-wrapper group bg-white transition-colors"
          id="wrapper-institution-search"
        >
          <button
            aria-expanded={expanded.institution}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('institution')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M2 9.5L12 4l10 5.5" />
                <path d="M4 10.5h16" />
                <path d="M5.5 13.5v5M9.8 13.5v5M14.2 13.5v5M18.5 13.5v5" />
                <path d="M3 20h18" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                University
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={institutionBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="institution-search-badge"
              >
                {institutionBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.institution ? 'rotate-180' : ''
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

          {expanded.institution && (
            <div
              className="bg-slate-50/70 p-3 border-t border-slate-100"
              id="content-institution-search"
            >
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all">
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  </svg>
                  <input
                    autoComplete="off"
                    data-purpose="inset-filter-input"
                    className="w-full text-xs font-normal bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder-slate-400 text-slate-700"
                    id="institution-search-input"
                    placeholder="Search Institutions"
                    type="text"
                    value={institutionSearch}
                    onChange={(e) => setInstitutionSearch(e.target.value)}
                  />
                </div>

                <div
                  className="max-h-56 overflow-y-auto custom-scrollbar border border-slate-100 rounded-lg divide-y divide-slate-100 bg-white select-none"
                  id="institution-dropdown-list"
                >
                  {!institutionSearch.trim() && (
                    <label className="institution-item flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors group/item">
                      <div className="flex items-center gap-2.5">
                        <input
                          checked={selectedInstitutions.length === 0}
                          onChange={() => onClearInstitutions()}
                          className={CHECKBOX_CLASS}
                          id="all-institutions-cb"
                          type="checkbox"
                        />
                        <span className="institution-label font-semibold text-slate-900 group-hover/item:text-amber-600">
                          All Institutions
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({institutionOptions.length})
                      </span>
                    </label>
                  )}

                  {filteredInstitutionOptions.map((inst) => {
                    const isChecked = selectedInstitutions.includes(inst.name);
                    return (
                      <label
                        key={inst.name}
                        className="institution-item flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            checked={isChecked}
                            onChange={() => handleInstitutionToggle(inst.name)}
                            className={`institution-item-cb ${CHECKBOX_CLASS}`}
                            type="checkbox"
                            value={inst.name}
                          />
                          <span className="institution-label font-medium text-slate-700 group-hover/item:text-slate-900 leading-snug">
                            {inst.name}
                          </span>
                        </div>
                        {inst.count > 0 && (
                          <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                            ({inst.count})
                          </span>
                        )}
                      </label>
                    );
                  })}

                  {filteredInstitutionOptions.length === 0 && (
                    <div className="px-3.5 py-4 text-center text-xs text-slate-400">
                      No institutions found
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-1 text-slate-400">
                  <p
                    className={`text-xs font-medium ${
                      limitNotice === 'institution' ? 'text-amber-600 font-semibold' : ''
                    }`}
                  >
                    {limitNotice === 'institution'
                      ? 'You can select up to 5 institutions'
                      : selectedInstitutions.length > 0
                      ? `${selectedInstitutions.length} of 5 selected`
                      : 'You can select up to 5'}
                  </p>
                  <button
                    className="no-min-touch text-[11px] text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                    id="clear-institutions-btn"
                    type="button"
                    onClick={() => {
                      setInstitutionSearch('');
                      onClearInstitutions();
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. STUDY LEVEL ROW */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-studylevel">
          <button
            aria-expanded={expanded.studyLevel}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('studyLevel')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Study level
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={studyLevelBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="studylevel-badge"
              >
                {studyLevelBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.studyLevel ? 'rotate-180' : ''
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

          {expanded.studyLevel && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-studylevel">
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
                <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 mb-1">
                  <span className="font-medium">18 study levels</span>
                  <div className="flex gap-2">
                    <button
                      className="no-min-touch text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                      id="select-all-studylevel-btn"
                      type="button"
                      onClick={onSelectAllLevels}
                    >
                      All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      className="no-min-touch text-slate-500 hover:text-slate-700 cursor-pointer"
                      id="clear-all-studylevel-btn"
                      type="button"
                      onClick={onClearLevels}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-0.5 select-none pr-1">
                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group/item">
                    <div className="flex items-center gap-2.5">
                      <input
                        checked={activeSpecificLevels.length === 0}
                        onChange={() => onClearLevels()}
                        className={CHECKBOX_CLASS}
                        id="all-studylevel-cb"
                        type="checkbox"
                      />
                      <span className="text-xs font-semibold text-slate-900 group-hover/item:text-amber-600">
                        All Levels
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">({totalEntityCount})</span>
                  </label>

                  {studyLevelOptions.map((lvl) => {
                    const isChecked = activeSpecificLevels.includes(lvl.value);
                    return (
                      <label
                        key={lvl.value}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group/item"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            checked={isChecked}
                            onChange={() => onToggleLevel(lvl.value)}
                            className={`studylevel-cb ${CHECKBOX_CLASS}`}
                            type="checkbox"
                            value={lvl.value}
                          />
                          <span className="text-xs font-medium text-slate-700 group-hover/item:text-slate-900 leading-snug">
                            {lvl.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                          ({lvl.count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. COURSE SUBJECT ROW (Expanded by default as in Stitch HTML) */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-courses">
          <button
            aria-expanded={expanded.courses}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('courses')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Subject
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={subjectBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="discipline-badge"
              >
                {subjectBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.courses ? 'rotate-180' : ''
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

          {expanded.courses && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-courses">
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all">
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  </svg>
                  <input
                    autoComplete="off"
                    data-purpose="inset-filter-input"
                    className="w-full text-xs font-normal bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder-slate-400 text-slate-700"
                    id="course-search-input"
                    placeholder="Enter Subject(s)"
                    type="text"
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                  />
                </div>

                <div
                  className="max-h-56 overflow-y-auto custom-scrollbar space-y-1 select-none pr-1"
                  id="courses-list"
                >
                  {!subjectSearch.trim() && (
                    <label className="subject-item flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2.5">
                        <input
                          checked={selectedFields.length === 0}
                          onChange={() => onClearFields()}
                          className={CHECKBOX_CLASS}
                          id="all-discipline-cb"
                          type="checkbox"
                        />
                        <span className="subject-name text-xs font-semibold text-slate-900">
                          All Subjects
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({totalEntityCount.toLocaleString()})
                      </span>
                    </label>
                  )}

                  {filteredSubjectSections.map((group) => (
                    <React.Fragment key={group.letter}>
                      <div className="pt-1.5 pb-0.5 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 rounded">
                        {group.letter}
                      </div>
                      {group.items.map((subj) => {
                        const isChecked = selectedFields.includes(subj.name);
                        return (
                          <label
                            key={subj.name}
                            className="subject-item flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group/item"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <input
                                checked={isChecked}
                                onChange={() => onToggleField(subj.name)}
                                className={`discipline-cb ${CHECKBOX_CLASS}`}
                                type="checkbox"
                                value={subj.name}
                              />
                              <span className="subject-name text-xs font-medium text-slate-700 group-hover/item:text-slate-900 leading-snug">
                                {subj.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                              ({subj.count})
                            </span>
                          </label>
                        );
                      })}
                    </React.Fragment>
                  ))}

                  {filteredSubjectSections.length === 0 && (
                    <div className="px-3 py-4 text-center text-xs text-slate-400">
                      No matching subjects found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. IELTS SCORE ROW */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-ielts">
          <button
            aria-expanded={expanded.ielts}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('ielts')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="8.5" r="5.5" />
                <path d="m9.5 8.5 1.8 1.8 3.5-3.5" />
                <path d="m7.5 13.5-2.5 7.5 7-3" />
                <path d="m16.5 13.5 2.5 7.5-7-3" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                IELTS score
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={ieltsBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="ielts-badge"
              >
                {ieltsBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.ielts ? 'rotate-180' : ''
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

          {expanded.ielts && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-ielts">
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
                <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-slate-100 mb-2">
                  {STITCH_IELTS_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer ${
                        opt.fullWidth ? 'col-span-2' : ''
                      }`}
                    >
                      <input
                        checked={selectedIelts.includes(opt.value)}
                        onChange={() => onToggleIelts(opt.value)}
                        className={`ielts-cb ${CHECKBOX_CLASS}`}
                        type="checkbox"
                        value={opt.value}
                      />
                      <span className="text-xs text-slate-700">{opt.label}</span>
                    </label>
                  ))}
                </div>

                <div className="p-1 space-y-3 pb-2 border-slate-100 mb-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 tracking-tight">
                      <span id="display-ielts-min">{ieltsMin.toFixed(1)}</span> —{' '}
                      <span id="display-ielts-max">{ieltsMax.toFixed(1)}</span>
                    </span>
                    <button
                      className="no-min-touch text-[11px] text-amber-600 hover:text-amber-700 font-semibold focus:outline-none cursor-pointer"
                      id="clear-ielts-btn"
                      type="button"
                      onClick={onResetIelts}
                    >
                      Reset
                    </button>
                  </div>

                  <GooeyIeltsSlider
                    min={STITCH_IELTS_MIN}
                    max={STITCH_IELTS_MAX}
                    step={0.5}
                    valueMin={ieltsMin}
                    valueMax={ieltsMax}
                    onChange={onChangeIeltsRange}
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>3.5</span>
                    <span>5.0</span>
                    <span>6.5</span>
                    <span>8.0</span>
                    <span>9.0</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div className="flex flex-col gap-1">
                      <label
                        className="text-[10px] font-bold text-slate-400 tracking-wider uppercase"
                        htmlFor="ielts-min-input"
                      >
                        Min
                      </label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
                        <input
                          className="w-full text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                          id="ielts-min-input"
                          max={STITCH_IELTS_MAX}
                          min={STITCH_IELTS_MIN}
                          step={0.5}
                          type="number"
                          value={ieltsMin}
                          onChange={(e) => {
                            const raw = parseFloat(e.target.value);
                            if (Number.isNaN(raw)) return;
                            const clamped = Math.max(
                              STITCH_IELTS_MIN,
                              Math.min(raw, STITCH_IELTS_MAX)
                            );
                            onChangeIeltsRange(clamped, Math.max(clamped, ieltsMax));
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        className="text-[10px] font-bold text-slate-400 tracking-wider uppercase"
                        htmlFor="ielts-max-input"
                      >
                        Max
                      </label>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
                        <input
                          className="w-full text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                          id="ielts-max-input"
                          max={STITCH_IELTS_MAX}
                          min={STITCH_IELTS_MIN}
                          step={0.5}
                          type="number"
                          value={ieltsMax}
                          onChange={(e) => {
                            const raw = parseFloat(e.target.value);
                            if (Number.isNaN(raw)) return;
                            const clamped = Math.max(
                              STITCH_IELTS_MIN,
                              Math.min(raw, STITCH_IELTS_MAX)
                            );
                            onChangeIeltsRange(Math.min(ieltsMin, clamped), clamped);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. STUDY MODE ROW */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-studymode">
          <button
            aria-expanded={expanded.studyMode}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('studyMode')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect height="14" rx="2" width="20" x="2" y="3" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Study mode
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={studyModeBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="study-mode-badge"
              >
                {studyModeBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
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
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-study-mode">
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
                {STITCH_STUDY_MODES.map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group/item"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        checked={selectedModes.includes(mode)}
                        onChange={() => onToggleMode(mode)}
                        className={`study-mode-cb ${CHECKBOX_CLASS}`}
                        type="checkbox"
                        value={mode}
                      />
                      <span className="text-xs font-medium text-slate-700 group-hover/item:text-slate-900 leading-snug">
                        {mode}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-normal shrink-0 ml-2">
                      ({studyModeCounts[mode] || 0})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 8. INTAKE ROW */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-intake">
          <button
            aria-expanded={expanded.intake}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('intake')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Intake
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={intakeBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="intake-badge"
              >
                {intakeBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.intake ? 'rotate-180' : ''
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

          {expanded.intake && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-intake">
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs">
                <div className="grid grid-cols-6 gap-1">
                  {STITCH_INTAKE_MONTHS.map((month) => {
                    const isActive = selectedIntakes.includes(month);
                    return (
                      <button
                        key={month}
                        type="button"
                        data-active={isActive ? 'true' : 'false'}
                        data-month={month}
                        onClick={() => onToggleIntake(month)}
                        className={`no-min-touch month-btn py-1.5 px-0.5 rounded-md text-[11px] transition-colors text-center cursor-pointer ${
                          isActive
                            ? 'bg-[#121927] text-amber-400 font-bold'
                            : 'font-medium bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 9. DURATION ROW */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-duration">
          <button
            aria-expanded={expanded.duration}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('duration')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 22h14" />
                <path d="M5 2h14" />
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Duration
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={durationBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="duration-badge"
              >
                {durationBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.duration ? 'rotate-180' : ''
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

          {expanded.duration && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-duration">
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
                <div className="grid grid-cols-2 gap-1.5">
                  {STITCH_DURATIONS.map((dur) => (
                    <label
                      key={dur.value}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        checked={selectedDurations.includes(dur.value)}
                        onChange={() => onToggleDuration(dur.value)}
                        className={`duration-cb ${CHECKBOX_CLASS}`}
                        type="checkbox"
                        value={dur.value}
                      />
                      <span className="text-xs text-slate-700">{dur.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 10. BUDGET ROW */}
        <div className="filter-item-wrapper group bg-white transition-colors" id="wrapper-fee">
          <button
            aria-expanded={expanded.fee}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('fee')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect height="14" rx="2" width="20" x="2" y="5" />
                <line x1="2" x2="22" y1="10" y2="10" />
                <line x1="6" x2="10" y1="15" y2="15" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Budget
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={budgetBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="fee-summary-badge"
              >
                {budgetBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
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
            <div className="bg-slate-50/70 p-3 border-t border-slate-100" id="content-fee">
              <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 tracking-tight">
                    $<span id="display-min">{minFee.toLocaleString()}</span> USD — $
                    <span id="display-max">{maxFee.toLocaleString()}</span> USD
                  </span>
                  <button
                    className="no-min-touch text-[11px] text-amber-600 hover:text-amber-700 font-semibold focus:outline-none cursor-pointer"
                    id="clear-price-btn"
                    type="button"
                    onClick={onResetFeeRange}
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-1 border-b border-slate-100">
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[10px] font-bold text-slate-400 tracking-wider uppercase"
                      htmlFor="budget-min-input"
                    >
                      Min
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
                      <span className="text-xs text-slate-400 font-medium mr-1">$</span>
                      <input
                        className="w-full text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                        id="budget-min-input"
                        max={STITCH_MAX_BUDGET}
                        min={0}
                        step={1000}
                        type="number"
                        value={minFee}
                        onChange={(e) => {
                          const val = Math.max(
                            0,
                            Math.min(parseInt(e.target.value, 10) || 0, STITCH_MAX_BUDGET)
                          );
                          onChangeFeeRange(val, Math.max(val, maxFee));
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[10px] font-bold text-slate-400 tracking-wider uppercase"
                      htmlFor="budget-max-input"
                    >
                      Max
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
                      <span className="text-xs text-slate-400 font-medium mr-1">$</span>
                      <input
                        className="w-full text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                        id="budget-max-input"
                        max={STITCH_MAX_BUDGET}
                        min={0}
                        step={1000}
                        type="number"
                        value={maxFee}
                        onChange={(e) => {
                          const val = Math.max(
                            0,
                            Math.min(parseInt(e.target.value, 10) || 0, STITCH_MAX_BUDGET)
                          );
                          onChangeFeeRange(Math.min(minFee, val), val);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <GooeyIeltsSlider
                  min={0}
                  max={STITCH_MAX_BUDGET}
                  step={1000}
                  valueMin={minFee}
                  valueMax={maxFee}
                  onChange={onChangeFeeRange}
                  trackId="slider-track-highlight"
                  minInputId="min-range-slider"
                  maxInputId="max-range-slider"
                  minAriaLabel="Minimum annual tuition budget USD"
                  maxAriaLabel="Maximum annual tuition budget USD"
                  badgeWidth={44}
                  formatBadge={(val) => (val === 0 ? '$0' : `$${Math.round(val / 1000)}k`)}
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>$0</span>
                  <span>$35k</span>
                  <span>$75k</span>
                  <span>$115k</span>
                  <span>$150k USD</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 11. INSTITUTION TYPE ROW */}
        <div
          className="filter-item-wrapper group bg-white transition-colors"
          id="wrapper-institution"
        >
          <button
            aria-expanded={expanded.institutionType}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('institutionType')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M2 9.5L12 4l10 5.5" />
                <path d="M4 10.5h16" />
                <path d="M5.5 13.5v5M9.8 13.5v5M14.2 13.5v5M18.5 13.5v5" />
                <path d="M3 20h18" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Institution type
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={
                  institutionTypeBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS
                }
                id="institution-type-badge"
              >
                {institutionTypeBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.institutionType ? 'rotate-180' : ''
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

          {expanded.institutionType && (
            <div
              className="bg-slate-50/70 p-3 border-t border-slate-100"
              id="content-institution"
            >
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      checked={selectedTypes.length === 0}
                      onChange={() => onClearTypes()}
                      className={CHECKBOX_CLASS}
                      id="all-institution-type-cb"
                      type="checkbox"
                    />
                    <span className="text-xs font-semibold text-slate-900">All Types</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({totalEntityCount})</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      checked={selectedTypes.includes('public')}
                      onChange={() => onToggleType('public')}
                      className={`institution-type-cb ${CHECKBOX_CLASS}`}
                      type="checkbox"
                      value="Public"
                    />
                    <span className="text-xs text-slate-700">Public Universities</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({miscCounts.publicCount})</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      checked={selectedTypes.includes('private')}
                      onChange={() => onToggleType('private')}
                      className={`institution-type-cb ${CHECKBOX_CLASS}`}
                      type="checkbox"
                      value="Private"
                    />
                    <span className="text-xs text-slate-700">Private Universities</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({miscCounts.privateCount})</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      checked={selectedTypes.includes('research')}
                      onChange={() => onToggleType('research')}
                      className={`institution-type-cb ${CHECKBOX_CLASS}`}
                      type="checkbox"
                      value="Research"
                    />
                    <span className="text-xs text-slate-700">Research &amp; Technical</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({miscCounts.researchCount})</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 12. QS WORLD RANKING ROW */}
        <div
          className="filter-item-wrapper group bg-white transition-colors"
          id="wrapper-qsranking"
        >
          <button
            aria-expanded={expanded.qsRanking}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('qsRanking')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                QS World Ranking
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={qsBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="qs-ranking-badge"
              >
                {qsBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.qsRanking ? 'rotate-180' : ''
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

          {expanded.qsRanking && (
            <div
              className="bg-slate-50/70 p-3 border-t border-slate-100"
              id="content-qs-ranking"
            >
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
                {[
                  { id: 'top100', label: 'Top 100 QS Rank', count: miscCounts.top100 },
                  { id: 'top300', label: 'Top 300 QS Rank', count: miscCounts.top300 },
                  { id: 'top500', label: 'Top 500 QS Rank', count: miscCounts.top500 },
                  { id: 'top1000', label: 'Top 1000 QS Rank', count: miscCounts.top1000 },
                ].map((tier) => (
                  <label
                    key={tier.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        checked={selectedRankTiers.includes(tier.id)}
                        onChange={() => onToggleRankTier(tier.id)}
                        className={`qs-cb ${CHECKBOX_CLASS}`}
                        type="checkbox"
                        value={tier.id}
                      />
                      <span className="text-xs text-slate-700">{tier.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({tier.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 13. SCHOLARSHIPS & GRANTS ROW */}
        <div
          className="filter-item-wrapper group bg-white transition-colors"
          id="wrapper-scholarship"
        >
          <button
            aria-expanded={expanded.scholarship}
            className="filter-row-header w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer"
            type="button"
            onClick={() => toggleAccordion('scholarship')}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Scholarships &amp; Grants
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={scholarshipBadge.active ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}
                id="scholarship-badge"
              >
                {scholarshipBadge.text}
              </span>
              <svg
                className={`chevron-icon w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.scholarship ? 'rotate-180' : ''
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

          {expanded.scholarship && (
            <div
              className="bg-slate-50/70 p-3 border-t border-slate-100"
              id="content-scholarship"
            >
              <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1">
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      checked={scholarshipOnly}
                      onChange={onToggleScholarship}
                      className={`scholarship-cb ${CHECKBOX_CLASS}`}
                      type="checkbox"
                      value="Scholarships"
                    />
                    <span className="text-xs text-slate-700">Scholarships Available</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({miscCounts.scholarships})</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      checked={feeWaiverOnly}
                      onChange={onToggleFeeWaiver}
                      className={`scholarship-cb ${CHECKBOX_CLASS}`}
                      type="checkbox"
                      value="Waiver"
                    />
                    <span className="text-xs text-slate-700">Application Fee Waiver</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({miscCounts.feeWaivers})</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* END: Filter Rows Master Container */}

      {/* BEGIN: Sticky Footer Action Bar */}
      <div
        className="px-4 py-3 bg-white border-t border-slate-200/90 flex items-center justify-between gap-3 shrink-0 select-none"
        data-purpose="bottom-action-bar"
      >
        <button
          className="px-2.5 py-2.5 rounded-lg text-[13px] font-medium text-slate-900 hover:text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all focus:outline-none cursor-pointer whitespace-nowrap"
          id="footer-clear-btn"
          type="button"
          onClick={handleResetAllClick}
        >
          Reset Filters
        </button>
        <button
          className={`px-5 py-2.5 rounded-lg bg-[#FBC500] hover:bg-[#ebb700] active:scale-[0.98] text-slate-950 font-medium text-[13px] transition-all duration-150 flex items-center justify-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 cursor-pointer ${
            applyConfirmed ? 'ring-2 ring-amber-400' : ''
          }`}
          id="apply-filters-btn"
          type="button"
          onClick={handleApplyClick}
        >
          <span>{applyConfirmed ? 'Filters Applied ✓' : 'Apply Filters'}</span>
        </button>
      </div>
      {/* END: Sticky Footer Action Bar */}
    </div>
  );
};

export default StitchCourseFilterSidebar;
