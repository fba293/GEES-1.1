/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Course Wishlist Context & State Manager
 * Provides persistent wishlist storage (localStorage), item management,
 * subtle bounce animation trigger, and temporary feedback toast notifications.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Course } from '../types/index.ts';

export interface WishlistToast {
  id: number;
  message: string;
  courseTitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface WishlistContextType {
  wishlist: Course[];
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (courseId: string) => boolean;
  addToWishlist: (course: Course) => void;
  removeFromWishlist: (courseId: string) => void;
  toggleWishlist: (course: Course) => boolean;
  clearWishlist: () => void;
  toast: WishlistToast | null;
  dismissToast: () => void;
  bouncingCourseId: string | null;
  triggerBounce: (courseId: string) => void;
}

const STORAGE_KEY = 'gees_course_wishlist_items';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Course[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error reading wishlist from localStorage', e);
      }
    }
    return [];
  });

  const [toast, setToast] = useState<WishlistToast | null>(null);
  const [bouncingCourseId, setBouncingCourseId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
      } catch (e) {
        console.error('Error writing wishlist to localStorage', e);
      }
    }
  }, [wishlist]);

  // Toast auto-dismiss timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const triggerBounce = useCallback((courseId: string) => {
    setBouncingCourseId(courseId);
    setTimeout(() => {
      setBouncingCourseId((prev) => (prev === courseId ? null : prev));
    }, 600);
  }, []);

  const isInWishlist = useCallback(
    (courseId: string) => {
      return wishlist.some((c) => c.id === courseId);
    },
    [wishlist]
  );

  const addToWishlist = useCallback(
    (course: Course) => {
      setWishlist((prev) => {
        if (prev.some((c) => c.id === course.id)) return prev;
        return [course, ...prev];
      });
      triggerBounce(course.id);
      setToast({
        id: Date.now(),
        message: 'Added! Course saved to your wishlist',
        courseTitle: course.title,
        actionLabel: 'View Wishlist',
      });
    },
    [triggerBounce]
  );

  const removeFromWishlist = useCallback((courseId: string) => {
    setWishlist((prev) => prev.filter((c) => c.id !== courseId));
    setToast({
      id: Date.now(),
      message: 'Removed from your wishlist',
    });
  }, []);

  const toggleWishlist = useCallback(
    (course: Course): boolean => {
      const exists = wishlist.some((c) => c.id === course.id);
      if (exists) {
        removeFromWishlist(course.id);
        return false;
      } else {
        addToWishlist(course);
        return true;
      }
    },
    [wishlist, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    setToast({
      id: Date.now(),
      message: 'Wishlist cleared',
    });
  }, []);

  const wishlistIds = wishlist.map((c) => c.id);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        wishlistCount: wishlist.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        toast,
        dismissToast,
        bouncingCourseId,
        triggerBounce,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
