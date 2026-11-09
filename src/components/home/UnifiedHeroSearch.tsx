/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Hero V31 Unified Search Component
 * Fixed Interactive Multi-Select Dropdowns & Service Directory Panel
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { mockDestinations, mockUniversities, mockCourses } from '../../data/mockDatabase.ts';

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

const STUDY_LEVELS = [
  "School",
  "English",
  "Diploma",
  "Foundation / Pathways",
  "Undergraduate (Bachelor’s)",
  "Postgraduate (Master’s)",
  "Doctorate (PhD)",
  "Vocational (VET)"
];

const FUNDING_OPTIONS = [
  "Fully funded",
  "Partial",
  "Tuition waiver",
  "Stipend",
  "Fee discount"
];

// Complete 125-subject dataset (including Vocational Education and Training, Womens Health, Zoology)
const ALL_SUBJECTS = [
  "Accounting & Finance",
  "Actuarial Studies",
  "Aerospace Engineering",
  "Agriculture & Environmental Forestry",
  "AI & Machine Learning",
  "Animation & Game Development",
  "Anthropology & Archaeology",
  "Applied Mathematics & Statistics",
  "Archaeology & Ancient History",
  "Architecture & Building Design",
  "Artificial Intelligence & Data Science",
  "Astrophysics & Astronomy",
  "Automotive & Transport Engineering",
  "Banking & Wealth Management",
  "Biochemistry & Molecular Biology",
  "Bioinformatics & Computational Biology",
  "Biological & Life Sciences",
  "Biomedical Engineering",
  "Biomedical Science",
  "Biotechnology",
  "Business Administration (BBA/MBA)",
  "Business Analytics & Intelligence",
  "Business & Management",
  "Chemical Engineering",
  "Chemistry & Chemical Sciences",
  "Civil & Structural Engineering",
  "Cloud Computing & DevOps",
  "Communications & Media Studies",
  "Computer Engineering",
  "Computer Science & IT",
  "Creative Writing & Literature",
  "Criminology & Criminal Justice",
  "Cybersecurity & Digital Forensics",
  "Data Analytics",
  "Data Science",
  "Dental Surgery & Dentistry",
  "Digital Marketing & E-Commerce",
  "Drama, Theater & Performing Arts",
  "Earth & Marine Sciences",
  "Ecology & Conservation Biology",
  "Economics & Finance",
  "Education & Teaching Pedagogy",
  "Electrical & Electronic Engineering",
  "Energy & Environmental Engineering",
  "Engineering & Technology",
  "English Literature & Linguistics",
  "Entrepreneurship & Innovation",
  "Environmental Science & Sustainability",
  "Event Management & PR",
  "Fashion & Textile Design",
  "Film, Video & Television Production",
  "Finance & Financial Markets",
  "Fine Arts & Visual Design",
  "Food Science & Human Nutrition",
  "Forensic Science & Criminology",
  "Game Design & Interactive Media",
  "Genetics & Genomics",
  "Geology & Earth Systems",
  "Global Governance & Public Policy",
  "Graphic & UI/UX Design",
  "Health & Medicine",
  "Health Informatics & E-Health",
  "Healthcare & Hospital Management",
  "History & International Studies",
  "Hospitality & Tourism Management",
  "Human Resource Management (HRM)",
  "Human-Computer Interaction (HCI)",
  "Industrial & Systems Engineering",
  "Information Systems & Technology",
  "Interior Architecture & Design",
  "International Business & Trade",
  "International Law & Human Rights",
  "International Relations & Diplomacy",
  "Journalism & Mass Communication",
  "Law & Legal Studies",
  "Logistics & Supply Chain Management",
  "Marine Biology & Oceanography",
  "Marketing & Brand Strategy",
  "Materials Science & Engineering",
  "Mechanical & Manufacturing Engineering",
  "Mechatronics & Robotics Engineering",
  "Media Production & Journalism",
  "Medical Laboratory Technology",
  "Medical Sciences & MBBS",
  "Microbiology & Immunology",
  "Music Production & Sound Design",
  "Nanotechnology & Advanced Materials",
  "Natural & Applied Sciences",
  "Neuroscience & Cognitive Science",
  "Nursing & Midwifery",
  "Nutrition & Dietetics",
  "Occupational Health & Safety",
  "Occupational Therapy",
  "Oceanography & Climate Science",
  "Optometry & Vision Science",
  "Petroleum & Mining Engineering",
  "Pharmaceutical Sciences",
  "Pharmacy",
  "Philosophy & Ethics",
  "Physics & Applied Physics",
  "Physiotherapy & Sports Rehab",
  "Political Science & Public Admin",
  "Project Management",
  "Psychology & Behavioral Science",
  "Public Health & Epidemiology",
  "Public Relations & Strategic Comm",
  "Quantity Surveying & Commercial Mgmt",
  "Real Estate & Property Management",
  "Renewable & Clean Energy Tech",
  "Robotics & Automation Engineering",
  "Social Work & Community Dev",
  "Social Sciences & Humanities",
  "Software Engineering",
  "Space Science & Satellite Tech",
  "Special Education & Inclusion",
  "Sports Science & Kinesiology",
  "Statistics & Predictive Modeling",
  "Sustainable Development & Environment",
  "Telecommunication Networks",
  "Urban Planning & Smart Cities",
  "Veterinary Medicine & Animal Care",
  "Vocational Education and Training",
  "Web Development & Mobile Apps",
  "Womens Health",
  "Zoology"
];

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
    if (!universitySearchQuery.trim()) return mockUniversities;
    const q = universitySearchQuery.toLowerCase().trim();
    return mockUniversities.filter(u => u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q));
  }, [universitySearchQuery]);

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
    setSelectedLevels(prev =>
      prev.includes(lvl) ? prev.filter(item => item !== lvl) : [...prev, lvl]
    );
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

  // Filtered directory services
  const filteredDirectoryServices = useMemo(() => {
    if (directoryCategory === 'All') return DIRECTORY_SERVICES;
    return DIRECTORY_SERVICES.filter(s => s.category === directoryCategory);
  }, [directoryCategory]);

  // Search Submission Handler
  const handleSearchAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeTab === 'courses') {
      onNavigate('courses', {
        query: searchQuery,
        destination: selectedDestinations.length > 0 ? selectedDestinations.join(', ') : 'all',
        level: selectedLevels.length > 0 ? selectedLevels.join(', ') : 'all',
        field: selectedFields.length > 0 ? selectedFields.join(', ') : 'all',
      });
    } else if (activeTab === 'scholarships') {
      onNavigate('courses', {
        query: searchQuery,
        destination: selectedDestinations.length > 0 ? selectedDestinations.join(', ') : 'all',
        level: selectedLevels.length > 0 ? selectedLevels.join(', ') : 'all',
        funding: selectedFunding.length > 0 ? selectedFunding.join(', ') : 'all',
        scholarshipOnly: true,
      });
    } else if (activeTab === 'universities') {
      onNavigate('universities', {
        query: searchQuery || (selectedUniversities.length > 0 ? selectedUniversities.join(', ') : ''),
        destination: selectedDestinations.length > 0 ? selectedDestinations.join(', ') : 'all',
      });
    } else {
      onNavigate('services', searchQuery || 'admission-support');
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-[#e5e5ea] dark:border-slate-800 shadow-xl relative z-30 transition-all duration-300">
      
      {/* 1. Universal Search Input Bar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-t-2xl border-b border-[#e5e5ea] dark:border-slate-800 relative z-40">
        <form onSubmit={handleSearchAction} className="relative flex items-center h-14 pl-3.5 pr-2 rounded-2xl sm:rounded-full bg-white dark:bg-slate-800/90 border border-[#e2e4ea] dark:border-slate-700 shadow-xs focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/15">
          
          {/* Gold Search Icon */}
          <div className="text-amber-500 dark:text-amber-400 mr-2.5 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Search Input with Fixed "Search" + Rotating Service */}
          <div className="relative flex-1 h-full flex items-center min-w-0">
            {!searchQuery && !isFocused && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal select-none z-10 whitespace-nowrap overflow-hidden">
                <span className="text-slate-900 dark:text-white font-medium mr-1.5 shrink-0">Search</span>
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
              className="w-full h-full bg-transparent border-0 text-sm sm:text-base text-slate-950 dark:text-white placeholder:text-transparent focus:outline-none focus:ring-0 relative z-20"
              placeholder=""
              aria-label="Universal search"
            />
          </div>

          {/* Right Icons: Microphone & Down Chevron Button */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              aria-label="Voice Search Integration"
              title="Voice Search (Microphone)"
              onClick={() => {
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in (window as any)) {
                  try {
                    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                    const recognition = new SpeechRecognition();
                    recognition.onresult = (event: any) => {
                      setSearchQuery(event.results[0][0].transcript);
                    };
                    recognition.start();
                  } catch {
                    alert("Voice search integration point ready.");
                  }
                } else {
                  alert("Voice search integration point (Microphone ready)");
                }
              }}
              className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Functional Chevron Button */}
            <button
              type="button"
              aria-label="Toggle Service Directory"
              aria-expanded={isDirectoryOpen}
              onClick={(e) => {
                e.stopPropagation();
                setIsDirectoryOpen(prev => !prev);
                setOpenDropdown(null);
              }}
              className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            >
              <svg className={`w-4.5 h-4.5 transition-transform duration-200 ${isDirectoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
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
      <div className="flex items-center border-b border-[#e5e5ea] dark:border-slate-800 px-4 sm:px-6 bg-[#fafafc] dark:bg-slate-900/80 overflow-x-auto no-scrollbar relative z-30">
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
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-b-2xl relative z-30">
        
        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 items-center">
            
            {/* Study Level Dropdown */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Qualification</label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'level' ? null : 'level');
                  setIsDirectoryOpen(false);
                }}
                className="w-full h-13 sm:h-16 px-3.5 rounded-xl border border-[#e2e4ea] dark:border-slate-700 bg-[#fafafc] dark:bg-slate-800 text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer text-left transition-all hover:border-amber-500"
              >
                <span className="truncate">
                  {selectedLevels.length === 0 ? <><span className="sm:hidden">Any</span><span className="hidden sm:inline">Any level</span></> : selectedLevels.join(', ')}
                </span>
                <svg className={`w-4 h-4 ml-2 shrink-0 text-slate-400 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Study Level Popover */}
              {openDropdown === 'level' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:block absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-[#e2e4ea] dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-[260px] overflow-y-auto custom-scrollbar animate-in fade-in duration-150"
                >
                  {STUDY_LEVELS.map((lvl) => {
                    const isChecked = selectedLevels.includes(lvl);
                    return (
                      <div
                        key={lvl}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLevel(lvl);
                        }}
                        className="min-h-[44px] px-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors select-none"
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isChecked && (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                          {lvl}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Destination Dropdown */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Destination</label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'destination' ? null : 'destination');
                  setIsDirectoryOpen(false);
                }}
                className="w-full h-13 sm:h-16 px-3.5 rounded-xl border border-[#e2e4ea] dark:border-slate-700 bg-[#fafafc] dark:bg-slate-800 text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer text-left transition-all hover:border-amber-500"
              >
                <span className="truncate">
                  {selectedDestinations.length === 0 ? <><span className="sm:hidden">Any</span><span className="hidden sm:inline">Any country</span></> : selectedDestinations.join(', ')}
                </span>
                <svg className={`w-4 h-4 ml-2 shrink-0 text-slate-400 transition-transform ${openDropdown === 'destination' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Destination Popover */}
              {openDropdown === 'destination' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:block absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-[#e2e4ea] dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-[260px] overflow-y-auto custom-scrollbar animate-in fade-in duration-150"
                >
                  {mockDestinations.map((d) => {
                    const isChecked = selectedDestinations.includes(d.name);
                    return (
                      <div
                        key={d.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestination(d.name);
                        }}
                        className="min-h-[44px] px-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors select-none"
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isChecked && (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-base mr-1">{d.flagEmoji}</span>
                        <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                          {d.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Field of Study Dropdown */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Courses</label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'field' ? null : 'field');
                  setIsDirectoryOpen(false);
                }}
                className="w-full h-13 sm:h-16 px-3.5 rounded-xl border border-[#e2e4ea] dark:border-slate-700 bg-[#fafafc] dark:bg-slate-800 text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer text-left transition-all hover:border-amber-500"
              >
                <span className="truncate">
                  {selectedFields.length === 0 ? <><span className="sm:hidden">Any</span><span className="hidden sm:inline">Any subject</span></> : selectedFields.join(', ')}
                </span>
                <svg className={`w-4 h-4 ml-2 shrink-0 text-slate-400 transition-transform ${openDropdown === 'field' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Field of Study Popover */}
              {openDropdown === 'field' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:block absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-[#e2e4ea] dark:border-slate-700 rounded-xl shadow-xl p-2.5 max-h-[280px] flex flex-col animate-in fade-in duration-150"
                >
                  {/* Search Filter Input inside Dropdown */}
                  <div className="mb-2 shrink-0">
                    <input
                      type="text"
                      value={fieldSearchQuery}
                      onChange={(e) => setFieldSearchQuery(e.target.value)}
                      placeholder="Search 125+ subjects..."
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-[#e2e4ea] dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Scrollable Subject Options */}
                  <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[210px] space-y-0.5">
                    {filteredSubjects.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        No subject matching "{fieldSearchQuery}"
                      </div>
                    ) : (
                      filteredSubjects.map((sub) => {
                        const isChecked = selectedFields.includes(sub);
                        return (
                          <div
                            key={sub}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleField(sub);
                            }}
                            className="min-h-[44px] px-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors select-none"
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                            }`}>
                              {isChecked && (
                                <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                              {sub}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Search Action Button */}
            <div className="col-span-3 md:col-span-1 flex items-end h-full pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => handleSearchAction()}
                className="w-full h-13 sm:h-16 rounded-xl bg-[#0a0f1d] hover:bg-[#151c30] text-white font-extrabold text-base tracking-tight flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
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
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 items-center">
            
            {/* Study Level */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Study Level</label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'level' ? null : 'level');
                  setIsDirectoryOpen(false);
                }}
                className="w-full h-13 sm:h-16 px-3.5 rounded-xl border border-[#e2e4ea] dark:border-slate-700 bg-[#fafafc] dark:bg-slate-800 text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer text-left transition-all hover:border-amber-500"
              >
                <span className="truncate">
                  {selectedLevels.length === 0 ? <><span className="sm:hidden">Any</span><span className="hidden sm:inline">Any level</span></> : selectedLevels.join(', ')}
                </span>
                <svg className={`w-4 h-4 ml-2 shrink-0 text-slate-400 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openDropdown === 'level' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-[#e2e4ea] dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-[260px] overflow-y-auto custom-scrollbar animate-in fade-in duration-150"
                >
                  {STUDY_LEVELS.map((lvl) => {
                    const isChecked = selectedLevels.includes(lvl);
                    return (
                      <div
                        key={lvl}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLevel(lvl);
                        }}
                        className="min-h-[44px] px-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors select-none"
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isChecked && (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                          {lvl}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Destination</label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'destination' ? null : 'destination');
                  setIsDirectoryOpen(false);
                }}
                className="w-full h-13 sm:h-16 px-3.5 rounded-xl border border-[#e2e4ea] dark:border-slate-700 bg-[#fafafc] dark:bg-slate-800 text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer text-left transition-all hover:border-amber-500"
              >
                <span className="truncate">
                  {selectedDestinations.length === 0 ? <><span className="sm:hidden">Any</span><span className="hidden sm:inline">Any country</span></> : selectedDestinations.join(', ')}
                </span>
                <svg className={`w-4 h-4 ml-2 shrink-0 text-slate-400 transition-transform ${openDropdown === 'destination' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openDropdown === 'destination' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-[#e2e4ea] dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-[260px] overflow-y-auto custom-scrollbar animate-in fade-in duration-150"
                >
                  {mockDestinations.map((d) => {
                    const isChecked = selectedDestinations.includes(d.name);
                    return (
                      <div
                        key={d.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestination(d.name);
                        }}
                        className="min-h-[44px] px-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors select-none"
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isChecked && (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-base mr-1">{d.flagEmoji}</span>
                        <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                          {d.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Funding */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Funding</label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'funding' ? null : 'funding');
                  setIsDirectoryOpen(false);
                }}
                className="w-full h-13 sm:h-16 px-3.5 rounded-xl border border-[#e2e4ea] dark:border-slate-700 bg-[#fafafc] dark:bg-slate-800 text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer text-left transition-all hover:border-amber-500"
              >
                <span className="truncate">
                  {selectedFunding.length === 0 ? <><span className="sm:hidden">Any</span><span className="hidden sm:inline">Any funding</span></> : selectedFunding.join(', ')}
                </span>
                <svg className={`w-4 h-4 ml-2 shrink-0 text-slate-400 transition-transform ${openDropdown === 'funding' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openDropdown === 'funding' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-[#e2e4ea] dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-[260px] overflow-y-auto custom-scrollbar animate-in fade-in duration-150"
                >
                  {FUNDING_OPTIONS.map((fund) => {
                    const isChecked = selectedFunding.includes(fund);
                    return (
                      <div
                        key={fund}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFunding(fund);
                        }}
                        className="min-h-[44px] px-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors select-none"
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isChecked && (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                          {fund}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search Action */}
            <div className="col-span-3 md:col-span-1 flex items-end h-full pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => handleSearchAction()}
                className="w-full h-13 sm:h-16 rounded-xl bg-[#0a0f1d] hover:bg-[#151c30] text-white font-extrabold text-base tracking-tight flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-center">
            
            {/* University Selection */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">University</label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'university' ? null : 'university');
                  setIsDirectoryOpen(false);
                }}
                className="w-full h-13 sm:h-16 px-3.5 rounded-xl border border-[#e2e4ea] dark:border-slate-700 bg-[#fafafc] dark:bg-slate-800 text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer text-left transition-all hover:border-amber-500"
              >
                <span className="truncate">
                  {selectedUniversities.length === 0 ? <><span className="sm:hidden">Choose</span><span className="hidden sm:inline">Choose a university</span></> : selectedUniversities.join(', ')}
                </span>
                <svg className={`w-4 h-4 ml-2 shrink-0 text-slate-400 transition-transform ${openDropdown === 'university' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openDropdown === 'university' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:block absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-[#e2e4ea] dark:border-slate-700 rounded-xl shadow-xl p-2.5 max-h-[280px] flex flex-col animate-in fade-in duration-150"
                >
                  <div className="mb-2 shrink-0">
                    <input
                      type="text"
                      value={universitySearchQuery}
                      onChange={(e) => setUniversitySearchQuery(e.target.value)}
                      placeholder="Search universities..."
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-[#e2e4ea] dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[210px] space-y-0.5">
                    {filteredMockUniversities.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        No university matching "{universitySearchQuery}"
                      </div>
                    ) : (
                      filteredMockUniversities.map((u) => {
                        const isChecked = selectedUniversities.includes(u.name);
                        return (
                          <div
                            key={u.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUniversity(u.name);
                            }}
                            className="min-h-[44px] px-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors select-none"
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                            }`}>
                              {isChecked && (
                                <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                              {u.name} ({u.country})
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Destination</label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(prev => prev === 'destination' ? null : 'destination');
                  setIsDirectoryOpen(false);
                }}
                className="w-full h-13 sm:h-16 px-3.5 rounded-xl border border-[#e2e4ea] dark:border-slate-700 bg-[#fafafc] dark:bg-slate-800 text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer text-left transition-all hover:border-amber-500"
              >
                <span className="truncate">
                  {selectedDestinations.length === 0 ? <><span className="sm:hidden">All</span><span className="hidden sm:inline">All Destinations</span></> : selectedDestinations.join(', ')}
                </span>
                <svg className={`w-4 h-4 ml-2 shrink-0 text-slate-400 transition-transform ${openDropdown === 'destination' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openDropdown === 'destination' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 border border-[#e2e4ea] dark:border-slate-700 rounded-xl shadow-xl p-2 max-h-[260px] overflow-y-auto custom-scrollbar animate-in fade-in duration-150"
                >
                  {mockDestinations.map((d) => {
                    const isChecked = selectedDestinations.includes(d.name);
                    return (
                      <div
                        key={d.code}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestination(d.name);
                        }}
                        className="min-h-[44px] px-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors select-none"
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isChecked && (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-base mr-1">{d.flagEmoji}</span>
                        <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                          {d.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search Action */}
            <div className="col-span-2 md:col-span-1 flex items-end h-full pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => handleSearchAction()}
                className="w-full h-13 sm:h-16 rounded-xl bg-[#0a0f1d] hover:bg-[#151c30] text-white font-extrabold text-base tracking-tight flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
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

      {/* Mobile Bottom Sheet Modal */}
      {openDropdown !== null && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setOpenDropdown(null)}
          />

          {/* Bottom Sheet Card */}
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300 transition-all"
            style={{
              maxHeight: viewportHeight ? `${viewportHeight * 0.85}px` : '85vh',
              paddingBottom: keyboardOffset > 0 ? `${Math.min(keyboardOffset, 32)}px` : 'env(safe-area-inset-bottom, 16px)',
              marginBottom: keyboardOffset > 0 ? `${keyboardOffset}px` : '0px'
            }}
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#0B132B] dark:text-white">
                  {openDropdown === 'level' && 'Select Qualification'}
                  {openDropdown === 'destination' && 'Select Destination'}
                  {openDropdown === 'field' && 'Select Courses'}
                  {openDropdown === 'university' && 'Select University'}
                </h3>
                {/* Count badge */}
                {((openDropdown === 'level' && selectedLevels.length > 0) ||
                  (openDropdown === 'destination' && selectedDestinations.length > 0) ||
                  (openDropdown === 'field' && selectedFields.length > 0) ||
                  (openDropdown === 'university' && selectedUniversities.length > 0)) && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {openDropdown === 'level' && selectedLevels.length}
                    {openDropdown === 'destination' && selectedDestinations.length}
                    {openDropdown === 'field' && selectedFields.length}
                    {openDropdown === 'university' && selectedUniversities.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpenDropdown(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close bottom sheet"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Optional Search Input for Destination or Field */}
            {openDropdown === 'field' && (
              <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <input
                  type="text"
                  value={fieldSearchQuery}
                  onChange={(e) => setFieldSearchQuery(e.target.value)}
                  placeholder="Search 125+ subjects..."
                  className="w-full px-4 py-3 text-sm border border-[#e2e4ea] dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbb034]"
                />
              </div>
            )}

            {openDropdown === 'destination' && (
              <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <input
                  type="text"
                  value={destinationSearchQuery}
                  onChange={(e) => setDestinationSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full px-4 py-3 text-sm border border-[#e2e4ea] dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbb034]"
                />
              </div>
            )}

            {openDropdown === 'university' && (
              <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <input
                  type="text"
                  value={universitySearchQuery}
                  onChange={(e) => setUniversitySearchQuery(e.target.value)}
                  placeholder="Search universities..."
                  className="w-full px-4 py-3 text-sm border border-[#e2e4ea] dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbb034]"
                />
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto flex-1 p-4 space-y-1.5 custom-scrollbar max-h-[35vh] sm:max-h-[50vh]">
              {openDropdown === 'level' && STUDY_LEVELS.map(lvl => {
                const isChecked = selectedLevels.includes(lvl);
                return (
                  <div
                    key={lvl}
                    onClick={() => toggleLevel(lvl)}
                    className="min-h-[48px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {isChecked && (
                        <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                      {lvl}
                    </span>
                  </div>
                );
              })}

              {openDropdown === 'destination' && filteredMockDestinations.map(d => {
                const isChecked = selectedDestinations.includes(d.name);
                return (
                  <div
                    key={d.code}
                    onClick={() => toggleDestination(d.name)}
                    className="min-h-[48px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {isChecked && (
                        <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-base mr-1">{d.flagEmoji}</span>
                    <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                      {d.name}
                    </span>
                  </div>
                );
              })}

              {openDropdown === 'field' && filteredSubjects.map(sub => {
                const isChecked = selectedFields.includes(sub);
                return (
                  <div
                    key={sub}
                    onClick={() => toggleField(sub)}
                    className="min-h-[48px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {isChecked && (
                        <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                      {sub}
                    </span>
                  </div>
                );
              })}

              {openDropdown === 'university' && filteredMockUniversities.map(u => {
                const isChecked = selectedUniversities.includes(u.name);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUniversity(u.name)}
                    className="min-h-[48px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? 'bg-[#fbb034] border-[#fbb034] text-slate-950' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {isChecked && (
                        <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white flex-1 truncate">
                      {u.name} ({u.country})
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer with Clear and Apply buttons */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-white dark:bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  if (openDropdown === 'level') setSelectedLevels([]);
                  if (openDropdown === 'destination') setSelectedDestinations([]);
                  if (openDropdown === 'field') setSelectedFields([]);
                  if (openDropdown === 'university') setSelectedUniversities([]);
                }}
                className="px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setOpenDropdown(null)}
                className="flex-1 bg-[#0a0f1d] hover:bg-[#151c30] text-white font-extrabold text-base py-3 px-6 rounded-xl shadow-md cursor-pointer transition-all text-center"
              >
                Apply Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
