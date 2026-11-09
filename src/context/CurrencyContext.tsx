/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Live Multi-Currency Context & Converter (Supports All World Currencies)
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type Currency = string;
export type CurrencyRates = Record<string, number>;

export const FALLBACK_RATES: CurrencyRates = {
  MYR: 1,
  RM: 1,
  BDT: 32,
  USD: 0.256,
  EUR: 0.235,
  GBP: 0.20,
  AUD: 0.39,
  CAD: 0.35,
  SGD: 0.34,
  INR: 18.5,
  AED: 0.94,
  JPY: 38.5,
  CHF: 0.22,
  NZD: 0.42,
  CNY: 1.85,
  HKD: 2.0,
  SEK: 2.7,
  NOK: 2.75,
  KRW: 340,
  THB: 7.8,
  IDR: 3500,
  PHP: 14.5,
  VND: 6300,
  ZAR: 4.6,
  BRL: 1.45,
  MXN: 4.5,
  SAR: 0.96,
  QAR: 0.93,
  KWD: 0.078,
  BHD: 0.096,
  OMR: 0.098,
  JOD: 0.18,
  LKR: 76,
  PKR: 60,
  NPR: 30,
  TWD: 8.2,
  DKK: 1.75,
  PLN: 1.0,
  CZK: 5.8,
  HUF: 95,
  RON: 1.15,
  BGN: 0.46,
  ILS: 0.95,
  CLP: 240,
  COP: 1050,
  PEN: 0.95,
  ARS: 250,
  EGP: 12.5,
  NGN: 380,
  KES: 33,
  GHS: 3.8,
  MAD: 2.5,
  TZS: 650,
  UGX: 950,
  MUR: 11.5,
  UAH: 10.5,
  KZT: 120,
  DZD: 34,
  ETB: 14,
  TND: 0.8,
  GEL: 0.7,
  AMD: 98,
  AZN: 0.44,
  UZS: 3200
};

const STORAGE_KEY = 'gees_preferred_currency';
const API_URL = 'https://open.er-api.com/v6/latest/MYR';

export interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: CurrencyRates;
  isLoading: boolean;
  isLive: boolean;
  lastUpdated: string | null;
  formatAmount: (amountInRM: number, options?: { showCode?: boolean }) => string;
  formatUSD: (amountInUSD: number, options?: { showCode?: boolean }) => string;
  formatPriceString: (priceString?: string | null, fallbackUSD?: number) => string;
  convertFromRM: (amountInRM: number) => number;
  convertFromUSD: (amountInUSD: number) => number;
  getCurrencySymbol: (curr?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function getCurrencySymbol(curr: string = 'MYR'): string {
  const upper = (curr || 'MYR').toUpperCase();
  switch (upper) {
    case 'BDT': return '৳';
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'INR': return '₹';
    case 'JPY':
    case 'CNY': return '¥';
    case 'AUD':
    case 'CAD':
    case 'SGD':
    case 'HKD':
    case 'NZD':
    case 'MXN':
    case 'CLP':
    case 'COP':
    case 'ARS': return '$';
    case 'KRW': return '₩';
    case 'THB': return '฿';
    case 'IDR': return 'Rp';
    case 'PHP': return '₱';
    case 'VND': return '₫';
    case 'ZAR': return 'R';
    case 'BRL': return 'R$';
    case 'ILS': return '₪';
    case 'UAH': return '₴';
    case 'MYR':
    case 'RM': return 'RM ';
    default: return `${upper} `;
  }
}

/**
 * Pure standalone formatAmount helper supporting all world currencies
 */
export function formatAmount(
  amountInRM: number,
  currency: Currency = 'MYR',
  rates: CurrencyRates = FALLBACK_RATES,
  options?: { showCode?: boolean }
): string {
  if (amountInRM === null || amountInRM === undefined || isNaN(amountInRM)) {
    return '—';
  }

  const effectiveRates = rates || FALLBACK_RATES;
  const currUpper = (currency || 'MYR').toUpperCase();
  const normalizedCurr = currUpper === 'RM' ? 'MYR' : currUpper;

  const rate = effectiveRates[normalizedCurr] ?? effectiveRates[currUpper] ?? effectiveRates['USD'] ?? 1;
  const converted = amountInRM * rate;

  let symbol = getCurrencySymbol(normalizedCurr);
  if (options?.showCode) {
    symbol = `${normalizedCurr} `;
  }

  const rounded = Math.round(converted);
  return `${symbol}${rounded.toLocaleString()}`;
}

export interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved.toUpperCase();
      } catch (err) {
        console.warn('[GEES Currency] Unable to read localStorage:', err);
      }
    }
    return 'MYR';
  });

  const [rates, setRates] = useState<CurrencyRates>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const setCurrency = (nextCurrency: Currency) => {
    const upp = (nextCurrency || 'MYR').toUpperCase();
    setCurrencyState(upp);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, upp);
      } catch (err) {
        console.warn('[GEES Currency] Unable to write localStorage:', err);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchRates = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Rates API returned status ${res.status}`);
        }
        const data = await res.json();
        if (isMounted && data && data.rates) {
          const fetchedRates: CurrencyRates = { MYR: 1, RM: 1 };
          for (const [k, v] of Object.entries(data.rates)) {
            if (typeof v === 'number') {
              fetchedRates[k.toUpperCase()] = Number(v.toFixed(4));
            }
          }
          setRates(fetchedRates);
          setIsLive(true);
          setLastUpdated(data.time_last_update_utc || new Date().toISOString());
        }
      } catch (err) {
        console.warn('[GEES Currency] Failed to fetch live rates, using fallback:', err);
        if (isMounted) {
          setRates(FALLBACK_RATES);
          setIsLive(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRates();
    return () => {
      isMounted = false;
    };
  }, []);

  const convertFromRM = (amountInRM: number): number => {
    const rate = rates[currency] ?? rates['USD'] ?? 1;
    return amountInRM * rate;
  };

  const convertFromUSD = (amountInUSD: number): number => {
    const usdRate = rates['USD'] || 0.256;
    const rmEquivalent = amountInUSD / usdRate;
    return convertFromRM(rmEquivalent);
  };

  const formatAmountContext = (amountInRM: number, options?: { showCode?: boolean }): string => {
    return formatAmount(amountInRM, currency, rates, options);
  };

  const formatUSD = (amountInUSD: number, options?: { showCode?: boolean }): string => {
    if (amountInUSD === null || amountInUSD === undefined || isNaN(amountInUSD)) return '—';
    const usdRate = rates['USD'] || 0.256;
    const amountInRM = amountInUSD / usdRate;
    return formatAmount(amountInRM, currency, rates, options);
  };

  const formatPriceString = (priceString?: string | null, fallbackUSD?: number): string => {
    if (!priceString && typeof fallbackUSD === 'number') {
      return `${formatUSD(fallbackUSD)} / yr`;
    }
    if (!priceString) return '—';

    if (typeof fallbackUSD === 'number' && fallbackUSD > 0 && priceString.toLowerCase().includes('/ year')) {
      return `${formatUSD(fallbackUSD)} / year`;
    }

    const isUSD = priceString.includes('$') || priceString.toUpperCase().includes('USD');
    const isRM = priceString.toUpperCase().includes('MYR') || priceString.toUpperCase().includes('RM');

    const suffixMatch = priceString.match(/(\/\s*(?:year|yr|month|semester|week|session))/i);
    const suffix = suffixMatch ? ` ${suffixMatch[0].trim()}` : '';

    const numbers = priceString.match(/[\d,.]+/g);
    if (!numbers || numbers.length === 0) {
      if (typeof fallbackUSD === 'number' && fallbackUSD > 0) {
        return `${formatUSD(fallbackUSD)}${suffix}`;
      }
      return priceString;
    }

    const parsedValues = numbers
      .map(n => parseFloat(n.replace(/,/g, '')))
      .filter(v => !isNaN(v) && v > 0);

    if (parsedValues.length === 0) return priceString;

    const convertedValues = parsedValues.map(val => {
      if (isUSD) {
        const usdRate = rates['USD'] || 0.256;
        const valInRM = val / usdRate;
        return formatAmount(valInRM, currency, rates);
      }
      return formatAmount(val, currency, rates);
    });

    if (convertedValues.length === 1) {
      return `${convertedValues[0]}${suffix}`;
    }
    if (convertedValues.length === 2) {
      return `${convertedValues[0]} - ${convertedValues[1]}${suffix}`;
    }

    return priceString;
  };

  const contextValue = useMemo<CurrencyContextValue>(() => ({
    currency,
    setCurrency,
    rates,
    isLoading,
    isLive,
    lastUpdated,
    formatAmount: formatAmountContext,
    formatUSD,
    formatPriceString,
    convertFromRM,
    convertFromUSD,
    getCurrencySymbol
  }), [currency, rates, isLoading, isLive, lastUpdated]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextValue => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
