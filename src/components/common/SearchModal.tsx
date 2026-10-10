/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Search & Intelligent Suggestions Modal
 * Features live text highlighting for universities, courses, and services,
 * with Web Speech API Voice Search integration.
 */

import React, { useState, useEffect, useRef } from 'react';
import { mockUniversities, mockCourses, mockServices } from '../../data/mockDatabase.ts';

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
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Check Web Speech API availability
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
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Microphone access denied. Please check your browser permissions.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please try speaking again.');
        } else {
          setSpeechError(`Voice search error: ${event.error}`);
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

  // Keyboard escape handler & auto-focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      inputRef.current?.focus();
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(t);
      };
    } else {
      // Stop listening if modal closes
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      setSpeechError(null);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isListening]);

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
      } catch (err) {
        // Handle case where recognition was already started or failed
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      }
    }
  };

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedUnis = q
    ? mockUniversities.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.country.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q)
      )
    : mockUniversities.slice(0, 4);

  const matchedCourses = q
    ? mockCourses.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.department.toLowerCase().includes(q) ||
        c.universityName.toLowerCase().includes(q)
      )
    : mockCourses.slice(0, 3);

  const matchedServices = q
    ? mockServices.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.desc.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      )
    : mockServices.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-8 sm:pt-24 px-3 sm:px-6">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5 sm:gap-3">
          <span className="material-symbols-outlined text-blue-600 text-[24px] sm:text-[26px]">search</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-base sm:text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-0"
            placeholder={isListening ? "Listening... Speak your search query..." : "Search universities, courses, countries, or scholarships..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {/* Voice Search Button (Microphone) */}
          <button
            type="button"
            onClick={toggleVoiceSearch}
            title={
              !speechSupported
                ? "Voice search not supported in browser"
                : isListening
                ? "Stop Voice Search"
                : "Search by Voice"
            }
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 relative ${
              isListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 ring-4 ring-red-500/30 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400'
            } ${!speechSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
              {isListening ? 'mic' : 'mic_none'}
            </span>
            {isListening && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a] animate-ping" />
            )}
          </button>

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search modal"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Listening Indicator Bar / Voice Error Messages */}
        {isListening && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-between text-xs text-red-600 dark:text-red-400 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold">Listening to voice input...</span>
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
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>{speechError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="font-bold cursor-pointer hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search Results Area */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Quick Suggestion Chips */}
          {!query && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Master in Data Science',
                  'UK Graduate Visa',
                  'Monash University',
                  'University of Auckland',
                  'Australia Subclass 500',
                  'Malaysia Student Pass'
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Universities Results with Highlighting */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              Universities ({matchedUnis.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchedUnis.map((uni) => (
                <button
                  key={uni.id}
                  onClick={() => {
                    onSelectResult('university', uni.id, uni.name);
                    onClose();
                  }}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all group cursor-pointer"
                >
                  <span className="text-2xl">{uni.flagEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                      <HighlightText text={uni.name} highlight={query} />
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      <HighlightText text={`${uni.city}, ${uni.country}`} highlight={query} /> • World Rank #{uni.rankingWorld}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-[18px]">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Courses Results with Highlighting */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              Programs & Degrees ({matchedCourses.length})
            </span>
            <div className="space-y-1.5">
              {matchedCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectResult('course', c.id, c.title);
                    onClose();
                  }}
                  className="w-full text-left flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all group cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                      <HighlightText text={c.title} highlight={query} />
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      <HighlightText text={c.universityName} highlight={query} /> • {c.level} • {c.durationMonths} Months
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 shrink-0 ml-3">
                    {c.tuitionFeeLocal || `$${c.annualFeeUSD.toLocaleString()}/yr`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Services Results with Highlighting */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              GEES Expert Services ({matchedServices.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchedServices.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectResult('service', s.id, s.title);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-blue-600 text-[20px]">{s.iconName || 'school'}</span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                      <HighlightText text={s.title} highlight={query} />
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    <HighlightText text={s.desc} highlight={query} />
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
