/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Live Multi-Currency Context & Converter (RM, BDT, USD)
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type Currency = 'RM' | 'BDT' | 'USD';

export interface CurrencyRates {
  RM: number; // 1 RM = 1
  BDT: number; // 1 RM = 32 BDT (fallback)
  USD: number; // 1 RM = 0.256 USD (fallback derived from 1 USD = 125 BDT & 1 RM = 32 BDT)
}

export const FALLBACK_RATES: CurrencyRates = {
  RM: 1,
  BDT: 32,
  USD: 0.256
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

/**
 * Pure standalone formatAmount helper as required
 */
export function formatAmount(
  amountInRM: number,
  currency: Currency = 'RM',
  rates: CurrencyRates = FALLBACK_RATES,
  options?: { showCode?: boolean }
): string {
  if (amountInRM === null || amountInRM === undefined || isNaN(amountInRM)) {
    return '—';
  }

  const effectiveRates = rates || FALLBACK_RATES;
  let converted = amountInRM;
  let prefix = 'RM ';

  if (currency === 'BDT') {
    converted = amountInRM * (effectiveRates.BDT || 32);
    prefix = options?.showCode ? 'BDT ' : '৳';
  } else if (currency === 'USD') {
    converted = amountInRM * (effectiveRates.USD || 0.256);
    prefix = '$';
  } else {
    converted = amountInRM;
    prefix = 'RM ';
  }

  const rounded = Math.round(converted);
  return `${prefix}${rounded.toLocaleString()}${currency === 'USD' && options?.showCode ? ' USD' : ''}`;
}

export interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  // Persist currency selection in localStorage under 'gees_preferred_currency'
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
        if (saved && (saved === 'RM' || saved === 'BDT' || saved === 'USD')) {
          return saved;
        }
      } catch (err) {
        console.warn('[GEES Currency] Unable to read localStorage:', err);
      }
    }
    return 'RM';
  });

  const [rates, setRates] = useState<CurrencyRates>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Set currency and persist
  const setCurrency = (nextCurrency: Currency) => {
    setCurrencyState(nextCurrency);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, nextCurrency);
      } catch (err) {
        console.warn('[GEES Currency] Unable to write localStorage:', err);
      }
    }
  };

  // Fetch live exchange rates on mount from open.er-api.com
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
          const liveBDT = typeof data.rates.BDT === 'number' ? data.rates.BDT : FALLBACK_RATES.BDT;
          const liveUSD = typeof data.rates.USD === 'number' ? data.rates.USD : FALLBACK_RATES.USD;

          setRates({
            RM: 1,
            BDT: Number(liveBDT.toFixed(4)),
            USD: Number(liveUSD.toFixed(4))
          });
          setIsLive(true);
          setLastUpdated(data.time_last_update_utc || new Date().toISOString());
        }
      } catch (err) {
        console.warn('[GEES Currency] Failed to fetch live exchange rates, using fallback (1 RM = 32 BDT, 1 RM = 0.256 USD):', err);
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

  // Symbol helper
  const getCurrencySymbol = (curr: Currency = currency): string => {
    switch (curr) {
      case 'BDT':
        return '৳';
      case 'USD':
        return '$';
      case 'RM':
      default:
        return 'RM ';
    }
  };

  // Convert pure amounts
  const convertFromRM = (amountInRM: number): number => {
    if (currency === 'BDT') return amountInRM * rates.BDT;
    if (currency === 'USD') return amountInRM * rates.USD;
    return amountInRM;
  };

  const convertFromUSD = (amountInUSD: number): number => {
    const rmEquivalent = amountInUSD / (rates.USD || 0.256);
    return convertFromRM(rmEquivalent);
  };

  // Context-bound formatters
  const formatAmountContext = (amountInRM: number, options?: { showCode?: boolean }): string => {
    return formatAmount(amountInRM, currency, rates, options);
  };

  const formatUSD = (amountInUSD: number, options?: { showCode?: boolean }): string => {
    if (amountInUSD === null || amountInUSD === undefined || isNaN(amountInUSD)) return '—';
    const amountInRM = amountInUSD / (rates.USD || 0.256);
    return formatAmount(amountInRM, currency, rates, options);
  };

  /**
   * Intelligently format text containing price strings like:
   * "MYR 35,000 / year", "$8,000 / yr", "MYR 400 - 600 / month", "$4,000 - $12,000 / year"
   */
  const formatPriceString = (priceString?: string | null, fallbackUSD?: number): string => {
    if (!priceString && typeof fallbackUSD === 'number') {
      return `${formatUSD(fallbackUSD)} / yr`;
    }
    if (!priceString) return '—';

    // If fallback USD is provided and matches the annual fee pattern
    if (typeof fallbackUSD === 'number' && fallbackUSD > 0 && priceString.toLowerCase().includes('/ year')) {
      return `${formatUSD(fallbackUSD)} / year`;
    }

    // Try detecting currency and numbers
    const isUSD = priceString.includes('$') || priceString.toUpperCase().includes('USD');
    const isRM = priceString.toUpperCase().includes('MYR') || priceString.toUpperCase().includes('RM');

    // Extract suffix like "/ year", "/ month", "/ semester", etc.
    const suffixMatch = priceString.match(/(\/\s*(?:year|yr|month|semester|week|session))/i);
    const suffix = suffixMatch ? ` ${suffixMatch[0].trim()}` : '';

    // Extract all numbers inside the string
    const numbers = priceString.match(/[\d,.]+/g);
    if (!numbers || numbers.length === 0) {
      if (typeof fallbackUSD === 'number' && fallbackUSD > 0) {
        return `${formatUSD(fallbackUSD)}${suffix}`;
      }
      return priceString;
    }

    // Parse each numeric value
    const parsedValues = numbers
      .map(n => parseFloat(n.replace(/,/g, '')))
      .filter(v => !isNaN(v) && v > 0);

    if (parsedValues.length === 0) return priceString;

    // Convert each value based on detected source currency
    const convertedValues = parsedValues.map(val => {
      if (isUSD) {
        const valInRM = val / (rates.USD || 0.256);
        return formatAmount(valInRM, currency, rates);
      }
      if (isRM) {
        return formatAmount(val, currency, rates);
      }
      // Default to RM if unknown
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
