/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Universal Search V8 — Premium Mobile & Tablet Search
 * 
 * Features:
 * - Minimalist, native-app-style mobile & tablet search matching reference interaction
 * - Clean white background with generous, balanced spacing and borderless rows
 * - Compact initial state: Real locally stored search history (up to 4-5 items) with individual delete & Clear All
 * - Clean popular searches fallback when no history exists (up to 4 items, not oversized pills)
 * - Single relevance-ranked result list after typing (across Universities, Courses, Countries, Scholarships, Services)
 * - Strict maximum of 5 initial matches with compact "View all {count} results" action for additional matches
 * - iPhone opening (280ms cubic-bezier(0.22, 1, 0.36, 1)) and closing (190ms cubic-bezier(0.4, 0, 0.2, 1))
 * - iPad floating search panel (max-w-[660px], soft rounded corners, smooth entrance & exit)
 * - Critical keyboard-safe behavior: visualViewport CSS variables batching via RAF, body scroll lock, zero double-scrolling
 * - 16px minimum input font size to prevent iOS Safari auto-zoom
 * - Full Web Speech API voice search integration
 * - Complete preservation of desktop universal search design
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { mockUniversities, mockCourses, mockServices } from '../../data/mockDatabase.ts';
import { getAllApprovedDestinations } from '../../lib/country-config.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: string, id: string, name: string) => void;
}

// Declarations for Web Speech API SpeechRecognition
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// Unified search result item across all categories
interface UnifiedSearchItem {
  id: string;
  type: 'university' | 'course' | 'destination' | 'scholarship' | 'service';
  title: string;
  subtitle: string;
  categoryLabel: string;
  iconName?: string;
  flagEmoji?: string;
  score: number;
  extra?: string;
}

// LocalStorage key for recent searches
const RECENT_SEARCHES_STORAGE_KEY = 'gees_recent_searches_v8';

// Fallback popular searches when no recent history exists (max 4)
const DEFAULT_POPULAR_SEARCHES = [
  'Master in Data Science',
  'Study in UK',
  'Australia Subclass 500',
  'Malaysia Scholarships'
] as const;

