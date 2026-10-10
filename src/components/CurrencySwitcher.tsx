/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Multi-Currency Switcher (RM, BDT, USD)
 * 1. Desktop & Tablet Header: Circular exchange icon (circular arrow loop with currency/dollar symbol)
 * 2. Footer & Mobile Drawer: Outlined rectangular box "Select Currency" with downward chevron (v-icon)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, Currency } from '../context/CurrencyContext.tsx';

export interface CurrencyOption {
  code: Currency;
  label: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    code: 'RM',
    label: 'RM',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    flag: '🇲🇾',
    country: 'Malaysia'
  },
  {
    code: 'BDT',
    label: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: '৳',
    flag: '🇧🇩',
    country: 'Bangladesh'
  },
  {
    code: 'USD',
    label: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    country: 'Global'
  }
];

/**
 * Circular Exchange Icon SVG
 * A circular arrow loop with a dollar/currency symbol in the center.
 */
export const CircularExchangeIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5'
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Top clockwise arrow arc: curves around the top loop */}
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <polyline points="3 3 3 8 8 8" />

    {/* Bottom clockwise arrow arc: curves around the bottom loop */}
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <polyline points="21 21 21 16 16 16" />

    {/* Center Dollar / Currency symbol */}
    <line x1="12" y1="7.2" x2="12" y2="16.8" />
    <path d="M14.5 9.4a2 2 0 0 0-3.5-1.2A1.9 1.9 0 0 0 10 9.9c0 1.2 1.1 1.7 2 2 .9.3 2 .8 2 2.1 0 1.2-.9 2.1-2 2.1a2.2 2.2 0 0 1-2.2-1.7" />
  </svg>
);

/**
 * 1. Desktop & Tablet Header Currency Exchange Icon
 * Hidden on mobile phone viewports (< sm), visible on tablet and desktop.
 */
export interface HeaderCurrencyExchangeIconProps {
  className?: string;
}

export const HeaderCurrencyExchangeIcon: React.FC<HeaderCurrencyExchangeIconProps> = ({
  className = ''
}) => {
  const { currency, setCurrency, rates, isLive } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (code: Currency) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
    >
      {/* Header Circular Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Select Currency. Current: ${currency}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={`Current Currency: ${currency}. Click to switch currency.`}
        className="relative w-8.5 h-8.5 xs:w-9 xs:h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-amber-400 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs group"
      >
        <CircularExchangeIcon className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors" />

        {/* Active Currency Badge Pill */}
        <span
          className="absolute -bottom-1 -right-1 px-1 xs:px-1.5 py-0.2 rounded-full text-[8px] xs:text-[9px] font-black tracking-tight bg-[#fbb034] text-slate-950 shadow-xs ring-1 ring-white dark:ring-slate-900 leading-tight select-none"
          title={`Active currency: ${currency}`}
        >
          {currency}
        </span>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Currency options"
          className="absolute top-[calc(100%+8px)] right-0 w-64 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right ring-1 ring-black/5 dark:ring-white/10"
        >
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Select Currency
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isLive ? 'Live Rates' : 'Standard Rates'}</span>
            </span>
          </div>

          <div className="space-y-1">
            {CURRENCY_OPTIONS.map((item) => {
              const isSelected = currency === item.code;
              return (
                <button
                  key={item.code}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 text-slate-950 dark:text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none leading-none">{item.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5 leading-tight">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.code}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                          ({item.symbol})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400 leading-tight">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.code === 'BDT' && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                        ≈{rates.BDT}৳
                      </span>
                    )}
                    {item.code === 'USD' && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                        ≈${rates.USD}
                      </span>
                    )}
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-[#fbb034] font-bold">
                        check
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Rate Info Footer */}
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 px-2 py-1 text-[10px] text-slate-400 dark:text-slate-400 text-center">
            1 RM ≈ {rates.BDT} BDT • $ {rates.USD} USD
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 2. Footer & Mobile Drawer "Select Currency" Dropdown
 * Clean outlined rectangular box with rounded corners containing:
 * - "Select Currency" text on the left
 * - Downward chevron arrow (v-icon) on the right
 */
