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
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = '',
  size = 'md',
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = () => {
    setIsTransitioning(true);
    onToggle();
    setTimeout(() => {
      setIsTransitioning(false);
    }, 480);
  };

  const sizeClasses =
    size === 'sm'
      ? 'w-8.5 h-8.5 sm:w-9 sm:h-9'
      : size === 'lg'
      ? 'w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12'
      : 'w-8.5 h-8.5 xs:w-9 xs:h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11';

  return (
    <button
      type="button"
      data-gees-theme-toggle=""
      data-theme-state={isDark ? 'dark' : 'light'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={handleClick}
      className={`gees-action--theme relative rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/80 flex items-center justify-center text-slate-900 dark:text-[#efc459] hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-[#efc459] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
        isTransitioning ? 'is-theme-transitioning' : ''
      } ${sizeClasses} ${className}`}
    >
      <span className="gees-theme-motion" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          focusable="false"
          className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
        >
          {/* Sun group with center circle and 8 directional rays */}
          <g className="gees-theme-motion__sun">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2.1M12 19.4v2.1M2.5 12h2.1M19.4 12h2.1M5.28 5.28l1.49 1.49M17.23 17.23l1.49 1.49M18.72 5.28l-1.49 1.49M6.77 17.23l-1.49 1.49" />
          </g>

          {/* Crescent Moon path */}
          <g className="gees-theme-motion__moon">
            <path d="M18.8 15.2A7.6 7.6 0 0 1 8.8 5.1a7.7 7.7 0 1 0 10 10.1Z" />
          </g>

          {/* Sparkle/Star accents */}
          <g className="gees-theme-motion__stars">
            <circle cx="18.7" cy="6" r="1" />
            <circle cx="20.1" cy="10" r="0.65" />
          </g>
        </svg>
      </span>
    </button>
  );
};