// Helper to highlight matching characters/words in search results
const HighlightText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) return <>{text}</>;
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-amber-300 dark:bg-amber-500/40 text-slate-900 dark:text-amber-200 font-bold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  // Query & Voice state
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Active keyboard-navigated result index
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Real Locally-Stored Search History
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(s => typeof s === 'string' && s.trim().length > 0).slice(0, 5) : [];
    } catch {
      return [];
    }
  });

  // Responsive device checks based on threshold crossings only (avoids re-rendering during keyboard resize)
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 400
  );
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [isTablet, setIsTablet] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 640 && window.innerWidth < 1024 : false
  );
  const [isDesktop, setIsDesktop] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [isConstrainedHeight, setIsConstrainedHeight] = useState<boolean>(() => 
    typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) < 560 : false
  );

  // Animation Phase: 'unmounted' | 'entering' | 'entered' | 'exiting'
  const [animationPhase, setAnimationPhase] = useState<'unmounted' | 'entering' | 'entered' | 'exiting'>(
    isOpen ? 'entering' : 'unmounted'
  );

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterFrameRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Save term to recent searches
  const handleSaveRecent = useCallback((term: string) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== clean.toLowerCase());
      const next = [clean, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Safe fallback
      }
      return next;
    });
  }, []);

  // Remove individual recent search
  const handleRemoveRecent = useCallback((term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const next = prev.filter((t) => t !== term);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Safe fallback
      }
      return next;
    });
  }, []);

  // Clear all recent searches
  const handleClearAllRecent = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch {
      // Safe fallback
    }
  }, []);

  // 1. OPEN / CLOSE TRANSITION LIFECYCLE MANAGEMENT
  useEffect(() => {
    if (isOpen) {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }

      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        previousActiveElementRef.current = document.activeElement;
      }

      setAnimationPhase('entering');
      setFocusedIndex(-1);

      enterFrameRef.current = requestAnimationFrame(() => {
        enterFrameRef.current = requestAnimationFrame(() => {
          setAnimationPhase('entered');
          inputRef.current?.focus();
        });
      });
    } else {
      if (enterFrameRef.current) {
        cancelAnimationFrame(enterFrameRef.current);
        enterFrameRef.current = null;
      }

      if (animationPhase === 'entered' || animationPhase === 'entering') {
        setAnimationPhase('exiting');

        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
        }

        const exitDuration = prefersReducedMotion ? 50 : 190;
        exitTimeoutRef.current = setTimeout(() => {
          setAnimationPhase('unmounted');
          setQuery('');
          setSpeechError(null);
          if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
            previousActiveElementRef.current.focus();
            previousActiveElementRef.current = null;
          }
        }, exitDuration);
      }
    }

    return () => {
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      if (enterFrameRef.current) cancelAnimationFrame(enterFrameRef.current);
    };
  }, [isOpen, prefersReducedMotion]);

  // 2. DOCUMENT BODY SCROLL LOCK TO ELIMINATE DOUBLE-SCROLLING
  useEffect(() => {
    if (animationPhase === 'unmounted') return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [animationPhase !== 'unmounted']);

  // 3. WINDOW VISUAL VIEWPORT TRACKING VIA CSS VARIABLES FOR iOS/iPad
  useEffect(() => {
    if (animationPhase === 'unmounted') return;

    let rafId: number | null = null;

    const updateViewport = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const vv = window.visualViewport;
        const currentHeight = vv ? vv.height : window.innerHeight;
        const currentTop = vv ? vv.offsetTop : 0;
        const currentWidth = vv ? vv.width : window.innerWidth;

        if (containerRef.current) {
          containerRef.current.style.setProperty('--search-vv-height', `${currentHeight}px`);
          containerRef.current.style.setProperty('--search-vv-top', `${currentTop}px`);
          containerRef.current.style.setProperty('--search-vv-width', `${currentWidth}px`);
        }

        setViewportWidth(currentWidth);
        const nextIsMobile = currentWidth < 640;
        const nextIsTablet = currentWidth >= 640 && currentWidth < 1024;
        const nextIsDesktop = currentWidth >= 1024;
        const nextIsConstrained = currentHeight < 560;

        setIsMobile((prev) => (prev !== nextIsMobile ? nextIsMobile : prev));
        setIsTablet((prev) => (prev !== nextIsTablet ? nextIsTablet : prev));
        setIsDesktop((prev) => (prev !== nextIsDesktop ? nextIsDesktop : prev));
        setIsConstrainedHeight((prev) => (prev !== nextIsConstrained ? nextIsConstrained : prev));
      });
    };

    updateViewport();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport, { passive: true });
      window.visualViewport.addEventListener('scroll', updateViewport, { passive: true });
    }
    window.addEventListener('resize', updateViewport, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
        window.visualViewport.removeEventListener('scroll', updateViewport);
      }
      window.removeEventListener('resize', updateViewport);
    };
  }, [animationPhase]);

  // 4. WEB SPEECH API INITIALIZATION
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setQuery(transcript);
        setFocusedIndex(-1);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in settings.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please try speaking again.');
        } else {
          setSpeechError(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleVoiceSearch = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError('Voice search is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setSpeechError(null);
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 120);
      }
    }
  };

  // 5. RELEVANCE-RANKED SEARCH ACROSS ALL DOMAINS
  const q = query.trim().toLowerCase();

  // All approved destinations
  const allDestinations = useMemo(() => {
    try {
      return getAllApprovedDestinations();
    } catch {
      return [];
    }
  }, []);

  // Compute unified relevance-ranked list (Universities, Courses, Destinations, Scholarships, Services)
  const unifiedResults = useMemo<UnifiedSearchItem[]>(() => {
    if (!q) return [];

    const items: UnifiedSearchItem[] = [];

    // Helper: calculate match score
    const calcScore = (title: string, subtitle?: string, keywords?: string[]): number => {
      const normTitle = title.toLowerCase();
      let score = 0;

      if (normTitle === q) {
        score += 150;
      } else if (normTitle.startsWith(q)) {
        score += 100;
      } else if (normTitle.includes(` ${q}`) || normTitle.includes(`(${q}`)) {
        score += 75;
      } else if (normTitle.includes(q)) {
        score += 50;
      }

      if (subtitle) {
        const normSub = subtitle.toLowerCase();
        if (normSub.includes(q)) score += 30;
      }

      if (keywords) {
        for (const kw of keywords) {
          if (kw && kw.toLowerCase().includes(q)) {
            score += 25;
            break;
          }
        }
      }

      return score;
    };

    // 1. Universities
    mockUniversities.forEach((u) => {
      const score = calcScore(u.name, `${u.city}, ${u.country}`, [u.country, u.city]);
      if (score > 0) {
        items.push({
          id: u.id,
          type: 'university',
          title: u.name,
          subtitle: `${u.city}, ${u.country} • Rank #${u.rankingWorld}`,
          categoryLabel: 'University',
          flagEmoji: u.flagEmoji,
          iconName: 'school',
          score,
          extra: u.country
        });
      }
    });

    // 2. Courses
    mockCourses.forEach((c) => {
      const score = calcScore(c.title, `${c.universityName} • ${c.level}`, [c.department, c.universityName]);
      if (score > 0) {
        items.push({
          id: c.id,
          type: 'course',
          title: c.title,
          subtitle: `${c.universityName} • ${c.level} • ${c.durationMonths}m`,
          categoryLabel: 'Course',
          iconName: 'menu_book',
          score,
          extra: c.tuitionFeeLocal || `$${c.annualFeeUSD.toLocaleString()}/yr`
        });
      }
    });

    // 3. Destinations / Countries
    allDestinations.forEach((d) => {
      const score = calcScore(d.name, `Study in ${d.name} • ${d.unisCountText}`, [d.code, d.citiesText, 'destination', 'country']);
      if (score > 0) {
        items.push({
          id: d.name,
          type: 'destination',
          title: `Study in ${d.name}`,
          subtitle: `${d.studentsCountText} • ${d.unisCountText} • ${d.intakeText}`,
          categoryLabel: 'Country',
          flagEmoji: d.flagEmoji,
          iconName: 'public',
          score: score + 15, // Country boost when matched
          extra: d.code
        });
      }
    });

    // 4. Scholarships
    const isScholarshipSearch = q.includes('scholar') || q.includes('grant') || q.includes('fund') || q.includes('waiver');
    mockUniversities
      .filter((u) => u.scholarshipsAvailable)
      .slice(0, 10)
      .forEach((u) => {
        let score = 0;
        if (isScholarshipSearch) {
          score = 85;
          if (u.country.toLowerCase().includes(q.replace(/scholarship|scholarships/g, '').trim())) {
            score += 45;
          }
        } else {
          score = calcScore(`${u.name} Scholarship`, `Tuition fee grant & bursary in ${u.country}`);
        }

        if (score > 0) {
          items.push({
            id: u.id,
            type: 'scholarship',
            title: `${u.name} Scholarship`,
            subtitle: `Merit scholarship & tuition grant in ${u.country}`,
            categoryLabel: 'Scholarship',
            iconName: 'military_tech',
            score,
            extra: u.country
          });
        }
      });

    // 5. GEES Expert Services
    mockServices.forEach((s) => {
      const score = calcScore(s.title, s.desc, [s.category]);
      if (score > 0) {
        items.push({
          id: s.id,
          type: 'service',
          title: s.title,
          subtitle: s.desc,
          categoryLabel: 'Service',
          iconName: s.iconName || 'support_agent',
          score,
          extra: s.category
        });
      }
    });

    // Deduplicate by title & sort by score descending
    const seen = new Set<string>();
    const unique = items.filter((item) => {
      const key = `${item.type}-${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => b.score - a.score);
  }, [q, allDestinations]);

  // Total matching count across all items
  const totalMatchesCount = unifiedResults.length;

  // Mobile and tablet display: STRICTLY UP TO 5 RESULTS
  const mobileDisplayResults = useMemo(() => {
    return unifiedResults.slice(0, 5);
  }, [unifiedResults]);

  // Desktop preserved categories
  const matchedUnis = useMemo(() => {
    return q
      ? mockUniversities.filter(u => 
          u.name.toLowerCase().includes(q) || 
          u.country.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q)
        ).slice(0, 6)
      : mockUniversities.slice(0, 4);
  }, [q]);

  const matchedCourses = useMemo(() => {
    return q
      ? mockCourses.filter(c => 
          c.title.toLowerCase().includes(q) || 
          c.department.toLowerCase().includes(q) ||
          c.universityName.toLowerCase().includes(q)
        ).slice(0, 5)
      : mockCourses.slice(0, 3);
  }, [q]);

  const matchedServices = useMemo(() => {
    return q
      ? mockServices.filter(s => 
          s.title.toLowerCase().includes(q) || 
          s.desc.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        ).slice(0, 4)
      : mockServices.slice(0, 4);
  }, [q]);

  // Handle result selection safely with history saving
  const handleSelect = useCallback((type: string, id: string, name: string) => {
    if (name || query) {
      handleSaveRecent(name || query);
    }
    // For scholarships, route to the university detail where scholarship details live
    const resolvedType = type === 'scholarship' ? 'university' : type;
    onSelectResult(resolvedType, id, name);
    onClose();
  }, [handleSaveRecent, onSelectResult, onClose, query]);

  // "View all results" handler for mobile/tablet
  const handleViewAllResults = useCallback(() => {
    if (query) {
      handleSaveRecent(query);
    }
    onSelectResult('view-all', query, query);
    onClose();
  }, [handleSaveRecent, onSelectResult, onClose, query]);

  // Active items list for Arrow Up/Down navigation based on screen mode
  const activeKeyboardList = useMemo(() => {
    if (!isDesktop) {
      return mobileDisplayResults;
    }
    // Desktop flat items
    const list: { type: string; id: string; title: string }[] = [];
    matchedUnis.forEach((u) => list.push({ type: 'university', id: u.id, title: u.name }));
    matchedCourses.forEach((c) => list.push({ type: 'course', id: c.id, title: c.title }));
    matchedServices.forEach((s) => list.push({ type: 'service', id: s.id, title: s.title }));
    return list;
  }, [isDesktop, mobileDisplayResults, matchedUnis, matchedCourses, matchedServices]);

  // 6. ACCESSIBLE KEYBOARD SHORTCUTS (ArrowDown, ArrowUp, Enter, Escape)
  useEffect(() => {
    if (animationPhase === 'unmounted') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (activeKeyboardList.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev < activeKeyboardList.length - 1 ? prev + 1 : 0;
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : activeKeyboardList.length - 1;
          return next;
        });
      } else if (e.key === 'Enter') {
        if (focusedIndex >= 0 && focusedIndex < activeKeyboardList.length) {
          e.preventDefault();
          const selected = activeKeyboardList[focusedIndex];
          handleSelect(selected.type, selected.id, selected.title);
        } else if (q && !isDesktop) {
          e.preventDefault();
          handleViewAllResults();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animationPhase, activeKeyboardList, focusedIndex, handleSelect, handleViewAllResults, onClose, q, isDesktop]);

  // Scroll active keyboard item into view
  useEffect(() => {
    if (focusedIndex >= 0 && resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-result-index="${focusedIndex}"]`);
      if (activeEl instanceof HTMLElement) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex]);

  // Don't render anything if unmounted
  if (animationPhase === 'unmounted') return null;

  // Animation CSS styles based on active phase:
  // - Mobile: 280ms duration (translateY 12px -> 0, opacity 0 -> 1)
  // - Tablet: 290ms duration (translateY 10px -> 0, scale 0.98 -> 1, opacity 0 -> 1)
  // - Exit: 190ms (translateY 0 -> 6px, opacity 1 -> 0)
  const isEntering = animationPhase === 'entering';
  const isExiting = animationPhase === 'exiting';
  const isEntered = animationPhase === 'entered';

  const backdropStyle: React.CSSProperties = {
    opacity: isEntered ? 1 : 0,
    transition: prefersReducedMotion
      ? 'opacity 100ms ease'
      : isExiting
      ? 'opacity 190ms cubic-bezier(0.4, 0, 0.2, 1)'
      : 'opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)',
  };

  const modalTransform = prefersReducedMotion
    ? 'none'
    : isEntered
    ? 'translate3d(0, 0, 0) scale(1)'
    : isExiting
    ? 'translate3d(0, 6px, 0) scale(0.985)'
    : isMobile
    ? 'translate3d(0, 12px, 0) scale(1)'
    : 'translate3d(0, 10px, 0) scale(0.98)';

  const modalTransition = prefersReducedMotion
    ? 'opacity 100ms ease'
    : isEntered
    ? 'none' // Crucial: zero transition while in 'entered' state so keyboard viewport resize doesn't replay animation!
    : isExiting
    ? 'transform 190ms cubic-bezier(0.4, 0, 0.2, 1), opacity 190ms cubic-bezier(0.4, 0, 0.2, 1)'
    : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)';

  const modalStyle: React.CSSProperties = {
    transform: modalTransform,
    opacity: isEntered ? 1 : 0,
    transition: modalTransition,
    willChange: isEntered ? 'auto' : 'transform, opacity',
  };

  // Fixed container coordinates locked to visualViewport via CSS variables
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 'var(--search-vv-top, 0px)',
    left: 0,
    right: 0,
    height: 'var(--search-vv-height, 100dvh)',
    width: 'var(--search-vv-width, 100vw)',
    zIndex: 9999,
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Universal Search"
      style={{
        ...containerStyle,
        ['--search-vv-top' as any]: `${typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.offsetTop : 0}px`,
        ['--search-vv-height' as any]: `${typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) : 800}px`,
        ['--search-vv-width' as any]: `${typeof window !== 'undefined' ? (window.visualViewport?.width ?? window.innerWidth) : 400}px`,
      }}
      className={`flex flex-col items-center overflow-hidden touch-none ${
        isMobile
          ? 'justify-start'
          : isConstrainedHeight
          ? 'justify-start pt-2 px-3 sm:px-4'
          : 'justify-center p-4'
      }`}
    >
      {/* 1. Backdrop Overlay (Fade-in / Fade-out) */}
      <div
        onClick={onClose}
        style={backdropStyle}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs select-none"
        aria-hidden="true"
      />

      {/* 2. Main Modal Surface (Keyboard-Safe Flex Column) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={modalStyle}
        className={`relative z-10 w-full flex flex-col bg-white dark:bg-[#0f172a] shadow-2xl transition-colors ${
          isMobile
            ? 'h-full rounded-none border-0'
            : isConstrainedHeight
            ? 'max-w-[660px] max-h-[calc(100%-0.5rem)] rounded-2xl border border-slate-200 dark:border-slate-800'
            : isTablet
            ? 'max-w-[660px] max-h-[min(620px,82vh)] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/10'
            : 'max-w-3xl max-h-[min(650px,82vh)] rounded-3xl border border-slate-200/90 dark:border-slate-800'
        }`}
      >
        {/* =================================================================== */}
        {/* HEADER: Search Input Region (Pinned at top, 60-64px mobile/tablet)   */}
        {/* =================================================================== */}
        <div className="flex-shrink-0 pt-[max(0.65rem,env(safe-area-inset-top))] px-3.5 sm:px-5 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0f172a]">
          <div className="flex items-center gap-2 sm:gap-3 min-h-[44px]">
            {/* Back Arrow for Mobile or Search Icon for Tablet/Desktop */}
            {isMobile ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to page"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 dark:text-amber-400 shrink-0">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
            )}

            {/* Main Text Input with 16px minimum font size to prevent iOS zoom */}
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="search"
                inputMode="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className="w-full bg-transparent text-[16px] sm:text-[17px] font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-h-[44px] py-2 px-1"
                placeholder={isListening ? "Listening... Speak your query..." : "Search universities, courses, countries..."}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocusedIndex(-1);
                }}
              />
            </div>

            {/* Clear Query "X" Button (when text exists) */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setFocusedIndex(-1);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search text"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}

            {/* Voice Search Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceSearch}
              title={
                !speechSupported
                  ? "Voice search not supported"
                  : isListening
                  ? "Stop Listening"
                  : "Search by Voice"
              }
              aria-label="Search by Voice"
              className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 relative active:scale-95 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 ring-4 ring-red-500/30 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400'
              } ${!speechSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isListening ? 'mic' : 'mic_none'}
              </span>
              {isListening && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a] animate-ping" />
              )}
            </button>

            {/* Tablet / Desktop Close Button */}
            {!isMobile && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          {/* Listening Feedback / Error Notices */}
          {isListening && (
            <div className="mt-2 py-1.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between text-xs text-red-600 dark:text-red-400 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-semibold">Listening to voice input...</span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className="font-bold underline cursor-pointer hover:text-red-700"
              >
                Stop
              </button>
            </div>
          )}

          {speechError && (
            <div className="mt-2 py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">info</span>
                <span className="truncate">{speechError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSpeechError(null)}
                className="font-bold cursor-pointer hover:underline shrink-0 ml-2"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* BODY: Search Results Region                                         */}
        {/* =================================================================== */}
        <div
          ref={resultsContainerRef}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
          }}
          className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-3 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] custom-scrollbar"
        >
          {/* =============================================================== */}
          {/* A. MOBILE & TABLET NATIVE-APP V8 RESULTS INTERFACE (< 1024px)   */}
          {/* =============================================================== */}
          {!isDesktop && (
            <>
              {/* 1. INITIAL STATE (No query typed): Recent Searches or Popular Searches */}
              {!q && (
                <div className="space-y-1">
                  {recentSearches.length > 0 ? (
                    <>
                      {/* Recent Searches Header */}
                      <div className="px-2 py-1 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Recent Searches
                        </span>
                        <button
                          type="button"
                          onClick={handleClearAllRecent}
                          className="text-[12px] font-semibold text-blue-600 dark:text-amber-400 hover:underline min-h-[36px] flex items-center px-1 cursor-pointer active:scale-95"
                        >
                          Clear all
                        </button>
                      </div>

                      {/* Recent Search Rows (Up to 4-5 items) */}
                      <div className="space-y-0.5">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            onClick={() => {
                              setQuery(term);
                              inputRef.current?.focus();
                            }}
                            className="w-full min-h-[48px] px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 rounded-xl transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">
                                history
                              </span>
                              <span className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                                {term}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveRecent(term, e)}
                              aria-label={`Remove ${term} from history`}
                              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer shrink-0 ml-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Popular Searches Header */}
                      <div className="px-2 py-1">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Popular Searches
                        </span>
                      </div>

                      {/* Clean, Subtle Popular Rows (Up to 4 items) */}
                      <div className="space-y-0.5">
                        {DEFAULT_POPULAR_SEARCHES.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setQuery(term);
                              inputRef.current?.focus();
                            }}
                            className="w-full min-h-[48px] px-3 py-2 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 rounded-xl transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">
                                trending_up
                              </span>
                              <span className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                                {term}
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-amber-400 text-[18px] shrink-0">
                              north_west
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 2. RESULTS STATE WHEN TYPING: Single Relevance-Ranked List (Max 5 results) */}
              {q && (
                <div className="space-y-1">
                  {mobileDisplayResults.length > 0 ? (
                    <>
                      <div className="px-2 py-0.5 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Results ({totalMatchesCount})
                        </span>
                      </div>

                      {/* Relevance-Ranked Result Rows (Strict max 5) */}
                      <div className="space-y-1">
                        {mobileDisplayResults.map((item, idx) => {
                          const isKeyboardActive = focusedIndex === idx;

                          return (
                            <button
                              key={`${item.type}-${item.id}`}
                              type="button"
                              data-result-index={idx}
                              onClick={() => handleSelect(item.type, item.id, item.title)}
                              onMouseEnter={() => setFocusedIndex(idx)}
                              className={`w-full text-left min-h-[52px] sm:min-h-[56px] py-2.5 px-3 sm:px-4 rounded-xl flex items-center gap-3 transition-colors duration-120 cursor-pointer group ${
                                isKeyboardActive
                                  ? 'bg-amber-50 dark:bg-slate-800/90 ring-1 ring-amber-400/80 shadow-xs'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800'
                              }`}
                            >
                              {/* Small Category Icon */}
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base select-none bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
                                {item.flagEmoji ? (
                                  <span>{item.flagEmoji}</span>
                                ) : (
                                  <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-amber-400">
                                    {item.iconName || 'school'}
                                  </span>
                                )}
                              </div>

                              {/* Title & Concise Supporting Subtitle */}
                              <div className="flex-1 min-w-0 pr-1">
                                <h4 className="font-semibold text-[14px] sm:text-[15px] text-slate-900 dark:text-white leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-amber-400">
                                  <HighlightText text={item.title} highlight={query} />
                                </h4>
                                <p className="text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  <HighlightText text={item.subtitle} highlight={query} />
                                </p>
                              </div>

                              {/* Subtle Navigation Indicator */}
                              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-amber-400 text-[18px] shrink-0 transition-transform group-hover:translate-x-0.5">
                                chevron_right
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Compact "View all results" action if additional matches exist */}
                      {totalMatchesCount > 5 && (
                        <div className="pt-2 px-1">
                          <button
                            type="button"
                            onClick={handleViewAllResults}
                            className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-amber-400 font-semibold text-[13px] sm:text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-100 dark:border-slate-800/80 active:scale-[0.99]"
                          >
                            <span>View all {totalMatchesCount} results</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Clean Empty State */
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-2.5 px-4">
                      <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[22px]">search_off</span>
                      </div>
                      <h4 className="font-semibold text-[15px] text-slate-900 dark:text-white">
                        No results for "{query}"
                      </h4>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 max-w-xs">
                        Try searching for a country (e.g. "USA", "UK"), university, degree program, or scholarship.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* =============================================================== */}
          {/* B. PRESERVED DESKTOP SEARCH INTERFACE (>= 1024px)               */}
          {/* =============================================================== */}
          {isDesktop && (
            <div className="space-y-4 sm:space-y-5">
              {/* Default State: Popular Suggestions when input is empty on desktop */}
              {!q && (
                <div className="space-y-2">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                    Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {[
                      'Master in Data Science',
                      'UK Graduate Visa',
                      'Monash University',
                      'University of Wollongong',
                      'Dalhousie University',
                      'Australia Subclass 500',
                      'Malaysia Student Pass'
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setQuery(chip);
                          setFocusedIndex(-1);
                          inputRef.current?.focus();
                        }}
                        className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-amber-400 hover:text-slate-950 dark:hover:bg-[#fbb034] dark:hover:text-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center active:scale-95"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 1. Universities Results */}
              {matchedUnis.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Universities ({matchedUnis.length})
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Tap to explore</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {matchedUnis.map((uni, uIdx) => {
                      const isKeyboardActive = focusedIndex === uIdx;

                      return (
                        <button
                          key={uni.id}
                          type="button"
                          data-result-index={uIdx}
                          onClick={() => handleSelect('university', uni.id, uni.name)}
                          onMouseEnter={() => setFocusedIndex(uIdx)}
                          className={`min-h-[48px] w-full text-left flex items-center gap-3 p-3 rounded-2xl border transition-colors duration-120 group cursor-pointer ${
                            isKeyboardActive
                              ? 'border-amber-400 bg-amber-50 dark:bg-slate-800/90 shadow-sm'
                              : 'border-slate-100 dark:border-slate-800/80 hover:border-amber-400/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="text-2xl shrink-0 select-none" role="img" aria-label="Country flag">
                            {uni.flagEmoji}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-amber-400">
                              <HighlightText text={uni.name} highlight={query} />
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              <HighlightText text={`${uni.city}, ${uni.country}`} highlight={query} /> • Rank #{uni.rankingWorld}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 dark:group-hover:text-amber-400 text-[18px] shrink-0">
                            arrow_forward
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Courses & Programs Results */}
              {matchedCourses.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Programs & Degrees ({matchedCourses.length})
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Curated syllabus</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedCourses.map((c, cIdx) => {
                      const thisIdx = matchedUnis.length + cIdx;
                      const isKeyboardActive = focusedIndex === thisIdx;

                      return (
                        <button
                          key={c.id}
                          type="button"
                          data-result-index={thisIdx}
                          onClick={() => handleSelect('course', c.id, c.title)}
                          onMouseEnter={() => setFocusedIndex(thisIdx)}
                          className={`min-h-[48px] w-full text-left flex items-center justify-between p-3 rounded-2xl border transition-colors duration-120 group cursor-pointer ${
                            isKeyboardActive
                              ? 'border-amber-400 bg-amber-50 dark:bg-slate-800/90 shadow-sm'
                              : 'border-slate-100 dark:border-slate-800/80 hover:border-amber-400/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-amber-400">
                              <HighlightText text={c.title} highlight={query} />
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              <HighlightText text={c.universityName} highlight={query} /> • {c.level} • {c.durationMonths}m
                            </p>
                          </div>
                          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 shrink-0 ml-1">
                            {c.tuitionFeeLocal || `$${c.annualFeeUSD.toLocaleString()}/yr`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Services Results */}
              {matchedServices.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      GEES Expert Services ({matchedServices.length})
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Free support</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {matchedServices.map((s, sIdx) => {
                      const thisIdx = matchedUnis.length + matchedCourses.length + sIdx;
                      const isKeyboardActive = focusedIndex === thisIdx;

                      return (
                        <button
                          key={s.id}
                          type="button"
                          data-result-index={thisIdx}
                          onClick={() => handleSelect('service', s.id, s.title)}
                          onMouseEnter={() => setFocusedIndex(thisIdx)}
                          className={`min-h-[48px] w-full text-left p-3 rounded-2xl border transition-colors duration-120 group cursor-pointer ${
                            isKeyboardActive
                              ? 'border-amber-400 bg-amber-50 dark:bg-slate-800/90 shadow-sm'
                              : 'border-slate-100 dark:border-slate-800/80 hover:border-amber-400/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="material-symbols-outlined text-blue-600 dark:text-amber-400 text-[18px]">
                              {s.iconName || 'school'}
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-amber-400">
                              <HighlightText text={s.title} highlight={query} />
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            <HighlightText text={s.desc} highlight={query} />
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Desktop Empty State */}
              {q && matchedUnis.length === 0 && matchedCourses.length === 0 && matchedServices.length === 0 && (
                <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-2xl">search_off</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    No matching results for "{query}"
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Try searching for a university name, study destination (e.g. "UK", "Australia"), or degree program.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keyboard shortcut hint for desktop only (hidden on mobile and tablet) */}
        {isDesktop && (
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↓</kbd> to navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↵</kbd> to select</span>
              <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">ESC</kbd> to exit</span>
            </div>
            <span className="font-medium text-slate-500 dark:text-slate-400">GEES Universal Search</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