export interface SelectCurrencyDropdownProps {
  className?: string;
  placement?: 'bottom' | 'top';
  compact?: boolean;
}

export const SelectCurrencyDropdown: React.FC<SelectCurrencyDropdownProps> = ({
  className = '',
  placement = 'bottom',
  compact = false
}) => {
  const { currency, setCurrency, rates, isLive } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (code: Currency) => {
    setCurrency(code);
    setIsOpen(false);
  };

  const selectedItem = CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Clean Button - Compact (Short & Themed) or Standard */}
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={`Select Currency: currently ${currency}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          title={`Currency: ${selectedItem.name} (${selectedItem.code})`}
          className={`inline-flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200/90 dark:border-slate-700/80 bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-200 transition-colors duration-150 cursor-pointer select-none text-left h-8 text-xs font-medium ${
            isOpen ? 'border-slate-400 dark:border-slate-500 ring-1 ring-slate-300 dark:ring-slate-700' : ''
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm select-none leading-none">{selectedItem.flag}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {selectedItem.code}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ({selectedItem.symbol})
            </span>
          </div>

          <svg
            className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ease-out shrink-0 ${
              isOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={`Select Currency: currently ${currency}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 transition-all duration-200 cursor-pointer select-none text-left min-h-[42px] ${
            isOpen ? 'border-slate-400 dark:border-slate-500 ring-1 ring-slate-300 dark:ring-slate-700' : ''
          }`}
        >
          {/* Left Side: "Select Currency" Text with Active Currency Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              Select Currency
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-black bg-[#fbb034] text-slate-950 shrink-0 shadow-2xs">
              <span>{selectedItem.flag}</span>
              <span>{selectedItem.code}</span>
            </span>
          </div>

          {/* Right Side: Downward Chevron Arrow (v-icon) */}
          <div className="flex items-center shrink-0">
            <svg
              className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ease-out ${
                isOpen ? 'rotate-180 text-blue-600 dark:text-amber-400' : ''
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select currency options"
          className={`absolute ${
            compact ? 'right-0 sm:right-auto sm:left-0' : 'left-0 right-0 sm:right-auto'
          } sm:w-64 w-60 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in duration-150 ring-1 ring-black/5 dark:ring-white/10 ${
            placement === 'top'
              ? 'bottom-[calc(100%+6px)] origin-bottom'
              : 'top-[calc(100%+6px)] origin-top'
          }`}
        >
          <div className="flex items-center justify-between px-2.5 py-1 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Currencies
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isLive ? 'Live Rates' : 'Standard Rates'}</span>
            </span>
          </div>

          <div className="space-y-1">
            {CURRENCY_OPTIONS.map((item) => {
              const isSelected = currency === item.code;
              return (
                <button
                  key={item.code}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 text-slate-950 dark:text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none leading-none">{item.flag}</span>
                    <div>
                      <div className="flex items-center gap-1 leading-tight">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.code}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                          ({item.symbol})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400 leading-tight">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.code === 'RM' && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                        Base
                      </span>
                    )}
                    {item.code === 'BDT' && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                        ≈{rates.BDT}৳
                      </span>
                    )}
                    {item.code === 'USD' && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                        ≈${rates.USD}
                      </span>
                    )}
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-[#fbb034] font-bold">
                        check
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Rate Info Footer */}
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 px-2 py-1 text-[10px] text-slate-400 dark:text-slate-400 text-center">
            1 RM ≈ {rates.BDT} BDT • $ {rates.USD} USD
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Default Export: CurrencySwitcher
 * Adapts to variant prop:
 * - variant="header-icon": renders HeaderCurrencyExchangeIcon
 * - variant="dropdown": renders SelectCurrencyDropdown
 * - default: renders SelectCurrencyDropdown for general use
 */
export interface CurrencySwitcherProps {
  className?: string;
  compact?: boolean;
  variant?: 'header-icon' | 'dropdown';
  placement?: 'bottom' | 'top';
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  className = '',
  variant,
  placement = 'bottom'
}) => {
  if (variant === 'header-icon') {
    return <HeaderCurrencyExchangeIcon className={className} />;
  }

  return <SelectCurrencyDropdown className={className} placement={placement} />;
};

export default CurrencySwitcher;
