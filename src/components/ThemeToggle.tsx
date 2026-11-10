/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Theme Toggle Component
 * Exact sun/moon motion icon, styling, and smooth transition animation
 * matching production globaleducationexpert.com
 */

import React, { useState } from 'react';

export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circular' | 'minimal';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = '',
  size = 'md',
  variant = 'circular',
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = () => {
    setIsTransitioning(true);
    onToggle();
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : size === 'lg'
      ? 'w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12'
      : 'w-10 h-10 sm:w-10 sm:h-10 lg:w-11 lg:h-11';

  const buttonStyleClass = variant === 'minimal'
    ? `gees-action--theme group relative w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-[#fbb034] shrink-0 ${className}`
    : `gees-action--theme group relative rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
        isDark
          ? 'bg-slate-900 text-[#fbb034]'
          : 'bg-white text-slate-900 shadow-xs'
      } ${isTransitioning ? 'is-theme-transitioning' : ''} ${sizeClasses} ${className}`;

  return (
    <button
      type="button"
      data-gees-theme-toggle=""
      data-theme-state={isDark ? 'dark' : 'light'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={handleClick}
      className={buttonStyleClass}
    >
      <span className="relative w-[18px] h-[18px] flex items-center justify-center pointer-events-none" aria-hidden="true">
        {/* Sun Icon (Screenshot 1 - Dark Navy Sun with Solid Center & 8 Radial Dashes) */}
        <svg
          viewBox="0 0 24 24"
          focusable="false"
          className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out ${
            !isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
          }`}
        >
          <circle cx="12" cy="12" r="4.2" fill="#0B1329" />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M4.2 12H2M22 12h-2.2M5.64 5.64l1.55 1.55M16.81 16.81l1.55 1.55M5.64 18.36l1.55-1.55M16.81 7.19l1.55-1.55"
            stroke="#0B1329"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>

        {/* Crescent Moon Icon (Screenshot 2 - Golden Crescent Moon with 2 Star Dots) */}
        <svg
          viewBox="0 0 24 24"
          focusable="false"
          className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-50 pointer-events-none'
          }`}
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="#fbb034"
          />
          <circle cx="17.8" cy="5.2" r="1.15" fill="#fbb034" />
          <circle cx="19.8" cy="9.2" r="0.85" fill="#fbb034" />
        </svg>
      </span>
    </button>
  );
};

