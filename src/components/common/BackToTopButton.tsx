/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mobile-Only Floating Circular "Back to Top" Button
 */

import React, { useState, useEffect } from 'react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Appears after scrolling past hero section (~450px)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="sm:hidden fixed bottom-6 right-5 z-40 w-12 h-12 rounded-full bg-[#FBB034] text-slate-950 shadow-2xl border-2 border-amber-300 dark:border-amber-400 flex items-center justify-center transition-all duration-300 transform active:scale-90 hover:scale-105 animate-fadeIn"
    >
      <span className="material-symbols-outlined text-[24px] font-black">
        arrow_upward
      </span>
    </button>
  );
};

export default BackToTopButton;
