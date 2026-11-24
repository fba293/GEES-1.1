/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Multi-Currency Switcher (Supports All World Currencies)
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  { code: 'MYR', label: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', country: 'Malaysia' },
  { code: 'USD', label: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'United States' },
  { code: 'EUR', label: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'Eurozone' },
  { code: 'GBP', label: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', country: 'United Kingdom' },
  { code: 'BDT', label: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', country: 'Bangladesh' },
  { code: 'INR', label: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', country: 'India' },
  { code: 'AUD', label: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', country: 'Australia' },
  { code: 'CAD', label: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', country: 'Canada' },
  { code: 'SGD', label: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', country: 'Singapore' },
  { code: 'AED', label: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', country: 'United Arab Emirates' },
  { code: 'SAR', label: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: 'QAR', label: 'QAR', name: 'Qatari Riyal', symbol: 'QAR', flag: '🇶🇦', country: 'Qatar' },
  { code: 'KWD', label: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KWD', flag: '🇰🇼', country: 'Kuwait' },
  { code: 'BHD', label: 'BHD', name: 'Bahraini Dinar', symbol: 'BHD', flag: '🇧🇭', country: 'Bahrain' },
  { code: 'OMR', label: 'OMR', name: 'Omani Rial', symbol: 'OMR', flag: '🇴🇲', country: 'Oman' },
  { code: 'JOD', label: 'JOD', name: 'Jordanian Dinar', symbol: 'JOD', flag: '🇯🇴', country: 'Jordan' },
  { code: 'JPY', label: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', country: 'Japan' },
  { code: 'CNY', label: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', country: 'China' },
  { code: 'HKD', label: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', country: 'Hong Kong' },
  { code: 'CHF', label: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', country: 'Switzerland' },
  { code: 'NZD', label: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', country: 'New Zealand' },
  { code: 'SEK', label: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', country: 'Sweden' },
  { code: 'NOK', label: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', country: 'Norway' },
  { code: 'DKK', label: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', country: 'Denmark' },
  { code: 'KRW', label: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', country: 'South Korea' },
  { code: 'THB', label: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', country: 'Thailand' },
  { code: 'IDR', label: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', country: 'Indonesia' },
  { code: 'PHP', label: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', country: 'Philippines' },
  { code: 'VND', label: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', country: 'Vietnam' },
  { code: 'ZAR', label: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', country: 'South Africa' },
  { code: 'BRL', label: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', country: 'Brazil' },
  { code: 'MXN', label: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', country: 'Mexico' },
  { code: 'LKR', label: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰', country: 'Sri Lanka' },
  { code: 'PKR', label: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', flag: '🇵🇰', country: 'Pakistan' },
  { code: 'NPR', label: 'NPR', name: 'Nepalese Rupee', symbol: 'रू', flag: '🇳🇵', country: 'Nepal' },
  { code: 'TWD', label: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', country: 'Taiwan' },
  { code: 'PLN', label: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱', country: 'Poland' },
  { code: 'CZK', label: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', country: 'Czech Republic' },
  { code: 'HUF', label: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', country: 'Hungary' },
  { code: 'RON', label: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴', country: 'Romania' },
  { code: 'ILS', label: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱', country: 'Israel' },
  { code: 'CLP', label: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱', country: 'Chile' },
  { code: 'COP', label: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴', country: 'Colombia' },
  { code: 'PEN', label: 'PEN', name: 'Peruvian Sol', symbol: 'S/.', flag: '🇵🇪', country: 'Peru' },
  { code: 'ARS', label: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷', country: 'Argentina' },
  { code: 'EGP', label: 'EGP', name: 'Egyptian Pound', symbol: '£', flag: '🇪🇬', country: 'Egypt' },
  { code: 'NGN', label: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', country: 'Nigeria' },
  { code: 'KES', label: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', country: 'Kenya' },
  { code: 'GHS', label: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭', country: 'Ghana' },
  { code: 'MAD', label: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', flag: '🇲🇦', country: 'Morocco' },
  { code: 'TZS', label: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', country: 'Tanzania' },
  { code: 'UGX', label: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', country: 'Uganda' },
  { code: 'MUR', label: 'MUR', name: 'Mauritian Rupee', symbol: '₨', flag: '🇲🇺', country: 'Mauritius' },
  { code: 'UAH', label: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦', country: 'Ukraine' },
  { code: 'KZT', label: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', flag: '🇰🇿', country: 'Kazakhstan' },
  { code: 'DZD', label: 'DZD', name: 'Algerian Dinar', symbol: 'DZD', flag: '🇩🇿', country: 'Algeria' },
  { code: 'ETB', label: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹', country: 'Ethiopia' },
  { code: 'TND', label: 'TND', name: 'Tunisian Dinar', symbol: 'TND', flag: '🇹🇳', country: 'Tunisia' },
  { code: 'GEL', label: 'GEL', name: 'Georgian Lari', symbol: '₾', flag: '🇬🇪', country: 'Georgia' },
  { code: 'AMD', label: 'AMD', name: 'Armenian Dram', symbol: '֏', flag: '🇦🇲', country: 'Armenia' },
  { code: 'AZN', label: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', flag: '🇦🇿', country: 'Azerbaijan' },
  { code: 'UZS', label: 'UZS', name: 'Uzbekistani Som', symbol: 'so\'m', flag: '🇺🇿', country: 'Uzbekistan' }
];

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
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <polyline points="3 3 3 8 8 8" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <polyline points="21 21 21 16 16 16" />
    <line x1="12" y1="7.2" x2="12" y2="16.8" />
    <path d="M14.5 9.4a2 2 0 0 0-3.5-1.2A1.9 1.9 0 0 0 10 9.9c0 1.2 1.1 1.7 2 2 .9.3 2 .8 2 2.1 0 1.2-.9 2.1-2 2.1a2.2 2.2 0 0 1-2.2-1.7" />
  </svg>
);

export interface HeaderCurrencyExchangeIconProps {
  className?: string;
  variant?: 'circular' | 'minimal';
  compact?: boolean;
  placement?: string;
}

export const HeaderCurrencyExchangeIcon: React.FC<HeaderCurrencyExchangeIconProps> = ({
  className = '',
  variant = 'circular'
}) => {
  const { currency, setCurrency, isLive, lastUpdated, rates } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { fxDateStr, fxTimeStr } = useMemo(() => {
    if (lastUpdated) {
      try {
        const d = new Date(lastUpdated);
        if (!isNaN(d.getTime())) {
          const dateStr = d.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          const timeStr = d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          return { fxDateStr: dateStr, fxTimeStr: timeStr };
        }
      } catch {
        // fallback
      }
    }
    const now = new Date();
    return {
      fxDateStr: now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      fxTimeStr: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  }, [lastUpdated]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredOptions = CURRENCY_OPTIONS.filter(opt =>
    opt.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const buttonStyleClass = variant === 'minimal'
    ? "relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-2xs cursor-pointer group shrink-0"
    : "relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-amber-400 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 cursor-pointer shadow-2xs group shrink-0";

  return (
    <div ref={containerRef} className={`relative inline-flex items-center shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Select Currency. Current: ${currency}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={`Current Currency: ${currency}. Click to switch currency.`}
        className={buttonStyleClass}
      >
        <CircularExchangeIcon className="w-5.5 h-5.5 text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-transform duration-500 ease-out group-hover:rotate-180" />
        <span className="absolute -bottom-0.5 -right-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-tight bg-[#fbb034] text-slate-950 shadow-xs ring-1 ring-white dark:ring-slate-900 leading-tight select-none">
          {currency}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-x-3 xs:inset-x-4 top-[68px] xs:top-[72px] max-w-[360px] mx-auto z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[min(500px,calc(100vh-84px))] sm:max-h-[420px]">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Select Currency
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isLive ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {isLive ? '● Live Rates' : '● Standard Rates'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close currency selection"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Live FX Rate Date & Last Update Time Banner */}
            <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-[10.5px]">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium min-w-0 flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white animate-pulse shrink-0"></span>
                <span>Date: <strong className="font-bold text-slate-950 dark:text-white">{fxDateStr}</strong></span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>Last updated: <strong className="font-semibold text-slate-800 dark:text-slate-200">{fxTimeStr}</strong></span>
              </div>
              <span className="text-[9px] font-bold text-white dark:text-slate-950 bg-slate-900 dark:bg-white px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                1 MYR Base
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search currency, code or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] transition-all"
                autoFocus
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div
            role="listbox"
            className="overflow-y-auto max-h-[320px] sm:max-h-[300px] p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 overscroll-contain"
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">No currencies found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = currency === opt.code;
                const optRate = rates ? rates[opt.code] : undefined;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setCurrency(opt.code);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base select-none shrink-0">{opt.flag}</span>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {opt.code} — {opt.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="truncate">{opt.country} ({opt.symbol})</span>
                          {optRate !== undefined && (
                            <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                              • 1 MYR = {optRate >= 100 ? Math.round(optRate).toLocaleString() : optRate < 0.01 ? optRate.toFixed(4) : optRate.toFixed(3)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ml-1"></span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SelectCurrencyDropdown: React.FC<HeaderCurrencyExchangeIconProps> = ({
  className = ''
}) => {
  const { currency, setCurrency, isLive, lastUpdated, rates } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { fxDateStr, fxTimeStr } = useMemo(() => {
    if (lastUpdated) {
      try {
        const d = new Date(lastUpdated);
        if (!isNaN(d.getTime())) {
          const dateStr = d.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          const timeStr = d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          return { fxDateStr: dateStr, fxTimeStr: timeStr };
        }
      } catch {
        // fallback
      }
    }
    const now = new Date();
    return {
      fxDateStr: now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      fxTimeStr: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  }, [lastUpdated]);

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

  const filteredOptions = CURRENCY_OPTIONS.filter(opt =>
    opt.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOpt = CURRENCY_OPTIONS.find(o => o.code === currency);
  const displayText = selectedOpt ? `${selectedOpt.code} — ${selectedOpt.name}` : `Select Currency (${currency})`;

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Select Currency"
        aria-expanded={isOpen}
        className="w-full sm:w-auto min-w-[190px] h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer"
      >
        <span className="truncate">{displayText}</span>
        <svg className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 bottom-full mb-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn flex flex-col max-h-[420px]">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Select Currency
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                {isLive ? '● Live Rates' : '● Standard Rates'}
              </span>
            </div>

            {/* Live FX Rate Date & Last Update Time Banner */}
            <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 text-[10px]">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium min-w-0 flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Date: <strong className="font-bold text-slate-900 dark:text-white">{fxDateStr}</strong></span>
                <span className="text-emerald-400 dark:text-emerald-600">•</span>
                <span>Last updated: <strong className="font-semibold text-slate-800 dark:text-slate-200">{fxTimeStr}</strong></span>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-white/80 dark:bg-slate-900/80 px-1 py-0.2 rounded shrink-0">
                1 MYR Base
              </span>
            </div>

            <input
              type="text"
              placeholder="Search currency or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] transition-all"
              autoFocus
            />
          </div>

          <div
            role="listbox"
            className="overflow-y-auto max-h-[260px] p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">No currencies found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = currency === opt.code;
                const optRate = rates ? rates[opt.code] : undefined;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setCurrency(opt.code);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base select-none shrink-0">{opt.flag}</span>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {opt.code} — {opt.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="truncate">{opt.country} ({opt.symbol})</span>
                          {optRate !== undefined && (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                              • 1 MYR = {optRate >= 100 ? Math.round(optRate).toLocaleString() : optRate < 0.01 ? optRate.toFixed(4) : optRate.toFixed(3)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ml-1"></span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderCurrencyExchangeIcon;
