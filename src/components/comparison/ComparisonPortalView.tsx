/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Side-by-Side Comparison Portal (Universities & Programmes)
 * Faithfully implements the clean TopUniversities-style comparison architecture:
 * - Breadcrumb + Display Heading + Dynamic Auto-Generated Summary with "Read more"
 * - Empty 2-slot VS cards OR populated 1-4 cards with circular dark "VS" dividers
 * - Centered-label striped light-gray specification rows
 * - Dynamic auto-generated FAQ accordion referencing the compared items
 * - Interactive Searchable Picker Modal for adding up to 4 Universities or Programmes
 */

import React, { useState, useMemo, useEffect } from 'react';
import { University, Course } from '../../types/index.ts';
import { mockUniversities, mockCourses } from '../../data/mockDatabase.ts';
import { useComparison, MAX_COMPARE_ITEMS } from '../../context/ComparisonContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';

interface ComparisonPortalViewProps {
  mode: 'universities' | 'programs';
  onNavigate: (view: string, payload?: any) => void;
  onRequestDetails: (contextInfo: string) => void;
}

// Helper: Derive clean world region from country name
function getRegionFromCountry(country: string): string {
  const c = (country || '').toLowerCase();
  if (['australia', 'new zealand'].some((k) => c.includes(k))) return 'Oceania';
  if (['usa', 'united states', 'canada'].some((k) => c.includes(k))) return 'North America';
  if (
    ['uk', 'united kingdom', 'ireland', 'germany', 'france', 'netherlands', 'sweden', 'finland', 'hungary', 'malta', 'cyprus', 'greece', 'italy', 'spain', 'switzerland'].some(
      (k) => c.includes(k)
    )
  ) {
    return 'Europe';
  }
  if (['mauritius', 'south africa', 'egypt'].some((k) => c.includes(k))) return 'Africa';
  return 'Asia';
}

// Helper: Extract concise degree credential from programme title
function extractDegreeName(course: Course): string {
  const title = course.title || '';
  const match = title.match(
    /\b(B\.?Sc\.?|M\.?Sc\.?|B\.?A\.?|M\.?A\.?|B\.?Eng\.?|M\.?Eng\.?|B\.?B\.?A\.?|M\.?B\.?A\.?|LL\.?B\.?|LL\.?M\.?|Ph\.?D\.?|B\.?Com\.?|B\.?Tech\.?|M\.?Tech\.?|B\.?S\.?|M\.?S\.?|B\.?Ed\.?|M\.?Ed\.?|MBBS|MD|BDS|PharmD)\b/i
  );
  if (match) return match[0].replace(/\.$/, '');
  if (course.level === 'undergraduate') return 'Bachelor';
  if (course.level === 'postgraduate') return 'Master';
  if (course.level === 'doctorate') return 'PhD / Doctorate';
  if (course.level === 'foundation') return 'Foundation';
  if (course.level === 'diploma') return 'Diploma';
  if (course.level === 'advanced-diploma') return 'Advanced Diploma';
  if (course.level === 'a-level') return 'A-Level';
  return 'Certificate';
}

// Helper: Format Study Level nicely
function formatStudyLevel(level: Course['level']): string {
  const map: Record<string, string> = {
    undergraduate: 'Bachelors',
    postgraduate: 'Masters',
    doctorate: 'Doctorate / PhD',
    foundation: 'Foundation',
    diploma: 'Diploma',
    'advanced-diploma': 'Advanced Diploma',
    'a-level': 'A-Level',
    certificate: 'Certificate',
  };
  return map[level] || level;
}

// Helper: Format natural English list ("A, B and C")
function formatNaturalList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

