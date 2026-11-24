/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Comparison & University Shortlist Context
 * Manages side-by-side comparison state for up to 4 Universities and 4 Programmes,
 * persisted in localStorage, plus slide-up bottom comparison dock visibility.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { University, Course } from '../types/index.ts';
import { mockUniversities, mockCourses } from '../data/mockDatabase.ts';

export const MAX_COMPARE_ITEMS = 4;

const COMPARE_UNI_STORAGE_KEY = 'gees_compare_universities_ids';
const COMPARE_COURSE_STORAGE_KEY = 'gees_compare_courses_ids';
const SAVED_UNI_STORAGE_KEY = 'gees_saved_universities';

interface ComparisonContextType {
  // Universities comparison
  comparedUniIds: string[];
  comparedUniversities: University[];
  isUniversityCompared: (uniId: string) => boolean;
  toggleCompareUniversity: (uniId: string) => boolean;
  addCompareUniversity: (uniId: string) => boolean;
  removeCompareUniversity: (uniId: string) => void;
  clearCompareUniversities: () => void;

  // Programmes / Courses comparison
  comparedCourseIds: string[];
  comparedCourses: Course[];
  isCourseCompared: (courseId: string) => boolean;
  toggleCompareCourse: (courseId: string) => boolean;
  addCompareCourse: (courseId: string) => boolean;
  removeCompareCourse: (courseId: string) => void;
  clearCompareCourses: () => void;

  // Shortlisted / Saved Universities (synced with localStorage)
  savedUniIds: string[];
  savedUniversities: University[];
  isUniversitySaved: (uniId: string) => boolean;
  toggleSaveUniversity: (uniId: string) => boolean;
  clearSavedUniversities: () => void;

  // Bottom dock visibility & feedback toast
  isDockVisible: boolean;
  openDock: () => void;
  hideDock: () => void;
  feedbackMessage: string | null;
  dismissFeedback: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

function readStoredStringArray(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedUniIds, setComparedUniIds] = useState<string[]>(() =>
    readStoredStringArray(COMPARE_UNI_STORAGE_KEY).slice(0, MAX_COMPARE_ITEMS)
  );
  const [comparedCourseIds, setComparedCourseIds] = useState<string[]>(() =>
    readStoredStringArray(COMPARE_COURSE_STORAGE_KEY).slice(0, MAX_COMPARE_ITEMS)
  );
  const [savedUniIds, setSavedUniIds] = useState<string[]>(() =>
    readStoredStringArray(SAVED_UNI_STORAGE_KEY)
  );

