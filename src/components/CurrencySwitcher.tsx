/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Multi-Currency Switcher (Supports All World Currencies)
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
  const { currency, setCurrency, isLive } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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
    ? "relative w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fbb034] hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors duration-200 cursor-pointer group"
    : "relative w-10 h-10 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-amber-400 transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 cursor-pointer shadow-xs group";

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Select Currency. Current: ${currency}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={`Current Currency: ${currency}. Click to switch currency.`}
        className={buttonStyleClass}
      >
        <CircularExchangeIcon className="w-4.5 h-4.5 text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-transform duration-500 ease-out group-hover:rotate-180" />
        <span className="absolute -bottom-0.5 -right-0.5 px-1 xs:px-1.5 py-0.2 rounded-full text-[8px] xs:text-[9px] font-black tracking-tight bg-[#fbb034] text-slate-950 shadow-xs ring-1 ring-white dark:ring-slate-900 leading-tight select-none">
          {currency}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn flex flex-col max-h-[420px]">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Select World Currency
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                {isLive ? '● Live FX Rates' : '● Standard FX'}
              </span>
            </div>
            <input
              type="text"
              placeholder="Search currency or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />
          </div>

          <div
            role="listbox"
            className="overflow-y-auto max-h-[300px] p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">No currencies found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = currency === opt.code;
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
                    <div className="flex items-center gap-2.5">
                      <span className="text-base select-none">{opt.flag}</span>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {opt.code} — {opt.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {opt.country} ({opt.symbol})
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
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
  const { currency, setCurrency, isLive } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Select Currency
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                {isLive ? '● Live FX' : '● FX'}
              </span>
            </div>
            <input
              type="text"
              placeholder="Search currency or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                    <div className="flex items-center gap-2.5">
                      <span className="text-base select-none">{opt.flag}</span>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {opt.code} — {opt.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {opt.country} ({opt.symbol})
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
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