// Helper: Clean University Crest / Logo with resilient fallback
const UniversityCrest: React.FC<{
  name: string;
  logoUrl?: string;
  compact?: boolean;
}> = ({ name, logoUrl, compact = false }) => {
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => {
    const words = name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w && !['of', 'the', 'and', 'in', 'at', 'for'].includes(w.toLowerCase()));
    return (words.slice(0, 2).map((w) => w[0]).join('') || name.slice(0, 2)).toUpperCase();
  }, [name]);

  const sizeClass = compact ? 'w-11 h-11' : 'w-16 h-12';

  if (logoUrl && !imgError) {
    return (
      <div
        className={`${sizeClass} rounded-lg bg-white border border-slate-100 dark:border-slate-700 flex items-center justify-center p-1.5 overflow-hidden shrink-0`}
      >
        <img
          src={logoUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-200 text-xs tracking-tight shrink-0`}
    >
      {initials}
    </div>
  );
};

export const ComparisonPortalView: React.FC<ComparisonPortalViewProps> = ({
  mode,
  onNavigate,
  onRequestDetails,
}) => {
  const {
    comparedUniversities,
    comparedCourses,
    addCompareUniversity,
    removeCompareUniversity,
    addCompareCourse,
    removeCompareCourse,
    isUniversitySaved,
    toggleSaveUniversity,
  } = useComparison();

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatUSD, formatPriceString } = useCurrency();

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  // Add Item Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [pickerCountry, setPickerCountry] = useState<string>('all');

  // Reset UI toggles when mode switches
  useEffect(() => {
    setIsSummaryExpanded(false);
    setOpenFaqIndex(0);
    setPickerQuery('');
    setPickerCountry('all');
  }, [mode]);

  // Quick University lookup by ID for programme enrichment
  const universityById = useMemo(
    () => new Map(mockUniversities.map((u) => [u.id, u])),
    []
  );

  // Count courses per university
  const courseCountByUniId = useMemo(() => {
    const counts = new Map<string, number>();
    mockCourses.forEach((c) => {
      counts.set(c.universityId, (counts.get(c.universityId) || 0) + 1);
    });
    return counts;
  }, []);

  // Active list for current mode
  const isUniMode = mode === 'universities';
  const activeCount = isUniMode ? comparedUniversities.length : comparedCourses.length;
  const canAddMore = activeCount < MAX_COMPARE_ITEMS;

  // Determine how many visual columns to render in populated state:
  // If 1 item -> 2 columns (item + Add slot)
  // If 2 items -> 3 columns (item1, item2 + Add slot) — matches Screenshot 5!
  // If 3 items -> 4 columns (item1, item2, item3 + Add slot)
  // If 4 items -> 4 columns (all 4 items) — matches Screenshot 4!
  const showAddSlotInGrid = activeCount > 0 && canAddMore;
  const totalPopulatedCols = activeCount + (showAddSlotInGrid ? 1 : 0);

  // Available countries for Picker filter
  const pickerCountries = useMemo(() => {
    const set = new Set<string>();
    if (isUniMode) {
      mockUniversities.forEach((u) => {
        if (u.country) set.add(u.country);
      });
    } else {
      mockCourses.forEach((c) => {
        if (c.country) set.add(c.country);
      });
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [isUniMode]);

  // Filtered options inside Add Picker Modal
  const pickerUniversities = useMemo(() => {
    if (!isUniMode) return [];
    const q = pickerQuery.trim().toLowerCase();
    return mockUniversities
      .filter((u) => {
        if (pickerCountry !== 'all' && u.country !== pickerCountry) return false;
        if (!q) return true;
        return (
          u.name.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q) ||
          (u.type || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 60);
  }, [isUniMode, pickerQuery, pickerCountry]);

  const pickerCourses = useMemo(() => {
    if (isUniMode) return [];
    const q = pickerQuery.trim().toLowerCase();
    return mockCourses
      .filter((c) => {
        if (pickerCountry !== 'all' && c.country !== pickerCountry) return false;
        if (!q) return true;
        return (
          c.title.toLowerCase().includes(q) ||
          c.universityName.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          (c.country || '').toLowerCase().includes(q) ||
          (c.city || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 60);
  }, [isUniMode, pickerQuery, pickerCountry]);

  // Dynamic Summary Paragraph (matching TopUniversities Screenshots 4 & 5)
  const dynamicSummary = useMemo(() => {
    if (isUniMode) {
      if (comparedUniversities.length === 0) {
        return {
          short:
            "Are you undecided between universities? Not sure what criteria to consider when comparing two or more universities? GEES makes it easy with our 'Compare Universities' tool. Use it to compare partner universities based on their QS rankings, programmes offered, tuition fees, IELTS requirements, and admissions criteria to find the right fit for your goals.",
          full: '',
        };
      }
      const names = comparedUniversities.map((u) => u.name);
      const first = comparedUniversities[0];
      const others = comparedUniversities.slice(1).map((u) => u.name);
      const intro =
        others.length > 0
          ? `Discover how ${first.name} compares to ${formatNaturalList(others)}.`
          : `Explore key institutional insights for ${first.name} and add up to ${MAX_COMPARE_ITEMS - 1} more universities to compare side by side.`;

      const rankFacts = comparedUniversities
        .map((u) =>
          u.qsRank2027
            ? `${u.name} ranks #${u.qsRank2027} in QS World University Rankings`
            : `${u.name} is an accredited partner university in ${u.country}`
        )
        .join(', while ');

      const tuitionFacts = comparedUniversities
        .map(
          (u) =>
            `${u.name} averages ${formatUSD(u.avgTuitionAnnualUSD)}/year with ${courseCountByUniId.get(u.id) || u.popularPrograms.length} featured programmes`
        )
        .join('; ');

      const full = `${intro} ${rankFacts}. In terms of annual international tuition and programme breadth, ${tuitionFacts}. Compare ${formatNaturalList(names)} across every academic and admissions factor below.`;
      const short = full.length > 265 ? `${full.slice(0, 265).trim()}...` : full;
      return { short, full };
    } else {
      if (comparedCourses.length === 0) {
        return {
          short:
            "Are you trying to decide between multiple courses? Unsure which factors to consider? With GEES 'Compare Programmes' tool, it's never been easier to get a detailed comparison of academic programmes based on QS university ranking, duration, tuition fees, intakes, and entry criteria. Select and compare your preferred programmes to find the one that best matches your academic goals.",
          full: '',
        };
      }
      const first = comparedCourses[0];
      const others = comparedCourses.slice(1);
      const intro =
        others.length > 0
          ? `Discover how ${first.title} at ${first.universityName} compares to ${formatNaturalList(
              others.map((c) => `${c.title} at ${c.universityName}`)
            )}.`
          : `Review full academic specifications for ${first.title} at ${first.universityName} and add up to ${MAX_COMPARE_ITEMS - 1} more programmes to compare side by side.`;

      const details = comparedCourses
        .map((c) => {
          const rankText = c.qsRank2027 ? `QS #${c.qsRank2027}` : `${c.country}`;
          return `${c.title} at ${c.universityName} (${rankText}) has an annual tuition of ${formatPriceString(
            c.tuitionFeeLocal,
            c.annualFeeUSD
          )} over ${c.durationMonths} months`;
        })
        .join(', while ');

      const full = `${intro} ${details}. Review study mode, upcoming intakes, English requirements, and scholarship availability below.`;
      const short = full.length > 265 ? `${full.slice(0, 265).trim()}...` : full;
      return { short, full };
    }
  }, [isUniMode, comparedUniversities, comparedCourses, formatUSD, formatPriceString, courseCountByUniId]);

  // Comparison Rows Data Model (Centered Label + Striped Value Bar)
  const universityRows = useMemo(() => {
    if (!isUniMode || comparedUniversities.length === 0) return [];
    return [
      {
        label: 'Foundation Year',
        values: comparedUniversities.map((u) => (u.established ? String(u.established) : '–')),
      },
      {
        label: 'Primary Campus Region',
        values: comparedUniversities.map((u) => getRegionFromCountry(u.country)),
      },
      {
        label: 'Campus Location',
        values: comparedUniversities.map((u) => `${u.city}, ${u.country}`),
      },
      {
        label: 'QS WUR Rankings',
        values: comparedUniversities.map((u) => (u.qsRank2027 ? `#${u.qsRank2027}` : '–')),
      },
      {
        label: 'Status',
        values: comparedUniversities.map((u) => u.type || '–'),
      },
      {
        label: 'Programmes Listed',
        values: comparedUniversities.map((u) => {
          const cnt = courseCountByUniId.get(u.id) || u.popularPrograms.length;
          return cnt > 0 ? `${cnt} Programmes` : '–';
        }),
      },
      {
        label: 'Acceptance Rate',
        values: comparedUniversities.map((u) =>
          u.acceptanceRatePct ? `${u.acceptanceRatePct}%` : '–'
        ),
      },
      {
        label: 'Minimum IELTS Requirement',
        values: comparedUniversities.map((u) =>
          u.minIeltsScore ? `IELTS ${u.minIeltsScore}` : '–'
        ),
      },
      {
        label: 'Main Intakes',
        values: comparedUniversities.map((u) =>
          u.intakes && u.intakes.length > 0 ? u.intakes.slice(0, 3).join(', ') : '–'
        ),
      },
      {
        label: 'Campus Network',
        values: comparedUniversities.map((u) =>
          u.campuses && u.campuses.length > 0
            ? `${u.campuses.length} ${u.campuses.length === 1 ? 'Campus' : 'Campuses'}`
            : '1 Campus'
        ),
      },
      {
        label: 'Scholarships',
        values: comparedUniversities.map((u) => (u.scholarshipsAvailable ? 'Yes' : '–')),
      },
      {
        label: 'Tuition Fees (International) (Annual Avg)',
        values: comparedUniversities.map((u) =>
          u.avgTuitionAnnualUSD ? formatUSD(u.avgTuitionAnnualUSD) : '–'
        ),
      },
    ];
  }, [isUniMode, comparedUniversities, courseCountByUniId, formatUSD]);

  const programmeRows = useMemo(() => {
    if (isUniMode || comparedCourses.length === 0) return [];
    return [
      {
        label: 'Degree Name',
        values: comparedCourses.map((c) => extractDegreeName(c)),
      },
      {
        label: 'Study Level',
        values: comparedCourses.map((c) => formatStudyLevel(c.level)),
      },
      {
        label: 'Programme Type',
        values: comparedCourses.map((c) => c.studyMode || 'Full-Time'),
      },
      {
        label: 'Subject / Specialisation',
        values: comparedCourses.map((c) => c.department || '–'),
      },
      {
        label: 'Duration (Months)',
        values: comparedCourses.map((c) =>
          c.durationMonths ? `${c.durationMonths} months` : String(c.durationYears || '–')
        ),
      },
      {
        label: 'Campus Location',
        values: comparedCourses.map((c) =>
          c.city && c.country ? `${c.city}, ${c.country}` : c.country || '–'
        ),
      },
      {
        label: 'Upcoming Intakes',
        values: comparedCourses.map((c) =>
          c.intakes && c.intakes.length > 0 ? c.intakes.join(', ') : '–'
        ),
      },
      {
        label: 'Annual Tuition Fees (International)',
        values: comparedCourses.map((c) =>
          formatPriceString(c.tuitionFeeLocal, c.annualFeeUSD)
        ),
      },
      {
        label: 'Estimated Total Tuition',
        values: comparedCourses.map((c) => {
          if (c.totalTuitionUSD) return c.totalTuitionUSD;
          const years = Math.max(1, (c.durationMonths || 12) / 12);
          return formatUSD(Math.round(c.annualFeeUSD * years));
        }),
      },
      {
        label: 'Exam Type / English Requirement',
        values: comparedCourses.map((c) =>
          c.ieltsRequirement ? `IELTS ${c.ieltsRequirement}` : 'IELTS / PTE / TOEFL'
        ),
      },
      {
        label: 'Entry Requirements',
        values: comparedCourses.map(
          (c) => c.entryRequirements || 'Academic transcripts & English proficiency'
        ),
      },
      {
        label: 'Scholarships',
        values: comparedCourses.map((c) =>
          c.scholarshipCoveragePct && c.scholarshipCoveragePct > 0
            ? `Yes (Up to ${c.scholarshipCoveragePct}%)`
            : universityById.get(c.universityId)?.scholarshipsAvailable
              ? 'Yes'
              : 'No'
        ),
      },
      {
        label: 'QS World University Rankings',
        values: comparedCourses.map((c) => {
          const rank = c.qsRank2027 || universityById.get(c.universityId)?.qsRank2027;
          return rank ? `#${rank}` : '–';
        }),
      },
      {
        label: 'Institution Type',
        values: comparedCourses.map(
          (c) => c.universityType || universityById.get(c.universityId)?.type || '–'
        ),
      },
      {
        label: 'GEES Direct Partner',
        values: comparedCourses.map(() => 'Yes'),
      },
    ];
  }, [isUniMode, comparedCourses, universityById, formatPriceString, formatUSD]);

  // Dynamic Frequently Asked Questions (matching Screenshots 4 & 5)
  const dynamicFaqs = useMemo(() => {
    if (isUniMode) {
      if (comparedUniversities.length === 0) return [];
      const namesStr = formatNaturalList(comparedUniversities.map((u) => u.name));
      return [
        {
          q: `What is the QS World University Ranking for ${namesStr}?`,
          a: `In the latest QS World University Rankings, ${formatNaturalList(
            comparedUniversities.map((u) =>
              u.qsRank2027
                ? `${u.name} is ranked #${u.qsRank2027}`
                : `${u.name} is an accredited institution in ${u.country}`
            )
          )}.`,
        },
        {
          q: `What are the annual tuition costs for ${namesStr}?`,
          a: `Estimated annual international tuition fees are ${formatNaturalList(
            comparedUniversities.map(
              (u) => `${formatUSD(u.avgTuitionAnnualUSD)}/year at ${u.name}`
            )
          )}. Exact tuition depends on your chosen faculty and degree level.`,
        },
        {
          q: `What are the scholarship and financial aid options for ${namesStr}?`,
          a: `${formatNaturalList(
            comparedUniversities.map((u) =>
              u.scholarshipsAvailable
                ? `${u.name} offers merit and international student scholarships`
                : `${u.name} provides competitive standard tuition rates`
            )
          )}. Book a free consultation with GEES to check your exact scholarship eligibility.`,
        },
        {
          q: `What are the IELTS requirements and intakes for ${namesStr}?`,
          a: `${formatNaturalList(
            comparedUniversities.map(
              (u) =>
                `${u.name} requires a minimum IELTS ${u.minIeltsScore} with main intakes in ${u.intakes.join(
                  ', '
                )}`
            )
          )}.`,
        },
      ];
    } else {
      if (comparedCourses.length === 0) return [];
      const namesStr = formatNaturalList(comparedCourses.map((c) => c.title));
      return [
        {
          q: `What is the programme duration for ${namesStr}?`,
          a: `Typically, ${formatNaturalList(
            comparedCourses.map(
              (c) => `${c.title} at ${c.universityName} lasts for ${c.durationMonths} months`
            )
          )}. For detailed module structures, request full programme brochures from our counselors.`,
        },
        {
          q: `What are the tuition fees for ${namesStr}?`,
          a: `International annual tuition is approximately ${formatNaturalList(
            comparedCourses.map(
              (c) =>
                `${formatPriceString(c.tuitionFeeLocal, c.annualFeeUSD)} for ${c.title} (${c.universityName})`
            )
          )}.`,
        },
        {
          q: `What is the course structure (e.g. full-time / hybrid) for ${namesStr}?`,
          a: `${formatNaturalList(
            comparedCourses.map(
              (c) =>
                `${c.title} is delivered in ${c.studyMode || 'Full-Time'} mode with intakes in ${c.intakes.join(
                  ' & '
                )}`
            )
          )}.`,
        },
        {
          q: `Are there any scholarships available for studying ${namesStr}?`,
          a: `${formatNaturalList(
            comparedCourses.map((c) =>
              c.scholarshipCoveragePct && c.scholarshipCoveragePct > 0
                ? `${c.title} at ${c.universityName} offers up to ${c.scholarshipCoveragePct}% merit scholarship`
                : `${c.title} at ${c.universityName} may qualify for institutional bursaries`
            )
          )}. GEES assists with scholarship applications at zero service charge.`,
        },
      ];
    }
  }, [isUniMode, comparedUniversities, comparedCourses, formatUSD, formatPriceString]);

  const activeRows = isUniMode ? universityRows : programmeRows;

  // Grid column utility for 2, 3, or 4 columns (preserving minimum readable column width on mobile scroll)
  const gridColsClass =
    totalPopulatedCols <= 2
      ? 'grid-cols-2'
      : totalPopulatedCols === 3
        ? 'grid-cols-3'
        : 'grid-cols-4';

  const minTableWidthClass =
    totalPopulatedCols <= 2
      ? 'min-w-[540px]'
      : totalPopulatedCols === 3
        ? 'min-w-[720px]'
        : 'min-w-[880px]';

  return (
    <div className="w-full bg-white dark:bg-[#0B1329] min-h-[78vh] pb-28 transition-colors">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Breadcrumb + Quick Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="no-min-touch hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="material-symbols-outlined text-[15px] text-slate-400">
              chevron_right
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {isUniMode ? 'Compare Universities' : 'Compare Programmes'}
            </span>
          </nav>

          {/* Clean segmented switcher to jump between Compare Universities / Compare Programmes */}
          <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => onNavigate('compare-universities')}
              className={`no-min-touch px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isUniMode
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Universities ({comparedUniversities.length}/{MAX_COMPARE_ITEMS})
            </button>
            <button
              type="button"
              onClick={() => onNavigate('compare-programs')}
              className={`no-min-touch px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                !isUniMode
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Programmes ({comparedCourses.length}/{MAX_COMPARE_ITEMS})
            </button>
          </div>
        </div>

        {/* Page Title & Dynamic Intro Summary */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-[28px] sm:text-[36px] font-extrabold font-display tracking-tight text-slate-950 dark:text-white leading-tight mb-3 text-balance">
            {isUniMode ? 'Compare Universities' : 'Compare Programmes'}
          </h1>
          <p className="text-[13.5px] sm:text-[14.5px] leading-[1.65] text-slate-600 dark:text-slate-300 max-w-4xl">
            {isSummaryExpanded || !dynamicSummary.full
              ? dynamicSummary.full || dynamicSummary.short
              : dynamicSummary.short}
          </p>
          {dynamicSummary.full && dynamicSummary.full.length > 265 && (
            <button
              type="button"
              onClick={() => setIsSummaryExpanded((prev) => !prev)}
              className="no-min-touch mt-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0066cc] dark:hover:text-[#60a5fa] underline-offset-2 hover:underline cursor-pointer"
            >
              {isSummaryExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </header>

        {/* =====================================================================
            EMPTY STATE (0 items selected — Exact 2-slot VS Layout from Screenshots 2 & 3)
           ===================================================================== */}
        {activeCount === 0 ? (
          <div className="mb-12 sm:mb-16">
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
              {[0, 1].map((slotIdx) => (
                <button
                  key={slotIdx}
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="group min-h-[210px] sm:min-h-[240px] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-[#F7F9FB] via-[#FAFBFD] to-white dark:from-slate-900/90 dark:to-[#0B1329] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2.5 p-6 cursor-pointer"
                >
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-[#0066cc] dark:text-[#60a5fa] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-colors">
                    <span className="material-symbols-outlined text-[28px] font-light">add</span>
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#0066cc] dark:group-hover:text-[#60a5fa] transition-colors">
                    {isUniMode ? 'Add University' : 'Add Programme'}
                  </span>
                </button>
              ))}

              {/* Floating Dark Circular "vs" Badge on the Center Seam */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1E242B] dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold tracking-tight flex items-center justify-center shadow-md ring-4 ring-white dark:ring-[#0B1329] z-10"
              >
                vs
              </div>
            </div>

            {/* Quick browse links */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>Or browse our full directory and click Compare on any card:</span>
              <button
                type="button"
                onClick={() => onNavigate(isUniMode ? 'universities' : 'courses')}
                className="no-min-touch font-semibold text-[#0066cc] dark:text-[#60a5fa] hover:underline cursor-pointer"
              >
                {isUniMode ? 'Explore All Partner Universities →' : 'Explore All Programmes →'}
              </button>
            </div>
          </div>
        ) : (
          /* =====================================================================
             POPULATED COMPARISON MATRIX (1–4 items — Exact Layout from Screenshots 4 & 5)
             ===================================================================== */
          <div className="mb-12 sm:mb-16">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-3">
              <div className={minTableWidthClass}>
                {/* Header Comparison Cards Row with Floating Circular "vs" Dividers */}
                <div className={`grid ${gridColsClass} gap-3 relative mb-6 items-stretch`}>
                  {isUniMode
                    ? comparedUniversities.map((uni, idx) => {
                        const isSaved = isUniversitySaved(uni.id);
                        const hasNextCol = idx < totalPopulatedCols - 1;
                        return (
                          <div
                            key={uni.id}
                            className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-b from-[#F8FAFC] to-white dark:from-slate-900/90 dark:to-slate-900 p-4 flex flex-col justify-between text-center"
                          >
                            {/* Top-right Remove "×" */}
                            <button
                              type="button"
                              onClick={() => removeCompareUniversity(uni.id)}
                              aria-label={`Remove ${uni.name} from comparison`}
                              title="Remove from comparison"
                              className="no-min-touch absolute top-2.5 right-2.5 w-6 h-6 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>

                            {/* Crest & University Name */}
                            <div className="flex flex-col items-center pt-2 pb-4 gap-2.5">
                              <UniversityCrest name={uni.name} logoUrl={uni.logoUrl} />
                              <button
                                type="button"
                                onClick={() => onNavigate('universities', uni.slug)}
                                className="no-min-touch text-[13.5px] font-bold text-slate-900 dark:text-white hover:text-[#0066cc] dark:hover:text-[#60a5fa] leading-snug line-clamp-2 px-1 transition-colors cursor-pointer"
                              >
                                {uni.name}
                              </button>
                            </div>

                            {/* CTA + Shortlist */}
                            <div className="space-y-2.5">
                              <button
                                type="button"
                                onClick={() => onRequestDetails(`Details for ${uni.name}`)}
                                className="w-full py-2.5 px-3 rounded-lg bg-[#FFC700] hover:bg-[#fbb034] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  chat_bubble_outline
                                </span>
                                <span>Request More Details</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleSaveUniversity(uni.id)}
                                className={`no-min-touch w-full py-1 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                  isSaved
                                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <span
                                  className={`material-symbols-outlined text-[15px] ${
                                    isSaved ? 'text-rose-500' : 'text-[#0066cc] dark:text-[#60a5fa]'
                                  }`}
                                >
                                  {isSaved ? 'favorite' : 'favorite_border'}
                                </span>
                                <span>{isSaved ? 'Shortlisted' : 'Shortlist'}</span>
                              </button>
                            </div>

                            {/* Floating Circular "vs" Badge on Right Seam */}
                            {hasNextCol && (
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-[21px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1E242B] dark:bg-slate-100 text-white dark:text-slate-950 text-[11px] font-bold flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-[#0B1329] z-20"
                              >
                                vs
                              </div>
                            )}
                          </div>
                        );
                      })
                    : comparedCourses.map((course, idx) => {
                        const uni = universityById.get(course.universityId);
                        const isSaved = isInWishlist(course.id);
                        const hasNextCol = idx < totalPopulatedCols - 1;
                        return (
                          <div
                            key={course.id}
                            className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-b from-[#F8FAFC] to-white dark:from-slate-900/90 dark:to-slate-900 p-4 flex flex-col justify-between text-center"
                          >
                            {/* Top-right Remove "×" */}
                            <button
                              type="button"
                              onClick={() => removeCompareCourse(course.id)}
                              aria-label={`Remove ${course.title} from comparison`}
                              title="Remove from comparison"
                              className="no-min-touch absolute top-2.5 right-2.5 w-6 h-6 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>

                            {/* University Logo + Name + Programme Title (Exact Screenshot 5 layout) */}
                            <div className="flex flex-col items-center pt-1 pb-4 gap-2.5">
                              <div className="flex items-center justify-center gap-2.5 w-full pr-4">
                                <UniversityCrest
                                  name={course.universityName}
                                  logoUrl={uni?.logoUrl}
                                  compact
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (uni?.slug) onNavigate('universities', uni.slug);
                                  }}
                                  className="no-min-touch text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#0066cc] dark:hover:text-[#60a5fa] text-left leading-snug line-clamp-2 cursor-pointer"
                                >
                                  {course.universityName}
                                </button>
                              </div>
                              <h2 className="text-[13.5px] font-bold text-slate-950 dark:text-white leading-snug line-clamp-2 px-1">
                                {course.title}
                              </h2>
                            </div>

                            {/* CTA + Shortlist */}
                            <div className="space-y-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  onRequestDetails(
                                    `${course.title} at ${course.universityName}`
                                  )
                                }
                                className="w-full py-2.5 px-3 rounded-lg bg-[#FFC700] hover:bg-[#fbb034] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  chat_bubble_outline
                                </span>
                                <span>Request More Details</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleWishlist(course)}
                                className={`no-min-touch w-full py-1 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                  isSaved
                                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <span
                                  className={`material-symbols-outlined text-[15px] ${
                                    isSaved ? 'text-rose-500' : 'text-[#0066cc] dark:text-[#60a5fa]'
                                  }`}
                                >
                                  {isSaved ? 'favorite' : 'favorite_border'}
                                </span>
                                <span>{isSaved ? 'Shortlisted' : 'Shortlist'}</span>
                              </button>
                            </div>

                            {/* Floating Circular "vs" Badge on Right Seam */}
                            {hasNextCol && (
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-[21px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1E242B] dark:bg-slate-100 text-white dark:text-slate-950 text-[11px] font-bold flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-[#0B1329] z-20"
                              >
                                vs
                              </div>
                            )}
                          </div>
                        );
                      })}

                  {/* Empty "+ Add University / Programme" Slot Card when < 4 items */}
                  {showAddSlotInGrid && (
                    <button
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="group min-h-[195px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-[#F8FAFC] to-white dark:from-slate-900/70 dark:to-[#0B1329] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-2 p-5 cursor-pointer"
                    >
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-[#0066cc] dark:text-[#60a5fa] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                        <span className="material-symbols-outlined text-[24px]">add</span>
                      </span>
                      <span className="text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-[#0066cc] dark:group-hover:text-[#60a5fa]">
                        {isUniMode ? 'Add University' : 'Add Programme'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Centered-Label Striped Comparison Rows (Exact TopUniversities Style) */}
                <div className="space-y-3">
                  {activeRows.map((row) => (
                    <div key={row.label} className="w-full">
                      {/* Centered Metric Label */}
                      <div className="text-center text-[12.5px] sm:text-[13px] font-medium text-slate-600 dark:text-slate-400 py-2">
                        {row.label}
                      </div>

                      {/* Light Gray Value Strip Divided Equally Across Columns */}
                      <div
                        className={`grid ${gridColsClass} rounded-lg bg-[#F4F5F7] dark:bg-slate-800/70 py-3 px-2 items-center`}
                      >
                        {row.values.map((val, colIdx) => (
                          <div
                            key={`${row.label}-${colIdx}`}
                            className="px-3 text-center text-[13px] sm:text-[13.5px] font-semibold text-slate-900 dark:text-slate-100 tabular-nums leading-snug"
                          >
                            {val}
                          </div>
                        ))}
                        {showAddSlotInGrid && (
                          <div className="px-3 text-center text-[13px] font-medium text-slate-400 dark:text-slate-500">
                            –
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Frequently Asked Questions Accordion (Matching Screenshots 4 & 5) */}
            {dynamicFaqs.length > 0 && (
              <section className="mt-12 sm:mt-14" aria-label="Comparison Frequently Asked Questions">
                <h2 className="text-xl sm:text-[22px] font-extrabold text-slate-950 dark:text-white tracking-tight mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {dynamicFaqs.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl bg-[#F4F5F7] dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                          aria-expanded={isOpen}
                          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                        >
                          <span className="text-[13.5px] sm:text-[14.5px] font-semibold text-slate-900 dark:text-white leading-snug">
                            {item.q}
                          </span>
                          <span className="material-symbols-outlined text-[20px] text-slate-700 dark:text-slate-300 shrink-0">
                            {isOpen ? 'remove' : 'add'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 pt-0.5 text-[13px] sm:text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700/50">
                            <p className="pt-3">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Editorial "About GEES" Block (Matching Screenshots 2, 3, 4 & 5) */}
        <section className="pt-4 border-t border-slate-100 dark:border-slate-800/80 max-w-4xl">
          <h2 className="text-lg sm:text-[21px] font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            About GEES Global Education Expert Services
          </h2>
          <p className="text-[13.5px] sm:text-[14px] leading-[1.7] text-slate-600 dark:text-slate-300 mb-3">
            GEES is a trusted international student advisory platform connecting students with 200+ accredited partner universities across the UK, Australia, Malaysia, Canada, Europe, New Zealand, and beyond. Our comparison tool brings together QS World University Rankings, verified annual tuition fees, English requirements, intakes, and scholarship eligibility so you can make confident higher education decisions.
          </p>
          <p className="text-[13.5px] sm:text-[14px] leading-[1.7] text-slate-600 dark:text-slate-300">
            Need tailored guidance? Every comparison connects directly with GEES certified admission counselors for 100% free university shortlisting, offer applications, and student visa support.
          </p>
        </section>
      </div>

      {/* =====================================================================
          SEARCHABLE ADD UNIVERSITY / ADD PROGRAMME PICKER MODAL
         ===================================================================== */}
      {isPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/65 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
          onClick={() => setIsPickerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-2xl bg-white dark:bg-[#0F172A] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[86vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#232B32] text-white flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold leading-tight">
                  {isUniMode ? 'Add University to Compare' : 'Add Programme to Compare'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Selected {activeCount} of {MAX_COMPARE_ITEMS} slots
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                aria-label="Close selector modal"
                className="no-min-touch w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Search & Country Filter Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/70 dark:bg-slate-900/60">
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  autoFocus
                  placeholder={
                    isUniMode
                      ? 'Search universities by name, city, or country...'
                      : 'Search programmes by title, university, or subject...'
                  }
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <button
                  type="button"
                  onClick={() => setPickerCountry('all')}
                  className={`no-min-touch px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    pickerCountry === 'all'
                      ? 'bg-[#232B32] text-white dark:bg-white dark:text-slate-950'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All Countries
                </button>
                {pickerCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => setPickerCountry(country)}
                    className={`no-min-touch px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      pickerCountry === country
                        ? 'bg-[#232B32] text-white dark:bg-white dark:text-slate-950'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Results List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {isUniMode ? (
                pickerUniversities.length === 0 ? (
                  <p className="text-center text-sm text-slate-500 py-10">
                    No matching universities found. Try a different search keyword.
                  </p>
                ) : (
                  pickerUniversities.map((uni) => {
                    const alreadyAdded = comparedUniversities.some((u) => u.id === uni.id);
                    return (
                      <div
                        key={uni.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <UniversityCrest name={uni.name} logoUrl={uni.logoUrl} compact />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {uni.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                              <span>
                                {uni.city}, {uni.country}
                              </span>
                              {uni.qsRank2027 && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    QS #{uni.qsRank2027}
                                  </span>
                                </>
                              )}
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">
                                {formatUSD(uni.avgTuitionAnnualUSD)}/yr
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (alreadyAdded) {
                              removeCompareUniversity(uni.id);
                            } else {
                              const ok = addCompareUniversity(uni.id);
                              if (ok && activeCount + 1 >= MAX_COMPARE_ITEMS) {
                                setIsPickerOpen(false);
                              }
                            }
                          }}
                          className={`no-min-touch px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            alreadyAdded
                              ? 'bg-[#FFC700] text-slate-950'
                              : 'bg-slate-900 dark:bg-slate-700 hover:bg-[#0066cc] text-white'
                          }`}
                        >
                          {alreadyAdded ? 'Added ✓' : '+ Compare'}
                        </button>
                      </div>
                    );
                  })
                )
              ) : pickerCourses.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-10">
                  No matching programmes found. Try a different keyword or country.
                </p>
              ) : (
                pickerCourses.map((course) => {
                  const alreadyAdded = comparedCourses.some((c) => c.id === course.id);
                  const uni = universityById.get(course.universityId);
                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/70 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <UniversityCrest
                          name={course.universityName}
                          logoUrl={uni?.logoUrl}
                          compact
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                            <span className="truncate">{course.universityName}</span>
                            <span aria-hidden="true">·</span>
                            <span>{formatStudyLevel(course.level)}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">
                              {formatPriceString(course.tuitionFeeLocal, course.annualFeeUSD)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (alreadyAdded) {
                            removeCompareCourse(course.id);
                          } else {
                            const ok = addCompareCourse(course.id);
                            if (ok && activeCount + 1 >= MAX_COMPARE_ITEMS) {
                              setIsPickerOpen(false);
                            }
                          }
                        }}
                        className={`no-min-touch px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          alreadyAdded
                            ? 'bg-[#FFC700] text-slate-950'
                            : 'bg-slate-900 dark:bg-slate-700 hover:bg-[#0066cc] text-white'
                        }`}
                      >
                        {alreadyAdded ? 'Added ✓' : '+ Compare'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Select up to {MAX_COMPARE_ITEMS} {isUniMode ? 'universities' : 'programmes'} to compare
              </span>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="no-min-touch px-5 py-2 rounded-lg bg-[#FFC700] hover:bg-[#fbb034] text-slate-950 font-bold text-xs cursor-pointer transition-colors"
              >
                Done ({activeCount}/{MAX_COMPARE_ITEMS})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPortalView;