  // Dock starts hidden until the user actively clicks Compare
  const [isDockVisible, setIsDockVisible] = useState<boolean>(false);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COMPARE_UNI_STORAGE_KEY, JSON.stringify(comparedUniIds));
      } catch {}
    }
  }, [comparedUniIds]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COMPARE_COURSE_STORAGE_KEY, JSON.stringify(comparedCourseIds));
      } catch {}
    }
  }, [comparedCourseIds]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SAVED_UNI_STORAGE_KEY, JSON.stringify(savedUniIds));
      } catch {}
    }
  }, [savedUniIds]);

  // Auto-dismiss transient feedback toast
  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = setTimeout(() => setFeedbackMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  const showFeedback = useCallback((msg: string) => {
    setFeedbackMessage(msg);
  }, []);

  const dismissFeedback = useCallback(() => {
    setFeedbackMessage(null);
  }, []);

  const openDock = useCallback(() => setIsDockVisible(true), []);
  const hideDock = useCallback(() => setIsDockVisible(false), []);

  // Universities comparison handlers
  const isUniversityCompared = useCallback(
    (uniId: string) => comparedUniIds.includes(uniId),
    [comparedUniIds]
  );

  const addCompareUniversity = useCallback(
    (uniId: string): boolean => {
      if (comparedUniIds.includes(uniId)) {
        setIsDockVisible(true);
        return true;
      }
      if (comparedUniIds.length >= MAX_COMPARE_ITEMS) {
        setIsDockVisible(true);
        showFeedback(`You can compare up to ${MAX_COMPARE_ITEMS} universities at once. Remove one to add another.`);
        return false;
      }
      setComparedUniIds((prev) => (prev.includes(uniId) ? prev : [...prev, uniId]));
      setIsDockVisible(true);
      return true;
    },
    [comparedUniIds, showFeedback]
  );

  const removeCompareUniversity = useCallback(
    (uniId: string) => {
      setComparedUniIds((prev) => {
        const next = prev.filter((id) => id !== uniId);
        if (next.length === 0 && comparedCourseIds.length === 0) {
          setIsDockVisible(false);
        }
        return next;
      });
    },
    [comparedCourseIds.length]
  );

  const toggleCompareUniversity = useCallback(
    (uniId: string): boolean => {
      if (comparedUniIds.includes(uniId)) {
        removeCompareUniversity(uniId);
        return false;
      }
      return addCompareUniversity(uniId);
    },
    [comparedUniIds, removeCompareUniversity, addCompareUniversity]
  );

  const clearCompareUniversities = useCallback(() => {
    setComparedUniIds([]);
    if (comparedCourseIds.length === 0) {
      setIsDockVisible(false);
    }
  }, [comparedCourseIds.length]);

  // Programmes comparison handlers
  const isCourseCompared = useCallback(
    (courseId: string) => comparedCourseIds.includes(courseId),
    [comparedCourseIds]
  );

  const addCompareCourse = useCallback(
    (courseId: string): boolean => {
      if (comparedCourseIds.includes(courseId)) {
        setIsDockVisible(true);
        return true;
      }
      if (comparedCourseIds.length >= MAX_COMPARE_ITEMS) {
        setIsDockVisible(true);
        showFeedback(`You can compare up to ${MAX_COMPARE_ITEMS} programmes at once. Remove one to add another.`);
        return false;
      }
      setComparedCourseIds((prev) => (prev.includes(courseId) ? prev : [...prev, courseId]));
      setIsDockVisible(true);
      return true;
    },
    [comparedCourseIds, showFeedback]
  );

  const removeCompareCourse = useCallback(
    (courseId: string) => {
      setComparedCourseIds((prev) => {
        const next = prev.filter((id) => id !== courseId);
        if (next.length === 0 && comparedUniIds.length === 0) {
          setIsDockVisible(false);
        }
        return next;
      });
    },
    [comparedUniIds.length]
  );

  const toggleCompareCourse = useCallback(
    (courseId: string): boolean => {
      if (comparedCourseIds.includes(courseId)) {
        removeCompareCourse(courseId);
        return false;
      }
      return addCompareCourse(courseId);
    },
    [comparedCourseIds, removeCompareCourse, addCompareCourse]
  );

  const clearCompareCourses = useCallback(() => {
    setComparedCourseIds([]);
    if (comparedUniIds.length === 0) {
      setIsDockVisible(false);
    }
  }, [comparedUniIds.length]);

  // Saved / Shortlisted Universities
  const isUniversitySaved = useCallback(
    (uniId: string) => savedUniIds.includes(uniId),
    [savedUniIds]
  );

  const toggleSaveUniversity = useCallback((uniId: string): boolean => {
    let added = false;
    setSavedUniIds((prev) => {
      if (prev.includes(uniId)) {
        added = false;
        return prev.filter((id) => id !== uniId);
      }
      added = true;
      return [uniId, ...prev];
    });
    return added;
  }, []);

  const clearSavedUniversities = useCallback(() => {
    setSavedUniIds([]);
  }, []);

  // Resolved entity lists preserving selection order
  const comparedUniversities = useMemo(() => {
    const map = new Map(mockUniversities.map((u) => [u.id, u]));
    return comparedUniIds
      .map((id) => map.get(id))
      .filter((u): u is University => Boolean(u));
  }, [comparedUniIds]);

  const comparedCourses = useMemo(() => {
    const map = new Map(mockCourses.map((c) => [c.id, c]));
    return comparedCourseIds
      .map((id) => map.get(id))
      .filter((c): c is Course => Boolean(c));
  }, [comparedCourseIds]);

  const savedUniversities = useMemo(() => {
    const map = new Map(mockUniversities.map((u) => [u.id, u]));
    return savedUniIds
      .map((id) => map.get(id))
      .filter((u): u is University => Boolean(u));
  }, [savedUniIds]);

  return (
    <ComparisonContext.Provider
      value={{
        comparedUniIds,
        comparedUniversities,
        isUniversityCompared,
        toggleCompareUniversity,
        addCompareUniversity,
        removeCompareUniversity,
        clearCompareUniversities,
        comparedCourseIds,
        comparedCourses,
        isCourseCompared,
        toggleCompareCourse,
        addCompareCourse,
        removeCompareCourse,
        clearCompareCourses,
        savedUniIds,
        savedUniversities,
        isUniversitySaved,
        toggleSaveUniversity,
        clearSavedUniversities,
        isDockVisible,
        openDock,
        hideDock,
        feedbackMessage,
        dismissFeedback,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const ctx = useContext(ComparisonContext);
  if (!ctx) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return ctx;
};
