/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Hero V31 Unified Search Component
 * Fixed Interactive Multi-Select Dropdowns & Service Directory Panel
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { mockDestinations, mockUniversities, mockCourses } from '../../data/mockDatabase.ts';
import { APPROVED_QUALIFICATIONS } from '../../lib/qualification-config.ts';
import { ALL_IDP_SUBJECTS } from '../../lib/subject-config.ts';
import { NumberTicker } from '../ui/number-ticker.tsx';

interface UnifiedHeroSearchProps {
  onNavigate: (view: string, payload?: any) => void;
}

const ROTATING_SERVICES = [
  "Universities",
  "Courses",
  "Countries",
  "Cities",
  "Scholarships",
  "Accommodation",
  "Student Visa",
  "Tourist Visa",
  "Family Visa",
  "Admission Support",
  "School Admission",
  "Student Referral",
  "Dependent Visa",
  "Tourist Visa",
  "MM2H Program",
  "Health Insurance",
  "Flight Ticketing",
  "Airport Pickup",
  "Tour Packages",
  "Car Rental",
  "Courier Services",
  "Airbnb / Short Stay",
  "Money Transfer",
  "IELTS Preparation",
  "PTE Preparation",
  "Linguaskill Prep",
  "B2B Partnership"
];

const STUDY_LEVELS: readonly string[] = APPROVED_QUALIFICATIONS;

const FUNDING_OPTIONS = [
  "Fully funded",
  "Partial",
  "Tuition waiver",
  "Stipend",
  "Fee discount"
];

// Complete GEES + IDP Study Abroad Subject Directory
const ALL_SUBJECTS: readonly string[] = ALL_IDP_SUBJECTS;

// Directory Services List
interface ServiceDirectoryItem {
  title: string;
  slug: string;
  category: 'Education' | 'Visas' | 'Travel' | 'Language' | 'Other';
  badge?: string;
  view?: string;
  payload?: any;
}

const DIRECTORY_SERVICES: ServiceDirectoryItem[] = [
  // Education
  { title: 'Admission Support', slug: 'admission-support', category: 'Education', badge: 'Free Guidance' },
  { title: 'School Admission', slug: 'school-admission', category: 'Education', badge: 'Pre-University' },
  { title: 'Student Referral', slug: 'student-referral', category: 'Education', badge: 'Earn Rewards' },
  { title: 'Universities', slug: 'universities', category: 'Education', badge: '200+ Unis', view: 'universities' },
  { title: 'Courses', slug: 'courses', category: 'Education', badge: 'Course Finder', view: 'courses' },
  { title: 'Scholarships', slug: 'scholarships', category: 'Education', badge: 'Full & Partial', view: 'courses', payload: { scholarshipOnly: true } },

  // Visas
  { title: 'Student Visa', slug: 'student-visa-assistance', category: 'Visas', badge: '98% Approval' },
  { title: 'EMGS Visa Tracking', slug: 'track-visa', category: 'Visas', badge: 'Live Status', view: 'track-visa' },
  { title: 'Dependent Visa', slug: 'dependent-visa', category: 'Visas', badge: 'Family Cover' },
  { title: 'Tourist Visa', slug: 'tourist-visa', category: 'Visas', badge: 'Visitor Permit' },
  { title: 'Family Visit Visa', slug: 'tourist-visa', category: 'Visas', badge: 'Convocation' },
  { title: 'MM2H Residency', slug: 'mm2h-program', category: 'Visas', badge: 'Long-Term' },

  // Travel
  { title: 'Flight Ticketing', slug: 'flight-ticketing', category: 'Travel', badge: 'Extra Baggage' },
  { title: 'Airport Pickup', slug: 'airport-pickup', category: 'Travel', badge: 'Meet & Greet' },
  { title: 'Tour Packages', slug: 'tour-packages', category: 'Travel', badge: 'Holiday Breaks' },
  { title: 'Car Rental', slug: 'car-rental', category: 'Travel', badge: 'Student Hire' },
  { title: 'Courier Services', slug: 'courier-services', category: 'Travel', badge: 'Express Shipping' },

  // Language
  { title: 'IELTS Preparation', slug: 'ielts-preparation', category: 'Language', badge: 'Band 7.5+' },
  { title: 'PTE Preparation', slug: 'pte-preparation', category: 'Language', badge: 'Score 79+' },
  { title: 'Linguaskill Prep', slug: 'linguaskill-preparation', category: 'Language', badge: '48h Results' },

  // Other
  { title: 'Student Accommodation', slug: 'student-accommodation', category: 'Other', badge: 'Verified Stays' },
  { title: 'Health Insurance', slug: 'health-insurance', category: 'Other', badge: 'OSHC & NHS' },
  { title: 'Airbnb / Short Stay', slug: 'airbnb-short-stay', category: 'Other', badge: 'Flexible Stays' },
  { title: 'Money Transfer', slug: 'money-transfer', category: 'Other', badge: 'Zero Wire Fee' },
  { title: 'B2B Partnership', slug: 'b2b-partnership', category: 'Other', badge: 'Agent Portal' },
];

export const UnifiedHeroSearch: React.FC<UnifiedHeroSearchProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'scholarships' | 'universities' | 'services'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Independent Multi-Select State
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedFunding, setSelectedFunding] = useState<string[]>([]);

  // Popover Dropdown Open State: 'level' | 'destination' | 'field' | 'university' | 'funding' | null
  const [openDropdown, setOpenDropdown] = useState<'level' | 'destination' | 'field' | 'university' | 'funding' | null>(null);

  // Mobile/Tablet Stitch-style Filter Drawer Accordion State
  const [mobileExpanded, setMobileExpanded] = useState<
    Record<'destination' | 'university' | 'level' | 'field' | 'funding', boolean>
  >({
    destination: false,
    university: false,
    level: false,
    field: false,
    funding: false,
  });

  useEffect(() => {
    if (openDropdown) {
      setMobileExpanded({
        destination: openDropdown === 'destination',
        university: openDropdown === 'university',
        level: openDropdown === 'level',
        field: openDropdown === 'field',
        funding: openDropdown === 'funding',
      });
    }
  }, [openDropdown]);

  const toggleMobileAccordion = (key: 'destination' | 'university' | 'level' | 'field' | 'funding') => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasAnyMobileExpanded = Object.values(mobileExpanded).some(Boolean);

  const collapseAllMobileAccordions = () => {
    setMobileExpanded({
      destination: false,
      university: false,
      level: false,
      field: false,
      funding: false,
    });
  };

  const mobileResultsCount = useMemo(() => {
    if (activeTab === 'universities') {
      return mockUniversities.filter((u) => {
        const matchDest =
          selectedDestinations.length === 0 ||
          selectedDestinations.some((d) => d.toLowerCase() === u.country.toLowerCase());
        const matchUni =
          selectedUniversities.length === 0 || selectedUniversities.includes(u.name);
        return matchDest && matchUni;
      }).length;
    }

    const activeLevels = selectedLevels.filter((l) => l !== 'All Levels');
    return mockCourses.filter((c) => {
      const matchDest =
        selectedDestinations.length === 0 ||
        selectedDestinations.some(
          (d) => (c.country || '').toLowerCase() === d.toLowerCase()
        );
      const matchUni =
        selectedUniversities.length === 0 ||
        selectedUniversities.includes(c.universityName);
      const matchLevel =
        activeLevels.length === 0 ||
        activeLevels.some((lvl) => {
          const l = lvl.toLowerCase();
          const cl = (c.level || '').toLowerCase();
          if (l.includes('bachelor') || l.includes('undergraduate')) return cl === 'undergraduate';
          if (l.includes('master') || l.includes('postgraduate')) return cl === 'postgraduate';
          if (l.includes('phd') || l.includes('doctor')) return cl === 'doctorate';
          if (l.includes('foundation')) return cl === 'foundation';
          if (l.includes('advanced diploma')) return cl === 'advanced-diploma';
          if (l.includes('diploma')) return cl === 'diploma';
          if (l.includes('a-level')) return cl === 'a-level';
          if (l.includes('certificate')) return cl === 'certificate';
          return cl.includes(l) || l.includes(cl);
        });
      const matchField =
        selectedFields.length === 0 ||
        selectedFields.some((f) => {
          const fq = f.toLowerCase();
          return (
            (c.department || '').toLowerCase().includes(fq) ||
            (c.title || '').toLowerCase().includes(fq)
          );
        });
      return matchDest && matchUni && matchLevel && matchField;
    }).length;
  }, [activeTab, selectedDestinations, selectedUniversities, selectedLevels, selectedFields]);

  const toggleFunding = (fund: string) => {
    setSelectedFunding(prev =>
      prev.includes(fund) ? prev.filter(item => item !== fund) : [...prev, fund]
    );
  };

  // Chevron Service Directory State
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [directoryCategory, setDirectoryCategory] = useState<'All' | 'Education' | 'Visas' | 'Travel' | 'Language' | 'Other'>('All');

  // Field Filter Search
  const [fieldSearchQuery, setFieldSearchQuery] = useState('');
  const [destinationSearchQuery, setDestinationSearchQuery] = useState('');
  const [universitySearchQuery, setUniversitySearchQuery] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const filteredMockDestinations = useMemo(() => {
    if (!destinationSearchQuery.trim()) return mockDestinations;
    const q = destinationSearchQuery.toLowerCase().trim();
    return mockDestinations.filter(d => d.name.toLowerCase().includes(q));
  }, [destinationSearchQuery]);

  const filteredMockUniversities = useMemo(() => {
    const malaysiaFirst = [
      ...mockUniversities.filter(u => u.country === 'Malaysia'),
      ...mockUniversities.filter(u => u.country !== 'Malaysia'),
    ];
    const baseList =
      selectedDestinations.length > 0
        ? malaysiaFirst.filter(u =>
            selectedDestinations.some(d => d.toLowerCase() === u.country.toLowerCase())
          )
        : malaysiaFirst;
    if (!universitySearchQuery.trim()) return baseList;
    const q = universitySearchQuery.toLowerCase().trim();
    return baseList.filter(
      u => u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q)
    );
  }, [universitySearchQuery, selectedDestinations]);

  // Visual viewport, scroll lock, and bottom nav visibility event for mobile bottom sheet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gees-hero-search-sheet', { detail: { isOpen: openDropdown !== null } }));
    }
    if (openDropdown !== null) {
      document.body.style.overflow = 'hidden';
      const handleResize = () => {
        if (window.visualViewport) {
          const vv = window.visualViewport;
          const windowHeight = window.innerHeight;
          const currentHeight = vv.height;
          const offsetTop = vv.offsetTop;
          const keyboardH = windowHeight - currentHeight - offsetTop;
          setKeyboardOffset(Math.max(0, keyboardH));
          setViewportHeight(currentHeight);
        }
      };
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', handleResize);
        handleResize();
      }
      return () => {
        document.body.style.overflow = '';
        setKeyboardOffset(0);
        setViewportHeight(null);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gees-hero-search-sheet', { detail: { isOpen: false } }));
        }
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize);
          window.visualViewport.removeEventListener('scroll', handleResize);
        }
      };
    }
  }, [openDropdown]);

  // Typewriter Placeholder Rotation
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Outside Click & Escape Listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setIsDirectoryOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setIsDirectoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Typewriter placeholder rotation effect (2.8 seconds)
  useEffect(() => {
    if (isFocused || searchQuery) return;
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setPlaceholderIndex(prev => (prev + 1) % ROTATING_SERVICES.length);
        setIsAnimating(true);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, [isFocused, searchQuery]);

  // Immutable selection toggles
  const toggleLevel = (lvl: string) => {
    if (lvl === 'All Levels') {
      setSelectedLevels([]);
      return;
    }
    setSelectedLevels(prev => {
      const cleaned = prev.filter(item => item !== 'All Levels');
      return cleaned.includes(lvl) ? cleaned.filter(item => item !== lvl) : [...cleaned, lvl];
    });
  };

  const toggleDestination = (destName: string) => {
    setSelectedDestinations(prev =>
      prev.includes(destName) ? prev.filter(item => item !== destName) : [...prev, destName]
    );
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(item => item !== field) : [...prev, field]
    );
  };

  const toggleUniversity = (uniName: string) => {
    setSelectedUniversities(prev =>
      prev.includes(uniName) ? prev.filter(item => item !== uniName) : [...prev, uniName]
    );
  };

  // Filtered fields based on subject search input
  const filteredSubjects = useMemo(() => {
    if (!fieldSearchQuery.trim()) return ALL_SUBJECTS;
    const q = fieldSearchQuery.toLowerCase().trim();
    return ALL_SUBJECTS.filter(s => s.toLowerCase().includes(q));
  }, [fieldSearchQuery]);

  // Alphabetically grouped subjects (A, B, C...) for clean in-group dropdown browsing
  const groupedSubjects = useMemo(() => {
    const sorted = [...filteredSubjects].sort((a, b) => a.localeCompare(b));
    const map = new Map<string, string[]>();
    for (const sub of sorted) {
      const letter = (sub.trim().charAt(0) || '#').toUpperCase();
      const bucket = map.get(letter);
      if (bucket) {
        bucket.push(sub);
      } else {
        map.set(letter, [sub]);
      }
    }
    return Array.from(map.entries()).map(([letter, items]) => ({ letter, items }));
  }, [filteredSubjects]);

  // Alphabetically grouped universities (A, B, C...) for clean in-group dropdown browsing
  const groupedUniversities = useMemo(() => {
    const sorted = [...filteredMockUniversities].sort((a, b) => a.name.localeCompare(b.name));
    const map = new Map<string, typeof filteredMockUniversities>();
    for (const uni of sorted) {
      const letter = (uni.name.trim().charAt(0) || '#').toUpperCase();
      const bucket = map.get(letter);
      if (bucket) {
        bucket.push(uni);
      } else {
        map.set(letter, [uni]);
      }
    }
    return Array.from(map.entries()).map(([letter, items]) => ({ letter, items }));
  }, [filteredMockUniversities]);

  // Filtered directory services
  const filteredDirectoryServices = useMemo(() => {
    if (directoryCategory === 'All') return DIRECTORY_SERVICES;
    return DIRECTORY_SERVICES.filter(s => s.category === directoryCategory);
  }, [directoryCategory]);

  // Search Submission Handler
  const handleSearchAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const activeSpecificLevels = selectedLevels.filter(l => l !== 'All Levels');
    if (activeTab === 'courses') {
      const effectiveQuery = searchQuery.trim() || (selectedFields.length === 0 ? fieldSearchQuery.trim() : '');
      onNavigate('courses', {
        query: effectiveQuery,
        destination: selectedDestinations.length > 0 ? selectedDestinations.join(', ') : 'all',
        level: activeSpecificLevels.length > 0 ? activeSpecificLevels.join(', ') : 'all',
        field: selectedFields.length > 0 ? selectedFields.join(', ') : 'all',
      });
    } else if (activeTab === 'scholarships') {
      onNavigate('courses', {
        query: searchQuery,
        destination: selectedDestinations.length > 0 ? selectedDestinations.join(', ') : 'all',
        level: activeSpecificLevels.length > 0 ? activeSpecificLevels.join(', ') : 'all',
        funding: selectedFunding.length > 0 ? selectedFunding.join(', ') : 'all',
        scholarshipOnly: true,
      });
    } else if (activeTab === 'universities') {
      const effectiveUniQuery =
        searchQuery.trim() ||
        (selectedUniversities.length > 0
          ? selectedUniversities.join(', ')
          : universitySearchQuery.trim());
      onNavigate('universities', {
        query: effectiveUniQuery,
        destination: selectedDestinations.length > 0 ? selectedDestinations.join(', ') : 'all',
      });
    } else {
      onNavigate('services', searchQuery || 'admission-support');
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_18px_50px_rgba(15,23,42,0.10)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] relative z-30 transition-all duration-300">
      
      {/* 1. Universal Search Input Bar — Primary Visual Focal Point */}
      <div className="p-3.5 sm:p-5 bg-white dark:bg-slate-900 rounded-t-[15px] border-b border-slate-200/80 dark:border-slate-800 relative z-40">
        <form
          onSubmit={handleSearchAction}
          className="relative flex items-center gap-2 h-14 sm:h-[64px] pl-4 sm:pl-5 pr-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all duration-200"
        >
          {/* Prominent Search Icon */}
          <div className="text-[#0d1421] dark:text-[#FFCC00] mr-1 flex items-center justify-center shrink-0 pointer-events-none">
            <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Search Input with Fixed "Search" + Rotating Service */}
          <div className="relative flex-1 h-full flex items-center min-w-0">
            {!searchQuery && !isFocused && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm sm:text-[17px] text-slate-500 dark:text-slate-400 font-normal select-none z-10 whitespace-nowrap overflow-hidden">
                <span className="text-slate-950 dark:text-white font-semibold mr-1.5 shrink-0">Search</span>
                <span className={`inline-block transition-all duration-300 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                  {ROTATING_SERVICES[placeholderIndex]}
                </span>
              </div>
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-full bg-transparent border-0 text-sm sm:text-[17px] font-medium text-slate-950 dark:text-white placeholder:text-transparent focus:outline-none focus:ring-0 relative z-20"
              placeholder=""
              aria-label="Universal search"
            />
          </div>

          {/* Right Controls: Clear, Service Directory Toggle & Primary Search CTA */}
          <div className="flex items-center gap-1.5 shrink-0">
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                className="no-min-touch p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Functional Service Directory Chevron Button */}
            <button
              type="button"
              aria-label="Toggle Service Directory"
              aria-expanded={isDirectoryOpen}
              title="Browse quick directory"
              onClick={(e) => {
                e.stopPropagation();
                setIsDirectoryOpen(prev => !prev);
                setOpenDropdown(null);
              }}
              className="no-min-touch w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            >
              <svg className={`w-4 h-4 transition-transform duration-200 ${isDirectoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>

        {/* Categorized GEES Service Directory Popover Panel */}
        {isDirectoryOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-[calc(100%+8px)] left-3 right-3 sm:left-4 sm:right-4 z-50 bg-white dark:bg-slate-900 border border-[#e5e5ea] dark:border-slate-800 rounded-2xl shadow-2xl p-3.5 sm:p-4 transition-all duration-200"
          >
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[#e5e5ea] dark:border-slate-800 pb-2.5 mb-3 overflow-x-auto no-scrollbar">
              {(['All', 'Education', 'Visas', 'Travel', 'Language', 'Other'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDirectoryCategory(cat)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    directoryCategory === cat
                      ? 'bg-[#0a0f1d] text-white dark:bg-amber-500 dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Service Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[260px] overflow-y-auto custom-scrollbar p-1">
              {filteredDirectoryServices.map(srv => (
                <button
                  key={srv.title}
                  type="button"
                  onClick={() => {
                    setIsDirectoryOpen(false);
                    if (srv.view) {
                      onNavigate(srv.view, srv.payload || srv.slug);
                    } else {
                      onNavigate('services', srv.slug);
                    }
                  }}
                  className="p-2.5 sm:p-3 text-left rounded-xl border border-[#e2e4ea] dark:border-slate-800 bg-[#fafafc] dark:bg-slate-800/80 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-500/5 transition-all group cursor-pointer flex flex-col justify-between min-h-[68px]"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                      {srv.title}
                    </span>
                    <span className="text-xs text-amber-500 shrink-0">→</span>
                  </div>
                  {srv.badge && (
                    <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                      {srv.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Underline Navigation Tabs */}
      <div className="flex items-center border-b border-[#e5e5ea] dark:border-slate-800 px-4 sm:px-6 bg-white dark:bg-slate-900 overflow-x-auto no-scrollbar relative z-30">
        {[
          { id: 'courses', label: 'Courses' },
          { id: 'universities', label: 'Universities' },
          { id: 'scholarships', label: 'Scholarships' },
          { id: 'services', label: 'All Services' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setOpenDropdown(null);
                setIsDirectoryOpen(false);
              }}
              className={`relative px-4 py-3 text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-slate-950 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#fbb034] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Contextual Filters & Search Action */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 relative z-30">
        
        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 items-center">
            
            {/* 1. Merged Course Subject Input / Combobox */}
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown('field');
                  setIsDirectoryOpen(false);
                }}
                className={`w-full h-13 sm:h-14 px-4 rounded-xl border bg-white dark:bg-slate-800 flex items-center justify-between gap-2 transition-all cursor-text ${
                  openDropdown === 'field'
                    ? 'border-[#0a1120] dark:border-[#fbb034] ring-1 ring-[#0a1120] dark:ring-[#fbb034]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <input
                  type="text"
                  value={fieldSearchQuery}
                  onFocus={() => {
                    setOpenDropdown('field');
                    setIsDirectoryOpen(false);
                  }}
                  onChange={(e) => {
                    setFieldSearchQuery(e.target.value);
                    if (openDropdown !== 'field') setOpenDropdown('field');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setOpenDropdown(null);
                      handleSearchAction();
                    }
                  }}
                  placeholder="Enter course subject e.g. Law"
                  aria-label="Enter course subject e.g. Law"
                  className="min-w-0 flex-1 h-full bg-transparent border-0 p-0 text-sm sm:text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-0 truncate"
                />
                {selectedFields.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-[#111827] dark:bg-[#FFCC00] text-white dark:text-slate-950 text-xs font-semibold leading-none tracking-tight whitespace-nowrap tabular-nums shrink-0">
                    {selectedFields.length} selected
                  </span>
                )}
                {(selectedFields.length > 0 || fieldSearchQuery.trim().length > 0) && (
                  <button
                    type="button"
                    aria-label="Clear course subject"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFields([]);
                      setFieldSearchQuery('');
                    }}
                    className="no-min-touch p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Field of Study Popover (Alphabetical In-Group List) */}
              {openDropdown === 'field' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  aria-label="Course subjects"
                  className="hidden lg:flex absolute top-[calc(100%+6px)] left-0 min-w-full w-max max-w-[380px] z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden max-h-[320px] flex-col animate-in fade-in duration-150"
                >
                  <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[320px]">
                    {groupedSubjects.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-slate-400">
                        No subject matching &ldquo;{fieldSearchQuery}&rdquo;
                      </div>
                    ) : (
                      groupedSubjects.map((group, groupIdx) => (
                        <div key={group.letter}>
                          <div
                            className={`sticky top-0 z-10 px-4 py-2 bg-[#f8fafc] dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-700/80 ${
                              groupIdx === 0 ? 'border-t-0' : 'border-t'
                            } text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none`}
                          >
                            {group.letter}
                          </div>
                          <div>
                            {group.items.map((sub) => {
                              const isChecked = selectedFields.includes(sub);
                              return (
                                <div
                                  key={sub}
                                  role="option"
                                  aria-selected={isChecked}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleField(sub);
                                  }}
                                  className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none text-[15px] leading-snug ${
                                    isChecked
                                      ? 'bg-slate-100/90 dark:bg-slate-700/70 text-slate-950 dark:text-white font-semibold'
                                      : 'text-slate-800 dark:text-slate-100 font-normal hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                  }`}
                                >
                                  <span className="flex-1 break-words">{sub}</span>
                                  {isChecked && (
                                    <svg
                                      className="w-4 h-4 text-[#0a1120] dark:text-[#FFCC00] shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Merged Study Level Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'level'}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'level' ? null : 'level');
                  setIsDirectoryOpen(false);
                }}
                className={`w-full h-13 sm:h-14 px-4 rounded-xl border bg-white dark:bg-slate-800 text-sm sm:text-[15px] font-medium flex items-center justify-between gap-2 cursor-pointer text-left transition-all ${
                  openDropdown === 'level'
                    ? 'border-[#0a1120] dark:border-[#fbb034] ring-1 ring-[#0a1120] dark:ring-[#fbb034]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                  Select a study level
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedLevels.filter(l => l !== 'All Levels').length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-[#111827] dark:bg-[#FFCC00] text-white dark:text-slate-950 text-xs font-semibold leading-none tracking-tight whitespace-nowrap tabular-nums shrink-0">
                      {selectedLevels.filter(l => l !== 'All Levels').length} selected
                    </span>
                  )}
                  <svg className={`w-4 h-4 shrink-0 text-slate-600 dark:text-slate-300 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {/* Study Level Popover */}
              {openDropdown === 'level' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  aria-label="Study levels"
                  className="hidden lg:block absolute top-[calc(100%+6px)] left-0 min-w-full w-max max-w-[340px] z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-slate-100/80 dark:divide-slate-700/60 animate-in fade-in duration-150"
                >
                  {STUDY_LEVELS.map((lvl) => {
                    const isChecked =
                      lvl === 'All Levels'
                        ? selectedLevels.length === 0 || selectedLevels.includes('All Levels')
                        : selectedLevels.includes(lvl);
                    return (
                      <div
                        key={lvl}
                        role="option"
                        aria-selected={isChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLevel(lvl);
                        }}
                        className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none text-[15px] leading-snug ${
                          isChecked
                            ? 'bg-slate-100/90 dark:bg-slate-700/70 text-slate-950 dark:text-white font-semibold'
                            : 'text-slate-800 dark:text-slate-100 font-normal hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="flex-1 break-words">{lvl}</span>
                        {isChecked && (
                          <svg className="w-4 h-4 text-[#0a1120] dark:text-[#FFCC00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Merged Study Destination Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'destination'}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'destination' ? null : 'destination');
                  setIsDirectoryOpen(false);
                }}
                className={`w-full h-13 sm:h-14 px-4 rounded-xl border bg-white dark:bg-slate-800 text-sm sm:text-[15px] font-medium flex items-center justify-between gap-2 cursor-pointer text-left transition-all ${
                  openDropdown === 'destination'
                    ? 'border-[#0a1120] dark:border-[#fbb034] ring-1 ring-[#0a1120] dark:ring-[#fbb034]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                  Select a study destination
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedDestinations.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-[#111827] dark:bg-[#FFCC00] text-white dark:text-slate-950 text-xs font-semibold leading-none tracking-tight whitespace-nowrap tabular-nums shrink-0">
                      {selectedDestinations.length} selected
                    </span>
                  )}
                  <svg className={`w-4 h-4 shrink-0 text-slate-600 dark:text-slate-300 transition-transform ${openDropdown === 'destination' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {/* Destination Popover */}
              {openDropdown === 'destination' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  aria-label="Study destinations"
                  className="hidden lg:block absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden max-h-[280px] overflow-y-auto custom-scrollbar divide-y divide-slate-100/80 dark:divide-slate-700/60 animate-in fade-in duration-150"
                >
                  {mockDestinations.map((d) => {
                    const isChecked = selectedDestinations.includes(d.name);
                    return (
                      <div
                        key={d.code}
                        role="option"
                        aria-selected={isChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestination(d.name);
                        }}
                        className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none text-[15px] leading-snug ${
                          isChecked
                            ? 'bg-slate-100/90 dark:bg-slate-700/70 text-slate-950 dark:text-white font-semibold'
                            : 'text-slate-800 dark:text-slate-100 font-normal hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-base shrink-0">{d.flagEmoji}</span>
                          <span className="truncate">{d.name}</span>
                        </div>
                        {isChecked && (
                          <svg className="w-4 h-4 text-[#0a1120] dark:text-[#FFCC00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Search Action Button */}
            <div className="col-span-1 sm:col-span-3 md:col-span-1 flex items-center h-full">
              <button
                type="button"
                onClick={() => handleSearchAction()}
                className="w-full h-13 sm:h-14 rounded-xl bg-[#0a0f1d] hover:bg-[#151c30] text-white font-extrabold text-base tracking-tight flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>
        )}

        {/* SCHOLARSHIPS TAB */}
        {activeTab === 'scholarships' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 items-center">
            
            {/* 1. Merged Study Level Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'level'}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'level' ? null : 'level');
                  setIsDirectoryOpen(false);
                }}
                className={`w-full h-13 sm:h-14 px-4 rounded-xl border bg-white dark:bg-slate-800 text-sm sm:text-[15px] font-medium flex items-center justify-between gap-2 cursor-pointer text-left transition-all ${
                  openDropdown === 'level'
                    ? 'border-[#0a1120] dark:border-[#fbb034] ring-1 ring-[#0a1120] dark:ring-[#fbb034]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                  Select study level
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedLevels.filter(l => l !== 'All Levels').length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-[#111827] dark:bg-[#FFCC00] text-white dark:text-slate-950 text-xs font-semibold leading-none tracking-tight whitespace-nowrap tabular-nums shrink-0">
                      {selectedLevels.filter(l => l !== 'All Levels').length} selected
                    </span>
                  )}
                  <svg className={`w-4 h-4 shrink-0 text-slate-600 dark:text-slate-300 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {openDropdown === 'level' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  aria-label="Study levels"
                  className="hidden lg:block absolute top-[calc(100%+6px)] left-0 min-w-full w-max max-w-[340px] z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-slate-100/80 dark:divide-slate-700/60 animate-in fade-in duration-150"
                >
                  {STUDY_LEVELS.map((lvl) => {
                    const isChecked =
                      lvl === 'All Levels'
                        ? selectedLevels.length === 0 || selectedLevels.includes('All Levels')
                        : selectedLevels.includes(lvl);
                    return (
                      <div
                        key={lvl}
                        role="option"
                        aria-selected={isChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLevel(lvl);
                        }}
                        className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none text-[15px] leading-snug ${
                          isChecked
                            ? 'bg-slate-100/90 dark:bg-slate-700/70 text-slate-950 dark:text-white font-semibold'
                            : 'text-slate-800 dark:text-slate-100 font-normal hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="flex-1 break-words">{lvl}</span>
                        {isChecked && (
                          <svg className="w-4 h-4 text-[#0a1120] dark:text-[#FFCC00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Merged Study Destination Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'destination'}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'destination' ? null : 'destination');
                  setIsDirectoryOpen(false);
                }}
                className={`w-full h-13 sm:h-14 px-4 rounded-xl border bg-white dark:bg-slate-800 text-sm sm:text-[15px] font-medium flex items-center justify-between gap-2 cursor-pointer text-left transition-all ${
                  openDropdown === 'destination'
                    ? 'border-[#0a1120] dark:border-[#fbb034] ring-1 ring-[#0a1120] dark:ring-[#fbb034]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                  Select a study destination
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedDestinations.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-[#111827] dark:bg-[#FFCC00] text-white dark:text-slate-950 text-xs font-semibold leading-none tracking-tight whitespace-nowrap tabular-nums shrink-0">
                      {selectedDestinations.length} selected
                    </span>
                  )}
                  <svg className={`w-4 h-4 shrink-0 text-slate-600 dark:text-slate-300 transition-transform ${openDropdown === 'destination' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {openDropdown === 'destination' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  aria-label="Study destinations"
                  className="hidden lg:block absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden max-h-[280px] overflow-y-auto custom-scrollbar divide-y divide-slate-100/80 dark:divide-slate-700/60 animate-in fade-in duration-150"
                >
                  {mockDestinations.map((d) => {
                    const isChecked = selectedDestinations.includes(d.name);
                    return (
                      <div
                        key={d.code}
                        role="option"
                        aria-selected={isChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestination(d.name);
                        }}
                        className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none text-[15px] leading-snug ${
                          isChecked
                            ? 'bg-slate-100/90 dark:bg-slate-700/70 text-slate-950 dark:text-white font-semibold'
                            : 'text-slate-800 dark:text-slate-100 font-normal hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-base shrink-0">{d.flagEmoji}</span>
                          <span className="truncate">{d.name}</span>
                        </div>
                        {isChecked && (
                          <svg className="w-4 h-4 text-[#0a1120] dark:text-[#FFCC00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Merged Funding Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'funding'}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'funding' ? null : 'funding');
                  setIsDirectoryOpen(false);
                }}
                className={`w-full h-13 sm:h-14 px-4 rounded-xl border bg-white dark:bg-slate-800 text-sm sm:text-[15px] font-medium flex items-center justify-between gap-2 cursor-pointer text-left transition-all ${
                  openDropdown === 'funding'
                    ? 'border-[#0a1120] dark:border-[#fbb034] ring-1 ring-[#0a1120] dark:ring-[#fbb034]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                  Select funding
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedFunding.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-[#111827] dark:bg-[#FFCC00] text-white dark:text-slate-950 text-xs font-semibold leading-none tracking-tight whitespace-nowrap tabular-nums shrink-0">
                      {selectedFunding.length} selected
                    </span>
                  )}
                  <svg className={`w-4 h-4 shrink-0 text-slate-600 dark:text-slate-300 transition-transform ${openDropdown === 'funding' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {openDropdown === 'funding' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  aria-label="Funding options"
                  className="hidden lg:block absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden max-h-[280px] overflow-y-auto custom-scrollbar divide-y divide-slate-100/80 dark:divide-slate-700/60 animate-in fade-in duration-150"
                >
                  {FUNDING_OPTIONS.map((fund) => {
                    const isChecked = selectedFunding.includes(fund);
                    return (
                      <div
                        key={fund}
                        role="option"
                        aria-selected={isChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFunding(fund);
                        }}
                        className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none text-[15px] leading-snug ${
                          isChecked
                            ? 'bg-slate-100/90 dark:bg-slate-700/70 text-slate-950 dark:text-white font-semibold'
                            : 'text-slate-800 dark:text-slate-100 font-normal hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="flex-1 truncate">{fund}</span>
                        {isChecked && (
                          <svg className="w-4 h-4 text-[#0a1120] dark:text-[#FFCC00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Search Action */}
            <div className="col-span-1 sm:col-span-3 md:col-span-1 flex items-center h-full">
              <button
                type="button"
                onClick={() => handleSearchAction()}
                className="w-full h-13 sm:h-14 rounded-xl bg-[#0a0f1d] hover:bg-[#151c30] text-white font-extrabold text-base tracking-tight flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>
        )}

        {/* UNIVERSITIES TAB */}
        {activeTab === 'universities' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 items-center">
            
            {/* 1. Merged University Name Search / Combobox */}
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown('university');
                  setIsDirectoryOpen(false);
                }}
                className={`w-full h-13 sm:h-14 px-4 rounded-xl border bg-white dark:bg-slate-800 flex items-center justify-between gap-2 transition-all cursor-text ${
                  openDropdown === 'university'
                    ? 'border-[#0a1120] dark:border-[#fbb034] ring-1 ring-[#0a1120] dark:ring-[#fbb034]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <input
                  type="text"
                  value={universitySearchQuery}
                  onFocus={() => {
                    setOpenDropdown('university');
                    setIsDirectoryOpen(false);
                  }}
                  onChange={(e) => {
                    setUniversitySearchQuery(e.target.value);
                    if (openDropdown !== 'university') setOpenDropdown('university');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setOpenDropdown(null);
                      handleSearchAction();
                    }
                  }}
                  placeholder="Search by university name"
                  aria-label="Search by university name"
                  className="min-w-0 flex-1 h-full bg-transparent border-0 p-0 text-sm sm:text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-0 truncate"
                />
                {selectedUniversities.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-[#111827] dark:bg-[#FFCC00] text-white dark:text-slate-950 text-xs font-semibold leading-none tracking-tight whitespace-nowrap tabular-nums shrink-0">
                    {selectedUniversities.length} selected
                  </span>
                )}
                {(selectedUniversities.length > 0 || universitySearchQuery.trim().length > 0) && (
                  <button
                    type="button"
                    aria-label="Clear university search"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUniversities([]);
                      setUniversitySearchQuery('');
                    }}
                    className="no-min-touch p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>

              {openDropdown === 'university' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  aria-label="Universities"
                  className="hidden lg:flex absolute top-[calc(100%+6px)] left-0 min-w-full w-max max-w-[420px] z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden max-h-[320px] flex-col animate-in fade-in duration-150"
                >
                  <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[320px]">
                    {groupedUniversities.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-slate-400">
                        No university matching &ldquo;{universitySearchQuery}&rdquo;
                      </div>
                    ) : (
                      groupedUniversities.map((group, groupIdx) => (
                        <div key={group.letter}>
                          <div
                            className={`sticky top-0 z-10 px-4 py-2 bg-[#f8fafc] dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-700/80 ${
                              groupIdx === 0 ? 'border-t-0' : 'border-t'
                            } text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none`}
                          >
                            {group.letter}
                          </div>
                          <div>
                            {group.items.map((u) => {
                              const isChecked = selectedUniversities.includes(u.name);
                              return (
                                <div
                                  key={u.id}
                                  role="option"
                                  aria-selected={isChecked}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleUniversity(u.name);
                                  }}
                                  className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none text-[15px] leading-snug ${
                                    isChecked
                                      ? 'bg-slate-100/90 dark:bg-slate-700/70 text-slate-950 dark:text-white font-semibold'
                                      : 'text-slate-800 dark:text-slate-100 font-normal hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                  }`}
                                >
                                  <span className="flex-1 break-words">{u.name}</span>
                                  {isChecked && (
                                    <svg
                                      className="w-4 h-4 text-[#0a1120] dark:text-[#FFCC00] shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Merged Study Destination Dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'destination'}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'destination' ? null : 'destination');
                  setIsDirectoryOpen(false);
                }}
                className={`w-full h-13 sm:h-14 px-4 rounded-xl border bg-white dark:bg-slate-800 text-sm sm:text-[15px] font-medium flex items-center justify-between gap-2 cursor-pointer text-left transition-all ${
                  openDropdown === 'destination'
                    ? 'border-[#0a1120] dark:border-[#fbb034] ring-1 ring-[#0a1120] dark:ring-[#fbb034]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                  Select a study destination
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedDestinations.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-[#111827] dark:bg-[#FFCC00] text-white dark:text-slate-950 text-xs font-semibold leading-none tracking-tight whitespace-nowrap tabular-nums shrink-0">
                      {selectedDestinations.length} selected
                    </span>
                  )}
                  <svg className={`w-4 h-4 shrink-0 text-slate-600 dark:text-slate-300 transition-transform ${openDropdown === 'destination' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {openDropdown === 'destination' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  role="listbox"
                  aria-label="Study destinations"
                  className="hidden lg:block absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden max-h-[280px] overflow-y-auto custom-scrollbar divide-y divide-slate-100/80 dark:divide-slate-700/60 animate-in fade-in duration-150"
                >
                  {mockDestinations.map((d) => {
                    const isChecked = selectedDestinations.includes(d.name);
                    return (
                      <div
                        key={d.code}
                        role="option"
                        aria-selected={isChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestination(d.name);
                        }}
                        className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none text-[15px] leading-snug ${
                          isChecked
                            ? 'bg-slate-100/90 dark:bg-slate-700/70 text-slate-950 dark:text-white font-semibold'
                            : 'text-slate-800 dark:text-slate-100 font-normal hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-base shrink-0">{d.flagEmoji}</span>
                          <span className="truncate">{d.name}</span>
                        </div>
                        {isChecked && (
                          <svg className="w-4 h-4 text-[#0a1120] dark:text-[#FFCC00] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Search Action */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1 flex items-center h-full">
              <button
                type="button"
                onClick={() => handleSearchAction()}
                className="w-full h-13 sm:h-14 rounded-xl bg-[#0a0f1d] hover:bg-[#151c30] text-white font-extrabold text-base tracking-tight flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>
        )}

        {/* ALL SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Categorized GEES Services & Support
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DIRECTORY_SERVICES.slice(0, 8).map(s => (
                <button
                  key={s.slug + s.title}
                  type="button"
                  onClick={() => {
                    if (s.view) {
                      onNavigate(s.view, s.payload || s.slug);
                    } else {
                      onNavigate('services', s.slug);
                    }
                  }}
                  className="p-3 min-h-[44px] flex items-center text-left rounded-xl border border-[#e2e4ea] dark:border-slate-800 bg-[#fafafc] dark:bg-slate-800 hover:border-amber-500 text-xs font-bold text-slate-900 dark:text-white transition-all cursor-pointer truncate active:scale-[0.98]"
                >
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. Subtle, Low-Focus Horizontal Statistics Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-slate-50/75 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/80 rounded-b-[15px] relative z-20 opacity-85 hover:opacity-100 transition-opacity">
        <div className="grid grid-cols-2 min-[520px]:grid-cols-3 lg:flex lg:flex-row lg:items-center lg:justify-between gap-y-2 gap-x-3 lg:gap-2">
          {[
            { num: 100, symbol: "+", label: "Students Placed" },
            { num: 210, symbol: "+", label: "Partner Universities" },
            { num: 100, symbol: "+", label: "Campuses" },
            { num: 1000, symbol: "+", label: "Courses" },
            { num: 95, symbol: "%", label: "Visa Success" },
            { num: 15, symbol: "+", label: "Destinations" },
          ].map((stat, idx, arr) => (
            <React.Fragment key={stat.label}>
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-[12px] sm:text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 tracking-tight whitespace-nowrap leading-none tabular-nums">
                  <NumberTicker
                    value={stat.num}
                    delay={idx * 0.08}
                    className="!text-slate-500 dark:!text-slate-400 !tracking-tight font-semibold"
                  />
                  <span className="text-slate-400 dark:text-slate-500 font-semibold">{stat.symbol}</span>
                </span>
                <span className="text-[11px] sm:text-[11.5px] font-normal text-slate-400 dark:text-slate-500 whitespace-nowrap truncate leading-none">
                  {stat.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden lg:inline-block w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile & Tablet Stitch-Style Filter Drawer Modal */}
      {openDropdown !== null && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setOpenDropdown(null)}
          />

          {/* Bottom Sheet Card */}
          <div
            className="relative bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-300 transition-all sm:max-w-xl sm:mx-auto sm:w-full"
            style={{
              maxHeight: viewportHeight ? `${viewportHeight * 0.86}px` : '86vh',
              marginBottom: keyboardOffset > 0 ? `${keyboardOffset}px` : '0px',
            }}
          >
            {/* Dark Navy Stitch Header Bar */}
            <div className="bg-[#121927] px-4 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0 select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-amber-400 flex items-center justify-center shrink-0">
                  <svg
                    className="w-[18px] h-[18px]"
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
                <span className="text-sm font-bold tracking-wide text-white">
                  Filters
                </span>
                <span className="bg-[#FBC500] text-slate-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full shrink-0 tabular-nums">
                  {mobileResultsCount.toLocaleString()} results
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={collapseAllMobileAccordions}
                  aria-label="Collapse all filter sections"
                  title="Collapse all"
                  className={`no-min-touch w-8 h-8 rounded-lg flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-amber-400/70 cursor-pointer ${
                    hasAnyMobileExpanded
                      ? 'bg-white/10 text-amber-400 hover:bg-amber-400/20 hover:text-amber-300'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
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
                <button
                  type="button"
                  onClick={() => setOpenDropdown(null)}
                  className="no-min-touch w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Accordion Filter Rows Master Container */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
              {/* 1. Study destination row */}
              <div className="bg-white dark:bg-slate-900">
                <button
                  type="button"
                  aria-expanded={mobileExpanded.destination}
                  onClick={() => toggleMobileAccordion('destination')}
                  className="w-full min-h-[50px] px-4 py-3 flex items-center justify-between hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors focus:outline-none select-none text-left cursor-pointer group"
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
                    <span className="text-[13.5px] font-bold text-slate-800 dark:text-slate-100 tracking-tight shrink-0">
                      Study destination
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={
                        selectedDestinations.length > 0
                          ? 'px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700 text-amber-800 dark:text-amber-300 max-w-[130px] truncate'
                          : 'px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }
                    >
                      {selectedDestinations.length === 0
                        ? 'All'
                        : selectedDestinations.length === 1
                        ? selectedDestinations[0]
                        : `${selectedDestinations.length} selected`}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                        mobileExpanded.destination ? 'rotate-180' : ''
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

                {mobileExpanded.destination && (
                  <div className="bg-slate-50/70 dark:bg-slate-950/40 p-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" x2="16.65" y1="21" y2="16.65" />
                        </svg>
                        <input
                          type="text"
                          data-purpose="inset-filter-input"
                          value={destinationSearchQuery}
                          onChange={(e) => setDestinationSearchQuery(e.target.value)}
                          placeholder="Search destinations..."
                          className="w-full text-xs font-normal bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder-slate-400 text-slate-700 dark:text-slate-200"
                        />
                      </div>
                      <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-0.5 pr-0.5">
                        {filteredMockDestinations.map((d) => {
                          const isChecked = selectedDestinations.includes(d.name);
                          return (
                            <div
                              key={d.code}
                              onClick={() => toggleDestination(d.name)}
                              className="min-h-[42px] px-2.5 py-2 rounded-lg flex items-center gap-2.5 cursor-pointer select-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-[#fbb034] border-[#fbb034] text-slate-950'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                }`}
                              >
                                {isChecked && (
                                  <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm">{d.flagEmoji}</span>
                              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex-1 break-words">
                                {d.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. University row (Courses & Universities tabs) */}
              {(activeTab === 'courses' || activeTab === 'universities') && (
                <div className="bg-white dark:bg-slate-900">
                  <button
                    type="button"
                    aria-expanded={mobileExpanded.university}
                    onClick={() => toggleMobileAccordion('university')}
                    className="w-full min-h-[50px] px-4 py-3 flex items-center justify-between hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors focus:outline-none select-none text-left cursor-pointer group"
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
                      <span className="text-[13.5px] font-bold text-slate-800 dark:text-slate-100 tracking-tight shrink-0">
                        University
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={
                          selectedUniversities.length > 0
                            ? 'px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700 text-amber-800 dark:text-amber-300 max-w-[130px] truncate'
                            : 'px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }
                      >
                        {selectedUniversities.length === 0
                          ? 'All Universities'
                          : selectedUniversities.length === 1
                          ? selectedUniversities[0]
                          : `${selectedUniversities.length} selected`}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                          mobileExpanded.university ? 'rotate-180' : ''
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

                  {mobileExpanded.university && (
                    <div className="bg-slate-50/70 dark:bg-slate-950/40 p-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-2xs space-y-1.5">
                        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all">
                          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" x2="16.65" y1="21" y2="16.65" />
                          </svg>
                          <input
                            type="text"
                            data-purpose="inset-filter-input"
                            value={universitySearchQuery}
                            onChange={(e) => setUniversitySearchQuery(e.target.value)}
                            placeholder="Search universities..."
                            className="w-full text-xs font-normal bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder-slate-400 text-slate-700 dark:text-slate-200"
                          />
                        </div>
                        <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-0.5 pr-0.5">
                          {filteredMockUniversities.map((u) => {
                            const isChecked = selectedUniversities.includes(u.name);
                            return (
                              <div
                                key={u.id}
                                onClick={() => toggleUniversity(u.name)}
                                className="min-h-[42px] px-2.5 py-2 rounded-lg flex items-center gap-2.5 cursor-pointer select-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                    isChecked
                                      ? 'bg-[#fbb034] border-[#fbb034] text-slate-950'
                                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                  }`}
                                >
                                  {isChecked && (
                                    <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex-1 break-words">
                                  {u.name} <span className="text-slate-400">({u.country})</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Study level row (Courses & Scholarships tabs) */}
              {(activeTab === 'courses' || activeTab === 'scholarships') && (
                <div className="bg-white dark:bg-slate-900">
                  <button
                    type="button"
                    aria-expanded={mobileExpanded.level}
                    onClick={() => toggleMobileAccordion('level')}
                    className="w-full min-h-[50px] px-4 py-3 flex items-center justify-between hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors focus:outline-none select-none text-left cursor-pointer group"
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
                      <span className="text-[13.5px] font-bold text-slate-800 dark:text-slate-100 tracking-tight shrink-0">
                        Study level
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={
                          selectedLevels.filter((l) => l !== 'All Levels').length > 0
                            ? 'px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700 text-amber-800 dark:text-amber-300 max-w-[130px] truncate'
                            : 'px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }
                      >
                        {selectedLevels.filter((l) => l !== 'All Levels').length === 0
                          ? 'All Levels'
                          : selectedLevels.filter((l) => l !== 'All Levels').length === 1
                          ? selectedLevels.filter((l) => l !== 'All Levels')[0]
                          : `${selectedLevels.filter((l) => l !== 'All Levels').length} selected`}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                          mobileExpanded.level ? 'rotate-180' : ''
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

                  {mobileExpanded.level && (
                    <div className="bg-slate-50/70 dark:bg-slate-950/40 p-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-2xs max-h-56 overflow-y-auto custom-scrollbar space-y-0.5">
                        {STUDY_LEVELS.map((lvl) => {
                          const isChecked =
                            lvl === 'All Levels'
                              ? selectedLevels.length === 0 || selectedLevels.includes('All Levels')
                              : selectedLevels.includes(lvl);
                          return (
                            <div
                              key={lvl}
                              onClick={() => toggleLevel(lvl)}
                              className="min-h-[42px] px-2.5 py-2 rounded-lg flex items-center gap-2.5 cursor-pointer select-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-[#fbb034] border-[#fbb034] text-slate-950'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                }`}
                              >
                                {isChecked && (
                                  <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex-1 break-words">
                                {lvl}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Subject row (Courses tab) */}
              {activeTab === 'courses' && (
                <div className="bg-white dark:bg-slate-900">
                  <button
                    type="button"
                    aria-expanded={mobileExpanded.field}
                    onClick={() => toggleMobileAccordion('field')}
                    className="w-full min-h-[50px] px-4 py-3 flex items-center justify-between hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors focus:outline-none select-none text-left cursor-pointer group"
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
                      <span className="text-[13.5px] font-bold text-slate-800 dark:text-slate-100 tracking-tight shrink-0">
                        Subject
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={
                          selectedFields.length > 0
                            ? 'px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700 text-amber-800 dark:text-amber-300 max-w-[130px] truncate'
                            : 'px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }
                      >
                        {selectedFields.length === 0
                          ? 'All Fields'
                          : selectedFields.length === 1
                          ? selectedFields[0]
                          : `${selectedFields.length} selected`}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                          mobileExpanded.field ? 'rotate-180' : ''
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

                  {mobileExpanded.field && (
                    <div className="bg-slate-50/70 dark:bg-slate-950/40 p-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-2xs space-y-1.5">
                        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all">
                          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" x2="16.65" y1="21" y2="16.65" />
                          </svg>
                          <input
                            type="text"
                            data-purpose="inset-filter-input"
                            value={fieldSearchQuery}
                            onChange={(e) => setFieldSearchQuery(e.target.value)}
                            placeholder="Enter Subject(s)"
                            className="w-full text-xs font-normal bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder-slate-400 text-slate-700 dark:text-slate-200"
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-0.5 pr-0.5">
                          {filteredSubjects.map((sub) => {
                            const isChecked = selectedFields.includes(sub);
                            return (
                              <div
                                key={sub}
                                onClick={() => toggleField(sub)}
                                className="min-h-[42px] px-2.5 py-2 rounded-lg flex items-center gap-2.5 cursor-pointer select-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                    isChecked
                                      ? 'bg-[#fbb034] border-[#fbb034] text-slate-950'
                                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                  }`}
                                >
                                  {isChecked && (
                                    <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex-1 break-words">
                                  {sub}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Funding row (Scholarships tab) */}
              {activeTab === 'scholarships' && (
                <div className="bg-white dark:bg-slate-900">
                  <button
                    type="button"
                    aria-expanded={mobileExpanded.funding}
                    onClick={() => toggleMobileAccordion('funding')}
                    className="w-full min-h-[50px] px-4 py-3 flex items-center justify-between hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors focus:outline-none select-none text-left cursor-pointer group"
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
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      <span className="text-[13.5px] font-bold text-slate-800 dark:text-slate-100 tracking-tight shrink-0">
                        Funding
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={
                          selectedFunding.length > 0
                            ? 'px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700 text-amber-800 dark:text-amber-300 max-w-[130px] truncate'
                            : 'px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }
                      >
                        {selectedFunding.length === 0
                          ? 'Any'
                          : selectedFunding.length === 1
                          ? selectedFunding[0]
                          : `${selectedFunding.length} selected`}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                          mobileExpanded.funding ? 'rotate-180' : ''
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

                  {mobileExpanded.funding && (
                    <div className="bg-slate-50/70 dark:bg-slate-950/40 p-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 shadow-2xs space-y-0.5">
                        {FUNDING_OPTIONS.map((fund) => {
                          const isChecked = selectedFunding.includes(fund);
                          return (
                            <div
                              key={fund}
                              onClick={() => toggleFunding(fund)}
                              className="min-h-[42px] px-2.5 py-2 rounded-lg flex items-center gap-2.5 cursor-pointer select-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-[#fbb034] border-[#fbb034] text-slate-950'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                }`}
                              >
                                {isChecked && (
                                  <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex-1 break-words">
                                {fund}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Bottom Footer Action Bar */}
            <div
              className="px-4 py-3 border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-white dark:bg-slate-900 select-none"
              style={{
                paddingBottom:
                  keyboardOffset > 0 ? '12px' : 'max(12px, env(safe-area-inset-bottom, 12px))',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedLevels([]);
                  setSelectedDestinations([]);
                  setSelectedFields([]);
                  setSelectedUniversities([]);
                  setSelectedFunding([]);
                  setFieldSearchQuery('');
                  setDestinationSearchQuery('');
                  setUniversitySearchQuery('');
                }}
                className="px-2.5 py-2.5 rounded-lg text-[14px] font-medium text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all focus:outline-none cursor-pointer whitespace-nowrap"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setOpenDropdown(null)}
                className="px-5 py-2.5 rounded-lg bg-[#FBC500] hover:bg-[#ebb700] active:scale-[0.98] text-slate-950 font-medium text-[14px] transition-all duration-150 flex items-center justify-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
