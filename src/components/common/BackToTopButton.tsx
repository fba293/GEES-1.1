/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Floating Circular "Back to Top" Button
 * Displays only while user is actively scrolling up/down and fades away when idle
 */

import React, { useState, useEffect, useRef } from 'react';

export const BackToTopButton: React.FC = () => {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;

      if (scrollY > 400) {
        setIsPastThreshold(true);
        setIsScrolling(true);

        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }

        // Fade away after 2.2 seconds of sitting idle without scrolling
        timeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false);
        }, 2200);
      } else {
        setIsPastThreshold(false);
        setIsScrolling(false);
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isVisible = isPastThreshold && (isScrolling || isHovered);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-20 xs:bottom-22 sm:bottom-24 xl:bottom-8 right-4 sm:right-6 xl:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FBB034] hover:bg-[#f59e0b] text-slate-950 shadow-2xl border-2 border-amber-300 dark:border-amber-400 flex items-center justify-center transition-all duration-500 ease-out transform active:scale-90 hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 select-none ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <span className="material-symbols-outlined text-[24px] font-black">
        arrow_upward
      </span>
    </button>
  );
};

export default BackToTopButton;
